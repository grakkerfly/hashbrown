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
vibeAudio.volume = 0.1;
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

let currentIndex = Math.floor(Math.random() * vibes.length);
let isPlaying = false;
let gifFrames = [];
let gifWidth = 0;
let gifHeight = 0;
let frameIndex = 0;
let frameTimer = null;
let gifReady = false;
let danceSpeed = vibes[currentIndex].danceSpeed;
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


const pfpConfig = {
  bg: { count: 20, optional: false },
  body: { count: 9, optional: false },
  eye: { count: 8, optional: true },
  hand: { count: 8, optional: true },
  hat: { count: 14, optional: false },
  overlay: { count: 13, optional: false }
};

const pfpLayerOrder = ["bg", "body", "eye", "hat", "hand", "overlay"];
const pfpSelection = {
  bg: 1,
  body: 1,
  eye: 0,
  hand: 0,
  hat: 1,
  overlay: 1
};

const pfpCanvas = document.getElementById("pfpCanvas");
const pfpContext = pfpCanvas.getContext("2d");
const pfpShareImage = document.getElementById("pfpShareImage");
const pfpImageCache = new Map();
let pfpRenderVersion = 0;

function getPfpAssetPath(trait, index) {
  return `pfp editor/${trait}/${trait}${index}.png`;
}

function loadPfpImage(path) {
  if (pfpImageCache.has(path)) return pfpImageCache.get(path);

  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${path}`));
    image.src = path;
  });

  pfpImageCache.set(path, promise);
  return promise;
}

function updateTraitLabel(trait) {
  const value = pfpSelection[trait];
  const config = pfpConfig[trait];
  const label = document.getElementById(`${trait}Value`);

  if (config.optional && value === 0) {
    label.textContent = "none";
    return;
  }

  label.textContent = `${String(value).padStart(2, "0")} / ${String(config.count).padStart(2, "0")}`;
}

async function renderPfp() {
  const renderVersion = ++pfpRenderVersion;
  const activeLayers = pfpLayerOrder.filter((trait) => pfpSelection[trait] > 0);

  try {
    const images = await Promise.all(
      activeLayers.map((trait) => loadPfpImage(getPfpAssetPath(trait, pfpSelection[trait])))
    );

    if (renderVersion !== pfpRenderVersion) return;

    pfpContext.clearRect(0, 0, pfpCanvas.width, pfpCanvas.height);
    pfpContext.imageSmoothingEnabled = true;

    images.forEach((image) => {
      pfpContext.drawImage(image, 0, 0, pfpCanvas.width, pfpCanvas.height);
    });

    pfpShareImage.classList.remove("is-ready");
    pfpShareImage.onload = () => pfpShareImage.classList.add("is-ready");
    pfpShareImage.src = pfpCanvas.toDataURL("image/png");
  } catch (error) {
    console.error(error);
  }
}

function changeTrait(trait, direction) {
  const config = pfpConfig[trait];
  const minimum = config.optional ? 0 : 1;
  const totalOptions = config.count - minimum + 1;
  const normalized = pfpSelection[trait] - minimum;

  pfpSelection[trait] = ((normalized + direction + totalOptions) % totalOptions) + minimum;
  updateTraitLabel(trait);
  renderPfp();
}

function randomTrait(count) {
  return Math.floor(Math.random() * count) + 1;
}

function randomizePfp() {
  pfpSelection.bg = randomTrait(pfpConfig.bg.count);
  pfpSelection.body = randomTrait(pfpConfig.body.count);
  pfpSelection.eye = randomTrait(pfpConfig.eye.count);
  pfpSelection.hat = randomTrait(pfpConfig.hat.count);
  pfpSelection.hand = randomTrait(pfpConfig.hand.count);
  pfpSelection.overlay = randomTrait(pfpConfig.overlay.count);

  pfpLayerOrder.forEach(updateTraitLabel);
  renderPfp();
}

async function downloadPfp() {
  const filename = `hashbrown-pfp-${Date.now()}.png`;

  const blob = await new Promise((resolve) => pfpCanvas.toBlob(resolve, "image/png"));

  if (!blob) {
    window.open(pfpCanvas.toDataURL("image/png"), "_blank");
    return;
  }

  const file = new File([blob], filename, { type: "image/png" });

  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = objectUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

for (const control of document.querySelectorAll(".trait-control")) {
  const trait = control.dataset.trait;

  for (const button of control.querySelectorAll(".trait-arrow")) {
    button.addEventListener("click", () => {
      changeTrait(trait, Number(button.dataset.direction));
    });
  }
}

document.getElementById("randomizePfp").addEventListener("click", randomizePfp);
document.getElementById("downloadPfp").addEventListener("click", downloadPfp);

randomizePfp();






const memeMedia = {
  photos: Array.from({ length: 11 }, (_, index) => ({
    type: "image",
    src: `assets/memes/meme${index + 1}.png`
  })),
  videos: Array.from({ length: 13 }, (_, index) => ({
    type: "video",
    src: `assets/memes/vid${index + 1}.mp4`
  }))
};

const memeGrid = document.getElementById("memeGrid");
const memeTabs = [...document.querySelectorAll(".meme-tab")];
const memeModal = document.getElementById("memeModal");
const memeModalContent = document.getElementById("memeModalContent");
const memeModalFrame = document.getElementById("memeModalFrame");
const memeModalClose = document.getElementById("memeModalClose");
const memeModalPrevious = document.getElementById("memeModalPrevious");
const memeModalNext = document.getElementById("memeModalNext");
let activeMemeType = "photos";
let activeMemeIndex = 0;
let resumeVibeAfterMemeVideo = false;

function renderMemeGallery() {
  memeGrid.innerHTML = "";

  memeMedia[activeMemeType].forEach((media, index) => {
    const button = document.createElement("button");
    button.className = "meme-item";
    button.type = "button";
    button.setAttribute("aria-label", `Open ${activeMemeType === "photos" ? "photo" : "video"} ${index + 1}`);

    const element = document.createElement(media.type === "image" ? "img" : "video");
    element.src = media.src;
    if (media.type === "video") {
      element.muted = true;
      element.loop = true;
      element.playsInline = true;
      element.preload = "metadata";
    }

    button.appendChild(element);
    button.addEventListener("click", () => openMemeModal(index));
    memeGrid.appendChild(button);
  });
}

function renderMemeModal() {
  const media = memeMedia[activeMemeType][activeMemeIndex];
  memeModalFrame.innerHTML = "";

  const element = document.createElement(media.type === "image" ? "img" : "video");
  element.src = media.src;

  if (media.type === "video") {
    element.controls = true;
    element.autoplay = true;
    element.playsInline = true;
  }

  memeModalFrame.appendChild(element);
}

function openMemeModal(index) {
  activeMemeIndex = index;

  if (activeMemeType === "videos") {
    resumeVibeAfterMemeVideo = isPlaying;
    if (isPlaying) setPlayback(false);
  }

  renderMemeModal();
  memeModal.classList.add("is-open");
  memeModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("meme-modal-open");
}

function closeMemeModal() {
  memeModal.classList.remove("is-open");
  memeModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("meme-modal-open");
  memeModalFrame.innerHTML = "";

  if (resumeVibeAfterMemeVideo) {
    resumeVibeAfterMemeVideo = false;
    setPlayback(true);
  }
}

function changeMeme(direction) {
  const media = memeMedia[activeMemeType];
  activeMemeIndex = (activeMemeIndex + direction + media.length) % media.length;
  renderMemeModal();
}

memeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeMemeType = tab.dataset.galleryType;
    memeTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });
    renderMemeGallery();
  });
});

memeModalClose.addEventListener("click", closeMemeModal);
memeModalPrevious.addEventListener("click", () => changeMeme(-1));
memeModalNext.addEventListener("click", () => changeMeme(1));
memeModal.addEventListener("click", (event) => {
  const clickedMedia = event.target.closest(".meme-modal-content img, .meme-modal-content video");
  const clickedControl = event.target.closest(".meme-modal-close, .meme-modal-arrow");
  if (!clickedMedia && !clickedControl) closeMemeModal();
});

window.addEventListener("keydown", (event) => {
  if (!memeModal.classList.contains("is-open")) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    event.stopImmediatePropagation();
    changeMeme(-1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    event.stopImmediatePropagation();
    changeMeme(1);
  }
  if (event.key === "Escape") closeMemeModal();
}, true);

renderMemeGallery();
