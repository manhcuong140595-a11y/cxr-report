const CXR_THEMES=[
{id:'original',name:'Sân đỗ ban đêm',note:'Giao diện gốc · ảnh sân bay',colors:['#06141f','#0d2333','#36d2df'],plane:true},
{id:'pastel',name:'Pastel dịu nhẹ',note:'Tím nhạt · đơn giản, thoáng mắt',colors:['#f5f2fa','#ffffff','#71549c']},
{id:'sky',name:'Bầu trời xanh',note:'Máy bay giữa những tầng mây',colors:['#edf6fc','#ffffff','#26688b'],plane:true},
{id:'sunset',name:'Chuyến bay hoàng hôn',note:'Máy bay · sắc đào ấm áp',colors:['#fff4ed','#fffdfb','#975137'],plane:true},
{id:'night',name:'Đường bay đêm',note:'Máy bay · xanh đêm yên tĩnh',colors:['#101b30','#1a2943','#9bbef6'],plane:true}
];
function themeStorageKey(){return 'cxr-theme:'+ (sessionUser?.id||'guest')}
function currentTheme(){try{const id=localStorage.getItem(themeStorageKey());if(CXR_THEMES.some(t=>t.id===id))return id}catch{}return settings.light?'pastel':'original'}
function applyTheme(){document.body.classList.remove('light');document.body.dataset.theme=currentTheme()}
function openThemes(){let dialog=document.getElementById('themeDialog');if(!dialog){dialog=document.createElement('dialog');dialog.id='themeDialog';dialog.setAttribute('aria-labelledby','themeTitle');document.body.appendChild(dialog)}dialog.innerHTML=`<div class="row between"><div><small>KHÔNG GIAN LÀM VIỆC</small><h2 id="themeTitle">Chủ Đề</h2></div><button type="button" id="closeThemes" aria-label="Đóng chủ đề">×</button></div><p class="muted">Chọn để áp dụng ngay. Ghi nhớ riêng cho bạn trên trình duyệt này.</p><div class="theme-grid">${CXR_THEMES.map(t=>`<button class="theme-choice" data-theme-choice="${t.id}" aria-pressed="${currentTheme()===t.id}"><span class="theme-preview preview-${t.id}" style="--preview-bg:${t.colors[0]};--preview-panel:${t.colors[1]};--preview-accent:${t.colors[2]}"><i></i><span>${t.plane?'✈':''}</span><b>✓</b></span><strong>${t.name}</strong><small>${t.note}</small></button>`).join('')}</div><p id="themeFeedback" role="status" class="muted">Biểu mẫu giữ nền trắng để dễ nhập liệu và in ấn.</p>`;dialog.querySelector('#closeThemes').onclick=()=>dialog.close();dialog.querySelectorAll('[data-theme-choice]').forEach(b=>b.onclick=()=>{try{localStorage.setItem(themeStorageKey(),b.dataset.themeChoice);applyTheme();dialog.querySelectorAll('[data-theme-choice]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));dialog.querySelector('#themeFeedback').textContent='Đã áp dụng: '+CXR_THEMES.find(t=>t.id===b.dataset.themeChoice).name}catch{dialog.querySelector('#themeFeedback').textContent='Trình duyệt chưa cho phép lưu chủ đề.'}});dialog.showModal()}

const CXR_CURSORS=[
{id:'jet',name:'Máy bay mũi nhọn',file:'cursor-jet.svg',hot:'3 3'},
{id:'paper-sharp',name:'Máy bay giấy nhọn',file:'cursor-paper-sharp.svg',hot:'3 3'},
{id:'arrow-mint',name:'Mũi tên mint',file:'cursor-arrow-mint.svg',hot:'3 3'},
{id:'arrow-pink',name:'Mũi tên hồng',file:'cursor-arrow-pink.svg',hot:'3 3'},
{id:'mint',name:'Máy bay mint',file:'chibi-plane-cursor.svg',hot:'10 5'},
{id:'pink',name:'Máy bay hồng',file:'cursor-pink.svg',hot:'10 5'},
{id:'lavender',name:'Máy bay tím',file:'cursor-lavender.svg',hot:'10 5'},
{id:'paper',name:'Máy bay giấy',file:'cursor-paper.svg',hot:'3 5'},
{id:'cloud',name:'Mây nhỏ',file:'cursor-cloud.svg',hot:'10 15'},
{id:'star',name:'Ngôi sao',file:'cursor-star.svg',hot:'20 3'},
{id:'default',name:'Chuột mặc định',file:'cursor-default.svg',hot:'8 4'}
];
function cursorStorageKey(){return 'cxr-cursor:'+(sessionUser?.id||'guest')}
function currentCursor(){try{const id=localStorage.getItem(cursorStorageKey());if(CXR_CURSORS.some(c=>c.id===id))return id}catch{}return 'mint'}
function applyCursor(){const c=CXR_CURSORS.find(c=>c.id===currentCursor());document.body.dataset.cursor=c.id;document.body.style.setProperty('--cursor-icon',c.id==='default'?'auto':`url("assets/${c.file}") ${c.hot}`)}
function openIcons(){let d=document.getElementById('iconDialog');if(!d){d=document.createElement('dialog');d.id='iconDialog';d.setAttribute('aria-labelledby','iconTitle');document.body.appendChild(d)}d.innerHTML=`<div class="row between"><div><small>MỘT CHÚT DỄ THƯƠNG</small><h2 id="iconTitle">Icon</h2></div><button id="closeIcons" type="button" aria-label="Đóng Icon">×</button></div><p class="muted">Bốn mẫu đầu nhọn ở đầu danh sách có điểm bấm ngay chóp. Áp dụng ngay và ghi nhớ riêng cho bạn trên trình duyệt này.</p><div class="icon-grid">${CXR_CURSORS.map(c=>`<button type="button" class="icon-choice" data-cursor-choice="${c.id}" aria-pressed="${currentCursor()===c.id}"><img src="assets/${c.file}" alt="" width="64" height="64"><strong>${c.name}</strong><span class="icon-selected">✓ Đang dùng</span></button>`).join('')}</div><p id="iconFeedback" class="muted" role="status">Dùng với chuột hoặc bàn di chuột. Ô nhập chữ vẫn dùng con trỏ soạn thảo.</p>`;d.querySelector('#closeIcons').onclick=()=>d.close();d.querySelectorAll('[data-cursor-choice]').forEach(b=>b.onclick=()=>{try{localStorage.setItem(cursorStorageKey(),b.dataset.cursorChoice);applyCursor();d.querySelectorAll('[data-cursor-choice]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));d.querySelector('#iconFeedback').textContent='Đã áp dụng: '+CXR_CURSORS.find(c=>c.id===b.dataset.cursorChoice).name}catch{d.querySelector('#iconFeedback').textContent='Trình duyệt chưa cho phép lưu lựa chọn.'}});d.showModal()}

// Keep one small decorative plane anchored to the active field.
let inputFlightEffect=null,inputFlightField=null;
function clearInputFlight(){inputFlightEffect?.remove();inputFlightEffect=null;inputFlightField=null}
function positionInputFlight(){
 if(!inputFlightEffect||!inputFlightField?.isConnected)return clearInputFlight();
 const box=(inputFlightField.closest('.inline-field')||inputFlightField).getBoundingClientRect();
 inputFlightEffect.style.left=Math.max(1,box.left-24)+'px';
 inputFlightEffect.style.top=(box.top+box.height/2-10)+'px';
 inputFlightEffect.style.visibility=box.bottom<0||box.top>innerHeight?'hidden':'visible';
}
document.addEventListener('focusin',event=>{
 const field=event.target.closest?.('input,textarea,[contenteditable="true"]');
 clearInputFlight();
 if(!field||field.disabled||field.readOnly)return;
 if(field.tagName==='INPUT'&&!['text','search','number','time','date','email','tel','url','password'].includes(field.type))return;
 const choice=CXR_CURSORS.find(c=>c.id===currentCursor());
 if(choice.id==='default')return;
 const plane=['mint','pink','lavender','jet','paper','paper-sharp'].includes(choice.id)?choice.file:'chibi-plane-cursor.svg';
 const effect=document.createElement('span');effect.className='input-flight-effect';effect.setAttribute('aria-hidden','true');
 effect.style.setProperty('--plane-heading', ['jet','paper','paper-sharp'].includes(choice.id)?'135deg':'125deg');
 effect.innerHTML=`<i></i><i></i><img src="assets/${plane}" alt="" width="20" height="20">`;
 (field.closest('dialog')||document.body).appendChild(effect);inputFlightEffect=effect;inputFlightField=field;positionInputFlight();
});
document.addEventListener('focusout',event=>{if(event.target===inputFlightField)clearInputFlight()});
window.addEventListener('scroll',positionInputFlight,{capture:true,passive:true});
window.addEventListener('resize',positionInputFlight,{passive:true});
