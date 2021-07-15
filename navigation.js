const firstNavButtons = Array.from(document.querySelectorAll(`.firstButton`));
firstNavButtons.forEach((b) => {
  b.addEventListener("click", () => {
    hideError();
    initImageList();
    searchComic(1);
  });
});

const prevNavButtons = Array.from(document.querySelectorAll(`.prevButton`));
prevNavButtons.forEach((b) => {
  b.addEventListener("click", () => {
    hideError();
    initImageList();
    searchComic(currentComicIndex - numOfImagesDisplayed);
  });
});

const randomNavButtons = Array.from(document.querySelectorAll(`.randomButton`));
randomNavButtons.forEach((b) => {
  b.addEventListener("click", () => {
    hideError();
    initImageList();
    const r = getRandomIntInclusive(1, latestComicIndex);
    searchComic(r);
  });
});

const nextNavButtons = Array.from(document.querySelectorAll(`.nextButton`));
nextNavButtons.forEach((b) => {
  b.addEventListener("click", () => {
    hideError();
    initImageList();
    searchComic(currentComicIndex + numOfImagesDisplayed);
  });
});

const lastNavButtons = Array.from(document.querySelectorAll(`.lastButton`));
lastNavButtons.forEach((b) => {
  b.addEventListener("click", () => {
    hideError();
    initImageList();
    searchComic(0);
  });
});

/// loop through all page num display buttons and assign event listener for click
const displayOptions = Array.from(
  document.querySelectorAll("a[id*='-display']")
);
//console.log(displayOptions);
displayOptions.forEach((option) => {
  option.addEventListener("click", () => {
    hideError();
    const n = parseInt(option.innerHTML);
    // if we are selecting a different page display value
    if (numOfImagesDisplayed != n) {
      numOfImagesDisplayed = n;
      //console.log(`now displaying: ${numOfImagesDisplayed} image(s)`);
      initImageList();
      searchComic(currentComicIndex);
    }
  });
});

/// Rand func taken from internet
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
