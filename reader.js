const api_url = "https://intro-to-js-playground.vercel.app/api/xkcd-comics/";
var latestComicIndex;
var numOfImagesDisplayed = 3;
var currentComicIndex = 0;

//entry point of the script
initImageList();
hideError();
searchComic(null);

async function fetchComicData(url) {
  const res = await fetch(url);
  return res.json();
}

async function fetchLatestComic() {
  const d = await fetchComicData(api_url);
  latestComicIndex = d.num;
  console.log(`latest comic index: ${latestComicIndex}`);
}

async function loadComic(index) {
  try {
    const data = await fetchComicData(api_url + index);
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function loadComics(index, quantity) {
  // limit the index to the correct range [0, latest]
  if (index <= 0) index += latestComicIndex;
  else if (index > latestComicIndex) index -= latestComicIndex;
  console.log(`getting actual comic index ${index}`);
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

const searchButton = document.querySelector(`#search-submit`);
const searchValue = document.querySelector(`#comic-search`);

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  searchEvent();
});

searchValue.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    searchEvent();
  }
});

function searchEvent() {
  let c = parseInt(searchValue.value);
  if (Number.isInteger(c)) console.log(c);
  else {
    console.log(`not a number: ${c}`);
    showError(
      `Invalid comic id! Please enter from 1 to ${latestComicIndex}<br />(Value entered: "${searchValue.value}")`
    );
    return;
  }

  if (c < 0 || c > latestComicIndex) {
    console.log(`search out of range: ${c}`);
    showError(
      `Comic id out of range! Please enter from 1 to ${latestComicIndex}<br />(Value entered: "${searchValue.value}")`
    );
    return;
  }
  hideError();
  initImageList();
  searchComic(c);
}

async function searchComic(index) {
  await fetchLatestComic();
  const comicElems = Array.from(document.querySelectorAll("li[id*='aComic']"));

  console.log(`getting comic index ${index}`);
  const comics = await loadComics(
    index === null ? latestComicIndex : index,
    numOfImagesDisplayed
  );
  console.log(comics);
  comicElems.forEach((c, i) => {
    c.querySelector(".comicTitle").innerHTML = comics[i].title;
    c.querySelector(".comic-image").src = comics[i].img;
    c.querySelector(".comic-image").alt = `num: ${comics[i].num}`;
  });
}

function calcMidValue(length) {
  //only taking into account that length is odd
  return Math.floor(length * 0.5);
}

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

function showError(message) {
  document.querySelector(".errorMessage").innerHTML = message;
  document.querySelector("#errorAlert").style.display = "inline-block";
}

function hideError() {
  document.querySelector("#errorAlert").style.display = "none";
}
