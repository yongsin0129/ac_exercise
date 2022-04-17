const users = []
let currentUsers = []
let usersByPage = []
let favorites = JSON.parse(localStorage.getItem('favoriteUser')) || []
const users_per_page = 12


axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results)
    currentUsers = users
    renderUserList(calculateUsersByPage(1))
    renderPaginator()
  })
  .catch((err) => console.log(err))  