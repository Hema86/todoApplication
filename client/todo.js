'use strict'
const ul = document.getElementById('ul')
const addButton = document.getElementById('addtask')
const input = document.getElementById('texto') // new task
const completedButton = document.getElementById('completed')
const allItemsButton = document.getElementById('all')
const incompletedButton = document.getElementById('incompleted')
const clearButton = document.getElementById('clear')
let state

const getAllTasks = async (url) => {
  const response = await fetch(url)
  const tasks = await response.json()
  return tasks
}

const start = async function () {
  state = await getAllTasks('http://localhost:3000/tasks')
  displayTask(state)
}

start()

function displayTask (tasks) {
  deleteList()
  for (let item of tasks) {
    let list = createList(item.name, item.id, item.completed)
    ul.appendChild(list)
  }
}

const deleteList = function () {
  while (ul.firstChild && ul.removeChild(ul.firstChild)) {}
}

const createList = (text, id, completed) => {
  let listItem = document.createElement('li')
  let label = document.createElement('label')
  let checkBox = createInput('checkbox')
  let editInput = createInput('text')
  let buttonHolder = document.createElement('div')
  buttonHolder.setAttribute('class', 'updateBtn')
  let editButton = createButton('EDIT', 'edit', editTask)
  let deleteButton = createButton('DELETE', 'delete', deleteTask)
  let detailsButton = createButton('DETAILS', 'details', updateTask)
  buttonHolder.appendChild(editButton)
  buttonHolder.appendChild(detailsButton)
  buttonHolder.appendChild(deleteButton)
  // detailsButton.addEventListener('click', taskDetails)
  // editButton.addEventListener('click', toggleModal)
  // editButton.addEventListener('click', getValues)
  checkBox.addEventListener('click', checkFunction)
  // detailsButton.textContent = 'Details'
  // detailsButton.className = 'details'
  label.textContent = text
  listItem.setAttribute('id', id)
  checkBox.checked = completed
  let labelContainer = document.createElement('div')
  labelContainer.appendChild(checkBox)
  labelContainer.appendChild(label)
  labelContainer.appendChild(editInput)
  listItem.appendChild(labelContainer)
  listItem.appendChild(buttonHolder)
  input.value = ''
  return listItem
}
const createButton = function (textContent, cls, clickFun) {
  let button = document.createElement('button')
  button.textContent = textContent
  button.className = cls
  button.onclick = clickFun
  return button
}
const createInput = function (type) {
  let input = document.createElement('input')// checkbox
  input.type = type
  return input
}

addButton.addEventListener('click', async function (e) {
  let text = input.value.trim()
  if (text === '') {
    alert('Please enter a task name')
    return null
  }
  const taskObj = new Todo(text)
  addTask(taskObj)
})

function Todo (name) {
  this.name = name
  this.completed = false
  // this.id = String(Math.floor(Math.random() * (name.length + 1234)))
  this.notes = ''
  this.dueDate = 'No date set'
  this.priority = 'None'
  this.priorityId = 0
  this.identifier = false
}

const addTask = async function (task) {
  let taskDetails = await saveTask(task, 'http://localhost:3000/tasks/create')
  // console.log(taskDetails)
  // console.log(state)
  task.id = taskDetails.id
  state.unshift(task)
  // console.log(state)
  displayTask(state)
}

const saveTask = async function (task, url) {
  const options = {
    method: 'POST',
    body: JSON.stringify(task),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const response = await fetch(url, options)
  const data = await response.json()
  console.log('task added')
  return data
}
clearButton.addEventListener('click', function () {
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild)
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  fetch('http://localhost:3000/tasks/deleteall', options)
    .then(res => res.json())
    .then(res => console.log('removed all tasks'))
    // write post
})

async function checkFunction (e) {
  // console.log(e.target.parentNode.parentNode.id)
  // console.log(e.target.checked)
  if (e.target.checked === true) {
    let label = document.getElementsByName('label')
    // let listItem = document.createElement('li').label
    label.style = 'text-decoration: line-through'
  }
  const value = { completed: e.target.checked, id: e.target.parentNode.parentNode.id }
  for (let item in state) {
    console.log(state[item].id)
    if (state[item].id === value.id) {
      state[item].completed = value.completed
    }
  }
  //  console.log("state-->"+state)
  saveTask(value, 'http://localhost:3000/tasks/completedstate')
  // console.log('updated completed value to true')
}

completedButton.addEventListener('click', async function () {
  deleteList()
  let arr = []
  for (let item of state) {
    if (item.completed === true) {
      arr.push(item)
      displayTask(arr)
      // let list = createList(item.name, item.id, item.completed)
    }
  }
})

incompletedButton.addEventListener('click', async function () {
  deleteList()
  let arr = []
  for (let item of state) {
    if (item.completed === false) {
      arr.push(item)
      displayTask(arr)
      // let list = createList(item.name, item.id, item.completed)
    }
  }
})

allItemsButton.addEventListener('click', function () {
  deleteList()
  displayTask(state)
})

async function editTask (e) {
  let listItem = e.target.parentNode.parentNode
  let editInput = listItem.querySelector('input[type=text]')
  let label = listItem.querySelector('label')
  let containsClass = listItem.classList.contains('editMode')
  let editButton = listItem.querySelector('button.edit')
  if (containsClass) {
    label.textContent = editInput.value
    editButton.textContent = 'Edit'
    editButton.classList.remove('save')
  } else {
    editInput.value = label.textContent
    editButton.textContent = 'Save'
    editButton.classList.add('save')
  }
  listItem.classList.toggle('editMode')
  let changeTask = { name: label.textContent, id: listItem.id }
  for (let item of state) {
    if (item.id === changeTask.id) item.name = label.textContent
  }
  saveTask(changeTask, 'http://localhost:3000/tasks/updatedtask')
}

async function deleteTask () {
  console.log('Delete task')
  let listItem = this.parentNode.parentNode
  let ul = listItem.parentNode
  let id = listItem.id
  let value = { id }
  for (let item of state) {
    if (item.id === value.id) state.splice(state.indexOf(item), 1)
  }
  console.log(state)
  ul.removeChild(listItem)
  saveTask(value, 'http://localhost:3000/tasks/deletetask')
}

const toggleModal = function () {
  var update = document.querySelector('.updateTask')
  update.classList.toggle('show-modal')
}
const updateTask = function (e) {
  toggleModal()
  getValues(e)
}

function getValues (e) {
  var id = e.target.parentNode.parentNode.id
  for (let item of state) {
    console.log(item)
    if (item.id === id) {
      let selIndex = document.getElementById('priority')
      selIndex.value = item.priority
      document.getElementById('date').value = item.duedate
      document.getElementById('tasknote').value = item.notes
      item.identifier = true
    }
  }
}
var closeButton = document.querySelector('.close-button')
closeButton.addEventListener('click', toggleModal)
closeButton.addEventListener('click', async function () {
  // let itemsArray = JSON.parse(window.localStorage.getItem('items'))
  let updateObj
  for (let item of state) {
    if (item.identifier === true) {
      item.priority = document.getElementById('priority').value
      item.duedate = document.getElementById('date').value
      item.notes = document.getElementById('tasknote').value
      item.identifier = false
      updateObj = { priority: item.priority, duedate: item.duedate, notes: item.notes, identifier: item.identifier, id: item.id }
    }
  }
  saveTask(updateObj, 'http://localhost:3000/tasks/updatedetails')
  // console.log(e.target.parentNode.parentNode.parentNode)
  // console.log(notes)
  // console.log(dueDate)
  // console.log(selValue)
  console.log(state)
  const deleteButton = document.getElementsByClassName('delete')
  deleteButton.addEventListener('click', deleteTask)
})
