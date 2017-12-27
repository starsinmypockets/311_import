# Import to POSTGRES
* create import table in postgres
* install jq `apt-get install jq`
* install postgres-import-json `npm install -g postgres-import-json`
* run appropriate CURL command (below)
* output COMPACT format of rows `jq -c '.' 311_rows.json >> c.json`
* import to postgres `postgres-import-json -h localhost -u postgres -p 5432 -d postgres -t _311_data -f`

## import.js
@@NOTE At the moment this fails at about 30% complete for datasets contained over 100k records (approx)
A script to import 311 (carto api) records to local postgres db using sequelize

### fetch data
The following need to be run in the command line to get the raw json response data
First, batch the queries so

###
**** THIS WORKS ****
WITH records AS (
  WITH rows AS ( 
  	SELECT json_array_elements(data::json) AS row FROM _311_data LIMIT 10
  )
	SELECT (row->>'cartodb_id')::int, row->'the_geom', row->'the_geom_webmercator', (row->>'objectid')::int, (row->>'service_request_id')::int, row->'status', row->'status_not
es', row->'service_name', row->'service_code', row->'agency_responsible', row->'service_notice', to_date(row->>'requested_datetime', 'YYYY-MM-DD'), to_date(row->>'updated_datetime', 'YYYY-MM-DD'), to_date(row->>'expected_datetime', 'YYYY-MM-DD'), row->'address', row->'zipcode', row->'media_url', to_number(row->>'lat', '99.999999999'), to_number(row->>'lon','MI99.999999999'), (row->>'id')::int, to_date(row->>'created_at', 'YYYY-MM-DD'), to_date(row->>'updated_at', 'YYYY-MM-DD') FROM rows
)
INSERT INTO philly_311_2017 SELECT * FROM records;


#### ALL 2017 public requests
curl -sb -H "Accept: application/json" https://phl.carto.com/api/v2/sql?q=select%20*%20from%20public_cases_fc%20WHERE%20requested_datetime%20%3E=%20%272017-01-01%27::date%20and%20requested_datetime%20%3C=%20%2701-01-2018%27::date%20ORDER%20BY%20requested_datetime%20ASC >> 2017_philly_311.json

### NUMBER OF 2017 REQS
curl -sb -H "Accept: application/json" https://phl.carto.com/api/v2/sql?q=select%20COUNT(*)%20from%20public_cases_fc%20WHERE%20requested_datetime%20%3E=%20%272017-01-01%27::date%20and%20requested_datetime%20%3C=%20%2701-01-2018%27::date%20ORDER%20BY%20requested_datetime%20ASC >> 2017_philly_311.json


#### 0 - 250,000
curl -sb -H "Accept: application/json" https://phl.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20public_cases_fc%20ORDER%20BY%20cartodb_id%20ASC%20LIMIT%20250000 >> philly311data_0.json

#### 250,001 - 500,000
curl -sb -H "Accept: application/json" https://phl.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20public_cases_fc%20ORDER%20BY%20cartodb_id%20ASC%20LIMIT%20250000%20OFFSET%20250000 >> philly311data_1.json

#### 500,001 - 750,000
curl -sb -H "Accept: application/json" https://phl.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20public_cases_fc%20ORDER%20BY%20cartodb_id%20ASC%20LIMIT%20250000%20OFFSET%20500000 >> philly311data_2.json

#### 750,001 - 1,000,000
curl -sb -H "Accept: application/json" https://phl.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20public_cases_fc%20ORDER%20BY%20cartodb_id%20ASC%20LIMIT%20250000%20OFFSET%20750000 >> philly311data_3.json

#### 1,000,000 - 1,250,000
curl -sb -H "Accept: application/json" https://phl.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20public_cases_fc%20ORDER%20BY%20cartodb_id%20ASC%20LIMIT%20250000%20OFFSET%201000000 >> philly311data_4.json

#### 1,250,001 - 1,500,000
curl -sb -H "Accept: application/json" https://phl.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20public_cases_fc%20ORDER%20BY%20cartodb_id%20ASC%20LIMIT%20250000%20OFFSET%201250000 >> philly311data_5.json

#### 1,500,001 - END
curl -sb -H "Accept: application/json" https://phl.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20public_cases_fc%20ORDER%20BY%20cartodb_id%20ASC%20LIMIT%20250000%20OFFSET%201500000 >> philly311data_6.json
