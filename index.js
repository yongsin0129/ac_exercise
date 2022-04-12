const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const renderStyle = document.querySelector('#render-style')
const pageNumber = 12
let currentPage = 1
const movies = []
let currentMovieData = [] // 使用 search 會改變資料，所以創立一個變數來裝
let currentMovieDataByPage = []
let currentRenderStyle = 'card'

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results) // API抓取全部的 movie 資料
    currentMovieData = movies
    currentMovieDataByPage = getMovieDataByPage(currentPage)
    renderMovieList(currentMovieDataByPage, currentRenderStyle)
    renderPaginatorList(movies)
  })
  .catch((err) => console.log(err))

// 監聽 data panel 點擊 more 會跑出 movie 細節
dataPanel.addEventListener('click', event => {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// 監聽 search bar 
searchForm.addEventListener('input', function onSearchFormSubmitted (event) {
  const keyword = searchInput.value.trim().toLowerCase()
  currentMovieData = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  currentMovieDataByPage = getMovieDataByPage()
  renderMovieList(currentMovieDataByPage, currentRenderStyle)
  renderPaginatorList(currentMovieData)
})

// 監聽 paginator
paginator.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    currentPage = Number(e.target.innerText)
    currentMovieDataByPage = getMovieDataByPage(currentPage)
    renderMovieList(currentMovieDataByPage, currentRenderStyle)
  }
})

// 監聽 renderStyle 
renderStyle.addEventListener('click', e => {
  switch (e.target.dataset.actionType) {
    case ('list-style'):
      currentRenderStyle='list'
      renderMovieList(currentMovieDataByPage, currentRenderStyle)
      break
    case ('card-style'):
      currentRenderStyle = 'card'
      renderMovieList(currentMovieDataByPage, currentRenderStyle)
      break
  }
})


function renderMovieList (data, style) {
  switch (style) {
    case 'list':
      console.log("list style")
      renderListStyle(data)
      break
    case 'card':
      console.log("card style")
      renderCardStyle(data)
      break
  }
}

function showMovieModal (id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}

function addToFavorite (id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

function getMovieDataByPage (page = 1) {
  const startIndex = ((page - 1) * pageNumber)
  return currentMovieData.slice(startIndex, startIndex + pageNumber)
}

function renderPaginatorList (data) {
  const pages = Math.ceil(data.length / pageNumber)
  let rawHTML = ''
  for (let index = 0; index < pages; index++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#">${index + 1}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function renderListStyle (data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
    <div class="row">
      <div class="col-8">
        <h6 class="card-title">${item.title}</h6>
      </div>
      <div class="col-4 footer">
        <div class="btn float-end">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}
function renderCardStyle (data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
    <div class="my-1 col-sm-2">
      <div class="mb-2 h-100">
        <div class="card h-100">
          <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h6 class="card-title">${item.title}</h6>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    </div>`
  })
  dataPanel.innerHTML = rawHTML
}