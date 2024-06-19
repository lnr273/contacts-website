// making header sticky
const header = document.getElementById("header")
const bigHeader = document.querySelector(".big-header")
const h2 = document.getElementById("h2")
const sticky = header.offsetTop
window.onscroll = () => {
    if(window.scrollY > sticky) {
        header.classList.add("sticky")
        h2.classList.remove("hidden")
    } else {
        header.classList.remove("sticky")
        h2.classList.add("hidden")
    }
}

// CRUD localstorage
const getLocalStorage = () => JSON.parse(localStorage.getItem("dbContacts")) || []
const setLocalStorage = (contact) => localStorage.setItem("dbContacts", JSON.stringify(contact))

const createContact = (contact) => {
    const dbContact = getLocalStorage()
    dbContact.push(contact)
    dbContact.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
    })
    setLocalStorage(dbContact)
}

const updateContact = (index, contact) => {
    const dbContact  = getLocalStorage()
    dbContact[index] = contact
    setLocalStorage(dbContact)
}

const deleteContact = (index) => {
    const dbContact = getLocalStorage()
    dbContact.splice(index, 1)
    setLocalStorage(dbContact)
}

const re = /^\d+$/
let myNumber

// creating my number
const creatingMyNumber = () => {
    let ok = false
    const contact = getLocalStorage()
    contact.forEach((contact) => {
        if (contact.index === myNumber) {
            ok = true
        }
    })
    if (ok === false) {
        let myNumber = prompt("Insert your number: ")
        if (myNumber.match(re)) {
            const me = {index: myNumber, name: "me", phone: myNumber}
            createContact(me)
        } else {
            creatingMyNumber()
        }
    }
}
if (!localStorage.getItem("dbContacts")) creatingMyNumber()

// crud dom
const nameInput = document.getElementById("name-input")
const phoneInput = document.getElementById("phone-input")
const modal = document.getElementById("modal")
const container = document.getElementById("container")

const reset = () => window.location.reload()

const openForm = () => {
    document.getElementById("add-contact-header-btn").classList.add("hidden")
    modal.classList.remove("hidden")
    container.classList.add("hidden")
    header.classList.toggle("hidden")
}

const closeForm = () => {
    reset()
    document.getElementById("add-contact-header-btn").classList.remove("hidden")
    modal.classList.add("hidden")
    container.classList.remove("hidden")
}

// create a div element for each object in the local storage array, and a div for my own number when the page is loaded for the first time
const createDivContact = (contact, index) => {
    const dbContact = getLocalStorage()
    if (dbContact) {
        const div = document.createElement("div")
        div.classList.add("content")
        div.id = index
        if (contact.index === myNumber) {
            div.innerHTML = `
                <div class="contact-logo">${contact.name[0]}</div>
                ${contact.name} - (${contact.phone})
                <button type="button" class="edit-btn" id="edit-${index}">edit</button>
                <button type="button" class="delete-btn" id="delete-${index}">delete</button>
            `
            container.appendChild(div)  
        } else {
            div.innerHTML = `<div class="contact-logo">${contact.name[0]}</div>${contact.name} - (${contact.phone})
            <button type="button" class="edit-btn" id="edit-${index}">edit</button>`
            container.appendChild(div) 
        }
    } 
}

const isValidFields = () => document.getElementById("form").reportValidity()
const clearContainer = () => container.innerHTML = ""

//update the html with the local storage content
const updateContainer = () => {
    const dbContact = getLocalStorage()
    clearContainer()
    dbContact.forEach(createDivContact)
}

updateContainer()

// save the contact
const saveContact = () => {
    if (isValidFields()) {
        if (phoneInput.value.match(re)) {
            const contact = {
                name: nameInput.value,
                phone: phoneInput.value
            }
            const index = nameInput.dataset.index
            if (index === "new") {
                createContact(contact)
                clearContainer()
                updateContainer()
            } else {
                updateContact(index, contact)
                updateContainer()
            }
        } else {
            alert("Invalid number.")
        }
    }
    reset()
    closeForm()
}

// edit button function
const editContact = (index) => {
    const contact = getLocalStorage()[index]
    contact.index = index
    nameInput.value = contact.name
    phoneInput.value = contact.phone
    nameInput.dataset.index = contact.index
}

// find out which button was pressed
const editOrDelete = (event) => {
    if (event.target.type === "button") {
        const [action, index] = event.target.id.split("-")
        if (action === "edit") {
            openForm()
            editContact(index)
            updateContainer()
        } else {
            if (confirm(`Are you sure you want to delete ${getLocalStorage()[index].name}`)) {
                deleteContact(index)
                updateContainer()
            }
        }
    }
}

// search function
const searchInput = document.getElementById("search-input")
searchInput.addEventListener("input", (e) => {
    const dbContact = getLocalStorage()
    const value = e.target.value.toLowerCase()
    console.log(value)
    const divs = document.querySelectorAll(".content")

    for (let i = 0; i < dbContact.length; i++) {
        const isVisible = dbContact[i].name.toLowerCase().includes(value) || dbContact[i].phone.includes(value)
        divs[i].classList.toggle("hidden", !isVisible)

        console.log(divs[i])
    }
})

// Events
document.getElementById("search-btn").addEventListener("click", () => document.getElementById("search-input").classList.toggle("hidden"))
document.getElementById("container").addEventListener("click", editOrDelete)
document.getElementById("cancel-btn").addEventListener("click", closeForm)
document.getElementById("add-contact").addEventListener("click", openForm)
document.getElementById("add-contact-header-btn").addEventListener("click", openForm)
document.getElementById("save-contact").addEventListener("click", saveContact)
