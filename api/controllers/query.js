const { Client } = require('pg')
const dotenv = require('dotenv').config()
const shortid = require('shortid')

// console.log(process.env.DB_USER)
const client = new Client({
  user : process.env.DB_USER,
  hostname : process.env.DB_HOST,
  database : process.env.DB_DATABASE,
  password : process.env.DB_PASSWORD,
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
  const { name, completed } = request.body
  const body = {name, id, completed}
  client.query('INSERT INTO tasks.item (name, completed, id) VALUES ($1, $2, $3)', [name, completed, id], (error, results) => {
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
  client.query('UPDATE tasks.item set completed = $1  WHERE id = $2', [completed, id], (error, results)=> {
  if(error) {
    throw error
  }
  response.status(201).send(results)
})
}
let deleteAllItems = (request, response) => {
    // const id = request.params.tasksId
    // console.log(id)
    client.query('DELETE FROM tasks.item', ((error, results, id) => {
        if (error) {
          throw error
        }
        response.status(201).json(results)
    }))
}
let getCompletedItems = (request, response) => {
  client.query('SELECT * FROM tasks.item where completed = true', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
let getInCompletedItems = (request, response) => {
  client.query('SELECT * FROM tasks.item where completed = false', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

let setEditedItem = (request, response) => {
  let {name, id } = request.body 
  // console.log(id)
  client.query('UPDATE tasks.item set name = $1  WHERE id = $2', [name, id], (error, results)=> {
  if(error) {
    throw error
  }
  response.status(200).send(results)
})
}

let deleteItem = (request, response) => {
  const id = request.params.id
    console.log(id)

  client.query('DELETE FROM tasks.item WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}


module.exports =  { getItems, setItem, deleteAllItems, updateItemState, getCompletedItems,getInCompletedItems, setEditedItem, deleteItem}