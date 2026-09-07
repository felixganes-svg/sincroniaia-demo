// SINCRONIAIA TPV · TICKET 58 MM PNG · LAB v0.1
(function(){
  const LOGO='data:image/png;base64,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';
  const COMPANY={
    address:'RIERA DE FIGUERA MAJOR Nº2',
    cp:'08302',
    phone:'936 22 70 04'
  };
  let current58=null;

  function money58(v){return (Number(v)||0).toFixed(2).replace('.',',')+' €'}
  function plainNumber58(v){return (Number(v)||0).toFixed(2).replace('.',',')}
  function ticketNumber58(v){
    let s=String(v??'').trim();
    let n=s.replace(/^0+(?=\d)/,'');
    return n||s||'—';
  }
  function seller58(t){
    let s=typeof findSellerByName==='function'?findSellerByName(t.seller):null;
    if(s&&String(s.code||'').trim())return String(s.code).trim();
    let m=String(t.seller||'').match(/\d+/);
    return m?m[0]:String(t.seller||'—');
  }
  function dateParts58(value){
    let s=String(value||'').trim();
    let m=s.match(/(\d{1,2}\/\d{1,2}\/\d{2,4}).*?(\d{1,2}:\d{2}(?::\d{2})?)?/);
    return {date:m?.[1]||s||'—',time:m?.[2]||''};
  }
  function qty58(l){
    if(String(l.unit)==='kg')return (Number(l.qty)||0).toFixed(3).replace('.',',')+' kg';
    return String(Number(l.qty)||0).replace('.',',')+' ud';
  }
  function paymentLines58(t){
    let rows=['Pago: '+String(t.method||'—')];
    if(t.method==='Mixto'&&t.paymentBreakdown){
      let p=t.paymentBreakdown;
      if(Number(p.cash)>0)rows.push('  Efectivo: '+money58(p.cash));
      if(Number(p.card)>0)rows.push('  Tarjeta: '+money58(p.card));
      if(Number(p.bizum)>0)rows.push('  Bizum: '+money58(p.bizum));
    }
    if(t.method==='Efectivo'){
      if(Number.isFinite(Number(t.cashGiven)))rows.push('Entregado: '+money58(t.cashGiven));
      if(Number.isFinite(Number(t.change)))rows.push('Cambio: '+money58(t.change));
    }
    return rows;
  }
  function fitFont58(ctx,text,maxWidth,startPx,weight='700',family='Arial'){
    let size=startPx;
    while(size>13){
      ctx.font=weight+' '+size+'px '+family;
      if(ctx.measureText(String(text)).width<=maxWidth)break;
      size-=1;
    }
    return size;
  }
  function center58(ctx,text,y,font){
    ctx.font=font;
    ctx.textAlign='center';
    ctx.fillText(text,192,y);
    ctx.textAlign='left';
  }
  function line58(ctx,y,w=2){
    ctx.fillRect(18,y,348,w);
  }
  function loadLogo58(){
    return new Promise((resolve,reject)=>{
      let img=new Image();
      img.onload=()=>resolve(img);
      img.onerror=reject;
      img.src=LOGO;
    });
  }

  async function buildTicket58Canvas(t,copy){
    const W=384;
    const itemH=70;
    const payRows=paymentLines58(t);
    const H=565 + Math.max(1,(t.items||[]).length)*itemH + payRows.length*29 + (copy?35:0);
    let canvas=document.createElement('canvas');
    canvas.width=W; canvas.height=H;
    let ctx=canvas.getContext('2d',{alpha:false});
    ctx.imageSmoothingEnabled=false;
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#000';
    ctx.textBaseline='alphabetic';

    let y=14;
    try{
      let logo=await loadLogo58();
      let targetW=300, targetH=Math.round(logo.height*targetW/logo.width);
      ctx.drawImage(logo,(W-targetW)/2,y,targetW,targetH);
      y+=targetH+10;
    }catch(e){
      ctx.font='900 31px Arial'; center58(ctx,"CA L'ABRIL",y+36,ctx.font); y+=50;
      ctx.font='700 18px Arial'; center58(ctx,'CARNISSERIA · XARCUTERIA',y,ctx.font); y+=24;
    }
    ctx.font='700 17px Arial';
    center58(ctx,COMPANY.address,y,ctx.font); y+=23;
    center58(ctx,COMPANY.cp+'   Tlf. '+COMPANY.phone,y,ctx.font); y+=24;
    line58(ctx,y,3); y+=31;

    ctx.font='900 26px Arial'; center58(ctx,'FACTURA SIMPLIFICADA',y,ctx.font); y+=30;
    line58(ctx,y,2); y+=28;

    let dp=dateParts58(t.date);
    ctx.font='700 18px Arial';
    ctx.fillText('Fecha: '+dp.date,20,y); y+=25;
    if(dp.time){ctx.fillText('Hora: '+dp.time,20,y); y+=25;}
    ctx.fillText('Ticket nº: '+ticketNumber58(t.number),20,y); y+=25;
    ctx.fillText('Vendedor: '+seller58(t),20,y); y+=28;
    line58(ctx,y,2); y+=29;

    ctx.font='900 15px Arial';
    ctx.fillText('ARTÍCULO',20,y);
    ctx.textAlign='right';
    ctx.fillText('CANT.',205,y);
    ctx.fillText('PRECIO',286,y);
    ctx.fillText('TOTAL',364,y);
    ctx.textAlign='left';
    y+=13; line58(ctx,y,2); y+=27;

    (t.items||[]).forEach((l)=>{
      let name=String(l.name||'Artículo').toUpperCase();
      let sz=fitFont58(ctx,name,344,21,'900');
      ctx.font='900 '+sz+'px Arial';
      ctx.fillText(name,20,y); y+=27;

      ctx.font='700 18px Arial';
      ctx.fillText(qty58(l),20,y);
      ctx.textAlign='right';
      ctx.fillText(plainNumber58(l.price),286,y);
      ctx.font='900 20px Arial';
      ctx.fillText(money58(l.total),364,y);
      ctx.textAlign='left';
      y+=27;
      line58(ctx,y,1);
      y+=16;
    });

    line58(ctx,y,3); y+=41;
    ctx.font='900 34px Arial'; ctx.fillText('TOTAL',20,y);
    ctx.textAlign='right'; ctx.font='900 37px Arial'; ctx.fillText(money58(t.total),364,y); ctx.textAlign='left';
    y+=18; line58(ctx,y,3); y+=35;

    ctx.font='700 19px Arial';
    payRows.forEach(r=>{ctx.fillText(r,20,y); y+=29;});
    line58(ctx,y,2); y+=36;

    ctx.font='900 22px Arial'; center58(ctx,'GRÀCIES PER LA COMPRA!',y,ctx.font); y+=32;
    if(copy){
      ctx.font='900 25px Arial'; center58(ctx,'*** COPIA ***',y,ctx.font); y+=34;
    }
    ctx.font='700 13px Arial'; center58(ctx,'PRUEBA · NO VÁLIDO COMO TICKET FISCAL',y,ctx.font);
    return canvas;
  }

  window.openTicket58Image=async function(id,copy=false){
    let t=tickets.find(x=>String(x.id)===String(id));
    if(!t)return alert('Ticket no encontrado.');
    if(t.rectifies)return alert('La impresión 58 mm de rectificaciones se añadirá después de validar primero el ticket normal.');
    try{
      let canvas=await buildTicket58Canvas(t,copy);
      canvas.toBlob(blob=>{
        if(!blob)return alert('No se pudo generar la imagen.');
        if(current58?.url)URL.revokeObjectURL(current58.url);
        let filename='ticket_'+ticketNumber58(t.number)+'_'+(copy?'copia_':'')+'58mm.png';
        let url=URL.createObjectURL(blob);
        current58={url,filename};
        modal(
          '<h2>'+(copy?'Copia':'Ticket')+' 58 mm · nº '+esc(ticketNumber58(t.number))+'</h2>'+
          '<p class="notice"><b>Imagen PNG preparada para Fun Print.</b> Descárgala y ábrela desde Fun Print para imprimir con la mini impresora.</p>'+
          '<div style="background:#eee;padding:10px;text-align:center;border-radius:12px"><img src="'+url+'" alt="Ticket 58 mm" style="width:min(100%,384px);height:auto;background:white"></div>'+
          '<div class="grid two" style="margin-top:12px">'+
            '<button class="primary" onclick="downloadTicket58Current()">DESCARGAR IMAGEN 58 mm</button>'+
            '<button onclick="openTicket58Current()">ABRIR IMAGEN</button>'+
          '</div>'+
          '<p><button onclick="openStoredTicket(\''+String(t.id)+'\')">Volver al ticket</button> <button onclick="closeModal();render()">Cerrar</button></p>'
        );
      },'image/png');
    }catch(e){
      console.error(e);
      alert('No se pudo generar el ticket 58 mm.');
    }
  };

  window.downloadTicket58Current=function(){
    if(!current58?.url)return alert('Primero genera el ticket.');
    let a=document.createElement('a');
    a.href=current58.url; a.download=current58.filename;
    document.body.appendChild(a); a.click(); a.remove();
  };

  window.openTicket58Current=function(){
    if(!current58?.url)return alert('Primero genera el ticket.');
    window.open(current58.url,'_blank');
  };

  const receiptBefore58=receiptHtml;
  receiptHtml=function(t,reprint=false){
    let html=receiptBefore58(t,reprint);
    if(!t||t.rectifies)return html;
    let label=reprint?'REIMPRIMIR 58 MM · COPIA':'IMPRIMIR TICKET 58 MM';
    let replacement='<button class="primary" onclick="openTicket58Image(\''+String(t.id)+'\','+(reprint?'true':'false')+')">'+label+'</button>';
    html=html.replace(/<button class="primary" onclick="window\.print\(\)">[\s\S]*?<\/button>/,replacement);
    if(!reprint)html=html.replace('Cerrar y nueva venta','Cerrar sin imprimir');
    return html;
  };
})();