const fs = require('fs')
const Sequelize = require('sequelize')
const JSONStream = require('JSONStream')

const INTEGER = Sequelize.INTEGER
const STRING = Sequelize.STRING
const FLOAT = Sequelize.FLOAT
const DATE = Sequelize.DATE

const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/postgres', 
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
const insertRecord = () => {
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
})
}
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
    doImport()
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

// @@TODO: 
// 
// + create model for 311 record and pipe to postgres
// + import geojson
// + figure out geojson query
// + integrate graphql
const doImport = () => {
console.log('do import')
  const filePath = "./data/philly311data_0.json"
  const readStream = fs.createReadStream(filePath)
  const parser = JSONStream.parse('rows.*')

readStream.on('open', res => {
  console.log('Read Stream from ' + filePath, res)
  readStream.pipe(parser)
})

parser.on('data', data => {
  try {
    Record.create(data)
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
