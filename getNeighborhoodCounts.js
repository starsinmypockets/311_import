const fs = require('fs')
const Sequelize = require('sequelize')
const sleep = require('sleep')
// Sequelize Types
const INTEGER = Sequelize.INTEGER
const STRING = Sequelize.STRING
const DATE = Sequelize.DATE

const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/postgres', 
  {
    logging: false,
    pool: {
      max: 15,
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
  fetchResources().then(pss => {
    Promise.all(pss).then(res => {
      console.log("RES>>>>", res.map(r => r[0][0]))
    })
//    insertRecords(res)
  })
}

const fetchResources = () => {
  return new Promise ((resolve, reject) => {
  
  sequelize.query('SELECT DISTINCT name from neighborhoods').then(res => {
    const names = res[0].map(obj => obj.name).slice(0,1)
    
    const results = names.reduce((acc, name) => {
			const records= services.map(service => {
				const svQ = getServiceNumbersByNeighborhood(name,service)
        return svQ // return service query
      })
      console.log(">>>>", acc, records)
      return acc.concat(records)
    }, [])

    resolve(results)
  })

  })
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
  return sequelize.query(`SELECT service_name, count(id) AS "count" FROM philly_311 WHERE service_name = '${service}' AND (ST_Contains(ST_SetSRID((SELECT the_geometry FROM neighborhoods WHERE name='${name}'),4326), ST_SetSRID(philly_311.the_geom, 4326))=true) GROUP BY service_name;`)
}
