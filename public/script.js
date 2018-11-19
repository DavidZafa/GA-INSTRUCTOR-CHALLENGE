//Fetch movies from the backend
function searchMovieByTitle(title) {
  return fetch("/search?name="+title)
    .then((res) => { return res.json() })
}
//Set a movie as a favorite
function toggleMovieFavorite(movieData) {
  movieData.isFavorite = !movieData.isFavorite
  var reqHeaders = new Headers()
  reqHeaders.append('Content-type', 'application/json')

  return fetch("/favorites", {
    method: "POST",
    headers: reqHeaders,
    body: JSON.stringify(movieData)
  })
  .then(res => { return res.json() })
}

//Fetches list of favorites from the backend
function getMovieFavorites() {
  return fetch("/favorites")
    .then((res) => { return res.json() })
}

//Gives all the details for a movie
function getMovieDetails(imdbID) {
  return fetch("/details?imdbID="+imdbID)
    .then((res) => { return res.json() })
}

//Creates class for favorite button
function getFavoriteIconClass(isFavorite) {
  return isFavorite
}

//Creates button for setting a movie as a favorite
function renderFavoritesButton(movieData) {

  var button = document.createElement("a")
  button.setAttribute("class", "button")

  var iconWrapper = document.createElement("span")
  iconWrapper.setAttribute("class","icon")

  var icon = document.createElement("i")
  icon.setAttribute("class", getFavoriteIconClass(movieData.isFavorite || false))
  iconWrapper.appendChild(icon)
  button.appendChild(iconWrapper)

  //Sets an onclick event to update the data in the backend for the newly favorited movie
  button.onclick = function () {
    toggleMovieFavorite(movieData)
      .then(newMovieData => {
        icon.setAttribute("class", getFavoriteIconClass(newMovieData.isFavorite))
      })

    return false
  }
  return button
}

//Creates a list of the multiple ratings for the selected movie
function renderRatingsList(ratings) {
  var span = document.createElement("span")
  ratings.forEach(rating => {
    var p = document.createElement("p")
    p.textContent = rating.Source + " - " + rating.Value
    span.appendChild(p)
  })

  return span
}


//Creates a table to display all the details of a movie
function renderMovieDetailsTable(movieData) {
  var table = document.createElement("table")
  table.setAttribute("class", "table")

//Iterates through every key in the movieData object and creates a new table row for each unique key
  for(key in movieData)
  {
    if(!movieData.hasOwnProperty(key))
      continue;

//The poster is already shown so we don't need to see it again in the details
    if(key === 'Poster')
      continue;

    var row = table.insertRow()
    var title = row.insertCell()
    var value = row.insertCell()

    title.textContent = key

    if(key === 'Ratings')
      value.appendChild(renderRatingsList(movieData[key]))
    else
      value.textContent = movieData[key]
  }

  return table;
}

//Creates a container to display the Poster and all the details of a movie
function renderMovieDetails(movieData) {


//These variables create contianers to hold the details, all the content, and everything else associated with the imdbID
  var box = document.createElement("div")
  box.setAttribute("class", "box")

  var content = document.createElement("div")
  content.setAttribute("class", "content")

  var imgWrapper = document.createElement("p")
  imgWrapper.setAttribute("class", "image" )

  var movieImg = document.createElement("img")
  movieImg.setAttribute("src", movieData.Poster)
  movieImg.setAttribute("alt", movieData.Title)

  var movieCardTitle = document.createElement("p")
  movieCardTitle.setAttribute("class", "title")
  movieCardTitle.textContent = movieData.Title

  var movieCardSubtitle = document.createElement("p")
  movieCardSubtitle.setAttribute("class", "subtitle")
  movieCardSubtitle.textContent = movieData.Year
  content.appendChild(movieCardTitle)
  content.appendChild(movieCardSubtitle)
  imgWrapper.appendChild(movieImg)
  content.appendChild(imgWrapper)
  content.appendChild(renderMovieDetailsTable(movieData))
  box.appendChild(content)

  return box
}


//This function creates a link for the user to click on to display all the details of the movie in the modal
function renderDetailsLink(imdbID) {
  var button = document.createElement("a")
  button.setAttribute("class", "level")

  var icon = document.createElement("i")
  button.appendChild(icon)
  button.appendChild(document.createTextNode("Details"))

//This button onclick handles the details modal
  button.onclick = function () {
    showMovieDetailsModal(imdbID)

    return false;
  };

  return button;
}


//This creates a container to hold the link for showing the details
function renderDetailsLevel(movieData) {
  var level = document.createElement("nav")
  level.setAttribute("class", "level")

  var levelLeft = document.createElement("div")
  levelLeft.setAttribute("class", "level-left")
  levelLeft.append(renderDetailsLink(movieData.imdbID))
  level.append(levelLeft)

  return level;
}

//Creates a media object to show the basic info for a given movie. It displays a mini-image of the poster, the title, and the year released.
//It contians the details link and the favorites button
function renderMovieMediaObject(movieData) {

  var article = document.createElement("article")
  article.setAttribute("class", "media")

  var figure = document.createElement("figure")
  figure.setAttribute("class", "media-left")

  var imgWrapper = document.createElement("p")
  imgWrapper.setAttribute("class", "image is-64x64 is-3by4")

  var movieImg = document.createElement("img")
  movieImg.setAttribute("src", movieData.Poster)
  movieImg.setAttribute("alt", movieData.Title)

  var mediaContent = document.createElement("div")
  mediaContent.setAttribute("class", "media-content")

  var contentWrapper = document.createElement("div")
  contentWrapper.setAttribute("class", "content")

  var movieCardTitle = document.createElement("p")
  movieCardTitle.setAttribute("class", "title is-5")
  movieCardTitle.textContent = movieData.Title

  var movieCardSubtitle = document.createElement("p")
  movieCardSubtitle.setAttribute("class", "subtitle is-6")
  movieCardSubtitle.textContent = movieData.Year

  var mediaRight = document.createElement("div")
  mediaRight.setAttribute("class", "media-right")
  imgWrapper.appendChild(movieImg)
  figure.appendChild(imgWrapper)
  article.appendChild(figure)
  contentWrapper.appendChild(movieCardTitle)
  contentWrapper.appendChild(movieCardSubtitle)
  contentWrapper.appendChild(renderDetailsLevel(movieData))
  mediaContent.appendChild(contentWrapper)
  article.appendChild(mediaContent)
  mediaRight.appendChild(renderFavoritesButton(movieData))
  article.appendChild(mediaRight)

  return article;
}


//Creates a container for a movie MediaObject
function renderMovieTile(movieMediaObject) {
  var tile = document.createElement("div")
  tile.setAttribute("class", "tile is-child box")
  tile.appendChild(movieMediaObject)

  return tile;
}

//This creates a single row using the list of movie titles given

function renderMovieTileRow(movieTiles) {
  var ancenstor = document.createElement("div")
  ancenstor.setAttribute("class", "tile is-ancestor")
  movieTiles.forEach((tile) => {
    var parent = document.createElement("div")
    parent.setAttribute("class", "tile is-parent")
    parent.appendChild(tile)
    ancenstor.appendChild(parent)
  });

  return ancenstor;
}

function renderMovieTitles(movies) {
  var movieCardsContainer = document.getElementById("movieCards")

  movieCardsContainer.innerHTML = ''

  if(movies.length == 0)
  {
    movieCardsContainer.setAttribute("class", "has-text-centered")
  }

  while(movies.length > 0)
  {
    movieCardsContainer.appendChild(
      renderMovieTileRow(

        movies.splice(0, 3).map(movie =>
          renderMovieTile(renderMovieMediaObject(movie))
        )
      )
    )
  }
}

//This callback is used to send a movie search to the backend and display the results
function submitMovieSearch() {


//This variable grabs the search from the text box
  var searchText = document.getElementById("movieSearchText").value
  searchMovieByTitle(searchText)
    .then((movies) => {
      renderMovieTitles(movies)
    })
}

//Displays the list of favorites
function showFavorites() {
  getMovieFavorites()
    .then(favorites => {
      renderMovieTitles(favorites)
    })
}

//This fetches the full details of the movies in your favorites and then displays them
function showMovieDetailsModal(imdbID) {
  getMovieDetails(imdbID)
    .then(movieData => {
      var detailsContent = document.getElementById("movieDetails")
      detailsContent.innerHTML = ''
      detailsContent.appendChild(renderMovieDetails(movieData))
      document.getElementById("detailsModal")
        .setAttribute("class", "modal is-active")
    })
}

//Callback used to hide the details
function hideDetailsModal() {
  document.getElementById("detailsModal")
    .setAttribute("class", "modal")
}
