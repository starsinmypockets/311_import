## geom_import.js
NodeJS script to import Neighborhoods geojson to postgres as geometries

Assuming postgres connect string:
`'postgres://postgres:postgres@localhost:5432/postgres'`

Create postgres table:
```sql
CREATE TABLE IF NOT EXISTS neighborhoods (
  id         SERIAL,
  root       varchar(40),
  name       varchar(40) UNIQUE,
  listname   varchar(40) UNIQUE,
  mapname    varchar(40) UNIQUE,
  the_geometry GEOMETRY,
  created_at date,
  updated_at date
);
 
```

run `node geom_import.js`

In postgres run the following:
`SELECT name FROM neighborhoods WHERE ST_Intersects(ST_PointFromText('POINT(-75.196309 39.97462)'), neighborhoods.the_geometry)=true;`

Should return:
```
  name  
  --------
   MANTUA
   (1 row)
```

## import.js
@@NOTE At the moment this fails at about 30% complete for datasets contained over 100k records (approx)
A script to import 311 (carto api) records to local postgres db using sequelize

### fetch data
The following need to be run in the command line to get the raw json response data
First, batch the queries so

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
