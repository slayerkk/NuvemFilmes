"use strict";

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");
//alert(movieId);
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
          <h1 class="heading">${title} - ID: ${movieId}</h1>

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
          <h3 class="title-large">Superflix</h3>
        </div>

        <div class="slider-list">
          <div class="filme-inner"></div>
        </div>
          <br>
          <h2>Rede Canais</h2>
          <br>
          <div class="slider-list">
          <div class="filme-inner2"></div>
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
  
fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases&language=en`)
.then(response => response.json())
.then(data => {
  const videos = data.videos.results;
  let videoAdded = false;
  for (const { key, name } of filterVideos(videos)) {
    if (!videoAdded) {
      const videoCard = document.createElement("div");
      videoCard.classList.add("filme-card");

      videoCard.innerHTML = `<iframe src="https://superflixapi.top/filme/${movieId}" style="border:0px #ffffff none;" name="myiFrame" scrolling="no" frameborder="1" marginheight="0px" marginwidth="0px" height="400px" width="600px" allowfullscreen></iframe>`;

      movieDetail.querySelector(".filme-inner").appendChild(videoCard);
      videoAdded = true;
    }
  }
})
.catch(error => {
  console.error('Error fetching data:', error);
});


//filme 2

function getEmbedFromDatabase(movieId) {
  const database = [
      { id: 1, titulo: "475557", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf3hlb.php?vid=CRNGA" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>` },
      { id: 2, titulo: "346698", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf4hlb.php?vid=BRBIE2023" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>` },
      { id: 3, titulo: "872585", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf4hlb.php?vid=OPENHMER" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>` },
      { id: 4, titulo: "693134", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf3hlb.php?vid=DUNAPT2" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
      { id: 5, titulo: "414906", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf5hlb.php?vid=BTMN" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>` },
      { id: 6, titulo: "315162", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf4hlb.php?vid=GTDBTS2OULTMPDO" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
      { id: 7, titulo: "157336", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf2hlb.php?vid=INTRSTLAR" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
      { id: 8, titulo: "624860", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf5hlb.php?vid=MTRXRSRCTNS" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
      { id: 9, titulo: "550", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverfhlb.php?vid=CLBDLT" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
      { id: 10, titulo: "569094", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf4hlb.php?vid=HOMARNHATRVSDARNVRSOBETA" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
      { id: 11, titulo: "634649", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf5hlb.php?vid=HMEMARNHSMVLTPRCSA" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
      { id: 13, titulo: "1930", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverfhlb.php?vid=OESPTCLHMNARNH01" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
      { id: 14, titulo: "293660", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf2hlb.php?vid=DEADP" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
      { id: 15, titulo: "383498", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf4hlb.php?vid=DEADP2" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
      { id: 16, titulo: "49444", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf2hlb.php?vid=KUNGFUPND2" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
      { id: 17, titulo: "9502", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf2hlb.php?vid=KUNGFUPND1" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
      { id: 18, titulo: "140300", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf2hlb.php?vid=KUNGFUPND3" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
      { id: 19, titulo: "103", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf4hlb.php?vid=TXDRVRMTRSTDTX" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
      { id: 20, titulo: "335984", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf4hlb.php?vid=BLDRNR2049" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
      { id: 21, titulo: "537996", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf3hlb.php?vid=ABLDADBSTRSCRG" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
      { id: 22, titulo: "102382", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverfhlb.php?vid=OESPTCLHMNARNH02" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>` },
      { id: 23, titulo: "299536", embed: `<iframe name=Player "" src="//%E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%AF%E3%82%A6%E3%82%B0%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/serverf4hlb.php?vid=VNGDRSGRAINFNT" frameborder=0 height=400 scrolling=no width=640 allow="encrypted-media" allowFullScreen> </iframe>`},
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
