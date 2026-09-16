// SINCRONIAIA · LAB FUSIÓN · FASE 6 v5
// Ajuste aislado de cabecera 58 mm: logo más pequeño, centrado y con espacio real antes de la dirección.
(function(){
  const LOGO='data:image/png;base64,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';
  let patched=null;

  function waitForTicketImage(cb,attempt){
    let img=document.querySelector('img[alt="Ticket 58 mm"]');
    if(img&&img.src)return cb(img);
    if((attempt||0)>=60)return;
    setTimeout(()=>waitForTicketImage(cb,(attempt||0)+1),50);
  }

  function loadLogo(){
    return new Promise((resolve,reject)=>{
      const img=new Image();
      img.onload=()=>resolve(img);
      img.onerror=reject;
      img.src=LOGO;
    });
  }

  function center(ctx,text,y,font){
    ctx.font=font;
    ctx.textAlign='center';
    ctx.fillText(text,192,y);
    ctx.textAlign='left';
  }

  function install(){
    if(window.__fusionFase6LogoV5)return;
    if(typeof window.openTicket58Image!=='function')return setTimeout(install,120);
    window.__fusionFase6LogoV5=true;

    const baseOpen=window.openTicket58Image;
    const baseDownload=window.downloadTicket58Current;
    const baseOpenImage=window.openTicket58Current;

    window.openTicket58Image=async function(){
      if(patched&&patched.url){URL.revokeObjectURL(patched.url);patched=null;}
      const out=await baseOpen.apply(this,arguments);

      waitForTicketImage(async function(imgEl){
        const source=new Image();
        source.onload=async function(){
          try{
            const logo=await loadLogo();
            const W=384;
            const OLD_BODY_Y=315;
            const NEW_BODY_Y=320;
            const NEW_H=source.height+(NEW_BODY_Y-OLD_BODY_Y);
            const canvas=document.createElement('canvas');
            canvas.width=W;
            canvas.height=NEW_H;
            const ctx=canvas.getContext('2d',{alpha:false});
            ctx.imageSmoothingEnabled=false;
            ctx.fillStyle='#fff';
            ctx.fillRect(0,0,W,NEW_H);
            ctx.fillStyle='#000';
            ctx.textBaseline='alphabetic';

            // Cabecera corregida: logo más pequeño y centrado.
            const logoW=230;
            const logoH=Math.round(logo.height*logoW/logo.width);
            const logoX=Math.round((W-logoW)/2);
            const logoY=14;
            ctx.drawImage(logo,logoX,logoY,logoW,logoH);

            // Espacio real entre logo y dirección.
            let y=logoY+logoH+34;
            ctx.font='700 17px Arial';
            center(ctx,'Riera de Figuera Major N.2',y,ctx.font); y+=24;
            center(ctx,'Mataró',y,ctx.font); y+=24;
            center(ctx,'Telf. 936 22 70 04',y,ctx.font); y+=31;

            // Conserva desde la línea anterior a FACTURA SIMPLIFICADA hacia abajo.
            ctx.drawImage(source,0,OLD_BODY_Y,W,source.height-OLD_BODY_Y,0,NEW_BODY_Y,W,source.height-OLD_BODY_Y);

            canvas.toBlob(function(blob){
              if(!blob)return;
              const url=URL.createObjectURL(blob);
              patched={url:url,filename:(imgEl.src.match(/ticket_[^/]+\.png/)||['ticket_58mm.png'])[0]};
              imgEl.src=url;
            },'image/png');
          }catch(e){
            console.warn('FASE6 v5: no se pudo centrar la cabecera',e);
          }
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
