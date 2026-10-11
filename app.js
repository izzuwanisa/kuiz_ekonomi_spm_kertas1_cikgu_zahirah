const $=s=>document.querySelector(s),app=$('#app'),KEY='ekon-spm2026-k1';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const L='ABCD';let S={nama:'',jwp:{},i:0,done:false};
try{S=Object.assign(S,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
// Semakan integriti kunci
(function(){const c={};[...KUNCI].forEach(k=>c[k]=(c[k]||0)+1);
 if(SOALAN.length!==40||KUNCI.length!==40||c.A!==9||c.B!==7||c.C!==11||c.D!==13)console.error('RALAT: kunci/soalan tidak sepadan',c)})();
function optHTML(q,i,mode){
 const bs=q.bs,o=bs?BS:q.o;const arr=Array.isArray(o[i]);
 let inner;
 if(bs)inner=`<div class="g bs"><span>Pernyataan I: ${o[i][0]}</span><span>Pernyataan II: ${o[i][1]}</span></div>`;
 else if(arr)inner=`<div class="g"><span>${o[i][0]}</span><span>${o[i][1]}</span></div>`;
 else inner=`<span>${o[i]}</span>`;
 return inner}
function qHTML(q,mode){ // mode: 'ans' atau 'rev'
 const k=KUNCI[q.n-1],j=S.jwp[q.n];
 let h=`<div class="qn">${q.n}</div>`;
 if(q.bs)h+=`<p class="mut">Soalan 35 hingga soalan 40 berdasarkan pilihan jawapan seperti jadual di bawah.</p>`+T([["Pilihan","Pernyataan I","Pernyataan II"],...BS.map((b,i)=>[L[i],b[0],b[1]])]);
 if(q.t)h+=`<p>${q.t}</p>`;
 if(q.box)h+=`<div class="box">${q.box}</div>`;
 if(q.img)h+=`<img class="fig" src="img/${q.img}.png" alt="${esc(q.cap||'Rajah')}">`;
 if(q.tbl)h+=q.tbl;
 if(q.cap)h+=`<div class="cap">${q.cap}</div>`;
 if(q.q)h+=`<p>${q.q}</p>`;
 if(q.s)h+=`<ol class="s">${q.s.map(x=>`<li>${x}</li>`).join('')}</ol>`;
 if(q.hd)h+=`<div class="opt" style="background:none;border:0;padding:0"><b></b><div class="g"><b>${q.hd[0]}</b><b>${q.hd[1]}</b></div></div>`;
 for(let i=0;i<4;i++){
  let c='opt';
  if(mode==='ans'&&j===L[i])c+=' sel';
  if(mode==='rev'){if(L[i]===k)c+=' ok';else if(j===L[i])c+=' no'}
  h+=`<button class="${c}" ${mode==='ans'?`data-l="${L[i]}"`:'disabled'}><b>${L[i]}</b>${optHTML(q,i)}</button>`}
 return h}
function start(){app.innerHTML=`<div class="card"><h1>Kuiz Ekonomi SPM 2026 – Kertas 1</h1>
<p class="mut">Modul Koleksi Item Percubaan SPM 2026, MPSM Kelantan (3767/1). 40 soalan objektif. Jawapan dipaparkan selepas semua soalan dihantar.</p>
<label for="nm"><b>Nama murid</b></label><input type="text" id="nm" maxlength="60" placeholder="Taip nama penuh anda" autocomplete="name">
<button id="go">Mula</button><p class="mut" id="er"></p></div>`;
 $('#nm').value=S.nama||'';
 $('#go').onclick=()=>{const v=$('#nm').value.trim();if(!v){$('#er').textContent='Sila masukkan nama anda.';return}
  if(v!==S.nama){S={nama:v,jwp:{},i:0,done:false}}save();S.done?result():quiz()}}
function quiz(){
 const q=SOALAN[S.i],n=Object.keys(S.jwp).length;
 app.innerHTML=`<div class="card noprint"><div class="mut">${esc(S.nama)} · Dijawab ${n}/40</div>
 <div class="pal">${SOALAN.map((x,i)=>`<button data-i="${i}" class="${S.jwp[x.n]?'d':''} ${i===S.i?'cur':''}">${x.n}</button>`).join('')}</div></div>
 <div class="card">${qHTML(q,'ans')}
 <div class="row"><button class="sec" id="pv" ${S.i===0?'disabled':''}>Sebelumnya</button>
 ${S.i<39?'<button id="nx">Seterusnya</button>':'<button id="sb">Hantar jawapan</button>'}</div></div>
 <div class="row noprint" style="margin-top:0"><button class="sec" id="sb2">Hantar sekarang</button></div>`;
 document.querySelectorAll('.opt[data-l]').forEach(b=>b.onclick=()=>{S.jwp[q.n]=b.dataset.l;save();quiz()});
 document.querySelectorAll('.pal button').forEach(b=>b.onclick=()=>{S.i=+b.dataset.i;save();quiz();scrollTo(0,0)});
 const go=d=>()=>{S.i+=d;save();quiz();scrollTo(0,0)};
 $('#pv').onclick=go(-1);if($('#nx'))$('#nx').onclick=go(1);
 const sub=()=>{const k=40-Object.keys(S.jwp).length;
  if(confirm(k?`Masih ada ${k} soalan belum dijawab. Hantar juga?`:'Hantar semua jawapan sekarang? Anda tidak boleh mengubahnya selepas ini.')){S.done=true;save();result();scrollTo(0,0)}};
 $('#sb2').onclick=sub;if($('#sb'))$('#sb').onclick=sub}
function result(filter){
 let m=0;SOALAN.forEach(q=>{if(S.jwp[q.n]===KUNCI[q.n-1])m++});
 const list=SOALAN.filter(q=>filter!=='salah'||S.jwp[q.n]!==KUNCI[q.n-1]);
 app.innerHTML=`<div class="card"><h1>Keputusan</h1><div>${esc(S.nama)}</div>
 <div class="score">${m} / 40 <span class="mut">(${(m/40*100).toFixed(1)}%)</span></div>
 <div class="row noprint"><button id="pr">Cetak / Simpan PDF</button><button class="sec" id="fl">${filter==='salah'?'Papar semua':'Papar yang salah sahaja'}</button><button class="sec" id="rs">Cuba semula</button></div></div>`+
 list.map(q=>{const k=KUNCI[q.n-1],j=S.jwp[q.n],ok=j===k;
  return `<div class="card">${qHTML(q,'rev')}<p class="tag ${ok?'ok-t':'no-t'}">${ok?'Betul':'Salah'} · Jawapan anda: ${j||'tiada'} · Jawapan skema: ${k}</p></div>`}).join('');
 $('#pr').onclick=()=>print();$('#fl').onclick=()=>result(filter==='salah'?'':'salah');
 $('#rs').onclick=()=>{if(confirm('Mulakan semula dengan jawapan kosong?')){S={nama:S.nama,jwp:{},i:0,done:false};save();quiz();scrollTo(0,0)}}}
if(S.nama&&S.done)result();else if(S.nama&&Object.keys(S.jwp).length)quiz();else start();
