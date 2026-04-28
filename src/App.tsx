import { useState, useEffect } from "react";

var SK="meitech-v19c",PB="http://pdf.meitech.com.br:9000/file/";
var AR=["","COMPRAS","SOLDA","LASER","TORNO CNC","FRESA CNC","FRESA CONVENCIONAL","CORTE SERRA","FURADEIRA","RETÍFICA","MONTAGEM","ALMOXARIFADO","ALMOXARIFADO SEPARAR P/ MONTAR","EXPEDIÇÃO","PINTURA","TRATAMENTO TÉRMICO"];
var CL0=["CIA MINUANO","HALLMARK","POULTRY","PILGRIM'S","VIBRA","BRF S.A."];
var CO=["#3b82f6","#f59e0b","#10b981","#ef4444","#8b5cf6","#ec4899","#06b6d4","#f97316"];
var DEF_USERS=[{user:"admin",pass:"admin",role:"admin",nome:"Administrador"},{user:"viewer",pass:"viewer",role:"viewer",nome:"Visualização"}];
function U(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function dU(c){return c?PB+c.trim()+".pdf":""}
function dA(s){if(!s)return null;var p=s.split("-");var t=new Date(+p[0],+p[1]-1,+p[2]),n=new Date();n.setHours(0,0,0,0);return Math.round((t-n)/864e5)}
function fD(d){if(!d)return"\u2014";var p=d.split("-");return p[2]+"/"+p[1]+"/"+p[0]}
function hj(){return new Date().toISOString().slice(0,10)}
function nI(){return{id:U(),tipo:"op",rel:"unica",pR:"",op:"",cod:"",qt:"",ar:"",ti:false,tc:"",obs:"",bx:false,dB:"",rB:""}}
function nM(it,items){var fo=0,fd=0;items.forEach(function(f){if(f.rel==="filho"&&(f.pR===it.op||f.pR===it.cod)){if(f.bx)fd++;else fo++}});return fd>0&&fo===0&&!it.bx}

function B(p){var m={red:"bg-red-100 text-red-800 border-red-300",yellow:"bg-yellow-100 text-yellow-800 border-yellow-300",green:"bg-green-100 text-green-800 border-green-300",blue:"bg-blue-100 text-blue-800 border-blue-300",purple:"bg-purple-100 text-purple-800 border-purple-300",orange:"bg-orange-100 text-orange-800 border-orange-300",gray:"bg-gray-200 text-gray-600 border-gray-300",pink:"bg-pink-100 text-pink-800 border-pink-300",teal:"bg-teal-100 text-teal-800 border-teal-300"};return <span className={"text-xs font-bold px-2 py-0.5 rounded-full border inline-block "+(m[p.color]||m.gray)}>{p.children}</span>}
function RB(p){if(p.r==="pai")return <B color="orange">PAI</B>;if(p.r==="filho")return <B color="blue">FILHO</B>;return null}
function DL(p){if(!p.cod)return <span style={{color:"#64748b",fontSize:11}}>{"\u2014"}</span>;return <a href={dU(p.cod)} target="_blank" rel="noopener noreferrer" onClick={p.onClick} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold no-underline border" style={{background:"#eef2ff",color:"#4338ca",borderColor:"#a5b4fc"}}>{"\ud83d\udcc4"}{p.cod}</a>}
function BarC(p){var mx=1;p.data.forEach(function(d){if(d.v>mx)mx=d.v});return <div>{p.data.map(function(d,i){var w=Math.round(d.v/mx*100);return <div key={d.k} className="flex items-center gap-1 mb-1" style={{fontSize:11}}><div className="text-right font-semibold truncate" style={{width:65,color:"#cbd5e1"}}>{d.k}</div><div className="flex-1 rounded" style={{height:18,background:"rgba(255,255,255,.1)"}}><div className="rounded" style={{height:"100%",width:w+"%",background:CO[i%8]}}/></div><div className="font-bold" style={{width:22,fontSize:10,color:"#94a3b8"}}>{d.v}</div></div>})}</div>}

export default function App(){
// Auth
var _au=useState(null),auth=_au[0],sAuth=_au[1];
var _lu=useState(""),lu=_lu[0],sLu=_lu[1];
var _lp=useState(""),lp=_lp[0],sLp=_lp[1];
var _le=useState(""),le=_le[0],sLe=_le[1];
var _um=useState(false),uMgr=_um[0],sUMgr=_um[1];
var _nu=useState({user:"",pass:"",role:"admin",nome:""}),nu=_nu[0],sNu=_nu[1];

function getUsers(){try{var r=localStorage.getItem(SK+"_users");return r?JSON.parse(r):DEF_USERS}catch(e){return DEF_USERS}}
function saveUsers(u){localStorage.setItem(SK+"_users",JSON.stringify(u))}

function doLogin(){var users=getUsers();var found=null;users.forEach(function(u){if(u.user===lu&&u.pass===lp)found=u});if(found){sAuth(found);sLe("");localStorage.setItem(SK+"_session",JSON.stringify(found))}else{sLe("Usuário ou senha inválidos")}}
function doLogout(){sAuth(null);localStorage.removeItem(SK+"_session")}
function addUser(){if(!nu.user||!nu.pass||!nu.nome){msg("Preencha todos os campos",1);return}var users=getUsers();if(users.some(function(u){return u.user===nu.user})){msg("Usuário já existe",1);return}users.push({user:nu.user,pass:nu.pass,role:nu.role,nome:nu.nome});saveUsers(users);sNu({user:"",pass:"",role:"admin",nome:""});msg("Usuário criado!")}
function delUser(uname){var users=getUsers().filter(function(u){return u.user!==uname});saveUsers(users);msg("Removido!");sUMgr(false);sUMgr(true)}

var isAdmin=auth&&auth.role==="admin";
var isView=auth&&auth.role==="viewer";

// App state
var _p=useState([]),pd=_p[0],sPd=_p[1];var _c=useState(CL0),cl=_c[0],sCl=_c[1];var _o=useState([]),ops=_o[0],sOps=_o[1];
var _v=useState("pan"),vw=_v[0],sVw=_v[1];var _e=useState(null),eI=_e[0],sEI=_e[1];
var _f=useState({n:"",pv:"",cl:"",ob:"",po:"",tp:"N",it:[nI()]}),fm=_f[0],sFm=_f[1];
var _fi=useState({s:"ab",q:"",c:""}),fi=_fi[0],sFi=_fi[1];
var _t=useState(null),toast=_t[0],sT=_t[1];var _ex=useState({}),ex=_ex[0],sEx=_ex[1];
var _bs=useState(""),bS=_bs[0],sBS=_bs[1];var _br=useState(""),bR=_br[0],sBR=_br[1];
var _sb=useState({}),sB=_sb[0],sSB=_sb[1];var _dc=useState(null),dC=_dc[0],sDC=_dc[1];
var _pc=useState(null),pC=_pc[0],sPC=_pc[1];
var _as=useState(""),aS=_as[0],sAS=_as[1];var _ar2=useState(""),aR=_ar2[0],sAR=_ar2[1];
var _asb=useState({}),aSB=_asb[0],sASB=_asb[1];
var _em=useState(null),emD=_em[0],sEmD=_em[1];
var _hq=useState(""),hQ=_hq[0],sHQ=_hq[1];
var _hmax=useState(30),hMax=_hmax[0],sHMax=_hmax[1];

function msg(m,e){sT({m:m,e:e});setTimeout(function(){sT(null)},2500)}
function sv(p,c,o){try{localStorage.setItem(SK,JSON.stringify({p:p,c:c||cl,o:o||ops}))}catch(e){}}
function upd(np,nc,no){sPd(np);sv(np,nc,no)}

useEffect(function(){
  try{var sess=localStorage.getItem(SK+"_session");if(sess)sAuth(JSON.parse(sess))}catch(e){}
  try{var r=localStorage.getItem(SK);if(r){var d=JSON.parse(r);var loaded=d.p||[];loaded.forEach(function(p){if(!p.tp)p.tp="N";if(!p.ft)p.ft=false;if(!p.dF)p.dF="";p.it.forEach(function(i){if(typeof i.ti==="undefined")i.ti=false;if(typeof i.tc==="undefined")i.tc="";if(typeof i.rel==="undefined")i.rel="unica";if(typeof i.pR==="undefined")i.pR=""})});sPd(loaded);if(d.c&&d.c.length)sCl(d.c);if(d.o&&d.o.length)sOps(d.o)}}catch(e){}},[]);

function oFm(p){if(isView)return;if(p){sFm({n:p.n,pv:p.pv,cl:p.cl,ob:p.ob,po:p.po||"",tp:p.tp||"N",it:p.it.map(function(i){return Object.assign({},i)})});sEI(p.id)}else{sFm({n:"",pv:"",cl:"",ob:"",po:"",tp:"N",it:[nI()]});sEI(null)}sVw("frm")}
function aI(){sFm(function(f){return Object.assign({},f,{it:f.it.concat([nI()])})})}
function dI(s){sFm(function(f){return Object.assign({},f,{it:f.it.concat([Object.assign({},s,{id:U(),bx:false,dB:"",rB:"",rel:"filho",pR:s.op||s.cod,cod:"",op:""})])})})}
function rI(id){sFm(function(f){return Object.assign({},f,{it:f.it.filter(function(i){return i.id!==id})})})}
function uI(id,k,v){sFm(function(f){return Object.assign({},f,{it:f.it.map(function(i){if(i.id===id){var c=Object.assign({},i);c[k]=v;return c}return i})})})}
function saveFm(){if(!fm.n){msg("Preencha pedido",1);return}var fn=null;if(eI)pd.forEach(function(p){if(p.id===eI)fn=p});var p={id:eI||U(),n:fm.n,pv:fm.pv,cl:fm.cl,ob:fm.ob,po:fm.po,tp:fm.tp,it:fm.it,ft:fn?fn.ft:false,dF:fn?fn.dF:"",ct:fn?fn.ct:new Date().toISOString()};var np=eI?pd.map(function(x){return x.id===eI?p:x}):pd.concat([p]);var nc=cl;if(fm.cl&&cl.indexOf(fm.cl)<0){nc=cl.concat([fm.cl]);sCl(nc)}var no=ops;if(fm.po&&ops.indexOf(fm.po)<0){no=ops.concat([fm.po]);sOps(no)}upd(np,nc,no);msg(eI?"Atualizado!":"Cadastrado!");sVw("pan");sEI(null)}
function delP(id){if(isView)return;upd(pd.filter(function(p){return p.id!==id}));sDC(null);msg("Removido!")}
function doBx(){if(isView)return;var sl=[];Object.keys(sB).forEach(function(k){if(sB[k])sl.push(k)});if(!sl.length){msg("Selecione",1);return}if(!bR.trim()){msg("Responsável?",1);return}var td=hj(),rp=bR.trim();var np=pd.map(function(p){return Object.assign({},p,{it:p.it.map(function(i){return sl.indexOf(i.id)>-1?Object.assign({},i,{bx:true,dB:td,rB:rp}):i})})});var no=ops;if(ops.indexOf(rp)<0){no=ops.concat([rp]);sOps(no)}upd(np,cl,no);sSB({});msg("Baixa ok!")}
function uBx(id){if(isView)return;var np=pd.map(function(p){return Object.assign({},p,{it:p.it.map(function(i){return i.id===id?Object.assign({},i,{bx:false,dB:"",rB:""}):i})})});upd(np);msg("Revertido!")}
function doAlmBx(){if(isView)return;var sl=[];Object.keys(aSB).forEach(function(k){if(aSB[k])sl.push(k)});if(!sl.length){msg("Selecione",1);return}if(!aR.trim()){msg("Responsável?",1);return}var td=hj(),rp=aR.trim();var np=pd.map(function(p){return Object.assign({},p,{it:p.it.map(function(i){return sl.indexOf(i.id)>-1?Object.assign({},i,{bx:true,dB:td,rB:rp}):i})})});var no=ops;if(ops.indexOf(rp)<0){no=ops.concat([rp]);sOps(no)}upd(np,cl,no);sASB({});msg("Separado!")}
function fatP(id){if(isView)return;var np=pd.map(function(p){return p.id===id?Object.assign({},p,{ft:true,dF:hj()}):p});upd(np);msg("Faturado!")}
function uFat(id){if(isView)return;var np=pd.map(function(p){return p.id===id?Object.assign({},p,{ft:false,dF:""}):p});upd(np);msg("Revertido!")}

// COMPUTED
var all=[];pd.forEach(function(p){p.it.forEach(function(i){all.push(Object.assign({},i,{pn:p.n,pp:p.pv,pc:p.cl,pr:p.po,pi:p.id,pt:p.tp,pft:p.ft,pdF:p.dF}))})});
var opn=all.filter(function(i){return !i.bx}),cld=all.filter(function(i){return i.bx});
var alm=all.filter(function(i){return i.tipo==="almoxarifado"});
var tiItems=all.filter(function(i){return i.ti});
var tercItems=opn.filter(function(i){return i.tc&&i.tc.trim()});
var pedAbertos=pd.filter(function(p){return !p.ft&&p.it.some(function(i){return !i.bx})});
var pedAtr=pd.filter(function(p){var d=dA(p.pv);return d!==null&&d<0&&!p.ft&&p.it.some(function(i){return !i.bx})});
var ped7=pd.filter(function(p){var d=dA(p.pv);return d!==null&&d>=0&&d<=7&&!p.ft&&p.it.some(function(i){return !i.bx})});
var pedAlm=pd.filter(function(p){return !p.ft&&p.it.some(function(i){return i.tipo==="almoxarifado"&&!i.bx})});
var pedTI=pd.filter(function(p){return !p.ft&&p.it.some(function(i){return i.ti&&!i.bx})});
var pFt=pd.filter(function(p){return p.ft});
var rdy=pd.filter(function(p){return !p.ft&&p.it.length>0&&p.it.every(function(i){return i.bx})});
var pedFP=pFt.filter(function(p){return p.pv&&p.dF});
var pedOT=pedFP.filter(function(p){return p.dF<=p.pv});
var otd=pedFP.length?Math.round(pedOT.length/pedFP.length*100):0;
var oc=otd>=80?"#22c55e":otd>=50?"#eab308":"#ef4444";
var mont=all.filter(function(i){return i.rel==="pai"&&!i.bx&&nM(i,all)});
var byCl={};pedAbertos.forEach(function(p){var k=p.cl||"?";byCl[k]=(byCl[k]||0)+1});
var byAr={};opn.forEach(function(i){var k=i.ar||"?";byAr[k]=(byAr[k]||0)+1});
var cData=Object.keys(byCl).sort(function(a,b){return byCl[b]-byCl[a]}).slice(0,6).map(function(k){return{k:k,v:byCl[k]}});
var aData=Object.keys(byAr).sort(function(a,b){return byAr[b]-byAr[a]}).slice(0,6).map(function(k){return{k:k,v:byAr[k]}});
var bF=opn.filter(function(i){if(!bS)return true;var s=bS.toLowerCase();return[i.pn,i.op,i.cod,i.pc,i.ar].some(function(v){return(v||"").toLowerCase().indexOf(s)>-1})});
var almFilt=(alm.filter(function(i){return !i.bx})).filter(function(i){if(!aS)return true;var s=aS.toLowerCase();return[i.pn,i.cod,i.pc].some(function(v){return(v||"").toLowerCase().indexOf(s)>-1})});
var fP=pd.filter(function(p){if(fi.s==="ab"&&(!p.it.some(function(i){return !i.bx})||p.ft))return false;if(fi.s==="bx"&&!p.it.some(function(i){return i.bx}))return false;if(fi.c&&p.cl!==fi.c)return false;if(fi.q){var s=fi.q.toLowerCase(),fl=[p.n,p.cl,p.ob,p.po];p.it.forEach(function(i){fl.push(i.cod,i.op)});return fl.some(function(v){return(v||"").toLowerCase().indexOf(s)>-1})}return true});

// Duplicatas: mesma peça (cod) em ordens diferentes
var dupMap={};opn.forEach(function(i){if(!i.cod)return;if(!dupMap[i.cod])dupMap[i.cod]=[];dupMap[i.cod].push(i)});
var dups=[];Object.keys(dupMap).forEach(function(k){if(dupMap[k].length>1){var peds={};dupMap[k].forEach(function(i){peds[i.pn]=true});if(Object.keys(peds).length>1)dups.push({cod:k,items:dupMap[k],pedidos:Object.keys(peds)})}});

// Histórico completo com filtro
var hFilt=cld.filter(function(i){if(!hQ)return true;var s=hQ.toLowerCase();return[i.pn,i.op,i.cod,i.pc,i.rB].some(function(v){return(v||"").toLowerCase().indexOf(s)>-1})}).sort(function(a,b){return(b.dB||"").localeCompare(a.dB||"")});

function sendEml(){var at=[],pr=[];pd.forEach(function(p){var d=dA(p.pv),ab=p.it.filter(function(i){return !i.bx}).length;if(!ab||p.ft)return;if(d!==null&&d<0)at.push("Ped "+p.n+" | "+p.cl+" | "+fD(p.pv)+" | "+ab+" OPs | "+d+"d atraso");if(d!==null&&d>=0&&d<=7)pr.push("Ped "+p.n+" | "+p.cl+" | "+fD(p.pv)+" | "+ab+" OPs | "+d+"d restante")});var lines=["MEITECH \u2014 ALERTA DE PEDIDOS","","Data: "+new Date().toLocaleString("pt-BR"),""];if(at.length){lines.push("\u2550\u2550 PEDIDOS EM ATRASO ("+at.length+") \u2550\u2550");at.forEach(function(l){lines.push("  "+l)});lines.push("")}if(pr.length){lines.push("\u2550\u2550 PR\u00d3XIMOS AO VENCIMENTO ("+pr.length+") \u2550\u2550");pr.forEach(function(l){lines.push("  "+l)});lines.push("")}lines.push("OTD atual: "+otd+"%");lines.push("");lines.push("---");lines.push("Meitech \u2014 Controle de Produ\u00e7\u00e3o");sEmD({subj:"Meitech \u2014 Alerta de Pedidos",body:lines.join("\n"),atLen:at.length,prLen:pr.length})}
function genRpt(){var h=[];h.push("<html><head><meta charset='utf-8'><title>Relatorio</title><style>body{font-family:Arial;margin:20px;font-size:11px;background:#0f172a;color:#e2e8f0}table{width:100%;border-collapse:collapse}th{background:#1e3a5f;color:#94a3b8;padding:6px 8px;text-align:left;font-size:10px}td{padding:5px 8px;border-bottom:1px solid #1e293b}.a{color:#f87171;font-weight:bold}@media print{.nb{display:none}body{background:#fff;color:#000}th{background:#1a56db;color:#fff}td{border-color:#ddd}}</style></head><body><h1>MEITECH - Ordens Abertas</h1><p>"+new Date().toLocaleString("pt-BR")+" | "+pedAbertos.length+" pedidos | "+opn.length+" OPs | OTD:"+otd+"%</p><button class=nb onclick='window.print()'>Imprimir</button><table><tr><th>PED</th><th>TP</th><th>OP</th><th>COD</th><th>TERC</th><th>TI</th><th>QTD</th><th>AREA</th><th>CLI</th><th>PREV</th><th>ATRASO</th></tr>");opn.forEach(function(i){var d=dA(i.pp),ac=d!==null&&d<0?' class="a"':"";h.push("<tr><td>"+i.pn+"</td><td>"+(i.pt==="E"?"EXT":"NAC")+"</td><td>"+(i.op||"-")+"</td><td><b>"+i.cod+"</b></td><td>"+(i.tc||"-")+"</td><td>"+(i.ti?"SIM":"-")+"</td><td>"+i.qt+"</td><td>"+i.ar+"</td><td>"+i.pc+"</td><td>"+fD(i.pp)+"</td><td"+ac+">"+(d!==null?d+"d":"-")+"</td></tr>")});h.push("</table></body></html>");var blob=new Blob([h.join("")],{type:"text/html"});var url=URL.createObjectURL(blob);var a=document.createElement("a");a.href=url;a.download="meitech-relatorio-"+hj()+".html";document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);msg("Relatório baixado!")}

var tabs=[["pan","Painel"],["lst","Lista"],["bxa","Baixa"],["fat","Faturamento"],["alm","Almoxarifado"],["ti","T.I."]];
var inp="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded-lg px-3 py-2 text-sm outline-none placeholder-gray-500 focus:border-blue-500";
var th0="px-3 py-2.5 text-left text-xs font-bold text-gray-400 border-b border-gray-700";

// ===== LOGIN SCREEN =====
if(!auth)return(
<div className="min-h-screen flex items-center justify-center" style={{background:"linear-gradient(135deg,#0f172a,#1e293b)",fontFamily:"Inter,system-ui,sans-serif"}}>
<div className="rounded-2xl p-8 w-full max-w-sm" style={{background:"#1e293b",border:"1px solid #334155",boxShadow:"0 20px 60px rgba(0,0,0,.5)"}}>
<div className="flex items-center justify-center gap-3 mb-6"><div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg" style={{background:"linear-gradient(135deg,#2563eb,#7c3aed)"}}>M</div><div><div className="text-xl font-black text-white tracking-wide">MEITECH</div><div className="text-xs" style={{color:"#64748b"}}>Controle de Produção</div></div></div>
{le&&<div className="text-xs text-red-400 text-center mb-3 p-2 rounded-lg" style={{background:"rgba(239,68,68,.1)"}}>{le}</div>}
<div className="mb-3"><label className="block text-xs font-bold mb-1" style={{color:"#64748b"}}>USUÁRIO</label><input className={inp} value={lu} onChange={function(e){sLu(e.target.value)}} placeholder="admin" onKeyDown={function(e){if(e.key==="Enter")doLogin()}}/></div>
<div className="mb-5"><label className="block text-xs font-bold mb-1" style={{color:"#64748b"}}>SENHA</label><input type="password" className={inp} value={lp} onChange={function(e){sLp(e.target.value)}} placeholder="\u2022\u2022\u2022\u2022" onKeyDown={function(e){if(e.key==="Enter")doLogin()}}/></div>
<button onClick={doLogin} className="w-full py-3 rounded-xl text-sm font-bold cursor-pointer border-none text-white" style={{background:"linear-gradient(135deg,#2563eb,#7c3aed)"}}>Entrar</button>
<div className="text-xs text-center mt-4" style={{color:"#475569"}}>admin/admin (total) | viewer/viewer (visualização)</div>
</div></div>);

function renderPedCard(p){
  var d=dA(p.pv),at=d!==null&&d<0,oI=p.it.filter(function(i){return !i.bx}),dI2=p.it.filter(function(i){return i.bx});
  var hasTerc=oI.some(function(i){return i.tc&&i.tc.trim()});
  var pais=oI.filter(function(i){return i.rel==="pai"}),flh=oI.filter(function(i){return i.rel==="filho"}),uni=oI.filter(function(i){return !i.rel||i.rel==="unica"});
  function cI(it,bg,ind){
    var mt2=it.rel==="pai"&&nM(it,p.it);var isTerc=it.tc&&it.tc.trim();
    return <div key={it.id} className="flex items-center gap-2 p-2 rounded-lg mb-1 border" style={{marginLeft:ind?16:0,background:isTerc?"#fdf4ff":bg,borderColor:isTerc?"#e879f9":"#334155"}}>
      <DL cod={it.cod} onClick={function(e){e.preventDefault();if(it.cod)sPC(it.cod)}}/>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <RB r={it.rel}/>{mt2&&<B color="red">MONTAR!</B>}
          {it.tipo==="op"&&it.op&&<span className="text-xs font-bold" style={{color:"#60a5fa"}}>OP {it.op}</span>}
          {it.ti&&<B color="teal">T.I.</B>}
          {isTerc&&<span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:"#a855f7",color:"#fff"}}>{"\u26a1"} {it.tc}</span>}
        </div>
        <div className="text-xs" style={{color:"#94a3b8"}}>{it.ar}{it.qt&&" | Qtd: "+it.qt}</div>
      </div>
    </div>
  }
  return <div key={p.id} className="rounded-2xl overflow-hidden border-2 hover:shadow-xl hover:shadow-blue-900" style={{background:"#1e293b",borderColor:at?"#f87171":hasTerc?"#a855f7":"#334155"}}>
    <div className="px-4 py-3 flex items-center justify-between" style={{background:at?"linear-gradient(135deg,#7f1d1d,#1e293b)":hasTerc?"linear-gradient(135deg,#581c87,#1e293b)":"linear-gradient(135deg,#1e3a5f,#1e293b)",borderBottom:"1px solid "+(at?"#991b1b":"#334155")}}>
      <div>
        <div className="flex items-center gap-2 flex-wrap"><span className="text-base font-black text-white">#{p.n}</span>{p.tp==="E"?<B color="blue">EXT</B>:<B color="gray">NAC</B>}{d!==null&&(at?<B color="red">{d+"d"}</B>:d<=7?<B color="yellow">{d+"d"}</B>:<B color="green">{d+"d"}</B>)}{hasTerc&&<span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:"#a855f7",color:"#fff"}}>{"\u26a1"} TERC</span>}</div>
        <div className="text-xs mt-0.5" style={{color:"#94a3b8"}}>{p.cl&&<b className="text-gray-300 mr-2">{p.cl}</b>}{p.po&&<span>por {p.po} </span>}{p.pv&&fD(p.pv)}</div>
      </div>
      {isAdmin&&<div className="flex gap-1"><button onClick={function(){oFm(p)}} className="w-7 h-7 rounded-lg border-none cursor-pointer text-sm" style={{background:"rgba(255,255,255,.1)",color:"#94a3b8"}}>{"\u270e"}</button><button onClick={function(){sDC(p)}} className="w-7 h-7 rounded-lg border-none cursor-pointer text-sm" style={{background:"rgba(239,68,68,.2)",color:"#f87171"}}>{"\u2715"}</button></div>}
    </div>
    <div className="p-3">
      <div className="text-xs font-bold mb-2" style={{color:"#64748b"}}>{oI.length} OP aberta{dI2.length>0&&<span style={{color:"#22c55e"}}> | {dI2.length} ok</span>}</div>
      {pais.map(function(it){var fdi=flh.filter(function(f){return f.pR===it.op||f.pR===it.cod});return <div key={it.id}>{cI(it,"#1e293b",false)}{fdi.map(function(f){return cI(f,"#1e293b",true)})}</div>})}
      {flh.filter(function(f){return !pais.some(function(x){return x.op===f.pR||x.cod===f.pR})}).map(function(f){return cI(f,"#1e293b",true)})}
      {uni.map(function(it){return cI(it,"#1e293b",false)})}
    </div>
  </div>
}

return(
<div className="min-h-screen" style={{background:"linear-gradient(180deg,#0f172a 0%,#1e293b 100%)",fontFamily:"Inter,system-ui,sans-serif",color:"#e2e8f0"}}>
{toast&&<div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold" style={{background:toast.e?"#dc2626":"#16a34a"}}>{toast.m}</div>}
{dC&&<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,.7)"}}><div className="rounded-2xl p-6 max-w-sm w-full" style={{background:"#1e293b",border:"1px solid #334155"}}><p className="font-bold text-lg mb-1 text-white">Excluir #{dC.n}?</p><p className="text-sm mb-4" style={{color:"#94a3b8"}}>Irreversível.</p><div className="flex gap-3"><button onClick={function(){sDC(null)}} className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer" style={{background:"#334155",color:"#94a3b8",border:"none"}}>Cancelar</button><button onClick={function(){delP(dC.id)}} className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-none" style={{background:"#dc2626",color:"#fff"}}>Excluir</button></div></div></div>}
{pC&&<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,.7)"}} onClick={function(){sPC(null)}}><div className="rounded-2xl overflow-hidden" style={{width:"90%",maxWidth:800,height:"85vh",background:"#1e293b",border:"1px solid #334155"}} onClick={function(e){e.stopPropagation()}}><div className="flex justify-between items-center px-5 py-3" style={{borderBottom:"1px solid #334155"}}><strong className="text-white">{pC}.pdf</strong><button onClick={function(){sPC(null)}} className="w-8 h-8 rounded-lg border-none cursor-pointer text-lg" style={{background:"#334155",color:"#94a3b8"}}>{"\u00d7"}</button></div><iframe src={dU(pC)} className="w-full" style={{height:"calc(100% - 52px)",border:"none",background:"#fff"}}/></div></div>}
{emD&&<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,.7)"}} onClick={function(){sEmD(null)}}><div className="rounded-2xl w-full max-w-lg" style={{background:"#1e293b",border:"1px solid #334155"}} onClick={function(e){e.stopPropagation()}}><div className="px-5 py-4 flex items-center justify-between" style={{borderBottom:"1px solid #334155",background:"rgba(234,179,8,.08)"}}><div className="flex items-center gap-2"><span style={{fontSize:20}}>{"\u2709\ufe0f"}</span><span className="font-bold text-white">Email de Alerta</span></div><button onClick={function(){sEmD(null)}} className="w-8 h-8 rounded-lg border-none cursor-pointer text-lg" style={{background:"#334155",color:"#94a3b8"}}>{"\u00d7"}</button></div><div className="p-5"><div className="mb-3"><label className="block text-xs font-bold mb-1" style={{color:"#64748b"}}>ASSUNTO</label><div className="rounded-lg px-3 py-2 text-sm font-semibold" style={{background:"#0f172a",color:"#fbbf24",border:"1px solid #334155"}}>{emD.subj}</div></div><div className="mb-4"><label className="block text-xs font-bold mb-1" style={{color:"#64748b"}}>CONTEÚDO — selecione e copie (Ctrl+C)</label><textarea id="emailBody" readOnly value={emD.body} className="w-full rounded-lg px-3 py-3 text-sm outline-none" style={{background:"#0f172a",color:"#e2e8f0",border:"1px solid #334155",fontFamily:"monospace",minHeight:200,resize:"vertical"}} onFocus={function(e){e.target.select()}}/></div><div className="flex items-center gap-2 text-xs mb-4" style={{color:"#64748b"}}>{emD.atLen>0&&<span className="px-2 py-1 rounded-full" style={{background:"rgba(239,68,68,.15)",color:"#f87171"}}>{emD.atLen} atrasado(s)</span>}{emD.prLen>0&&<span className="px-2 py-1 rounded-full" style={{background:"rgba(234,179,8,.15)",color:"#fbbf24"}}>{emD.prLen} vencendo</span>}</div><button onClick={function(){var el=document.getElementById("emailBody");if(el){el.focus();el.select();msg("Texto selecionado \u2014 Ctrl+C")}}} className="w-full py-2.5 rounded-xl text-sm font-bold cursor-pointer border-none" style={{background:"linear-gradient(135deg,#2563eb,#7c3aed)",color:"#fff"}}>Selecionar Tudo</button></div></div></div>}
{uMgr&&<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,.7)"}} onClick={function(){sUMgr(false)}}><div className="rounded-2xl w-full max-w-md" style={{background:"#1e293b",border:"1px solid #334155"}} onClick={function(e){e.stopPropagation()}}><div className="px-5 py-4 flex justify-between items-center" style={{borderBottom:"1px solid #334155"}}><span className="font-bold text-white">Gerenciar Usuários</span><button onClick={function(){sUMgr(false)}} className="w-8 h-8 rounded-lg border-none cursor-pointer text-lg" style={{background:"#334155",color:"#94a3b8"}}>{"\u00d7"}</button></div><div className="p-5"><div className="mb-4"><div className="text-xs font-bold mb-2" style={{color:"#64748b"}}>USUÁRIOS CADASTRADOS</div>{getUsers().map(function(u){return <div key={u.user} className="flex items-center justify-between py-2 px-3 mb-1 rounded-lg" style={{background:"#0f172a"}}><div><span className="text-sm font-bold text-white">{u.nome}</span><span className="text-xs ml-2" style={{color:"#64748b"}}>@{u.user}</span><span className="ml-2">{u.role==="admin"?<B color="blue">Admin</B>:<B color="gray">Viewer</B>}</span></div>{u.user!=="admin"&&<button onClick={function(){delUser(u.user)}} className="text-xs font-bold px-2 py-1 rounded cursor-pointer border-none" style={{background:"rgba(239,68,68,.15)",color:"#f87171"}}>Remover</button>}</div>})}</div><div className="text-xs font-bold mb-2" style={{color:"#64748b"}}>NOVO USUÁRIO</div><div className="grid grid-cols-2 gap-2 mb-3"><input className={inp} placeholder="Login" value={nu.user} onChange={function(e){sNu(Object.assign({},nu,{user:e.target.value}))}}/><input className={inp} placeholder="Senha" value={nu.pass} onChange={function(e){sNu(Object.assign({},nu,{pass:e.target.value}))}}/><input className={inp} placeholder="Nome completo" value={nu.nome} onChange={function(e){sNu(Object.assign({},nu,{nome:e.target.value}))}}/><select className={inp} value={nu.role} onChange={function(e){sNu(Object.assign({},nu,{role:e.target.value}))}}><option value="admin">Admin (total)</option><option value="viewer">Viewer (visualização)</option></select></div><button onClick={addUser} className="w-full py-2 rounded-xl text-sm font-bold cursor-pointer border-none" style={{background:"#16a34a",color:"#fff"}}>Criar Usuário</button></div></div></div>}

<header style={{background:"linear-gradient(90deg,#0f172a,#1e293b)",borderBottom:"1px solid #334155",position:"sticky",top:0,zIndex:30}}><div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
<div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{background:"linear-gradient(135deg,#2563eb,#7c3aed)"}}>M</div><span className="text-lg font-black text-white tracking-wide">MEITECH</span><span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{color:"#64748b",background:"#1e293b",border:"1px solid #334155"}}>PRODUÇÃO</span></div>
<div className="flex gap-1.5 flex-wrap items-center">
{tabs.map(function(a){return <button key={a[0]} onClick={function(){sVw(a[0])}} className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-none" style={{background:vw===a[0]?"#3b82f6":"rgba(255,255,255,.05)",color:vw===a[0]?"#fff":"#94a3b8"}}>{a[1]}</button>})}
<button onClick={sendEml} className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-none" style={{background:"rgba(234,179,8,.15)",color:"#fbbf24"}}>Email</button>
<button onClick={genRpt} className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-none" style={{background:"rgba(255,255,255,.05)",color:"#94a3b8"}}>Relatório</button>
{isAdmin&&<button onClick={function(){oFm(null)}} className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-none shadow-lg" style={{background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff"}}>+ Novo</button>}
<div className="flex items-center gap-2 ml-2 pl-2" style={{borderLeft:"1px solid #334155"}}>
<span className="text-xs" style={{color:"#64748b"}}>{auth.nome}</span>
{isAdmin&&<button onClick={function(){sUMgr(true)}} className="px-2 py-1 rounded text-xs font-bold cursor-pointer border-none" style={{background:"rgba(255,255,255,.05)",color:"#94a3b8"}}>{"\u2699"}</button>}
<button onClick={doLogout} className="px-2 py-1 rounded text-xs font-bold cursor-pointer border-none" style={{background:"rgba(239,68,68,.1)",color:"#f87171"}}>Sair</button>
</div>
</div></div></header>

<div className="max-w-7xl mx-auto px-4 py-5">

{/* PAINEL */}
{vw==="pan"&&<div>
<div className="grid grid-cols-5 gap-3 mb-5">{[["PEDIDOS ABERTOS",pedAbertos.length,"#3b82f6","rgba(59,130,246,.15)"],["ATRASADOS",pedAtr.length,"#ef4444","rgba(239,68,68,.15)"],["VENCE 7d",ped7.length,"#eab308","rgba(234,179,8,.12)"],["ALMOX PEND.",pedAlm.length,"#a855f7","rgba(168,85,247,.12)"],["T.I. PEND.",pedTI.length,"#14b8a6","rgba(20,184,166,.12)"]].map(function(s){return <div key={s[0]} className="rounded-2xl p-4" style={{background:s[3],border:"1px solid "+s[2]+"33"}}><div className="text-xs font-bold" style={{color:s[2],opacity:.8}}>{s[0]}</div><div style={{fontSize:32,fontWeight:900,color:s[2],lineHeight:1.1,marginTop:4}}>{s[1]}</div><div className="text-xs mt-1" style={{color:"#64748b"}}>pedidos</div></div>})}</div>

{tercItems.length>0&&<div className="rounded-2xl p-4 mb-5" style={{background:"linear-gradient(135deg,rgba(168,85,247,.15),rgba(236,72,153,.1))",border:"1px solid #a855f733"}}><div className="text-xs font-bold mb-3" style={{color:"#c084fc"}}>{"\u26a1"} TERCEIRIZADO — PRIORIDADE ({tercItems.length} OPs)</div><div className="grid grid-cols-2 gap-2" style={{maxHeight:80,overflowY:"auto"}}>{tercItems.slice(0,8).map(function(i){return <div key={i.id} className="flex items-center gap-2 text-xs rounded-lg p-2" style={{background:"rgba(0,0,0,.2)"}}><b className="text-white">Ped {i.pn}</b><span className="font-mono font-bold" style={{color:"#c084fc"}}>{i.cod}</span><span className="font-bold px-1.5 py-0.5 rounded-full" style={{background:"#a855f7",color:"#fff",fontSize:10}}>{i.tc}</span></div>})}</div></div>}

{dups.length>0&&<div className="rounded-2xl p-4 mb-5" style={{background:"rgba(234,179,8,.08)",border:"1px solid rgba(234,179,8,.25)"}}><div className="text-xs font-bold mb-3" style={{color:"#fbbf24"}}>{"\ud83d\udd04"} PEÇAS DUPLICADAS EM PEDIDOS DIFERENTES ({dups.length})</div><div className="space-y-2 max-h-28 overflow-y-auto">{dups.map(function(d){return <div key={d.cod} className="flex items-center gap-3 text-xs rounded-lg p-2" style={{background:"rgba(0,0,0,.2)"}}><span className="font-mono font-bold" style={{color:"#fbbf24"}}>{d.cod}</span><span style={{color:"#94a3b8"}}>{d.items.length}x em pedidos:</span>{d.pedidos.map(function(pn){return <span key={pn} className="font-bold px-1.5 py-0.5 rounded" style={{background:"rgba(234,179,8,.15)",color:"#fbbf24"}}>#{pn}</span>})}<span style={{color:"#64748b"}}>\u2192 Agrupar?</span></div>})}</div></div>}

<div className="grid grid-cols-3 gap-4 mb-5">
<div className="rounded-2xl p-5" style={{background:"#1e293b",border:"1px solid #334155"}}><div className="text-xs font-bold tracking-wider mb-3" style={{color:"#64748b"}}>OTD</div><div className="flex items-end gap-3 mb-3"><span style={{fontSize:42,fontWeight:900,color:oc,lineHeight:1}}>{otd}%</span><span className="text-xs mb-1" style={{color:"#64748b"}}>{pedOT.length}/{pedFP.length} no prazo</span></div><div className="w-full rounded-full overflow-hidden" style={{height:10,background:"#334155"}}><div className="rounded-full" style={{height:"100%",width:otd+"%",background:oc}}/></div></div>
{mont.length>0?<div className="rounded-2xl p-5" style={{background:"rgba(249,115,22,.08)",border:"1px solid #f97316aa"}}><div className="text-xs font-bold tracking-wider mb-3" style={{color:"#fb923c"}}>MONTAGEM ({mont.length})</div><div className="space-y-2 max-h-32 overflow-y-auto">{mont.map(function(i){return <div key={i.id} className="flex items-center gap-2 text-xs rounded-lg p-2" style={{background:"rgba(0,0,0,.2)"}}><B color="red">MONTAR</B><b className="text-white">Ped {i.pn}</b><span className="font-mono font-bold" style={{color:"#fb923c"}}>{i.cod}</span></div>})}</div></div>:<div className="rounded-2xl p-5" style={{background:"#1e293b",border:"1px solid #334155"}}><div className="text-xs font-bold tracking-wider mb-2" style={{color:"#64748b"}}>MONTAGEM</div><div className="text-sm" style={{color:"#475569",marginTop:16}}>Nenhuma</div></div>}
<div className="rounded-2xl p-5" style={{background:"#1e293b",border:"1px solid #334155"}}><div className="text-xs font-bold tracking-wider mb-3" style={{color:"#64748b"}}>P/ FATURAR</div>{rdy.length===0?<div className="text-sm" style={{color:"#475569",marginTop:16}}>Nenhum</div>:<div className="space-y-2 max-h-32 overflow-y-auto">{rdy.map(function(p){return <div key={p.id} className="flex items-center justify-between rounded-lg p-2" style={{background:"rgba(34,197,94,.08)",border:"1px solid #22c55e44"}}><div><b className="text-sm text-white">#{p.n}</b><span className="text-xs ml-2" style={{color:"#94a3b8"}}>{p.cl}</span></div>{isAdmin&&<button onClick={function(){fatP(p.id)}} className="px-3 py-1 rounded-lg text-xs font-bold cursor-pointer border-none" style={{background:"#16a34a",color:"#fff"}}>Faturar</button>}</div>})}</div>}</div>
</div>

<div className="grid grid-cols-2 gap-4 mb-5"><div className="rounded-2xl p-5" style={{background:"#1e293b",border:"1px solid #334155"}}><div className="text-xs font-bold tracking-wider mb-3" style={{color:"#64748b"}}>POR CLIENTE</div><BarC data={cData}/></div><div className="rounded-2xl p-5" style={{background:"#1e293b",border:"1px solid #334155"}}><div className="text-xs font-bold tracking-wider mb-3" style={{color:"#64748b"}}>POR ÁREA</div><BarC data={aData}/></div></div>

{pedAbertos.length===0?<div className="rounded-2xl p-16 text-center" style={{border:"2px dashed #334155",color:"#475569"}}>Nenhum pedido aberto</div>:<div className="grid gap-4" style={{gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))"}}>{pedAbertos.map(renderPedCard)}</div>}
</div>}

{/* FORM */}
{vw==="frm"&&isAdmin&&<div className="rounded-2xl max-w-4xl mx-auto overflow-hidden" style={{background:"#1e293b",border:"1px solid #334155"}}><div className="px-6 py-4 flex justify-between items-center" style={{borderBottom:"1px solid #334155",background:"rgba(255,255,255,.02)"}}><h2 className="text-lg font-bold text-white">{eI?"Editar":"Novo Pedido"}</h2><button onClick={function(){sVw("pan");sEI(null)}} className="w-8 h-8 rounded-lg border-none cursor-pointer text-lg" style={{background:"#334155",color:"#94a3b8"}}>{"\u00d7"}</button></div>
<div className="p-6"><div className="grid grid-cols-4 gap-4 mb-6">
<div><label className="block text-xs font-bold mb-1.5" style={{color:"#64748b"}}>PEDIDO *</label><input className={inp} value={fm.n} onChange={function(e){sFm(Object.assign({},fm,{n:e.target.value}))}}/></div>
<div><label className="block text-xs font-bold mb-1.5" style={{color:"#64748b"}}>TIPO</label><div className="flex gap-2 mt-1">{[["N","Nacional"],["E","Exterior"]].map(function(a){return <button key={a[0]} onClick={function(){sFm(Object.assign({},fm,{tp:a[0]}))}} className="px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer border-none" style={{background:fm.tp===a[0]?"#3b82f6":"#334155",color:fm.tp===a[0]?"#fff":"#94a3b8"}}>{a[1]}</button>})}</div></div>
<div><label className="block text-xs font-bold mb-1.5" style={{color:"#64748b"}}>PREVISÃO</label><input type="date" className={inp} value={fm.pv} onChange={function(e){sFm(Object.assign({},fm,{pv:e.target.value}))}}/></div>
<div><label className="block text-xs font-bold mb-1.5" style={{color:"#64748b"}}>CLIENTE</label><input list="cll" className={inp} value={fm.cl} onChange={function(e){sFm(Object.assign({},fm,{cl:e.target.value}))}}/><datalist id="cll">{cl.map(function(c){return <option key={c} value={c}/>})}</datalist></div>
<div><label className="block text-xs font-bold mb-1.5" style={{color:"#64748b"}}>CRIADO POR *</label><input list="opl" className={inp} value={fm.po} onChange={function(e){sFm(Object.assign({},fm,{po:e.target.value}))}}/><datalist id="opl">{ops.map(function(o){return <option key={o} value={o}/>})}</datalist></div>
<div className="col-span-3"><label className="block text-xs font-bold mb-1.5" style={{color:"#64748b"}}>OBS</label><input className={inp} value={fm.ob} onChange={function(e){sFm(Object.assign({},fm,{ob:e.target.value}))}}/></div>
</div>
<div className="flex justify-between items-center mb-3"><h3 className="text-sm font-bold text-gray-300">Itens ({fm.it.length})</h3><button onClick={aI} className="px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer border-none" style={{background:"rgba(59,130,246,.15)",color:"#60a5fa"}}>+ Item</button></div>
<div className="max-h-80 overflow-y-auto pr-1 space-y-2">
{fm.it.map(function(it,idx){var bg2=it.rel==="pai"?"rgba(249,115,22,.06)":it.rel==="filho"?"rgba(59,130,246,.06)":"transparent";
return <div key={it.id} className="border rounded-xl p-3" style={{background:bg2,marginLeft:it.rel==="filho"?20:0,borderColor:it.rel==="pai"?"#f97316":"#475569"}}>
<div className="flex justify-between items-center mb-2 flex-wrap gap-1">
<div className="flex items-center gap-1 flex-wrap"><span className="text-xs font-bold" style={{color:"#475569"}}>#{idx+1}</span>
{[["op","OP"],["almoxarifado","Almox"]].map(function(a){return <button key={a[0]} onClick={function(){uI(it.id,"tipo",a[0])}} className="px-2 py-0.5 rounded text-xs font-bold cursor-pointer border-none" style={{background:it.tipo===a[0]?"#3b82f6":"#334155",color:it.tipo===a[0]?"#fff":"#94a3b8"}}>{a[1]}</button>})}
<span style={{color:"#334155"}}>|</span>
{[["unica","Única"],["pai","Pai"],["filho","Filho"]].map(function(a){var act=it.rel===a[0];var bg3=act?(a[0]==="pai"?"#f97316":a[0]==="filho"?"#3b82f6":"#64748b"):"#334155";return <button key={a[0]} onClick={function(){uI(it.id,"rel",a[0])}} className="px-2 py-0.5 rounded text-xs font-bold cursor-pointer border-none" style={{background:bg3,color:act?"#fff":"#94a3b8"}}>{a[1]}</button>})}
<span style={{color:"#334155"}}>|</span>
<button onClick={function(e){e.stopPropagation();e.preventDefault();uI(it.id,"ti",!it.ti)}} className="px-2 py-0.5 rounded text-xs font-bold cursor-pointer border-none" style={{background:it.ti?"#14b8a6":"#334155",color:it.ti?"#fff":"#94a3b8"}}>T.I.</button>
</div>
<div className="flex gap-1"><button onClick={function(){dI(it)}} className="text-xs font-bold px-2 py-0.5 rounded cursor-pointer border-none" style={{background:"rgba(96,165,250,.15)",color:"#60a5fa"}}>+ Filho</button>{fm.it.length>1&&<button onClick={function(){rI(it.id)}} style={{color:"#f87171",background:"none",border:"none",cursor:"pointer",fontSize:16}}>{"\u00d7"}</button>}</div></div>
<div className="grid grid-cols-5 gap-2 mb-1">
{it.tipo==="op"&&<div><label className="block text-xs font-bold mb-0.5" style={{color:"#475569"}}>OP</label><input className={inp} value={it.op} onChange={function(e){uI(it.id,"op",e.target.value)}}/></div>}
<div><label className="block text-xs font-bold mb-0.5" style={{color:"#475569"}}>CÓDIGO *</label><input className={inp} value={it.cod} onChange={function(e){uI(it.id,"cod",e.target.value)}} placeholder="MEI30090"/></div>
<div><label className="block text-xs font-bold mb-0.5" style={{color:"#475569"}}>QTD</label><input className={inp} value={it.qt} onChange={function(e){uI(it.id,"qt",e.target.value)}}/></div>
<div><label className="block text-xs font-bold mb-0.5" style={{color:"#475569"}}>ÁREA</label><select className={inp+" bg-gray-800"} value={it.ar} onChange={function(e){uI(it.id,"ar",e.target.value)}}>{AR.map(function(a){return <option key={a} value={a}>{a||"\u2014"}</option>})}</select></div>
<div><label className="block text-xs font-bold mb-0.5" style={{color:"#475569"}}>TERC.</label><input className={inp} value={it.tc||""} onChange={function(e){uI(it.id,"tc",e.target.value)}} placeholder="Zincagem"/></div>
</div>
<div className="grid grid-cols-4 gap-2 items-end">
{it.rel==="filho"&&<div><label className="block text-xs font-bold mb-0.5" style={{color:"#475569"}}>REF PAI</label><input className={inp} value={it.pR} onChange={function(e){uI(it.id,"pR",e.target.value)}}/></div>}
<div><label className="block text-xs font-bold mb-0.5" style={{color:"#475569"}}>OBS</label><input className={inp} value={it.obs||""} onChange={function(e){uI(it.id,"obs",e.target.value)}}/></div>
{it.cod&&<div><label className="block text-xs font-bold mb-0.5" style={{color:"#475569"}}>DESENHO</label><DL cod={it.cod} onClick={function(e){e.preventDefault();sPC(it.cod)}}/></div>}
</div></div>})}
</div>
<div className="flex gap-3 mt-5"><button onClick={function(){sVw("pan");sEI(null)}} className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer" style={{background:"#334155",color:"#94a3b8",border:"none"}}>Cancelar</button><button onClick={saveFm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-none" style={{background:"linear-gradient(135deg,#2563eb,#7c3aed)",color:"#fff"}}>{eI?"Salvar":"Cadastrar"}</button></div>
</div></div>}

{/* LISTA */}
{vw==="lst"&&<div>
<div className="rounded-2xl p-3 mb-4 flex flex-wrap gap-2 items-center" style={{background:"#1e293b",border:"1px solid #334155"}}>
{[["ab","Aberto"],["bx","Baixa"],["td","Todos"]].map(function(a){return <button key={a[0]} onClick={function(){sFi(Object.assign({},fi,{s:a[0]}))}} className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-none" style={{background:fi.s===a[0]?"#3b82f6":"#334155",color:fi.s===a[0]?"#fff":"#94a3b8"}}>{a[1]}</button>})}
<input className={inp} style={{flex:1,minWidth:160}} value={fi.q} onChange={function(e){sFi(Object.assign({},fi,{q:e.target.value}))}} placeholder="Buscar..."/>
<select className={inp} style={{width:"auto"}} value={fi.c} onChange={function(e){sFi(Object.assign({},fi,{c:e.target.value}))}}><option value="">Todos</option>{cl.map(function(c){return <option key={c} value={c}>{c}</option>})}</select></div>
<div className="rounded-2xl overflow-hidden" style={{background:"#1e293b",border:"1px solid #334155"}}><div className="overflow-x-auto"><table className="w-full text-sm" style={{borderCollapse:"collapse"}}><thead><tr style={{background:"#0f172a"}}><th className={th0}>PED</th><th className={th0}>PREV</th><th className={th0}>ATRASO</th><th className={th0}>CLI</th><th className={th0}>TP</th><th className={th0}>OPs</th>{isAdmin&&<th className={th0+" text-center"}>AÇÕES</th>}</tr></thead><tbody>
{fP.length===0&&<tr><td colSpan={7} className="p-12 text-center" style={{color:"#475569"}}>Nenhum</td></tr>}
{fP.map(function(p){var d=dA(p.pv),at=d!==null&&d<0&&p.it.some(function(i){return !i.bx}),ab=p.it.filter(function(i){return !i.bx}).length,rows=[];
rows.push(<tr key={p.id} onClick={function(){sEx(function(e){var c=Object.assign({},e);c[p.id]=!c[p.id];return c})}} className="cursor-pointer" style={{borderBottom:"1px solid #1e293b",background:at?"rgba(239,68,68,.08)":"transparent"}}>
<td className="px-3 py-2.5"><strong className="text-white">{p.n}</strong><span className="ml-1" style={{color:"#475569"}}>{ex[p.id]?"\u25be":"\u25b8"}</span>{p.po&&<div className="text-xs" style={{color:"#475569"}}>por {p.po}</div>}</td>
<td className="px-3 py-2.5" style={{color:"#94a3b8"}}>{fD(p.pv)}</td>
<td className="px-3 py-2.5">{d!==null?(d<0?<B color="red">{d+"d"}</B>:d<=7?<B color="yellow">{d+"d"}</B>:<B color="green">{d+"d"}</B>):"\u2014"}</td>
<td className="px-3 py-2.5 text-xs font-semibold" style={{color:"#94a3b8"}}>{p.cl}</td>
<td className="px-3 py-2.5">{p.tp==="E"?<B color="blue">EXT</B>:<B color="gray">NAC</B>}</td>
<td className="px-3 py-2.5"><B color={ab?"blue":"gray"}>{ab+"/"+p.it.length}</B></td>
{isAdmin&&<td className="px-3 py-2.5 text-center" onClick={function(e){e.stopPropagation()}}><button onClick={function(){oFm(p)}} className="w-7 h-7 rounded-lg border-none cursor-pointer text-sm mr-1" style={{background:"rgba(59,130,246,.15)",color:"#60a5fa"}}>{"\u270e"}</button><button onClick={function(){sDC(p)}} className="w-7 h-7 rounded-lg border-none cursor-pointer text-sm" style={{background:"rgba(239,68,68,.15)",color:"#f87171"}}>{"\u2715"}</button></td>}</tr>);
if(ex[p.id])p.it.forEach(function(it){var isTerc=it.tc&&it.tc.trim();rows.push(<tr key={it.id} style={{borderBottom:"1px solid #1e293b",opacity:it.bx?0.4:1,background:isTerc?"rgba(168,85,247,.06)":"transparent"}}>
<td className="pl-8 py-2"><span className="inline-flex items-center gap-1 flex-wrap">{it.tipo==="op"?<B color="blue">{"OP "+(it.op||"\u2014")}</B>:<B color="purple">ALMOX</B>}<RB r={it.rel}/>{it.ti&&<B color="teal">T.I.</B>}{isTerc&&<span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{background:"#a855f7",color:"#fff"}}>{"\u26a1"}{it.tc}</span>}</span></td>
<td className="px-3 py-2"><DL cod={it.cod} onClick={function(e){e.preventDefault();if(it.cod)sPC(it.cod)}}/></td>
<td className="px-3 py-2 text-xs" style={{color:"#94a3b8"}}>{it.qt}</td><td className="px-3 py-2 text-xs" style={{color:"#94a3b8"}}>{it.ar}</td>
<td colSpan={isAdmin?3:2} className="px-3 py-2 text-xs" style={{color:"#64748b"}}>{it.bx?<span style={{color:"#22c55e",fontWeight:600}}>{"\u2713 "+fD(it.dB)+" \u2014 "+it.rB}</span>:(it.obs||"")}</td></tr>)});
return rows})}</tbody></table></div></div></div>}

{/* BAIXA */}
{vw==="bxa"&&<div>
<div className="rounded-2xl p-5 mb-4" style={{background:"#1e293b",border:"1px solid #334155"}}><h2 className="text-lg font-bold text-white mb-4">Baixa de OPs</h2>
{isAdmin&&<div className="flex flex-wrap gap-3 mb-4 items-end">
<div className="flex-1" style={{minWidth:180}}><label className="block text-xs font-bold mb-1" style={{color:"#64748b"}}>BUSCAR</label><input className={inp} value={bS} onChange={function(e){sBS(e.target.value)}}/></div>
<div style={{width:180}}><label className="block text-xs font-bold mb-1" style={{color:"#64748b"}}>RESPONSÁVEL *</label><input list="bxo" className={inp} value={bR} onChange={function(e){sBR(e.target.value)}}/><datalist id="bxo">{ops.map(function(o){return <option key={o} value={o}/>})}</datalist></div>
<button onClick={doBx} className="px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer border-none" style={{background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff"}}>{"\u2713 Baixa ("+Object.values(sB).filter(Boolean).length+")"}</button></div>}
<div className="overflow-x-auto rounded-xl" style={{border:"1px solid #334155"}}><table className="w-full text-sm" style={{borderCollapse:"collapse"}}><thead><tr style={{background:"#0f172a"}}>
{isAdmin&&<th className={th0} style={{width:36,textAlign:"center"}}><input type="checkbox" onChange={function(e){var c={};bF.forEach(function(i){c[i.id]=e.target.checked});sSB(c)}} checked={bF.length>0&&bF.every(function(i){return sB[i.id]})}/></th>}
{["PED","TIPO","REL","OP","CÓDIGO","DESENHO","QTD","ÁREA","CLI"].map(function(h){return <th key={h} className={th0}>{h}</th>})}</tr></thead><tbody>
{bF.length===0&&<tr><td colSpan={isAdmin?10:9} className="p-10 text-center" style={{color:"#475569"}}>Nenhuma OP em aberto</td></tr>}
{bF.map(function(i){var d=dA(i.pp);var isTerc=i.tc&&i.tc.trim();return <tr key={i.id} style={{borderBottom:"1px solid #1e293b",background:sB[i.id]?"rgba(59,130,246,.08)":(d!==null&&d<0?"rgba(239,68,68,.06)":isTerc?"rgba(168,85,247,.06)":"transparent")}}>
{isAdmin&&<td className="px-3 py-2 text-center"><input type="checkbox" checked={!!sB[i.id]} onChange={function(e){var c=Object.assign({},sB);c[i.id]=e.target.checked;sSB(c)}}/></td>}
<td className="px-3 py-2 font-bold text-white">{i.pn}{d!==null&&d<0&&<span className="ml-1"><B color="red">{d+"d"}</B></span>}</td>
<td className="px-3 py-2">{i.tipo==="op"?<B color="blue">OP</B>:<B color="purple">ALMOX</B>}</td>
<td className="px-3 py-2"><RB r={i.rel}/></td>
<td className="px-3 py-2 text-xs font-semibold" style={{color:"#94a3b8"}}>{i.op||"\u2014"}</td>
<td className="px-3 py-2 font-mono text-xs font-bold" style={{color:"#f87171"}}>{i.cod}</td>
<td className="px-3 py-2"><DL cod={i.cod} onClick={function(e){e.preventDefault();if(i.cod)sPC(i.cod)}}/></td>
<td className="px-3 py-2 text-xs" style={{color:"#94a3b8"}}>{i.qt}</td><td className="px-3 py-2 text-xs" style={{color:"#94a3b8"}}>{i.ar}</td><td className="px-3 py-2 text-xs font-semibold" style={{color:"#94a3b8"}}>{i.pc}</td></tr>})}</tbody></table></div></div>

{/* HISTÓRICO COMPLETO */}
{cld.length>0&&<div className="rounded-2xl p-5" style={{background:"#1e293b",border:"1px solid #334155"}}><div className="flex justify-between items-center mb-3 flex-wrap gap-2"><h3 className="text-sm font-bold text-gray-300">Histórico de Baixas ({cld.length} total)</h3><input className={inp} style={{width:220}} value={hQ} onChange={function(e){sHQ(e.target.value)}} placeholder="Filtrar histórico..."/></div>
<div className="overflow-x-auto rounded-xl" style={{border:"1px solid #334155"}}><table className="w-full text-sm" style={{borderCollapse:"collapse"}}><thead><tr style={{background:"#0f172a"}}>{["PED","OP","CÓDIGO","DATA","RESPONSÁVEL","CLI",""].map(function(h){return <th key={h} className={th0}>{h}</th>})}</tr></thead><tbody>
{hFilt.slice(0,hMax).map(function(i){return <tr key={i.id} style={{borderBottom:"1px solid #1e293b"}}>
<td className="px-3 py-2 font-bold" style={{color:"#64748b"}}>{i.pn}</td><td className="px-3 py-2 text-xs" style={{color:"#94a3b8"}}>{i.op||"\u2014"}</td><td className="px-3 py-2 font-mono text-xs font-bold" style={{color:"#64748b"}}>{i.cod}</td><td className="px-3 py-2 text-xs font-semibold" style={{color:"#22c55e"}}>{fD(i.dB)}</td><td className="px-3 py-2 text-xs font-semibold" style={{color:"#94a3b8"}}>{i.rB}</td><td className="px-3 py-2 text-xs" style={{color:"#94a3b8"}}>{i.pc}</td>
<td className="px-3 py-2">{isAdmin&&<button onClick={function(){uBx(i.id)}} className="text-xs font-semibold px-2.5 py-1 rounded-lg cursor-pointer border-none" style={{background:"rgba(234,179,8,.15)",color:"#fbbf24"}}>Reverter</button>}</td></tr>})}</tbody></table></div>
{hFilt.length>hMax&&<button onClick={function(){sHMax(hMax+30)}} className="w-full mt-3 py-2 rounded-xl text-xs font-bold cursor-pointer border-none" style={{background:"#334155",color:"#94a3b8"}}>Carregar mais ({hFilt.length-hMax} restantes)</button>}
</div>}
</div>}

{/* FATURAMENTO */}
{vw==="fat"&&<div>
<div className="rounded-2xl p-5 mb-4" style={{background:"#1e293b",border:"1px solid #334155"}}><h2 className="text-lg font-bold text-white mb-1">Faturamento</h2><p className="text-xs mb-4" style={{color:"#475569"}}>Ao faturar, registra data para OTD.</p>
<div className="overflow-x-auto rounded-xl" style={{border:"1px solid #334155"}}><table className="w-full text-sm" style={{borderCollapse:"collapse"}}><thead><tr style={{background:"#0f172a"}}>{["PED","TIPO","CLI","PREV","OPs","POR","AÇÃO"].map(function(h){return <th key={h} className={th0}>{h}</th>})}</tr></thead><tbody>
{rdy.length===0&&<tr><td colSpan={7} className="p-10 text-center" style={{color:"#475569"}}>Nenhum pronto</td></tr>}
{rdy.map(function(p){return <tr key={p.id} style={{borderBottom:"1px solid #1e293b"}}><td className="px-3 py-2.5 font-bold text-white">{p.n}</td><td className="px-3 py-2.5">{p.tp==="E"?<B color="blue">EXT</B>:<B color="gray">NAC</B>}</td><td className="px-3 py-2.5 text-xs font-semibold" style={{color:"#94a3b8"}}>{p.cl}</td><td className="px-3 py-2.5 text-xs" style={{color:"#94a3b8"}}>{fD(p.pv)}</td><td className="px-3 py-2.5"><B color="green">{p.it.length} ok</B></td><td className="px-3 py-2.5 text-xs" style={{color:"#94a3b8"}}>{p.po}</td><td className="px-3 py-2.5">{isAdmin&&<button onClick={function(){fatP(p.id)}} className="px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer border-none" style={{background:"#16a34a",color:"#fff"}}>Faturar</button>}</td></tr>})}</tbody></table></div></div>
{pFt.length>0&&<div className="rounded-2xl p-5" style={{background:"#1e293b",border:"1px solid #334155"}}><h3 className="text-sm font-bold text-gray-300 mb-3">Faturados ({pFt.length})</h3><div className="overflow-x-auto rounded-xl" style={{border:"1px solid #334155"}}><table className="w-full text-sm" style={{borderCollapse:"collapse"}}><thead><tr style={{background:"#0f172a"}}>{["PED","TIPO","CLI","PREV","FAT","OTD","OPs",""].map(function(h){return <th key={h} className={th0}>{h}</th>})}</tr></thead><tbody>
{pFt.map(function(p){var on=p.pv&&p.dF&&p.dF<=p.pv;return <tr key={p.id} style={{borderBottom:"1px solid #1e293b"}}><td className="px-3 py-2 font-bold" style={{color:"#64748b"}}>{p.n}</td><td className="px-3 py-2">{p.tp==="E"?<B color="blue">EXT</B>:<B color="gray">NAC</B>}</td><td className="px-3 py-2 text-xs" style={{color:"#94a3b8"}}>{p.cl}</td><td className="px-3 py-2 text-xs" style={{color:"#94a3b8"}}>{fD(p.pv)}</td><td className="px-3 py-2 text-xs font-semibold" style={{color:"#22c55e"}}>{fD(p.dF)}</td><td className="px-3 py-2">{p.pv&&p.dF?(on?<B color="green">OK</B>:<B color="red">Atrasado</B>):"\u2014"}</td><td className="px-3 py-2 text-xs" style={{color:"#94a3b8"}}>{p.it.length}</td><td className="px-3 py-2">{isAdmin&&<button onClick={function(){uFat(p.id)}} className="text-xs font-semibold px-2 py-1 rounded-lg cursor-pointer border-none" style={{background:"rgba(234,179,8,.15)",color:"#fbbf24"}}>Reverter</button>}</td></tr>})}</tbody></table></div></div>}
</div>}

{/* ALMOXARIFADO */}
{vw==="alm"&&<div>
<div className="rounded-2xl p-5 mb-4" style={{background:"#1e293b",border:"1px solid #334155"}}><h2 className="text-lg font-bold text-white mb-4">Almoxarifado</h2>
{isAdmin&&<div className="flex flex-wrap gap-3 mb-4 items-end">
<div className="flex-1" style={{minWidth:180}}><label className="block text-xs font-bold mb-1" style={{color:"#64748b"}}>BUSCAR</label><input className={inp} value={aS} onChange={function(e){sAS(e.target.value)}}/></div>
<div style={{width:180}}><label className="block text-xs font-bold mb-1" style={{color:"#64748b"}}>RESPONSÁVEL *</label><input list="alo" className={inp} value={aR} onChange={function(e){sAR(e.target.value)}}/><datalist id="alo">{ops.map(function(o){return <option key={o} value={o}/>})}</datalist></div>
<button onClick={doAlmBx} className="px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer border-none" style={{background:"linear-gradient(135deg,#9333ea,#7c3aed)",color:"#fff"}}>Separar ({Object.values(aSB).filter(Boolean).length})</button></div>}
<div className="overflow-x-auto rounded-xl" style={{border:"1px solid #334155"}}><table className="w-full text-sm" style={{borderCollapse:"collapse"}}><thead><tr style={{background:"#0f172a"}}>
{isAdmin&&<th className={th0} style={{width:36,textAlign:"center"}}><input type="checkbox" onChange={function(e){var c={};almFilt.forEach(function(i){c[i.id]=e.target.checked});sASB(c)}} checked={almFilt.length>0&&almFilt.every(function(i){return aSB[i.id]})}/></th>}
{["PED","CÓDIGO","DESENHO","QTD","ÁREA","CLI"].map(function(h){return <th key={h} className={th0}>{h}</th>})}</tr></thead><tbody>
{almFilt.length===0&&<tr><td colSpan={isAdmin?7:6} className="p-10 text-center" style={{color:"#475569"}}>Nenhum pendente</td></tr>}
{almFilt.map(function(i){return <tr key={i.id} style={{borderBottom:"1px solid #1e293b",background:aSB[i.id]?"rgba(147,51,234,.08)":"transparent"}}>
{isAdmin&&<td className="px-3 py-2 text-center"><input type="checkbox" checked={!!aSB[i.id]} onChange={function(e){var c=Object.assign({},aSB);c[i.id]=e.target.checked;sASB(c)}}/></td>}
<td className="px-3 py-2 font-bold text-white">{i.pn}</td><td className="px-3 py-2 font-mono text-xs font-bold" style={{color:"#f87171"}}>{i.cod}</td><td className="px-3 py-2"><DL cod={i.cod} onClick={function(e){e.preventDefault();if(i.cod)sPC(i.cod)}}/></td>
<td className="px-3 py-2 text-xs" style={{color:"#94a3b8"}}>{i.qt}</td><td className="px-3 py-2 text-xs" style={{color:"#94a3b8"}}>{i.ar}</td><td className="px-3 py-2 text-xs font-semibold" style={{color:"#94a3b8"}}>{i.pc}</td></tr>})}</tbody></table></div></div>
{alm.filter(function(i){return i.bx}).length>0&&<div className="rounded-2xl p-5" style={{background:"#1e293b",border:"1px solid #334155"}}><h3 className="text-sm font-bold text-gray-300 mb-3">Separados</h3><div className="overflow-x-auto rounded-xl" style={{border:"1px solid #334155"}}><table className="w-full text-sm" style={{borderCollapse:"collapse"}}><thead><tr style={{background:"#0f172a"}}>{["PED","CÓDIGO","DATA","RESP","CLI","FAT",""].map(function(h){return <th key={h} className={th0}>{h}</th>})}</tr></thead><tbody>
{alm.filter(function(i){return i.bx}).sort(function(a,b){return(b.dB||"").localeCompare(a.dB||"")}).map(function(i){return <tr key={i.id} style={{borderBottom:"1px solid #1e293b"}}><td className="px-3 py-2 font-bold" style={{color:"#64748b"}}>{i.pn}</td><td className="px-3 py-2 font-mono text-xs font-bold" style={{color:"#64748b"}}>{i.cod}</td><td className="px-3 py-2 text-xs font-semibold" style={{color:"#22c55e"}}>{fD(i.dB)}</td><td className="px-3 py-2 text-xs font-semibold" style={{color:"#94a3b8"}}>{i.rB}</td><td className="px-3 py-2 text-xs" style={{color:"#94a3b8"}}>{i.pc}</td><td className="px-3 py-2">{i.pft?<B color="green">Sim</B>:<B color="gray">Não</B>}</td><td className="px-3 py-2">{isAdmin&&<button onClick={function(){uBx(i.id)}} className="text-xs font-semibold px-2 py-0.5 rounded-lg cursor-pointer border-none" style={{background:"rgba(234,179,8,.15)",color:"#fbbf24"}}>Reverter</button>}</td></tr>})}</tbody></table></div></div>}
</div>}

{/* T.I. */}
{vw==="ti"&&<div className="rounded-2xl p-5" style={{background:"#1e293b",border:"1px solid #334155"}}><h2 className="text-lg font-bold text-white mb-4">T.I.</h2>
<div className="overflow-x-auto rounded-xl" style={{border:"1px solid #334155"}}><table className="w-full text-sm" style={{borderCollapse:"collapse"}}><thead><tr style={{background:"#042f2e"}}>
{["PED","CÓDIGO","DESENHO","QTD","ÁREA","CLI","STATUS"].map(function(h){return <th key={h} className="px-3 py-2.5 text-left text-xs font-bold border-b" style={{color:"#2dd4bf",borderColor:"#134e4a"}}>{h}</th>})}
</tr></thead><tbody>
{tiItems.length===0&&<tr><td colSpan={7} className="p-10 text-center" style={{color:"#475569"}}>Nenhum item T.I.</td></tr>}
{tiItems.map(function(i){return <tr key={i.id} style={{borderBottom:"1px solid #1e293b",opacity:i.bx?0.5:1}}>
<td className="px-3 py-2 font-bold text-white">{i.pn}</td><td className="px-3 py-2 font-mono text-xs font-bold" style={{color:"#f87171"}}>{i.cod}</td><td className="px-3 py-2"><DL cod={i.cod} onClick={function(e){e.preventDefault();if(i.cod)sPC(i.cod)}}/></td>
<td className="px-3 py-2 text-xs" style={{color:"#94a3b8"}}>{i.qt}</td><td className="px-3 py-2 text-xs" style={{color:"#94a3b8"}}>{i.ar}</td><td className="px-3 py-2 text-xs font-semibold" style={{color:"#94a3b8"}}>{i.pc}</td>
<td className="px-3 py-2">{i.bx?<span className="text-xs font-semibold" style={{color:"#22c55e"}}>{"\u2713 "+fD(i.dB)+" \u2014 "+i.rB}</span>:<B color="yellow">Pendente</B>}</td></tr>})}</tbody></table></div></div>}

</div></div>)}