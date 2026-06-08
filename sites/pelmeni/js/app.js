/* ============================================================
   PelMen — shared app logic
   Cart + bonus + nav/footer injection + toasts
   ============================================================ */
(function(){
  const LS_CART  = 'pelmen.cart.v1';
  const LS_BONUS = 'pelmen.bonus.v1';
  const LS_USER  = 'pelmen.user.v1';

  /* ---------- State ---------- */
  const store = {
    get cart(){ try{ return JSON.parse(localStorage.getItem(LS_CART)) || []; }catch(e){ return []; } },
    set cart(v){ localStorage.setItem(LS_CART, JSON.stringify(v)); window.dispatchEvent(new Event('cart:change')); },
    get bonus(){ const v = parseInt(localStorage.getItem(LS_BONUS)); return isNaN(v) ? 480 : v; },
    set bonus(v){ localStorage.setItem(LS_BONUS, String(Math.max(0,Math.round(v)))); window.dispatchEvent(new Event('bonus:change')); },
    get user(){ try{ return JSON.parse(localStorage.getItem(LS_USER)) || {name:'Гость', tier:'Серебро', orders:7, spent:14820}; }catch(e){ return {name:'Гость'}; } },
    set user(v){ localStorage.setItem(LS_USER, JSON.stringify(v)); }
  };

  const fmt = n => new Intl.NumberFormat('ru-RU').format(Math.round(n));
  const money = n => fmt(n) + ' ₽';

  const cartCount = () => store.cart.reduce((s,i)=>s+i.qty,0);
  const cartTotal = () => store.cart.reduce((s,i)=>s+i.price*i.qty,0);

  function hash(str){ let h=0; for(let i=0;i<str.length;i++){ h=(h<<5)-h+str.charCodeAt(i); h|=0; } return Math.abs(h).toString(36); }
  function safeKey(item){
    if(item.id) return item.id;
    const basis = item.config ? JSON.stringify(item.config) : (item.title||'');
    return 'i' + hash(basis + (item.price||''));
  }
  function addToCart(item){
    const cart = store.cart;
    const key = safeKey(item);
    const found = cart.find(i => i.id === key);
    if(found){ found.qty += (item.qty||1); }
    else{ cart.push(Object.assign({qty:1}, item, {id:key})); }
    store.cart = cart;
    toast(`«${item.title}» — в корзине`, 'gold');
  }
  function setQty(id, qty){
    let cart = store.cart;
    const it = cart.find(i=>i.id===id);
    if(!it) return;
    it.qty = qty;
    if(it.qty<=0) cart = cart.filter(i=>i.id!==id);
    store.cart = cart;
  }
  function removeItem(id){ store.cart = store.cart.filter(i=>i.id!==id); }
  function clearCart(){ store.cart = []; }

  /* bonus: earn 7%, can pay up to 30% of order */
  const EARN = 0.07, MAX_PAY = 0.30;

  /* ---------- Toasts ---------- */
  let toastWrap;
  function toast(msg, kind){
    if(!toastWrap){ toastWrap = document.createElement('div'); toastWrap.className='toast-wrap'; document.body.appendChild(toastWrap); }
    const t = document.createElement('div'); t.className='toast '+(kind||'');
    t.innerHTML = `<span class="dot"></span><span>${msg}</span>`;
    toastWrap.appendChild(t);
    requestAnimationFrame(()=> t.classList.add('show'));
    setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),350); }, 2600);
  }

  /* ---------- Nav + Footer injection ---------- */
  const PAGES = [
    {href:'index.html',       label:'Главная'},
    {href:'menu.html',        label:'Меню'},
    {href:'constructor.html', label:'Конструктор'},
    {href:'bonus.html',       label:'Бонусы'},
    {href:'about.html',       label:'О нас'},
    {href:'contact.html',     label:'Контакты'}
  ];
  function curFile(){ const p = location.pathname.split('/').pop(); return p || 'index.html'; }

  function renderNav(){
    const host = document.querySelector('[data-nav]');
    if(!host) return;
    const cur = curFile();
    const isHome = ['index.html','home-2.html','home-3.html'].includes(cur);
    const links = PAGES.map(p=>{
      const active = (p.href===cur) || (isHome && p.href==='index.html');
      return `<a href="${p.href}" class="${active?'active':''}">${p.label}</a>`;
    }).join('');
    host.classList.add('nav');
    host.innerHTML = `
      <div class="wrap nav-inner">
        <a href="index.html" class="brand"><span class="mark"></span><span><b>Pel</b><i>Men</i></span></a>
        <nav class="nav-links">${links}</nav>
        <div class="nav-right">
          <a href="bonus.html" class="bonus-pill" title="Ваши баллы">✦ <span data-bonus>${fmt(store.bonus)}</span></a>
          <a href="cart.html" class="icon-btn" aria-label="Корзина">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2.2l2.1 12.4a1.6 1.6 0 0 0 1.6 1.3h8.8a1.6 1.6 0 0 0 1.6-1.3L21 7H5.5"/></svg>
            <span class="cart-count" data-cart-count>0</span>
          </a>
          <button class="icon-btn nav-burger" aria-label="Меню" data-burger>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      </div>`;

    // mobile menu
    if(!document.querySelector('.mmenu')){
      const m = document.createElement('div'); m.className='mmenu';
      m.innerHTML = `<div class="scrim" data-mclose></div><div class="sheet">
        ${PAGES.map(p=>`<a href="${p.href}" class="${p.href===cur?'active':''}">${p.label}</a>`).join('')}
        <a href="cart.html">Корзина</a>
      </div>`;
      document.body.appendChild(m);
      host.addEventListener('click', e=>{ if(e.target.closest('[data-burger]')) m.classList.add('open'); });
      m.addEventListener('click', e=>{ if(e.target.closest('[data-mclose]')) m.classList.remove('open'); });
    }
    syncNav();
  }

  function renderFooter(){
    const host = document.querySelector('[data-footer]');
    if(!host) return;
    host.classList.add('footer');
    host.innerHTML = `
      <div class="wrap">
        <div class="footer-grid">
          <div>
            <a href="index.html" class="brand" style="margin-bottom:16px"><span class="mark"></span><span><b>Pel</b><i>Men</i></span></a>
            <p class="muted" style="max-width:30ch; font-size:.95rem">Домашние пельмени ручной лепки. Собери свой рецепт — от теста до соуса. Доставка по городу за 60 минут.</p>
          </div>
          <div>
            <h4>Каталог</h4>
            <a href="menu.html">Меню продукции</a>
            <a href="constructor.html">Конструктор</a>
            <a href="menu.html">Сеты и наборы</a>
            <a href="bonus.html">Бонусная программа</a>
          </div>
          <div>
            <h4>Компания</h4>
            <a href="about.html">О производстве</a>
            <a href="contact.html">Контакты</a>
            <a href="contact.html">Сотрудничество</a>
            <a href="bonus.html">Личный кабинет</a>
          </div>
          <div>
            <h4>Связь</h4>
            <a href="tel:+78000000000">8 800 000-00-00</a>
            <a href="mailto:hi@pelmen.ru">hi@pelmen.ru</a>
            <a href="contact.html">Telegram · WhatsApp</a>
            <div style="display:flex; gap:10px; margin-top:14px">
              <span class="icon-btn" style="width:40px;height:40px">in</span>
              <span class="icon-btn" style="width:40px;height:40px">tg</span>
              <span class="icon-btn" style="width:40px;height:40px">vk</span>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 PelMen. Сделано с любовью и мукой.</span>
          <span>Политика конфиденциальности · Оферта</span>
        </div>
      </div>`;
  }

  function syncNav(){
    document.querySelectorAll('[data-cart-count]').forEach(el=>{
      const c = cartCount(); el.textContent = c; el.classList.toggle('show', c>0);
    });
    document.querySelectorAll('[data-bonus]').forEach(el=> el.textContent = fmt(store.bonus));
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal(){
    const els = document.querySelectorAll('.reveal');
    if(!els.length) return;
    const io = new IntersectionObserver((ents)=>{
      ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
    els.forEach(el=>io.observe(el));
  }

  window.addEventListener('cart:change', syncNav);
  window.addEventListener('bonus:change', syncNav);

  document.addEventListener('DOMContentLoaded', ()=>{
    renderNav(); renderFooter(); initReveal();
  });

  /* ---------- Public API ---------- */
  window.PelMen = {
    store, addToCart, setQty, removeItem, clearCart,
    cartCount, cartTotal, toast, fmt, money,
    EARN, MAX_PAY, syncNav
  };
})();
