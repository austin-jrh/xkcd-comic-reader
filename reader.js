const api_url = "https://intro-to-js-playground.vercel.app/api/xkcd-comics/";
let latestComicIndex;
let numOfImagesDisplayed = 5;

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

searchComic(null);

searchButton.addEventListener("click", function onButtonClick() {
  searchComic(getSearchValue());
});

searchValue.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    searchComic(getSearchValue());
  }
});

function getSearchValue() {
  let c = parseInt(searchValue.value);
  if (Number.isInteger(c)) console.log(c);
  else console.log(`not a number: ${c}`);

  // todo: limit number between 1 and latestComicIndex
  if (isNaN(c)) c = latestComicIndex;

  return c;
}

async function searchComic(index) {
  await fetchLatestComic();
  const imageElems = Array.from(
    document.querySelectorAll("img[id*='comic-image']")
  );
  const comics = await loadComics(
    index === null ? latestComicIndex : index,
    numOfImagesDisplayed
  );
  console.log(comics);
  imageElems.forEach((c, i) => {
    c.src = comics[i].img;
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
