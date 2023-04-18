#!/usr/bin/env python3
# Author: Shi Tong Chin, Earth Observatory of Singapore
# THIS SCRIPT REPLACES THE KMZ TILES WITH TMS STYLE ONES, AND UNPACKS, UPLOADS THE RFP GEOJSON

from __future__ import absolute_import
from builtins import range
import os
import glob
import argparse
import json
from utilities.util_methods import runCmd, create_mask, get_bounding_polygon, gdal_warp_stitch, gtfwrt, \
    create_xml_metadata, tif2shpzip, polyshp2kml, getFootprintShp, checkProjectionWGS84, filter_glob
import numpy as np
from osgeo import gdal, osr, ogr
import urllib.parse
import re, shutil
import datetime
import subprocess as sp
import gdalconst
import boto3
import requests
import dateparser
import calendar
import re

KMLDIR = "final_kml"
'''
How to use this:

1. To create stitched geocoded files from individual geocoded files:
    - NOT ALLOWED FOR: non geocoded files like png
    - OUTPUT will be final_merged.tif

    e.g: 
    To stitch all bursts of FPM tifs:
        ./script/merge_anything.py -i "./S1-FPM*TN041*/N*0.2_fpm.tif" -e "./S1-FPM*/*fn*" -s

    To stitch all subswaths of LOGR tifs:
        ./script/merge_anything.py -i "./S1-FPM*/*fn*logra2a1.tif" -s

    To stitch all subswaths of ALOS-2 amp tifs:
        ./script/merge_anything.py -i "IMG*HH*.tif" -s

2. To apply water body mask on any geocoded files:
   - NOT ALLOWED FOR: non geocoded files like png
   - OUTPUT will be <filename>_wbd.tif (for the masked data) and <filename>_wbdmsk.tif (for the binary mask)

   e.g:
   To mask waterbody on final_merged.tif
       ./script/merge_anything.py -i "./final_merged.tif" -w

3. To create radar footprint  polygons from individual geocoded files:
    - ALLOWED FOR: tifs/vrt with all radar footprint pixels filled with non-zeros can be used for this. 
          E.g. logr*geo.vrt, amp*geo.vrt, IMG**.tif, *_msk.tif
    - NOT ALLOWED FOR:  waterbody masks / fpm tifs.
    - OUTPUT will be in final_kml folder
    - OPTION -r1 is for computation via convex-hull method (slower, deprecating)
    - OPTION -r2 is for processing via gdal_polgonize (faster)

    e.g:
    To create a merged footprint of ALOS-2 HH SLCs
        ./script/merge_anything.py -i "IMG*HH*.tif" -r2  

    To create a merged footprint of Sentinel-1 burstwise
       ./script/merge_anything.py  -i "./S1-FPM*TN041*/N*fn*0.2_msk.tif" -e "./S1-FPM*/*fn*" -r2

    To create a merged footprint of Sentinel-1 sub-swath wise
        ./script/merge_anything.py  -i "./S1-FPM*TN041*/N*fn*0.2_msk.tif" -r2


4. To create kml-tiles from geocoded files:

    - ALLOWED FOR: all geocoded files 
    - NOT ALLOWED FOR: non geocoded files like png
    - OUTPUT will be in final_kml folder

    e.g:
    To create a KML across all FPM tifs with defaults of s3-hosted url (aria-sg-products bucket):
    (This needs AWSCLI and s3 bucket credentials!)
        ./script/merge_anything.py -i "fpm_3100.tf,fpm_3150.tif" -k -kn "EOS-ARIA-XX" 
        OR
        ./script/merge_anything.py -i "fpm_3100.tf,fpm_3150.tif" -k -kn "EOS-ARIA-XX" -kz 6-13 -ku "http://aria-sg-products.s3-website-ap-southeast-1.amazonaws.com/tiles/" -ku_options type=s3


    To create a KML across all FPM tifs with another webdav hosted url:
    (This needs only curl)

        ./script/merge_anything.py -i fpm_3100.tif -k -kn "EOS-ARIA-XX" -kz 6-13 -ku "https://172.21.25.249/tiles" -ku_options type=dav,u=user,p=123456

5. To create shape files from FPM geotiffs:
    - ALLOWED FOR: all geocoded files
    - MEANT FOR: geocoded FPM file (preferably on one stitched FPM file)
    - NOT TESTED FOR: other fully filled geocoded files
    - OUTPUT will be <filename>_shp.zip

   e.g:
   To create shape file of FPM pixels on final_merged.tif
       ./script/merge_anything.py -i "./final_merged.tif" -p
'''


def cmdLineParse():
    '''
    Command line parser.
    '''

    parser = argparse.ArgumentParser(
        description='For merging any geocoded file. Makes a footprint if -kml selected. Download S1-FPM/S1-LAR folders of interest and run this script.')
    parser.add_argument('-i', dest='include', type=str, default='S1-FPM*/*msk.tif',
                        help='list of globs to include for merge, comma-seperated')
    parser.add_argument('-e', dest='exclude', type=str, default='',
                        help='list of globs to exclude for merge, comma-seperated')
    parser.add_argument('-s', action='store_true', default=False,
                        dest='stitchonly', help='Do the stitch only')
    parser.add_argument('-w', dest='wmaskonly', action='store_true', default=False,
                        help='Apply water body mask to input geocoded files')
    parser.add_argument('-wu', dest='water_mask_url', type=str,
                        default='http://ntu-hysds-dataset-hysds3.s3-website-ap-southeast-1.amazonaws.com/datasets/dem/usgs_mirror/SRTMSWBD.003/2000.02.11/',
                        help='URL to get WBD mask data. Only to be used with -w option')
    parser.add_argument('-r1', action='store_true', default=False,
                        dest='rfp1', help='Make the radar footprint kml with convex hull option')
    parser.add_argument('-r2', action='store_true', default=False,
                        dest='rfp2', help='Make the radar footprint kml with gdal_polygonize option')
    parser.add_argument('-r3', action='store_true', default=False,
                        dest='rfp3', help='Make the radar footprint kml with stitch + gdal_polygonize option')
    parser.add_argument('-k', action='store_true', default=False,
                        dest='create_kml_tiles', help='Make the tiles kml only')
    parser.add_argument('-kn', dest='kml_name', type=str, default='EOS-ARIA',
                        help='Name of KML folder. Only to be used with -k option')
    parser.add_argument('-ku', dest='kml_tile_url', type=str,
                        default='http://aria-sg-products.s3-website-ap-southeast-1.amazonaws.com/tiles/TMS/',
                        help='URL where tiles will be posted.  Only to be used with -k option')
    parser.add_argument('-ku_options', dest='kml_tile_url_options', type=str,
                        default='type=s3',
                        help='Options to describe server where kmz url is hosted.  Only to be used with -ku option. format: "type=<s3|dav>,u=<dav_username>,p=<dav_password>,co=<curl_options>')
    parser.add_argument('-ku_no_upload', action='store_true', default=False,
                        dest='no_upload',
                        help='Only to be used with ku, states that user does not want script to auto upload tiles to url')
    parser.add_argument('-kz', dest='kml_zoom', type=str, default='6-13',
                        help='Zoom levels for tiles int the format minZoom-maxZoom')
    parser.add_argument('-p', dest='shape', action='store_true', default=False,
                        help='Make shape file from polygonizing FPM geotiffs')

    return parser.parse_args()


def kmzwrt_gdal2tiles(geotiff, zoom, out_dir, url=None):
    data = gdal.Open(geotiff)
    tmp_file = "tmp.tif"
    if data.GetRasterBand(1).GetColorInterpretation() == gdalconst.GCI_PaletteIndex:
        sp.check_call("pct2rgb.py -of GTiff -rgba \"{}\" \"{}\"".format(geotiff, tmp_file), shell=True)
    else:
        sp.check_call("ln -s \"{}\" \"{}\"".format(geotiff, tmp_file), shell=True)

    if url:
        runCmd('gdal2tiles.py  -d -k -v -t "{}" -z {} -u {} "{}" "{}"'.format(os.path.basename(geotiff), zoom, url,
                                                                              tmp_file, out_dir))
        # runCmd('gdal2tiles.py -p geodetic -d -k -t "{}" -z {} -u {} "{}" "{}"'.format(os.path.basename(geotiff), zoom, url,tmp_file, out_dir))

    else:
        runCmd(
            'gdal2tiles.py -d -k -v -t "{}" -z {} "{}" "{}"'.format(os.path.basename(geotiff), zoom, tmp_file, out_dir))
        # runCmd('gdal2tiles.py -p geodetic -d -k -t "{}" -z {} -u {} "{}" "{}"'.format(os.path.basename(geotiff), zoom, url,tmp_file, out_dir))

    os.remove(tmp_file)




def parseDate(title):

    formatted_date = ""
    date1_result = re.search(".*,\s(\d{1,2}\s.*\s\d{4}).*", title)
    # import pdb; pdb.set_trace()
    if date1_result:
        # 1 Jun 2023
        date_str=date1_result.group(1)
        date = dateparser.parse(date_str)
        formatted_date = date.strftime("%Y-%m-%d")
    else:
        # Jun 2023
        date2_result = re.search(".*,\s(.*\s\d{4}).*", title)
        if date2_result:
            date_str = date2_result.group(1)
            date = dateparser.parse(date_str)
            formatted_date = date.strftime("%Y-%m")

    return formatted_date


def get_radar_footprint(doc_kml):
    # extract radar footprint geojson
    driver_kml = ogr.GetDriverByName('KML')
    driver_json = ogr.GetDriverByName('GeoJSON')
    dataSource = driver_kml.Open(doc_kml)
    print(f"Number of layers: {dataSource.GetLayerCount()}")
    layer = dataSource.GetLayer()
    sr = layer.GetSpatialRef()
    new_feat = ogr.Feature(layer.GetLayerDefn())  # Dummy feature
    feature_dict = {}

    for id, feat in enumerate(layer):
        name = dataSource.GetLayerByIndex(id).GetName()
        print(f"processing feature for {name}")
        rfp_file= f"rfp_{name}.json"
        new_ds = driver_json.CreateDataSource(rfp_file)
        new_lyr = new_ds.CreateLayer('{}'.format(id), sr,ogr.wkbPolygon)  # You have to specify the geometry type the layer will contain here with an ogr constant. I assume it is polygon but it can be changed.
        geom = feat.geometry().Clone()
        new_feat.SetGeometry(geom)
        new_lyr.CreateFeature(new_feat)
        del new_ds, new_lyr # SAVES THE FILE
        with open(rfp_file) as f:
            geo_json = json.load(f)
            feature_dict.update({rfp_file:geo_json})
    return feature_dict


def get_bbox(prod_list):
    min_lat = 90.0
    max_lat = -90.0
    min_lon = 180.0
    max_lon = -180.0
    for product in prod_list:
        geometry = product['prod_rfp_geojson']['features'][0]['geometry']
        poly_list = geometry['coordinates']

        if geometry['type'] == 'MultiPolygon':
            for poly in poly_list:
                for subpoly in poly:
                    for coord in subpoly:
                        lon, lat, h = coord
                        max_lon = lon if lon > max_lon else max_lon
                        min_lon = lon if lon < min_lon else min_lon
                        max_lat = lat if lat > max_lat else max_lat
                        min_lat = lat if lat < min_lat else min_lat
        else:
            for poly in poly_list:
                for coord in poly:
                    lon, lat, h = coord
                    max_lon = lon if lon > max_lon else max_lon
                    min_lon = lon if lon < min_lon else min_lon
                    max_lat = lat if lat > max_lat else max_lat
                    min_lat = lat if lat < min_lat else min_lat

    bbox = [[min_lat, min_lon], [max_lat, max_lon]]
    return bbox


if __name__ == '__main__':
    inps = cmdLineParse()
    bucket = 'eos-rs-products'
    # Make sure you provide / in the end
    prefix = 'EOS-RS_2023'
    static_url = 'https://eos-rs-products.earthobservatory.sg/'
    client = boto3.client('s3')
    result_folder = client.list_objects(Bucket=bucket, Prefix=prefix, Delimiter='/')
    metadata_list=[]

    for o in result_folder.get('CommonPrefixes'):
        response_folder = o.get('Prefix')
        this_event_md = {"event_name": response_folder.split("/")[0],
                         "event_url": os.path.join(static_url, response_folder),
                         "event_start": '',
                         "event_end": '',
                         "event_bbox": '',
                         "product_list": []}

        print(f"sub folder :  {response_folder}")
        result_files = client.list_objects(Bucket=bucket, Prefix=response_folder)

        for file in result_files.get('Contents'):
            filepath = file['Key']
            print(filepath)
            kmz_file = os.path.basename(filepath)
            filename_base = os.path.splitext(kmz_file)[0]
            if filepath.endswith('.kmz'):
                this_product_md = {"prod_name": filename_base,
                                   "prod_title": '',
                                   "prod_desc": '',
                                   "prod_rfp_file": '',
                                   "prod_rfp_geojson": '',
                                   "prod_tiles": '',
                                   "prod_date": ''}
                client.download_file(bucket, filepath, kmz_file)

                # unzip kmz
                runCmd(f'unzip "{kmz_file}"')
                file_kml = os.path.join(os.getcwd(), 'doc.kml')

                # find the tiles url and get the radarfootprint?
                try:
                    feat_dict = get_radar_footprint(file_kml)
                except:
                    print(f"KML ISSUE FOR: {kmz_file}")
                    continue

                for rfp_filename, geojson in feat_dict.items():
                    this_product_md.update({"prod_rfp_geojson": geojson})
                    with open(file_kml, 'r') as content_file:
                        content_orig = content_file.read()
                        http_result = re.search("\<href\>(http.*\/)[\d]*\/[\d]*\/.*.kml\<\/href\>", content_orig)
                    if http_result:
                        real_url = http_result.group(1)
                        this_product_md.update({"prod_tiles": real_url})
                        s3_result = re.search('http\:\/\/(.*)\.s3.*com\/(.*)', real_url)
                        s3_url = "s3://" + s3_result.group(1) + "/" + s3_result.group(2)
                        runCmd(f"aws s3 cp '{rfp_filename}' '{s3_url}'")
                        this_product_md.update({"prod_rfp_file": os.path.join(real_url,rfp_filename)})

                runCmd(f"rm -rf doc.kml files rfp_*.json {kmz_file}")

                # get text file
                text_url = os.path.join(static_url, filepath.replace("kmz", "txt"))
                r = requests.get(text_url)
                if r.status_code == 200:
                    text_str_list = r.text.split("\n")

                    if len(text_str_list)>1:
                        this_product_md.update({"prod_title": text_str_list[0]})
                        this_product_md.update({"prod_desc": "\n".join(text_str_list[2:])})

                if this_product_md['prod_title']:
                    print(this_product_md['prod_title'])
                    prod_date = parseDate(this_product_md['prod_title'])
                    this_product_md.update({"prod_date": prod_date})

                this_event_md["product_list"].append(this_product_md)

            #create event bbox
            max_date = datetime.datetime(1970, 1, 1)
            min_date = datetime.datetime(2050, 1, 1)

            is_ym_only = False

            for prod in this_event_md["product_list"]:
                # find min and max date
                if bool(re.match(r'^\d{4}-\d{2}?$', prod["prod_date"])):
                    is_ym_only = True
                prod_event_date = dateparser.parse(prod['prod_date'])
                if prod_event_date:
                    max_date = prod_event_date if prod_event_date > max_date else max_date
                    min_date = prod_event_date if prod_event_date < min_date else min_date

            datestr_format = "%Y-%m" if is_ym_only else "%Y-%m-%d"
            this_event_md.update({"event_start": min_date.strftime(datestr_format)})
            this_event_md.update({"event_end": min_date.strftime(datestr_format)})

            event_bbox = get_bbox(this_event_md['product_list'])
            this_event_md.update({"event_bbox": event_bbox})


        metadata_list.append(this_event_md)
        print(json.dumps(metadata_list, indent=2))

    metadata_file = "metadata.json"

    with open(metadata_file, "w") as final:
        json.dump(metadata_list, final, indent=2)

    runCmd(f"aws s3 cp {metadata_file} s3://aria-sg-products/")
    runCmd(f"rm -rf *.kmz")










                # download it and read doc.kml to extract tile link
                # create rfp and rfp link







    # BASED ON GLOB SEARCH THROUGH EOS_RS folders
    # Grabs KMZ TXT, populate with metadata  (Title, AOI, Date, Text Description, prod link, tile link, aoi/rfp link, merge all the rfps for bigger bbox)


    # Event Title, Event-date range, event-bbox: sub-prods --> {titke, aoi, date, text, prod_link, tile_link, rfp_link}
    #
    # files_final = filter_glob(inps.include, inps.exclude)
    # for file_tif in files_final:
    #     file_orig_kmz = os.path.splitext(file_tif)[0] + ".kmz"
    #     if os.path.exists(file_orig_kmz):
    #         # check tif projection
    #         file = checkProjectionWGS84(file_tif)
    #         basename = os.path.basename(os.path.splitext(file)[0])
    #         kml_name = "{}_{}".format(inps.kml_name, datetime.datetime.utcnow().strftime("%Y%m%d_%H%M%S"))
    #
    #         real_url = os.path.join(inps.kml_tile_url, kml_name)
    #         print("kml_tile_url is set as: %s" % real_url)
    #
    #         # run gdal2tiles command
    #         # write tiles and upload them
    #         kml_dir = os.path.abspath("./{}".format(KMLDIR))
    #         tile_dir = os.path.abspath("./{}/{}".format(KMLDIR, kml_name))
    #         if not os.path.exists(tile_dir):
    #             os.makedirs(tile_dir)
    #
    #         outdir = os.path.join(tile_dir, basename)
    #         print(outdir)
    #
    #         kmzwrt_gdal2tiles(file, inps.kml_zoom, outdir, real_url)
    #         file_tmpkml_new = os.path.join(outdir, "doc.kml")
    #
    #         docstr_new = ""
    #         with open(file_tmpkml_new, 'r') as content_file:
    #             content = content_file.read()
    #         result = re.search('\<Document\>(.*)\<\/Document\>', content, re.MULTILINE | re.DOTALL)
    #         if result:
    #             docstr_new += result.group(0)
    #
    #         # unzip kmz and
    #         runCmd(f'unzip "{file_orig_kmz}"')
    #         file_orig_kml = os.path.join(os.getcwd(),'doc.kml')
    #
    #         # replace docstr of orig with new
    #         docstr_orig = ""
    #         with open(file_orig_kml, 'r') as content_file:
    #             content_orig = content_file.read()
    #             result = re.search('\<Document\>(.*)\<\/Document\>', content_orig, re.MULTILINE | re.DOTALL)
    #         if result:
    #             docstr_orig += result.group(0)
    #
    #
    #         print(f"replacing {docstr_orig} \r\n with {docstr_new}")
    #         # replace orig with new string
    #         final_doc_kml_content = content_orig.replace(docstr_orig,docstr_new)
    #         print(f"new kml: \r\n: {final_doc_kml_content}")
    #         # print(f"docstr_orig:{docstr_orig}")
    #         # print(f"docstr_new:{docstr_new}")
    #         # print(f"final_doc_kml_content:{final_doc_kml_content}")
    #
    #         # re-write file
    #         fp = open(file_orig_kml, 'w')
    #         fp.write(final_doc_kml_content)
    #         fp.close()
    #
    #         ###
    #         # ├── doc.kml
    #         # └── files
    #         # └── att_A2_21 - 23_maxar.png
    #
    #     # upload function of tiles
    #     option_list = inps.kml_tile_url_options.split(",")
    #     url_options = {k: v for k, v in (x.split('=') for x in option_list)}
    #
    #     # figure out which server this is
    #     s3_result = re.search('http\:\/\/(.*)\.s3.*com\/(.*)', real_url)
    #     if s3_result:
    #         s3_url = "s3://" + s3_result.group(1) + "/" + s3_result.group(2)
    #         runCmd("aws s3 sync '{}' '{}'".format(tile_dir, s3_url))
    #         shutil.rmtree(tile_dir)
    #
    #     # extract radar footprint geojson
    #     driver_kml = ogr.GetDriverByName('KML')
    #     driver_json = ogr.GetDriverByName('GeoJSON')
    #     dataSource = driver_kml.Open('doc.kml')
    #     print(f"Number of layers: {dataSource.GetLayerCount()}")
    #     layer = dataSource.GetLayer()
    #     sr = layer.GetSpatialRef()
    #     new_feat = ogr.Feature(layer.GetLayerDefn())  # Dummy feature
    #
    #     for id, feat in enumerate(layer):
    #         name=dataSource.GetLayerByIndex(id).GetName()
    #         print(f"processing feature for {name}")
    #         rfp_filename = f"rfp_{name}.json"
    #         new_ds = driver_json.CreateDataSource(rfp_filename)
    #         new_lyr = new_ds.CreateLayer('{}'.format(id), sr, ogr.wkbPolygon)  # You have to specify the geometry type the layer will contain here with an ogr constant. I assume it is polygon but it can be changed.
    #         geom = feat.geometry().Clone()
    #         new_feat.SetGeometry(geom)
    #         new_lyr.CreateFeature(new_feat)
    #
    #         with open(file_orig_kml, 'r') as content_file:
    #             content_orig = content_file.read()
    #             http_result = re.search("\<href\>(http.*)\/[\d]*\/[\d]*\/.*.kml\<\/href\>", content_orig)
    #
    #         if http_result:
    #             real_url = http_result.group(1)
    #             s3_result = re.search('http\:\/\/(.*)\.s3.*com\/(.*)', real_url)
    #             s3_url = "s3://" + s3_result.group(1) + "/" + s3_result.group(2) + "/"
    #             print(s3_url)
    #             runCmd(f"aws s3 cp '{rfp_filename}' '{s3_url}'")
    #     del new_ds, new_lyr
    #
    #     runCmd(f"rm -rf doc.kml files")
    #
    #     # move original to relegate folder
    #     runCmd(f"mkdir -p old-kmz && mv {file_orig_kmz} old-kmz/")
    #
    #
    #     # zip back to kmz.
    #     runCmd(f'zip -r {file_orig_kmz} doc.kml files')
    #
    #
    #
    #     #clear old files
    #     runCmd('rm -rf doc.kml files final_kml ')






