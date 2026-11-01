const grid = document.querySelector(".grid");
const sentinel = document.getElementById("sentinel");
const PAGE = 12;
let offset = 0;
let walls = [];

function tile(w) {
  const size = w.width && w.height ? `${w.width}×${w.height}` : "";
  const dim = size ? `width="${w.width}" height="${w.height}"` : "";
  return `
    <figure class="tile">
      <a href="${w.file}" target="_blank" rel="noopener noreferrer">
        <img src="${w.file}" alt="${w.name}" ${dim} loading="lazy" decoding="async" />
      </a>
      <span class="name">${w.name}<small>${size}</small></span>
      <a class="dl" href="${w.file}" download>download</a>
    </figure>`;
}

function loadMore() {
  const end = Math.min(offset + PAGE, walls.length);
  grid.insertAdjacentHTML("beforeend", walls.slice(offset, end).map(tile).join(""));
  offset = end;
}

fetch("metadata/wallpapers.json")
  .then((r) => r.json())
  .then((data) => {
    walls = data;
    document.getElementById("count").textContent = `${walls.length} wallpapers`;
    loadMore();
    new IntersectionObserver(
      (e) => { if (e[0].isIntersecting && offset < walls.length) loadMore(); },
      { rootMargin: "800px" }
    ).observe(sentinel);
  })
  .catch((err) => {
    console.error(err);
    grid.innerHTML = `<p style="color:#f77">Could not load wallpapers.</p>`;
  });
