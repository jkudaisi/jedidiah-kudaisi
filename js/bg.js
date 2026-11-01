import * as THREE from 'three';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas=document.getElementById('bg');
const r=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
r.setPixelRatio(Math.min(devicePixelRatio,1.5));
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(50,1,.1,100);cam.position.z=18;
const COL={creative:new THREE.Color('#ff3b2f'),technical:new THREE.Color('#2de2c4')};
const mat=new THREE.MeshBasicMaterial({color:COL.creative.clone(),wireframe:true,transparent:true,opacity:.16});
const geos=[new THREE.IcosahedronGeometry(1,0),new THREE.OctahedronGeometry(1,0),new THREE.TetrahedronGeometry(1,0),new THREE.BoxGeometry(1.2,1.2,1.2),new THREE.TorusGeometry(.8,.25,6,12)];
const n=innerWidth<820?14:26,shapes=[];
for(let i=0;i<n;i++){const m=new THREE.Mesh(geos[i%geos.length],mat);m.position.set((Math.random()-.5)*34,(Math.random()-.5)*22,(Math.random()-.5)*14-4);const s=.4+Math.random()*1.3;m.scale.setScalar(s);m.userData={rx:(Math.random()-.5)*.006,ry:(Math.random()-.5)*.006,f:Math.random()*6,sp:.2+Math.random()*.4,y0:m.position.y};scene.add(m);shapes.push(m)}
// points grid for technical feel
const pg=new THREE.BufferGeometry(),pts=[];for(let x=-20;x<=20;x+=2)for(let y=-12;y<=12;y+=2)pts.push(x,y,-10);
pg.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
const pm=new THREE.PointsMaterial({color:COL.technical.clone(),size:.06,transparent:true,opacity:0});const grid=new THREE.Points(pg,pm);scene.add(grid);
let target='creative',tGrid=0,mx=0,my=0;
addEventListener('side',e=>{target=e.detail;tGrid=target==='technical'?.5:0});
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
function size(){r.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}size();addEventListener('resize',size);
const clock=new THREE.Clock();
function tick(){const t=clock.getElapsedTime(),sy=scrollY*.002;
 mat.color.lerp(COL[target],.05);pm.opacity+=(tGrid-pm.opacity)*.05;
 shapes.forEach(m=>{m.rotation.x+=m.userData.rx*(target==='technical'?.4:1.4);m.rotation.y+=m.userData.ry*(target==='technical'?.4:1.4);m.position.y=m.userData.y0+Math.sin(t*m.userData.sp+m.userData.f)*.6});
 cam.position.x+=(mx*1.5-cam.position.x)*.03;cam.position.y+=(-my*1.0-sy-cam.position.y)*.03;cam.lookAt(0,-sy,0);
 r.render(scene,cam);if(!reduce)requestAnimationFrame(tick)}
tick();
