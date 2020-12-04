const fs = require('fs')
const Sequelize = require('sequelize')
const Philly = require('./Neighborhoods_Philadelphia.json')

const INTEGER = Sequelize.INTEGER
const GEOMETRY = Sequelize.GEOMETRY
const STRING = Sequelize.STRING
const FLOAT = Sequelize.FLOAT
const DATE = Sequelize.DATE
const _JSON = Sequelize.JSON

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

const Record = sequelize.define('neighborhoods', {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  the_geometry: GEOMETRY,
  root: STRING,
  name: {type: STRING, unique: true},
  listname: {type: STRING, unique: true},
  mapname: {type: STRING, unique: true},
  createdAt: {type: DATE, field: 'created_at'},
  updatedAt: {type: DATE, field: 'updated_at'}
}, {
  freezeTableName: true
})

const point = { 
  type: 'Point', 
  coordinates: [39.807222,-76.984722],
  crs: { type: 'name', properties: { name: 'EPSG:4326'} }
}

const polygon = { type: 'Polygon', coordinates: [
             [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
               [100.0, 1.0], [100.0, 0.0] ]
             ]}

const ex3 = '{"type":"Polygon","coordinates":[[[-114.017347,51.048005],[-114.014433,51.047927],[-114.005899,51.045381],[-114.017347,51.048005]]]}'

const jsonData = JSON.stringify(Philly)

/*
DROP TABLE neighborhoods;
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
*/

const insertRow = (feature) => {
  console.log('-------------', feature)
  return new Promise((resolve, reject) => {
   // console.log('>>', feature.properties.name, feature.properties.listname, feature.properties.mapname)

    Record.create({
      the_geometry: {type: 'MultiPolygon', coordinates: feature.geometry.coordinates },
      root: "Philly",
      name: feature.properties.name,
      listname: feature.properties.listname,
      mapname: feature.properties.mapname
    })
    .then(Rec => {
      console.log(Rec.the_geometry)
      resolve(Rec)
    })
    .catch(reject)
  })
} 

const insertRows = () => {
  const promises = Philly.features.map(insertRow)
  return Promise.all(promises)
}

const dbInsert = () => {
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
		insertRows()
      .then(res => {
        console.log('done')
      })
      .catch(err => {
        console.log("Insert Fails", err)
      })
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
}

dbInsert()
