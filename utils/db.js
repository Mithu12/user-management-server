// import pgp from 'pg-promise'
// //or native libpq bindings
// //var pg = require('pg').native
//
// let conString = "postgres://cosljdgp:lRsoRAsq03gnA82O0wbnJbVRhrVW72Vj@heffalump.db.elephantsql.com/cosljdgp" //Can be found in the Details page
// let client = pgp(conString)
//
// export default client()

import Pkg from 'pg'

const pool = new Pkg.Pool({
  user: 'cosljdgp',
  host: 'heffalump.db.elephantsql.com',
  database: 'cosljdgp',
  password: 'lRsoRAsq03gnA82O0wbnJbVRhrVW72Vj',
  port: 5432,
})
export default pool
