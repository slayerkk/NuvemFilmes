"use strict";

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

//const pageContent = document.querySelector("movies");
sidebar();

const getGenres = function (genreList) {
  const newGenreList = [];

  for (const { name } of genreList) {
    newGenreList.push(name);
  }

  return newGenreList.join(", ");
};

const getCasts = function (castList) {
  const newCastList = [];

  for (let i = 0, len = castList.length; i < len && i < 10; i++) {
    const { name } = castList[i];
    newCastList.push(name);
  }
  return newCastList.join(", ");
};

const getDirectors = function (crewList) {
  const directors = crewList.filter(({ job }) => job === "Director");

  const directorList = [];

  for (const { name } of directors) {
    directorList.push(name);
  }

  return directorList.join(", ");
};

// returns only trailers and teasers as array
const filterVideos = function (videoList) {
  return videoList.filter(
    ({ type, site }) =>
      (type === "Trailer" || type === "Teaser") && site === "YouTube"
  );
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases&language=pt-BR`,
  function (movie) {
    const {
      backdrop_path,
      poster_path,
      title,
      release_date,
      runtime,
      vote_average,
      releases: {
        countries: [{ certification }],
      },
      genres,
      overview,
      casts: { cast, crew },
      videos: { results: videos },
    } = movie;


    
    document.title = `${title}`;

    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");

    movieDetail.innerHTML = `
      <div
        class="backdrop-image"
        style="background-image: url('${imageBaseURL}${"w1280" || "original"}${
      backdrop_path || poster_path
    }');"></div>

      <figure class="poster-box movie-poster">
        <img
          src="${imageBaseURL}w342${poster_path}"
          alt="${title}"
          class="img-cover"
        />
      </figure>

      <div class="detail-box">
        <div class="detail-content">
          <h1 class="heading">${title}</h1>

          <div class="meta-list">
            <div class="meta-item">
              <img
                src="./assets/images/star.png"
                width="20"
                height="20"
                alt="rating"
                style="margin-bottom: 5px"
              />
              <span class="span">${vote_average.toFixed(1)}</span>
            </div>

            <div class="separator"></div>
            <div class="meta-item">${runtime}m</div>
            <div class="separator"></div>
            <div class="meta-item">${release_date.split("-")[0]}</div>

            <div class="meta-item card-badge">${certification}</div>
          </div>

          <p class="genre">${getGenres(genres)}</p>

          <p class="overview">${overview}</p>

          <ul class="detail-list">
            <div class="list-item">
              <p class="list-name">Estrelando</p>

              <p>${getCasts(cast)}</p>
            </div>

            <div class="list-item">
              <p class="list-name">Dirigido por</p>

              <p>${getDirectors(crew)}</p>
            </div>
          </ul>
        </div>

        <div class="title-wrapper">
          <h3 class="title-large">Filme</h3>
        </div>

        <div class="slider-list">
          <div class="filme-inner"></div>
        </div>
          <br>
          <div class="slider-list">
        </div>
          <br>
        <div class="title-wrapper">
          <h3 class="title-large">Trailer(s)</h3>
        </div>



        <div class="slider-list">
          <div class="slider-inner"></div>
        </div>
      </div>
      
    `;

    //Trailer
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases&language=en`)
  .then(response => response.json())
  .then(data => {
    const videos = data.videos.results;

    for (const { key, name } of filterVideos(videos)) {
      const videoCard = document.createElement("div");
      videoCard.classList.add("video-card");

      videoCard.innerHTML = `
        <iframe
          width="500"
          height="294"
          src="https://www.youtube.com/embed/${key}?theme=dark&color=white&rel=0"
          frameborder="0"
          allowfullscreen="1"
          title="${name}"
          class="img-cover"
          loading="lazy"
        ></iframe>
      `;

      movieDetail.querySelector(".slider-inner").appendChild(videoCard);
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });



//Filme
  
const tmdbApiKey = '2a3c21f7203959050cb73bdefd2b2ae2';
const tmdbMovieId = `${movieId}`;
let imdb_id;

async function getImdbId(tmdbMovieId, api_key) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbMovieId}?api_key=${api_key}`);
  const data = await response.json();
  return data.imdb_id;
}

getImdbId(tmdbMovieId, api_key)
  .then(id => {
    imdb_id = id;
    fetch(`https://api.themoviedb.org/3/movie/${imdb_id}?api_key=${api_key}&append_to_response=casts,videos,images,releases&language=en`)
      .then(response => response.json())
      .then(data => {
        const videos = data.videos.results;
        let videoAdded = false;
        for (const { key, name } of filterVideos(videos)) {
          if (!videoAdded) {
            const videoCard = document.createElement("div");
            videoCard.classList.add("filme-card");

            videoCard.innerHTML = `<iframe src="https://superflixapi.top/filme/${imdb_id}#noLink" style="border:0px #ffffff none;" name="myiFrame" scrolling="no" frameborder="1" marginheight="0px" marginwidth="0px" height="400px" width="600px" allowfullscreen></iframe>`;

            movieDetail.querySelector(".filme-inner").appendChild(videoCard);
            videoAdded = true;
          }
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  })
  .catch(error => {
    console.error('Error fetching IMDb ID:', error);
  });



//filme 2

function getEmbedFromDatabase(movieId) {
  const database = [
          ];

  const filme = database.find(f => f.titulo === movieId);

  return filme ? filme.embed : `<img src="./assets/images/FilmeOff.png" height="100px">`;
}

const pageTitle = movieId;

const embed = getEmbedFromDatabase(pageTitle);

console.log(embed);


fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases&language=en`)
.then(response => response.json())
.then(data => {
  const videos = data.videos.results;
  let videoAdded = false;
  for (const { key, name } of filterVideos(videos)) {
    if (!videoAdded) {
      const videoCard = document.createElement("div");
      videoCard.classList.add("filme-card");

      videoCard.innerHTML = `${embed}`;

      movieDetail.querySelector(".filme-inner2").appendChild(videoCard);
      videoAdded = true;
    }
  }
})
.catch(error => {
  console.error('Error fetching data:', error);
});


//Trailers e bla bla bla
pageContent.appendChild(movieDetail);


    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`,
      addSuggestedMovies
    );
  }
);

const addSuggestedMovies = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = "Você pode gostar";

  movieListElem.innerHTML = `
      <div class="title-wrapper">
        <h3 class="title-large">Você pode gostar</h3>
      </div>
  
      <div class="slider-list">
        <div class="slider-inner"></div>
      </div>
    `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie); //called from movie_card.js

    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  }

  pageContent.appendChild(movieListElem);
};

search();
