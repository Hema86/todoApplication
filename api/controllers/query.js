const { Client } = require('pg')

const client = new Client({
  user:process.env.user
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port
})

client.connect()

let getItems = (request, response) => {
  client.query('SELECT * FROM tasks.item', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

let setItem = (request, response) => {
  console.log(request.body)
  const { name, completed } = request.body
  client.query('INSERT INTO tasks.item (name, completed) VALUES ($1, $2)', [name, completed], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(results)
  })
}
let deleteItem = (request, response) => {
    const id = request.params.tasksId
    console.log(id)
    client.query('DELETE FROM users WHERE id =($1)', [id] ((error, results) => {
        if (error) {
          throw error
        }
        response.status(201).json({
            message: 'handling post request',
            createdTasks: results
        })
    }))
}

module.exports =  { getItems, setItem, deleteItem }