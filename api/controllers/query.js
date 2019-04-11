const { Client } = require('pg')
const dotenv = require('dotenv').config()
const shortid = require('shortid')

// console.log(process.env.DB_USER)
const client = new Client({
  user: process.env.DB_USER,
  hostname: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})

let getItems = (request, response) => {
  client.query('SELECT * FROM tasks.item', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

let setItem = (request, response) => {
  // console.log(request.body)
  let id = shortid.generate()
  console.log(id)
  const { name, completed, notes, dueDate, priority, priorityId, identifier } = request.body
  const body = { name, id, completed }
  client.query('INSERT INTO tasks.item (name, completed, notes, dueDate, priority, priorityId, identifier, id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [name, completed, notes, dueDate, priority, priorityId, identifier, id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).json(body)
    // console.log(results)
    })
}

let updateItemState = (request, response) => {
  // const taskId = request.params.id
  let { completed, id } = request.body
  // console.log(id)
  client.query('UPDATE tasks.item set completed = $1  WHERE id = $2', [completed, id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(results)
  })
}
// let deleteAllItems = (request, response) => {
//     // const id = request.params.tasksId
//     // console.log(id)
//     client.query('DELETE FROM tasks.item', ((error, results, id) => {
//         if (error) {
//           throw error
//         }
//         response.status(201).json(results)
//     }))
// }
let setEditedItem = (request, response) => {
  let { name, id } = request.body
  // console.log(id)
  client.query('UPDATE tasks.item set name = $1  WHERE id = $2', [name, id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results)
  })
}
let setTaskDetails = (request, response) => {
  let { priority, duedate, notes, identifier, id } = request.body
  client.query('UPDATE tasks.item set priority = $1, duedate = $2, notes = $3, identifier = $4  WHERE id = $5',
    [priority, duedate, notes, identifier, id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(results)
    })
}

let deleteItem = (request, response) => {
  const id = request.body.id
  console.log(id)

  client.query('DELETE FROM tasks.item WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = { getItems, setItem, updateItemState, setEditedItem, deleteItem, setTaskDetails }
