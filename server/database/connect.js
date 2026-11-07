const { Pool } = require('pg')

require('dotenv').config() // needed when integration testing is done


const db = new Pool({
  connectionString: process.env.NODE_ENV === "test" // NODE_ENV - environment from node to help us with testing
    ? process.env.DB_TEST_URL // if it's true
    : process.env.DB_URL // if it's false
})

// condition ? expressionIfTrue : expressionIfFalse

module.exports = db

