// Add your photos to assets/ and edit these paths to match the filenames.
const photos = {
  cover: "assets/WhatsApp Image 2026-10-21 at 12.43.03 AM.jpeg",
  "memory-1": "assets/WhatsApp Image 2026-10-21 at 12.43.03 AM (1).jpeg",
  "memory-2": "assets/WhatsApp Image 2026-10-21 at 12.43.03 AM (2).jpeg",
  "memory-3": "assets/WhatsApp Image 2026-10-21 at 12.43.04 AM.jpeg",
  "memory-4": "assets/WhatsApp Image 2026-10-21 at 12.43.04 AM (1).jpeg",
  "memory-5": "assets/WhatsApp Image 2026-10-21 at 12.43.04 AM (2).jpeg",
  "memory-6": "assets/WhatsApp Image 2026-10-21 at 12.43.05 AM.jpeg",
  "memory-7": "assets/WhatsApp Image 2026-10-21 at 12.43.05 AM (1).jpeg",
  "memory-8": "assets/WhatsApp Image 2026-10-21 at 12.43.05 AM (2).jpeg",
  "memory-9": "assets/WhatsApp Image 2026-10-21 at 12.43.05 AM (3).jpeg",
  "memory-10": "assets/WhatsApp Image 2026-10-21 at 12.43.06 AM (1).jpeg",
  "memory-11": "assets/WhatsApp Image 2026-10-21 at 12.43.06 AM (2).jpeg",
  "memory-12": "assets/WhatsApp Image 2026-10-21 at 12.43.06 AM (3).jpeg",
  letter: "assets/WhatsApp Image 2026-10-21 at 12.43.03 AM.jpeg"
};

Object.entries(photos).forEach(([key, path]) => {
  const photo = document.querySelector(`[data-photo="${key}"]`);
  if (!photo || !path) return;
  photo.style.backgroundImage = `url("${path}")`;
  photo.classList.add("has-image");
});

// A gentle field of lavender and golden twinkles on every page.
const sparkleCanvas = document.getElementById("sparkles");
const sparkleContext = sparkleCanvas.getContext("2d");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const AudioContextClass = window.AudioContext;
let musicContext;
let musicStarted = false;
let musicStarting = false;
let musicTimer;
const melody = [67, null, 72, 74, 76, null, 74, 72, 69, null, 72, 76, 79, null, 76, 74];
const bassNotes = [43, 48, 50, 45];
const beatDuration = 0.3;
const loopDuration = 6.4;

function playTone(frequency, startTime, duration, volume, type) {
  const oscillator = musicContext.createOscillator();
  const envelope = musicContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  envelope.gain.setValueAtTime(0.001, startTime);
  envelope.gain.exponentialRampToValueAtTime(volume, startTime + 0.025);
  envelope.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  oscillator.connect(envelope);
  envelope.connect(musicContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.03);
}

function scheduleBirthdayTune() {
  if (!musicStarted || document.hidden) return;
  const startTime = musicContext.currentTime + 0.05;
  melody.forEach((note, index) => {
    const noteTime = startTime + index * beatDuration;
    if (note !== null) {
      playTone(440 * 2 ** ((note - 69) / 12), noteTime, 0.24, 0.045, "triangle");
    }
    if (index % 4 === 0) {
      const bass = bassNotes[Math.floor(index / 4)];
      playTone(440 * 2 ** ((bass - 69) / 12), noteTime, 0.48, 0.035, "sine");
    }
  });
  musicTimer = window.setTimeout(scheduleBirthdayTune, loopDuration * 1000);
}

async function startBirthdayTune() {
  if (musicStarting) return;
  if (!AudioContextClass) {
    console.error("The Web Audio API is not supported in this browser.");
    return;
  }
  musicStarting = true;
  try {
    if (!musicContext) musicContext = new AudioContextClass();
    await musicContext.resume();
    if (musicContext.state !== "running") return;
    if (!musicStarted) {
      musicStarted = true;
      document.removeEventListener("pointerdown", startBirthdayTune);
      document.removeEventListener("keydown", startBirthdayTune);
    }
    scheduleBirthdayTune();
  } catch (error) {
    if (error.name === "NotAllowedError") {
      return;
    }
    console.error("Unable to start the birthday tune.", error);
  } finally {
    musicStarting = false;
  }
}

document.addEventListener("pointerdown", startBirthdayTune);
document.addEventListener("keydown", startBirthdayTune);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    window.clearTimeout(musicTimer);
    if (musicStarted && musicContext?.state === "running") {
      musicContext.suspend().catch((error) => {
        console.error("Unable to pause the birthday tune while the page is hidden.", error);
      });
    }
  } else if (musicStarted) {
    startBirthdayTune();
  }
});
window.addEventListener("pagehide", () => {
  window.clearTimeout(musicTimer);
  if (musicContext) {
    musicContext.close().catch((error) => {
      console.error("Unable to close the birthday tune audio context.", error);
    });
  }
}, { once: true });
startBirthdayTune();

let stars = [];
let sparkleFrame = 0;
const sparkleColors = ["#a77bc1", "#d1a6d7", "#e3bc74", "#fffdf2"];

function sizeSparkleCanvas() {
  const ratio = window.devicePixelRatio || 1;
  sparkleCanvas.width = window.innerWidth * ratio;
  sparkleCanvas.height = window.innerHeight * ratio;
  sparkleContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from({ length: 86 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: 0.8 + Math.random() * 1.8,
    phase: Math.random() * Math.PI * 2,
    speed: 0.008 + Math.random() * 0.018,
    color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
    glint: Math.random() > 0.7
  }));
  if (!sparkleFrame) drawSparkles();
}

function drawSparkles() {
  sparkleContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach((star) => {
    star.phase += reducedMotion ? 0 : star.speed;
    const opacity = reducedMotion ? 0.34 : 0.12 + (Math.sin(star.phase) + 1) * 0.28;
    sparkleContext.globalAlpha = opacity;
    sparkleContext.fillStyle = star.color;
    sparkleContext.beginPath();
    sparkleContext.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    sparkleContext.fill();
    if (star.glint && opacity > 0.42) {
      sparkleContext.strokeStyle = star.color;
      sparkleContext.lineWidth = 0.7;
      sparkleContext.beginPath();
      sparkleContext.moveTo(star.x - star.size * 2.4, star.y);
      sparkleContext.lineTo(star.x + star.size * 2.4, star.y);
      sparkleContext.moveTo(star.x, star.y - star.size * 2.4);
      sparkleContext.lineTo(star.x, star.y + star.size * 2.4);
      sparkleContext.stroke();
    }
  });
  sparkleContext.globalAlpha = 1;
  if (!reducedMotion) sparkleFrame = requestAnimationFrame(drawSparkles);
}

sizeSparkleCanvas();
window.addEventListener("resize", sizeSparkleCanvas);

const festiveLayer = document.createElement("div");
festiveLayer.className = "festive-layer";
festiveLayer.setAttribute("aria-hidden", "true");
document.body.appendChild(festiveLayer);
const ribbon = document.createElement("div");
ribbon.className = "background-ribbon";
ribbon.setAttribute("aria-hidden", "true");
document.body.appendChild(ribbon);

document.querySelectorAll("main > section").forEach((section, index, sections) => {
  section.classList.add("decorated-section");
  ["top-left", "top-right", "bottom-left", "bottom-right"].forEach((corner) => {
    const ornament = document.createElement("span");
    ornament.className = `section-corner section-corner-${corner}`;
    ornament.textContent = "✿";
    ornament.setAttribute("aria-hidden", "true");
    section.appendChild(ornament);
  });
  if (index < sections.length - 1) {
    const separator = document.createElement("div");
    separator.className = "section-separator";
    separator.textContent = "✿  ✧  ✿";
    separator.setAttribute("aria-hidden", "true");
    section.after(separator);
  }
});

if (!reducedMotion) {
  const quotes = [
    "You make ordinary days feel like a little celebration. ♡",
    "The world is softer and brighter with you in it. ✿",
    "You deserve every lovely thing coming your way. ✨",
    "Being close to you is my favourite place to be. ♡"
  ];
  window.setInterval(() => {
    if (document.hidden) return;
    const quote = document.createElement("div");
    quote.className = "occasional-quote";
    quote.setAttribute("aria-hidden", "true");
    quote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    document.body.appendChild(quote);
    requestAnimationFrame(() => quote.classList.add("is-visible"));
    window.setTimeout(() => quote.remove(), 4600);
  }, 32000);

  window.setInterval(() => {
    if (document.hidden) return;
    const star = document.createElement("span");
    star.className = "shooting-star";
    star.style.setProperty("--star-x", `${35 + Math.random() * 65}vw`);
    star.style.setProperty("--star-y", `${Math.random() * 42}vh`);
    star.setAttribute("aria-hidden", "true");
    document.body.appendChild(star);
    window.setTimeout(() => star.remove(), 1600);
  }, 18000);
}

const balloonColors = ["#d9c8ee", "#efd0e7", "#c8dced", "#e2d2f3", "#ead9e8", "#d3c9ed"];
for (let i = 0; i < 8; i++) {
  const balloon = document.createElement("span");
  balloon.className = "festive-balloon";
  balloon.style.left = `${7 + i * 12}%`;
  balloon.style.setProperty("--balloon-color", balloonColors[i % balloonColors.length]);
  balloon.style.setProperty("--float-time", `${21 + (i % 4) * 4}s`);
  balloon.style.setProperty("--float-delay", `${-i * 3.1}s`);
  festiveLayer.appendChild(balloon);
}

[
  ["✿", 12, 18, "#a88ac2", 28, -2],
  ["♡", 82, 27, "#c28dad", 24, -5],
  ["✧", 91, 68, "#b39ad0", 22, -1],
  ["❀", 18, 76, "#9e86ba", 30, -4],
  ["⌁", 74, 88, "#b995c6", 35, -3],
  ["✦", 7, 52, "#c4a0c9", 19, -6],
  ["♡", 58, 16, "#d2a5c4", 18, -2]
].forEach(([symbol, left, top, color, size, delay]) => {
  const decoration = document.createElement("span");
  decoration.className = "festive-mark";
  decoration.textContent = symbol;
  decoration.style.left = `${left}%`;
  decoration.style.top = `${top}%`;
  decoration.style.setProperty("--mark-color", color);
  decoration.style.setProperty("--mark-size", `${size}px`);
  decoration.style.setProperty("--float-delay", `${delay}s`);
  festiveLayer.appendChild(decoration);
});

  const bearMarkup = '<span class="bear-ear bear-ear-left"></span><span class="bear-ear bear-ear-right"></span><span class="bear-body"></span><span class="bear-foot bear-foot-left"></span><span class="bear-foot bear-foot-right"></span><span class="bear-head"><span class="bear-eye bear-eye-left"></span><span class="bear-eye bear-eye-right"></span><span class="bear-muzzle"></span></span><span class="bear-arm"></span><span class="bear-heart">♡</span>';
  ["left", "right"].forEach((side) => {
    const bear = document.createElement("span");
    bear.className = `corner-bear corner-bear-${side}`;
    bear.innerHTML = bearMarkup;
    bear.setAttribute("aria-hidden", "true");
    document.body.appendChild(bear);
  });

  function releasePetal() {
    if (document.hidden || reducedMotion) return;
    const petal = document.createElement("span");
    petal.className = "falling-petal";
    petal.textContent = ["❀", "✿", "♥", "❧"][Math.floor(Math.random() * 4)];
    petal.style.left = `${Math.random() * 96}vw`;
    petal.style.setProperty("--petal-color", ["#c7a9d6", "#d7b4d0", "#e2bfd8", "#b9a4d3"][Math.floor(Math.random() * 4)]);
    petal.style.setProperty("--petal-duration", `${7 + Math.random() * 6}s`);
    petal.style.fontSize = `${12 + Math.random() * 16}px`;
    document.body.appendChild(petal);
    window.setTimeout(() => petal.remove(), 14000);
  }

  window.setInterval(releasePetal, 1050);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) releasePetal();
  });

  function releaseHeart() {
    if (document.hidden || reducedMotion) return;
    const heart = document.createElement("span");
    heart.className = "floating-heart-particle";
    heart.textContent = Math.random() > 0.55 ? "♡" : "♥";
    heart.style.left = `${5 + Math.random() * 90}vw`;
    heart.style.setProperty("--heart-color", ["#d89fbd", "#c0a2d4", "#e6b3c9", "#bd9acb"][Math.floor(Math.random() * 4)]);
    heart.style.setProperty("--heart-duration", `${7 + Math.random() * 4}s`);
    heart.style.fontSize = `${12 + Math.random() * 14}px`;
    heart.setAttribute("aria-hidden", "true");
    document.body.appendChild(heart);
    window.setTimeout(() => heart.remove(), 11500);
  }

  window.setInterval(releaseHeart, 3700);

  function releaseFallingHeart() {
    if (document.hidden || reducedMotion) return;
    const heart = document.createElement("span");
    heart.className = "falling-heart-particle";
    heart.textContent = Math.random() > 0.35 ? "♥" : "♡";
    heart.style.left = `${Math.random() * 96}vw`;
    heart.style.setProperty("--heart-color", ["#d89fbd", "#c0a2d4", "#e6b3c9", "#bd9acb"][Math.floor(Math.random() * 4)]);
    heart.style.setProperty("--heart-duration", `${8 + Math.random() * 6}s`);
    heart.style.setProperty("--heart-drift", `${(Math.random() - 0.5) * 150}px`);
    heart.style.fontSize = `${12 + Math.random() * 18}px`;
    heart.setAttribute("aria-hidden", "true");
    document.body.appendChild(heart);
    window.setTimeout(() => heart.remove(), 15000);
  }

  for (let i = 0; i < 7; i++) {
    window.setTimeout(releaseFallingHeart, i * 280);
  }
  window.setInterval(releaseFallingHeart, 900);

  [
    ["token-one", "✦"],
  ["token-two", "♡"]
].forEach(([position, symbol]) => {
  const token = document.createElement("span");
  token.className = `token-chip ambient-token ${position}`;
  token.textContent = symbol;
  token.setAttribute("aria-hidden", "true");
  document.body.appendChild(token);
});

function sparkleAt(x, y) {
  const symbols = ["✦", "✧", "✿", "❀", "♡"];
  for (let i = 0; i < 5; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle-pop";
    sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    sparkle.style.left = `${x + (Math.random() - 0.5) * 55}px`;
    sparkle.style.top = `${y + (Math.random() - 0.5) * 35}px`;
    sparkle.style.fontSize = `${12 + Math.random() * 14}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 900);
  }
}

document.addEventListener("click", (event) => {
  if (event.target.closest("a, button")) return;
  sparkleAt(event.clientX, event.clientY);
});

if (!reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let lastGlitterAt = 0;
  document.addEventListener("pointermove", (event) => {
    const now = performance.now();
    if (now - lastGlitterAt < 115) return;
    lastGlitterAt = now;
    const glitter = document.createElement("span");
    glitter.className = "sparkle-pop";
    glitter.textContent = Math.random() > 0.5 ? "✧" : "✦";
    glitter.style.left = `${event.clientX}px`;
    glitter.style.top = `${event.clientY}px`;
    glitter.style.fontSize = `${10 + Math.random() * 8}px`;
    document.body.appendChild(glitter);
    window.setTimeout(() => glitter.remove(), 900);
  }, { passive: true });
}

function celebrateAt(x, y, count = 32) {
  const symbols = ["♡", "✦", "✧", "✿", "❀", "⌁", "🎀"];
  const colors = ["#aa8ac7", "#dfaccd", "#edc8d6", "#d4c9ef", "#f1d4ab"];
  if (reducedMotion) count = Math.min(count, 12);
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    particle.className = "celebration-particle";
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    particle.style.color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.fontSize = `${14 + Math.random() * 18}px`;
    particle.style.setProperty("--particle-x", `${x}px`);
    particle.style.setProperty("--particle-y", `${y}px`);
    particle.style.setProperty("--particle-dx", `${(Math.random() - 0.5) * 420}px`);
    particle.style.setProperty("--particle-dy", `${-70 - Math.random() * 360}px`);
    particle.style.setProperty("--particle-duration", `${1.8 + Math.random() * 1.4}s`);
    particle.style.setProperty("--particle-rotation", `${(Math.random() - 0.5) * 300}deg`);
    particle.setAttribute("aria-hidden", "true");
    document.body.appendChild(particle);
    window.setTimeout(() => particle.remove(), 3400);
  }
}

const giftStage = document.getElementById("giftStage");
const openGiftButton = document.getElementById("openGift");
if (giftStage && openGiftButton) {
  openGiftButton.addEventListener("click", () => {
    if (giftStage.classList.contains("is-open")) return;
    giftStage.classList.add("is-open");
    openGiftButton.disabled = true;
    openGiftButton.innerHTML = 'Surprise opened with love <span>♡</span>';
    const surpriseNote = document.getElementById("surpriseNote");
    if (surpriseNote) {
      surpriseNote.hidden = false;
      surpriseNote.style.opacity = "1";
      const revealAnimation = surpriseNote.animate([
        { transform: "translateY(35px) scale(.9)" },
        { transform: "translateY(-8px) scale(1)" }
      ], { duration: reducedMotion ? 1 : 850, delay: reducedMotion ? 0 : 150, easing: "cubic-bezier(.2,.75,.25,1)", fill: "forwards" });
      revealAnimation.onfinish = () => {
        surpriseNote.style.opacity = "1";
        surpriseNote.style.transform = "translateY(-8px) scale(1)";
      };
    }
    const bounds = giftStage.getBoundingClientRect();
    celebrateAt(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, 38);
  });
}

const memorySlider = document.getElementById("memorySlider");
if (memorySlider) {
  const slides = [...memorySlider.querySelectorAll(".memory-card")];
  const dots = document.getElementById("carouselDots");
  const progress = document.getElementById("carouselProgress");
  const autoplayButton = document.getElementById("carouselAutoplay");
  const carousel = memorySlider.closest(".memory-carousel");
  let activeSlide = 0;
  let touchStartX = null;
  let autoplayTimer;
  let userPaused = false;
  let pointerInteraction = false;
  const pauseReasons = new Set();

  function updateAutoplay() {
    window.clearTimeout(autoplayTimer);
    progress?.parentElement.classList.remove("is-running");
    if (userPaused || pauseReasons.size > 0 || document.hidden) return;
    void progress?.offsetWidth;
    progress?.parentElement.classList.add("is-running");
    autoplayTimer = window.setTimeout(() => {
      showSlide(activeSlide + 1);
    }, 3000);
  }

  function showSlide(nextIndex) {
    activeSlide = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const isActive = index === activeSlide;
      slide.hidden = !isActive;
      slide.classList.toggle("is-active", isActive);
    });
    [...dots.children].forEach((dot, index) => {
      if (index === activeSlide) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    updateAutoplay();
  }

  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show memory ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index));
    dots.appendChild(dot);
  });
  document.querySelectorAll("[data-slide-direction]").forEach((button) => {
    button.addEventListener("click", () => showSlide(activeSlide + Number(button.dataset.slideDirection)));
  });
  if (autoplayButton) {
    autoplayButton.addEventListener("click", () => {
      userPaused = !userPaused;
      autoplayButton.setAttribute("aria-pressed", String(userPaused));
      autoplayButton.textContent = userPaused ? "Resume slideshow" : "Pause slideshow";
      updateAutoplay();
    });
  }
  carousel.addEventListener("mouseenter", () => {
    pauseReasons.add("pointer");
    updateAutoplay();
  });
  carousel.addEventListener("mouseleave", () => {
    pauseReasons.delete("pointer");
    updateAutoplay();
  });
  carousel.addEventListener("focusin", () => {
    if (pointerInteraction) return;
    pauseReasons.add("focus");
    updateAutoplay();
  });
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      pauseReasons.delete("focus");
      updateAutoplay();
    }
  });
  document.addEventListener("visibilitychange", updateAutoplay);
  carousel.addEventListener("pointerdown", () => {
    pointerInteraction = true;
    window.setTimeout(() => { pointerInteraction = false; }, 0);
  });
  memorySlider.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") return;
    touchStartX = event.clientX;
  });
  memorySlider.addEventListener("pointerup", (event) => {
    if (touchStartX === null) return;
    const distance = event.clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(distance) > 45) showSlide(activeSlide + (distance < 0 ? 1 : -1));
  });
  memorySlider.addEventListener("pointercancel", () => { touchStartX = null; });
  memorySlider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") showSlide(activeSlide + 1);
    if (event.key === "ArrowLeft") showSlide(activeSlide - 1);
  });
  showSlide(0);
}

const heartTreeCanopy = document.getElementById("heartTreeCanopy");
if (heartTreeCanopy) {
  const treePhoto = heartTreeCanopy.querySelector(".tree-center-photo");
  if (treePhoto && photos.cover) treePhoto.src = photos.cover;
}

const puzzleBoard = document.getElementById("puzzleBoard");
if (puzzleBoard) {
  const puzzleStatus = document.getElementById("puzzleStatus");
  const shuffleButton = document.getElementById("shufflePuzzle");
  const puzzleDialog = document.getElementById("puzzleSurprise");
  const closePuzzleNote = document.getElementById("closePuzzleNote");
  const puzzleSize = 3;
  const pieceCount = puzzleSize * puzzleSize;
  let puzzleImageUrl = "";
  let boardOrder = [];
  let selectedPiece = -1;
  let puzzleSolved = false;
  let imageLoadToken = 0;

  function shufflePuzzle() {
    boardOrder = Array.from({ length: pieceCount }, (_, index) => index);
    for (let i = boardOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [boardOrder[i], boardOrder[j]] = [boardOrder[j], boardOrder[i]];
    }
    if (boardOrder.every((piece, index) => piece === index)) {
      [boardOrder[0], boardOrder[1]] = [boardOrder[1], boardOrder[0]];
    }
    selectedPiece = -1;
    puzzleSolved = false;
    puzzleBoard.classList.remove("is-solved");
    renderPuzzle();
    puzzleStatus.textContent = "Tap one piece, then another, to swap them into place.";
    shuffleButton.hidden = false;
  }

  function renderPuzzle() {
    puzzleBoard.replaceChildren();
    boardOrder.forEach((sourcePiece, position) => {
      const tile = document.createElement("button");
      const sourceRow = Math.floor(sourcePiece / puzzleSize);
      const sourceColumn = sourcePiece % puzzleSize;
      tile.className = "puzzle-tile";
      tile.type = "button";
      tile.style.backgroundImage = `url("${puzzleImageUrl}")`;
      tile.style.backgroundSize = `${puzzleSize * 100}% ${puzzleSize * 100}%`;
      tile.style.backgroundPosition = `${sourceColumn * 50}% ${sourceRow * 50}%`;
      tile.style.setProperty("--tile-order", String(position));
      tile.setAttribute("aria-label", `Picture piece ${sourcePiece + 1}, currently in position ${position + 1}`);
      tile.setAttribute("aria-pressed", String(position === selectedPiece));
      tile.disabled = puzzleSolved;
      tile.addEventListener("click", () => {
        if (puzzleSolved) return;
        if (selectedPiece === -1) {
          selectedPiece = position;
          renderPuzzle();
          return;
        }
        if (selectedPiece === position) {
          selectedPiece = -1;
          renderPuzzle();
          return;
        }
        [boardOrder[selectedPiece], boardOrder[position]] = [boardOrder[position], boardOrder[selectedPiece]];
        selectedPiece = -1;
        renderPuzzle();
        if (boardOrder.every((piece, index) => piece === index)) {
          puzzleSolved = true;
          puzzleBoard.classList.add("is-solved");
          [...puzzleBoard.children].forEach((piece) => { piece.disabled = true; });
          puzzleStatus.textContent = "You did it! Every lovely piece is back where it belongs. ♡";
          const bounds = puzzleBoard.getBoundingClientRect();
          celebrateAt(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, 64);
          [0.25, 0.5, 0.75].forEach((part, index) => {
            window.setTimeout(() => celebrateAt(window.innerWidth * part, bounds.top + bounds.height / 2, 20), reducedMotion ? 0 : 180 * (index + 1));
          });
          window.setTimeout(() => {
            if (!puzzleDialog.open) puzzleDialog.showModal();
            closePuzzleNote.focus();
          }, reducedMotion ? 0 : 900);
        }
      });
      puzzleBoard.appendChild(tile);
    });
  }

  function loadPuzzleImage(source, announce = true) {
    const loadToken = ++imageLoadToken;
    const image = new Image();
    puzzleStatus.textContent = "Getting your picture ready…";
    image.onload = () => {
      if (loadToken !== imageLoadToken) return;
      try {
        const side = Math.min(image.naturalWidth, image.naturalHeight);
        const cropX = (image.naturalWidth - side) / 2;
        const cropY = (image.naturalHeight - side) / 2;
        const canvas = document.createElement("canvas");
        canvas.width = 900;
        canvas.height = 900;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas image processing is unavailable.");
        context.drawImage(image, cropX, cropY, side, side, 0, 0, canvas.width, canvas.height);
        puzzleImageUrl = canvas.toDataURL("image/jpeg", 0.9);
      } catch (error) {
        puzzleBoard.hidden = true;
        puzzleStatus.textContent = "The puzzle photo couldn’t be prepared.";
        console.error("Unable to prepare the birthday puzzle image.", error);
        return;
      }
      puzzleBoard.hidden = false;
      puzzleBoard.setAttribute("aria-label", `Photo puzzle using ${image.naturalWidth} by ${image.naturalHeight} image, 3 by 3 pieces`);
      shufflePuzzle();
      if (announce) puzzleStatus.textContent = "Your picture is ready. Tap two pieces to swap them.";
    };
    image.onerror = () => {
      if (loadToken === imageLoadToken) {
        puzzleBoard.hidden = true;
        puzzleStatus.textContent = "The puzzle photo couldn’t be loaded.";
      }
    };
    image.src = source;
  }

  shuffleButton.addEventListener("click", shufflePuzzle);
  closePuzzleNote.addEventListener("click", () => puzzleDialog.close());
  puzzleDialog.addEventListener("click", (event) => {
    if (event.target === puzzleDialog) puzzleDialog.close();
  });
  const configuredPhoto = photos.cover || photos["memory-1"] || Object.values(photos).find(Boolean);
  if (configuredPhoto) {
    loadPuzzleImage(configuredPhoto, false);
  } else {
    puzzleStatus.textContent = "No puzzle photo is configured.";
  }
}

// Build 23 candles for Pragya's 23rd birthday.
const candleHolder = document.getElementById("candles");
if (candleHolder) {
  for (let i = 0; i < 23; i++) {
    const candle = document.createElement("span");
    candle.className = "candle";
    candle.innerHTML = '<i class="flame"></i><i class="smoke"></i>';
    candleHolder.appendChild(candle);
  }
}

const blowButton = document.getElementById("blowCandles");
if (blowButton) {
  const candles = [...document.querySelectorAll(".candle")];
  const wishReveal = document.getElementById("wishReveal");
  const wishResult = document.getElementById("wishResult");
  let wishMade = false;

  function revealWish() {
    wishMade = true;
    document.querySelector(".cake-page").classList.add("wish-made");
    candles.forEach((candle) => candle.classList.add("blown"));
    blowButton.disabled = true;
    blowButton.textContent = "Wish made ♡";
    wishResult.textContent = "Your wish is on its way, birthday girl. ✨";
    if (wishReveal) wishReveal.hidden = false;
  }

  try {
    if (window.localStorage.getItem("pragyaBirthdayWishMade") === "true") {
      revealWish();
    }
  } catch (error) {
    console.warn("The birthday wish will be remembered only until this page is closed.", error);
  }

  blowButton.addEventListener("click", () => {
    if (wishMade) return;
    wishMade = true;
    blowButton.disabled = true;
    document.querySelector(".cake-page").classList.add("wish-made");
    wishResult.textContent = "A little birthday magic is on its way… ♡";
    try {
      window.localStorage.setItem("pragyaBirthdayWishMade", "true");
    } catch (error) {
      console.warn("The birthday wish could not be saved for a future visit.", error);
    }
    candles.forEach((candle, index) => {
      window.setTimeout(() => candle.classList.add("blown"), reducedMotion ? 0 : index * 28);
    });
    celebrateAt(window.innerWidth / 2, window.innerHeight * 0.4, 52);
    window.setTimeout(() => {
      revealWish();
      celebrateAt(window.innerWidth / 2, window.innerHeight * 0.55, 28);
      sparkleAt(window.innerWidth / 2, window.innerHeight * 0.45);
      [0.22, 0.5, 0.78].forEach((position, index) => {
        window.setTimeout(() => {
          celebrateAt(window.innerWidth * position, window.innerHeight * (0.2 + Math.random() * 0.18), 22);
        }, reducedMotion ? 0 : index * 260);
      });
    }, reducedMotion ? 0 : candles.length * 28 + 550);
  });
}
