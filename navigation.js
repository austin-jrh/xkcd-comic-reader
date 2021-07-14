const firstNavButtons = Array.from(document.querySelectorAll(`#first`));
firstNavButtons.forEach((b) => {
  b.addEventListener("click", () => {
    initImageList();
    searchComic(1);
  });
});

const prevNavButtons = Array.from(document.querySelectorAll(`#prev`));
prevNavButtons.forEach((b) => {
  b.addEventListener("click", () => {
    initImageList();
    searchComic(currentComicIndex - numOfImagesDisplayed);
  });
});

const randomNavButtons = Array.from(document.querySelectorAll(`#random`));
randomNavButtons.forEach((b) => {
  b.addEventListener("click", () => {
    initImageList();
    const r = getRandomIntInclusive(1, latestComicIndex);
    searchComic(r);
  });
});

const nextNavButtons = Array.from(document.querySelectorAll(`#next`));
nextNavButtons.forEach((b) => {
  b.addEventListener("click", () => {
    initImageList();
    searchComic(currentComicIndex + numOfImagesDisplayed);
  });
});

const lastNavButtons = Array.from(document.querySelectorAll(`#last`));
lastNavButtons.forEach((b) => {
  b.addEventListener("click", () => {
    initImageList();
    searchComic(0);
  });
});

const displayOptions = Array.from(
  document.querySelectorAll("a[id*='-display']")
);
console.log(displayOptions);
displayOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const n = parseInt(option.innerHTML);
    if (numOfImagesDisplayed != n) {
      numOfImagesDisplayed = n;
      console.log(`now displaying: ${numOfImagesDisplayed} image(s)`);
      initImageList();
      searchComic(currentComicIndex);
    }
  });
});

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
