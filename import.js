const fs = require('fs')
const Sequelize = require('sequelize')
const JSONStream = require('JSONStream')

const INTEGER = Sequelize.INTEGER
const STRING = Sequelize.STRING
const FLOAT = Sequelize.FLOAT
const DATE = Sequelize.DATE

const sequelize = new Sequelize('postgres://admin:admin@localhost:5432/philly_311', 
  {
    logging: false,
    pool: {
      max: 10,
      min: 0,
      idle: 20000,
      acquire: 20000
    }
  })

const Record = sequelize.define('philly_311', {
	cartodb_id: INTEGER,
  the_geom: INTEGER,
  the_geom_webmercator: STRING,
  objectid: INTEGER,
  service_request_id: INTEGER,
  status: STRING,
  status_notes: STRING,
  service_name: STRING,
  service_code: STRING,
  agency_responsible: STRING,
  service_notice: STRING,
  requested_datetime: DATE,
  updated_datetime: DATE,
  expected_datetime: DATE,
  address: STRING,
  zipcode: STRING,
  media_url: STRING,
  lat: FLOAT,
  lon: FLOAT,
  createdAt: {type: DATE, field: 'created_at'},
  updatedAt: {type: DATE, field: 'updated_at'}
}, {
  freezeTableName: true
})

// for testing:
const insertTestRecord = () => {
Record.create({
	cartodb_id: 1,
  the_geom: null,
  the_geom_webmercator: null,
  objectid: 123,
  service_request_id: 123,
  status: "Open",
  status_notes:"notes",
  service_name: "foo",
  service_code:"bar",
  agency_responsible:"An agency",
  service_notice:"1234 notice",
  requested_datetime:"2015-01-19T19:00:00Z",
  updated_datetime:"2015-01-19T19:00:00Z",
  expected_datetime:"2015-01-19T19:00:00Z",
  address:"123 lovers lane",
  zipcode:"19104",
  media_url:"http://foo.bar",
  lat: 123.122,
  lon: -0.2411
}).then(res => {
  console.log('Success?', res)
})
}
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
    // insertTestRecord() uncomment to test sequelize connection
    doImport()
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

const doImport = () => {
  console.log('-----------------------do import---------------------------')
  const filePath = "./public_cases_fc.geojson"
  const readStream = fs.createReadStream(filePath)
  const parser = JSONStream.parse('rows.*.features.*')

readStream.on('open', res => {
  console.log('--------------------Read Stream from ' + filePath + '-----------------------', res)
  readStream.pipe(parser)
})

let count = 0

parser.on('data', async data => {
  try {
    count += 1
    console.log("+++++++++++++++++++++"+count+"++++++++++++++++++")
    if (count > 0) { // use this to restart large imports from last imported record
      console.log("--------------------------------------RECORD-----------------------------------")
      console.log(data.properties)
      await Record.create(data.properties)
     }
  } catch (e) {
    console.log('INSERT FAIL', e)
  }
})

parser.on('end', res => {
  console.log('parser end', res)
})

readStream.on('end', res => {
  console.log('read stream END', res)
})

}
