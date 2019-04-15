var express = require('express');
var router = express.Router();
var request = require('request');

const apiKey = '1fb720b97cc13e580c2c35e1138f90f8';
const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
});

/* GET home page. */
router.get('/', (req, res, next) => {
  request.get(nowPlayingUrl, (error, response, movieData) => { // movieData is response.body
    const parsedBody = JSON.parse(response.body);
    // res.json(parsedBody);
    res.render('index', {
      movies: parsedBody.results
    });
  }); 
});

// Get movie details page
router.get('/movie/:id', (req, res, next) => {
  // res.json(req.params.id);
  const movieId = req.params.id;
  const movieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;
  request.get(movieUrl, (error, response, movieData) => {
    const parsedBody = JSON.parse(movieData);
    res.render('movie-details', {
      parsedBody
    });
  });
});

// Get movie search results
router.post('/search', (req, res, next) => {
  // the urlencoded middleware (express) parses the query string in the urlencoded body sent by the form and creates the body object of (key-value pairs) on req
  const uriSearchQuery = encodeURI(req.body.movieSearch); //encodes a Uniform Resource Identifier (URI) by replacing each instance of certain characters by one, two, three, or four escape sequences representing the UTF-8 encoding of the character 
  const category = req.body.category
  const searchUrl = `${apiBaseUrl}/search/${category}?query=${uriSearchQuery}&api_key=${apiKey}` 
  request.get(searchUrl, (error, response, movieData) => {
    let parsedBody = JSON.parse(movieData);
    if (category === "person") {
      parsedBody.results = parsedBody.results[0].known_for;
    }
    res.render('index', {
      movies: parsedBody.results
    })
  });
});

module.exports = router;
