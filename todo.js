'use strict'
const ul = document.getElementById('ul')
const addButton = document.getElementById('addtask')
const input = document.getElementById('texto') // new task
const completedButton = document.getElementById('completed')
const allItemsButton = document.getElementById('all')
const incompletedButton = document.getElementById('incompleted')
const clearButton = document.getElementById('clear')
let itemsArray = window.localStorage.getItem('items') ? JSON.parse(window.localStorage.getItem('items')) : []
// console.log(itemsArray)
//  creating a new task item
const listMaker = (text, id, completed) => {
  let listItem = document.createElement('li')
  let checkBox = document.createElement('input')// checkbox
  let label = document.createElement('label')
  let editInput = document.createElement('input')
  let editButton = document.createElement('button')
  editButton.addEventListener('click', editTask)
  let buttonText = editButton.textContent
  let editButtonText = function () {
    if (buttonText === 'Edit') {
      buttonText.textContent = 'Save'
    } else {
      buttonText.textContent = 'Edit'
    }
  }
  editButton.addEventListener('click', editButtonText)
  // let deleteButton = document.createElement('button')
  // deleteButton.addEventListener('click', deleteTask)
  let detailsButton = document.createElement('button')
  // detailsButton.addEventListener('click', taskDetails)
  detailsButton.addEventListener('click', toggleModal)
  detailsButton.addEventListener('click', getValues)

  checkBox.addEventListener('click', checkFunction)

  checkBox.type = 'checkbox'
  editInput.type = 'text'

  editButton.setAttribute('class', 'edit')
  editButton.textContent = 'Edit'
  editButton.className = 'edit'

  // deleteButton.textContent = 'Delete'
  // deleteButton.className = 'delete'
  detailsButton.textContent = 'Details'
  detailsButton.className = 'details'

  label.textContent = text
  listItem.setAttribute('id', id)
  checkBox.checked = completed
  let labelContainer = document.createElement('div')
  labelContainer.appendChild(checkBox)
  labelContainer.appendChild(label)
  labelContainer.appendChild(editInput)
  let bt = document.createElement('div')
  // bt.setAttribute('class', 'updateBtn')
  // listItem.appendChild(deleteButton)
  bt.appendChild(editButton)
  bt.appendChild(detailsButton)
  listItem.appendChild(labelContainer)
  listItem.appendChild(bt)
  ul.appendChild(listItem)
  input.value = ''
}

function Todo (name) {
  this.name = name
  this.completed = false
  this.id = String(Math.floor(Math.random() * (itemsArray.length + 1234)))
  this.notes = ''
  this.dueDate = 'No date set'
  this.priority = 'None'
  this.priorityId = 0
  this.identifier = false
}
itemsArray.forEach(item => {
  listMaker(item.name, item.id, item.completed)
})

// addButton.addEventListener('click', checkInput)

addButton.addEventListener('click', function () {
  console.log('Add task...')
  if (input.value) {
    let taskObj = new Todo(input.value)
    itemsArray.push(taskObj)
    console.log(typeof itemsArray)
    window.localStorage.setItem('items', JSON.stringify(itemsArray))
    listMaker(input.value, taskObj.id, this.completed)
  }
})

clearButton.addEventListener('click', function () {
  window.localStorage.clear()
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild)
  }
  itemsArray = []
})

function checkFunction (e) {
  if (e.target.checked) {
    let taskItems = JSON.parse(window.localStorage.getItem('items'))
    for (let item of taskItems) {
      if (item.id === e.target.parentNode.parentNode.id) {
        item.completed = true
      }
    }
    window.localStorage.setItem('items', JSON.stringify(taskItems))
  } else {
    let taskItems = JSON.parse(window.localStorage.getItem('items'))
    for (let item of taskItems) {
      if (item.id === e.target.parentNode.parentNode.id) {
        item.completed = false
      }
    }
    window.localStorage.setItem('items', JSON.stringify(taskItems))
  }
}

completedButton.addEventListener('click', function () {
  let taskItems = JSON.parse(window.localStorage.getItem('items'))
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild)
  }
  for (let item of taskItems) {
    if (item.completed === true) listMaker(item.name, item.id, item.completed)
  }
})

incompletedButton.addEventListener('click', function () {
  let taskItems = JSON.parse(window.localStorage.getItem('items'))
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild)
  }
  for (let item of taskItems) {
    if (item.completed === false) listMaker(item.name, item.id, item.completed)
  }
})

allItemsButton.addEventListener('click', function () {
  let taskItems = JSON.parse(window.localStorage.getItem('items'))
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild)
  }
  for (let item of taskItems) {
    listMaker(item.name, item.id, item.completed)
  }
})

function editTask (e) {
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
  let itemsArray = JSON.parse(window.localStorage.getItem('items'))
  for (let item of itemsArray) {
    if (item.id === listItem.id) {
      item.name = label.textContent
    }
  }
  window.localStorage.setItem('items', JSON.stringify(itemsArray))
}

// function deleteTask () {
//   console.log('Delete task')
//   var listItem = this.parentNode
//   var ul = listItem.parentNode
//   ul.removeChild(listItem)
// }
var update = document.querySelector('.updateTask')
// let list = document.getElementsByTagName('li')
// var trigger = document.querySelector('.task-editor')
var closeButton = document.querySelector('.close-button')
function toggleModal () {
  // var id = e.target.parentNode.parentNode.id
  update.classList.toggle('show-modal')
  // updateVal(id)
  // console.log(update)
}

// function windowOnClick (event) {
//   if (event.target === update) {
//     toggleModal()
//   }
// }
function getValues (e) {
  var id = e.target.parentNode.parentNode.id
  let itemsArray = JSON.parse(window.localStorage.getItem('items'))
  for (let item of itemsArray) {
    if (id === item.id) {
      let selIndex = document.getElementById('priority')
      // let opt = document.getElementById('priority').options
      selIndex.value = item.priority
      document.getElementById('date').value = item.dueDate
      document.getElementById('tasknote').value = item.notes
      item.identifier = true
    }
  }
  window.localStorage.setItem('items', JSON.stringify(itemsArray))
}
closeButton.addEventListener('click', toggleModal)
// list.addEventListener('click', windowOnClick)
// console.log(document.getElementsByClassName('tasknote').value)

closeButton.addEventListener('click', setVal)
function setVal () {
  let selIndex = document.getElementById('priority')
  // let opt = document.getElementById('priority').options
  let priority = selIndex.value
  let dueDate = document.getElementById('date').value
  let notes = document.getElementById('tasknote').value
  let itemsArray = JSON.parse(window.localStorage.getItem('items'))
  for (let item of itemsArray) {
    if (item.identifier === true) {
      item.priority = priority
      item.dueDate = dueDate
      item.notes = notes
      item.identifier = false
    }
  }
  window.localStorage.setItem('items', JSON.stringify(itemsArray))
  // console.log(e.target.parentNode.parentNode.parentNode)
  // console.log(notes)
  // console.log(dueDate)
  // console.log(selValue)
}
