const express = require('express')
const cors = require('cors')
const logger = require('morgan')

const goatRoutes = require('./routers/goats')

const app = express()

app.use(express.json())
if (process.env.NODE_ENV !== "test") app.use(logger('dev'))
app.use(cors())

app.use('/goats', goatRoutes)

app.get('/', (req, res) => {
  res.send({
    message: "welcome",
    description: "GOAT API",
    endpoints: [
      "GET    /            200",
      "GET    /goats       200",
      "GET    /goats/:id   200",
      "POST   /goats       201",
      "PATCH  /goats/:id   200",
      "DELETE /goats/:id   204",
    ]
  })
})

app.post('/', (req, res) => {
  res.status(405).send('Not allowd!')
});

module.exports = app
