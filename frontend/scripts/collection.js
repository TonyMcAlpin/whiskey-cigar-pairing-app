document.addEventListener("DOMContentLoaded", () => {
  const whiskeyCollection = [
    {
      name: "Lagavulin 16",
      origin: "Islay, Scotland",
      notes: "Peat smoke, sea salt, and rich dried fruit",
      tags: ["Smoky", "Rich", "Iconic"],
    },
    {
      name: "Yamazaki 12",
      origin: "Osaka, Japan",
      notes: "Honeyed malt, apricot, and gentle spice",
      tags: ["Silky", "Balanced", "Award-winning"],
    },
    {
      name: "Four Roses Single Barrel",
      origin: "Kentucky, USA",
      notes: "Caramel, ripe cherry, and baking spice",
      tags: ["Bourbon", "Smooth", "Versatile"],
    },
  ];

  const cigarCollection = [
    {
      name: "Cohiba Siglo VI",
      origin: "Vuelta Abajo, Cuba",
      notes: "Cedar, cocoa, and toasted almond finish",
      tags: ["Full-bodied", "Luxurious"],
    },
    {
      name: "Arturo Fuente Hemingway",
      origin: "Dominican Republic",
      notes: "Sweet wood, spice, and creamy finish",
      tags: ["Medium", "Classic"],
    },
    {
      name: "Oliva Serie V Melanio",
      origin: "Nicaragua",
      notes: "Espresso, leather, and dark chocolate",
      tags: ["Award-winning", "Complex"],
    },
  ];

  const state = { active: "whiskey" };

  const gridEl = document.getElementById("collection-grid");
  const countEl = document.getElementById("collection-count");
  const toggleWhiskey = document.getElementById("toggle-whiskey");
  const toggleCigar = document.getElementById("toggle-cigar");

  if (!gridEl || !countEl || !toggleWhiskey || !toggleCigar) return;

  const renderCollection = () => {
    const data = state.active === "whiskey" ? whiskeyCollection : cigarCollection;

    gridEl.innerHTML = "";

    if (!data.length) {
      gridEl.innerHTML = `
        <div class="empty-state">
          <h2>No items yet</h2>
          <p>Add your first ${state.active} to start building your collection.</p>
        </div>
      `;
      countEl.textContent = "0 items";
      return;
    }

    const fragment = document.createDocumentFragment();

    data.forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";

      const title = document.createElement("h2");
      title.textContent = item.name;

      const details = document.createElement("div");
      details.className = "details";
      details.innerHTML = `
        <span><strong>Origin:</strong> ${item.origin}</span>
        <span><strong>Tasting notes:</strong> ${item.notes}</span>
      `;

      const tags = document.createElement("div");
      tags.className = "tags";
      item.tags.forEach((tag) => {
        const badge = document.createElement("span");
        badge.className = "tag";
        badge.textContent = tag;
        tags.appendChild(badge);
      });

      card.append(title, details, tags);
      fragment.appendChild(card);
    });

    gridEl.appendChild(fragment);
    countEl.textContent = `${data.length} ${data.length === 1 ? "item" : "items"}`;
  };

  const setActive = (type) => {
    state.active = type;
    toggleWhiskey.setAttribute("aria-pressed", type === "whiskey");
    toggleCigar.setAttribute("aria-pressed", type === "cigar");
    renderCollection();
  };

  toggleWhiskey.addEventListener("click", () => setActive("whiskey"));
  toggleCigar.addEventListener("click", () => setActive("cigar"));

  renderCollection();
});
