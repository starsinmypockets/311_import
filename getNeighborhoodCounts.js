/**
 Note - until we have more resources
 this will have to work for a single
 service_name only
 
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

const fs = require('fs')
const Sequelize = require('sequelize')
const sleep = require('sleep')

// Sequelize Types
const INTEGER = Sequelize.INTEGER
const STRING = Sequelize.STRING
const DATE = Sequelize.DATE

const sequelize = new Sequelize('postgres://admin:admin@localhost:5432/philly_311', 
  {
    logging: false,
    pool: {
      max: 15,
      min: 0,
      idle: 20000,
      acquire: 20000
    },
  })

const Record = sequelize.define('neighb_counts', {
  count: INTEGER,
  service_name: STRING,
  neighborhood: STRING,
  updatedAt: {type: DATE, field: 'updated_at'},
  createdAt: {type: DATE, field: 'created_at'} 
}, {
  freezeTableName: true
})

const services = [
	"Maintenance Residential or Commercial",
	"Rubbish/Recyclable Mater",
	"Illegal Dumping",
	"Abandoned Vehicle",
	"Directory Assistance",
	"Graffiti Removal",
	"Street Defect",
	"Street Light Outage",
	"Vacant Lot Clean-Up",
	"Vacant House or Commercial",
	"Salting",
	"Sanitation / Dumpster Violation",
	"Traffic Signal Emergency",
	"Street Trees",
	"Building Dangerous",
	"Smoke Detector",
	"Building Construction",
	"Construction Site Task Force"
]

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
    console.log('Connection has been established successfully...')
    doImport()
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

const doImport = async () => {
  const res = await sequelize.query('SELECT DISTINCT name from neighborhoods')
  const names = res[0].map(obj => obj.name) // neighborhood names
  const qs = [] // requests by neighborhood
  
  // info query promises -- approx 2600 queries
  for (i = 0; i < names.length; i++) {
    const name = names[i]
    for (j = 0; j < services.length; j++) {
      const service = services[j]
      const res = await getServiceNumbersByNeighborhood(name, service)
      let count = 0
      
      try {
        count = res[0][0].count
      } catch (e) {
        console.log(`No available count for ${name} -- ${service}`)
      }
      
      const record = {
        neighborhood: name,
        service_name: service,
        count: count
      }

      qs.push(record)
    }
  }

  console.log(qs)
  Record.bulkCreate(qs)
}

const insertRecords = (res) => {
  const records = res.map(r => {
    if (r[0]) {
     return {
        service_name: r[0].service_name,
        count: parseInt(r[0].count),
        neighborhood: name
      }
    } else {
      return {}
    }
  })
  
  Record.bulkCreate(records)
    .then(inserted => {
      console.log("INSERTED", inserted)
    })
    .catch(console.log)
}

const getServiceNumbersByNeighborhood = (name, service) => {
  console.log(name, service)
  return sequelize.query(`SELECT service_name, count(id) AS "count" FROM philly_311 WHERE service_name = '${service}' AND (ST_Contains(ST_SetSRID((SELECT the_geometry FROM neighborhoods WHERE name='${name}'), 4326), ST_SetSRID(ST_SetSRID(ST_MAKEPOINT(philly_311.lon, philly_311.lat), 4326), 4326)))=true GROUP BY service_name;`)
}
