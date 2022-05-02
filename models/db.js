const mysql = require('mysql')

const PORT = 3306

// create a connection pool
// var con = mysql.createConnection({
//   host: "34.81.192.26",
//   user: "nut_user",
//   password: "Evali9295",
//   database: "bndb"
// })

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Evali9295",
  database: "nutMeg"
})

// open the mysql connection
con.connect((function(err) {
  if (err) throw err;
  console.log('success connected to the database')
}));


// export
module.exports = con; 