// 監聽 data panel 點擊 more 會跑出 movie 細節
dataPanel.addEventListener('click', event => {
  if (event.target.matches('.btn-show-movie')) {
    view.showMovieModal(event.target.dataset.id)
  } else if (!event.target.matches('.btn-info') && event.target.matches('.btn-add-favorite')) {
    event.target.classList.add('btn-info')
    controller.removeFavorite(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    event.target.classList.remove('btn-info')
    controller.addToFavorite(Number(event.target.dataset.id))
  }
})

// 監聽 search bar 
searchForm.addEventListener('input', function onSearchFormSubmitted (event) {
  const keyword = searchInput.value.trim().toLowerCase()
  currentMovieData = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  currentMovieDataByPage = view.getMovieDataByPage()
  view.renderMovieList(currentMovieDataByPage, currentRenderStyle)
  view.renderPaginatorList(currentMovieData)
})

// 監聽 paginator
paginator.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    currentPage = Number(e.target.innerText)
    currentMovieDataByPage = view.getMovieDataByPage(currentPage)
    view.renderMovieList(currentMovieDataByPage, currentRenderStyle)
  }
})

// 監聽 renderStyle 
renderStyle.addEventListener('click', e => {
  switch (e.target.dataset.actionType) {
    case ('list-style'):
      currentRenderStyle = 'list'
      view.renderMovieList(currentMovieDataByPage, currentRenderStyle)
      break
    case ('card-style'):
      currentRenderStyle = 'card'
      view.renderMovieList(currentMovieDataByPage, currentRenderStyle)
      break
    case ('accordion-style'):
      currentRenderStyle = 'accordion'
      view.renderMovieList(currentMovieDataByPage, currentRenderStyle)
      break
    case ('carousel-style'):
      currentRenderStyle = 'carousel'
      view.renderMovieList(currentMovieDataByPage, currentRenderStyle)
      break
    case ('clear-all-favorites'):
      localStorage.removeItem('favoriteMovies')
      location.reload()
      break
  }
})