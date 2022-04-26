const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
const favoriteMovieList = JSON.parse(localStorage.getItem('favoriteMovies')) || []

currentMovieData = favoriteMovieList
currentMovieDataByPage = view.getMovieDataByPage(currentPage)
view.renderMovieList(currentMovieDataByPage, currentRenderStyle)
view.renderPaginatorList(currentMovieData)
view.activeAddIconOrNot()

