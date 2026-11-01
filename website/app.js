const grid = document.querySelector(".grid");
const sentinel = document.getElementById("sentinel");
const wallsPerPage = 10;
let offset = 0;
let walls = [];

function loadMore() {
  const end = Math.min(offset + wallsPerPage, walls.length);
  let html = "";
  for (let i = offset; i < end; i++) {
    const w = walls[i];
    const size = w.width && w.height ? `width="${w.width}" height="${w.height}"` : "";
    html += `
      <a href="${w.file}" target="_blank" rel="noopener noreferrer">
        <img src="${w.file}" alt="${w.name}" ${size} loading="lazy" decoding="async" />
      </a>`;
  }
  grid.insertAdjacentHTML("beforeend", html);
  offset = end;
}

fetch("metadata/wallpapers.json")
  .then((r) => r.json())
  .then((data) => {
    walls = data;
    loadMore();
    new IntersectionObserver(
      (e) => { if (e[0].isIntersecting && offset < walls.length) loadMore(); },
      { rootMargin: "800px" }
    ).observe(sentinel);
  })
  .catch((err) => {
    console.error(err);
    grid.style.cssText = "display: flex; justify-content: center;";
    grid.innerHTML = `<p style="color:#f55">Failed to load wallpapers.</p>`;
  });
