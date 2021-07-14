const api_url = "https://intro-to-js-playground.vercel.app/api/xkcd-comics/";
var latestComicIndex;
var numOfImagesDisplayed = 3;
var currentComicIndex = 0;

async function fetchComicData(url) {
  //   const res = await fetch("http://xkcd.com/info.0.json");
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
  // todo: check if starting index is negative
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

initImageList();
hideError();
searchComic(null);

searchButton.addEventListener("click", function onButtonClick() {
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
    showError(`Invalid comic id! Please enter from 1 to ${latestComicIndex}`);
    return;
  }

  if (c < 0 || c > latestComicIndex) {
    console.log(`search out of range: ${c}`);
    showError(
      `Comic id out of range! Please enter from 1 to ${latestComicIndex}`
    );
    return;
  }
  hideError();
  initImageList();
  searchComic(c);
}

// function getSearchValue() {
//   let c = parseInt(searchValue.value);
//   if (Number.isInteger(c)) console.log(c);
//   else console.log(`not a number: ${c}`);

//   // todo: limit number between 1 and latestComicIndex
//   if (isNaN(c)) c = latestComicIndex;

//   return c;
// }

async function searchComic(index) {
  await fetchLatestComic();
  const comicElems = Array.from(
    document.querySelectorAll("div[class*='aComic']")
  );

  // const imageElems = Array.from(
  //   document.querySelectorAll("img[id*='comic-image']")
  // );
  console.log(`getting comic index ${index}`);
  const comics = await loadComics(
    index === null ? latestComicIndex : index,
    numOfImagesDisplayed
  );
  console.log(comics);
  // imageElems.forEach((c, i) => {
  //   c.src = comics[i].img;
  // });
  comicElems.forEach((c, i) => {
    c.querySelector("#comicTitle").innerHTML = comics[i].title;
    c.querySelector("#comic-image").src = comics[i].img;
    c.querySelector("#comic-image").alt = `num: ${comics[i].num}`;
  });
}

// (async () => {
//   await fetchLatestComic(); // init latest comic index
//   const imageElems = Array.from(
//     document.querySelectorAll("img[id*='comic-image']")
//   );

//   // latest comic: 2488
//   // display 3, middle value = 1 ( 0 1 2 )
//   // 2487 2488 1
//   // display 5, middle value = 2 ( 0 1 2 3 4 )
//   // 2486 2487 2488 0 1
//   ////////////
//   const comics = await loadComics(1, numOfImagesDisplayed);
//   console.log(comics);
//   // const mid = calcMidValue(comicImages.length);
//   // const startingIndex = latestComicIndex - mid;
//   imageElems.forEach((c, i) => {
//     c.src = comics[i].img;
//   });

//   // const mid = calcMidValue(comicImages.length);
//   // console.log(comicImages.length);
//   // console.log(`mid: ${mid}`);
//   // comicImages[mid].src = comic.img;
// })();

function calcMidValue(length) {
  //only taking into account that length is odd
  return Math.floor(length * 0.5);
}

function initImageList() {
  const imageList = document.querySelector("#image-list");
  // clear the list
  imageList.innerHTML = "";
  for (let i = 0; i < numOfImagesDisplayed; ++i) {
    const item = document.createElement("div");
    item.className = "column";
    item.innerHTML = `<div class="aComic${i}">
                        <div id="comicTitle">Loading Comic...</div>
                        <img id="comic-image" src="" alt="temp image ${i}" />
                      </div>`;
    imageList.appendChild(item);
  }
}

function showError(message) {
  const msg = document.querySelector("#errorAlert");
  msg.innerHTML = message;
  msg.style.display = "inline";
}

function hideError() {
  document.querySelector("#errorAlert").style.display = "none";
}
