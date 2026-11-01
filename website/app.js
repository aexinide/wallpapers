const grid = document.getElementById("grid");
const nav = document.getElementById("filters");
const empty = document.getElementById("empty");
const sentinel = document.getElementById("sentinel");
const BATCH = 12, MIN_COL = 260, GAP = 6;
let all = [], list = [], shown = 0, cols = [], heights = [], cat = "all";

function build() {
  grid.replaceChildren();
  const n = Math.max(1, Math.floor((grid.clientWidth + GAP) / (MIN_COL + GAP)));
  cols = []; heights = new Array(n).fill(0); shown = 0;
  for (let i = 0; i < n; i++) {
    const c = document.createElement("div");
    c.className = "col"; grid.append(c); cols.push(c);
  }
}

function tile(i) {
  const f = document.createElement("figure");
  f.className = "tile";
  const open = document.createElement("a");
  open.href = i.file; open.target = "_blank"; open.rel = "noopener";
  const img = new Image();
  img.loading = "lazy"; img.decoding = "async"; img.alt = i.name; img.src = i.file;
  if (i.width && i.height) { img.width = i.width; img.height = i.height; }
  open.append(img);
  const meta = document.createElement("span");
  meta.className = "meta";
  meta.textContent = i.name + (i.width ? `  ${i.width}×${i.height}` : "");
  const dl = document.createElement("a");
  dl.className = "dl"; dl.href = i.file; dl.download = ""; dl.textContent = "Download";
  f.append(open, meta, dl);
  return f;
}

function loadMore() {
  const end = Math.min(shown + BATCH, list.length);
  for (; shown < end; shown++) {
    const i = list[shown];
    const ratio = i.width && i.height ? i.height / i.width : 0.625;
    const k = heights.indexOf(Math.min(...heights));
    heights[k] += ratio;
    cols[k].append(tile(i));
  }
  if (shown < list.length && sentinel.getBoundingClientRect().top < innerHeight + 800) {
    requestAnimationFrame(loadMore);
  }
}

function show(c) {
  cat = c;
  list = c === "all" ? all : all.filter(i => i.category === c);
  build();
  empty.hidden = list.length > 0;
  [...nav.children].forEach(b => b.setAttribute("aria-pressed", b.dataset.cat === c));
  loadMore();
}

new IntersectionObserver(e => { if (e[0].isIntersecting) loadMore(); }, { rootMargin: "800px" }).observe(sentinel);

let rt;
addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => show(cat), 200); });

fetch("metadata/wallpapers.json").then(r => r.json()).then(data => {
  all = data;
  const cats = [...new Set(all.map(i => i.category))];
  if (cats.length > 1) {            // only show filters when there is something to filter
    nav.hidden = false;
    ["all", ...cats].forEach(c => {
      const b = document.createElement("button");
      b.textContent = c; b.dataset.cat = c; b.onclick = () => show(c);
      nav.append(b);
    });
  }
  show("all");
}).catch(() => { empty.hidden = false; });
