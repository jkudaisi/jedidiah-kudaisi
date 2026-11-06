(function(){
const root=document.documentElement;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile=()=>innerWidth<=820;

// marquee duplicate
const mq=document.querySelector('.mq-track');mq.innerHTML+=mq.innerHTML;

// roles
const ROLES=[
 {org:'Oakland Integrated, Vineland NJ',t:'IT Analyst & Systems Administrator',when:'2023 to present',side:'technical',b:['Mapped 10 manual workflows and automated them in Zapier and n8n, saving staff 30 hours a week','Keep billing data accurate across Square and TherapyNotes for $100,000+ in healthcare transactions','Write SQL reports and document processes','Build internal tools and marketing assets']},
 {org:'Modachron',t:'Co-founder, Modachron',when:'2024 to present',side:'technical',b:['Turn user behavior and requirements into business rules for the outfit recommendation engine','Run a serverless Supabase and PostgreSQL backend','Write tests for the core algorithm and backend endpoints','Built the Figma design system and edit the product videos']},
 {org:'Jedit.Jed, freelance',t:'Videographer & Video Editor',when:'2020 to present',side:'creative',b:['Shoot and edit cinematic content for artists, brands, weddings and social','5M+ total views across freelance work','Run lighting, camera and audio on every shoot','Kinetic editing and high-end transitions in Premiere Pro and After Effects']},
 {org:'Rowan Campus Recreation',t:'Video Editor',when:'Current',side:'creative',b:['Produce promo and event videos for campus audiences','Help film on site and plan content','Deliver edits on tight deadlines']},
 {org:'Deeper Life Bible Church',t:'Media Coordinator',when:'2021 to present',side:'creative',b:['Run full audio and video production for live events','Train the media team']},
 {org:'Oakland Integrated',t:'IT Intern',when:'2021 to 2023',side:'technical',b:['Cut downtime for 30 staff by fixing hardware, software and system issues','Supported Zoho, WordPress and Python tools']}
];
const list=document.getElementById('roleList'),det=document.getElementById('roleDetail');
function showRole(i){list.querySelectorAll('li').forEach(li=>li.classList.toggle('active',+li.dataset.r===i));const r=ROLES[i];
 det.innerHTML=`<p class="eyebrow">${r.side==='creative'?'Videography':'Tech'}</p><div class="org">${r.org}</div><div class="when">${r.when}</div><ul>${r.b.map(x=>`<li>${x}</li>`).join('')}</ul>`;
 if(window.gsap&&!reduce)gsap.fromTo(det.children,{y:14,opacity:0},{y:0,opacity:1,stagger:.05,duration:.4});}
list.querySelectorAll('li').forEach(li=>{const i=+li.dataset.r;li.addEventListener('mouseenter',()=>showRole(i));li.addEventListener('click',()=>showRole(i))});
showRole(0);

// side switching
function setSide(s){if(root.dataset.side===s)return;root.dataset.side=s;window.dispatchEvent(new CustomEvent('side',{detail:s}));if(window.ScrollTrigger)requestAnimationFrame(()=>ScrollTrigger.refresh());}
document.getElementById('coin').addEventListener('click',()=>setSide(root.dataset.side==='creative'?'technical':'creative'));
document.querySelectorAll('.split-btn').forEach(b=>b.addEventListener('click',()=>{setSide(b.dataset.go);const t=document.getElementById(b.dataset.go==='creative'?'work':'build');setTimeout(()=>lenis?lenis.scrollTo(t,{offset:-40}):t.scrollIntoView(),60)}));

// before/after
const ba=document.getElementById('ba'),clip=ba.querySelector('.ba-clip'),h=ba.querySelector('.ba-handle');
function setBA(p){p=Math.max(0,Math.min(100,p));clip.style.clipPath=`inset(0 ${100-p}% 0 0)`;h.style.left=p+'%';h.setAttribute('aria-valuenow',Math.round(p));}
let drag=false;const pos=e=>{const r=ba.getBoundingClientRect();setBA((e.clientX-r.left)/r.width*100)};
h.addEventListener('pointerdown',e=>{drag=true;h.setPointerCapture(e.pointerId)});
h.addEventListener('pointermove',e=>drag&&pos(e));
h.addEventListener('pointerup',()=>drag=false);
ba.addEventListener('click',e=>{if(e.target!==h)pos(e)});
h.addEventListener('keydown',e=>{const v=+h.getAttribute('aria-valuenow');if(e.key==='ArrowLeft')setBA(v-5);if(e.key==='ArrowRight')setBA(v+5)});
const vids=ba.querySelectorAll('video');vids[0].addEventListener('timeupdate',()=>{if(Math.abs(vids[1].currentTime-vids[0].currentTime)>.15)vids[1].currentTime=vids[0].currentTime});

// cards: preview on hover/in view, modal on click
const modal=document.getElementById('modal'),mv=document.getElementById('mVid');
document.querySelectorAll('.card video').forEach(v=>{
 const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){v.preload='auto';if(!reduce)v.play().catch(()=>{})}else v.pause()}),{threshold:.3});io.observe(v)});
document.querySelectorAll('button.card').forEach(c=>c.addEventListener('click',()=>{const src=c.dataset.full||c.querySelector('video').src;mv.src=src;modal.hidden=false;mv.play().catch(()=>{});lenis&&lenis.stop()}));
function closeM(){modal.hidden=true;mv.pause();mv.removeAttribute('src');mv.load();lenis&&lenis.start()}
modal.addEventListener('click',e=>{if(e.target!==mv)closeM()});addEventListener('keydown',e=>e.key==='Escape'&&!modal.hidden&&closeM());

// Lenis + GSAP
let lenis=null;
if(!reduce&&window.Lenis){lenis=new Lenis({lerp:.09,smoothWheel:true});window.lenis=lenis;
 if(window.ScrollTrigger){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}
 else{const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf)}
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();lenis.scrollTo(a.getAttribute('href'),{offset:-40})}));
}
if(!window.gsap)return;
gsap.registerPlugin(ScrollTrigger);
if(reduce){return}
// hero intro + parallax
gsap.from('.ht-line',{yPercent:110,opacity:0,duration:1.1,stagger:.12,ease:'power4.out'});
gsap.from('.hero-video',{y:80,opacity:0,duration:1.2,delay:.3,ease:'power3.out'});
gsap.to('.ht-1',{xPercent:-12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
gsap.to('.ht-2',{xPercent:10,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
gsap.to('.hero-video',{yPercent:-35,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
// reveals
gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
// counters
document.querySelectorAll('.num').forEach(n=>{const o={v:0};ScrollTrigger.create({trigger:n,start:'top 85%',once:true,onEnter:()=>gsap.to(o,{v:+n.dataset.count,duration:1.6,ease:'power2.out',onUpdate:()=>n.textContent=Math.round(o.v)})})});
// horizontal pinned work (desktop)
ScrollTrigger.matchMedia({'(min-width: 821px)':function(){
 const row=document.getElementById('workRow');
 const dist=()=>row.scrollWidth-(innerWidth-row.getBoundingClientRect().left)+innerWidth*.06;
 gsap.to(row,{x:()=>-Math.max(0,dist()),ease:'none',scrollTrigger:{trigger:'.work-pin',pin:true,start:'top top',end:()=>'+='+Math.max(1,dist()),scrub:1,invalidateOnRefresh:true}});
}});
// role scroll highlight
document.querySelectorAll('.role-list li').forEach(li=>ScrollTrigger.create({trigger:li,start:'top 55%',end:'bottom 55%',onEnter:()=>showRole(+li.dataset.r),onEnterBack:()=>showRole(+li.dataset.r)}));
addEventListener('load',()=>ScrollTrigger.refresh());
})();
