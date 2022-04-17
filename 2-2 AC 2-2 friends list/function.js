const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'
const HTMLBody = document.querySelector('body')
const dataPanel = document.querySelector('#data-panel')
const searchBarByUsername = document.querySelector('#searchbar-by-username')
const paginator = document.querySelector('#paginator')


// 監聽器 for click 
HTMLBody.addEventListener('click', (e) => {
  const id = Number(e.target.dataset.id)
  switch (e.target.dataset.actionType) {
    // 點擊頭像開啟 info
    case ('card-modal'):
      showUserModal(id)
      break
    // add-to-favorites
    case ('add-favorite'):
      if (e.target.matches('.fa-solid')) {
        favorites.forEach((e, i) => {
          if (e.id === id) {
            favorites.splice(i, 1)
          }
        })
      } else {
        favorites.push(currentUsers.find(e => e.id === id))
      }
      localStorage.setItem('favoriteUser', JSON.stringify(favorites))
      e.target.classList.toggle('fa-solid')
      break
    // 刪除所有favorites
    case ('delete-favorite'):
      localStorage.removeItem('favoriteUser')
      location.reload()
      break
    // 點擊分頁器功能
    case ('paginator'):
      clickedPage = id
      usersByPage = calculateUsersByPage(clickedPage)
      renderUserList(usersByPage)
      break
  }
})
// 監聽 SearchBar 功能
searchBarByUsername.addEventListener('input', e => {
  const inputWord = e.target.value.trim().toLowerCase()
  currentUsers = users.filter(e => {
    return (e.name + e.surname).toLowerCase().includes(inputWord)
  })
  usersByPage = calculateUsersByPage(1)
  renderUserList(usersByPage)
  renderPaginator(currentUsers)
})
// render usersData on dataPanel
function renderUserList (data) {
  if (!data[0]) {
    dataPanel.innerHTML = `<div class="col"><h1 class="text-center">No Users</h1></div>`
    return
  }
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
  <div class="col-12 col-sm-6 col-md-3 col-lg-2 my-1">
    <div class="card">
      <img src="${item.avatar}" class="rounded" data-action-type="card-modal" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}" alt="user Poster">
      <div class="card-body">
        <h6 class="card-title">${item.name}</h6>
        <h6>${item.surname}</h6>
      </div>
      <div class="card-footer text-end">
        <i class="fa-regular fa-heart fs-2" data-action-type="add-favorite" data-id=${item.id}></i>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
  activeHeartIconOrNot()
}
// input [usersByFilter] then calculate and render paginator 
function renderPaginator (data = currentUsers) {
  const pages = Math.ceil(data.length / users_per_page)
  rawHTML = `<li class="nav-item"><a class="nav-link active" href="#" data-id=1 data-action-type="paginator" data-bs-toggle="pill">1</a></li>`
  for (let i = 1; i < pages; i++) {
    rawHTML += `<li class="nav-item"><a class="nav-link" href="#" data-id='${i + 1}' data-action-type="paginator" data-bs-toggle="pill">${i + 1}</a></li>`
  }
  paginator.innerHTML = rawHTML
}
// show user-modal info content 
function showUserModal (id) {
  const userTitle = document.querySelector('#user-modal-title')
  const userImage = document.querySelector('#user-modal-image')
  const userEmail = document.querySelector('#user-modal-email')
  const userAge = document.querySelector('#user-modal-age')
  const userBirth = document.querySelector('#user-modal-birthdate')
  axios.get(INDEX_URL + '/' + id)
    .then((response) => {
      const data = response.data
      userTitle.innerText = data.name + ' ' + data.surname
      userImage.innerHTML = `<img src="${data.avatar
        }" alt="user-poster" class="img-fluid img-thumbnail w-75">`
      userEmail.innerText = 'Email : ' + data.email
      userAge.innerText = 'age : ' + data.age
      userBirth.innerText = 'bitthdate : ' + data.birthday
    })
}
// input currentPage， return [ Data ] 
function calculateUsersByPage (page) {
  const startIndex = ((page - 1) * users_per_page)
  return currentUsers.slice(startIndex, startIndex + users_per_page)
}
// confirm heartIcon
function activeHeartIconOrNot () {
  favorites.forEach((e) => {
    const target = document.querySelector(`[data-action-type="add-favorite"][data-id="${e.id}"]`)
    if (!target) return
    target.classList.toggle('fa-solid')
  })
}

// 丟一個 event.target 判斷 heartIcon active or not
// function heartIconActiveOrNot (node) {
//   const targetId = Number(node.dataset.id)
//   if (node.matches('.fa-solid')) {
//     favorites.forEach((e, i) => {
//       if (e.id === targetId) {
//         favorites.splice(i, 1)
//       }
//     })
//     localStorage.setItem('favoriteUser', JSON.stringify(favorites))
//   } else if (!node.matches('.fa-solid')) {
//     favorites.push(currentUsers.find(e => e.id === targetId))
//     localStorage.setItem('favoriteUser', JSON.stringify(favorites))
//   }
//   node.classList.toggle('fa-solid')
// }
// if (favorites.some(e => e.id === item.id)) {
//   rawHTML += `<i class="fa-solid fa-regular fa-heart fs-3" id="add-to-favorite" data-id=${item.id}></i>`
// } else {
//   rawHTML += `<i class="fa-regular fa-heart fs-3" id="add-to-favorite" data-id=${item.id}></i>`
// }