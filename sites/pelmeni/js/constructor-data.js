/* ============================================================
   PelMen constructor — option data
   Each step has fields; each field has options with price deltas.
   Special keys: color (dough), shapeClass, texClass, sauceColor, mult
   ============================================================ */
window.BASE_PRICE = 360;

window.STEPS = [
  {
    id:'dough', num:1, title:'Тесто', hint:'Основа вашего пельменя — мука, цвет и добавки для текстуры.',
    fields:[
      { key:'flour', label:'Тип муки', type:'single', options:[
        {id:'wheat', name:'Пшеничная', desc:'Классика, эластичное тесто', price:0},
        {id:'rye',   name:'Ржаная',    desc:'Плотная, с лёгкой кислинкой', price:30},
        {id:'chick', name:'Нутовая',   desc:'Ореховый вкус, больше белка', price:40},
        {id:'rice',  name:'Рисовая',   desc:'Нежная, полупрозрачная', price:40},
        {id:'buck',  name:'Гречневая', desc:'Землистая, ароматная', price:35},
        {id:'gf',    name:'Безглютеновая', desc:'Без пшеницы', price:60},
      ]},
      { key:'doughColor', label:'Цвет теста', type:'single', affects:'dough', options:[
        {id:'nat',  name:'Натуральный',  desc:'Тёплый кремовый', price:0,  color:'#e7cfa6'},
        {id:'green',name:'Зелёный',      desc:'Шпинат',          price:40, color:'#9fb46a'},
        {id:'red',  name:'Красный',      desc:'Свёкла',          price:40, color:'#c65a6a'},
        {id:'black',name:'Чёрный',       desc:'Чернила кальмара', price:90, color:'#39343f'},
        {id:'yellow',name:'Жёлтый',      desc:'Куркума',         price:30, color:'#e6c34d'},
      ]},
      { key:'doughAdd', label:'Добавки для мягкости', type:'multi', max:2, options:[
        {id:'egg',  name:'Яйцо',           desc:'Богаче, плотнее', price:20},
        {id:'kefir',name:'Кефир',          desc:'Мягкость и нежность', price:20},
        {id:'potato',name:'Картофельное пюре', desc:'Тает во рту', price:25},
      ]},
    ]
  },
  {
    id:'fill', num:2, title:'Начинка', hint:'Главный герой. Выберите одну основу.',
    fields:[
      { key:'protein', label:'', type:'single', groups:[
        { label:'Классика', options:[
          {id:'porkbeef', name:'Свинина + говядина', desc:'Та самая классика', price:0},
          {id:'lamb', name:'Баранина', desc:'Сочная, с характером', price:90},
          {id:'chicken', name:'Курица', desc:'Лёгкая, нежная', price:0},
          {id:'turkey', name:'Индейка', desc:'Диетическая', price:40},
        ]},
        { label:'Рыба и морепродукты', options:[
          {id:'salmon', name:'Лосось', desc:'Жирный, ароматный', price:180},
          {id:'pike', name:'Щука', desc:'Речная классика', price:120},
          {id:'crab', name:'Краб', desc:'Камчатский, нежный', price:260},
          {id:'octopus', name:'Осьминог', desc:'Упругий, морской', price:220},
          {id:'scallop', name:'Гребешок', desc:'Сладковатый', price:240},
        ]},
        { label:'Экзотика', options:[
          {id:'duck', name:'Утка', desc:'Томлёная, насыщенная', price:160},
          {id:'venison', name:'Оленина', desc:'Северная дичь', price:220},
          {id:'quail', name:'Перепел', desc:'Деликатес', price:180},
          {id:'rabbit', name:'Кролик', desc:'Нежнейшее мясо', price:150},
        ]},
        { label:'Веган', options:[
          {id:'mush', name:'Грибы', desc:'Белые, с тимьяном', price:60},
          {id:'lentil', name:'Чечевица', desc:'Сытная база', price:30},
          {id:'tofu', name:'Тофу', desc:'Шёлковый, с мисо', price:50},
          {id:'pea', name:'Нут', desc:'Пряный', price:30},
          {id:'cabbage', name:'Капуста', desc:'Постная классика', price:0},
          {id:'spinach', name:'Шпинат + рикотта', desc:'Сливочный', price:70},
        ]},
      ]},
    ]
  },
  {
    id:'addins', num:3, title:'Добавки в начинку', hint:'До 3 акцентов, что раскроют вкус.',
    fields:[
      { key:'addins', label:'', type:'multi', max:3, groups:[
        { label:'Овощи', options:[
          {id:'onion', name:'Лук', price:15},{id:'garlic', name:'Чеснок', price:15},
          {id:'ginger', name:'Имбирь', price:15},{id:'zucchini', name:'Кабачок', price:15},
        ]},
        { label:'Сыры внутри', options:[
          {id:'ricotta', name:'Рикотта', price:50},{id:'feta', name:'Фета', price:50},
          {id:'suluguni', name:'Сулугуни', price:45},{id:'parmesan', name:'Пармезан', price:60},
        ]},
        { label:'Деликатесы', options:[
          {id:'truffle', name:'Трюфель', price:150},{id:'sundried', name:'Вяленые томаты', price:40},
          {id:'olives', name:'Оливки', price:30},
        ]},
        { label:'Сладкие', options:[
          {id:'apple', name:'Яблоко + корица', price:30},{id:'pear', name:'Груша + горгонзола', price:70},
          {id:'berries', name:'Ягоды', price:40},
        ]},
        { label:'Необычное', options:[
          {id:'choco', name:'Шоколад + острый перец', price:50},{id:'miso', name:'Мисо-паста', price:40},
        ]},
      ]},
    ]
  },
  {
    id:'spice', num:4, title:'Специи и маринад', hint:'Профиль приправ для фарша.',
    fields:[
      { key:'spice', label:'', type:'single', options:[
        {id:'classic', name:'Классика', desc:'Соль, перец, мускатный орех', price:0},
        {id:'asian', name:'Азиатский', desc:'Соевый соус, имбирь, кунжут', price:30},
        {id:'medit', name:'Средиземноморский', desc:'Зира, кориандр, паприка', price:30},
        {id:'hot', name:'Острый', desc:'Чипотле, харисса, васаби', price:35},
      ]},
    ]
  },
  {
    id:'shape', num:5, title:'Форма', hint:'Как будет выглядеть ваш пельмень.',
    fields:[
      { key:'shape', label:'', type:'single', affects:'shape', options:[
        {id:'classic', name:'Классическое ушко', price:0,  shapeClass:'s-classic'},
        {id:'sib', name:'Сибирские (мини)', price:0, shapeClass:'s-sib'},
        {id:'giant', name:'Пельмень-гигант', price:50, shapeClass:'s-giant'},
        {id:'tri', name:'Треугольник', price:20, shapeClass:'s-tri'},
        {id:'rose', name:'Розочка', price:60, shapeClass:'s-rose'},
        {id:'braid', name:'Косичка', price:50, shapeClass:'s-braid'},
        {id:'ravioli', name:'Равиоли (квадрат)', price:20, shapeClass:'s-square'},
      ]},
    ]
  },
  {
    id:'size', num:6, title:'Размер', hint:'Сколько теста на один укус.',
    fields:[
      { key:'size', label:'', type:'single', options:[
        {id:'mini', name:'Мини', desc:'На один укус', price:0, mult:0.9},
        {id:'std', name:'Стандарт', desc:'Привычный размер', price:0, mult:1},
        {id:'xxl', name:'XXL', desc:'Один пельмень — порция', price:0, mult:1.3},
      ]},
    ]
  },
  {
    id:'cook', num:7, title:'Приготовление', hint:'Текстурный слой — от нежного до хрустящего.',
    fields:[
      { key:'cook', label:'', type:'single', affects:'texture', options:[
        {id:'boiled', name:'Отварные', desc:'Классика', price:0, texClass:''},
        {id:'gedza', name:'Жареные (гёдза)', desc:'Хрустящая корочка', price:40, texClass:'t-fried'},
        {id:'baked', name:'Запечённые', desc:'В духовке, румяные', price:40, texClass:''},
        {id:'deep', name:'Во фритюре', desc:'Хрустят целиком', price:50, texClass:'t-fried'},
        {id:'steam', name:'На пару', desc:'Лёгкие, диетические', price:30, texClass:''},
      ]},
    ]
  },
  {
    id:'serve', num:8, title:'Подача и соус', hint:'Как подать и чем дополнить.',
    fields:[
      { key:'serve', label:'Способ подачи', type:'single', options:[
        {id:'dry', name:'Сухие с соусом', price:0},
        {id:'broth', name:'В бульоне', desc:'Говяжий / мисо / том ям', price:60},
        {id:'cream', name:'В сливочном соусе', price:80},
        {id:'skewer', name:'На шпажке (стрит-фуд)', price:50},
      ]},
      { key:'sauce', label:'Соус', type:'single', affects:'sauce', options:[
        {id:'sourcream', name:'Сметана', price:20, sauceColor:'#efe7d6'},
        {id:'butter', name:'Масло + зелень', price:20, sauceColor:'#b8c97a'},
        {id:'vinegar', name:'Уксус с луком', price:10, sauceColor:'#d8c9a0'},
        {id:'chili', name:'Острый чили', price:25, sauceColor:'#c2301f'},
        {id:'teriyaki', name:'Терияки', price:30, sauceColor:'#5b3318'},
        {id:'truffleoil', name:'Трюфельное масло', price:90, sauceColor:'#b9a76a'},
        {id:'ponzu', name:'Понзу', price:30, sauceColor:'#8a6a2a'},
      ]},
    ]
  },
  {
    id:'persona', num:9, title:'Персонализация', hint:'Сделайте набор особенным.',
    fields:[
      { key:'persona', label:'Оформление', type:'multi', max:2, options:[
        {id:'print', name:'Съедобный принт', desc:'Рисунок на тесте', price:90},
        {id:'theme', name:'Тематический набор', desc:'Новогодний / детский / романтический', price:70},
      ]},
      { key:'stamp', label:'Именной штамп на пельмене', type:'stamp', price:60 },
    ]
  },
  {
    id:'pack', num:10, title:'Упаковка и повод', hint:'Финальный штрих перед заказом.',
    fields:[
      { key:'pack', label:'', type:'single', options:[
        {id:'standard', name:'Стандартная', desc:'Фирменная коробка', price:0},
        {id:'gift', name:'Подарочная упаковка', desc:'С открыткой и лентой', price:150},
        {id:'blind', name:'«Вслепую»', desc:'Начинки без подписей', price:0},
        {id:'tasting', name:'Дегустационный сет', desc:'12 разных пельменей', price:200},
      ]},
    ]
  },
];

/* default selections */
window.DEFAULTS = {
  flour:'wheat', doughColor:'nat', doughAdd:['egg'],
  protein:'porkbeef', addins:['onion'], spice:'classic',
  shape:'classic', size:'std', cook:'boiled',
  serve:'dry', sauce:'sourcream', persona:[], stamp:'',
  pack:'standard'
};
