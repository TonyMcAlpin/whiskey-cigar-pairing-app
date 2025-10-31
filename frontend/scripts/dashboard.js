const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

async function fetchData(type) {
  const res = await fetch(`http://localhost:5000/${type}`, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.json();
}

async function addData(type, data) {
  await fetch(`http://localhost:5000/${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify(data),
  });
  loadData();
}

async function loadData() {
  const whiskeys = await fetchData("whiskeys");
  const cigars = await fetchData("cigars");

  document.getElementById("whiskeyList").innerHTML =
    whiskeys.map(w => `<p>${w.name} (${w.type || ""})</p>`).join("");
  document.getElementById("cigarList").innerHTML =
    cigars.map(c => `<p>${c.name} (${c.strength || ""})</p>`).join("");
}

function addWhiskey() {
  const data = {
    name: whiskeyName.value,
    type: whiskeyType.value,
    notes: whiskeyNotes.value,
  };
  addData("whiskeys", data);
}

function addCigar() {
  const data = {
    name: cigarName.value,
    strength: cigarStrength.value,
    flavor: cigarFlavor.value,
  };
  addData("cigars", data);
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

loadData();
