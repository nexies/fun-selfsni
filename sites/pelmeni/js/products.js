/* PelMen — product catalog (shared) */
window.PRODUCTS = [
  { id:'p-sib',   cat:'classic', tag:'Хит', title:'Сибирские',         desc:'Свинина и говядина, лук, ледяная вода в тесте. Та самая классика.', price:540, weight:'500 г', spice:1 },
  { id:'p-lamb',  cat:'classic', tag:'Авторское', title:'Баранина с зирой', desc:'Сочная баранина, зира, кориандр и свежая зелень.', price:690, weight:'500 г', spice:2 },
  { id:'p-salmon',cat:'fish',    tag:'Премиум', title:'Лосось &amp; трюфель', desc:'Дальневосточный лосось, трюфельное масло, сливки.', price:920, weight:'400 г', spice:1 },
  { id:'p-crab',  cat:'fish',    tag:'Море', title:'Краб',             desc:'Камчатский краб, понзу, нотка имбиря. Нежнейшая текстура.', price:1180, weight:'400 г', spice:1 },
  { id:'p-duck',  cat:'exotic',  tag:'Экзотика', title:'Утка с грушей', desc:'Томлёная утка, груша, горгонзола. Сладко-солёный баланс.', price:840, weight:'450 г', spice:1 },
  { id:'p-venison',cat:'exotic', tag:'Дичь', title:'Оленина',          desc:'Северная оленина, можжевельник, чёрный перец.', price:990, weight:'450 г', spice:2 },
  { id:'p-mush',  cat:'vegan',   tag:'Веган', title:'Грибы &amp; рикотта', desc:'Белые грибы, рикотта, тимьян. На тесте со шпинатом.', price:620, weight:'500 г', spice:0 },
  { id:'p-spin',  cat:'vegan',   tag:'Веган', title:'Шпинат &amp; тофу', desc:'Шпинат, шёлковый тофу, мисо. Полностью растительные.', price:580, weight:'500 г', spice:1 },
  { id:'p-gedza', cat:'classic', tag:'Гёдза', title:'Курица гёдза',    desc:'Курица, капуста, имбирь. Жареные до хрустящей корочки.', price:560, weight:'450 г', spice:2 },
  { id:'p-set12', cat:'set',     tag:'Сет', title:'Дегустационный сет 12', desc:'12 разных начинок по одному пельменю. Идеально для знакомства.', price:1490, weight:'780 г', spice:1 },
  { id:'p-blind', cat:'set',     tag:'Сюрприз', title:'«Вслепую»',     desc:'Случайные начинки без подписей. Угадай, что внутри.', price:790, weight:'500 г', spice:2 },
  { id:'p-gift',  cat:'set',     tag:'Подарок', title:'Подарочный набор', desc:'Премиальные начинки в подарочной упаковке с открыткой.', price:1890, weight:'900 г', spice:1 }
];
window.CATEGORIES = [
  { key:'all',     label:'Всё' },
  { key:'classic', label:'Классика' },
  { key:'fish',    label:'Рыба и море' },
  { key:'exotic',  label:'Экзотика' },
  { key:'vegan',   label:'Веган' },
  { key:'set',     label:'Сеты и наборы' }
];
