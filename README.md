# xkcd-comic-reader

This is an capstone project for a javascript course held by SUTD. 

API used (proxy): 
Get latest comic: https://intro-to-js-playground.vercel.app/api/xkcd-comics/
Get through comic id: https://intro-to-js-playground.vercel.app/api/xkcd-comics/<comic-id>
*Proxy is used as CORS is not enabled on the official xkcd API*

# Features
- Display comics with comic title, comic image
- Navigation buttons: First, Prev, Random, Next, Last
- Search bar to jump to a specific comic id
- Choose between showing 1, 3, or 5 comics at once

# Implementation

### Files:
- `index.html`: contains html code for displaying website
- `stylesheet.css`: contains css code for style
- `reader.js`: contains code for fetching and showing the comics via proxy API
- `navigation.js`: contains code to bind the navigation buttons

## reader.js
### Variables:
- `api_url`: URL for the API
- `latestComicIndex`: keep track of what is the latest comic index
- `numOfImagesDisplayed`: keep track of how many images are being displayed right now
- `currentComicIndex`: keep track of what is the comic index of the comic displayed in the center

### Functions to use:
### `searchComic(index)`
> Populate the website with the respective comics, where the middle comic id is index.

The function will first query what the latest comic is, then will load the comics needed using `loadComics(index, quentity)`. Afterwards, the comics will be loaded into the website.

`hideError()`
> Hide the error message when a valid navigation is done.

### Relevant functions:
`loadComics(index, quantity)`
> Returns an array of data fetched from the API, where `index` is the middle index of the comic and `quantity` is the amount of comics to retrieve.

`initImageList()`
> Clear the website and replace with corresponding HTML code as placeholder.

The number of placeholder depends on the value of `numOfImagesDisplayed`.

## navigation.js
This file contains code to bind the navigation buttons on the website. The code gathers the respective buttons and attaches the correct event through `addEventListener`

### Functions to use:
`showError(message)`
> Show an error message below the search bar.
