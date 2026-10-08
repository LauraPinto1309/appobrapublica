/* ObraGest — SPA sin dependencias. Persistencia en localStorage. */
"use strict";
const LS_KEY = "obragest_db_v1";
const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>[...r.querySelectorAll(s)];
const uid = (p="id")=>p+"_"+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4);
const todayISO = ()=>new Date().toISOString().slice(0,10);
const fmtDate = (iso)=>{ if(!iso) return "—"; const d=new Date(iso+"T00:00:00"); return isNaN(d)?iso:d.toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}); };
const fmtEUR = (n)=>new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(Number(n||0));
const esc = (s)=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const daysBetween = (a,b)=>Math.round((new Date(b)-new Date(a))/86400000);
const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));

/* ---------- Seed demo obra pública ---------- */
function seedDB(){
  const m1=uid("m"),m2=uid("m"),m3=uid("m"),m4=uid("m"),m5=uid("m"),m6=uid("m");
  const members=[
    {id:m1,nombre:"Lucía Ferrer",rol:"Jefa de obra",email:"lucia.ferrer@obragest.es",telefono:"600111222",especialidad:"Carreteras",costeHora:38,activo:true},
    {id:m2,nombre:"Marco Aguilar",rol:"Encargado",email:"marco.aguilar@obragest.es",telefono:"600333444",especialidad:"Firmes y asfaltos",costeHora:26,activo:true},
    {id:m3,nombre:"Sara Vidal",rol:"Topógrafa",email:"sara.vidal@obragest.es",telefono:"600555666",especialidad:"Topografía",costeHora:30,activo:true},
    {id:m4,nombre:"Iván Soria",rol:"Técnico PRL",email:"ivan.soria@obragest.es",telefono:"600777888",especialidad:"Seguridad y salud",costeHora:32,activo:true},
    {id:m5,nombre:"Elena Casas",rol:"Administrativa",email:"elena.casas@obragest.es",telefono:"600999000",especialidad:"Certificaciones",costeHora:22,activo:true},
    {id:m6,nombre:"Pau Miralles",rol:"Oficial fontanería",email:"pau.miralles@obragest.es",telefono:"611222333",especialidad:"Redes hidráulicas",costeHora:24,activo:true},
  ];
  const p1=uid("p"),p2=uid("p"),p3=uid("p");
  const projects=[
    {id:p1,codigoExpediente:"2025-OBR-014",nombre:"Reasfaltado CV-95 tramo PK 12–20",descripcion:"Fresado, refuerzo de firme, señalización y drenaje en 8 km.",clienteAdministracion:"Diputación de Alicante",presupuesto:845000,fechaInicio:"2026-02-02",fechaFin:"2026-07-31",estado:"en_ejecucion",responsableId:m1,createdAt:"2026-01-15"},
    {id:p2,codigoExpediente:"2026-HID-003",nombre:"Renovación red agua potable Barrio Sur",descripcion:"Sustitución de 3,2 km de tubería, válvulas e hidrantes.",clienteAdministracion:"Ayto. de Elche",presupuesto:512000,fechaInicio:"2026-03-10",fechaFin:"2026-09-30",estado:"adjudicado",responsableId:m1,createdAt:"2026-02-01"},
    {id:p3,codigoExpediente:"2025-URB-027",nombre:"Reurbanización Plaza Mayor y accesos",descripcion:"Pavimentación, alumbrado, jardinería y accesibilidad.",clienteAdministracion:"Ayto. de Orihuela",presupuesto:390000,fechaInicio:"2026-01-12",fechaFin:"2026-05-30",estado:"en_ejecucion",responsableId:m2,createdAt:"2026-01-05"},
  ];
  const s1=uid("s"),s2=uid("s"),s3=uid("s"),s4=uid("s"),s5=uid("s");
  const subprojects=[
    {id:s1,projectId:p1,nombre:"SP1 Fresado y demolición",descripcion:"Fresado de 8 km y gestión de residuos.",responsableId:m2,presupuesto:180000,fechaInicio:"2026-02-02",fechaFin:"2026-03-20",estado:"finalizado",prioridad:"alta"},
    {id:s2,projectId:p1,nombre:"SP2 Extendido de aglomerado",descripcion:"Capas base e intermedia + rodadura.",responsableId:m2,presupuesto:420000,fechaInicio:"2026-03-21",fechaFin:"2026-06-15",estado:"en_ejecucion",prioridad:"critica"},
    {id:s3,projectId:p1,nombre:"SP3 Señalización y drenaje",descripcion:"Señalización horizontal/vertical y cunetas.",responsableId:m3,presupuesto:95000,fechaInicio:"2026-06-01",fechaFin:"2026-07-31",estado:"pendiente",prioridad:"media"},
    {id:s4,projectId:p2,nombre:"SP1 Tramo A: calles Norte",descripcion:"1,6 km de tubería PEAD.",responsableId:m6,presupuesto:260000,fechaInicio:"2026-03-10",fechaFin:"2026-06-30",estado:"en_ejecucion",prioridad:"alta"},
    {id:s5,projectId:p3,nombre:"SP1 Pavimentación y alumbrado",descripcion:"Baldosa, LED y mobiliario.",responsableId:m2,presupuesto:210000,fechaInicio:"2026-01-12",fechaFin:"2026-04-30",estado:"en_ejecucion",prioridad:"alta"},
  ];
  const t=(o)=>Object.assign({id:uid("t"),descripcion:"",etiquetas:[],estimadasHoras:16,avance:0,createdAt:todayISO()},o);
  const tasks=[
    t({projectId:p1,subprojectId:s2,titulo:"Extendido capa intermedia PK 12–16",asignadoA:m2,prioridad:"critica",estado:"en_curso",estimadasHoras:120,fechaLimite:"2026-04-30",avance:55,etiquetas:["firme","nocturno"]}),
    t({projectId:p1,subprojectId:s2,titulo:"Control densidad y testigos",asignadoA:m3,prioridad:"alta",estado:"pendiente",estimadasHoras:24,fechaLimite:"2026-05-10",avance:10}),
    t({projectId:p1,subprojectId:s1,titulo:"Gestión RCD a planta autorizada",asignadoA:m5,prioridad:"media",estado:"completada",estimadasHoras:12,fechaLimite:"2026-03-18",avance:100}),
    t({projectId:p1,subprojectId:s3,titulo:"Replanteo señalización",asignadoA:m3,prioridad:"media",estado:"pendiente",estimadasHoras:20,fechaLimite:"2026-06-05",avance:0}),
    t({projectId:p2,subprojectId:s4,titulo:"Zanja y cama de arena Tramo A",asignadoA:m6,prioridad:"alta",estado:"en_curso",estimadasHoras:90,fechaLimite:"2026-05-02",avance:40}),
    t({projectId:p2,subprojectId:s4,titulo:"Pruebas de presión y desinfección",asignadoA:m6,prioridad:"alta",estado:"en_revision",estimadasHoras:16,fechaLimite:"2026-06-28",avance:80}),
    t({projectId:p2,subprojectId:null,titulo:"Plan de desvíos de tráfico con Policía Local",asignadoA:m4,prioridad:"media",estado:"bloqueada",estimadasHoras:10,fechaLimite:"2026-04-12",avance:20,descripcion:"Pendiente de autorización municipal."}),
    t({projectId:p3,subprojectId:s5,titulo:"Solera y baldosa Plaza Mayor",asignadoA:m2,prioridad:"alta",estado:"en_curso",estimadasHoras:140,fechaLimite:"2026-04-20",avance:65}),
    t({projectId:p3,subprojectId:s5,titulo:"Certificación nº3 mensual",asignadoA:m5,prioridad:"media",estado:"pendiente",estimadasHoras:8,fechaLimite:"2026-04-05",avance:0}),
  ];
  const timeLogs=[
    {id:uid("h"),taskId:tasks[0].id,memberId:m2,fecha:"2026-04-02",horas:8,descripcion:"Extendedora + compactación"},
    {id:uid("h"),taskId:tasks[0].id,memberId:m2,fecha:"2026-04-03",horas:7.5,descripcion:"Turno noche PK 14"},
    {id:uid("h"),taskId:tasks[4].id,memberId:m6,fecha:"2026-04-03",horas:8,descripcion:"Zanja 120 m"},
    {id:uid("h"),taskId:tasks[7].id,memberId:m2,fecha:"2026-04-04",horas:6,descripcion:"Solera norte"},
  ];
  const progressLogs=[
    {id:uid("a"),scope:"project",refId:p1,fecha:"2026-03-15",porcentaje:35,descripcion:"Fresado completo, inicio de aglomerado.",autorId:m1},
    {id:uid("a"),scope:"project",refId:p1,fecha:"2026-04-05",porcentaje:52,descripcion:"Capa intermedia al 55%.",autorId:m1},
    {id:uid("a"),scope:"project",refId:p3,fecha:"2026-04-04",porcentaje:60,descripcion:"Pavimentación al 65%, alumbrado pedido.",autorId:m2},
  ];
  return {members,projects,subprojects,tasks,timeLogs,progressLogs};
}

/* ---------- Store ---------- */
let db;
function load(){ try{ const raw=localStorage.getItem(LS_KEY); if(!raw){ db=seedDB(); save(); } else db=JSON.parse(raw); }catch{ db=seedDB(); } }
function save(){ localStorage.setItem(LS_KEY,JSON.stringify(db)); updateStorageInfo(); }
function updateStorageInfo(){ const el=$("#storageInfo"); if(!el) return; const kb=(localStorage.getItem(LS_KEY)||"").length/1024; el.textContent=`${db.projects.length} proyectos · ${db.tasks.length} tareas · ${kb.toFixed(1)} KB local`; }

/* ---------- Helpers dominio ---------- */
const memberById=id=>db.members.find(m=>m.id===id);
const projectById=id=>db.projects.find(p=>p.id===id);
const subById=id=>db.subprojects.find(s=>s.id===id);
const tasksOf=p=>db.tasks.filter(t=>!p||t.projectId===p);
const initials=n=>String(n||"?").split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
function taskHours(taskId){ return db.timeLogs.filter(h=>h.taskId===taskId).reduce((a,h)=>a+Number(h.horas||0),0); }
function projectAdvance(p){
  const ts=tasksOf(p.id); if(!ts.length) return 0;
  const w=ts.reduce((a,t)=>a+Number(t.estimadasHoras||1),0)||1;
  return Math.round(ts.reduce((a,t)=>a+Number(t.avance||0)*Number(t.estimadasHoras||1),0)/w);
}
function subAdvance(s){ const ts=db.tasks.filter(t=>t.subprojectId===s.id); if(!ts.length) return s.estado==="finalizado"?100:0; return Math.round(ts.reduce((a,t)=>a+Number(t.avance||0),0)/ts.length); }
function isLate(t){ return t.estado!=="completada" && t.fechaLimite && t.fechaLimite<todayISO(); }
function stateBadge(e){ return `<span class="badge b-${esc(e)}">${esc(labelEstado(e))}</span>`; }
function labelEstado(e){ return {licitacion:"Licitación",adjudicado:"Adjudicado",en_ejecucion:"En ejecución",paralizado:"Paralizado",finalizado:"Finalizado",pendiente:"Pendiente",en_curso:"En curso",en_revision:"En revisión",bloqueada:"Bloqueada",completada:"Completada"}[e]||e; }
function toast(msg,err=false){ const d=document.createElement("div"); d.className="toast"+(err?" err":""); d.textContent=msg; $("#toasts").appendChild(d); setTimeout(()=>d.remove(),3200); }

/* ---------- Modal ---------- */
function openModal(html){ $("#modalBox").innerHTML=html; $("#modalBackdrop").hidden=false; }
function closeModal(){ $("#modalBackdrop").hidden=true; $("#modalBox").innerHTML=""; }
$("#modalBackdrop")?.addEventListener?.("click",()=>{});
document.addEventListener("click",e=>{ if(e.target.id==="modalBackdrop") closeModal(); if(e.target.dataset?.close!==undefined && e.target.hasAttribute("data-close")) closeModal(); });
document.addEventListener("keydown",e=>{ if(e.key==="Escape") closeModal(); if(e.key==="/"&&document.activeElement.tagName!=="INPUT"&&document.activeElement.tagName!=="TEXTAREA"){e.preventDefault();$("#globalSearch").focus();} });

/* ---------- Router ---------- */
let state={view:"dashboard",projectFilter:"",search:""};
function nav(view){ state.view=view; $$("#mainNav button").forEach(b=>b.classList.toggle("active",b.dataset.view===view)); $("#sidebar").classList.remove("open"); render(); }

function render(){
  const v=$("#view");
  ({dashboard:vDashboard,proyectos:vProyectos,kanban:vKanban,gantt:vGantt,equipo:vEquipo,avances:vAvances,informes:vInformes}[state.view])(v);
  refreshProjectFilter();
}
function refreshProjectFilter(){
  const sel=$("#filterProject"); const cur=state.projectFilter;
  sel.innerHTML=`<option value="">Todos los proyectos</option>`+db.projects.map(p=>`<option value="${p.id}" ${p.id===cur?"selected":""}>${esc(p.codigoExpediente+" · "+p.nombre)}</option>`).join("");
}
function filteredTasks(){
  let ts=[...db.tasks];
  if(state.projectFilter) ts=ts.filter(t=>t.projectId===state.projectFilter);
  if(state.search){ const q=state.search.toLowerCase(); ts=ts.filter(t=>(t.titulo+" "+(t.descripcion||"")+" "+(memberById(t.asignadoA)?.nombre||"")).toLowerCase().includes(q)); }
  return ts;
}

/* ---------- Vistas ---------- */
function kpis(){
  const ts=filteredTasks();
  const comp=ts.filter(t=>t.estado==="completada").length;
  const late=ts.filter(isLate).length;
  const horas=db.timeLogs.filter(h=>!state.projectFilter||projectById(tasksById(h.taskId)?.projectId)?.id===state.projectFilter).reduce((a,h)=>a+Number(h.horas||0),0);
  const avanceMedio=db.projects.length?Math.round(db.projects.map(projectAdvance).reduce((a,b)=>a+b,0)/db.projects.length):0;
  const coste=db.timeLogs.reduce((a,h)=>a+Number(h.horas||0)*Number(memberById(h.memberId)?.costeHora||0),0);
  return {total:ts.length,comp,late,horas,avanceMedio,coste};
}
const tasksById=id=>db.tasks.find(t=>t.id===id);

function vDashboard(v){
  const k=kpis();
  v.innerHTML=`
  <div class="spread"><div><h1 style="margin:0">Panel de obra</h1><p class="mut">Reparto, tiempos y avance de tus proyectos de obra pública.</p></div>
  <div class="row"><button class="btn ghost" data-act="csv">⬇ CSV tareas</button><button class="btn ghost" data-act="informe">🖨 Imprimir informe</button></div></div>
  <div class="grid g4 mt">
    <div class="kpi"><small>Tareas (filtro actual)</small><strong>${k.total}</strong><span class="trend">✅ ${k.comp} completadas · ⚠ ${k.late} vencidas</span></div>
    <div class="kpi"><small>Avance medio proyectos</small><strong>${k.avanceMedio}%</strong><div class="progress mt"><i style="width:${k.avanceMedio}%"></i></div></div>
    <div class="kpi"><small>Horas imputadas</small><strong>${k.horas.toFixed(1)} h</strong><span class="trend mut">Coste mano obra ≈ ${fmtEUR(k.coste)}</span></div>
    <div class="kpi"><small>Presupuesto gestionado</small><strong>${fmtEUR(db.projects.reduce((a,p)=>a+Number(p.presupuesto||0),0))}</strong><span class="trend mut">${db.projects.length} expedientes</span></div>
  </div>
  <div class="grid g2 mt">
    <div class="card"><h3>Avance por proyecto</h3>${db.projects.map(p=>{const a=projectAdvance(p);return `<div class="mt"><div class="spread"><strong>${esc(p.codigoExpediente)} — ${esc(p.nombre)}</strong>${stateBadge(p.estado)}</div><div class="row small mut"><span>Resp: ${esc(memberById(p.responsableId)?.nombre||"—")}</span><span>·</span><span>${fmtDate(p.fechaInicio)} → ${fmtDate(p.fechaFin)}</span><span>·</span><span><b>${a}%</b></span></div><div class="progress mt"><i style="width:${a}%"></i></div><div class="toolbar"><button class="btn sm" data-open-project="${p.id}">Abrir</button><button class="btn sm ghost" data-adv-project="${p.id}">＋ Registrar avance</button></div></div>`;}).join("")||`<div class="empty">Sin proyectos. Crea el primero con “＋ Proyecto”.</div>`}</div>
    <div class="card"><h3>Próximos vencimientos</h3>${upcomingHTML()}<h3 class="mt">Últimos avances (bitácora)</h3><div class="timeline">${[...db.progressLogs].sort((a,b)=>b.fecha.localeCompare(a.fecha)).slice(0,6).map(a=>`<div class="t-item"><b>${a.porcentaje}%</b> · ${esc(describeRef(a))} <span class="mut small">${fmtDate(a.fecha)} · ${esc(memberById(a.autorId)?.nombre||"")}</span><br><span class="small">${esc(a.descripcion||"")}</span></div>`).join("")||'<span class="mut">Sin registros.</span>'}</div></div>
  </div>
  <div class="card mt"><h3>Carga por miembro (horas imputadas)</h3><canvas class="chart" id="chCarga" height="220"></canvas></div>`;
  drawBars($("#chCarga"), db.members.map(m=>m.nombre.split(" ")[0]), db.members.map(m=>db.timeLogs.filter(h=>h.memberId===m.id).reduce((a,h)=>a+Number(h.horas||0),0)));
  v.onclick=dashboardClick;
}
function upcomingHTML(){
  const ts=[...db.tasks].filter(t=>t.estado!=="completada").sort((a,b)=>(a.fechaLimite||"9999").localeCompare(b.fechaLimite||"9999")).slice(0,6);
  if(!ts.length) return `<div class="empty">Nada pendiente. 🎉</div>`;
  return `<table class="tbl"><thead><tr><th>Tarea</th><th>Resp.</th><th>Límite</th><th>Estado</th></tr></thead><tbody>`+ts.map(t=>`<tr style="${isLate(t)?"background:#3a1a1a":""}"><td><b>${esc(t.titulo)}</b><br><span class="mut small">${esc(projectById(t.projectId)?.codigoExpediente||"")}</span></td><td>${esc(memberById(t.asignadoA)?.nombre||"—")}</td><td>${fmtDate(t.fechaLimite)} ${isLate(t)?"⚠":""}</td><td>${stateBadge(t.estado)}</td></tr>`).join("")+`</tbody></table>`;
}
function describeRef(a){ if(a.scope==="project") return projectById(a.refId)?.nombre||"proyecto"; if(a.scope==="subproject") return subById(a.refId)?.nombre||"subproyecto"; const t=tasksById(a.refId); return t?.titulo||"tarea"; }
function dashboardClick(e){
  if(e.target.dataset.act==="csv") exportCSV();
  if(e.target.dataset.act==="informe"){ nav("informes"); setTimeout(()=>window.print(),300); }
  const op=e.target.dataset.openProject; if(op){ state.projectFilter=op; nav("proyectos"); }
  const ap=e.target.dataset.advProject; if(ap) modalAvance("project",ap);
}

/* ----- Proyectos ----- */
function vProyectos(v){
  const list=db.projects.filter(p=>!state.projectFilter||p.id===state.projectFilter);
  v.innerHTML=`<div class="spread"><div><h1 style="margin:0">Proyectos y subproyectos</h1><p class="mut">Adjudica subproyectos a miembros del equipo y reparte tareas.</p></div><div class="row"><button class="btn secondary" id="bNewP">＋ Proyecto</button><button class="btn primary" id="bNewS">＋ Subproyecto</button></div></div>
  ${list.map(p=>projectCard(p)).join("")||`<div class="empty mt">Sin proyectos con este filtro.</div>`}`;
  $("#bNewP").onclick=()=>modalProyecto();
  $("#bNewS").onclick=()=>modalSubproyecto(state.projectFilter||db.projects[0]?.id);
  v.onclick=proyectosClick;
}
function projectCard(p){
  const subs=db.projects?db.subprojects.filter(s=>s.projectId===p.id):[];
  const ts=tasksOf(p.id); const av=projectAdvance(p);
  return `<div class="card mt"><div class="spread"><div><b>${esc(p.codigoExpediente)}</b> · <strong>${esc(p.nombre)}</strong><br><span class="mut small">${esc(p.clienteAdministracion||"")} · ${fmtEUR(p.presupuesto)} · ${fmtDate(p.fechaInicio)} → ${fmtDate(p.fechaFin)} · Resp: ${esc(memberById(p.responsableId)?.nombre||"—")}</span></div><div class="row">${stateBadge(p.estado)}<button class="btn sm" data-edit-p="${p.id}">✏</button><button class="btn sm danger" data-del-p="${p.id}">🗑</button></div></div>
  <p class="mut small">${esc(p.descripcion||"")}</p><div class="progress"><i style="width:${av}%"></i></div><div class="small mt">Avance ponderado: <b>${av}%</b> · ${ts.length} tareas · ${subs.length} subproyectos</div>
  <div class="toolbar"><button class="btn sm primary" data-new-t="${p.id}">＋ Tarea</button><button class="btn sm" data-new-s="${p.id}">＋ Subproyecto</button><button class="btn sm ghost" data-adv-p="${p.id}">📈 Avance</button><button class="btn sm ghost" data-hours-p="${p.id}">⏱ Horas (${db.timeLogs.filter(h=>tasksById(h.taskId)?.projectId===p.id).reduce((a,h)=>a+Number(h.horas||0),0).toFixed(1)}h)</button></div>
  ${subs.map(s=>subBlock(s)).join("")||`<div class="empty">Sin subproyectos. Adjudica el primero.</div>`}
  ${unassignedTasks(p)}</div>`;
}
function subBlock(s){
  const ts=db.tasks.filter(t=>t.subprojectId===s.id); const av=subAdvance(s);
  return `<div class="card mt" style="background:#141e2d"><div class="spread"><div>🧩 <strong>${esc(s.nombre)}</strong> <span class="badge">Adjudicado a: ${esc(memberById(s.responsableId)?.nombre||"—")}</span><br><span class="mut small">${esc(s.descripcion||"")} · ${fmtEUR(s.presupuesto)} · ${fmtDate(s.fechaInicio)} → ${fmtDate(s.fechaFin)}</span></div><div class="row">${stateBadge(s.estado)}<span class="badge">Prior. ${esc(s.prioridad||"—")}</span><button class="btn sm" data-edit-s="${s.id}">✏</button><button class="btn sm danger" data-del-s="${s.id}">🗑</button></div></div>
  <div class="progress mt"><i style="width:${av}%"></i></div><div class="small">Avance: <b>${av}%</b> · ${ts.length} tareas</div>
  <div class="toolbar"><button class="btn sm primary" data-new-ts="${s.id}">＋ Tarea aquí</button><button class="btn sm ghost" data-reassign-s="${s.id}">🔁 Re-adjudicar</button><button class="btn sm ghost" data-adv-s="${s.id}">📈 Avance</button></div>
  ${ts.map(taskRow).join("")||`<div class="mut small">Sin tareas en este subproyecto.</div>`}</div>`;
}
function unassignedTasks(p){
  const ts=db.tasks.filter(t=>t.projectId===p.id&&!t.subprojectId);
  if(!ts.length) return "";
  return `<div class="mt"><b class="small">📦 Tareas directas del proyecto (sin subproyecto)</b>${ts.map(taskRow).join("")}</div>`;
}
function taskRow(t){
  return `<div class="task mt"><div class="spread"><div class="t-title">${esc(t.titulo)} ${isLate(t)?"⚠":""}</div><div class="row">${stateBadge(t.estado)}<span class="badge b-${esc(t.prioridad)}">${esc(t.prioridad||"")}</span></div></div>
  <div class="meta"><span class="avatar">${esc(initials(memberById(t.asignadoA)?.nombre))}</span><span>${esc(memberById(t.asignadoA)?.nombre||"Sin asignar")}</span><span>· ⏱ ${taskHours(t.id).toFixed(1)}/${Number(t.estimadasHoras||0)}h</span><span>· 📅 ${fmtDate(t.fechaLimite)}</span><span>· ${Number(t.avance||0)}%</span></div>
  <div class="progress mt"><i style="width:${clamp(Number(t.avance||0),0,100)}%"></i></div>
  <div class="toolbar"><button class="btn sm" data-edit-t="${t.id}">✏ Editar</button><button class="btn sm ghost" data-hour-t="${t.id}">⏱ Imputar</button><button class="btn sm ghost" data-adv-t="${t.id}">📈 Avance</button><button class="btn sm ghost" data-cycle-t="${t.id}">⏭ Avanzar estado</button><button class="btn sm danger" data-del-t="${t.id}">🗑</button></div></div>`;
}
function proyectosClick(e){
  const g=(k)=>e.target.dataset[k]; const v=$("#view");
  if(e.target.id==="bNewP") return;
  if(g("editP")) modalProyecto(projectById(g("editP")));
  if(g("delP")){ if(confirm("¿Eliminar proyecto, subproyectos y tareas asociadas?")){ const id=g("delP"); db.projects=db.projects.filter(p=>p.id!==id); db.subprojects=db.subprojects.filter(s=>s.projectId!==id); const tids=new Set(db.tasks.filter(t=>t.projectId===id).map(t=>t.id)); db.tasks=db.tasks.filter(t=>t.projectId!==id); db.timeLogs=db.timeLogs.filter(h=>!tids.has(h.taskId)); db.progressLogs=db.progressLogs.filter(a=>!(a.scope==="project"&&a.refId===id)); if(state.projectFilter===id)state.projectFilter=""; save(); render(); } }
  if(g("newT")) modalTarea({projectId:g("newT")});
  if(g("newS")) modalSubproyecto(g("newS"));
  if(g("newTs")){ const s=subById(g("newTs")); modalTarea({projectId:s.projectId,subprojectId:s.id}); }
  if(g("advP")) modalAvance("project",g("advP"));
  if(g("advS")) modalAvance("subproject",g("advS"));
  if(g("advT")) modalAvance("task",g("advT"));
  if(g("hoursP")){ const p=projectById(g("hoursP")); openModal(`<h2>⏱ Horas — ${esc(p.nombre)}</h2>${hoursTable(db.timeLogs.filter(h=>tasksById(h.taskId)?.projectId===p.id))}<div class="toolbar"><button class="btn" data-close>Cerrar</button></div>`); }
  if(g("editS")) modalSubproyecto(subById(g("editS")).projectId, subById(g("editS")));
  if(g("delS")){ if(confirm("¿Eliminar subproyecto? Las tareas pasarán al proyecto.")){ const id=g("delS"); db.tasks.forEach(t=>{if(t.subprojectId===id)t.subprojectId=null;}); db.subprojects=db.subprojects.filter(s=>s.id!==id); save(); render(); } }
  if(g("reassignS")){ const s=subById(g("reassignS")); modalSubproyecto(s.projectId,s,true); }
  if(g("editT")) modalTarea(null, tasksById(g("editT")));
  if(g("hourT")) modalHora(g("hourT"));
  if(g("delT")){ if(confirm("¿Eliminar tarea?")){ const id=g("delT"); db.tasks=db.tasks.filter(t=>t.id!==id); db.timeLogs=db.timeLogs.filter(h=>h.taskId!==id); save(); render(); } }
  if(g("cycleT")){ const t=tasksById(g("cycleT")); const order=["pendiente","en_curso","en_revision","completada"]; let i=order.indexOf(t.estado); if(i<0)i=0; t.estado=order[Math.min(i+1,order.length-1)]; if(t.estado==="completada")t.avance=100; save(); render(); toast("Estado → "+labelEstado(t.estado)); }
}
function hoursTable(logs){
  if(!logs.length) return `<div class="empty">Sin horas imputadas.</div>`;
  return `<table class="tbl"><thead><tr><th>Fecha</th><th>Tarea</th><th>Miembro</th><th>Horas</th><th>Detalle</th></tr></thead><tbody>${logs.map(h=>`<tr><td>${fmtDate(h.fecha)}</td><td>${esc(tasksById(h.taskId)?.titulo||"—")}</td><td>${esc(memberById(h.memberId)?.nombre||"—")}</td><td>${h.horas}</td><td class="mut small">${esc(h.descripcion||"")}</td></tr>`).join("")}</tbody></table>`;
}

/* ----- Kanban ----- */
function vKanban(v){
  const cols=["pendiente","en_curso","en_revision","bloqueada","completada"];
  v.innerHTML=`<div class="spread"><div><h1 style="margin:0">Tablero Kanban</h1><p class="mut">Arrastra tareas entre columnas o usa “⏭ Avanzar estado”. Filtro: ${esc(projectById(state.projectFilter)?.nombre||"todos")} · búsqueda: “${esc(state.search)}”.</p></div><button class="btn primary" id="bKanbanNew">＋ Tarea</button></div>
  <div class="kanban mt" id="kb">${cols.map(c=>{const ts=filteredTasks().filter(t=>t.estado===c);return `<div class="col" data-col="${c}"><h4>${labelEstado(c)} <span class="count">${ts.length}</span></h4>${ts.map(t=>`<div class="task" draggable="true" data-id="${t.id}"><div class="t-title">${esc(t.titulo)}</div><div class="meta"><span class="avatar">${esc(initials(memberById(t.asignadoA)?.nombre))}</span><span>${esc(memberById(t.asignadoA)?.nombre||"—")}</span></div><div class="meta"><span class="badge b-${esc(t.prioridad)}">${esc(t.prioridad||"")}</span><span>📅 ${fmtDate(t.fechaLimite)}</span><span>${t.avance||0}%</span></div><div class="progress mt"><i style="width:${t.avance||0}%"></i></div><div class="toolbar"><button class="btn sm" data-edit="${t.id}">✏</button><button class="btn sm ghost" data-hour="${t.id}">⏱</button></div></div>`).join("")||`<div class="mut small">Suelta aquí</div>`}</div>`;}).join("")}</div>`;
  $("#bKanbanNew").onclick=()=>modalTarea(state.projectFilter?{projectId:state.projectFilter}:null);
  v.onclick=(e)=>{ const id=e.target.dataset.edit; if(id) modalTarea(null,tasksById(id)); const h=e.target.dataset.hour; if(h) modalHora(h); };
  // drag & drop
  let dragId=null;
  $$("#kb .task").forEach(el=>{ el.addEventListener("dragstart",()=>{dragId=el.dataset.id;el.classList.add("drag");}); el.addEventListener("dragend",()=>el.classList.remove("drag")); });
  $$("#kb .col").forEach(col=>{ col.addEventListener("dragover",e=>e.preventDefault()); col.addEventListener("drop",()=>{ if(!dragId)return; const t=tasksById(dragId); t.estado=col.dataset.col; if(t.estado==="completada")t.avance=100; save(); render(); toast("Movida a "+labelEstado(t.estado)); }); });
}

/* ----- Gantt / Tiempos ----- */
function vGantt(v){
  const items=[...db.projects.filter(p=>!state.projectFilter||p.id===state.projectFilter).map(p=>({label:`🏛 ${p.codigoExpediente} · ${p.nombre}`,ini:p.fechaInicio,fin:p.fechaFin,late:p.fechaFin<todayISO()&&p.estado!=="finalizado"})),
    ...db.subprojects.filter(s=>!state.projectFilter||s.projectId===state.projectFilter).map(s=>({label:`🧩 ${s.nombre} (${memberById(s.responsableId)?.nombre||"—"})`,ini:s.fechaInicio,fin:s.fechaFin,late:(s.fechaFin||"9999")<todayISO()})),
    ...filteredTasks().slice(0,25).map(t=>({label:`✔ ${t.titulo}`,ini:null,fin:t.fechaLimite,late:isLate(t),point:true}))];
  const all=[...db.projects.flatMap(p=>[p.fechaInicio,p.fechaFin]),todayISO()].filter(Boolean).sort();
  const min=all[0]||todayISO(), max=all[all.length-1]||todayISO();
  const span=Math.max(1,daysBetween(min,max));
  const pos=(d)=>clamp(daysBetween(min,d)/span*100,0,100);
  const w=(a,b)=>Math.max(2,clamp(daysBetween(a,b)/span*100,0,100));
  v.innerHTML=`<div class="spread"><div><h1 style="margin:0">Tiempos y cronograma</h1><p class="mut">Gantt simplificado · rango ${fmtDate(min)} → ${fmtDate(max)} · la línea naranja es hoy.</p></div><div class="row"><button class="btn primary" id="bHora">⏱ Imputar horas</button><button class="btn ghost" id="bCSVh">⬇ CSV horas</button></div></div>
  <div class="grid g3 mt">
    <div class="kpi"><small>Horas totales</small><strong>${db.timeLogs.reduce((a,h)=>a+Number(h.horas||0),0).toFixed(1)} h</strong></div>
    <div class="kpi"><small>Horas estimadas (tareas)</small><strong>${filteredTasks().reduce((a,t)=>a+Number(t.estimadasHoras||0),0)} h</strong></div>
    <div class="kpi"><small>Desviación</small><strong>${(db.timeLogs.reduce((a,h)=>a+Number(h.horas||0),0)-filteredTasks().reduce((a,t)=>a+Number(t.estimadasHoras||0),0)).toFixed(1)} h</strong><span class="trend mut">real − estimado</span></div>
  </div>
  <div class="gantt mt"><div class="g-row g-head"><div class="g-label">Elemento</div><div class="g-label">${fmtDate(min)} — ${fmtDate(max)}</div></div>
  ${items.map(it=>{ if(it.point) return `<div class="g-row"><div class="g-label">${esc(it.label)}</div><div class="g-track"><div class="g-bar ${it.late?"late":""}" title="${esc(it.fin||"")}" style="left:${pos(it.fin)}%">◆ ${esc(it.fin||"")}</div><div class="g-today" style="left:${pos(todayISO())}%"></div></div></div>`;
    return `<div class="g-row"><div class="g-label">${esc(it.label)}<br><span class="mut small">${fmtDate(it.ini)} → ${fmtDate(it.fin)}</span></div><div class="g-track"><div class="g-bar ${it.late?"late":""}" style="left:${pos(it.ini)}%;width:${w(it.ini,it.fin)}%">${esc(it.label.slice(0,40))}</div><div class="g-today" style="left:${pos(todayISO())}%"></div></div></div>`;}).join("")}</div>
  <div class="card mt"><h3>Parte de horas</h3>${hoursTable([...db.timeLogs].sort((a,b)=>b.fecha.localeCompare(a.fecha)).slice(0,50))}</div>`;
  $("#bHora").onclick=()=>modalHora();
  $("#bCSVh").onclick=exportHoursCSV;
}

/* ----- Equipo ----- */
function vEquipo(v){
  v.innerHTML=`<div class="spread"><div><h1 style="margin:0">Equipo</h1><p class="mut">Miembros, roles y adjudicaciones. Pulsa un miembro para ver su carga.</p></div><button class="btn secondary" id="bNewM">＋ Miembro</button></div>
  <div class="grid g3 mt">${db.members.map(m=>{const ts=db.tasks.filter(t=>t.asignadoA===m.id&&t.estado!=="completada");const subs=db.subprojects.filter(s=>s.responsableId===m.id);const hs=db.timeLogs.filter(h=>h.memberId===m.id).reduce((a,h)=>a+Number(h.horas||0),0);
    return `<div class="card"><div class="spread"><div class="row"><span class="avatar" style="width:40px;height:40px;font-size:16px">${esc(initials(m.nombre))}</span><div><strong>${esc(m.nombre)}</strong><br><span class="mut small">${esc(m.rol)} · ${esc(m.especialidad||"")}</span></div></div><span class="badge">${m.activo?"Activo":"Inactivo"}</span></div>
    <div class="small mt mut">${esc(m.email||"")} · ${esc(m.telefono||"")} · ${m.costeHora} €/h</div>
    <div class="small mt">🧩 ${subs.length} subproyectos adjudicados · ✔ ${ts.length} tareas abiertas · ⏱ ${hs.toFixed(1)} h</div>
    <div class="progress mt"><i style="width:${clamp(ts.length*12,5,100)}%"></i></div>
    <div class="toolbar"><button class="btn sm" data-edit-m="${m.id}">✏</button><button class="btn sm ghost" data-view-m="${m.id}">Ver tareas</button><button class="btn sm danger" data-del-m="${m.id}">🗑</button></div></div>`;}).join("")}</div>`;
  $("#bNewM").onclick=()=>modalMiembro();
  v.onclick=(e)=>{ const em=e.target.dataset.editM; if(em) modalMiembro(memberById(em)); const dm=e.target.dataset.delM; if(dm){ if(confirm("¿Eliminar miembro? Se desasignarán sus tareas.")){ db.tasks.forEach(t=>{if(t.asignadoA===dm)t.asignadoA=null;}); db.subprojects.forEach(s=>{if(s.responsableId===dm)s.responsableId=null;}); db.members=db.members.filter(m=>m.id!==dm); save(); render(); } } const vm=e.target.dataset.viewM; if(vm){ state.search=memberById(vm)?.nombre||""; $("#globalSearch").value=state.search; nav("kanban"); } };
}

/* ----- Avances ----- */
function vAvances(v){
  const logs=[...db.progressLogs].sort((a,b)=>b.fecha.localeCompare(a.fecha));
  v.innerHTML=`<div class="spread"><div><h1 style="margin:0">Control de avances</h1><p class="mut">Bitácora de % de avance por proyecto, subproyecto o tarea.</p></div><button class="btn primary" id="bNewA">＋ Registrar avance</button></div>
  <div class="card mt"><div class="timeline">${logs.map(a=>`<div class="t-item"><b>${a.porcentaje}%</b> — ${esc(describeRef(a))} <span class="badge">${esc(a.scope)}</span><br><span class="mut small">${fmtDate(a.fecha)} · por ${esc(memberById(a.autorId)?.nombre||"—")}</span><br>${esc(a.descripcion||"")}<br><button class="btn sm danger mt" data-del-a="${a.id}">Eliminar</button></div>`).join("")||`<div class="empty">Sin registros todavía.</div>`}</div></div>`;
  $("#bNewA").onclick=()=>modalAvance("project",state.projectFilter||db.projects[0]?.id);
  v.onclick=(e)=>{ const d=e.target.dataset.delA; if(d){ db.progressLogs=db.progressLogs.filter(a=>a.id!==d); save(); render(); } };
}

/* ----- Informes ----- */
function vInformes(v){
  const k=kpis();
  v.innerHTML=`<div class="spread"><div><h1 style="margin:0">Informes</h1><p class="mut">Resumen ejecutivo para dirección facultativa / administración.</p></div><div class="row"><button class="btn ghost" id="bPrint">🖨 Imprimir / PDF</button><button class="btn ghost" id="bCSV">⬇ CSV tareas</button></div></div>
  <div class="card mt" id="printZone"><h2>Informe de avance — ${fmtDate(todayISO())}</h2>
  <p class="mut">Proyectos: ${db.projects.length} · Tareas: ${db.tasks.length} (${k.comp} completadas, ${k.late} vencidas) · Horas: ${k.horas.toFixed(1)} h · Avance medio: ${k.avanceMedio}%</p>
  ${db.projects.map(p=>`<h3>${esc(p.codigoExpediente)} — ${esc(p.nombre)} (${projectAdvance(p)}%)</h3><p class="small mut">${esc(p.clienteAdministracion||"")} · Resp. ${esc(memberById(p.responsableId)?.nombre||"—")} · ${fmtEUR(p.presupuesto)} · ${fmtDate(p.fechaInicio)} → ${fmtDate(p.fechaFin)} · ${labelEstado(p.estado)}</p>
  <table class="tbl"><thead><tr><th>Subproyecto / Tarea</th><th>Adjudicatario</th><th>Avance</th><th>Horas</th><th>Estado</th></tr></thead><tbody>
  ${db.subprojects.filter(s=>s.projectId===p.id).map(s=>`<tr><td>🧩 <b>${esc(s.nombre)}</b></td><td>${esc(memberById(s.responsableId)?.nombre||"—")}</td><td>${subAdvance(s)}%</td><td>—</td><td>${labelEstado(s.estado)}</td></tr>`).join("")}
  ${tasksOf(p.id).map(t=>`<tr><td style="padding-left:26px">✔ ${esc(t.titulo)}</td><td>${esc(memberById(t.asignadoA)?.nombre||"—")}</td><td>${t.avance||0}%</td><td>${taskHours(t.id).toFixed(1)}/${t.estimadasHoras||0}</td><td>${labelEstado(t.estado)}${isLate(t)?" ⚠":""}</td></tr>`).join("")}
  </tbody></table>`).join("")}</div>`;
  $("#bPrint").onclick=()=>window.print();
  $("#bCSV").onclick=exportCSV;
}

/* ---------- Modales (formularios) ---------- */
function memberOpts(sel){ return `<option value="">— Sin asignar —</option>`+db.members.filter(m=>m.activo).map(m=>`<option value="${m.id}" ${m.id===sel?"selected":""}>${esc(m.nombre)} · ${esc(m.rol)}</option>`).join(""); }
function projectOpts(sel){ return db.projects.map(p=>`<option value="${p.id}" ${p.id===sel?"selected":""}>${esc(p.codigoExpediente+" · "+p.nombre)}</option>`).join(""); }
function subOpts(pid,sel){ return `<option value="">— Directa del proyecto —</option>`+db.subprojects.filter(s=>s.projectId===pid).map(s=>`<option value="${s.id}" ${s.id===sel?"selected":""}>${esc(s.nombre)}</option>`).join(""); }

function modalProyecto(p){
  const e=p||{codigoExpediente:"",nombre:"",descripcion:"",clienteAdministracion:"",presupuesto:100000,fechaInicio:todayISO(),fechaFin:todayISO(),estado:"adjudicado",responsableId:db.members[0]?.id};
  openModal(`<h2>${p?"✏ Editar proyecto":"＋ Nuevo proyecto de obra"}</h2><form id="f"><div class="form-grid">
  <label class="f">Nº expediente<input name="codigoExpediente" required value="${esc(e.codigoExpediente)}" placeholder="2026-OBR-001"></label>
  <label class="f">Administración cliente<input name="clienteAdministracion" value="${esc(e.clienteAdministracion)}" placeholder="Ayto. / Diputación…"></label>
  <label class="f full">Nombre del proyecto<input name="nombre" required value="${esc(e.nombre)}" placeholder="Ej. Reasfaltado…"></label>
  <label class="f full">Descripción<textarea name="descripcion">${esc(e.descripcion)}</textarea></label>
  <label class="f">Presupuesto (€)<input name="presupuesto" type="number" min="0" step="1000" value="${e.presupuesto}"></label>
  <label class="f">Responsable (jefe obra)<select name="responsableId">${memberOpts(e.responsableId)}</select></label>
  <label class="f">Inicio<input name="fechaInicio" type="date" value="${e.fechaInicio||""}"></label>
  <label class="f">Fin previsto<input name="fechaFin" type="date" value="${e.fechaFin||""}"></label>
  <label class="f full">Estado<select name="estado">${["licitacion","adjudicado","en_ejecucion","paralizado","finalizado"].map(x=>`<option ${x===e.estado?"selected":""} value="${x}">${labelEstado(x)}</option>`).join("")}</select></label>
  </div><div class="toolbar"><button class="btn primary" type="submit">Guardar</button><button class="btn ghost" type="button" data-close>Cancelar</button></div></form>`);
  $("#f").onsubmit=(ev)=>{ ev.preventDefault(); const f=new FormData(ev.target); const o=Object.fromEntries(f); o.presupuesto=Number(o.presupuesto||0);
    if(p) Object.assign(p,o); else db.projects.push(Object.assign({id:uid("p"),createdAt:todayISO()},o));
    save(); closeModal(); render(); toast("Proyecto guardado"); };
}
function modalSubproyecto(projectId, s, onlyReassign=false){
  if(!db.projects.length){ toast("Crea primero un proyecto",true); return; }
  const e=s||{projectId:projectId||db.projects[0].id,nombre:"",descripcion:"",responsableId:db.members[0]?.id,presupuesto:50000,fechaInicio:todayISO(),fechaFin:todayISO(),estado:"pendiente",prioridad:"media"};
  openModal(`<h2>${s?(onlyReassign?"🔁 Re-adjudicar subproyecto":"✏ Editar subproyecto"):"＋ Nuevo subproyecto (adjudicable)"}</h2><form id="f"><div class="form-grid">
  <label class="f full">Proyecto<select name="projectId">${projectOpts(e.projectId)}</select></label>
  <label class="f full">Nombre<input name="nombre" required value="${esc(e.nombre)}" placeholder="Ej. SP1 Fresado…"></label>
  <label class="f full">Descripción<textarea name="descripcion">${esc(e.descripcion)}</textarea></label>
  <label class="f">Adjudicatario<select name="responsableId">${memberOpts(e.responsableId)}</select></label>
  <label class="f">Prioridad<select name="prioridad">${["baja","media","alta","critica"].map(x=>`<option ${x===e.prioridad?"selected":""}>${x}</option>`).join("")}</select></label>
  <label class="f">Presupuesto (€)<input name="presupuesto" type="number" min="0" step="1000" value="${e.presupuesto}"></label>
  <label class="f">Estado<select name="estado">${["pendiente","en_curso","en_revision","bloqueada","completada","finalizado"].map(x=>`<option ${x===e.estado?"selected":""} value="${x}">${labelEstado(x)||x}</option>`).join("")}</select></label>
  <label class="f">Inicio<input name="fechaInicio" type="date" value="${e.fechaInicio||""}"></label>
  <label class="f">Fin<input name="fechaFin" type="date" value="${e.fechaFin||""}"></label>
  </div><div class="toolbar"><button class="btn primary" type="submit">Guardar</button><button class="btn ghost" type="button" data-close>Cancelar</button></div></form>`);
  $("#f").onsubmit=(ev)=>{ ev.preventDefault(); const o=Object.fromEntries(new FormData(ev.target)); o.presupuesto=Number(o.presupuesto||0);
    if(s) Object.assign(s,o); else db.subprojects.push(Object.assign({id:uid("s")},o));
    save(); closeModal(); render(); toast("Subproyecto guardado"); };
}
function modalTarea(preset, t){
  if(!db.projects.length){ toast("Crea primero un proyecto",true); return; }
  const e=t||Object.assign({projectId:preset?.projectId||state.projectFilter||db.projects[0].id,subprojectId:preset?.subprojectId||"",titulo:"",descripcion:"",asignadoA:db.members[0]?.id,prioridad:"media",estado:"pendiente",estimadasHoras:8,fechaLimite:todayISO(),avance:0,etiquetas:[]},preset||{});
  openModal(`<h2>${t?"✏ Editar tarea":"＋ Nueva tarea"}</h2><form id="f"><div class="form-grid">
  <label class="f">Proyecto<select name="projectId" id="fPid">${projectOpts(e.projectId)}</select></label>
  <label class="f">Subproyecto<select name="subprojectId" id="fSid">${subOpts(e.projectId,e.subprojectId)}</select></label>
  <label class="f full">Título<input name="titulo" required value="${esc(e.titulo)}"></label>
  <label class="f full">Descripción<textarea name="descripcion">${esc(e.descripcion)}</textarea></label>
  <label class="f">Asignar a<select name="asignadoA">${memberOpts(e.asignadoA)}</select></label>
  <label class="f">Prioridad<select name="prioridad">${["baja","media","alta","critica"].map(x=>`<option ${x===e.prioridad?"selected":""}>${x}</option>`).join("")}</select></label>
  <label class="f">Estado<select name="estado">${["pendiente","en_curso","en_revision","bloqueada","completada"].map(x=>`<option ${x===e.estado?"selected":""} value="${x}">${labelEstado(x)}</option>`).join("")}</select></label>
  <label class="f">Horas estimadas<input name="estimadasHoras" type="number" min="0" step="0.5" value="${e.estimadasHoras}"></label>
  <label class="f">Fecha límite<input name="fechaLimite" type="date" value="${e.fechaLimite||""}"></label>
  <label class="f">Avance %<input name="avance" type="number" min="0" max="100" value="${e.avance||0}"></label>
  <label class="f full">Etiquetas (coma)<input name="etiquetas" value="${esc((e.etiquetas||[]).join(", "))}"></label>
  </div><div class="toolbar"><button class="btn primary" type="submit">Guardar</button><button class="btn ghost" type="button" data-close>Cancelar</button></div></form>`);
  $("#fPid").onchange=(ev)=>{ $("#fSid").innerHTML=subOpts(ev.target.value,""); };
  $("#f").onsubmit=(ev)=>{ ev.preventDefault(); const o=Object.fromEntries(new FormData(ev.target)); o.estimadasHoras=Number(o.estimadasHoras||0); o.avance=clamp(Number(o.avance||0),0,100); o.etiquetas=String(o.etiquetas||"").split(",").map(s=>s.trim()).filter(Boolean); if(o.estado==="completada")o.avance=100;
    if(t) Object.assign(t,o); else db.tasks.push(Object.assign({id:uid("t"),createdAt:todayISO()},o));
    save(); closeModal(); render(); toast("Tarea guardada"); };
}
function modalMiembro(m){
  const e=m||{nombre:"",rol:"Oficial",email:"",telefono:"",especialidad:"",costeHora:24,activo:true};
  openModal(`<h2>${m?"✏ Editar miembro":"＋ Nuevo miembro del equipo"}</h2><form id="f"><div class="form-grid">
  <label class="f">Nombre<input name="nombre" required value="${esc(e.nombre)}"></label>
  <label class="f">Rol<select name="rol">${["Jefa de obra","Encargado","Topógrafa","Técnico PRL","Administrativa","Oficial fontanería","Maquinista","Peón","Dirección facultativa"].map(x=>`<option ${x===e.rol?"selected":""}>${x}</option>`).join("")}</select></label>
  <label class="f">Email<input name="email" value="${esc(e.email)}"></label><label class="f">Teléfono<input name="telefono" value="${esc(e.telefono)}"></label>
  <label class="f">Especialidad<input name="especialidad" value="${esc(e.especialidad)}"></label><label class="f">Coste €/h<input name="costeHora" type="number" min="0" step="0.5" value="${e.costeHora}"></label>
  <label class="f full">Activo<select name="activo"><option value="true" ${e.activo?"selected":""}>Activo</option><option value="false" ${!e.activo?"selected":""}>Inactivo</option></select></label>
  </div><div class="toolbar"><button class="btn primary" type="submit">Guardar</button><button class="btn ghost" type="button" data-close>Cancelar</button></div></form>`);
  $("#f").onsubmit=(ev)=>{ ev.preventDefault(); const o=Object.fromEntries(new FormData(ev.target)); o.costeHora=Number(o.costeHora||0); o.activo=o.activo==="true";
    if(m) Object.assign(m,o); else db.members.push(Object.assign({id:uid("m")},o));
    save(); closeModal(); render(); toast("Miembro guardado"); };
}
function modalHora(taskId){
  const ts=state.projectFilter?db.tasks.filter(t=>t.projectId===state.projectFilter):db.tasks;
  const tid=taskId||ts[0]?.id; if(!tid){ toast("No hay tareas",true); return; }
  openModal(`<h2>⏱ Imputar horas</h2><form id="f"><div class="form-grid">
  <label class="f full">Tarea<select name="taskId">${ts.map(t=>`<option value="${t.id}" ${t.id===tid?"selected":""}>${esc((projectById(t.projectId)?.codigoExpediente||"")+" · "+t.titulo)}</option>`).join("")}</select></label>
  <label class="f">Miembro<select name="memberId">${memberOpts(db.members[0]?.id)}</select></label>
  <label class="f">Fecha<input name="fecha" type="date" value="${todayISO()}"></label>
  <label class="f">Horas<input name="horas" type="number" min="0" step="0.25" value="8"></label>
  <label class="f full">Detalle<input name="descripcion" placeholder="Ej. Extendedora turno noche"></label>
  </div><div class="toolbar"><button class="btn primary" type="submit">Guardar</button><button class="btn ghost" type="button" data-close>Cancelar</button></div></form>`);
  $("#f").onsubmit=(ev)=>{ ev.preventDefault(); const o=Object.fromEntries(new FormData(ev.target)); o.horas=Number(o.horas||0); db.timeLogs.push(Object.assign({id:uid("h")},o)); save(); closeModal(); render(); toast("Horas imputadas"); };
}
function modalAvance(scope, refId){
  openModal(`<h2>📈 Registrar avance (${esc(scope)})</h2><form id="f"><div class="form-grid">
  <label class="f">Ámbito<select name="scope" id="aScope">${["project","subproject","task"].map(x=>`<option ${x===scope?"selected":""}>${x}</option>`).join("")}</select></label>
  <label class="f">Fecha<input name="fecha" type="date" value="${todayISO()}"></label>
  <label class="f full">Elemento<select name="refId" id="aRef"></select></label>
  <label class="f">% avance<input name="porcentaje" type="number" min="0" max="100" value="50"></label>
  <label class="f">Autor<select name="autorId">${memberOpts(db.members[0]?.id)}</select></label>
  <label class="f full">Comentario<textarea name="descripcion" placeholder="Ej. Capa intermedia al 55%, sin incidencias."></textarea></label>
  </div><div class="toolbar"><button class="btn primary" type="submit">Guardar</button><button class="btn ghost" type="button" data-close>Cancelar</button></div></form>`);
  const fill=()=>{ const sc=$("#aScope").value; const opts=sc==="project"?db.projects.map(p=>`<option value="${p.id}">${esc(p.codigoExpediente+" · "+p.nombre)}</option>`):sc==="subproject"?db.subprojects.map(s=>`<option value="${s.id}">${esc(s.nombre)}</option>`):db.tasks.map(t=>`<option value="${t.id}">${esc(t.titulo)}</option>`);
    $("#aRef").innerHTML=opts.join(""); if(refId&&sc===scope){$("#aRef").value=refId;} };
  $("#aScope").onchange=fill; fill();
  $("#f").onsubmit=(ev)=>{ ev.preventDefault(); const o=Object.fromEntries(new FormData(ev.target)); o.porcentaje=clamp(Number(o.porcentaje||0),0,100);
    db.progressLogs.push(Object.assign({id:uid("a")},o));
    if(o.scope==="task"){ const t=tasksById(o.refId); if(t){t.avance=o.porcentaje; if(o.porcentaje===100)t.estado="completada"; else if(t.estado==="completada")t.estado="en_revision";} }
    save(); closeModal(); render(); toast("Avance registrado"); };
}

/* ---------- Export / Import ---------- */
function dl(name, content, type="application/json"){ const b=new Blob([content],{type}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),2000); }
function exportCSV(){
  const rows=[["expediente","proyecto","subproyecto","tarea","asignado","prioridad","estado","avance_pct","estim_h","real_h","limite"]];
  filteredTasks().forEach(t=>rows.push([projectById(t.projectId)?.codigoExpediente||"",`"${(projectById(t.projectId)?.nombre||"").replace(/"/g,"'")}"`,`"${(subById(t.subprojectId)?.nombre||"").replace(/"/g,"'")}"`,`"${t.titulo.replace(/"/g,"'")}"`,memberById(t.asignadoA)?.nombre||"",t.prioridad,t.estado,t.avance,t.estimadasHoras,taskHours(t.id).toFixed(1),t.fechaLimite||""]));
  dl("obragest_tareas.csv",rows.map(r=>r.join(";")).join("\n"),"text/csv"); toast("CSV descargado");
}
function exportHoursCSV(){
  const rows=[["fecha","tarea","miembro","horas","detalle"]];
  db.timeLogs.forEach(h=>rows.push([h.fecha,`"${(tasksById(h.taskId)?.titulo||"").replace(/"/g,"'")}"`,memberById(h.memberId)?.nombre||"",h.horas,`"${(h.descripcion||"").replace(/"/g,"'")}"`]));
  dl("obragest_horas.csv",rows.map(r=>r.join(";")).join("\n"),"text/csv"); toast("CSV de horas descargado");
}

/* ---------- Charts vanilla ---------- */
function drawBars(cv, labels, values){
  if(!cv) return; const ctx=cv.getContext("2d"); const W=cv.width=cv.clientWidth*2||800, H=cv.height=440;
  ctx.clearRect(0,0,W,H); const max=Math.max(1,...values);
  const bw=W/Math.max(1,labels.length);
  values.forEach((v,i)=>{ const h=(H-80)*(v/max); ctx.fillStyle=i%2?"#f5a623":"#3b82f6"; ctx.fillRect(i*bw+20,H-40-h,bw-40,h); ctx.fillStyle="#eaf0f7"; ctx.font="22px sans-serif"; ctx.fillText(String(labels[i]||"").slice(0,10),i*bw+20,H-12); ctx.fillText(Number(v).toFixed(1)+"h",i*bw+20,H-48-h); });
}

/* ---------- Global wiring ---------- */
function init(){
  load();
  $("#year").textContent=new Date().getFullYear();
  $$("#mainNav button").forEach(b=>b.onclick=()=>nav(b.dataset.view));
  $("#btnMenu").onclick=()=>$("#sidebar").classList.toggle("open");
  $("#filterProject").onchange=(e)=>{ state.projectFilter=e.target.value; render(); };
  $("#globalSearch").oninput=(e)=>{ state.search=e.target.value.trim(); if(state.view==="kanban"||state.view==="dashboard") render(); };
  $("#globalSearch").onchange=()=>{ if(state.search) nav("kanban"); };
  $("#btnQuickTask").onclick=()=>modalTarea(state.projectFilter?{projectId:state.projectFilter}:null);
  $("#btnQuickProject").onclick=()=>modalProyecto();
  $("#btnExport").onclick=()=>{ dl("obragest_backup.json",JSON.stringify(db,null,2)); toast("Copia JSON descargada"); };
  $("#btnImport").onclick=()=>$("#fileImport").click();
  $("#fileImport").onchange=(e)=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=()=>{ try{ const o=JSON.parse(r.result); if(!o.projects||!o.tasks) throw 0; db=o; save(); render(); toast("Importación OK"); }catch{ toast("JSON no válido",true); } }; r.readAsText(f); e.target.value=""; };
  $("#btnReset").onclick=()=>{ if(confirm("¿Restablecer datos de demostración?")){ db=seedDB(); state.projectFilter=""; state.search=""; $("#globalSearch").value=""; save(); render(); toast("Demo restablecida"); } };
  render();
}
document.addEventListener("DOMContentLoaded",init);
