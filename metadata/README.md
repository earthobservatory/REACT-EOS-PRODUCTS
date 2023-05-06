### Metdata JSON ###

#### Scraping
To scrape exisiting dataset for metadata:
```commandline
python audit-metadata.py
```


#### Metadata format
Source: https://aria-sg-products.s3-ap-southeast-1.amazonaws.com/metadata.json

#### Event metadata format
Format:
Metadata is stored in a list of event dictionaries. 

For each event:

| Event Field        | Description  | 
| ------------- |:-------------:| 
| `event_name`   | Name of event folder in eos-rs-products.earthobservatory.sg | 
| `event_display_name`   | Display name for the event. Derived from `event_name` |
| `event_url`    | Event folder URL      | 
| `event_start`|  Start of event, based on all products in `product_list`      | 
| `event_end`|  End of event, based on all products in `product_list`      | 
| `event_bbox`|  Rectangle bbox for event in `[[min lat, min lon], [max_lat, max_lon]]`, based on all radar footprints in `product_list` *Note*: useful for [flying to bounds on leaflet](https://leafletjs.com/reference.html#map-flytobounds) | 
| `product_list`| List of all metadata for each product in event. (see [Product metadata](#product-metadata-format)) | 


#### Product metadata format

Metadata is stored in a list of product dictionaries for each event. 

For each product in `product_list`:


| Product Field      |                                           Description                                            | 
|--------------------|:------------------------------------------------------------------------------------------------:| 
| `prod_name`        |                       Name of DPM/FPM product with accompanying tif / kmz                        |
| `prod_title`       |                           Title of DPM/FPM product, scrapred from txt                            |
| `prod_desc`        |                        Description of DPM/FPM product, scrapred from txt                         |
| `prod_main_png`    |                                   URL of main PNG of product.                                    |
| `prod_rfp_file`    |                  Radar footprint geojson file url of product extracted from kmz                  |
| `prod_rfp_geojson` | Radar footprint in geojson format extracted from kmz, contents should be same as `prod_rfp_file` |
| `prod_tiles`       |                      TMS tile url for rendered products, extracted from kmz                      |
| `prod_min_zoom`       |                      Minimum zoom for the product tiles                      |
| `prod_max_zoom`       |                      Maximum zoom for the product tiles                      |
| `prod_date`        |                    Product date tagged to product extracted from `prod_title`                    |
| `prod_type`        |                         Product map type, damage or flood etc. (DPM/FPM)                         |
| `prod_sat`         |                            Satellite product is derived from (S1/A2)                             |
| `prod_version`     |                               `float` indicating product version.                                |
| `prod_cvd`         |              Boolean flag to tag if product is Colour Vision Deficiency - friendly.              |
| `prod_isLatest`    |        Boolean flag to show if product is latest version for the swath. Display if true.         |


#### Demo

https://aria-sg-products.s3-ap-southeast-1.amazonaws.com/leaflet-demo.html

<img width="1030" alt="image" src="https://user-images.githubusercontent.com/6346909/232744830-aebdd3cd-c04c-4777-8ea6-180d8040a573.png">


You may see how the metadata could be used with leaflet [here](https://github.com/earthobservatory/REACT-EOS-PRODUCTS/blob/main/metadata/leaflet-demo.html#L115-L171)


