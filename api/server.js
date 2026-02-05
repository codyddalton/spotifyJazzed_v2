const express = require('express');
const app = express();
const axios = require('axios');
require('dotenv').config();
const querystring = require('querystring');
import cors from "cors";

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

const PORT = process.env.PORT || 8888;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

//Utility function for random string generation
const generateRandomString = length => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for(let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
};

const stateKey = 'spotify_auth_state';

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  //setting up a cookie for spotify_auth_state with a random string value
  res.cookie(stateKey, state);
  //setting permission scope for the using logging in
  const scope = 'user-read-private user-read-email';

  const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    response_type:'code',
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope
  })
  //sending the user to login to Spotify with provided parameters
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get('/logged', (req, res) => {
  const code = req.query.code || null;

  axios({
    //reaching out to Spotify to get an access token
    method:'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
  })
  .then(response => {
    if(response.status === 200) {
      //if the post is successful, store the access token, refresh token, and expire in values
      const {access_token, refresh_token, expires_in} = response.data;
      const queryParams = querystring.stringify({
        access_token,
        refresh_token,
        expires_in
      })
      //send the acquired response data to the front-end up on :3000
      res.redirect(`http://localhost:3000/?${queryParams}`)
    } else {
      //otherwise, return an error response
      res.redirect(`/?{querystring.stringify({error: 'invalid_token' })}`);
    }})
  .catch(error => {
    res.send(error);
  });
})

app.get('/refresh_token', (req, res) => {
  const {refresh_token} = req.query;

  axios({
    //grab the refresh token
    method:'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token

    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
  })
  .then(response => {
    if(response.status === 200) {
      res.send(JSON.stringify(response.data, null, 2));
    } else {
      res.send(response)
    }
  })
  .catch(error => {
    res.send(error);
  });

})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
});
