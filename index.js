function hideContent() {
  var x = document.getElementById("targetElement");
  x.style.transition = "opacity 1s ease";
  x.style.opacity = "0";
  
  // Optional: Remove from layout after fade finishes
  setTimeout(() => {
    x.style.display = "none";
  }, 1000);
}

/* CARDS - easily expand by editing this array or calling addCard(...) */
const CARDS = [
  {
    id: 'id',
    title: 'TITLE',
    desc: 'DESCRIPTION',
    img: 'IMGURL',
    url: '/'
  }
];

/* --- particle background (same performant approach) --- */
(() => {
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d', { alpha: false });
  const CONFIG = { count: 120, radius: 1.25, maxSpeed: 0.45, connectDist: 78, hueBase: 265, hueSpread: 62, dotSat: 82, dotLight: 62, lineWidth: 0.9 };
  function resize(){ const dpr = Math.min(window.devicePixelRatio || 1, 2); canvas.width = Math.floor(innerWidth * dpr); canvas.height = Math.floor(innerHeight * dpr); canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px'; ctx.setTransform(dpr,0,0,dpr,0,0); }
  addEventListener('resize', resize, { passive:true }); resize();
  const rand=(a,b)=>a+Math.random()*(b-a), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const particles=[]; for(let i=0;i<CONFIG.count;i++) particles.push({ x:Math.random()*innerWidth, y:Math.random()*innerHeight, vx:rand(-CONFIG.maxSpeed,CONFIG.maxSpeed), vy:rand(-CONFIG.maxSpeed,CONFIG.maxSpeed), hue:(CONFIG.hueBase - CONFIG.hueSpread/2) + Math.random()*CONFIG.hueSpread, size: CONFIG.radius * (0.7 + Math.random()*0.6) });
  const connectDistSq = CONFIG.connectDist * CONFIG.connectDist;
  let last = performance.now();
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function drawBackground(){ const w=innerWidth,h=innerHeight; ctx.fillStyle='#040006'; ctx.fillRect(0,0,w,h); const g = ctx.createRadialGradient(w*0.28, h*0.22, 10, w*0.5, h*0.5, Math.max(w,h)); g.addColorStop(0, 'rgba(150,80,200,0.08)'); g.addColorStop(0.35, 'rgba(50,15,90,0.06)'); g.addColorStop(1, 'rgba(4,0,6,1)'); ctx.fillStyle=g; ctx.fillRect(0,0,w,h); }
  function frame(now){
    const dt = Math.min((now - last)/16.6667, 4); last = now;
    drawBackground();
    ctx.globalCompositeOperation = 'lighter';
    for(let i=0;i<particles.length;i++){
      const p = particles[i];
      p.x += p.vx * dt; p.y += p.vy * dt;
      if(p.x < -10) p.x = innerWidth + 10;
      if(p.y < -10) p.y = innerHeight + 10;
      if(p.x > innerWidth + 10) p.x = -10;
      if(p.y > innerHeight + 10) p.y = -10;
      ctx.beginPath(); ctx.fillStyle = `hsl(${p.hue} ${CONFIG.dotSat}% ${CONFIG.dotLight}%)`; ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
    }
    ctx.lineWidth = CONFIG.lineWidth;
    for(let i=0, len=particles.length; i<len; i++){
      const a = particles[i];
      for(let j=i+1; j<len; j++){
        const b = particles[j];
        const dx=b.x-a.x, dy=b.y-a.y, d2=dx*dx+dy*dy;
        if(d2 <= connectDistSq){
          const dist=Math.sqrt(d2), t=clamp(dist/CONFIG.connectDist,0,1), alpha=Math.pow((1-t)*0.96,1.12), hue=Math.round((a.hue+b.hue)*0.5), light = CONFIG.dotLight-12;
          ctx.strokeStyle = `hsla(${hue} ${CONFIG.dotSat}% ${light}%, ${alpha})`;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    if(!reduced){
      ctx.globalCompositeOperation = 'soft-light';
      const t = now * 0.00012, bandW = innerWidth * 0.14, bandX = (((Math.sin(t)+1)/2)*(innerWidth+bandW)) - bandW;
      ctx.fillStyle = `rgba(255,255,255,${0.02 + 0.01*Math.sin(t*2.5)})`;
      ctx.fillRect(bandX - bandW*0.35, 0, bandW, innerHeight);
    }
    ctx.globalCompositeOperation = 'source-over';
    if(!reduced) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* --- UI: Reveal / fast scroll + background swap + wheel population --- */
(() => {
  const exploreBtn = document.getElementById('exploreBtn');
  const wheel = document.getElementById('wheel');
  const bottomGlow = document.getElementById('bottomGlow');
  const panel = document.getElementById('panel');
  const panelThumb = document.getElementById('panelThumb');
  const panelTitle = document.getElementById('panelTitle');
  const panelDesc = document.getElementById('panelDesc');
  const panelLaunch = document.getElementById('panelLaunch');

  function createMini(card){
    const el = document.createElement('div'); el.className='mini-card'; el.tabIndex=0;
    const img = document.createElement('div'); img.className='img'; img.style.backgroundImage = `url(${card.img})`; el.appendChild(img);
    const title = document.createElement('div'); title.className='title'; title.textContent = card.title; el.appendChild(title);
    const btn = document.createElement('button'); btn.className='launch'; btn.textContent = `Launch ${card.title}`; btn.setAttribute('aria-label', `Launch ${card.title}`); el.appendChild(btn);
    el.addEventListener('click', ()=> selectCard(card, el)); el.addEventListener('keydown', (ev)=> { if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); selectCard(card, el);} if(ev.key==='ArrowRight') wheel.scrollBy({left:200,behavior:'smooth'}); if(ev.key==='ArrowLeft') wheel.scrollBy({left:-200,behavior:'smooth'}); });
    btn.addEventListener('click', (ev)=>{ ev.stopPropagation(); launchCard(card); });
    return el;
  }

  CARDS.forEach(c => wheel.appendChild(createMini(c)));

  let selectedEl = null;
  let selectedCard = null;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function selectCard(card, el){
    if(selectedEl && selectedEl !== el) selectedEl.classList.remove('selected');
    if(selectedEl === el){ el.classList.remove('selected'); selectedEl=null; selectedCard=null; hidePanel(); document.body.classList.remove('alt-bg'); return; }
    selectedEl = el; selectedCard = card;
    el.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
    requestAnimationFrame(()=>{ el.classList.add('selected'); showPanel(card); });
  }

  function showPanel(card){
    panelThumb.style.backgroundImage = `url(${card.img})`; panelThumb.setAttribute('aria-label', card.title); panelTitle.textContent = card.title; panelDesc.textContent = card.desc || ''; panelLaunch.textContent = `Launch ${card.title}`; panelLaunch.onclick = ()=> launchCard(card);
    panel.classList.add('show'); panel.setAttribute('aria-hidden','false');
  }
  function hidePanel(){ panel.classList.remove('show'); panel.setAttribute('aria-hidden','true'); }

  function launchCard(card){ if(!card || !card.url) return; window.location.href = card.url; }

  // Allow adding cards programmatically
  window.addCard = function(card){ CARDS.push(card); wheel.appendChild(createMini(card)); };

  // Click Explore: fast scroll down and toggle alternate bg + reveal wheel
  exploreBtn.addEventListener('click', async ()=> {
    // fast visual "speed down" movement: animate hero card translate & page scroll
    const heroCard = document.querySelector('.card-hero');
    if(!prefersReduced){
      heroCard.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(30vh) scale(0.98)' }], { duration: 520, easing: 'cubic-bezier(.08,.85,.2,1)', fill: 'forwards' });
    }
    // smooth fast scroll to bottom-ish (we want to reveal bottom wheel)
    const targetY = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    window.scrollTo({ top: targetY, behavior: 'smooth' });

    // Toggle alternate background a bit after scroll starts so user sees motion
    setTimeout(()=>{ document.body.classList.add('alt-bg'); }, 160);

    // ensure wheel is visible and glow intensifies (class handles it)
    setTimeout(()=>{ document.getElementById('bottomGlow').style.opacity = ''; }, 300);
  });

  // clicking outside should deselect
  document.addEventListener('click', (ev)=>{
    const path = ev.composedPath ? ev.composedPath() : (ev.path || []);
    const wheelEl = document.getElementById('wheel');
    if(!path.includes(wheelEl) && !path.includes(panel) && !path.includes(document.querySelector('.card-hero'))){
      if(selectedEl) selectedEl.classList.remove('selected');
      selectedEl=null; selectedCard=null;
      hidePanel();
    }
  }, { capture:true });

  // Escape closes
  document.addEventListener('keydown', (ev)=>{
    if(ev.key === 'Escape' && selectedEl){ selectedEl.classList.remove('selected'); selectedEl=null; selectedCard=null; hidePanel(); }
  });

})();