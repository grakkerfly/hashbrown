import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const CONTRACT_ADDRESS="Ggec8Zysy299FA3kuFPrNwCEcUANrsbaBUvmvGscpump";
const vibes=[
 ["chilling","bob marley — is this love","assets/chilling.mp3",.5,"assets/eletro.mp4","video"],
 ["eletro","magic box — if you...","assets/eletro.mp3",1.5,"assets/eletro.mp4","video"],
 ["romantic","timbaland — apologize","assets/romantic.mp3",.5,"assets/eletro.mp4","video"],
 ["trap","travis scott — stargazing","assets/trap.mp3",1,"assets/eletro.mp4","video"],
 ["backrooms","home — resonance","assets/backrooms.mp3",.85,"assets/eletro.mp4","video"],
 ["casino","michael bublé — feeling good","assets/casino.mp3",.9,"assets/eletro.mp4","video"],
 ["friday night","atlxs — passo bem solto","assets/fridaynight.mp3",1.25,"assets/eletro.mp4","video"],
 ["gta san andreas","young maylay — san andreas theme","assets/gtasa.mp3",1,"assets/eletro.mp4","video"],
 ["moon","xxxtentacion — moonlight","assets/moon.mp3",1.05,"assets/eletro.mp4","video"],
 ["new york stock exchange","pink floyd — money","assets/nyse.mp3",.95,"assets/eletro.mp4","video"],
 ["pump.fun","kitschkrieg feat. blumengarten & shirin david — gut genug","assets/pumpfun.mp3",1.1,"assets/eletro.mp4","video"]
].map(([name,track,audio,speed,background,backgroundType])=>({name,track,audio,speed,background,backgroundType}));

const canvas=document.getElementById("dancefloorCanvas");
const isMobile=matchMedia("(max-width: 820px)").matches;
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:"high-performance"});
renderer.setPixelRatio(isMobile ? 0.60 : Math.min(devicePixelRatio,1.5)); renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.15;
const scene=new THREE.Scene(); scene.background=null;
let camera=new THREE.PerspectiveCamera(38,1,.01,5000);
let controls=new OrbitControls(camera,canvas); controls.enableDamping=true; controls.dampingFactor=.055; controls.enablePan=false; controls.minPolarAngle=.3; controls.maxPolarAngle=Math.PI/2.05;
scene.add(new THREE.HemisphereLight(0xa9cfff,0x24170d,2.4));
const key=new THREE.DirectionalLight(0xffffff,3.2); key.position.set(7,12,8); scene.add(key);
const pink=new THREE.PointLight(0xff2e9d,22,30); pink.position.set(-6,5,1); scene.add(pink);
const blue=new THREE.PointLight(0x3f78ff,22,30); blue.position.set(6,4,-1); scene.add(blue);
let mixer=null,modelRoot=null,modelSize=10,playing=false,currentIndex=Math.floor(Math.random()*vibes.length);
const hashTarget=new THREE.Vector3(),sceneTarget=new THREE.Vector3();let baseDistance=10;
const clock=new THREE.Clock();
const anchors={music:new THREE.Vector3(-.55,.35,.12),pfp:new THREE.Vector3(.55,.28,.18),lore:new THREE.Vector3(-.52,.25,-.34),memes:new THREE.Vector3(.5,.3,-.32)};

const universeLoader=document.getElementById("universeLoader"),loaderBar=document.getElementById("loaderBar"),loaderPercent=document.getElementById("loaderPercent");
function loadingProgress(value){const percent=Math.max(0,Math.min(100,Math.round(value)));loaderBar.style.width=`${percent}%`;loaderPercent.textContent=`${percent}%`}
function frameModel(root){
  root.rotation.set(0,0,0);
  const box=new THREE.Box3().setFromObject(root),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
  modelSize=Math.max(size.x,size.y,size.z,1);
  root.position.sub(center);
  root.position.y-=size.y*.04;
  root.updateMatrixWorld(true);const centeredBox=new THREE.Box3().setFromObject(root);
  sceneTarget.copy(centeredBox.getCenter(new THREE.Vector3()));

 
hashTarget.set(
  0,
  sceneTarget.y-modelSize*.085,
  centeredBox.max.z - size.z * .1
);

 
  controls.target.copy(hashTarget);baseDistance=modelSize*.82;
  camera.position.set(0,hashTarget.y+modelSize*.18,hashTarget.z+baseDistance);
  camera.lookAt(hashTarget);controls.enableZoom=true;controls.zoomSpeed=.65;controls.minDistance=modelSize*.28;controls.maxDistance=modelSize*1.75;controls.update();
  Object.keys(anchors).forEach(k=>anchors[k].multiplyScalar(modelSize));
}
new GLTFLoader().load("assets/dancefloor.glb",gltf=>{modelRoot=gltf.scene;modelRoot.traverse(o=>{if(o.isMesh){o.frustumCulled=!matchMedia("(max-width: 820px)").matches;const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{if(m){m.side=THREE.DoubleSide;m.needsUpdate=true}})}});scene.add(modelRoot);frameModel(modelRoot);if(gltf.cameras.length){const blenderCamera=gltf.cameras[0];blenderCamera.getWorldPosition(camera.position);blenderCamera.getWorldQuaternion(camera.quaternion);if(blenderCamera.isPerspectiveCamera){camera.fov=blenderCamera.fov;camera.near=blenderCamera.near;camera.far=blenderCamera.far;camera.zoom=blenderCamera.zoom}camera.aspect=canvas.clientWidth/canvas.clientHeight;camera.updateProjectionMatrix();const cameraDirection=new THREE.Vector3();camera.getWorldDirection(cameraDirection);controls.dispose();controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.055;controls.enablePan=false;controls.enableZoom=true;controls.zoomSpeed=.65;controls.target.copy(camera.position).addScaledVector(cameraDirection,modelSize);controls.update();camera.zoom*=1.12;camera.updateProjectionMatrix();const initialHorizontal=controls.getAzimuthalAngle(),initialVertical=controls.getPolarAngle(),initialDistance=camera.position.distanceTo(controls.target);controls.minAzimuthAngle=initialHorizontal-THREE.MathUtils.degToRad(12);controls.maxAzimuthAngle=initialHorizontal+THREE.MathUtils.degToRad(12);controls.minPolarAngle=initialVertical-THREE.MathUtils.degToRad(8);controls.maxPolarAngle=initialVertical+THREE.MathUtils.degToRad(8);controls.minDistance=initialDistance*.85;controls.maxDistance=initialDistance*1.05;controls.update()}if(gltf.animations.length){mixer=new THREE.AnimationMixer(modelRoot);gltf.animations.forEach(clip=>mixer.clipAction(clip).play())}loadingProgress(100);document.getElementById("sceneLoading").classList.add("is-hidden");setTimeout(()=>universeLoader.classList.add("is-done"),420)},xhr=>{if(xhr.total)loadingProgress(xhr.loaded/xhr.total*100);else loadingProgress(Math.min(92,(xhr.loaded/1000000)*4))},e=>{console.error(e);document.getElementById("sceneLoading").textContent="dancefloor.glb could not be loaded";loaderPercent.textContent="could not load dancefloor.glb"});
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
function projectLabels(){const direction=camera.position.clone().sub(controls.target).normalize();const parallaxX=THREE.MathUtils.clamp(direction.x*42,-42,42),parallaxY=THREE.MathUtils.clamp((direction.y-.2)*22,-18,18);document.querySelectorAll("[data-anchor]").forEach(el=>{const factor=Number(el.dataset.parallax||1);el.style.setProperty("--px",`${parallaxX*factor}px`);el.style.setProperty("--py",`${parallaxY*factor}px`)})}
function animate(){requestAnimationFrame(animate);const d=Math.min(clock.getDelta(),.05);controls.update();if(mixer)mixer.update(d*vibes[currentIndex].speed);pink.intensity=18+Math.sin(performance.now()*.004)*8;blue.intensity=18+Math.cos(performance.now()*.003)*8;projectLabels();renderer.render(scene,camera)}
window.addEventListener("resize",resize);resize();animate();

const audio=document.getElementById("vibeAudio"),vibeName=document.getElementById("vibeName"),vibeCount=document.getElementById("vibeCount"),trackName=document.getElementById("trackName"),playIcon=document.getElementById("playIcon"),playText=document.getElementById("playText"); audio.volume=.1;
const vibeBackgroundImage=document.getElementById("vibeBackgroundImage"),vibeBackgroundVideo=document.getElementById("vibeBackgroundVideo");
function updateVibeBackground(v){
  vibeBackgroundImage.classList.remove("is-active");
  vibeBackgroundVideo.classList.remove("is-active");
  vibeBackgroundVideo.pause();
  if(isMobile){
    vibeBackgroundVideo.removeAttribute("src");
    vibeBackgroundVideo.load();
    return;
  }
  if(v.backgroundType==="video"){
    vibeBackgroundVideo.src=v.background;
    vibeBackgroundVideo.classList.add("is-active");
    vibeBackgroundVideo.load();
    vibeBackgroundVideo.play().catch(()=>{});
  }else{
    vibeBackgroundImage.src=v.background;
    vibeBackgroundImage.classList.add("is-active");
  }
}
function updatePlayer(){const v=vibes[currentIndex];vibeName.textContent=v.name;trackName.textContent=v.track;vibeCount.textContent=`${String(currentIndex+1).padStart(2,"0")} / 11`;playIcon.textContent=playing?"Ⅱ":"▶";playText.textContent=playing?"pause":"play";updateVibeBackground(v)}
async function setPlayback(value){playing=value;if(value){try{await audio.play()}catch(e){playing=false}}else audio.pause();updatePlayer()}
function changeTrack(dir){const keep=playing;currentIndex=(currentIndex+dir+vibes.length)%vibes.length;audio.pause();audio.src=vibes[currentIndex].audio;audio.load();updatePlayer();if(keep)audio.addEventListener("canplay",()=>setPlayback(true),{once:true})}
document.getElementById("previousVibe").onclick=()=>changeTrack(-1);document.getElementById("nextVibe").onclick=()=>changeTrack(1);document.getElementById("playButton").onclick=()=>setPlayback(!playing);audio.src=vibes[currentIndex].audio;updatePlayer();
let audioStarted=false;async function startAudioOnInteraction(event){if(audioStarted||event.target?.closest?.(".music-controls"))return;await setPlayback(true);if(playing){audioStarted=true;["pointerdown","touchstart","wheel","keydown"].forEach(name=>window.removeEventListener(name,startAudioOnInteraction))}}["pointerdown","touchstart","wheel","keydown"].forEach(name=>window.addEventListener(name,startAudioOnInteraction,{passive:true}));
window.addEventListener("keydown",e=>{if(document.getElementById("memeModal").classList.contains("is-open"))return;if(e.key==="ArrowLeft")changeTrack(-1);if(e.key==="ArrowRight")changeTrack(1);if(e.code==="Space"&&!e.target.matches("button,a,input,textarea")){e.preventDefault();setPlayback(!playing)}});
async function copyContract(btn){try{await navigator.clipboard.writeText(CONTRACT_ADDRESS)}catch(e){const t=document.createElement("textarea");t.value=CONTRACT_ADDRESS;document.body.append(t);t.select();document.execCommand("copy");t.remove()}btn.textContent="copied";setTimeout(()=>btn.textContent="copy ca",1500)}document.querySelectorAll(".copy-button").forEach(b=>b.onclick=()=>copyContract(b));

const pfpConfig={bg:{count:20,optional:false},body:{count:9,optional:false},eye:{count:8,optional:true},hand:{count:8,optional:true},hat:{count:14,optional:false},overlay:{count:13,optional:false}};
const layerOrder=["bg","body","eye","hat","hand","overlay"],selection={bg:1,body:1,eye:0,hand:0,hat:1,overlay:1};
const pfpCanvas=document.getElementById("pfpCanvas"),ctx=pfpCanvas.getContext("2d"),shareImage=document.getElementById("pfpShareImage"),cache=new Map();let renderVersion=0;
function image(path){if(cache.has(path))return cache.get(path);const p=new Promise((res,rej)=>{const i=new Image;i.onload=()=>res(i);i.onerror=()=>rej(Error(`Could not load ${path}`));i.src=path});cache.set(path,p);return p}
function label(trait){const v=selection[trait],c=pfpConfig[trait];document.getElementById(`${trait}Value`).textContent=c.optional&&v===0?"none":`${String(v).padStart(2,"0")} / ${String(c.count).padStart(2,"0")}`}
async function renderPfp(){const version=++renderVersion,active=layerOrder.filter(t=>selection[t]>0);try{const imgs=await Promise.all(active.map(t=>image(`pfp editor/${t}/${t}${selection[t]}.png`)));if(version!==renderVersion)return;ctx.clearRect(0,0,1080,1080);imgs.forEach(i=>ctx.drawImage(i,0,0,1080,1080));const preview=pfpCanvas.toDataURL("image/png");shareImage.src=preview;document.getElementById("pfpButtonPreview").src=preview}catch(e){console.error(e)}}
function changeTrait(t,d){const c=pfpConfig[t],min=c.optional?0:1,total=c.count-min+1;selection[t]=((selection[t]-min+d+total)%total)+min;label(t);renderPfp()}
document.querySelectorAll(".trait-control").forEach(c=>c.querySelectorAll(".trait-arrow").forEach(b=>b.onclick=()=>changeTrait(c.dataset.trait,Number(b.dataset.direction))));
document.getElementById("randomizePfp").onclick=()=>{layerOrder.forEach(t=>{selection[t]=Math.floor(Math.random()*pfpConfig[t].count)+1;label(t)});renderPfp()};
document.getElementById("downloadPfp").onclick=async()=>{const blob=await new Promise(r=>pfpCanvas.toBlob(r,"image/png"));if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`hashbrown-pfp-${Date.now()}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};layerOrder.forEach(label);if(!isMobile)renderPfp();

const memeMedia={photos:Array.from({length:11},(_,i)=>({type:"image",src:`assets/memes/meme${i+1}.png`})),videos:Array.from({length:13},(_,i)=>({type:"video",src:`assets/memes/vid${i+1}.mp4`}))};
const grid=document.getElementById("memeGrid"),tabs=[...document.querySelectorAll(".meme-tab")],modal=document.getElementById("memeModal"),frame=document.getElementById("memeModalFrame");let mediaType="photos",mediaIndex=0,resume=false;
document.body.appendChild(modal);
function renderGrid(){grid.innerHTML="";memeMedia[mediaType].forEach((m,i)=>{const b=document.createElement("button"),el=document.createElement(m.type==="image"?"img":"video");b.className="meme-item";b.type="button";el.src=m.src;if(m.type==="video"){el.muted=true;el.loop=true;el.playsInline=true;el.preload="metadata"}b.append(el);b.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();openModal(i)});grid.append(b)})}
function renderModal(){const m=memeMedia[mediaType][mediaIndex],el=document.createElement(m.type==="image"?"img":"video");el.src=m.src;if(m.type==="video"){el.controls=true;el.autoplay=true;el.playsInline=true}frame.replaceChildren(el)}
function openModal(i){mediaIndex=i;if(mediaType==="videos"){resume=playing;if(playing)setPlayback(false)}renderModal();modal.classList.add("is-open");modal.style.display="flex";modal.setAttribute("aria-hidden","false");document.body.classList.add("meme-modal-open")}
function closeModal(){modal.classList.remove("is-open");modal.style.display="none";modal.setAttribute("aria-hidden","true");document.body.classList.remove("meme-modal-open");frame.innerHTML="";if(resume){resume=false;setPlayback(true)}}
function shiftModal(d){const a=memeMedia[mediaType];mediaIndex=(mediaIndex+d+a.length)%a.length;renderModal()}
tabs.forEach(t=>t.onclick=()=>{mediaType=t.dataset.galleryType;tabs.forEach(x=>{x.classList.toggle("is-active",x===t);x.setAttribute("aria-selected",String(x===t))});renderGrid()});document.getElementById("memeModalClose").onclick=closeModal;document.getElementById("memeModalPrevious").onclick=()=>shiftModal(-1);document.getElementById("memeModalNext").onclick=()=>shiftModal(1);modal.onclick=e=>{if(e.target===modal||e.target.id==="memeModalContent")closeModal()};window.addEventListener("keydown",e=>{if(!modal.classList.contains("is-open"))return;if(e.key==="Escape")closeModal();if(e.key==="ArrowLeft")shiftModal(-1);if(e.key==="ArrowRight")shiftModal(1)},true);if(!isMobile)renderGrid();

function openAppModal(id){const target=document.getElementById(id);if(!target)return;if(isMobile&&id==="pfpModal"&&!target.dataset.mediaLoaded){target.dataset.mediaLoaded="true";renderPfp()}if(isMobile&&id==="galleryModal"&&!target.dataset.mediaLoaded){target.dataset.mediaLoaded="true";renderGrid()}target.classList.add("is-open");target.setAttribute("aria-hidden","false")}
function closeAppModal(target){target.classList.remove("is-open");target.setAttribute("aria-hidden","true")}
document.querySelectorAll("[data-open-modal]").forEach(button=>button.addEventListener("click",()=>openAppModal(button.dataset.openModal)));
document.querySelectorAll("[data-close-modal]").forEach(button=>button.addEventListener("click",()=>closeAppModal(button.closest(".app-modal"))));
document.querySelectorAll(".app-modal").forEach(item=>item.addEventListener("click",event=>{if(event.target===item)closeAppModal(item)}));
window.addEventListener("keydown",event=>{if(event.key!=="Escape")return;const opened=document.querySelector(".app-modal.is-open");if(opened)closeAppModal(opened)});
