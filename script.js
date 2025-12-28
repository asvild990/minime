const svg = document.getElementById("miniMe");
const head = document.getElementById("head");
const pupilL = document.getElementById("pupilL");
const pupilR = document.getElementById("pupilR");

let target = { x: 0, y: 0 };
let state  = { x: 0, y: 0 };

function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }
function lerp(a,b,t){ return a + (b-a)*t; }

function getLocalPointer(e){
  const rect = svg.getBoundingClientRect();
  const x = ("touches" in e) ? e.touches[0].clientX : e.clientX;
  const y = ("touches" in e) ? e.touches[0].clientY : e.clientY;
  return {
    x: (x - rect.left) / rect.width,  // 0..1
    y: (y - rect.top) / rect.height   // 0..1
  };
}

function onMove(e){
  target = getLocalPointer(e);
}
window.addEventListener("mousemove", onMove, { passive: true });
window.addEventListener("touchmove", onMove, { passive: true });

function tick(){
  // smooth follow
  state.x = lerp(state.x, target.x, 0.12);
  state.y = lerp(state.y, target.y, 0.12);

  // map to -1..1 centered
  const cx = (state.x - 0.5) * 2;
  const cy = (state.y - 0.5) * 2;

  // pupils move inside eye bounds
  const px = clamp(cx * 8, -8, 8);
  const py = clamp(cy * 8, -8, 8);

  pupilL.setAttribute("cx", px);
  pupilL.setAttribute("cy", py);
  pupilR.setAttribute("cx", px);
  pupilR.setAttribute("cy", py);

  // head tilt + slight translate
  const rot = clamp(cx * 10, -10, 10);
  const tx  = clamp(cx * 6, -6, 6);
  const ty  = clamp(cy * 6, -6, 6);

  head.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;

  requestAnimationFrame(tick);
}
tick();
