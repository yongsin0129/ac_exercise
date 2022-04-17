const users = JSON.parse(localStorage.getItem('favoriteUser')) || []
let currentUsers = users
let favorites = JSON.parse(localStorage.getItem('favoriteUser')) || []
let usersByPage = []
const users_per_page = 12

renderUserList(calculateUsersByPage(1))
renderPaginator()