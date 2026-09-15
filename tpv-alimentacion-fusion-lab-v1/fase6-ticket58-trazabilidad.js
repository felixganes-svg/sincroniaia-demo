// SINCRONIAIA · LAB FUSIÓN · FASE 6 v2
// Conserva el PNG 58 mm ya validado visualmente y añade trazabilidad persistida del ticket.
(function(){
  let patched58=null;

  function money(v){return (Number(v)||0).toFixed(2).replace('.',',')+' €'}
  function qty(v,unit){let n=Number(v)||0;return unit==='kg'?n.toFixed(3).replace('.',',')+' kg':String(n).replace('.',',')+' ud'}
  function wrap(ctx,text,x,y,maxWidth,lineHeight){
    let words=String(text||'').split(/\s+/),line='';
    for(let i=0;i<words.length;i++){
      let test=line?line+' '+words[i]:words[i];
      if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line,x,y);y+=lineHeight;line=words[i]}
      else line=test;
    }
    if(line){ctx.fillText(line,x,y);y+=lineHeight}
    return y;
  }
  function traces(t){
    let out=[],seen={};
    function add(kind,tr,line){
      if(!tr)return;
      let key=tr.id||[kind,tr.date,tr.reason,tr.before&&tr.before.name,tr.before&&tr.before.qty,tr.after&&tr.after.qty].join('|');
      if(seen[key])return;seen[key]=1;out.push({kind:kind,tr:tr,line:line||null});
    }
    (t&&t._openSaleCorrectionTrace||[]).forEach(tr=>add('change',tr,tr.after));
    (t&&t.items||[]).forEach(l=>((l&&l._openSaleTrace)||[]).forEach(tr=>add('change',tr,l)));
    (t&&t._removedOpenSaleTrace||[]).forEach(tr=>add('removed',tr,null));
    return out;
  }
  function hasTrace(t){return traces(t).length>0}
  function extraHeight(t){let n=traces(t).length;return n?90+n*138:0}

  function drawTrace(ctx,t,startY){
    let y=startY;
    ctx.fillStyle='#000';ctx.fillRect(18,y,348,3);y+=30;
    ctx.font='900 21px Arial';ctx.fillText('CORRECCIONES / ANULACIONES',20,y);y+=18;
    ctx.fillRect(18,y,348,2);y+=26;

    traces(t).forEach(entry=>{
      let tr=entry.tr||{};
      if(entry.kind==='removed'){
        let b=tr.before||{},unit=b.unit||'ud';
        ctx.font='900 19px Arial';ctx.fillText('ARTÍCULO ANULADO',20,y);y+=24;
        ctx.font='900 16px Arial';y=wrap(ctx,String(b.name||'Artículo').toUpperCase(),20,y,344,19);
        ctx.font='700 15px Arial';
        y=wrap(ctx,'ORIGINAL: '+qty(b.qty,unit)+' × '+money(b.price)+' = '+money(b.total),20,y,344,19);
        y=wrap(ctx,'ANULACIÓN: -'+qty(b.qty,unit)+' · -'+money(b.total),20,y,344,19);
        y=wrap(ctx,'Motivo: '+String(tr.reason||'Sin motivo'),20,y,344,19);
      }else{
        let b=tr.before||{},a=tr.after||{},unit=b.unit||(entry.line&&entry.line.unit)||'ud';
        let dq=(Number(a.qty)||0)-(Number(b.qty)||0),dt=(Number(a.total)||0)-(Number(b.total)||0);
        ctx.font='900 19px Arial';ctx.fillText('CORRECCIÓN',20,y);y+=24;
        ctx.font='900 16px Arial';y=wrap(ctx,String(b.name||(entry.line&&entry.line.name)||'Artículo').toUpperCase(),20,y,344,19);
        ctx.font='700 15px Arial';
        y=wrap(ctx,'ORIGINAL: '+qty(b.qty,unit)+' × '+money(b.price)+' = '+money(b.total),20,y,344,19);
        y=wrap(ctx,'CORRECCIÓN: '+(dq<0?'-':'+')+qty(Math.abs(dq),unit)+' · '+(dt<0?'-':'+')+money(Math.abs(dt)),20,y,344,19);
        y=wrap(ctx,'RESULTADO: '+qty(a.qty,unit)+' = '+money(a.total),20,y,344,19);
        y=wrap(ctx,'Motivo: '+String(tr.reason||'Sin motivo'),20,y,344,19);
      }
      ctx.fillRect(18,y+3,348,1);y+=24;
    });
    return y;
  }

  function waitForTicketImage(cb,attempt){
    let img=document.querySelector('img[alt="Ticket 58 mm"]');
    if(img&&img.src)return cb(img);
    if((attempt||0)>=60)return;
    setTimeout(()=>waitForTicketImage(cb,(attempt||0)+1),50);
  }

  function install(){
    if(window.__fusionFase6InstalledV2)return;
    if(typeof window.openTicket58Image!=='function' || typeof window.downloadTicket58Current!=='function' || typeof window.openTicket58Current!=='function')return setTimeout(install,120);
    window.__fusionFase6InstalledV2=true;
    const baseOpen58=window.openTicket58Image;
    const baseDownload58=window.downloadTicket58Current;
    const baseOpenImage58=window.openTicket58Current;

    window.openTicket58Image=async function(id,copy=false){
      if(patched58&&patched58.url){URL.revokeObjectURL(patched58.url);patched58=null}
      let t=(typeof tickets!=='undefined')?tickets.find(x=>String(x.id)===String(id)):null;
      let out=await baseOpen58.apply(this,arguments);
      if(!t||!hasTrace(t))return out;

      waitForTicketImage(function(img){
        let source=new Image();
        source.onload=function(){
          try{
            const W=384,extra=extraHeight(t);
            let canvas=document.createElement('canvas');canvas.width=W;canvas.height=source.height+extra;
            let ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(source,0,0,W,source.height);
            drawTrace(ctx,t,source.height+18);
            canvas.toBlob(function(blob){
              if(!blob)return;
              let url=URL.createObjectURL(blob);
              patched58={url:url,filename:'ticket_'+String(t.number||'').replace(/^0+(?=\d)/,'')+'_'+(copy?'copia_':'')+'58mm.png'};
              img.src=url;
            },'image/png');
          }catch(e){console.warn('FASE6 v2: no se pudo añadir trazabilidad al PNG 58 mm',e)}
        };
        source.src=img.src;
      },0);
      return out;
    };

    window.downloadTicket58Current=function(){
      if(!patched58||!patched58.url)return baseDownload58.apply(this,arguments);
      let a=document.createElement('a');a.href=patched58.url;a.download=patched58.filename;document.body.appendChild(a);a.click();a.remove();
    };
    window.openTicket58Current=function(){
      if(!patched58||!patched58.url)return baseOpenImage58.apply(this,arguments);
      window.open(patched58.url,'_blank','noopener');
    };
  }
  install();
})();
