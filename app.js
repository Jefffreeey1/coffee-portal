let historyStack = [];

const content = document.getElementById("content");
const title = document.getElementById("title");
const backBtn = document.getElementById("backBtn");

backBtn.style.display = "none";

function goBack() {
  const prev = historyStack.pop();
  if (prev) prev();
  if (historyStack.length === 0) backBtn.style.display = "none";
}

function setView(fn) {
  historyStack.push(fn);
  backBtn.style.display = "inline-block";
}

function showMainCategories() {
  title.innerText = "Categories";
  content.innerHTML = "";

  ["Coffee", "Energizers", "Agua Fresca"].forEach(cat => {
    const div = document.createElement("div");
    div.className = "button-tile";
    div.innerText = cat;
    div.onclick = () => {
      setView(showMainCategories);
      showSubCategories(cat);
    };
    content.appendChild(div);
  });
}

function showSubCategories(category) {
  title.innerText = category;
  content.innerHTML = "";

  if (category === "Agua Fresca") {
    showDrinkList(category, null);
    return;
  }

  const subs = [...new Set(
    recipes
      .filter(r => r.category === category)
      .map(r => r.subcategory)
  )];

  subs.forEach(sub => {
    const div = document.createElement("div");
    div.className = "button-tile";
    div.innerText = sub;
    div.onclick = () => {
      setView(() => showSubCategories(category));
      showDrinkList(category, sub);
    };
    content.appendChild(div);
  });
}

function showDrinkList(category, subcategory) {
  title.innerText = subcategory || category;
  content.innerHTML = "";

  recipes
    .filter(r => r.category === category && r.subcategory === subcategory)
    .forEach(drink => {
      const div = document.createElement("div");
      div.className = "button-tile";
      div.innerText = drink.name;
      div.onclick = () => {
        setView(() => showDrinkList(category, subcategory));
        showRecipe(drink);
      };
      content.appendChild(div);
    });
}

function showRecipe(drink) {
  title.innerText = drink.name;
  content.innerHTML = "";

  const recipeDiv = document.createElement("div");
  recipeDiv.className = "recipe";

  recipeDiv.innerHTML = `
    <h2>Base Recipe</h2>
    <ul>${drink.base.map(i => `<li>${i}</li>`).join("")}</ul>

    <div class="section">
      <div class="section-title">Common Modifiers</div>
      <ul>${drink.modifiers.map(m => `<li>${m}</li>`).join("")}</ul>
    </div>
  `;

  content.appendChild(recipeDiv);
}

showMainCategories();