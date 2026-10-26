// Local-only API adapter. No production calls and no network account.
(()=>{
const originalFetch=window.fetch.bind(window),user={id:'local-owner',name:'CƯỜNG · OFFLINE'};
const ready=new Promise((resolve,reject)=>{const r=indexedDB.open('cxr-android-offline-v1',1);r.onupgradeneeded=()=>{r.result.createObjectStore('flights',{keyPath:'id'});r.result.createObjectStore('files',{keyPath:'key'})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
async function tx(store,mode,fn){const db=await ready;return new Promise((resolve,reject)=>{const t=db.transaction(store,mode);let r;try{r=fn(t.objectStore(store))}catch(e){reject(e);return}t.oncomplete=()=>resolve(r?.result);t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error)})}
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
let writes=Promise.resolve();
window.fetch=async(input,options={})=>{const u=new URL(typeof input==='string'?input:input.url,location.href);if(!u.pathname.startsWith('/api/'))return originalFetch(input,options);const method=(options.method||'GET').toUpperCase();try{
if(u.pathname==='/api/session')return json({user});
if(u.pathname==='/api/flights'&&method==='GET')return json({flights:(await tx('flights','readonly',s=>s.getAll())).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))});
if(u.pathname==='/api/flights'&&method==='PUT'){const save=async()=>{const f=JSON.parse(options.body);if(!f.id)throw Error('THIẾU ID');const prior=await tx('flights','readonly',s=>s.get(f.id));if(prior&&prior._revision!==f._revision)return json({error:'HỒ SƠ ĐÃ THAY ĐỔI. HÃY TẢI LẠI'},409);const flight={...f,ownerId:user.id,ownerName:user.name,canEdit:true,_revision:(prior?prior._revision:0)+1,updatedAt:new Date().toISOString()};await tx('flights','readwrite',s=>s.put(flight));return json({flight})};const result=writes.then(save);writes=result.catch(()=>{});return await result}
if(u.pathname==='/api/files'&&method==='POST'){const blob=options.body;if(!(blob instanceof Blob)||!blob.size||blob.size>10*1024*1024)throw Error('FILE PHẢI TỪ 1 BYTE ĐẾN 10 MB');const headers=new Headers(options.headers),key=crypto.randomUUID(),name=decodeURIComponent(headers.get('X-File-Name')||'DOCUMENT');await tx('files','readwrite',s=>s.put({key,name,blob}));return json({file:{key,name}})}
if(u.pathname==='/api/files'&&method==='GET'){const f=await tx('files','readonly',s=>s.get(u.searchParams.get('key')));return f?new Response(f.blob,{headers:{'Content-Type':f.blob.type}}):json({error:'FILE KHÔNG CÓ TRÊN THIẾT BỊ NÀY'},404)}
return json({error:'CHỨC NĂNG CHƯA CÓ TRONG BẢN OFFLINE'},404)
}catch(e){return json({error:e.message||'KHÔNG LƯU ĐƯỢC TRÊN THIẾT BỊ'},400)}};
// Capture synthetic anchor clicks as well as user clicks; SAF handles blob downloads.
const click=HTMLAnchorElement.prototype.click;
HTMLAnchorElement.prototype.click=function(){if(!this.download)return click.call(this);const a=this;(async()=>{try{const response=await fetch(a.href);if(!response.ok)throw Error('KHÔNG ĐỌC ĐƯỢC FILE');const blob=await response.blob();if(blob.size>32*1024*1024)throw Error('BẢN TEST CHỈ XUẤT FILE TỐI ĐA 32 MB');const r=new FileReader();r.onload=()=>{const mime=blob.type||'application/octet-stream',data=String(r.result).split(',')[1];if(typeof window.CXRExportSheet==='function')window.CXRExportSheet(a.download,mime,data);else CXRAndroid.save(a.download,mime,data)};r.readAsDataURL(blob)}catch(e){if(typeof notice==='function')notice(e.message)}})()};
})();
