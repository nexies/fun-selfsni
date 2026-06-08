/* ============================================================
   PelMen constructor — engine
   ============================================================ */
(function(){
  const state = Object.assign({}, DEFAULTS, {qty:1});
  try{ const saved = JSON.parse(localStorage.getItem('pelmen.builder')); if(saved) Object.assign(state, saved); }catch(e){}

  // ---- option lookup by field key ----
  const fieldMap = {};   // key -> field
  const optMap   = {};   // key -> {id->opt}
  STEPS.forEach(s=> s.fields.forEach(f=>{
    fieldMap[f.key]=f; optMap[f.key]={};
    const all = f.groups ? f.groups.flatMap(g=>g.options) : (f.options||[]);
    all.forEach(o=> optMap[f.key][o.id]=o);
  }));

  const save = ()=> localStorage.setItem('pelmen.builder', JSON.stringify(state));

  /* ---------------- RENDER STEP NAV ---------------- */
  const stepNav = document.getElementById('stepNav');
  stepNav.innerHTML = `<div class="inner">${STEPS.map(s=>
    `<button class="snav" data-go="${s.id}"><span class="num">${s.num}</span>${s.title}</button>`).join('')}</div>`;
  stepNav.addEventListener('click', e=>{
    const b=e.target.closest('[data-go]'); if(!b) return;
    const el=document.getElementById('step-'+b.dataset.go);
    const y=el.getBoundingClientRect().top+window.scrollY-150;
    window.scrollTo({top:y, behavior:'smooth'});
  });

  /* ---------------- RENDER STEPS ---------------- */
  const stepsHost = document.getElementById('steps');
  function optCard(fkey, o, selected){
    const f=fieldMap[fkey];
    const swatch = (f.affects==='dough' && o.color) ? `<span class="o-swatch" style="background:${o.color}"></span>` : '';
    const price = o.price ? `<span class="o-price">+${o.price} ₽</span>` : (o.mult && o.mult!==1 ? `<span class="o-price">×${o.mult}</span>` : '');
    return `<button class="opt ${selected?'sel':''}" data-field="${fkey}" data-opt="${o.id}">
      ${swatch}
      <span class="o-name">${o.name}</span>
      ${o.desc?`<span class="o-desc">${o.desc}</span>`:''}
      ${price}
      <span class="check">✓</span>
    </button>`;
  }
  function fieldHtml(f){
    const sel = state[f.key];
    if(f.type==='stamp'){
      return `<div>${f.label?`<div class="subgroup-label">${f.label}</div>`:''}
        <div class="stamp-input">
          <input class="input" maxlength="14" placeholder="Например: Анна, ❤, С Новым годом" data-stamp value="${sel||''}">
        </div>
        <p class="note">+${f.price} ₽ за персональный штамп · оставьте пустым, если не нужно.</p></div>`;
    }
    const renderOpts = (opts)=> `<div class="opt-grid">${opts.map(o=>{
      const isSel = f.type==='multi' ? (sel||[]).includes(o.id) : sel===o.id;
      return optCard(f.key,o,isSel);
    }).join('')}</div>`;
    let inner;
    if(f.groups){
      inner = f.groups.map(g=>`<div class="subgroup-label">${g.label}</div>${renderOpts(g.options)}`).join('');
    } else {
      inner = renderOpts(f.options);
    }
    const lbl = f.label ? `<div class="subgroup-label">${f.label}${f.type==='multi'?` · до ${f.max}`:''}</div>` : '';
    return lbl+inner;
  }
  stepsHost.innerHTML = STEPS.map(s=>`
    <section class="step-card" id="step-${s.id}">
      <div class="sc-head"><span class="sc-n">${String(s.num).padStart(2,'0')}</span><h2>${s.title}</h2></div>
      <p class="sc-hint">${s.hint}</p>
      ${s.fields.map(fieldHtml).join('')}
    </section>`).join('');

  /* ---------------- INTERACTION ---------------- */
  stepsHost.addEventListener('click', e=>{
    const b=e.target.closest('.opt'); if(!b) return;
    const fkey=b.dataset.field, oid=b.dataset.opt, f=fieldMap[fkey];
    if(f.type==='multi'){
      let arr=state[fkey]?state[fkey].slice():[];
      if(arr.includes(oid)) arr=arr.filter(x=>x!==oid);
      else { if(f.max && arr.length>=f.max){ PelMen.toast(`Можно выбрать не больше ${f.max}`); return; } arr.push(oid); }
      state[fkey]=arr;
    } else {
      state[fkey]=oid;
    }
    save(); paintField(fkey); update();
  });
  stepsHost.addEventListener('input', e=>{
    if(e.target.matches('[data-stamp]')){ state.stamp=e.target.value.trim(); save(); update(); }
  });
  function paintField(fkey){
    const f=fieldMap[fkey], sel=state[fkey];
    stepsHost.querySelectorAll(`.opt[data-field="${fkey}"]`).forEach(b=>{
      const on = f.type==='multi' ? (sel||[]).includes(b.dataset.opt) : sel===b.dataset.opt;
      b.classList.toggle('sel', on);
    });
  }

  /* ---------------- PRICE + PREVIEW ---------------- */
  function priceOf(fkey){
    const f=fieldMap[fkey], sel=state[fkey]; if(sel==null) return 0;
    if(f.type==='stamp') return sel ? f.price : 0;
    if(f.type==='multi') return (sel||[]).reduce((s,id)=> s+(optMap[fkey][id]?.price||0),0);
    return optMap[fkey][sel]?.price||0;
  }
  function calc(){
    let sum = BASE_PRICE;
    Object.keys(fieldMap).forEach(k=> sum+=priceOf(k));
    const mult = optMap.size[state.size]?.mult || 1;
    return Math.round(sum*mult);
  }

  const dumpling=document.getElementById('dumpling'),
        stamp=document.getElementById('stamp'),
        saucePool=document.getElementById('saucePool'),
        pvName=document.getElementById('pvName'),
        pvTags=document.getElementById('pvTags'),
        pvPrice=document.getElementById('pvPrice'),
        pvBonus=document.getElementById('pvBonus'),
        qtyVal=document.getElementById('qtyVal');

  const colorAdj={green:'зелёном',red:'свекольном',black:'чёрном',yellow:'жёлтом'};

  function update(){
    // dough color
    const dc=optMap.doughColor[state.doughColor];
    if(dc) dumpling.style.setProperty('--dough', dc.color);
    // shape
    const shapeClasses=['s-classic','s-sib','s-giant','s-tri','s-rose','s-braid','s-square'];
    dumpling.classList.remove(...shapeClasses);
    const sh=optMap.shape[state.shape]; if(sh?.shapeClass) dumpling.classList.add(sh.shapeClass);
    // texture
    dumpling.classList.remove('t-fried');
    const ck=optMap.cook[state.cook]; if(ck?.texClass) dumpling.classList.add(ck.texClass);
    // sauce
    const sc=optMap.sauce[state.sauce];
    if(sc?.sauceColor){ saucePool.style.setProperty('--sauce', sc.sauceColor); saucePool.classList.add('show'); }
    else saucePool.classList.remove('show');
    // stamp
    stamp.textContent = state.stamp ? state.stamp.slice(0,3) : '';
    // name
    const prot=optMap.protein[state.protein];
    let name = prot?prot.name:'Пельмень';
    if(state.doughColor!=='nat') name += ` на ${colorAdj[state.doughColor]} тесте`;
    pvName.textContent = name;
    // tags
    const tags=[];
    if(optMap.shape[state.shape]) tags.push(optMap.shape[state.shape].name);
    if(optMap.size[state.size]) tags.push(optMap.size[state.size].name);
    if(optMap.cook[state.cook]) tags.push(optMap.cook[state.cook].name);
    if(optMap.serve[state.serve]) tags.push(optMap.serve[state.serve].name);
    if(optMap.sauce[state.sauce]) tags.push(optMap.sauce[state.sauce].name);
    if(optMap.spice[state.spice] && state.spice!=='classic') tags.push(optMap.spice[state.spice].name);
    pvTags.innerHTML = tags.map(t=>`<span class="pt">${t}</span>`).join('');
    // price
    const unit=calc();
    pvPrice.textContent = PelMen.money(unit*state.qty);
    pvBonus.textContent = `+${Math.round(unit*state.qty*PelMen.EARN)} баллов на счёт`;
    qtyVal.textContent = state.qty;
    // step nav done state
    document.querySelectorAll('.snav').forEach(s=> s.classList.toggle('done', true));
  }

  /* qty */
  document.getElementById('qty').addEventListener('click', e=>{
    const b=e.target.closest('[data-q]'); if(!b) return;
    state.qty=Math.max(1, state.qty+parseInt(b.dataset.q)); save(); update();
  });

  /* random */
  document.getElementById('randomBtn').addEventListener('click', ()=>{
    Object.values(fieldMap).forEach(f=>{
      if(f.type==='stamp') return;
      const all=f.groups?f.groups.flatMap(g=>g.options):f.options;
      if(f.type==='multi'){
        const n=Math.floor(Math.random()*((f.max||2)+1));
        const shuffled=all.slice().sort(()=>Math.random()-.5);
        state[f.key]=shuffled.slice(0,n).map(o=>o.id);
      } else {
        state[f.key]=all[Math.floor(Math.random()*all.length)].id;
      }
    });
    save();
    Object.keys(fieldMap).forEach(paintField);
    update();
    PelMen.toast('Случайный рецепт собран! 🎲','gold');
    window.scrollTo({top:0,behavior:'smooth'});
  });

  /* add to cart */
  document.getElementById('addBtn').addEventListener('click', ()=>{
    const unit=calc();
    const cfg={};
    Object.keys(fieldMap).forEach(k=>{
      const f=fieldMap[k];
      if(f.type==='stamp'){ if(state[k]) cfg[f.key]=state[k]; }
      else if(f.type==='multi'){ cfg[f.key]=(state[k]||[]).map(id=>optMap[k][id].name); }
      else { cfg[f.key]=optMap[k][state[k]]?.name; }
    });
    PelMen.addToCart({
      title: pvName.textContent,
      price: unit,
      qty: state.qty,
      kind:'custom',
      config: cfg,
      meta:`${optMap.shape[state.shape]?.name} · ${optMap.size[state.size]?.name}`
    });
    PelMen.toast('Ваш пельмень в корзине ✦','gold');
  });

  // initial paint
  Object.keys(fieldMap).forEach(paintField);
  update();

  /* scroll-spy for step nav */
  const io=new IntersectionObserver((ents)=>{
    ents.forEach(e=>{ if(e.isIntersecting){
      const id=e.target.id.replace('step-','');
      document.querySelectorAll('.snav').forEach(s=> s.classList.toggle('active', s.dataset.go===id));
    }});
  },{rootMargin:'-150px 0px -55% 0px'});
  STEPS.forEach(s=> io.observe(document.getElementById('step-'+s.id)));
})();
