/* Cursor + text effects: scramble, line-mask reveals, hover previews, custom cursor */
(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
const root=document.documentElement;
root.classList.add('fx');if(reduce)root.classList.add('fx-reduce');

/* ---------- SCRAMBLE ---------- */
const GLYPHS='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+/<>=';
function scramble(el,dur){
  const final=el.dataset.final||(el.dataset.final=el.textContent);
  if(reduce){el.textContent=final;return}
  dur=dur||750;const t0=performance.now(),n=final.length;
  el.classList.add('scrambling');
  (function f(now){
    const p=Math.min(1,(now-t0)/dur);let out='';
    for(let i=0;i<n;i++){const c=final[i];
      const lock=.25+.75*(i/Math.max(1,n-1));
      out+=(c===' '||c==='.'||c==="'"||p>=lock)?c:GLYPHS[(Math.random()*GLYPHS.length)|0];}
    el.textContent=out;
    if(p<1)requestAnimationFrame(f);else{el.textContent=final;el.classList.remove('scrambling')}
  })(t0);
}
window.jkScramble=scramble;

/* ---------- LINE MASK ---------- */
const heads=[...document.querySelectorAll('h2.big, .foot-title')];
heads.forEach(h=>{h.classList.remove('reveal');h.classList.add('mask');
  if(!h.querySelector('.ln')){const parts=h.innerHTML.split(/<br\s*\/?>/i);h.innerHTML=parts.map(x=>`<span class="ln">${x}</span>`).join('')}
  h.querySelectorAll('.ln').forEach((ln,i)=>{ln.innerHTML=`<span class="li" style="transition-delay:${i*90}ms">${ln.innerHTML}</span>`});
});
const paras=[...document.querySelectorAll('.muted, .hero-sub, .stat-text h3')];
paras.forEach(p=>{p.classList.remove('reveal');p.classList.add('mask','mask-p')});
function splitLines(p){
  const txt=p.dataset.txt||(p.dataset.txt=p.textContent.trim().replace(/\s+/g,' '));
  p.innerHTML=txt.split(' ').map(w=>`<span class="w">${w}</span>`).join(' ');
  const lines=[];let top=null;
  p.querySelectorAll('.w').forEach(w=>{const t=w.offsetTop;if(top===null||Math.abs(t-top)>4){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
  p.innerHTML=lines.map((l,i)=>`<span class="ln"><span class="li" style="transition-delay:${i*80}ms">${l.join(' ')}</span></span>`).join('');
  p.classList.remove('mask-p');
}
const ready=(document.fonts&&document.fonts.ready)?document.fonts.ready:Promise.resolve();
ready.then(()=>{paras.forEach(splitLines);observe()});
let rw;addEventListener('resize',()=>{clearTimeout(rw);rw=setTimeout(()=>paras.forEach(p=>{const was=p.classList.contains('in');splitLines(p);if(was)p.classList.add('in')}),200)});

function reveal(el){if(el.classList.contains('in'))return;el.classList.add('in');
  el.querySelectorAll('.scr').forEach((s,i)=>setTimeout(()=>scramble(s,800),180+i*80));}
function observe(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){reveal(e.target);io.unobserve(e.target)}}),{threshold:.2,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.mask').forEach(el=>io.observe(el));
}
// hero eyebrow scrambles on load
document.querySelectorAll('.scr-load').forEach(s=>setTimeout(()=>scramble(s,850),350));
// re-scramble accent words when side flips (fun, cheap)
addEventListener('side',()=>document.querySelectorAll('.mask.in .scr').forEach(s=>{const r=s.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)scramble(s,600)}));

if(!fine)return;
/* ---------- CUSTOM CURSOR ---------- */
root.classList.add('has-cursor');
const dot=document.createElement('div');dot.className='cur-dot';
const ring=document.createElement('div');ring.className='cur-ring';ring.innerHTML='<span></span>';
document.body.append(dot,ring);
const lab=ring.firstChild;
let mx=-100,my=-100,rx=-100,ry=-100;
addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;mx=e.clientX;my=e.clientY;root.classList.add('cur-on')},{passive:true});
document.addEventListener('mouseleave',()=>root.classList.remove('cur-on'));
function mode(t){
  if(!t||!t.closest)return['',''];
  if(t.closest('input,textarea,select'))return['hide',''];
  if(t.closest('.ba-frame'))return['label','DRAG'];
  if(t.closest('.card video, .card, .hero-video'))return['label','PLAY'];
  if(t.closest('a,button,[role=slider],.role-list li,[data-preview]'))return['link',''];
  return['',''];
}
addEventListener('pointerover',e=>{const[m,l]=mode(e.target);ring.dataset.mode=m;dot.dataset.mode=m;lab.textContent=l},{passive:true});

/* ---------- HOVER PREVIEW ---------- */
const pv=document.createElement('div');pv.className='hpv';document.body.append(pv);
let px=0,py=0,cur=null;
function show(src){
  if(cur===src){pv.classList.add('on');return}cur=src;
  const isV=/\.mp4$/i.test(src);
  pv.innerHTML=isV?`<video src="${src}" muted loop playsinline autoplay preload="auto"></video>`:`<img src="${src}" alt="">`;
  const v=pv.querySelector('video');if(v)v.play().catch(()=>{});
  pv.classList.remove('swap');void pv.offsetWidth;pv.classList.add('on','swap');
}
function hide(){pv.classList.remove('on');const v=pv.querySelector('video');if(v)v.pause()}
document.querySelectorAll('[data-preview]').forEach(el=>{
  el.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')show(el.dataset.preview)});
  el.addEventListener('pointerleave',hide);
});
addEventListener('scroll',()=>{if(pv.classList.contains('on')){const t=document.elementFromPoint(mx,my);if(!t||!t.closest('[data-preview]'))hide()}},{passive:true});

(function loop(){
  const k=reduce?1:.18;rx+=(mx-rx)*k;ry+=(my-ry)*k;px+=(mx-px)*(reduce?1:.12);py+=(my-py)*(reduce?1:.12);
  dot.style.transform=`translate3d(${mx}px,${my}px,0)`;
  ring.style.transform=`translate3d(${rx}px,${ry}px,0)`;
  pv.style.transform=`translate3d(${px+28}px,${py-90}px,0)`;
  requestAnimationFrame(loop);
})();
})();
