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