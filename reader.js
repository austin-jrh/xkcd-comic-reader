/// Wrap reader into a scope and only expose functions that are used in navigation.js
let reader = (function () {
  const api_url = "https://intro-to-js-playground.vercel.app/api/xkcd-comics/";
  let latestComicIndex; //keep track of what is the latest comic index
  let numOfImagesDisplayed = 3; //keep track of how many images are being displayed right now
  let currentComicIndex = 0; //keep track of what is the comic index of the comic displayed in the center

  //entry point of the script
  initImageList();
  hideError();
  searchComic(null);

  // -- function declarations start

  function getLatestComicIndex() {
    return latestComicIndex;
  }

  function getNumOfImgsDisplay() {
    return numOfImagesDisplayed;
  }
  function setNumOfImgsDisplay(num) {
    numOfImagesDisplayed = num;
  }

  function getCurrComicIndex() {
    return currentComicIndex;
  }

  async function fetchComicData(url) {
    const res = await fetch(url);
    return res.json();
  }

  /// Grab the details of the latest comic
  async function fetchLatestComic() {
    const d = await fetchComicData(api_url);
    latestComicIndex = d.num;
  }

  /// Load a single comic
  async function loadComic(index) {
    try {
      const data = await fetchComicData(api_url + index);
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /// Load (quantity) amount of comics, where (index) is the middle comic
  async function loadComics(index, quantity) {
    if (index <= 0) index += latestComicIndex;
    else if (index > latestComicIndex) index -= latestComicIndex;
    currentComicIndex = index;

    const m = calcMidValue(quantity);
    let start = index - m;
    if (start <= 0) {
      start += latestComicIndex;
    }
    let result = [];
    for (let i = 0; i < quantity; ++i) {
      let index = start + i;
      if (index > latestComicIndex) index -= latestComicIndex;
      result[i] = await loadComic(index);
    }

    return result;
  }

  /// Jump to comic index, where (index) is a valid index
  async function searchComic(index) {
    await fetchLatestComic();
    const comicElems = Array.from(
      document.querySelectorAll("li[id*='aComic']")
    );

    const comics = await loadComics(
      index === null ? latestComicIndex : index,
      numOfImagesDisplayed
    );
    comicElems.forEach((c, i) => {
      c.querySelector(".comicTitle").innerHTML = comics[i].title;
      c.querySelector(".comic-image").src = comics[i].img;
      c.querySelector(".comic-image").alt = `num: ${comics[i].num}`;
    });
  }

  /// Given the number, calculate what number is the middle (catered to arrays)
  function calcMidValue(length) {
    //only taking into account that length is odd
    return Math.floor(length * 0.5);
  }

  /// Replace the current comics with placeholders
  function initImageList() {
    const imageList = document.querySelector("#image-list");
    // clear the list
    imageList.innerHTML = "";
    for (let i = 0; i < numOfImagesDisplayed; ++i) {
      const item = document.createElement("li");
      item.id = `aComic${i}`;
      item.innerHTML = `<div class="comicTitle">Loading Comic...</div>
                      <img class="comic-image" src="loading.gif" alt="temp image ${i}" />`;
      imageList.appendChild(item);
    }
  }

  /// When doing any valid navigation, hide the error message
  function hideError() {
    document.querySelector("#errorAlert").style.display = "none";
  }

  return {
    getLatestComicIndex,
    getNumOfImgsDisplay,
    setNumOfImgsDisplay,
    getCurrComicIndex,
    hideError,
    initImageList,
    searchComic,
  };
})();
