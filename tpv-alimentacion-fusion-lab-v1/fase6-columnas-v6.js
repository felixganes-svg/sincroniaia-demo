// SINCRONIAIA · LAB FUSIÓN · FASE 6 v6
// Ajuste aislado: separa PRECIO y TOTAL en las líneas de artículos del PNG 58 mm.
(function(){
  let patched=null;

  function plain(v){return (Number(v)||0).toFixed(2).replace('.',',')}
  function money(v){return (Number(v)||0).toFixed(2).replace('.',',')+' €'}

  function waitForFinalImage(initialSrc,cb,attempt){
    const img=document.querySelector('img[alt="Ticket 58 mm"]');
    if(img&&img.src&&img.src!==initialSrc)return cb(img);
    if((attempt||0)>=80){ if(img&&img.src) return cb(img); return; }
    setTimeout(()=>waitForFinalImage(initialSrc,cb,(attempt||0)+1),50);
  }

  function install(){
    if(window.__fusionFase6ColumnsV6)return;
    if(typeof window.openTicket58Image!=='function')return setTimeout(install,120);
    window.__fusionFase6ColumnsV6=true;

    const baseOpen=window.openTicket58Image;
    const baseDownload=window.downloadTicket58Current;
    const baseOpenImage=window.openTicket58Current;

    window.openTicket58Image=async function(id,copy=false){
      if(patched&&patched.url){URL.revokeObjectURL(patched.url);patched=null;}
      const before=document.querySelector('img[alt="Ticket 58 mm"]');
      const initialSrc=before?before.src:'';
      const out=await baseOpen.apply(this,arguments);
      const t=(typeof tickets!=='undefined')?tickets.find(x=>String(x.id)===String(id)):null;
      if(!t)return out;

      waitForFinalImage(initialSrc,function(imgEl){
        const source=new Image();
        source.onload=function(){
          try{
            const canvas=document.createElement('canvas');
            canvas.width=source.width;
            canvas.height=source.height;
            const ctx=canvas.getContext('2d',{alpha:false});
            ctx.imageSmoothingEnabled=false;
            ctx.fillStyle='#fff';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(source,0,0);

            // Geometría final tras FASE 6 v5: primera línea numérica en y≈585, paso 70 px.
            const firstRowY=585;
            const rowStep=70;
            (t.items||[]).forEach(function(l,i){
              const y=firstRowY+i*rowStep;
              // Limpia solo la zona PRECIO/TOTAL; no toca cantidad, nombre ni separadores.
              ctx.fillStyle='#fff';
              ctx.fillRect(214,y-22,158,30);

              // PRECIO con más separación hacia la izquierda.
              ctx.fillStyle='#000';
              ctx.textAlign='right';
              ctx.font='700 18px Arial';
              ctx.fillText(plain(l.price),272,y);

              // TOTAL fijo al margen derecho.
              ctx.font='900 20px Arial';
              ctx.fillText(money(l.total),364,y);
              ctx.textAlign='left';
            });

            canvas.toBlob(function(blob){
              if(!blob)return;
              const url=URL.createObjectURL(blob);
              patched={url:url,filename:'ticket_'+String(t.number||'').replace(/^0+(?=\d)/,'')+'_'+(copy?'copia_':'')+'58mm.png'};
              imgEl.src=url;
            },'image/png');
          }catch(e){console.warn('FASE6 v6: no se pudo separar PRECIO/TOTAL',e)}
        };
        source.src=imgEl.src;
      },0);
      return out;
    };

    window.downloadTicket58Current=function(){
      if(!patched||!patched.url)return baseDownload.apply(this,arguments);
      const a=document.createElement('a');
      a.href=patched.url;
      a.download=patched.filename||'ticket_58mm.png';
      document.body.appendChild(a);a.click();a.remove();
    };

    window.openTicket58Current=function(){
      if(!patched||!patched.url)return baseOpenImage.apply(this,arguments);
      window.open(patched.url,'_blank','noopener');
    };
  }
  install();
})();
