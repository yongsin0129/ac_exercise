const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const renderStyle = document.querySelector('#render-style')
const pageNumber = 12
let currentPage = 1
let currentMovieData = [] // 使用 search 會改變資料，所以創立一個變數來裝
let currentMovieDataByPage = []
let currentRenderStyle = 'card'

const view = {

  showMovieModal (id) {
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
  },

  getMovieDataByPage (page = 1) {
    const startIndex = ((page - 1) * pageNumber)
    return currentMovieData.slice(startIndex, startIndex + pageNumber)
  },

  renderPaginatorList (data) {
    const pages = Math.ceil(data.length / pageNumber)
    let rawHTML = '<li class="nav-item"><a class="nav-link active" href="#" data-bs-toggle="pill">1</a></li>'
    for (let index = 1; index < pages; index++) {
      rawHTML += `<li class="nav-item"><a class="nav-link" href="#" data-bs-toggle="pill">${index + 1}</a></li>`
    }
    paginator.innerHTML = rawHTML
  },

  renderMovieList (data, style) {
    switch (style) {
      case 'list':
        view.renderListStyle(data)
        break
      case 'card':
        view.renderCardStyle(data)
        break
      case 'accordion':
        view.renderAccordionStyle(data)
        break
      case 'carousel':
        view.renderCarouselStyle(data)
        break
    }
    view.activeAddIconOrNot()
  },

  activeAddIconOrNot () {
    favoriteMovieList.forEach((e) => {
      const target = document.querySelector(`.btn-info[data-id="${e.id}"]`)
      if (!target) return
      target.classList.remove('btn-info')
    })
  },

  renderListStyle (data) {
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
  },

  renderCardStyle (data) {
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
  },

  renderAccordionStyle (data) {
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
  },

  renderCarouselStyle (data = currentMovieDataByPage) {
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
  },
}

const controller = {

  addToFavorite (id) {
    const movie = movies.find((movie) => movie.id === id)
    favoriteMovieList.push(movie)
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovieList))
  },

  removeFavorite (id) {
    favoriteMovieList.forEach((movie, index) => {
      if (movie.id === id) {
        favoriteMovieList.splice(index, 1)
        localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovieList))
      }
    })
  }
}