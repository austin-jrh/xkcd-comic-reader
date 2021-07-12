const api_url = "https://intro-to-js-playground.vercel.app/api/xkcd-comics/";

async function fetchComicData(url) {
  //   const res = await fetch("http://xkcd.com/info.0.json");
  const res = await fetch(url);
  return res.json();
}

async function loadComic() {
  try {
    const data = await fetchComicData(api_url + "1");
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

(async () => {
  console.log(await loadComic());
})();
