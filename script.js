document.getElementById('year').textContent = new Date().getFullYear();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold: 0.06});
  if (!reduceMotion.matches) document.querySelectorAll('.reveal').forEach(section => {
    if (section.getBoundingClientRect().top > window.innerHeight) {
      section.classList.add('is-pending'); revealObserver.observe(section);
    }
  });
  const links = document.querySelectorAll('nav a');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) links.forEach(link => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, {rootMargin: '-15% 0px -50% 0px'});
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}
const progress = document.querySelector('.reading-progress');
let framePending = false;
function updateProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${total > 0 ? Math.min(1, window.scrollY / total) : 0})`;
  framePending = false;
}
window.addEventListener('scroll', () => {
  if (!framePending) { framePending = true; requestAnimationFrame(updateProgress); }
}, {passive: true});
window.addEventListener('resize', updateProgress);
updateProgress();
// A local canvas illustration: no libraries or network requests needed.
const canvas = document.getElementById('globe');
const ctx = canvas.getContext('2d');
const sculpture = document.querySelector('.sculpture');
const themeButton = document.querySelector('.theme-toggle');
let lightTheme = false;
try { lightTheme = localStorage.getItem('portfolio-theme') === 'light'; } catch (_) {}
function applyTheme() {
  document.body.dataset.theme = lightTheme ? 'light' : 'dark';
  themeButton.setAttribute('aria-pressed', String(lightTheme));
  themeButton.setAttribute('aria-label', `Switch to ${lightTheme ? 'dark' : 'light'} theme`);
  document.querySelector('meta[name="theme-color"]').content = lightTheme ? '#f2f3fc' : '#090b16';
}
applyTheme();
themeButton.addEventListener('click', () => {
  lightTheme = !lightTheme;
  applyTheme();
  try { localStorage.setItem('portfolio-theme', lightTheme ? 'light' : 'dark'); } catch (_) {}
  if (reduceMotion.matches) drawGlobe();
});
let width = 0, height = 0, rotation = 0, animationId = 0;
let pointer = {x: 0, y: 0};
let visible = true;
const points = Array.from({length: 360}, (_, index) => {
  const latitude = Math.acos(1 - 2 * (index + 0.5) / 360);
  const longitude = Math.PI * (3 - Math.sqrt(5)) * index;
  return {x: Math.sin(latitude) * Math.cos(longitude), y: Math.cos(latitude), z: Math.sin(latitude) * Math.sin(longitude)};
});
function resizeGlobe() {
  width = sculpture.clientWidth;
  height = sculpture.clientHeight;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  drawGlobe();
}
function drawGlobe() {
  if (!ctx || !width || !height) return;
  ctx.clearRect(0, 0, width, height);
  const radius = Math.min(width * 0.34, height * 0.35);
  const cx = width * 0.52 + pointer.x * 12;
  const cy = height * 0.5 + pointer.y * 10;
  const projected = points.map(point => {
    const x = point.x * Math.cos(rotation) - point.z * Math.sin(rotation);
    const z = point.x * Math.sin(rotation) + point.z * Math.cos(rotation);
    const y = point.y * Math.cos(0.25) - z * Math.sin(0.25);
    const depth = point.y * Math.sin(0.25) + z * Math.cos(0.25);
    return {x: cx + x * radius, y: cy + y * radius, z: depth};
  });
  const purple = lightTheme ? '99,64,189' : '172,145,255';
  const cyan = lightTheme ? '8,127,135' : '108,231,228';
  projected.forEach((point, index) => {
    if (point.z > -0.2) {
      for (let offset = 1; offset <= 2; offset++) {
        const other = projected[(index + offset * 13) % projected.length];
        const distance = Math.hypot(point.x - other.x, point.y - other.y);
        if (other.z > 0 && distance < radius * 0.24) {
          ctx.beginPath();ctx.moveTo(point.x, point.y);ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(${purple},${(1 - distance / (radius * 0.24)) * 0.23})`;
          ctx.lineWidth = 0.6;ctx.stroke();
        }
      }
    }
    const opacity = 0.18 + (point.z + 1) * 0.37;
    ctx.beginPath();ctx.arc(point.x, point.y, 0.6 + (point.z + 1) * 0.65, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${index % 4 ? purple : cyan},${opacity})`;ctx.fill();
  });
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-0.38);
  ctx.beginPath();ctx.ellipse(0,0,radius*1.28,radius*0.37,0,0,Math.PI*2);
  ctx.strokeStyle = `rgba(${cyan},0.45)`;ctx.lineWidth = 0.8;ctx.stroke();
  const satellite = rotation * 1.7;
  const sx = Math.cos(satellite)*radius*1.28, sy = Math.sin(satellite)*radius*0.37;
  ctx.shadowBlur=16;ctx.shadowColor=`rgb(${cyan})`;
  ctx.fillStyle=`rgb(${cyan})`;ctx.beginPath();ctx.arc(sx,sy,3,0,Math.PI*2);ctx.fill();ctx.restore();
}
let previousTime = 0;
function animate(time) {
  animationId = 0;
  if (document.hidden || !visible || reduceMotion.matches) return;
  if (time - previousTime > 30) {
    rotation += 0.004;
    drawGlobe();previousTime = time;
  }
  animationId = requestAnimationFrame(animate);
}
function syncAnimation() {
  cancelAnimationFrame(animationId);animationId = 0;
  drawGlobe();
  if (!document.hidden && visible && !reduceMotion.matches) animationId = requestAnimationFrame(animate);
}
sculpture.addEventListener('pointermove', event => {
  if (reduceMotion.matches || event.pointerType !== 'mouse') return;
  const rect = sculpture.getBoundingClientRect();
  pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
  pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
});
sculpture.addEventListener('pointerleave', () => {pointer = {x:0,y:0};});
if ('ResizeObserver' in window) new ResizeObserver(resizeGlobe).observe(sculpture);
else window.addEventListener('resize', resizeGlobe);
if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
  visible = entries[0].isIntersecting;syncAnimation();
}).observe(sculpture);
document.addEventListener('visibilitychange', syncAnimation);
reduceMotion.addEventListener('change', () => {
  if (reduceMotion.matches) {
    document.querySelectorAll('.is-pending').forEach(el => el.classList.remove('is-pending'));
    pointer = {x:0,y:0};
  }
  syncAnimation();
});
resizeGlobe();syncAnimation();
