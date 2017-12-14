/**
 * Note - until we have more resources
 * this will have to work for a single
 * service_name only
 */

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

/*
DROP TABLE neighb_counts;
CREATE TABLE IF NOT EXISTS  neighb_counts(
  id         SERIAL,
  count 		 integer,
  neighborhood varchar(40),
  service_name     varchar(40),
  created_at date,
  updated_at date
);
*/

const Record = sequelize.define('neighb_counts', {
  count: INTEGER,
  service_name: STRING,
  neighborhood: STRING,
  updatedAt: {type: DATE, field: 'updated_at'},
  createdAt: {type: DATE, field: 'created_at'} 
}, {
  freezeTableName: true
})

// for testing:
const insertRecord = () => {
Record.create({
  service_name: "Abandoned Vehicle",
  count: 121,
  neighborhood: 'MANTUA',
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
const doImport = () => {
  sequelize.query('SELECT DISTINCT name from neighborhoods').then(res => {
    const names = res[0].map(obj => obj.name)
    const results = names.map(name => {
      getServiceNumbersByNeighborhood(name)
        .then(res => {
          // do record insert here
          res.map(r => {
            console.log(name, r[0])
            if (r[0]) {
              console.log('ok')
              const rec = {
                service_name: r[0].service_name,
                count: parseInt(r[0].count),
                neighborhood: name
              }
              Record.create(rec)
                .then(inserted => {
                console.log("INSERTED", inserted)
              })
                .catch(console.log)

            }
          })
      })
        .catch(console.log)
    })
  })
}

const getServiceNumbersByNeighborhood = (name) => {
  const service = "Construction Site Task Force"
  return sequelize.query(`SELECT service_name, count(id) AS "count" FROM philly_311 WHERE service_name = '${service}' AND (ST_Contains(ST_SetSRID((SELECT the_geometry FROM neighborhoods WHERE name='${name}'),4326), ST_SetSRID(philly_311.the_geom, 4326))=true) GROUP BY service_name;`)
}
