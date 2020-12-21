require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:
app.get('/', (request, response) => {
  response.render('home');
});

app.get('/artist-search', (request, response) => {
  const search = request.query.name;
  spotifyApi
    .searchArtists(search)
    .then((data) => {
      console.log('The received data from the API: ', data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      response.render('artist-search-results', {
        artist: data.body.artists.items
      });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.get('/albums/:artistId', (request, response) => {
  const searchId = request.params.artistId;
  spotifyApi
    .getArtistAlbums(searchId)
    .then((data) => {
      console.log(data.body.items);
      response.render('albums', { album: data.body.items });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get('/tracks/:albumId', (request, response) => {
  const searchId = request.params.albumId;
  spotifyApi
    .getAlbumTracks(searchId)
    .then((data) => {
      console.log(data.body.items);
      response.render('tracks', { tracks: data.body.items });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
