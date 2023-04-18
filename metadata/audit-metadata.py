#!/usr/bin/env python3
# Author: Shi Tong Chin, Earth Observatory of Singapore
# THIS SCRIPT REPLACES THE KMZ TILES WITH TMS STYLE ONES, AND UNPACKS, UPLOADS THE RFP GEOJSON

from __future__ import absolute_import
from builtins import range
import os
import glob
import argparse
import json
# from utilities.util_methods import runCmd, create_mask, get_bounding_polygon, gdal_warp_stitch, gtfwrt, \
#     create_xml_metadata, tif2shpzip, polyshp2kml, getFootprintShp, checkProjectionWGS84, filter_glob
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


if __name__ == '__main__':
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






