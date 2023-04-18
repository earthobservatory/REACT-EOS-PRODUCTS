### Metdata JSON ###

#### Scraping
To scrape exisiting dataset for metadata:
```commandline
python audit-metadata.py
```


#### Metadata format
Source: http://aria-sg-products.s3-website-ap-southeast-1.amazonaws.com/metadata.json

#### Event metadata format
Format:
Metadata is stored in a list of event dictionaries. 

For each event:

| Event Field        | Description  | 
| ------------- |:-------------:| 
| `event_name`   | Name of event folder in eos-rs-products.earthobservatory.sg | 
| `event_url`    | Event folder URL      | 
| `event_start`|  Start of event, based on all products in `product_list`      | 
| `event_end`|  End of event, based on all products in `product_list`      | 
| `event_bbox`|  Rectangle bbox for event in `[[min lat, min lon], [max_lat, max_lon]]`, based on all radar footprints in `product_list` *Note*: useful for [flying to bounds on leaflet](https://leafletjs.com/reference.html#map-flytobounds) | 
| `product_list`| List of all metadata for each product in event. (see [Product metadata](#product-metadata-format)) | 


#### Product metadata format

Metadata is stored in a list of product dictionaries for each event. 

For each product in `product_list`:


| Product Field        | Description  | 
| ------------- |:-------------:| 
| `prod_name`| Name of DPM/FPM product with accompanying tif / kmz|
| `prod_title`| Title of DPM/FPM product, scrapred from txt|
| `prod_desc`| Description of DPM/FPM product, scrapred from txt|
| `prod_rfp_file`| Radar footprint geojson file url of product extracted from kmz |
| `prod_rfp_geojson`| Radar footprint in geojson format extracted from kmz, contents should be same as `prod_rfp_file` |
|`prod_tiles`| TMS tile url for rendered products, extracted from kmz|
| `prod_date`| Product date tagged to product extracted from `prod_title`|
    

#### Demo

http://aria-sg-products.s3-ap-southeast-1.amazonaws.com/leaflet-demo.html

You may see how the metadata could be used with leaflet [here](https://github.com/earthobservatory/REACT-EOS-PRODUCTS/blob/main/metadata/leaflet-demo.html#L115-L171)


