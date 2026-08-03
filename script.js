const CONTRACT_ADDRESS = "Ggec8Zysy299FA3kuFPrNwCEcUANrsbaBUvmvGscpump";

const vibes = [
  {
    id: "chilling",
    name: "chilling",
    track: "bob marley — is this love",
    audio: "assets/chilling.mp3",
    background: "assets/chilling.png",
    backgroundType: "image",
    danceSpeed: 0.5,
    wiggleSpeed: 0.5,
    effect: "smoke"
  },
  {
    id: "eletro",
    name: "eletro",
    track: "magic box — if you...",
    audio: "assets/eletro.mp3",
    background: "assets/eletro.mp4",
    backgroundType: "video",
    danceSpeed: 1.5,
    wiggleSpeed: 1.5,
    effect: "lights"
  },
  {
    id: "romantic",
    name: "romantic",
    track: "timbaland — apologize",
    audio: "assets/romantic.mp3",
    background: "assets/romantic.png",
    backgroundType: "image",
    danceSpeed: 0.5,
    wiggleSpeed: 0.5,
    effect: "hearts"
  },
  {
    id: "trap",
    name: "trap",
    track: "travis scott — stargazing",
    audio: "assets/trap.mp3",
    background: "assets/trap.png",
    backgroundType: "image",
    danceSpeed: 1,
    wiggleSpeed: 1,
    effect: "negative"
  },
  {
    id: "backrooms",
    name: "backrooms",
    track: "home — resonance",
    audio: "assets/backrooms.mp3",
    background: "assets/backrooms.png",
    backgroundType: "image",
    danceSpeed: 0.85,
    wiggleSpeed: 0.8,
    effect: "none"
  },
  {
    id: "casino",
    name: "casino",
    track: "michael bublé — feeling good",
    audio: "assets/casino.mp3",
    background: "assets/casino.png",
    backgroundType: "image",
    danceSpeed: 0.9,
    wiggleSpeed: 0.9,
    effect: "none"
  },
  {
    id: "fridaynight",
    name: "friday night",
    track: "atlxs — passo bem solto",
    audio: "assets/fridaynight.mp3",
    background: "assets/fridaynight.png",
    backgroundType: "image",
    danceSpeed: 1.25,
    wiggleSpeed: 1.25,
    effect: "none"
  },
  {
    id: "gtasa",
    name: "gta san andreas",
    track: "young maylay — san andreas theme",
    audio: "assets/gtasa.mp3",
    background: "assets/gtasa.png",
    backgroundType: "image",
    danceSpeed: 1,
    wiggleSpeed: 1,
    effect: "none"
  },
  {
    id: "moon",
    name: "moon",
    track: "xxxtentacion — moonlight",
    audio: "assets/moon.mp3",
    background: "assets/moon.png",
    backgroundType: "image",
    danceSpeed: 1.05,
    wiggleSpeed: 1,
    effect: "none"
  },
  {
    id: "nyse",
    name: "new york stock exchange",
    track: "pink floyd — money",
    audio: "assets/nyse.mp3",
    background: "assets/nyse.png",
    backgroundType: "image",
    danceSpeed: 0.95,
    wiggleSpeed: 0.9,
    effect: "none"
  },
  {
    id: "pumpfun",
    name: "pump.fun",
    track: "kitschkrieg feat. blumengarten & shirin david — gut genug",
    audio: "assets/pumpfun.mp3",
    background: "assets/pumpfun.png",
    backgroundType: "image",
    danceSpeed: 1.1,
    wiggleSpeed: 1.1,
    effect: "none"
  }
];

const body = document.body;
const sceneImage = document.getElementById("sceneImage");
const sceneVideo = document.getElementById("sceneVideo");
const vibeAudio = document.getElementById("vibeAudio");
vibeAudio.volume = 0.2;
const vibeName = document.getElementById("vibeName");
const vibeCount = document.getElementById("vibeCount");
const trackName = document.getElementById("trackName");
const playButton = document.getElementById("playButton");
const playIcon = document.getElementById("playIcon");
const playText = document.getElementById("playText");
const previousVibe = document.getElementById("previousVibe");
const nextVibe = document.getElementById("nextVibe");
const effects = document.getElementById("effects");
const canvas = document.getElementById("hedgehogCanvas");
const fallback = document.getElementById("hedgehogFallback");
const context = canvas.getContext("2d");

let currentIndex = 0;
let isPlaying = false;
let gifFrames = [];
let gifWidth = 0;
let gifHeight = 0;
let frameIndex = 0;
let frameTimer = null;
let gifReady = false;
let danceSpeed = vibes[0].danceSpeed;
let frameCanvas = document.createElement("canvas");
let frameContext = frameCanvas.getContext("2d");

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(window.innerWidth * ratio);
  canvas.height = Math.round(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  drawCurrentFrame();
}

function drawCurrentFrame() {
  if (!gifReady || !gifFrames.length) return;

  const frame = gifFrames[frameIndex];
  const ratio = window.devicePixelRatio || 1;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const sourceRatio = gifWidth / gifHeight;
  const targetRatio = canvasWidth / canvasHeight;
  let drawWidth;
  let drawHeight;

  if (sourceRatio > targetRatio) {
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / sourceRatio;
  } else {
    drawHeight = canvasHeight;
    drawWidth = canvasHeight * sourceRatio;
  }

  const x = (canvasWidth - drawWidth) / 2;
  const y = (canvasHeight - drawHeight) / 2;

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.imageSmoothingEnabled = false;
  context.drawImage(frameCanvas, 0, 0, gifWidth, gifHeight, x, y, drawWidth, drawHeight);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function renderGifFrame() {
  if (!gifReady || !gifFrames.length) return;

  const frame = gifFrames[frameIndex];
  const dimensions = frame.dims;

  if (frame.disposalType === 2) {
    frameContext.clearRect(dimensions.left, dimensions.top, dimensions.width, dimensions.height);
  }

  const imageData = new ImageData(frame.patch, dimensions.width, dimensions.height);
  frameContext.putImageData(imageData, dimensions.left, dimensions.top);
  drawCurrentFrame();

  const minimumDelay = 16;
  const originalDelay = Math.max(frame.delay || 100, minimumDelay);
  const adjustedDelay = Math.max(originalDelay / danceSpeed, minimumDelay);

  frameIndex = (frameIndex + 1) % gifFrames.length;
  frameTimer = window.setTimeout(renderGifFrame, adjustedDelay);
}

async function loadHedgehogGif() {
  try {
    const response = await fetch("assets/hashbrown.gif");
    const buffer = await response.arrayBuffer();
    const parsedGif = gifuctjs.parseGIF(buffer);
    gifFrames = gifuctjs.decompressFrames(parsedGif, true);
    gifWidth = parsedGif.lsd.width;
    gifHeight = parsedGif.lsd.height;
    frameCanvas.width = gifWidth;
    frameCanvas.height = gifHeight;
    gifReady = true;
    fallback.style.display = "none";
    resizeCanvas();
    renderGifFrame();
  } catch (error) {
    canvas.style.display = "none";
    fallback.style.display = "block";
  }
}

function createHearts() {
  effects.innerHTML = "";

  for (let index = 0; index < 26; index += 1) {
    const heart = document.createElement("span");
    heart.className = "particle heart";
    heart.textContent = index % 2 === 0 ? "♥" : "♡";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.setProperty("--heart-size", `${14 + Math.random() * 26}px`);
    heart.style.setProperty("--fall-duration", `${12 + Math.random() * 9}s`);
    heart.style.setProperty("--fall-delay", `${-Math.random() * 18}s`);
    heart.style.setProperty("--heart-drift", `${-90 + Math.random() * 180}px`);
    effects.appendChild(heart);
  }
}

function createSmoke() {
  effects.innerHTML = "";

  for (let index = 0; index < 18; index += 1) {
    const smoke = document.createElement("span");
    smoke.className = "particle smoke";
    smoke.style.left = `${Math.random() * 100}%`;
    smoke.style.setProperty("--smoke-size", `${90 + Math.random() * 170}px`);
    smoke.style.setProperty("--smoke-duration", `${18 + Math.random() * 14}s`);
    smoke.style.setProperty("--smoke-delay", `${-Math.random() * 24}s`);
    smoke.style.setProperty("--smoke-drift", `${-120 + Math.random() * 240}px`);
    effects.appendChild(smoke);
  }
}

function updateEffects(effect) {
  effects.innerHTML = "";
  if (effect === "hearts") createHearts();
  if (effect === "smoke") createSmoke();
}

function updatePlayButton() {
  playIcon.textContent = isPlaying ? "Ⅱ" : "▶";
  playText.textContent = isPlaying ? "pause" : "play";
}

async function setPlayback(shouldPlay) {
  isPlaying = shouldPlay;

  if (isPlaying) {
    try {
      await vibeAudio.play();
      if (sceneVideo.classList.contains("is-active")) {
        await sceneVideo.play();
      }
    } catch (error) {
      isPlaying = false;
    }
  } else {
    vibeAudio.pause();
    sceneVideo.pause();
  }

  updatePlayButton();
}

function updateVibe(index) {
  const vibe = vibes[index];
  const keepPlaying = isPlaying;

  body.className = `theme-${vibe.id}`;
  vibeName.textContent = vibe.name;
  vibeCount.textContent = `${String(index + 1).padStart(2, "0")} / ${String(vibes.length).padStart(2, "0")}`;
  trackName.textContent = vibe.track;
  danceSpeed = vibe.danceSpeed;

  document.documentElement.style.setProperty("--wiggle-duration", `${5 / vibe.wiggleSpeed}s`);
  document.documentElement.style.setProperty("--background-wiggle-duration", `${7 / vibe.wiggleSpeed}s`);

  vibeAudio.pause();
  vibeAudio.src = vibe.audio;
  vibeAudio.load();

  sceneImage.classList.remove("is-active");
  sceneVideo.classList.remove("is-active");
  sceneVideo.pause();

  if (vibe.backgroundType === "video") {
    sceneVideo.src = vibe.background;
    sceneVideo.playbackRate = vibe.wiggleSpeed;
    sceneVideo.classList.add("is-active");
    sceneVideo.load();
  } else {
    sceneImage.src = vibe.background;
    sceneImage.classList.add("is-active");
  }

  updateEffects(vibe.effect);

  if (keepPlaying) {
    vibeAudio.addEventListener("canplay", () => setPlayback(true), { once: true });
  } else {
    isPlaying = false;
    updatePlayButton();
  }
}

function changeVibe(direction) {
  currentIndex = (currentIndex + direction + vibes.length) % vibes.length;
  updateVibe(currentIndex);
}

async function copyContract(button) {
  try {
    await navigator.clipboard.writeText(CONTRACT_ADDRESS);
    button.textContent = "copied";
  } catch (error) {
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = CONTRACT_ADDRESS;
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    document.execCommand("copy");
    temporaryInput.remove();
    button.textContent = "copied";
  }

  window.setTimeout(() => {
    button.textContent = "copy ca";
  }, 1500);
}

let audioStarted = false;

async function startAudioFromInteraction() {
  if (audioStarted) return;
  audioStarted = true;
  await setPlayback(true);
  if (!isPlaying) audioStarted = false;
}

for (const eventName of ["pointerdown", "mousemove", "touchstart", "keydown"]) {
  window.addEventListener(eventName, startAudioFromInteraction, { once: true, passive: true });
}

setPlayback(true);

previousVibe.addEventListener("click", () => changeVibe(-1));
nextVibe.addEventListener("click", () => changeVibe(1));
playButton.addEventListener("click", () => setPlayback(!isPlaying));

for (const button of document.querySelectorAll(".copy-button")) {
  button.addEventListener("click", () => copyContract(button));
}

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") changeVibe(-1);
  if (event.key === "ArrowRight") changeVibe(1);
  if (event.code === "Space" && !event.target.matches("button, a, input, textarea")) {
    event.preventDefault();
    setPlayback(!isPlaying);
  }
});

window.addEventListener("resize", resizeCanvas);

vibeAudio.addEventListener("ended", () => {
  isPlaying = false;
  updatePlayButton();
});

updateVibe(currentIndex);
loadHedgehogGif();
