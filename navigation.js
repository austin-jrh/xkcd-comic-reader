/// Grab all list elements under the comicNav class
const navButtons = Array.from(document.querySelectorAll(".comicNav li"));
navButtons.forEach((b) => {
  b.addEventListener("click", () => {
    bindNavEvent(b.querySelector("a[class*='Button']").className);
  });
});

/// Bind the navigation event depending on the name in the button
function bindNavEvent(buttonName) {
  reader.hideError();
  reader.initImageList();

  switch (buttonName) {
    case "firstButton":
      reader.searchComic(1);
      break;

    case "prevButton":
      reader.searchComic(
        reader.getCurrComicIndex() - reader.getNumOfImgsDisplay()
      );
      break;

    case "randomButton":
      const r = getRandomIntInclusive(1, reader.getLatestComicIndex());
      reader.searchComic(r);
      break;

    case "nextButton":
      reader.searchComic(
        reader.getCurrComicIndex() + reader.getNumOfImgsDisplay()
      );
      break;

    case "lastButton":
      reader.searchComic(0);
      break;
  }
}

/// loop through all page num display buttons and assign event listener for click
const displayOptions = Array.from(
  document.querySelectorAll("a[id*='-display']")
);
displayOptions.forEach((option) => {
  option.addEventListener("click", () => {
    reader.hideError();
    const n = parseInt(option.innerHTML);
    // if we are selecting a different page display value
    if (reader.getNumOfImgsDisplay() != n) {
      reader.setNumOfImgsDisplay(n);
      reader.initImageList();
      reader.searchComic(reader.getCurrComicIndex());
    }
  });
});

const searchButton = document.querySelector(`#search-submit`); // go button
const searchValue = document.querySelector(`#comic-search`); // input field

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  searchBarEvent();
});

searchValue.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchBarEvent();
  }
});

/// Determine if the input field is valid comic id
function searchBarEvent() {
  // regex to check if string is number
  if (/^\d+$/.test(searchValue.value) == false) {
    showError(
      `Invalid comic id! Please enter from 1 to ${reader.getLatestComicIndex()}<br />(Value entered: "${
        searchValue.value
      }")`
    );
    return;
  }

  let c = parseInt(searchValue.value);

  if (c < 0 || c > reader.getLatestComicIndex()) {
    showError(
      `Comic id out of range! Please enter from 1 to ${reader.getLatestComicIndex()}<br />(Value entered: "${
        searchValue.value
      }")`
    );
    return;
  }
  reader.hideError();
  reader.initImageList();
  reader.searchComic(c);
}

/// When search is invalid, show error message
function showError(message) {
  document.querySelector(".errorMessage").innerHTML = message;
  document.querySelector("#errorAlert").style.display = "inline-block";
}

/// Rand func taken from internet
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
