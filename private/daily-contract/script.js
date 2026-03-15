const PASSWORD_SHA256_HEX = "REPLACE_WITH_SHA256_HEX";
const CONTRACT_URL = "./contract.json";
const HISTORY_URL = "./history.json";

const gateEl = document.getElementById("gate");
const appEl = document.getElementById("app");
const gateErrorEl = document.getElementById("gate-error");
const passwordInputEl = document.getElementById("password-input");
const unlockBtnEl = document.getElementById("unlock-btn");
const lockBtnEl = document.getElementById("lock-btn");
const resetBtnEl = document.getElementById("reset-btn");

const contractMetaEl = document.getElementById("contract-meta");
const currentPullTitleEl = document.getElementById("current-pull-title");
const currentPullChecklistEl = document.getElementById("current-pull-checklist");
const allowedSwitchesEl = document.getElementById("allowed-switches");
const parkingLotEl = document.getElementById("parking-lot");
const killedListEl = document.getElementById("killed-list");
const previousDaysEl = document.getElementById("previous-days");
const notesEl = document.getElementById("notes");

let stateKey = null;
let activeContractUrl = CONTRACT_URL;

function getContractUrlFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("contract");
  if (!fromQuery) return CONTRACT_URL;
  if (fromQuery.includes("..")) return CONTRACT_URL;
  return fromQuery;
}

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function unlock() {
  const password = passwordInputEl.value;
  if (!password) {
    gateErrorEl.textContent = "Enter a password.";
    return;
  }
  if (PASSWORD_SHA256_HEX === "REPLACE_WITH_SHA256_HEX") {
    gateErrorEl.textContent = "Configure password hash in script.js first.";
    return;
  }
  const candidate = await sha256Hex(password);
  if (candidate !== PASSWORD_SHA256_HEX) {
    gateErrorEl.textContent = "Wrong password.";
    return;
  }
  sessionStorage.setItem("dailyContractUnlocked", "1");
  gateErrorEl.textContent = "";
  gateEl.classList.add("hidden");
  appEl.classList.remove("hidden");
  await loadContract();
}

function lock() {
  sessionStorage.removeItem("dailyContractUnlocked");
  appEl.classList.add("hidden");
  gateEl.classList.remove("hidden");
  passwordInputEl.value = "";
}

function loadChecks() {
  if (!stateKey) return {};
  try {
    return JSON.parse(localStorage.getItem(stateKey) || "{}");
  } catch {
    return {};
  }
}

function saveChecks(checks) {
  if (!stateKey) return;
  localStorage.setItem(stateKey, JSON.stringify(checks));
}

function loadKilled() {
  if (!stateKey) return [];
  try {
    return JSON.parse(localStorage.getItem(`${stateKey}:killed`) || "[]");
  } catch {
    return [];
  }
}

function saveKilled(items) {
  if (!stateKey) return;
  localStorage.setItem(`${stateKey}:killed`, JSON.stringify(items));
}

function buildChecklist(ul, items, checks, keyPrefix) {
  ul.innerHTML = "";
  (items || []).forEach((item, idx) => {
    const li = document.createElement("li");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    const id = `${keyPrefix}-${idx}`;
    cb.checked = !!checks[id];
    const label = document.createElement("label");
    label.textContent = item;
    if (cb.checked) label.classList.add("done");
    cb.addEventListener("change", () => {
      const next = loadChecks();
      next[id] = cb.checked;
      saveChecks(next);
      label.classList.toggle("done", cb.checked);
    });
    li.appendChild(cb);
    li.appendChild(label);
    ul.appendChild(li);
  });
}

function buildPlainList(ul, items) {
  ul.innerHTML = "";
  (items || []).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
}

function buildParkingList(items) {
  const killed = loadKilled();
  parkingLotEl.innerHTML = "";
  (items || [])
    .filter((item) => !killed.includes(item))
    .forEach((item) => {
      const li = document.createElement("li");
      const text = document.createElement("span");
      text.textContent = item;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "secondary tiny";
      btn.textContent = "Kill";
      btn.addEventListener("click", () => {
        const nextKilled = loadKilled();
        if (!nextKilled.includes(item)) nextKilled.push(item);
        saveKilled(nextKilled);
        buildParkingList(items);
        buildKilledList();
      });
      li.appendChild(text);
      li.appendChild(btn);
      parkingLotEl.appendChild(li);
    });
}

function buildKilledList() {
  const killed = loadKilled();
  killedListEl.innerHTML = "";
  if (!killed.length) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "Nothing killed yet.";
    killedListEl.appendChild(li);
    return;
  }
  killed.forEach((item) => {
    const li = document.createElement("li");
    li.className = "killed";
    const text = document.createElement("span");
    text.textContent = item;
    const undo = document.createElement("button");
    undo.type = "button";
    undo.className = "secondary tiny";
    undo.textContent = "Undo";
    undo.addEventListener("click", () => {
      const nextKilled = loadKilled().filter((x) => x !== item);
      saveKilled(nextKilled);
      buildKilledList();
      loadContract();
    });
    li.appendChild(text);
    li.appendChild(undo);
    killedListEl.appendChild(li);
  });
}

async function loadContract() {
  activeContractUrl = getContractUrlFromQuery();
  const res = await fetch(activeContractUrl, { cache: "no-store" });
  if (!res.ok) {
    contractMetaEl.textContent = `Could not load ${activeContractUrl}.`;
    return;
  }
  const contract = await res.json();
  const date = contract.date || "unknown-date";
  stateKey = `dailyContractChecks:${date}`;

  contractMetaEl.textContent = `${date} | Owner: ${contract.owner || "Kamran"}`;
  currentPullTitleEl.textContent =
    contract.current_pull?.title || "No current pull set.";

  const checks = loadChecks();
  buildChecklist(
    currentPullChecklistEl,
    contract.current_pull?.checklist || [],
    checks,
    "pull",
  );
  buildPlainList(allowedSwitchesEl, contract.allowed_switches || []);
  buildParkingList(contract.parking_lot || []);
  buildKilledList();
  notesEl.textContent = contract.notes || "";
  await loadHistory(contract.date || "");
}

async function loadHistory(currentDate) {
  previousDaysEl.innerHTML = "";
  const res = await fetch(HISTORY_URL, { cache: "no-store" });
  if (!res.ok) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "No history index found.";
    previousDaysEl.appendChild(li);
    return;
  }
  const history = await res.json();
  const entries = Array.isArray(history.contracts) ? history.contracts : [];
  const filtered = entries.filter((e) => e.date !== currentDate);
  if (!filtered.length) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "No previous days yet.";
    previousDaysEl.appendChild(li);
    return;
  }
  filtered.forEach((entry) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `?contract=${encodeURIComponent(entry.file)}`;
    link.textContent = entry.date;
    link.className = "history-link";
    li.appendChild(link);
    previousDaysEl.appendChild(li);
  });
}

function resetChecks() {
  if (!stateKey) return;
  localStorage.removeItem(stateKey);
  localStorage.removeItem(`${stateKey}:killed`);
  loadContract();
}

unlockBtnEl.addEventListener("click", unlock);
lockBtnEl.addEventListener("click", lock);
resetBtnEl.addEventListener("click", resetChecks);
passwordInputEl.addEventListener("keydown", (evt) => {
  if (evt.key === "Enter") unlock();
});

if (sessionStorage.getItem("dailyContractUnlocked") === "1") {
  gateEl.classList.add("hidden");
  appEl.classList.remove("hidden");
  loadContract();
}
