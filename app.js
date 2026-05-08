const productCatalog = [
  {
    id: "eco-backpack",
    name: "Eco Backpack",
    category: "Travel Gear",
    tags: ["travel", "sustainable", "commute", "school", "backpack", "luggage"],
    needs: ["carry items", "reduce waste", "travel light"],
    price: "medium",
    message: "A durable backpack made with recycled materials for daily trips and travel.",
  },
  {
    id: "budget-app-pro",
    name: "Budget App Pro",
    category: "Finance",
    tags: ["budget", "saving", "money", "finance", "spending", "debt", "invest"],
    needs: ["track spending", "save money", "plan budget"],
    price: "low",
    message: "A simple budgeting app for tracking spending and building savings habits.",
  },
  {
    id: "protein-powder",
    name: "Protein Powder",
    category: "Fitness",
    tags: ["fitness", "gym", "workout", "protein", "muscle", "nutrition", "meal"],
    needs: ["build muscle", "recover after workouts", "increase protein"],
    price: "medium",
    message: "A protein supplement for post-workout recovery and nutrition goals.",
  },
  {
    id: "air-fryer",
    name: "Air Fryer",
    category: "Kitchen",
    tags: ["cooking", "kitchen", "meal prep", "healthy food", "appliance", "quick meals"],
    needs: ["cook quickly", "eat healthier", "meal prep"],
    price: "medium",
    message: "A compact kitchen appliance for quick meals with less oil.",
  },
  {
    id: "noise-cancelling-buds",
    name: "Noise Cancelling Buds",
    category: "Productivity",
    tags: ["study", "focus", "music", "commute", "noise", "productivity", "travel"],
    needs: ["focus", "block noise", "study better"],
    price: "medium",
    message: "Wireless earbuds that reduce background noise for work, study, and travel.",
  },
  {
    id: "habit-journal",
    name: "Habit Journal",
    category: "Wellness",
    tags: ["habit", "planning", "journal", "productivity", "study", "wellness", "routine"],
    needs: ["build habits", "plan routines", "reflect daily"],
    price: "low",
    message: "A guided journal for planning routines and tracking daily progress.",
  },
  {
    id: "language-course",
    name: "Language Course",
    category: "Education",
    tags: ["language", "travel", "study", "learning", "career", "international"],
    needs: ["learn language", "prepare for travel", "improve career"],
    price: "medium",
    message: "Short lessons for building everyday language skills.",
  },
  {
    id: "desk-lamp",
    name: "Focus Desk Lamp",
    category: "Study",
    tags: ["study", "desk", "focus", "reading", "dorm", "workspace"],
    needs: ["study better", "improve workspace", "read comfortably"],
    price: "low",
    message: "An adjustable desk lamp for focused reading and study sessions.",
  },
];

const signalDictionary = [
  { label: "travel", keywords: ["travel", "trip", "flight", "hotel", "airport", "tour", "vacation", "luggage"] },
  { label: "sustainability", keywords: ["sustainable", "eco", "green", "recycled", "carbon", "environment"] },
  { label: "budget", keywords: ["budget", "cheap", "save", "saving", "money", "cost", "expensive", "debt"] },
  { label: "fitness", keywords: ["fitness", "gym", "workout", "exercise", "muscle", "training", "protein"] },
  { label: "cooking", keywords: ["cook", "cooking", "kitchen", "meal", "recipe", "food", "healthy food", "meal prep"] },
  { label: "study", keywords: ["study", "exam", "class", "homework", "focus", "learn", "reading", "college"] },
  { label: "productivity", keywords: ["productive", "productivity", "habit", "routine", "plan", "schedule", "organize"] },
  { label: "wellness", keywords: ["wellness", "stress", "sleep", "mindful", "health", "routine"] },
  { label: "career", keywords: ["career", "job", "internship", "resume", "interview", "professional"] },
  { label: "urgent", keywords: ["urgent", "soon", "quickly", "today", "tomorrow", "asap", "immediately"] },
  { label: "positive", keywords: ["great", "love", "excited", "happy", "good", "nice", "interested"] },
  { label: "negative", keywords: ["worried", "hard", "bad", "confused", "stressed", "frustrated", "problem"] },
];

const replies = [
  {
    match: ["travel", "trip", "flight", "hotel"],
    text: "Start with your destination, dates, budget, and what kind of pace you want.",
  },
  {
    match: ["budget", "money", "save", "cost"],
    text: "A simple first step is to list fixed costs, flexible costs, and one realistic savings target.",
  },
  {
    match: ["fitness", "gym", "workout", "exercise"],
    text: "Pick a realistic schedule first, then balance strength, cardio, recovery, and nutrition.",
  },
  {
    match: ["cook", "meal", "food", "recipe"],
    text: "Choose a few repeatable meals, then plan ingredients around time, budget, and nutrition.",
  },
  {
    match: ["study", "exam", "class", "learn"],
    text: "Break the material into small blocks, test yourself often, and review mistakes deliberately.",
  },
  {
    match: ["career", "job", "internship", "resume"],
    text: "Start with the role you want, then match your resume evidence to that role’s requirements.",
  },
];

const state = {
  messages: [],
  rounds: 0,
  threshold: 45,
  adShownFor: new Set(),
  decisionLog: [],
};

const elements = {
  form: document.querySelector("#chatForm"),
  input: document.querySelector("#messageInput"),
  conversation: document.querySelector("#conversation"),
  thresholdInput: document.querySelector("#thresholdInput"),
  thresholdValue: document.querySelector("#thresholdValue"),
  roundCount: document.querySelector("#roundCount"),
  topScore: document.querySelector("#topScore"),
  adStatus: document.querySelector("#adStatus"),
  triggerExplanation: document.querySelector("#triggerExplanation"),
  candidateCount: document.querySelector("#candidateCount"),
  candidateList: document.querySelector("#candidateList"),
  memoryCount: document.querySelector("#memoryCount"),
  memorySignals: document.querySelector("#memorySignals"),
  decisionLog: document.querySelector("#decisionLog"),
  resetButton: document.querySelector("#resetButton"),
  clearLogButton: document.querySelector("#clearLogButton"),
};

elements.form.addEventListener("submit", handleSubmit);
elements.thresholdInput.addEventListener("input", handleThresholdChange);
elements.resetButton.addEventListener("click", resetSimulation);
elements.clearLogButton.addEventListener("click", () => {
  state.decisionLog = [];
  render();
});

render();

function handleSubmit(event) {
  event.preventDefault();
  const text = elements.input.value.trim();
  if (!text) return;

  addMessage("user", text);
  elements.input.value = "";

  const aiText = generateConciseReply(text);
  addMessage("ai", aiText);
  state.rounds += 1;
  logDecision(`Round ${state.rounds} completed. Scores recalculated after user-AI exchange.`);

  const analysis = analyzeConversation();
  maybeInsertAd(analysis);
  render();
}

function handleThresholdChange(event) {
  state.threshold = Number(event.target.value);
  logDecision(`Threshold manually adjusted to ${state.threshold} pts.`);
  const analysis = analyzeConversation();
  maybeInsertAd(analysis);
  render();
}

function addMessage(role, text, meta = {}) {
  state.messages.push({
    role,
    text,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    ...meta,
  });
}

function generateConciseReply(text) {
  const normalized = text.toLowerCase();
  const found = replies.find((reply) => reply.match.some((word) => normalized.includes(word)));
  if (found) return found.text;

  if (normalized.includes("?")) {
    return "A useful way to approach it is to define the goal, constraints, and next step.";
  }

  return "Got it. What would you like to focus on next?";
}

function analyzeConversation() {
  const userText = state.messages
    .filter((message) => message.role === "user")
    .map((message) => message.text)
    .join(" ")
    .toLowerCase();

  const signals = extractSignals(userText);
  const candidates = productCatalog
    .map((product) => scoreProduct(product, userText, signals))
    .filter((candidate) => candidate.eligible)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));

  return { signals, candidates };
}

function extractSignals(text) {
  const signals = [];
  for (const signal of signalDictionary) {
    const matched = signal.keywords.filter((keyword) => text.includes(keyword));
    if (matched.length) {
      signals.push({ label: signal.label, matched });
    }
  }
  return signals;
}

function scoreProduct(product, text, signals) {
  const reasons = [];
  const scoreLines = [];
  let score = 0;

  const tagMatches = product.tags.filter((tag) => text.includes(tag));
  if (tagMatches.length) {
    const points = Math.min(30, tagMatches.length * 10);
    score += points;
    reasons.push(`matched product tags: ${tagMatches.join(", ")}`);
    scoreLines.push(`+${points}: direct topic/tag match`);
  }

  const needMatches = product.needs.filter((need) => containsNeed(text, need));
  if (needMatches.length) {
    const points = Math.min(30, needMatches.length * 15);
    score += points;
    reasons.push(`matched inferred need: ${needMatches.join(", ")}`);
    scoreLines.push(`+${points}: inferred need match`);
  }

  const categoryMatch = text.includes(product.category.toLowerCase());
  if (categoryMatch) {
    score += 15;
    reasons.push(`matched category: ${product.category}`);
    scoreLines.push("+15: category match");
  }

  if (signals.some((signal) => signal.label === "budget") && product.price === "low") {
    score += 10;
    scoreLines.push("+10: low-price fit for budget signal");
  }

  if (signals.some((signal) => signal.label === "urgent")) {
    score += 8;
    scoreLines.push("+8: urgency signal");
  }

  const sentimentSignal = signals.find((signal) => signal.label === "positive" || signal.label === "negative");
  if (sentimentSignal && score > 0) {
    score += 5;
    scoreLines.push(`+5: sentiment alignment (${sentimentSignal.label})`);
  }

  const eligible = reasons.length > 0;
  return {
    product,
    eligible,
    score: eligible ? score : 0,
    reasons,
    scoreLines: eligible ? scoreLines : ["Not eligible: no topic, need, category, or preference match"],
  };
}

function containsNeed(text, need) {
  if (text.includes(need)) return true;
  const words = need.split(/\s+/).filter((word) => word.length > 3);
  return words.some((word) => text.includes(word));
}

function maybeInsertAd(analysis) {
  const top = analysis.candidates[0];
  if (!top) {
    updateTriggerExplanation("No ad: no product has a meaningful conversation or memory match yet.");
    return;
  }

  const scoreReady = top.score >= state.threshold;
  const roundsReady = state.rounds >= 3;
  const alreadyShown = state.adShownFor.has(top.product.id);

  if (scoreReady && roundsReady && !alreadyShown) {
    addMessage("ad", top.product.message, {
      productName: top.product.name,
      score: top.score,
    });
    state.adShownFor.add(top.product.id);
    logDecision(`Ad inserted for ${top.product.name}: ${top.score} pts reached threshold after ${state.rounds} rounds.`);
    updateTriggerExplanation(`${top.product.name} crossed the threshold after the minimum three-round delay.`);
    return;
  }

  if (scoreReady && !roundsReady) {
    updateTriggerExplanation(`${top.product.name} is eligible by score, but ads are blocked until three user-AI rounds complete.`);
    logDecision(`${top.product.name} reached ${top.score} pts, blocked by ${state.rounds}/3 round gate.`);
    return;
  }

  if (!scoreReady) {
    updateTriggerExplanation(`${top.product.name} is the top candidate, but its score is below the current threshold.`);
  } else if (alreadyShown) {
    updateTriggerExplanation(`${top.product.name} already appeared as an ad, so it will not repeat.`);
  }
}

function updateTriggerExplanation(text) {
  elements.triggerExplanation.textContent = text;
}

function render() {
  const analysis = analyzeConversation();
  renderConversation();
  renderControls(analysis);
  renderCandidates(analysis);
  renderMemory(analysis.signals);
  renderDecisionLog();
}

function renderConversation() {
  const opening = `
    <article class="message ai">
      <div class="avatar">AI</div>
      <div class="bubble">
        <p>Hi. Ask me anything.</p>
        <span class="time">Ready</span>
      </div>
    </article>
  `;

  const messages = state.messages
    .map((message) => {
      const role = message.role === "user" ? "user" : message.role === "ad" ? "ad ai" : "ai";
      const label = message.role === "user" ? "You" : "AI";
      const adLabel = message.role === "ad" ? `<span class="ad-label">Sponsored message</span>` : "";
      const score = message.role === "ad" ? `<span class="time">${message.productName} · ${message.score} pts</span>` : "";
      return `
        <article class="message ${role}">
          <div class="avatar">${label === "You" ? "You" : "AI"}</div>
          <div class="bubble">
            ${adLabel}
            <p>${escapeHtml(message.text)}</p>
            ${score || `<span class="time">${message.time}</span>`}
          </div>
        </article>
      `;
    })
    .join("");

  elements.conversation.innerHTML = opening + messages;
  elements.conversation.scrollTop = elements.conversation.scrollHeight;
}

function renderControls(analysis) {
  const top = analysis.candidates[0];
  const topScore = top ? top.score : 0;
  const scoreReady = topScore >= state.threshold;
  const roundsReady = state.rounds >= 3;

  elements.thresholdValue.textContent = `${state.threshold} pts`;
  elements.roundCount.textContent = `${Math.min(state.rounds, 3)}/3`;
  elements.topScore.textContent = `${topScore} pts`;

  if (!top) {
    elements.adStatus.textContent = "No candidate";
  } else if (scoreReady && roundsReady && !state.adShownFor.has(top.product.id)) {
    elements.adStatus.textContent = "Ready";
  } else if (scoreReady && !roundsReady) {
    elements.adStatus.textContent = "Score blocked";
  } else if (state.adShownFor.has(top.product.id)) {
    elements.adStatus.textContent = "Shown";
  } else {
    elements.adStatus.textContent = "Below score";
  }
}

function renderCandidates(analysis) {
  elements.candidateCount.textContent = `${analysis.candidates.length} shown`;

  if (!analysis.candidates.length) {
    elements.candidateList.innerHTML = `
      <div class="empty-state">
        No promotion candidates yet. Products enter this list only after a topic, need, category, or preference in the conversation matches the product catalog.
      </div>
    `;
    return;
  }

  elements.candidateList.innerHTML = analysis.candidates
    .map((candidate, index) => {
      const percent = Math.min(100, candidate.score);
      const scoreReady = candidate.score >= state.threshold;
      const roundsReady = state.rounds >= 3;
      let status = "Below threshold";
      let statusClass = "";

      if (scoreReady && roundsReady) {
        status = state.adShownFor.has(candidate.product.id) ? "Ad already shown" : "Eligible to trigger ad";
        statusClass = "ready";
      } else if (scoreReady && !roundsReady) {
        status = `Score ready, blocked by ${state.rounds}/3 rounds`;
        statusClass = "blocked";
      }

      return `
        <article class="candidate-card ${index === 0 ? "top" : ""}">
          <div class="candidate-top">
            <strong>${escapeHtml(candidate.product.name)}</strong>
            <span>${candidate.score} pts</span>
          </div>
          <div class="bar" aria-hidden="true"><div class="bar-fill" style="width: ${percent}%"></div></div>
          <p class="candidate-reason"><strong>Candidate because:</strong> ${escapeHtml(candidate.reasons.join("; "))}</p>
          <p class="score-line">${escapeHtml(candidate.scoreLines.join(" | "))}</p>
          <span class="status-pill ${statusClass}">${escapeHtml(status)}</span>
        </article>
      `;
    })
    .join("");
}

function renderMemory(signals) {
  elements.memoryCount.textContent = `${signals.length} signals`;

  if (!signals.length) {
    elements.memorySignals.innerHTML = `<span class="empty-state">No memory signals extracted yet.</span>`;
    return;
  }

  elements.memorySignals.innerHTML = signals
    .map((signal) => `<span class="memory-chip">${escapeHtml(signal.label)}: ${escapeHtml(signal.matched.slice(0, 2).join(", "))}</span>`)
    .join("");
}

function renderDecisionLog() {
  elements.decisionLog.innerHTML = state.decisionLog
    .slice(-12)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
}

function logDecision(text) {
  state.decisionLog.push(text);
}

function resetSimulation() {
  state.messages = [];
  state.rounds = 0;
  state.adShownFor = new Set();
  state.decisionLog = ["Simulation reset."];
  updateTriggerExplanation("Ads require a top candidate score at or above the threshold and at least three complete user-AI rounds.");
  render();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
