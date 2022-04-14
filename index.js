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
const favoriteMovieList = JSON.parse(localStorage.getItem('favoriteMovies')) || []

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results) // API抓取全部的 movie 資料
    currentMovieData = movies
    currentMovieDataByPage = getMovieDataByPage(currentPage)
    renderMovieList(currentMovieDataByPage, currentRenderStyle)
    renderPaginatorList(movies)
    activeAddIconOrNot()
  })
  .catch((err) => console.log(err))

// 監聽 data panel 點擊 more 會跑出 movie 細節
dataPanel.addEventListener('click', event => {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    event.target.classList.remove('btn-info')
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
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
  })
}

function addToFavorite (id) {
  const movie = movies.find((movie) => movie.id === id)
  if (favoriteMovieList.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  favoriteMovieList.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovieList))
}

function getMovieDataByPage (page = 1) {
  const startIndex = ((page - 1) * pageNumber)
  return currentMovieData.slice(startIndex, startIndex + pageNumber)
}

function renderPaginatorList (data) {
  const pages = Math.ceil(data.length / pageNumber)
  let rawHTML = '<li class="nav-item"><a class="nav-link active" href="#" data-bs-toggle="pill">1</a></li>'
  for (let index = 1; index < pages; index++) {
    rawHTML += `<li class="nav-item"><a class="nav-link" href="#" data-bs-toggle="pill">${index + 1}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function activeAddIconOrNot () {
  favoriteMovieList.forEach((e) => {
    const target = document.querySelector(`.btn-info[data-id="${e.id}"]`)
    if (!target) return
    target.classList.remove('btn-info')
  })
}

// 以下為本次作業新增的程式碼
// 監聽 renderStyle 
renderStyle.addEventListener('click', e => {
  switch (e.target.dataset.actionType) {
    case ('list-style'):
      currentRenderStyle = 'list'
      renderMovieList(currentMovieDataByPage, currentRenderStyle)
      break
    case ('card-style'):
      currentRenderStyle = 'card'
      renderMovieList(currentMovieDataByPage, currentRenderStyle)
      break
    case ('accordion-style'):
      currentRenderStyle = 'accordion'
      renderMovieList(currentMovieDataByPage, currentRenderStyle)
      break
    case ('carousel-style'):
      currentRenderStyle = 'carousel'
      renderMovieList(currentMovieDataByPage, currentRenderStyle)
      break
    case ('clear-all-favorites'):
      localStorage.removeItem('favoriteMovies')
      location.reload()
      break
  }
})

function renderMovieList (data, style) {
  switch (style) {
    case 'list':
      renderListStyle(data)
      break
    case 'card':
      renderCardStyle(data)
      break
    case 'accordion':
      renderAccordionStyle(data)
      break
    case 'carousel':
      renderCarouselStyle(data)
      break
  }
  activeAddIconOrNot()
}

// render style function

function renderListStyle (data) {
  let rawHTML = '<table class="table table-hover">'
  data.forEach((item) => {
    rawHTML += `    
    <tr>
      <th class="align-middle fs-4" scope="row" >${item.title}</th>
      <td>
        <button class="btn btn-info btn-add-favorite float-end m-1" data-id="${item.id}">+</button>
        <button class="btn btn-primary btn-show-movie float-end m-1" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
      </td>
    </tr>
    `
  })
  rawHTML += `</table>`
  dataPanel.innerHTML = rawHTML
}

function renderCardStyle (data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
    <div class="my-1 col-sm-2">
      <div class="mb-2 h-100">
        <div class="card h-100">
          <img src="${POSTER_URL + item.image}" class="card-img-top w-75" alt="Movie Poster">
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

function renderAccordionStyle (data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
    <div class="accordion" id="accordionExample">
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button collapsed fs-4" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${item.id}">
            ${item.title}
          </button>
        </h2>
      <div id="collapse${item.id}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
        <div class="accordion-body row align-items-center">
          <div class="col-2"><img src="${POSTER_URL + item.image}" class="card-img-top w-100" alt="Movie Poster"></div>
          <div class="col-8">
            <h3>${item.description}</h3>
            <h5 style="color: rgb(255,165,0)">${item.release_date}</h5>
          </div>
          <div class="col-2"><button class="btn btn-info btn-add-favorite float-end btn-lg" data-id="${item.id}">+</button></div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function renderCarouselStyle (data = currentMovieDataByPage) {
  let rawHTML = ''
  rawHTML += `      
      <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel" data-bs-interval="1000">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <figure class="">
              <img src="${POSTER_URL + data[0].image}" class="rounded mx-auto d-block">
              <figcaption class="figure-caption text-center fs-4">${data[0].description}
                <button class="btn btn-info btn-add-favorite" data-id="${data[0].id}">+</button>
              </figcaption>
            </figure>
          </div>
        `
  data.forEach((item, index) => {
    if (index === 0) { return }
    rawHTML += `
          <div class="carousel-item">         
            <figure class="">
              <img src="${POSTER_URL + item.image}" class="rounded mx-auto d-block">
              <figcaption class="figure-caption text-center fs-4">${item.description}
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              </figcaption>
            </figure>
          </div>
    `
  })
  rawHTML += `
          </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
  `
  dataPanel.innerHTML = rawHTML
}
