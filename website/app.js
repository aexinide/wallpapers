const grid = document.getElementById("grid");
const nav = document.getElementById("filters");
const empty = document.getElementById("empty");
let items = [];

function render(cat) {
  const list = cat === "all" ? items : items.filter(i => i.category === cat);
  grid.replaceChildren(...list.map(i => {
    const f = document.createElement("figure");
    const size = i.width ? `${i.width}×${i.height}` : "";
    f.innerHTML = `<img loading="lazy" alt="${i.name}" src="${i.file}">
      <figcaption><span>${i.name}<small>${i.category} ${size}</small></span>
      <a href="${i.file}" download>Download</a></figcaption>`;
    return f;
  }));
  empty.hidden = list.length > 0;
  [...nav.children].forEach(b => b.setAttribute("aria-pressed", b.dataset.cat === cat));
}

fetch("metadata/wallpapers.json").then(r => r.json()).then(data => {
  items = data;
  ["all", ...new Set(items.map(i => i.category))].forEach(c => {
    const b = document.createElement("button");
    b.textContent = c; b.dataset.cat = c;
    b.onclick = () => render(c);
    nav.append(b);
  });
  render("all");
}).catch(() => { empty.hidden = false; });
