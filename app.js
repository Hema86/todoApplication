const express = require('express')
const app = express()
const items = require('./api/routes')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use( bodyParser.urlencoded({extended: true}))

app.use('/tasks', items)


app.listen(3001, () => console.log('Example app listening on port 3000!'))