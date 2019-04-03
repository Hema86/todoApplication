'use strict'
const ul = document.getElementById('ul')
const addButton = document.getElementById('addtask')
const input = document.getElementById('texto') // new task
const completedButton = document.getElementById('completed')
const allItemsButton = document.getElementById('all')
const incompletedButton = document.getElementById('incompleted')
const clearButton = document.getElementById('clear')

fetch('http://localhost:3001/tasks')
  .then(function(response) {
    return response.json()
  })
  .then(function(myJson) {
    for (let item of myJson) {
      listMaker(item.name, item.id, item.completed)
    }
  })


const listMaker = (text, id, completed) => {
  let listItem = document.createElement('li')
  let checkBox = document.createElement('input')// checkbox
  let label = document.createElement('label')
  let editInput = document.createElement('input')
  let editButton = document.createElement('button')
  editButton.addEventListener('click', editTask)
  let buttonText = editButton.textContent
  let deleteButton = document.createElement('button')
  deleteButton.addEventListener('click', deleteTask)
  let detailsButton = document.createElement('button')
  // detailsButton.addEventListener('click', taskDetails)
  // detailsButton.addEventListener('click', toggleModal)
  // detailsButton.addEventListener('click', getValues)

  checkBox.addEventListener('click', checkFunction)

  checkBox.type = 'checkbox'
  editInput.type = 'text'

  // editButton.setAttribute('class', 'edit')
  editButton.textContent = 'Edit'
  editButton.className = 'edit'

  deleteButton.textContent = 'Delete'
  deleteButton.className = 'delete'
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
  bt.appendChild(deleteButton)
  listItem.appendChild(labelContainer)
  listItem.appendChild(bt)
  ul.appendChild(listItem)
  input.value = ''
}

function Todo(name) {
  this.name = name
  this.completed = false
  // this.id = String(Math.floor(Math.random() * (name.length + 1234)))
  this.notes = ''
  this.dueDate = 'No date set'
  this.priority = 'None'
  this.priorityId = 0
  this.identifier = false
}
addButton.addEventListener('click', function () {
  console.log('Add task...')
  // console.log(data)
  if (input.value) {
    const taskObj = new Todo(input.value) 
    const options = {
      method: 'POST',
      body: JSON.stringify(taskObj),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    fetch('http://localhost:3001/tasks', options)
      .then(res => res.json())
      .then(res => listMaker(res.name, res.id, res.completed))
  }
})

clearButton.addEventListener('click', function () {
  function deleteAll () {
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild)
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    fetch('http://localhost:3001/tasks', options)
      .then(res => res.json())
      .then(res => console.log('removed all tasks'))
    // write post
  }
  
})


function checkFunction(e) {
  console.log(e.target.parentNode.parentNode.id)
  console.log(e.target.checked)
  const value = { completed: e.target.checked, id: e.target.parentNode.parentNode.id }
  const options = {
  method: 'POST',
  body: JSON.stringify(value),
  headers: {
    'Content-Type': 'application/json'
  }
}

fetch('http://localhost:3001/tasks/completedstate', options)
  .then(res => res.json())
  .then(res => console.log('updated completed value to true'))
}


completedButton.addEventListener('click', function () {
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild)
  }
  fetch('http://localhost:3001/tasks/completedtasks')
  .then(function(response) {
    return response.json()
  })
  .then(function(myJson) {
    console.log(myJson)
    for (let item of myJson) {
      listMaker(item.name, item.id, item.completed)
    }
  })
})

incompletedButton.addEventListener('click', function () {
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild)
  }

fetch('http://localhost:3001/tasks/incompletedtasks')
.then(function(response) {
  return response.json()
})
.then(function(myJson) {
  console.log(myJson)
  for (let item of myJson) {
    listMaker(item.name, item.id, item.completed)
  }
})

})

allItemsButton.addEventListener('click', function () {
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild)
  }
  fetch('http://localhost:3001/tasks')
  .then(function(response) {
    return response.json()
  })
  .then(function(myJson) {
    for (let item of myJson) {
      listMaker(item.name, item.id, item.completed)
    }
  })
})

function editTask(e) {
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

//   const request = new XMLHttpRequest()
//   request.onreadystatechange = function() {
//     if (request.readyState == 4 &&request.status == 200) {
//        const data = JSON.parse(request.responseText)
//        console.log(data)
//        console.log('updated completed value to true')
//     }
//   }
//  request.open('POST', 'http://localhost:3001/tasks/updatedtask')
//  request.setRequestHeader('Content-type', 'application/json')
//  request.send(JSON.stringify(changeTask))
const options = {
  method: 'POST',
  body: JSON.stringify(changeTask),
  headers: {
    'Content-Type': 'application/json'
  }
}

fetch('http://localhost:3001/tasks/updatedtask', options)
  .then(res => res.json())
  .then(res => console.log('updated task value'))
}

function deleteTask() {
  console.log('Delete task')
  let listItem = this.parentNode.parentNode
  let ul = listItem.parentNode
  let id = listItem.id
  ul.removeChild(listItem)
 console.log(id)
 
}
// var update = document.querySelector('.updateTask')
// // let list = document.getElementsByTagName('li')
// // var trigger = document.querySelector('.task-editor')
// var closeButton = document.querySelector('.close-button')
// function toggleModal () {
//   // var id = e.target.parentNode.parentNode.id
//   update.classList.toggle('show-modal')
//   // updateVal(id)
//   // console.log(update)
// }

// // function windowOnClick (event) {
// //   if (event.target === update) {
// //     toggleModal()
// //   }
// // }
// function getValues (e) {
//   var id = e.target.parentNode.parentNode.id
//   let itemsArray = JSON.parse(window.localStorage.getItem('items'))
//   for (let item of itemsArray) {
//     if (id === item.id) {
//       let selIndex = document.getElementById('priority')
//       // let opt = document.getElementById('priority').options
//       selIndex.value = item.priority
//       document.getElementById('date').value = item.dueDate
//       document.getElementById('tasknote').value = item.notes
//       item.identifier = true
//     }
//   }
//   window.localStorage.setItem('items', JSON.stringify(itemsArray))
// }
// closeButton.addEventListener('click', toggleModal)
// // list.addEventListener('click', windowOnClick)
// // console.log(document.getElementsByClassName('tasknote').value)

// closeButton.addEventListener('click', setVal)
// function setVal () {
//   let selIndex = document.getElementById('priority')
//   // let opt = document.getElementById('priority').options
//   let priority = selIndex.value
//   let dueDate = document.getElementById('date').value
//   let notes = document.getElementById('tasknote').value
//   let itemsArray = JSON.parse(window.localStorage.getItem('items'))
//   for (let item of itemsArray) {
//     if (item.identifier === true) {
//       item.priority = priority
//       item.dueDate = dueDate
//       item.notes = notes
//       item.identifier = false
//     }
//   }
//   window.localStorage.setItem('items', JSON.stringify(itemsArray))
//   // console.log(e.target.parentNode.parentNode.parentNode)
//   // console.log(notes)
//   // console.log(dueDate)
//   // console.log(selValue)
// }
