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
const clearLogBtnEl = document.getElementById("clear-log-btn");

const contractMetaEl = document.getElementById("contract-meta");
const priorityContextEl = document.getElementById("priority-context");
const priorityProjectEl = document.getElementById("priority-project");
const pressingNowEl = document.getElementById("pressing-now");
const todayHopperEl = document.getElementById("today-hopper");
const adherencePillEl = document.getElementById("adherence-pill");
const nextPriorityEl = document.getElementById("next-priority");
const adherenceMetricsEl = document.getElementById("adherence-metrics");
const competingDemandsEl = document.getElementById("competing-demands");
const laterQueueEl = document.getElementById("later-queue");
const previousDaysEl = document.getElementById("previous-days");
const consistencySummaryEl = document.getElementById("consistency-summary");
const heatmapGridEl = document.getElementById("heatmap-grid");
const contractLogEl = document.getElementById("contract-log");
const notesEl = document.getElementById("notes");

let activeContractUrl = CONTRACT_URL;
let currentDate = null;
let currentContract = null;

function getContractUrlFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("contract");
  if (!fromQuery) return CONTRACT_URL;
  if (fromQuery.includes("..")) return CONTRACT_URL;
  return fromQuery;
}

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function checksKey(date) {
  return `dailyContractChecks:${date}`;
}

function orderKey(date) {
  return `dailyContractOrder:${date}:hopper`;
}

function eventsKey(date) {
  return `dailyContractEvents:${date}`;
}

function disciplineKey(date) {
  return `dailyContractDiscipline:${date}`;
}

function loadChecks(date) {
  if (!date) return {};
  return loadJson(checksKey(date), {});
}

function saveChecks(date, checks) {
  if (!date) return;
  saveJson(checksKey(date), checks);
}

function loadOrder(date) {
  if (!date) return [];
  return loadJson(orderKey(date), []);
}

function saveOrder(date, ids) {
  if (!date) return;
  saveJson(orderKey(date), ids);
}

function loadContractEvents(date) {
  if (!date) return [];
  return loadJson(eventsKey(date), []);
}

function saveContractEvents(date, events) {
  if (!date) return;
  saveJson(eventsKey(date), events);
}

function appendContractEvent(message) {
  if (!currentDate) return;
  const events = loadContractEvents(currentDate);
  events.unshift({ at: new Date().toISOString(), message });
  saveContractEvents(currentDate, events.slice(0, 300));
  renderContractLog();
}

function loadDiscipline(date) {
  if (!date) {
    return { total_checks: 0, in_order_checks: 0, jump_checks: 0, reorder_count: 0 };
  }
  return loadJson(disciplineKey(date), {
    total_checks: 0,
    in_order_checks: 0,
    jump_checks: 0,
    reorder_count: 0,
  });
}

function saveDiscipline(date, discipline) {
  if (!date) return;
  saveJson(disciplineKey(date), discipline);
}

function updateDiscipline(date, updater) {
  const current = loadDiscipline(date);
  const next = updater({ ...current });
  saveDiscipline(date, next);
}

function formatEventTime(isoTs) {
  const dt = new Date(isoTs);
  if (Number.isNaN(dt.getTime())) return isoTs;
  return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function renderContractLog() {
  if (!contractLogEl) return;
  contractLogEl.innerHTML = "";
  const events = loadContractEvents(currentDate);
  if (!events.length) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "No contract events yet.";
    contractLogEl.appendChild(li);
    return;
  }
  events.forEach((evt) => {
    const li = document.createElement("li");
    const line = document.createElement("p");
    line.className = "log-line";
    line.textContent = `[${formatEventTime(evt.at)}] ${evt.message}`;
    li.appendChild(line);
    contractLogEl.appendChild(li);
  });
}

function normalizeContract(raw) {
  const todayHopper = Array.isArray(raw.today_hopper)
    ? raw.today_hopper
    : Array.isArray(raw.current_pull?.checklist)
      ? raw.current_pull.checklist
      : [];

  const laterQueue = Array.isArray(raw.later_queue)
    ? raw.later_queue
    : Array.isArray(raw.holding_tank)
      ? raw.holding_tank
      : Array.isArray(raw.parking_lot)
        ? raw.parking_lot
        : [];

  const competingDemands = Array.isArray(raw.competing_demands)
    ? raw.competing_demands
    : [];

  const hopperLimit = Number(raw.pull_rules?.today_hopper_limit) || 5;
  const priorityProject = raw.priority_project || raw.active_project || "";
  const priorityContainer = raw.priority_container || "";
  const priorityWorkstream = raw.priority_workstream || "";

  return {
    date: raw.date || "unknown-date",
    owner: raw.owner || "Kamran",
    notes: raw.notes || "",
    hopperLimit,
    priorityProject,
    priorityContainer,
    priorityWorkstream,
    todayHopper,
    laterQueue,
    competingDemands,
  };
}

function makeHopperEntries(items) {
  return (items || []).map((text, idx) => ({
    text,
    idx,
    id: `hopper-${idx}`,
  }));
}

function getOrderedHopperEntries(items) {
  const entries = makeHopperEntries(items);
  const savedOrder = loadOrder(currentDate);
  if (!savedOrder.length) return entries;

  const rank = new Map(savedOrder.map((id, idx) => [id, idx]));
  entries.sort((a, b) => {
    const aRank = rank.has(a.id) ? rank.get(a.id) : Number.MAX_SAFE_INTEGER;
    const bRank = rank.has(b.id) ? rank.get(b.id) : Number.MAX_SAFE_INTEGER;
    if (aRank !== bRank) return aRank - bRank;
    return a.idx - b.idx;
  });
  saveOrder(currentDate, entries.map((entry) => entry.id));
  return entries;
}

function getNextPriorityEntry(orderedEntries, checks) {
  return orderedEntries.find((entry) => !checks[`pull-${entry.idx}`]) || null;
}

function moveHopperEntry(entryId, delta) {
  const ordered = getOrderedHopperEntries(currentContract.todayHopper);
  const from = ordered.findIndex((entry) => entry.id === entryId);
  if (from < 0) return null;
  const to = from + delta;
  if (to < 0 || to >= ordered.length) return null;

  const [moved] = ordered.splice(from, 1);
  ordered.splice(to, 0, moved);
  saveOrder(
    currentDate,
    ordered.map((entry) => entry.id),
  );
  return { text: moved.text, from: from + 1, to: to + 1 };
}

function buildHopper(items) {
  if (!todayHopperEl) return;
  todayHopperEl.innerHTML = "";

  const orderedEntries = getOrderedHopperEntries(items);
  const positions = new Map(orderedEntries.map((entry, idx) => [entry.id, idx]));
  const checks = loadChecks(currentDate);

  orderedEntries.forEach((entry) => {
    const checkId = `pull-${entry.idx}`;
    const isDone = !!checks[checkId];

    const li = document.createElement("li");

    const main = document.createElement("div");
    main.className = "checklist-item-main";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = isDone;

    const label = document.createElement("label");
    label.textContent = entry.text;
    if (isDone) label.classList.add("done");

    cb.addEventListener("change", () => {
      const beforeChecks = loadChecks(currentDate);
      const orderedNow = getOrderedHopperEntries(currentContract.todayHopper);
      const expectedNext = getNextPriorityEntry(orderedNow, beforeChecks);

      const nextChecks = { ...beforeChecks, [checkId]: cb.checked };
      saveChecks(currentDate, nextChecks);

      if (cb.checked) {
        const inOrder = expectedNext && expectedNext.idx === entry.idx;
        updateDiscipline(currentDate, (d) => {
          d.total_checks += 1;
          if (inOrder) d.in_order_checks += 1;
          else d.jump_checks += 1;
          return d;
        });
        if (inOrder) {
          appendContractEvent(`Checked off in priority order: ${entry.text}`);
        } else {
          const expectedText = expectedNext ? expectedNext.text : "top priority item";
          appendContractEvent(`Priority jump: checked '${entry.text}' before '${expectedText}'`);
        }
      } else {
        appendContractEvent(`Unchecked: ${entry.text}`);
      }

      buildHopper(currentContract.todayHopper);
      renderContractMeta();
      renderAdherence();
      loadHistory(currentDate);
    });

    main.appendChild(cb);
    main.appendChild(label);
    li.appendChild(main);

    const controls = document.createElement("div");
    controls.className = "reorder-controls";

    const upBtn = document.createElement("button");
    upBtn.type = "button";
    upBtn.className = "secondary tiny reorder-btn";
    upBtn.textContent = "↑";

    const downBtn = document.createElement("button");
    downBtn.type = "button";
    downBtn.className = "secondary tiny reorder-btn";
    downBtn.textContent = "↓";

    const position = positions.get(entry.id);
    upBtn.disabled = position === 0;
    downBtn.disabled = position === orderedEntries.length - 1;

    upBtn.addEventListener("click", () => {
      const move = moveHopperEntry(entry.id, -1);
      if (!move) return;
      updateDiscipline(currentDate, (d) => {
        d.reorder_count += 1;
        return d;
      });
      appendContractEvent(`Reordered up (${move.from} -> ${move.to}): ${move.text}`);
      buildHopper(currentContract.todayHopper);
      renderAdherence();
    });

    downBtn.addEventListener("click", () => {
      const move = moveHopperEntry(entry.id, 1);
      if (!move) return;
      updateDiscipline(currentDate, (d) => {
        d.reorder_count += 1;
        return d;
      });
      appendContractEvent(`Reordered down (${move.from} -> ${move.to}): ${move.text}`);
      buildHopper(currentContract.todayHopper);
      renderAdherence();
    });

    controls.appendChild(upBtn);
    controls.appendChild(downBtn);
    li.appendChild(controls);
    todayHopperEl.appendChild(li);
  });
}

function buildPlainList(ul, items) {
  if (!ul) return;
  ul.innerHTML = "";
  if (!items || !items.length) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "None listed.";
    ul.appendChild(li);
    return;
  }
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
}

function renderContractMeta() {
  const checks = loadChecks(currentDate);
  const total = currentContract.todayHopper.length;
  const done = currentContract.todayHopper.filter((_, idx) => checks[`pull-${idx}`]).length;
  contractMetaEl.textContent = `${currentContract.date} | Owner: ${currentContract.owner} | Hopper cap: ${currentContract.hopperLimit} | Checked: ${done}/${total}`;
}

function renderPriorityFocus() {
  if (priorityContextEl) {
    if (currentContract.priorityContainer || currentContract.priorityWorkstream) {
      const parts = [];
      if (currentContract.priorityContainer) parts.push(`Container: ${currentContract.priorityContainer}`);
      if (currentContract.priorityWorkstream) parts.push(`Workstream: ${currentContract.priorityWorkstream}`);
      priorityContextEl.textContent = parts.join(" | ");
    } else {
      priorityContextEl.textContent = "Set a container and workstream for day orientation.";
    }
  }
  if (priorityProjectEl) {
    priorityProjectEl.textContent = currentContract.priorityProject || "Not set";
  }
}

function renderAdherence() {
  if (!adherencePillEl || !adherenceMetricsEl || !nextPriorityEl) return;

  const discipline = loadDiscipline(currentDate);
  const checks = loadChecks(currentDate);
  const ordered = getOrderedHopperEntries(currentContract.todayHopper);
  const nextPriority = getNextPriorityEntry(ordered, checks);

  nextPriorityEl.textContent = nextPriority
    ? `Next priority: ${nextPriority.text}`
    : "All contract tasks checked off.";
  if (pressingNowEl) {
    pressingNowEl.textContent = nextPriority
      ? `Most pressing now: ${nextPriority.text}`
      : "Most pressing now: contract complete.";
  }

  adherenceMetricsEl.innerHTML = "";
  const metrics = [
    `In-order checkoffs: ${discipline.in_order_checks}/${discipline.total_checks}`,
    `Priority jumps: ${discipline.jump_checks}`,
    `Reorders: ${discipline.reorder_count}`,
  ];
  metrics.forEach((metric) => {
    const li = document.createElement("li");
    li.textContent = metric;
    adherenceMetricsEl.appendChild(li);
  });

  adherencePillEl.className = "pill";
  if (discipline.total_checks === 0 && discipline.reorder_count === 0) {
    adherencePillEl.textContent = "No Signal Yet";
    return;
  }
  if (discipline.jump_checks === 0) {
    adherencePillEl.textContent = "On Contract";
    return;
  }
  if (discipline.jump_checks === 1) {
    adherencePillEl.textContent = "Minor Drift";
    adherencePillEl.classList.add("warn");
    return;
  }
  adherencePillEl.textContent = "Priority Drift";
  adherencePillEl.classList.add("danger");
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
    const checks = JSON.parse(localStorage.getItem(checksKey(dateStr)) || "{}");
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

function buildHeatmap(anchorDate, entryMap) {
  if (!heatmapGridEl) return;
  heatmapGridEl.innerHTML = "";
  const end = parseDate(anchorDate) || new Date();
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

function buildConsistencyStats(entries, anchorDate) {
  if (!consistencySummaryEl || !heatmapGridEl) return;
  consistencySummaryEl.textContent = "";
  if (!entries.length) {
    consistencySummaryEl.textContent = "No contract history yet.";
    buildHeatmap(anchorDate, new Map());
    return;
  }

  const dates = uniqueDates(entries);
  const dateSet = new Set(dates);
  const entryMap = new Map(entries.map((e) => [e.date, e]));
  const now = parseDate(anchorDate) || new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-`;
  const monthCreated = dates.filter((d) => d.startsWith(monthPrefix)).length;
  const monthTotal = daysInMonth(now);

  let last14Created = 0;
  for (let i = 0; i < 14; i += 1) {
    const dt = new Date(now);
    dt.setDate(now.getDate() - i);
    const key = dayKey(dt);
    if (dateSet.has(key)) last14Created += 1;
  }

  let streak = 0;
  for (let i = 0; i < 400; i += 1) {
    const dt = new Date(now);
    dt.setDate(now.getDate() - i);
    const key = dayKey(dt);
    if (dateSet.has(key)) streak += 1;
    else break;
  }

  consistencySummaryEl.textContent = `Created this month: ${monthCreated}/${monthTotal} (${formatPct(
    monthCreated,
    monthTotal,
  )}) | Last 14 days: ${last14Created}/14 (${formatPct(last14Created, 14)}) | Streak: ${streak} day${
    streak === 1 ? "" : "s"
  }`;

  buildHeatmap(anchorDate, entryMap);
}

async function loadHistory(anchorDate) {
  if (!previousDaysEl) return;
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
  buildConsistencyStats(entries, anchorDate);

  const filtered = entries.filter((e) => e.date !== anchorDate);
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

async function loadContract() {
  activeContractUrl = getContractUrlFromQuery();
  const res = await fetch(activeContractUrl, { cache: "no-store" });
  if (!res.ok) {
    contractMetaEl.textContent = `Could not load ${activeContractUrl}.`;
    return;
  }

  const raw = await res.json();
  currentContract = normalizeContract(raw);
  currentDate = currentContract.date;

  renderContractMeta();
  renderPriorityFocus();
  buildHopper(currentContract.todayHopper);
  renderAdherence();
  buildPlainList(competingDemandsEl, currentContract.competingDemands);
  buildPlainList(laterQueueEl, currentContract.laterQueue);
  notesEl.textContent = currentContract.notes;
  renderContractLog();
  await loadHistory(currentDate);
}

function resetChecks() {
  if (!currentDate) return;
  localStorage.removeItem(checksKey(currentDate));
  localStorage.removeItem(orderKey(currentDate));
  localStorage.removeItem(disciplineKey(currentDate));
  appendContractEvent("Reset contract progress and priority order.");
  buildHopper(currentContract.todayHopper);
  renderContractMeta();
  renderAdherence();
  loadHistory(currentDate);
}

function clearContractLog() {
  if (!currentDate) return;
  localStorage.removeItem(eventsKey(currentDate));
  renderContractLog();
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
  const bytes = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  const candidate = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

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

unlockBtnEl.addEventListener("click", unlock);
lockBtnEl.addEventListener("click", lock);
resetBtnEl.addEventListener("click", resetChecks);
if (clearLogBtnEl) clearLogBtnEl.addEventListener("click", clearContractLog);

passwordInputEl.addEventListener("keydown", (evt) => {
  if (evt.key === "Enter") unlock();
});

if (sessionStorage.getItem("dailyContractUnlocked") === "1") {
  gateEl.classList.add("hidden");
  appEl.classList.remove("hidden");
  loadContract();
}
