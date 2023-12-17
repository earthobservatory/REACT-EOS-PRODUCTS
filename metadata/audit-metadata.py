#!/usr/bin/env python3
# Author: Shi Tong Chin, Earth Observatory of Singapore
# THIS SCRIPT REPLACES THE KMZ TILES WITH TMS STYLE ONES, AND UNPACKS, UPLOADS THE RFP GEOJSON

from __future__ import absolute_import
from builtins import range
import os
import glob
import json
import numpy as np
from osgeo import gdal, osr, ogr
import urllib.parse
import re, shutil
import datetime
import argparse
import subprocess as sp
import boto3
import requests
import dateparser
import calendar
import re
import locationtagger


def runCmd(cmd):
    print("{}".format(cmd))
    status = os.system(cmd)
    if status != 0:
        raise Exception('error when running:\n{}\n'.format(cmd))

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

def get_tags(prod_list):
    event_countries = []
    event_type_tags = []

    for product in prod_list:
        desc = product['prod_desc']
        title = product['prod_title']
        refined_text = desc + title
        event_type_tags.extend([x for x in event_tags if x in refined_text.lower()])

        for replace_phrase in replace_locations:
            refined_text = refined_text.replace(replace_phrase,"")
        entities = locationtagger.find_locations(text=refined_text)
        event_countries.extend(entities.countries)

    event_type_tags = list(set(event_type_tags))
    event_countries = list(set(event_countries))

    return event_type_tags, event_countries

def mark_latest_products(prod_list):
    latest_versions = {}

    # Find the latest version for each group of items with the same prod_date, prod_type, and prod_cvd
    for product in prod_list:
        key = (product['prod_date'], product['prod_type'], product['prod_cvd'])
        if key not in latest_versions or product['prod_version'] > latest_versions[key]['prod_version']:
            latest_versions[key] = product

    # Mark each item that is the latest version in its group
    for product in prod_list:
        key = (product['prod_date'], product['prod_type'], product['prod_cvd'])
        if product == latest_versions[key]:
            product['isLatest'] = True
        else:
            product['isLatest'] = False

    return prod_list



def cmdLineParse():
    '''
    Command line parser.
    '''

    parser = argparse.ArgumentParser(
        description='creating metadata from raw datasets, then uploading to metadata.json on s3 static site')
    parser.add_argument('-prod_bucket', dest='prod_s3_bucket', type=str, default='eos-rs-products',
                        help='name of s3 bucket which hosts all the products')
    parser.add_argument('-prod_url', dest='prod_http', type=str, default='https://eos-rs-products.earthobservatory.sg/',
                        help='http url of product site')
    parser.add_argument('-md_bucket', dest='metadata_s3_bucket', type=str, default='aria-sg-products',
                        help='s3 url of metadata.json to be uploaded to')
    parser.add_argument('-prefix', dest='prefix_filter', type=str, default='EOS-RS_2023, EOS-RS_2022',
                        help='If defined, comma-seperated prefix to filter events for metadata scraping')
    parser.add_argument('-dry', action='store_true', default=False,
                        dest='dry_run', help='Dry run, do not update metadata.json in metadata bucket')
    parser.add_argument('-repl_loc', dest='replace_locations', type=str,
                        default='California Institute, Japan Aerospace, Observatory of Singapore, Remote, NASA',
                        help='locations to not detect when getting event tags (comma seperated)')
    parser.add_argument('-event_tags', dest='event_tags', type=str,
                        default="earthquake, typhoon, tsunami, volcano, flood, explosion, landslide, cyclone, wildfire, damage proxy map, flood proxy map",
                        help='Event type tags (comma seperated)')
    return parser.parse_args()


if __name__ == '__main__':
    inps = cmdLineParse()
    KMLDIR = "final_kml"

    replace_locations = [x.strip() for x in inps.replace_locations.split(',')]
    print(replace_locations)
    event_tags = [x.strip() for x in inps.event_tags.split(',')]
    print(event_tags)

    bucket = inps.prod_s3_bucket
    # Make sure you provide / in the end
    prefixes = [x.strip() for x in inps.prefix_filter.split(',')]
    metadata_list = []

    for prefix in prefixes:
        # prefix = inps.prefix_filter
        static_url = inps.prod_http
        client = boto3.client('s3')
        result_folder = client.list_objects(Bucket=bucket, Prefix=prefix, Delimiter='/')
        disaster_folders = result_folder.get('CommonPrefixes') if result_folder.get('CommonPrefixes') is not None else []

        for o in disaster_folders:
            # EVENT LOOP
            response_folder = o.get('Prefix')
            this_event_md = {"event_name": response_folder.split("/")[0],
                             "event_display_name": '',
                             "event_url": os.path.join(static_url, response_folder),
                             "event_start": '',
                             "event_end": '',
                             "event_bbox": '',
                             "event_location_tags":[],
                             "event_type_tags":[],
                             "product_list": []}

            # get event display name
            # Split the filename into a list of strings using "_" as the separator
            event_name_parts = this_event_md['event_name'].split("_")
            date_string = datetime.datetime.strptime(event_name_parts[1], '%Y%m').strftime('%b %Y')
            # Create the final string
            this_event_md["event_display_name"] = f"{event_name_parts[0]} {' '.join(event_name_parts[2:])}, {date_string}"

            print(f"sub folder :  {response_folder}")
            result_files = client.list_objects(Bucket=bucket, Prefix=response_folder)
            # fileList = result_files.get('Contents')
            fileList = [d['Key'] for d in result_files.get('Contents')]

            for filepath in fileList:
                # PRODUCT LOOP
                # filepath = file['Key']
                print(filepath)
                # kmz_file = os.path.basename(filepath)
                filename_base = os.path.basename(filepath)
                if filepath.endswith('.txt') and 'IFG' not in filepath:
                    match = re.search("(.*_v.*[1-9](?:_cvd)?)(?:_TXT)?.txt", filename_base)
                    if match:
                        textfile_base = match.group(1)
                        # for every product in the event
                        r_png = re.compile(f".*{textfile_base}.*MAIN.*png")
                        r_kmz = re.compile(fr".*{textfile_base}.kmz|.*{textfile_base}_KMZ.kmz")
                        r_tif = re.compile(fr".*{textfile_base}.*tif.*")
                        list_png = list(filter(r_png.match, fileList))
                        list_kmz = list(filter(r_kmz.match, fileList))
                        list_tif = list(filter(r_tif.match, fileList))
                        print(f"{list_png}, {list_kmz}")
                        if list_png and list_kmz:
                            kmz_filepath = list_kmz[0]
                            kmz_file = os.path.basename(kmz_filepath)
                            png_file = os.path.basename(list_png[0])
                            tif_file = os.path.basename(list_tif[0]) if list_tif else ""
                            # if newlist:
                            #     this_product_md["prod_main_png"] = urllib.parse.urljoin(this_event_md['event_url'], newlist[0])

                            this_product_md = {"prod_name": textfile_base,
                                               "prod_title": '',
                                               "prod_desc": '',
                                               "prod_main_png": urllib.parse.urljoin(this_event_md['event_url'], png_file),
                                               "prod_tif": urllib.parse.urljoin(this_event_md['event_url'], tif_file) if tif_file else "" ,
                                               "prod_kmz": urllib.parse.urljoin(this_event_md['event_url'], kmz_file),
                                               "prod_rfp_file": '',
                                               "prod_rfp_geojson": '',
                                               "prod_tiles": '',
                                               "prod_min_zoom": '',
                                               "prod_max_zoom": '',
                                               "prod_date": '',
                                               "prod_type": '',
                                               "prod_sat": '',
                                               "prod_version": 0,
                                               "prod_cvd": False

                                               }

                            # get text file
                            text_url = os.path.join(static_url, filepath)
                            r = requests.get(text_url)
                            if r.status_code == 200:
                                text_str_list = r.text.split("\n")

                                if len(text_str_list) > 1:
                                    this_product_md.update({"prod_title": text_str_list[0]})
                                    this_product_md.update({"prod_desc": "\n".join(text_str_list[2:])})


                            if this_product_md['prod_title']:
                                print(this_product_md['prod_title'])
                                prod_date = parseDate(this_product_md['prod_title'])
                                this_product_md.update({"prod_date": prod_date})

                            # extract product details with prod_name
                            match = re.search(r'EOS-RS_\d{8}.*_([A-Z]{3})_.*([A-Z][0-9])_.*?v(\d\.\d)(?:.*?(cvd))?',
                                              this_product_md["prod_name"])
                            if match:
                                date_string = match.group(1)
                                this_product_md["prod_type"] = match.group(1)
                                this_product_md["prod_sat"] = match.group(2)
                                this_product_md["prod_version"] = match.group(3)
                                this_product_md["prod_cvd"] = True if (
                                            match.group(4) or "cvd" in this_product_md["prod_name"]) else False

                            # GET THE RFP
                            client.download_file(bucket, kmz_filepath, kmz_file)

                            # unzip kmz
                            runCmd(f'unzip "{kmz_file}"')
                            file_kml = os.path.join(os.getcwd(), 'doc.kml')

                            # find the tiles url and get the radarfootprint?
                            feat_dict={}
                            try:
                                feat_dict = get_radar_footprint(file_kml)
                            except:
                                print(f"KML ISSUE FOR: {kmz_file}")


                            for rfp_filename, geojson in feat_dict.items():
                                this_product_md.update({"prod_rfp_geojson": geojson})
                                with open(file_kml, 'r') as content_file:
                                    content_orig = content_file.read()
                                    http_result = re.search("\<href\>(http.*\/)[\d]*\/[\d]*\/.*.kml\<\/href\>", content_orig)

                                if http_result:
                                    # get http path of prod tiles
                                    real_url = http_result.group(1)
                                    this_product_md.update({"prod_tiles": real_url.replace('http', 'https').replace('website-','')})
                                    # get s3 path of prod tiles
                                    s3_result = re.search('http\:\/\/(.*)\.s3.*com\/(.*)', real_url)
                                    tile_bucket = s3_result.group(1)
                                    tile_prefix = s3_result.group(2)
                                    s3_url = "s3://" + tile_bucket + "/" + tile_prefix
                                    # upload rfp
                                    runCmd(f"aws s3 cp '{rfp_filename}' '{s3_url}'")
                                    this_product_md.update({"prod_rfp_file": os.path.join(this_product_md['prod_tiles'],rfp_filename)})

                                    # get min/max zoom
                                    tile_ls = client.list_objects(Bucket=tile_bucket, Prefix=tile_prefix, Delimiter='/')
                                    # import pdb; pdb.set_trace()
                                    tileFolderList = [d['Prefix'].split('/')[-2] for d in tile_ls.get('CommonPrefixes')]
                                    prod_tile_min = 99
                                    prod_tile_max = 0
                                    for zoom in tileFolderList:
                                        # check if folder is an integer
                                        try:
                                            this_zoom = int(zoom)
                                            prod_tile_max = this_zoom if this_zoom > prod_tile_max else prod_tile_max
                                            prod_tile_min = this_zoom if this_zoom < prod_tile_min else prod_tile_min
                                        except ValueError:
                                            continue
                                    # import pdb; pdb.set_trace()
                                    this_product_md.update({"prod_min_zoom": str(prod_tile_min)})
                                    this_product_md.update({"prod_max_zoom": str(prod_tile_max)})

                            if not this_product_md["prod_tiles"]:
                                print(f"ERROR: failed to find prod_tiles for {filepath}, breaking out and not adding product.")
                                runCmd(f"rm -rf doc.kml files rfp_*.json {kmz_file}")
                                continue

                            runCmd(f"rm -rf doc.kml files rfp_*.json {kmz_file}")
                            if feat_dict: # only appends if there is a valid radar footprint
                                this_event_md["product_list"].append(this_product_md)

            # mark each item in list if it's the latest or not:
            this_event_md["product_list"] = mark_latest_products(this_event_md["product_list"])

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

            event_types, event_countries = get_tags(this_event_md['product_list'])
            this_event_md.update({"event_type_tags": event_types})
            this_event_md.update({"event_location_tags": event_countries})
            metadata_list.append(this_event_md)
            print(json.dumps(metadata_list, indent=2))
            print(json.dumps(metadata_list, indent=2))


    metadata_file = "metadata.json"

    with open(metadata_file, "w") as final:
        json.dump(metadata_list, final, indent=2)

    if not inps.dry_run:
        runCmd(f"aws s3 mv s3://aria-sg-products/{metadata_file} s3://aria-sg-products/metadata.{datetime.datetime.today().strftime('%Y%m%d')}.json")
        runCmd(f"aws s3 cp {metadata_file} s3://aria-sg-products/{metadata_file}")

    runCmd(f"rm -rf *.kmz*")






