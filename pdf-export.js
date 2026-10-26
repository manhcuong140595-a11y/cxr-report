// Export only the report artwork; browser print CSS and screen zoom are irrelevant.
function reportPdfBytes(pages){
 const encoder=new TextEncoder(),parts=[],offsets=[0];let length=0;
 const put=value=>{const bytes=typeof value==='string'?encoder.encode(value):value;parts.push(bytes);length+=bytes.length};
 const object=(id,body)=>{offsets[id]=length;put(`${id} 0 obj\n`);body();put('\nendobj\n')};
 put('%PDF-1.4\n');
 object(1,()=>put('<< /Type /Catalog /Pages 2 0 R >>'));
 object(2,()=>put(`<< /Type /Pages /Count ${pages.length} /Kids [${pages.map((_,i)=>`${3+i*3} 0 R`).join(' ')}] >>`));
 pages.forEach((p,i)=>{const id=3+i*3,pw=p.width>p.height?841.89:595.28,ph=p.width>p.height?595.28:841.89,scale=Math.min(pw/p.width,ph/p.height),w=p.width*scale,h=p.height*scale;
 object(id,()=>put(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Report ${id+1} 0 R >> >> /Contents ${id+2} 0 R >>`));
 object(id+1,()=>{put(`<< /Type /XObject /Subtype /Image /Width ${p.width} /Height ${p.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.bytes.length} >>\nstream\n`);put(p.bytes);put('\nendstream')});
 const commands=`q\n${w.toFixed(4)} 0 0 ${h.toFixed(4)} ${((pw-w)/2).toFixed(4)} ${((ph-h)/2).toFixed(4)} cm\n/Report Do\nQ`;
 object(id+2,()=>put(`<< /Length ${encoder.encode(commands).length} >>\nstream\n${commands}\nendstream`));
 });
 const start=length;put(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);for(const offset of offsets.slice(1))put(`${String(offset).padStart(10,'0')} 00000 n \n`);
 put(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`);
 return new Blob(parts,{type:'application/pdf'});
}
function reportImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Không tải được ảnh biểu mẫu hoặc chữ ký. Vui lòng thử lại.'));img.src=src})}
async function renderReportPage(flight,tpl,fields,index){
 const base=await reportImage(tpl.data||`forms/${tpl.id}/page-${String(index+1).padStart(2,'0')}.png`);
 const W=base.naturalWidth,H=base.naturalHeight,canvas=document.createElement('canvas');const S=window.CXR_PDF_SCALE||2;canvas.width=Math.round(W*S);canvas.height=Math.round(H*S);
 const ctx=canvas.getContext('2d');ctx.scale(canvas.width/W,canvas.height/H);ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.drawImage(base,0,0,W,H);
 const pieces=[],signatures=[];
 for(const field of fields.filter(x=>x.page===index)){
 const values=flight.values?.[tpl.id]||{};const value=isCalculatedTotal(field.id)?passengerTotal(values,field.id):Object.hasOwn(values,field.id)?values[field.id]:initialFormValue(flight,field);if(value===''||value===null||value===undefined||value===false)continue;
 const x=field.x/100*W,y=field.y/100*H,w=field.w/100*W,h=field.h/100*H;
 if(field.type==='signature'){if(String(value).startsWith('data:image/png;base64,'))signatures.push({value,x,y,w,h});continue}
 if(field.type==='check'){const b=field.checkBox||{x:0,y:0,w:100,h:100};pieces.push(`<svg x="${x+w*b.x/100}" y="${y+h*b.y/100}" width="${w*b.w/100}" height="${h*b.h/100}" viewBox="0 0 100 100" preserveAspectRatio="none" overflow="visible"><path d="M20 51 L42 75 L82 22" fill="none" stroke="#003b8e" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`)}
 else pieces.push(renderWritingText(field,value).replace('<svg ',`<svg x="${x}" y="${y}" width="${w}" height="${h}" overflow="visible" `));
 }
 const svg=new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${W} ${H}">${pieces.join('')}</svg>`],{type:'image/svg+xml'}),url=URL.createObjectURL(svg);
 try{ctx.drawImage(await reportImage(url),0,0,W,H)}finally{URL.revokeObjectURL(url)}
 for(const s of signatures){const img=await reportImage(s.value),scale=Math.min(s.w/img.naturalWidth,s.h/img.naturalHeight),w=img.naturalWidth*scale,h=img.naturalHeight*scale;ctx.drawImage(img,s.x+(s.w-w)/2,s.y+(s.h-h)/2,w,h)}
 const jpg=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',window.CXR_PDF_QUALITY||.97));if(!jpg)throw Error('Không tạo được ảnh PDF.');
 return {width:canvas.width,height:canvas.height,bytes:new Uint8Array(await jpg.arrayBuffer())};
}
async function exportCurrentReportPdf(){
 const button=$('printForm');if(button.disabled)return;button.disabled=true;const label=button.textContent;
 try{
 if(canEdit(active()))await persistFormDefaults();await document.fonts.ready;
 const flight=structuredClone(active()),tpl=templateList().find(x=>x.id===templateId),fields=formFields(templateId),pages=[];
 for(let i=0;i<tpl.pages;i++){button.textContent=`ĐANG XUẤT ${i+1}/${tpl.pages}…`;pages.push(await renderReportPage(flight,tpl,fields,i))}
 const pdf=reportPdfBytes(pages),url=URL.createObjectURL(pdf),a=document.createElement('a');a.href=url;a.download=`${flight.flight||'CXR'}_${flight.date||''}_${tpl.id}.pdf`.replace(/[\\/:*?"<>|]/g,'-');document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);notice(`ĐÃ XUẤT PDF · ${pages.length} TRANG A4`);
 }catch(error){notice('XUẤT PDF THẤT BẠI: '+error.message)}finally{button.disabled=false;button.textContent=label}
}
