const grid = document.querySelector(".grid");
const sentinel = document.getElementById("sentinel");
const PAGE = 12;
let offset = 0;
let walls = [];
const enc = (p) => encodeURI(p).replace(/#/g, "%23").replace(/\?/g, "%3F");

function addPage() {
  const end = Math.min(offset + PAGE, walls.length);
  let html = "";
  for (let i = offset; i < end; i++) {
    const w = walls[i];
    const dim = w.width && w.height ? `width="${w.width}" height="${w.height}"` : "";
    html += `
      <a href="${enc(w.file)}" target="_blank" rel="noopener noreferrer">
        <img src="${enc(w.thumb || w.file)}" alt="${w.name}" title="${w.name}" ${dim} loading="lazy" decoding="async" />
      </a>`;
  }
  grid.insertAdjacentHTML("beforeend", html);
  offset = end;
}

function fill() {
  let guard = 0;
  while (
    offset < walls.length &&
    guard++ < 10 &&
    sentinel.getBoundingClientRect().top < window.innerHeight + 1000
  ) {
    addPage();
  }
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { ticking = false; fill(); });
}

fetch("metadata/wallpapers.json")
  .then((r) => r.json())
  .then((data) => {
    walls = data;
    document.getElementById("count").textContent = `${walls.length} wallpapers`;
    fill();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
  })
  .catch((err) => {
    console.error(err);
    grid.style.cssText = "display: flex; justify-content: center;";
    grid.innerHTML = `<p style="color:#f77">Could not load wallpapers.</p>`;
  });
