const defaultData = {
  courses:[
    {id:1,name:"Excel for Data Analysis",tool:"Excel",provider:"My Course",lessons:"36 lessons",status:"active",link:""},
    {id:2,name:"Power BI Data Analytics",tool:"Power BI",provider:"My Course",lessons:"24 lessons",status:"active",link:""},
    {id:3,name:"SQL for Data Analysis",tool:"SQL",provider:"My Course",lessons:"30 lessons",status:"active",link:""},
    {id:4,name:"Python for Data Analysis",tool:"Python",provider:"My Course",lessons:"40 lessons",status:"active",link:""}
  ],
  datasets:[
    {id:1,name:"Superstore Sales",type:"CSV",description:"Sales, profit, products and customer data for analysis practice.",link:""},
    {id:2,name:"E-commerce Orders",type:"XLSX",description:"Orders dataset for Excel, Power Query and dashboard practice.",link:""}
  ],
  projects:[
    {id:1,name:"Superstore Sales Dashboard",tool:"Power BI",description:"Interactive sales, profit and category performance dashboard.",link:""},
    {id:2,name:"Sales Analysis",tool:"Excel + Power Query",description:"Cleaning, KPIs, pivot tables and management dashboard.",link:""}
  ]
};
let data = JSON.parse(localStorage.getItem("analystHubData")) || defaultData;
let currentModal = "";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
function save(){localStorage.setItem("analystHubData",JSON.stringify(data)); render(); }
const translations = {
  en:{
    brand:"Analyst Hub",workspace:"Learning Workspace",dashboard:"Dashboard",courses:"Courses",datasets:"Datasets",projects:"Projects",
    learningProgress:"Learning progress",darkMode:"Dark mode",workspaceEyebrow:"MY DATA ANALYTICS WORKSPACE",learningSystem:"YOUR LEARNING SYSTEM",
    heroTitle:'Build your path from <span>learning → data → projects.</span>',
    heroText:"Organize your Data Analyst courses, datasets and portfolio projects in one clean workspace.",
    manageCourses:"Manage my courses →",learningResources:"learning resources",practiceFiles:"practice files",portfolioProjects:"portfolio projects",
    coursesCompleted:"courses completed",learningRoadmap:"Learning roadmap",currentCourses:"Your current course collection",viewAll:"View all",
    latestProjects:"Latest projects",portfolioSnapshot:"Portfolio snapshot",learningLibrary:"LEARNING LIBRARY",
    courseIntro:"Save every course with its lessons, provider and learning link.",addCourse:"+ Add course",searchCourses:"Search courses...",
    allStatus:"All status",inProgress:"In progress",completed:"Completed",practiceData:"PRACTICE DATA",
    datasetIntro:"Keep the data files and source links connected to your learning.",addDataset:"+ Add dataset",portfolio:"PORTFOLIO",
    projectIntro:"Document what you build and keep a direct link to the project.",addProject:"+ Add project"
  },
  ar:{
    brand:"مركز محلل البيانات",workspace:"مساحة التعلم",dashboard:"لوحة التحكم",courses:"الكورسات",datasets:"الداتا",projects:"المشاريع",
    learningProgress:"تقدم التعلم",darkMode:"الوضع الداكن",workspaceEyebrow:"مساحة عمل تحليل البيانات",learningSystem:"نظام التعلم الخاص بي",
    heroTitle:'ابني طريقك من <span>التعلم ← الداتا ← المشاريع</span>',
    heroText:"نظّم كورسات تحليل البيانات والداتا والمشاريع الخاصة بالبورتفوليو في مكان واحد.",
    manageCourses:"إدارة الكورسات →",learningResources:"مصادر التعلم",practiceFiles:"ملفات للتدريب",portfolioProjects:"مشاريع البورتفوليو",
    coursesCompleted:"كورسات مكتملة",learningRoadmap:"خريطة التعلم",currentCourses:"مجموعة الكورسات الحالية",viewAll:"عرض الكل",
    latestProjects:"أحدث المشاريع",portfolioSnapshot:"ملخص البورتفوليو",learningLibrary:"مكتبة التعلم",
    courseIntro:"احفظ كل كورس مع الدروس والمدرب ورابط التعلم.",addCourse:"+ إضافة كورس",searchCourses:"ابحث في الكورسات...",
    allStatus:"كل الحالات",inProgress:"قيد التعلم",completed:"مكتمل",practiceData:"بيانات التدريب",
    datasetIntro:"اربط ملفات الداتا ومصادرها بالتعلم الخاص بك.",addDataset:"+ إضافة داتا",portfolio:"البورتفوليو",
    projectIntro:"سجّل المشاريع التي تنفذها وضع رابط مباشر للمشروع.",addProject:"+ إضافة مشروع"
  }
};
let currentLang=localStorage.getItem("analystHubLang")||"en";

function applyLanguage(animate=false){
  const finish=()=>{
    const t=translations[currentLang];
    document.documentElement.lang=currentLang;
    document.documentElement.dir=currentLang==="ar"?"rtl":"ltr";
    document.body.classList.toggle("rtl",currentLang==="ar");
    $$('[data-i18n]').forEach(el=>{ if(t[el.dataset.i18n]!=null) el.innerHTML=t[el.dataset.i18n]; });
    $$('[data-i18n-placeholder]').forEach(el=>{ if(t[el.dataset.i18nPlaceholder]!=null) el.placeholder=t[el.dataset.i18nPlaceholder]; });
    $("#enBtn").classList.toggle("active",currentLang==="en");
    $("#arBtn").classList.toggle("active",currentLang==="ar");
    const active=document.querySelector('.nav-item.active');
    if(active) $("#pageTitle").textContent=t[active.dataset.section] || active.dataset.section;
    render();
    document.body.classList.remove("lang-transition-in");
    requestAnimationFrame(()=>document.body.classList.add("lang-transition-in"));
    setTimeout(()=>document.body.classList.remove("lang-transition-in"),180);
  };
  if(!animate){ finish(); return; }
  document.body.classList.remove("lang-transition-in");
  document.body.classList.add("lang-transition-out");
  setTimeout(()=>{
    finish();
    document.body.classList.remove("lang-transition-out");
  },100);
}

function setLanguage(lang){
  if(lang===currentLang) return;
  currentLang=lang;
  localStorage.setItem("analystHubLang",currentLang);
  applyLanguage(true);
}

$("#enBtn").onclick=()=>setLanguage("en");
$("#arBtn").onclick=()=>setLanguage("ar");

function esc(v=""){return v.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function go(section){
  $$(".section").forEach(x=>x.classList.toggle("active",x.id===section));
  $$(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.section===section));
  if(typeof translations!=="undefined") $("#pageTitle").textContent=translations[currentLang]?.[section] || section[0].toUpperCase()+section.slice(1);
  window.scrollTo({top:0,behavior:"smooth"});
}
function progress(){
  if(!data.courses.length)return 0;
  return Math.round(data.courses.filter(x=>x.status==="done").length/data.courses.length*100);
}
function render(){
  $("#statCourses").textContent=data.courses.length;
  $("#statDatasets").textContent=data.datasets.length;
  $("#statProjects").textContent=data.projects.length;
  $("#statProgress").textContent=progress()+"%";
  $("#sideProgress").textContent=progress()+"%";
  $("#sideProgressBar").style.width=progress()+"%";
  $("#roadmap").innerHTML=data.courses.slice(0,5).map(x=>`<div class="road-item"><div class="road-icon">${esc(x.tool.slice(0,2).toUpperCase())}</div><div><strong>${esc(x.name)}</strong><small>${esc(x.provider)} · ${esc(x.lessons)}</small></div><span class="pill">${x.status==="done"?"Completed":"In progress"}</span></div>`).join("") || `<div class="empty">No courses yet.</div>`;
  $("#latestProjects").innerHTML=data.projects.slice(-4).reverse().map(x=>`<div class="project-mini"><strong>${esc(x.name)}</strong><p>${esc(x.tool)} · ${esc(x.description)}</p></div>`).join("") || `<div class="empty">No projects yet.</div>`;
  renderCourses(); renderDatasets(); renderProjects();
  requestAnimationFrame(setupScrollReveal);
}
function cardActions(type,id){return `<div class="card-actions"><button class="small-btn" onclick="editItem('${type}',${id})">Edit</button><button class="small-btn" onclick="deleteItem('${type}',${id})">Delete</button></div>`}
function renderCourses(){
  const q=($("#courseSearch")?.value||"").toLowerCase(), f=$("#courseFilter")?.value||"all";
  const list=data.courses.filter(x=>(x.name+x.tool+x.provider).toLowerCase().includes(q)&&(f==="all"||x.status===f));
  $("#courseList").innerHTML=list.map(x=>`<article class="item-card"><div class="card-top"><div class="card-icon">${esc(x.tool.slice(0,2).toUpperCase())}</div>${cardActions("courses",x.id)}</div><h3>${esc(x.name)}</h3><p>${esc(x.provider)} · ${esc(x.lessons)}</p><div class="meta"><span class="pill">${x.status==="done"?"Completed":"In progress"}</span>${x.link?`<a class="link" target="_blank" href="${esc(x.link)}">Open course ↗</a>`:""}</div></article>`).join("") || `<div class="empty">No courses match your search.</div>`;
}
function renderDatasets(){
  $("#datasetList").innerHTML=data.datasets.map(x=>`<article class="item-card"><div class="card-top"><div class="card-icon">DB</div>${cardActions("datasets",x.id)}</div><h3>${esc(x.name)}</h3><p>${esc(x.description)}</p><div class="meta"><span>${esc(x.type)}</span>${x.link?`<a class="link" target="_blank" href="${esc(x.link)}">Open data ↗</a>`:""}</div></article>`).join("") || `<div class="empty">No datasets yet.</div>`;
}
function renderProjects(){
  $("#projectList").innerHTML=data.projects.map(x=>`<article class="item-card"><div class="card-top"><div class="card-icon">◆</div>${cardActions("projects",x.id)}</div><h3>${esc(x.name)}</h3><p>${esc(x.description)}</p><div class="meta"><span>${esc(x.tool)}</span>${x.link?`<a class="link" target="_blank" href="${esc(x.link)}">View project ↗</a>`:""}</div></article>`).join("") || `<div class="empty">No projects yet.</div>`;
}
function openModal(type,item=null){
  currentModal=type;
  $("#modalTitle").textContent=(item?"Edit ":"Add ")+type.slice(0,-1);
  const common=(label,name,value,type="text",placeholder="")=>`<div class="form-group"><label>${label}</label><input class="form-control" name="${name}" type="${type}" value="${esc(value||"")}" placeholder="${placeholder}"></div>`;
  let fields="";
  if(type==="courses"){
    fields=common("Course name","name",item?.name,"text","e.g. Advanced Excel for Data Analysis")
      +common("Tool","tool",item?.tool,"text","Excel / Power BI / SQL / Python")
      +common("Provider","provider",item?.provider,"text","Course platform or instructor")
      +common("Lessons / duration","lessons",item?.lessons,"text","e.g. 36 lessons")
      +`<div class="form-group"><label>Status</label><select class="form-control" name="status"><option value="active" ${item?.status!=="done"?"selected":""}>In progress</option><option value="done" ${item?.status==="done"?"selected":""}>Completed</option></select></div>`
      +common("Course link (optional)","link",item?.link,"url","https://...");
  }else if(type==="datasets"){
    fields=common("Dataset name","name",item?.name,"text","e.g. Superstore Sales")
      +common("File type","type",item?.type,"text","CSV / XLSX / SQL")
      +`<div class="form-group"><label>Description</label><textarea class="form-control" name="description" placeholder="What is this data useful for?">${esc(item?.description||"")}</textarea></div>`
      +common("Dataset link (optional)","link",item?.link,"url","Google Drive / GitHub / Kaggle...");
  }else{
    fields=common("Project name","name",item?.name,"text","e.g. Retail Sales Dashboard")
      +common("Tools","tool",item?.tool,"text","Excel / Power BI / SQL...")
      +`<div class="form-group"><label>Description</label><textarea class="form-control" name="description" placeholder="Briefly describe what you built...">${esc(item?.description||"")}</textarea></div>`
      +common("Project link (optional)","link",item?.link,"url","GitHub / Portfolio / Power BI...");
  }
  $("#itemForm").innerHTML=`<div class="form-grid">${fields}<div class="form-actions"><button type="button" class="secondary" id="cancelModal">Cancel</button><button class="primary">Save</button></div></div>`;
  $("#itemForm").dataset.id=item?.id||"";
  $("#modal").classList.add("open");
  $("#cancelModal").onclick=closeModal;
}
function closeModal(){$("#modal").classList.remove("open")}
function submitForm(e){
  e.preventDefault();
  const form=new FormData(e.target), obj=Object.fromEntries(form.entries()), id=Number(e.target.dataset.id);
  const arr=data[currentModal];
  if(id){const i=arr.findIndex(x=>x.id===id);arr[i]={...arr[i],...obj,id}}
  else arr.push({...obj,id:Date.now()});
  closeModal();save();
}
window.editItem=(type,id)=>openModal(type,data[type].find(x=>x.id===id));
window.deleteItem=(type,id)=>{if(confirm("Delete this item?")){data[type]=data[type].filter(x=>x.id!==id);save()}};

$$(".nav-item").forEach(b=>b.onclick=()=>go(b.dataset.section));
$$("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
$("#addCourseBtn").onclick=()=>openModal("courses");
$("#addDatasetBtn").onclick=()=>openModal("datasets");
$("#addProjectBtn").onclick=()=>openModal("projects");
$("#closeModal").onclick=closeModal;
$("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
$("#itemForm").onsubmit=submitForm;
$("#courseSearch").oninput=renderCourses;
$("#courseFilter").onchange=renderCourses;
$("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("analystHubTheme",document.body.classList.contains("dark")?"dark":"light")};
if(localStorage.getItem("analystHubTheme")==="dark")document.body.classList.add("dark");
$("#resetBtn").onclick=()=>{if(confirm("Reset all demo data?")){data=JSON.parse(JSON.stringify(defaultData));save()}};

// Scroll reveal: cards/panels appear softly as they enter the viewport.
function setupScrollReveal(){
  const targets=$$(".hero,.stat-card,.panel,.section-intro,.toolbar,.item-card,.road-item,.project-mini");
  targets.forEach((el,i)=>{
    if(el.classList.contains("reveal-on-scroll")) return;
    el.classList.add("reveal-on-scroll");
    const delay=i%5;
    if(delay) el.classList.add("reveal-delay-"+delay);
  });
  if(!window.IntersectionObserver){targets.forEach(el=>el.classList.add("revealed"));return;}
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("revealed");observer.unobserve(entry.target);}
    });
  },{threshold:.08,rootMargin:"0px 0px -45px 0px"});
  targets.forEach(el=>observer.observe(el));
}

// Initial language + UI render
applyLanguage(false);
setupScrollReveal();
