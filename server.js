var express = require('express')
var fs = require('fs')
var path = require('path')
var request = require('request-promise')
var querystring = require('querystring')
var bodyParser = require('body-parser')
var app = express()
const omdbApiKey = "7af918be"
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', express.static(path.join(__dirname, 'public')))

//This returns a list of movie data
function searchMovie(searchText) {
	searchText = searchText.trim()
  if(searchText === '')
  {
    return Promise.resolve([])
  }
  var search = querystring.stringify({s: searchText, apikey: omdbApiKey})
    return request('http://www.omdbapi.com/?'+search)
    .then((moviesAsJSONString) => {
      return JSON.parse(moviesAsJSONString).Search || []
    });
}

//Fetches the full details of the movie given the ID
function getMovieDetails(imdbID) {
  if(typeof(imdbID) != 'string' || imdbID === '')
  {
    return Promise.resolve([])
  }
  var search = querystring.stringify({i: imdbID, apikey: omdbApiKey});

//Sends the request
	return request('http://www.omdbapi.com/?'+search)
    .then((moviesAsJSONString) => {
      return JSON.parse(moviesAsJSONString)
    })
}
function getFavoritesDB() {
  return JSON.parse(fs.readFileSync('./data.json'))
}

function setFavoritesDB(favorites) {
  fs.writeFileSync('./data.json', JSON.stringify(favorites))
}

function addFavoriteMovie(favorites, movie) {
  if(movie.isFavorite
    && !favorites.some(favoriteMovie => favoriteMovie.imdbID == movie.imdbID)
  ){
    favorites.push(movie)
  }

  return favorites
}

//This is our GET handler to search for movies
app.get('/search', function(req, res){
	var favorites = getFavoritesDB()
		searchMovie(req.query.name)
    .then(foundMovies => {

      foundMovies.forEach(movie => {
        movie.isFavorite =
          favorites.some(favoriteMovie => favoriteMovie.imdbID === movie.imdbID);
      })

      res.setHeader('Content-Type', 'application/json')
      res.send(foundMovies)
    })
})
//This is our GET handler to fetch our list of favorites
app.get('/favorites', function(req, res){
  res.setHeader('Content-Type', 'application/json')
  res.send(getFavoritesDB())
})

//This is a POST handler that adds a movie to our list of favorites
app.post('/favorites', function(req, res){
    var movie = req.body

  var favorites = getFavoritesDB()

  if(movie.isFavorite)
    setFavoritesDB(addFavoriteMovie(favorites, movie))
  else
    setFavoritesDB(removeFavoriteMovie(favorites, movie.imdbID))

  res.setHeader('Content-Type', 'application/json')
  res.send(movie)
})


//Get request for the full details of a given movie
app.get('/details', function(req, res) {
  getMovieDetails(req.query.imdbID)
    .then(foundMovie => {

      res.setHeader('Content-Type', 'application/json')
      res.send(foundMovie)
    })
})

//Runs our server
app.listen(port, function(){
  console.log("Listening on port " + port)
})
