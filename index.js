const movies = []
const favoriteMovieList = JSON.parse(localStorage.getItem('favoriteMovies')) || []

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results) // API抓取全部的 movie 資料
    currentMovieData = movies
    currentMovieDataByPage = view.getMovieDataByPage(currentPage)
    view.renderMovieList(currentMovieDataByPage, currentRenderStyle)
    view.renderPaginatorList(movies)
    view.activeAddIconOrNot()
  })
  .catch((err) => console.log(err))


