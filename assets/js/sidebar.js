"use strict";

import { api_key, fetchDataFromServer } from "./api.js";

export function sidebar() {
  /*------
  Fetch all genres eg: [{ "id": "123", "name": "Action" }]
  then change genre formate eg: { 123: "Action" }
  -------*/
  const genreList = {};

  fetchDataFromServer(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=pt-BR`,
    function ({ genres }) {
      for (const { id, name } of genres) {
        genreList[id] = name;
      }

      genreLink();
    }
  );

  const sidebarInner = document.createElement("div");
  sidebarInner.classList.add("sidebar-inner");

  sidebarInner.innerHTML = `
    <div class="sidebar-list">
      <p class="title">Gênero</p>
    </div>
    </div>

    <div class="sidebar-list">
      <p class="title">Suporte</p>

      <a
        href="./suporte.html#dns"
        menu-close
        class="sidebar-link"
        >"Os filmes não funcionam"</a>
        <a
        href="./suporte.html#player"
        menu-close
        class="sidebar-link"
        >Erros do Player</a>

        <p class="title">Sobre nós</p>
        <a
        href="https://linktr.ee/NuvemAzul"
        menu-close
        class="sidebar-link"
        >Conteudos!</a>
        <a
        href="https://nuvemazul.org/about.html"
        menu-close
        class="sidebar-link"
        >Sobre</a>
        </div>


      
    <div class="sidebar-footer">
      <p class="copyright">
        Copyright 2023
        <a href="https://discord.gg/nuvemazul" class="link"
          >Discord</a
        >
      </p>

      

      <img
        src="./assets/images/logo2.png"
        width="130"
        height="17"
        alt="the movie database logo"
      />
    </div>
  `;

  const genreLink = function () {
    for (const [genreId, genreName] of Object.entries(genreList)) {
      const link = document.createElement("a");
      link.classList.add("sidebar-link");
      link.setAttribute("href", "./movie-list.html");
      link.setAttribute("menu-close", "");
      link.setAttribute(
        "onClick",
        `getMovieList("with_genres=${genreId}", "${genreName}")`
      );
      link.textContent = genreName;

      sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);
    }

    const sidebar = document.querySelector("[sidebar]");
    sidebar.appendChild(sidebarInner);
    toggleSidebar(sidebar);
  };

  //   Toggle sidebar in mobile screen
  const toggleSidebar = function (sidebar) {
    const sidebarBtn = document.querySelector("[menu-btn]");
    const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
    const sidebarClose = document.querySelectorAll("[menu-close]");
    const overlay = document.querySelector("[overlay]");

    addEventOnElements(sidebarTogglers, "click", function () {
      sidebar.classList.toggle("active");
      sidebarBtn.classList.toggle("active");
      overlay.classList.toggle("active");
    });

    addEventOnElements(sidebarClose, "click", function () {
      sidebar.classList.remove("active");
      sidebarBtn.classList.remove("active");
      overlay.classList.remove("active");
    });
  };
}
