(function(){
  window.openQuickEdit=function(code){
    const p=products.find(x=>String(x.code)===String(code));if(!p)return;
    const area=normalizeArea(p.area),currentSub=subcats(p)[0]||sectionDefaultSubcat(area);
    const subOptions=availableSubcatsForArea(area).map(s=>'<option value="'+esc(s)+'" '+(s===currentSub?'selected':'')+'>'+esc(s)+'</option>').join('');
    sheet.innerHTML='<div class="detailName">'+esc(p.name||'—')+'</div><div class="code">Código '+esc(p.code)+'</div><div class="formgrid" style="margin-top:16px"><div><label>Nombre</label><input id="quickName" type="text" value="'+esc(p.name||'')+'"></div><div><label>Precio</label><input id="quickPrice" type="number" step="0.01" inputmode="decimal" value="'+Number(p.price||0)+'"></div><div><label>Sección</label><select id="quickArea"><option value="Carne" '+(area==='Carne'?'selected':'')+'>Carnicería</option><option value="Charcutería" '+(area==='Charcutería'?'selected':'')+'>Charcutería</option><option value="Elaborados" '+(area==='Elaborados'?'selected':'')+'>Elaborados</option></select></div><div><label>Subsección</label><select id="quickSubcat">'+subOptions+'</select></div><div><label>Estado</label><select id="quickActive"><option value="true" '+(p.active!==false?'selected':'')+'>Activo</option><option value="false" '+(p.active===false?'selected':'')+'>Inactivo</option></select></div><button class="action" onclick="saveQuickEdit('+JSON.stringify(String(p.code)).replace(/"/g,'&quot;')+')">GUARDAR CAMBIOS</button></div><button class="close" onclick="closeDetail()">CANCELAR</button>';
    modal.classList.add('show');
    document.getElementById('quickArea').addEventListener('change',()=>{
      const opts=availableSubcatsForArea(document.getElementById('quickArea').value);
      document.getElementById('quickSubcat').innerHTML=opts.map(s=>'<option value="'+esc(s)+'">'+esc(s)+'</option>').join('')
    });
  };

  window.saveQuickEdit=function(code){
    const p=products.find(x=>String(x.code)===String(code));if(!p)return;
    const name=String(document.getElementById('quickName').value||'').trim();
    if(!name)return alert('El nombre no puede quedar vacío.');
    const price=Number(document.getElementById('quickPrice').value);
    if(!Number.isFinite(price))return alert('Introduce un precio válido.');
    const newArea=document.getElementById('quickArea').value;
    const newSub=document.getElementById('quickSubcat').value||sectionDefaultSubcat(newArea);
    p.name=name;
    p.price=price;
    p.area=newArea;
    p.subcat=newSub;
    p.cat=newSub;
    p.subcats=[newSub];
    p.active=document.getElementById('quickActive').value==='true';
    saveConsultaCustom();
    closeDetail();
    if(document.getElementById('letterResultsScreen').classList.contains('active')){
      renderLetterResults();
    }else if(document.getElementById('azScreen').classList.contains('active')){
      renderLetters();renderAZ();
    }else if(document.getElementById('listScreen').classList.contains('active')){
      renderList();
    }else if(document.getElementById('adminScreen').classList.contains('active')){
      renderAdminSearch();
    }
  };

  window.editArticleSection=function(code){
    const p=products.find(x=>String(x.code)===String(code));if(!p)return;
    const area=normalizeArea(p.area),currentSub=subcats(p)[0]||sectionDefaultSubcat(area);
    const subOptions=availableSubcatsForArea(area).map(s=>'<option value="'+esc(s)+'" '+(s===currentSub?'selected':'')+'>'+esc(s)+'</option>').join('');
    sheet.innerHTML='<div class="detailName">'+esc(p.name||'—')+'</div><div class="code">Código '+esc(p.code)+'</div><div class="formgrid" style="margin-top:16px"><div><label>Nombre</label><input id="editName" type="text" value="'+esc(p.name||'')+'"></div><div><label>Sección</label><select id="editAreaSelect"><option value="Carne" '+(area==='Carne'?'selected':'')+'>Carnicería</option><option value="Charcutería" '+(area==='Charcutería'?'selected':'')+'>Charcutería</option><option value="Elaborados" '+(area==='Elaborados'?'selected':'')+'>Elaborados</option></select></div><div><label>Subsección</label><select id="editSubcatSelect">'+subOptions+'</select></div><button class="action" onclick="saveArticleSection('+JSON.stringify(String(p.code)).replace(/"/g,'&quot;')+')">GUARDAR CAMBIO</button></div><button class="close" onclick="closeDetail()">CANCELAR</button>';
    modal.classList.add('show');
    document.getElementById('editAreaSelect').addEventListener('change',()=>{
      const opts=availableSubcatsForArea(document.getElementById('editAreaSelect').value);
      document.getElementById('editSubcatSelect').innerHTML=opts.map(s=>'<option value="'+esc(s)+'">'+esc(s)+'</option>').join('')
    });
  };

  window.saveArticleSection=function(code){
    const p=products.find(x=>String(x.code)===String(code));if(!p)return;
    const name=String(document.getElementById('editName').value||'').trim();
    if(!name)return alert('El nombre no puede quedar vacío.');
    const newArea=document.getElementById('editAreaSelect').value;
    const newSub=document.getElementById('editSubcatSelect').value||sectionDefaultSubcat(newArea);
    p.name=name;
    p.area=newArea;
    p.subcat=newSub;
    p.cat=newSub;
    p.subcats=[newSub];
    saveConsultaCustom();
    closeDetail();
    renderAdminSearch();
  };
})();
