# IMPORTING DATA

These instructions will load a sample 311 data set into postgres which will allow the 311 dash to function.

* install postgres with postgis
* Create `philly_311` database in postgres
* Import db schema with `sudo -u postgres psql -d philly_311 -f schema.sql`
* Run `yarn`
* Update `import.js` with postgres credentials
* Run `node import.js` -- note that for very large datasets this may need some babysitting as it begins to overwhelm the pool and timeout, at which point you can exit, add a start index to the script (based on number of records already imported) and rerun -- not perfect but it works.
* Enable postgis for `philly_311` database:
* * Connect to `philly_311` in psql shell: `\c philly_311`
* * Enable postgis extension: `CREATE EXTENSION postgis`
* Update `geom_imports.js` with postgres credentials
* Import neighborhood data (from shell): `node geom_imports.js`
* Create neighborhood counts for existing 311 records: `node getNeighborhoodCounts.js` -- this takes a while to run

TODO
* load postgres creds from env
