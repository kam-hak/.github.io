const PASSWORD_SHA256_HEX = "d39d744b1a714c2ebe2fc72da7ead6e44fe17d48a031a3234495dd478c461d62";
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
const consistencySummaryEl = document.getElementById("consistency-summary");
const heatmapGridEl = document.getElementById("heatmap-grid");
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
    const id = `${keyPrefix}-${idx}`;
    const isDone = !!checks[id];
    if (keyPrefix === "pull" && isDone) {
      return;
    }
    const li = document.createElement("li");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = isDone;
    const label = document.createElement("label");
    label.textContent = item;
    if (cb.checked) label.classList.add("done");
    cb.addEventListener("change", () => {
      const next = loadChecks();
      next[id] = cb.checked;
      saveChecks(next);
      if (keyPrefix === "pull") {
        loadContract();
        return;
      }
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

function parseDate(dateStr) {
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return null;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
}

function formatPct(numerator, denominator) {
  if (!denominator) return "0%";
  return `${Math.round((numerator / denominator) * 100)}%`;
}

function uniqueDates(entries) {
  return Array.from(new Set(entries.map((e) => e.date))).sort();
}

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function dayKey(dt) {
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
    dt.getDate(),
  ).padStart(2, "0")}`;
}

function getCheckedCountForDate(dateStr) {
  try {
    const checks = JSON.parse(localStorage.getItem(`dailyContractChecks:${dateStr}`) || "{}");
    return Object.values(checks).filter(Boolean).length;
  } catch {
    return 0;
  }
}

function getCheckedCountFromMetadata(entry) {
  if (typeof entry.checked_off_count === "number") return entry.checked_off_count;
  if (entry.metrics && typeof entry.metrics.checked_off_count === "number") {
    return entry.metrics.checked_off_count;
  }
  return null;
}

function levelForCount(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (n <= 3) return 2;
  if (n <= 5) return 3;
  return 4;
}

function buildHeatmap(currentDate, entryMap) {
  heatmapGridEl.innerHTML = "";
  const end = parseDate(currentDate) || new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - 83);

  for (let i = 0; i < 84; i += 1) {
    const dt = new Date(start);
    dt.setDate(start.getDate() + i);
    const key = dayKey(dt);
    const metaCount = entryMap.has(key) ? getCheckedCountFromMetadata(entryMap.get(key)) : null;
    const count = metaCount == null ? getCheckedCountForDate(key) : metaCount;
    const level = levelForCount(count);
    const cell = document.createElement("div");
    cell.className = `heat-cell level-${level}`;
    cell.title = `${key}: ${count} checked off`;
    heatmapGridEl.appendChild(cell);
  }
}

function buildConsistencyStats(entries, currentDate) {
  consistencySummaryEl.textContent = "";
  if (!entries.length) {
    consistencySummaryEl.textContent = "No contract history yet.";
    buildHeatmap(currentDate, new Map());
    return;
  }

  const dates = uniqueDates(entries);
  const dateSet = new Set(dates);
  const entryMap = new Map(entries.map((e) => [e.date, e]));
  const now = parseDate(currentDate) || new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-`;
  const monthCreated = dates.filter((d) => d.startsWith(monthPrefix)).length;
  const monthTotal = daysInMonth(now);

  let last14Created = 0;
  for (let i = 0; i < 14; i += 1) {
    const dt = new Date(now);
    dt.setDate(now.getDate() - i);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
      dt.getDate(),
    ).padStart(2, "0")}`;
    if (dateSet.has(key)) last14Created += 1;
  }

  let streak = 0;
  for (let i = 0; i < 400; i += 1) {
    const dt = new Date(now);
    dt.setDate(now.getDate() - i);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
      dt.getDate(),
    ).padStart(2, "0")}`;
    if (dateSet.has(key)) streak += 1;
    else break;
  }

  consistencySummaryEl.textContent = `Created this month: ${monthCreated}/${monthTotal} (${formatPct(
    monthCreated,
    monthTotal,
  )}) | Last 14 days: ${last14Created}/14 (${formatPct(
    last14Created,
    14,
  )}) | Streak: ${streak} day${streak === 1 ? "" : "s"}`;
  buildHeatmap(currentDate, entryMap);
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

function buildKilledList(pullChecklistItems, checks) {
  const killed = loadKilled();
  killedListEl.innerHTML = "";
  const donePullItems = (pullChecklistItems || []).filter((item, idx) => {
    const id = `pull-${idx}`;
    return !!checks[id];
  });
  const combined = [
    ...donePullItems.map((item) => ({ text: item, source: "pull" })),
    ...killed.map((item) => ({ text: item, source: "parking" })),
  ];

  if (!combined.length) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "Nothing killed yet.";
    killedListEl.appendChild(li);
    return;
  }
  combined.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "killed";
    const text = document.createElement("span");
    text.textContent = entry.text;
    const undo = document.createElement("button");
    undo.type = "button";
    undo.className = "secondary tiny";
    undo.textContent = "Undo";
    if (entry.source === "pull") {
      undo.addEventListener("click", () => {
        const next = loadChecks();
        const idx = (pullChecklistItems || []).indexOf(entry.text);
        if (idx >= 0) {
          next[`pull-${idx}`] = false;
          saveChecks(next);
        }
        loadContract();
      });
    } else {
      undo.addEventListener("click", () => {
        const nextKilled = loadKilled().filter((x) => x !== entry.text);
        saveKilled(nextKilled);
        loadContract();
      });
    }
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
  buildKilledList(contract.current_pull?.checklist || [], checks);
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
  buildConsistencyStats(entries, currentDate);
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
