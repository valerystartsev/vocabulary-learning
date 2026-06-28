export const unit1 = {
  id: 1,
  // Flags that toggle data-driven optional sections (Phase 3 / R2)
  mediaQuest: true,           // → renders MediaQuest section after MediaLab
  // R3: declarative section list — drives nav strip + render loop order
  sections: [
    'header', 'keyideas', 'marketstructures', 'dictionary', 'comics', 'exercises',
    'reading', 'comprehension', 'media', 'mediaquest', 'crossword',
    'complaintpath', 'dialogue', 'writing', 'scenario', 'totaltest',
    'answerkey', 'summary',
  ],
  title: "Markets & Monopolies",
  subtitle: "How buyers, sellers, and companies shape the economy",
  description: "Learn key business terms about markets, competition, and monopolies. Understand how companies compete and what happens when one company controls everything.",
  descriptionRu: "Изучите ключевые бизнес-термины о рынках, конкуренции и монополиях. Поймите, как компании конкурируют и что происходит, когда одна компания контролирует всё.",
  keyIdeas: [
    {
      term: "Market",
      termRu: "Рынок",
      meaning: "A place where buyers and sellers meet to trade goods and services.",
      meaningRu: "Место, где покупатели и продавцы встречаются для торговли товарами и услугами.",
      icon: "Store"
    },
    {
      term: "Competition",
      termRu: "Конкуренция",
      meaning: "Companies fight to get customers by offering better products or lower prices.",
      meaningRu: "Компании борются за клиентов, предлагая лучшие товары или более низкие цены.",
      icon: "Swords"
    },
    {
      term: "Monopoly",
      termRu: "Монополия",
      meaning: "One company controls the whole market. There is no competition.",
      meaningRu: "Одна компания контролирует весь рынок. Конкуренции нет.",
      icon: "Crown"
    }
  ],

  // Market Structure Compass — 4 textbook market structures along the
  // spectrum from many sellers to one. Renders as a 2×2 expandable grid.
  marketStructures: [
    {
      id: 'perfect-competition',
      title: 'Perfect Competition',
      titleRu: 'Совершенная конкуренция',
      icon: 'Users',
      sellers: 'Many small sellers, identical products',
      sellersRu: 'Много мелких продавцов, одинаковые товары',
      priceControl: 'None — every seller is a price-taker',
      priceControlRu: 'Нет — каждый продавец принимает рыночную цену',
      barriers: 'Very low — anyone can enter or leave the market',
      barriersRu: 'Очень низкие — любой может выйти на рынок и уйти с него',
      example: "Local farmers selling tomatoes at a street market. No single farmer can charge more than the others — buyers would simply switch.",
      exampleRu: 'Местные фермеры на уличном рынке: ни один не может назначить цену выше других — покупатели уйдут к соседу.',
    },
    {
      id: 'monopolistic-competition',
      title: 'Monopolistic Competition',
      titleRu: 'Монополистическая конкуренция',
      icon: 'Layers',
      sellers: 'Many sellers, but each offers a slightly different product',
      sellersRu: 'Много продавцов, но у каждого товар чуть-чуть другой',
      priceControl: 'Some — sellers compete on quality, brand, location',
      priceControlRu: 'Небольшой — конкурируют качеством, брендом, расположением',
      barriers: 'Low — branding takes time but legal entry is open',
      barriersRu: 'Низкие — нужен бренд, но законодательно вход открыт',
      example: 'Coffee shops on the same street: each has its own brand, atmosphere and price, yet they all compete for similar customers.',
      exampleRu: 'Кофейни на одной улице: у каждой свой бренд, атмосфера и цена, но конкурируют за одних и тех же клиентов.',
    },
    {
      id: 'oligopoly',
      title: 'Oligopoly',
      titleRu: 'Олигополия',
      icon: 'Users2',
      sellers: 'A few large sellers dominate the market',
      sellersRu: 'Несколько крупных продавцов доминируют на рынке',
      priceControl: 'Significant — sellers watch each other and react',
      priceControlRu: 'Значительный — продавцы следят друг за другом и реагируют',
      barriers: 'High — huge capital, technology or licences required',
      barriersRu: 'Высокие — нужны капитал, технологии или лицензии',
      example: 'Mobile network operators: usually 3–4 in any country. They compete fiercely but rarely undercut each other for long.',
      exampleRu: 'Сотовые операторы: обычно 3–4 в стране. Конкурируют жёстко, но долгие ценовые войны редки.',
    },
    {
      id: 'monopoly',
      title: 'Monopoly',
      titleRu: 'Монополия',
      icon: 'Crown',
      sellers: 'One seller controls the whole market',
      sellersRu: 'Один продавец контролирует весь рынок',
      priceControl: 'Full — the monopolist sets the price',
      priceControlRu: 'Полный — монополист сам назначает цену',
      barriers: 'Very high — often a patent, a state licence or natural barrier',
      barriersRu: 'Очень высокие — часто патент, государственная лицензия или естественный барьер',
      example: "A railway company that owns the only line between two cities. Travellers either pay its price or don't travel.",
      exampleRu: 'Железная дорога, которой принадлежит единственная линия между двумя городами: либо платишь её цену, либо не едешь.',
    },
  ],

  // Complaint Resolution Path — 4-step horizontal stepper showing how
  // a customer complaint is handled, with Unit 1 vocab surfaced
  // naturally at each step.
  complaintPath: {
    intro: "When a customer is unhappy, the resolution follows four standard steps. Tap each step to see the vocabulary used in real shops.",
    introRu: "Когда клиент недоволен, разбор жалобы проходит четыре стандартных шага. Нажмите на шаг, чтобы увидеть лексику, которую используют в реальных магазинах.",
    steps: [
      {
        id: 'complaint',
        title: 'Complaint received',
        titleRu: 'Жалоба получена',
        icon: 'AlertCircle',
        what: 'The customer files a formal complaint about a damaged or undesirable product.',
        whatRu: 'Клиент подаёт официальную жалобу на повреждённый или некачественный товар.',
        vocab: 'The customer **complains** that the delivered product was **damaged** in transit and files a written **complaint**.',
        vocabRu: 'Клиент **жалуется**, что товар был **повреждён** при доставке, и подаёт письменную **жалобу**.',
      },
      {
        id: 'investigation',
        title: 'Investigation',
        titleRu: 'Рассмотрение',
        icon: 'Search',
        what: 'The shop checks the circumstances — was the damage caused by the supplier, the courier, or the customer?',
        whatRu: 'Магазин выясняет обстоятельства — кто виноват в повреждении: поставщик, курьер или сам клиент?',
        vocab: 'Under these **circumstances**, the manager **communicates** with the courier to find out what **caused** the damage.',
        vocabRu: 'При данных **обстоятельствах** менеджер **связывается** с курьером, чтобы выяснить, что **вызвало** повреждение.',
      },
      {
        id: 'decision',
        title: 'Decision',
        titleRu: 'Решение',
        icon: 'Scale',
        what: 'The authority decides whether the customer is entitled to a refund, a replacement, or an apology only.',
        whatRu: 'Уполномоченное лицо решает, имеет ли клиент право на возврат, замену или только извинение.',
        vocab: 'The store **authority** confirms the customer is **entitled** to a full **refund** under the original **deal**.',
        vocabRu: 'Руководство магазина подтверждает, что клиент **имеет право** на полный **возврат** по условиям первоначальной **сделки**.',
      },
      {
        id: 'outcome',
        title: 'Outcome',
        titleRu: 'Итог',
        icon: 'CheckCircle2',
        what: 'The shop refunds the money, replaces the product, or — if the order is no longer needed — cancels it.',
        whatRu: 'Магазин возвращает деньги, заменяет товар или, если заказ больше не нужен, отменяет его.',
        vocab: 'The shop processes the **refund** within 5 working days. The original order is **cancelled** and a new product is dispatched.',
        vocabRu: 'Магазин обрабатывает **возврат** в течение 5 рабочих дней. Первоначальный заказ **отменён**, новый товар отправлен.',
      },
    ],
  },

  vocabulary: [
    {
      id: "u1_accept",
      term: "accept",
      pos: "verb",
      translationRu: "принимать, соглашаться",
      trick: "A+C+C+E+P+T — представь, что открываешь дверь и впускаешь что-то внутрь. Accept = пустить, принять.",
      meaningEn: "To say 'yes' to something. To agree to take something.",
      meaningRu: "Говорить «да» чему-то. Соглашаться принять что-то.",
      example: "The company will accept your offer if the price is good.",
      collocations: ["accept an offer (принять предложение)", "accept a complaint (принять жалобу)", "accept the terms (принять условия)"]
    },
    {
      id: "u1_acceptance",
      term: "acceptance",
      pos: "noun",
      translationRu: "принятие, согласие",
      trick: "accept + -ance = состояние, когда решение уже принято. Дверь уже открыта.",
      meaningEn: "The act of saying 'yes'. Agreement to take something.",
      meaningRu: "Действие, когда вы говорите «да». Согласие принять что-то.",
      example: "The acceptance of the new rules was quick.",
      collocations: ["gain acceptance (получить признание)", "letter of acceptance (письмо о принятии)", "general acceptance (общее принятие)"]
    },
    {
      id: "u1_affect",
      term: "affect",
      pos: "verb",
      translationRu: "влиять, воздействовать",
      trick: "Affect → effect. A стоит перед E — сначала действие (affect), потом результат (effect).",
      meaningEn: "To change something. To have an influence on something.",
      meaningRu: "Менять что-то. Оказывать влияние на что-то.",
      example: "Bad weather can affect the price of food.",
      collocations: ["affect prices (влиять на цены)", "affect the market (влиять на рынок)", "negatively affect (негативно воздействовать)"]
    },
    {
      id: "u1_authorize",
      term: "authorize",
      pos: "verb",
      translationRu: "разрешать, уполномочивать",
      trick: "AUTHOR + ize — тот, кто написал правила, тот и даёт разрешение действовать.",
      meaningEn: "To give official permission for something.",
      meaningRu: "Давать официальное разрешение на что-то.",
      example: "The manager must authorize all big purchases.",
      collocations: ["authorize a payment (авторизовать платёж)", "authorize access (разрешить доступ)", "formally authorize (официально уполномочить)"]
    },
    {
      id: "u1_authority",
      term: "authority",
      pos: "noun",
      translationRu: "власть, полномочия, орган власти",
      trick: "AUTHOR + ity — тот, чьи правила все соблюдают. Как 'авторитет' — источник власти.",
      meaningEn: "The power to make decisions. A person or group that controls something.",
      meaningRu: "Власть принимать решения. Человек или группа, которая что-то контролирует.",
      example: "The government authority controls business rules.",
      collocations: ["legal authority (законные полномочия)", "have authority over (иметь власть над)", "regulatory authority (регулирующий орган)"]
    },
    {
      id: "u1_breakeven",
      term: "break even",
      pos: "verb phrase",
      translationRu: "выйти в ноль, окупиться",
      trick: "Break even = сделать числа равными. Доходы и расходы уравновешиваются — ни плюс, ни минус.",
      meaningEn: "When your income is exactly equal to your costs. No profit, no loss.",
      meaningRu: "Когда ваш доход точно равен вашим расходам. Нет прибыли, нет убытка.",
      example: "The new shop hopes to break even in six months.",
      collocations: ["break even in six months (выйти в ноль за полгода)", "just break even (едва окупиться)", "break even on investment (окупить вложения)"]
    },
    {
      id: "u1_breakevenpoint",
      term: "break-even point",
      pos: "noun",
      translationRu: "точка безубыточности",
      trick: "Точка, где две линии пересекаются на графике: ни убытка, ни прибыли. Баланс.",
      meaningEn: "The moment when a business starts to cover all its costs.",
      meaningRu: "Момент, когда бизнес начинает покрывать все свои расходы.",
      example: "We reached the break-even point after selling 1,000 units.",
      collocations: ["reach the break-even point (достичь точки безубыточности)", "calculate the break-even point (рассчитать точку безубыточности)", "below the break-even point (ниже точки безубыточности)"]
    },
    {
      id: "u1_cancel",
      term: "cancel",
      pos: "verb",
      translationRu: "отменять, аннулировать",
      trick: "Cancel = перечеркнуть. Представь большой крест (X) поверх плана или договора.",
      meaningEn: "To stop something that was planned or agreed. To call off.",
      meaningRu: "Остановить что-то запланированное или согласованное. Отменить.",
      example: "The company had to cancel the order because of a problem with the supplier.",
      collocations: ["cancel an order (отменить заказ)", "cancel a contract (расторгнуть договор)", "cancel a meeting (отменить встречу)"]
    },
    {
      id: "u1_cause",
      term: "cause",
      pos: "verb / noun",
      translationRu: "вызывать, причинять / причина",
      trick: "Cause живёт внутри слова because. Каждое 'because' указывает на cause — причину.",
      meaningEn: "To make something happen. Also: the reason why something happens.",
      meaningRu: "Заставить что-то произойти. Также: причина, по которой что-то происходит.",
      example: "High overheads can cause a business to fail.",
      collocations: ["cause damage (нанести ущерб)", "cause a loss (вызвать убыток)", "root cause (первопричина)"]
    },
    {
      id: "u1_communicate",
      term: "communicate",
      pos: "verb",
      translationRu: "общаться, сообщать",
      trick: "Communicate = сделать общим. Commun- (общий) — поделиться так, чтобы обе стороны знали.",
      meaningEn: "To share information or ideas with someone. To talk or write to someone.",
      meaningRu: "Делиться информацией или идеями с кем-то. Говорить или писать кому-то.",
      example: "Good managers communicate clearly with their teams.",
      collocations: ["communicate clearly (общаться чётко)", "communicate with clients (общаться с клиентами)", "communicate a decision (сообщить решение)"]
    },
    {
      id: "u1_complain",
      term: "complain",
      pos: "verb",
      translationRu: "жаловаться",
      trick: "Complain = говорить открыто (plain) о том, что не так. Высказать недовольство.",
      meaningEn: "To say that you are unhappy or that something is wrong.",
      meaningRu: "Говорить, что вы недовольны или что-то не так.",
      example: "The customer called to complain about the late delivery.",
      collocations: ["complain about a product (жаловаться на товар)", "complain to management (пожаловаться руководству)", "formally complain (официально пожаловаться)"]
    },
    {
      id: "u1_complaint",
      term: "complaint",
      pos: "noun",
      translationRu: "жалоба",
      trick: "Complaint = официальный результат complain. Обычно письменное или зафиксированное возражение.",
      meaningEn: "A formal statement that you are unhappy with something.",
      meaningRu: "Официальное заявление о том, что вы чем-то недовольны.",
      example: "We received a complaint from the customer about the broken product.",
      collocations: ["file a complaint (подать жалобу)", "handle a complaint (рассмотреть жалобу)", "formal complaint (официальная жалоба)"]
    },
    {
      id: "u1_competition",
      term: "competition",
      pos: "noun",
      translationRu: "конкуренция, соревнование",
      trick: "Competition = когда несколько продавцов борются за одних покупателей — как гонка за клиентами.",
      meaningEn: "When two or more companies try to sell to the same customers.",
      meaningRu: "Когда две или более компании пытаются продать одним и тем же клиентам.",
      example: "Competition between airlines makes tickets cheaper.",
      collocations: ["strong competition (сильная конкуренция)", "face competition (столкнуться с конкуренцией)", "fair competition (честная конкуренция)"]
    },
    {
      id: "u1_compete",
      term: "compete",
      pos: "verb",
      translationRu: "конкурировать, соревноваться",
      trick: "Два человека хотят одно и то же одновременно — это и есть compete (конкурировать).",
      meaningEn: "To try to be better than another company or person.",
      meaningRu: "Пытаться быть лучше другой компании или человека.",
      example: "Small shops compete with big supermarkets.",
      collocations: ["compete for customers (конкурировать за клиентов)", "compete on price (конкурировать по цене)", "compete globally (конкурировать на мировом рынке)"]
    },
    {
      id: "u1_competitive",
      term: "competitive",
      pos: "adjective",
      translationRu: "конкурентоспособный",
      trick: "Если компания умеет хорошо compete — она competitive (конкурентоспособная).",
      meaningEn: "Good enough to compete with others. Wanting to win.",
      meaningRu: "Достаточно хороший, чтобы конкурировать с другими. Стремящийся к победе.",
      example: "Our prices are very competitive — lower than most shops.",
      collocations: ["competitive price (конкурентная цена)", "competitive market (конкурентный рынок)", "competitive advantage (конкурентное преимущество)"]
    },
    {
      id: "u1_damage",
      term: "damage",
      pos: "noun / verb",
      translationRu: "ущерб / наносить ущерб",
      trick: "Damage = вред, который уже нанесён. Одно слово — и действие, и результат.",
      meaningEn: "Harm done to something. To harm or break something.",
      meaningRu: "Вред, причинённый чему-то. Нанести вред или сломать что-то.",
      example: "The fire caused serious damage to the factory.",
      collocations: ["cause damage (нанести ущерб)", "serious damage (серьёзный ущерб)", "damage a reputation (нанести ущерб репутации)"]
    },
    {
      id: "u1_deal",
      term: "deal",
      pos: "noun / verb",
      translationRu: "сделка / заключать сделку",
      trick: "Deal = раздача карт или рукопожатие в бизнесе. Обе стороны получают что-то согласованное.",
      meaningEn: "An agreement, especially in business. To make an agreement.",
      meaningRu: "Соглашение, особенно в бизнесе. Заключить соглашение.",
      example: "The two companies made a deal to share distribution costs.",
      collocations: ["sign a deal (заключить сделку)", "business deal (деловая сделка)", "close a deal (закрыть сделку)"]
    },
    {
      id: "u1_entitle",
      term: "entitle",
      pos: "verb",
      translationRu: "давать право, иметь право",
      trick: "Title (звание) даёт статус и права. Entitle = дать кому-то право что-то получить.",
      meaningEn: "To give someone the right to have or do something.",
      meaningRu: "Давать кому-то право иметь или делать что-то.",
      example: "This contract entitles you to a full refund if the product is damaged.",
      collocations: ["be entitled to a refund (иметь право на возврат)", "entitle someone to benefits (давать право на льготы)", "legally entitled (имеющий законное право)"]
    },
    {
      id: "u1_merger",
      term: "merger",
      pos: "noun",
      translationRu: "слияние (компаний)",
      trick: "Как две полосы движения, которые сливаются в одну дорогу. Две компании → одна.",
      meaningEn: "When two companies join together to become one bigger company.",
      meaningRu: "Когда две компании объединяются и становятся одной большой компанией.",
      example: "The merger of the two banks created a very large company.",
      collocations: ["approve a merger (одобрить слияние)", "merger deal (сделка по слиянию)", "merger talks (переговоры о слиянии)"]
    },
    {
      id: "u1_monopoly",
      term: "monopoly",
      pos: "noun",
      translationRu: "монополия",
      trick: "Mono = один. Monopoly = одна компания, один продавец, один хозяин рынка.",
      meaningEn: "When one company is the only seller in a market.",
      meaningRu: "Когда одна компания — единственный продавец на рынке.",
      example: "The electric company has a monopoly — there is no other choice.",
      collocations: ["state monopoly (государственная монополия)", "break a monopoly (разрушить монополию)", "hold a monopoly (иметь монополию)"]
    },
    {
      id: "u1_monopolise",
      term: "monopolise",
      pos: "verb",
      translationRu: "монополизировать",
      trick: "Monopolise = взять весь рынок только себе. Никого другого не осталось.",
      meaningEn: "To take control of a market so no one else can compete.",
      meaningRu: "Взять контроль над рынком так, чтобы никто другой не мог конкурировать.",
      example: "One company tried to monopolise the coffee market.",
      collocations: ["monopolise the market (монополизировать рынок)", "monopolise an industry (монополизировать отрасль)", "attempt to monopolise (пытаться монополизировать)"]
    },
    {
      id: "u1_legalmonopoly",
      term: "legal monopoly",
      pos: "noun phrase",
      translationRu: "легальная монополия",
      trick: "Legal = разрешённый законом. Monopoly = один продавец. Legal monopoly = один продавец по закону.",
      meaningEn: "A monopoly that is allowed by the government or by law.",
      meaningRu: "Монополия, которая разрешена правительством или законом.",
      example: "A patent gives a company a legal monopoly for 20 years.",
      collocations: ["hold a legal monopoly (иметь законную монополию)", "government-granted legal monopoly (монополия по решению правительства)", "protect a legal monopoly (защищать законную монополию)"]
    },
    {
      id: "u1_overheads",
      term: "overheads",
      pos: "noun (plural)",
      translationRu: "накладные расходы",
      trick: "Эти расходы 'висят над головой' каждый месяц — аренда, электричество, зарплаты. Всегда.",
      meaningEn: "Regular costs of running a business, like rent, electricity, salaries.",
      meaningRu: "Постоянные расходы на ведение бизнеса: аренда, электричество, зарплаты.",
      example: "High overheads make it hard for small businesses to survive.",
      collocations: ["high overheads (высокие накладные расходы)", "reduce overheads (снизить накладные расходы)", "fixed overheads (постоянные накладные расходы)"]
    },
    {
      id: "u1_permit",
      term: "permit",
      pos: "noun / verb",
      translationRu: "разрешение / разрешать",
      trick: "Permit = действие разрешить; permission = то, что тебе дали. Сначала permit, потом можно действовать.",
      meaningEn: "An official document giving permission to do something. To allow something.",
      meaningRu: "Официальный документ, разрешающий что-то делать. Разрешать что-то.",
      example: "You need a permit to open a food business in this area.",
      collocations: ["work permit (разрешение на работу)", "obtain a permit (получить разрешение)", "building permit (разрешение на строительство)"]
    },
    {
      id: "u1_prevail",
      term: "prevail",
      pos: "verb",
      translationRu: "преобладать, побеждать, господствовать",
      trick: "Что побеждает в итоге — то и prevails (преобладает). Сильнейшая сторона берёт верх.",
      meaningEn: "To be the most common or most powerful. To win in the end.",
      meaningRu: "Быть наиболее распространённым или самым сильным. В конечном счёте победить.",
      example: "In competitive markets, lower prices usually prevail.",
      collocations: ["lower prices prevail (низкие цены преобладают)", "justice prevails (справедливость торжествует)", "common sense prevails (здравый смысл побеждает)"]
    },
    {
      id: "u1_fluctuate",
      term: "fluctuate",
      pos: "verb",
      translationRu: "колебаться, меняться",
      trick: "Само слово похоже на волну: вверх, вниз, вверх, вниз. Fluctuate = колебаться.",
      meaningEn: "To go up and down. To change often.",
      meaningRu: "Идти вверх и вниз. Часто меняться.",
      example: "Oil prices fluctuate every day.",
      collocations: ["prices fluctuate (цены колеблются)", "fluctuate widely (широко колебаться)", "exchange rates fluctuate (курсы валют колеблются)"]
    },
    {
      id: "u1_fluctuation",
      term: "fluctuation",
      pos: "noun",
      translationRu: "колебание, изменение",
      trick: "Fluctuation = одна видимая волна изменения. Один подъём или спуск.",
      meaningEn: "A change that goes up and down. Not stable.",
      meaningRu: "Изменение, которое идёт вверх и вниз. Нестабильность.",
      example: "Fluctuations in the stock market worry investors.",
      collocations: ["price fluctuation (колебание цен)", "market fluctuation (рыночное колебание)", "minor fluctuation (незначительное колебание)"]
    },
    {
      id: "u1_enterprise",
      term: "enterprise",
      pos: "noun",
      translationRu: "предприятие, предпринимательство",
      trick: "Enter the market to win a prize — enterprise = организованная деловая активность.",
      meaningEn: "A business or company. Also: the courage to start a business.",
      meaningRu: "Бизнес или компания. Также: смелость начать бизнес.",
      example: "She started a small enterprise selling handmade bags.",
      collocations: ["small enterprise (малое предприятие)", "private enterprise (частное предпринимательство)", "free enterprise (свободное предпринимательство)"]
    },
    {
      id: "u1_obtain",
      term: "obtain",
      pos: "verb",
      translationRu: "получать, приобретать",
      trick: "Obtain = тянуться к чему-то и наконец получить. Потянулся — взял официально.",
      meaningEn: "To get something, usually by effort or officially.",
      meaningRu: "Получить что-то, обычно с усилием или официально.",
      example: "You must obtain a license before opening a restaurant.",
      collocations: ["obtain a license (получить лицензию)", "obtain permission (получить разрешение)", "obtain information (получить информацию)"]
    },
    {
      id: "u1_negotiate",
      term: "negotiate",
      pos: "verb",
      translationRu: "вести переговоры",
      trick: "Negotiate = двигаться между двумя позициями, пока обе стороны не сойдутся на середине.",
      meaningEn: "To discuss something to find an agreement. To make a deal.",
      meaningRu: "Обсуждать что-то, чтобы найти соглашение. Заключить сделку.",
      example: "We need to negotiate a better price with the supplier.",
      collocations: ["negotiate a price (торговаться о цене)", "negotiate a contract (согласовывать контракт)", "negotiate terms (обговаривать условия)"]
    },
    {
      id: "u1_procedure",
      term: "procedure",
      pos: "noun",
      translationRu: "процедура, порядок действий",
      trick: "Procedure = путь из шагов, по которому ты proceed (продвигаешься). Порядок действий.",
      meaningEn: "A set of steps you follow to do something correctly.",
      meaningRu: "Набор шагов, которым вы следуете, чтобы сделать что-то правильно.",
      example: "There is a strict procedure for returning products.",
      collocations: ["follow a procedure (следовать процедуре)", "standard procedure (стандартная процедура)", "complaints procedure (процедура рассмотрения жалоб)"]
    },
    {
      id: "u1_purchase",
      term: "purchase",
      pos: "verb / noun",
      translationRu: "покупать / покупка",
      trick: "Гонишься за тем, что хочешь купить — и погоня заканчивается purchase (покупкой).",
      meaningEn: "To buy something. Also: the thing you buy.",
      meaningRu: "Покупать что-то. Также: то, что вы покупаете.",
      example: "The company made a large purchase of new computers.",
      collocations: ["make a purchase (совершить покупку)", "purchase price (цена покупки)", "online purchase (онлайн-покупка)"]
    },
    {
      id: "u1_recruitment",
      term: "recruitment",
      pos: "noun",
      translationRu: "набор персонала, рекрутинг",
      trick: "Recruitment = весь процесс поиска и найма: от вакансии до первого рабочего дня.",
      meaningEn: "The process of finding and hiring new workers.",
      meaningRu: "Процесс поиска и найма новых работников.",
      example: "Recruitment of new staff begins in September.",
      collocations: ["recruitment process (процесс найма)", "recruitment agency (кадровое агентство)", "staff recruitment (набор персонала)"]
    },
    {
      id: "u1_recruit",
      term: "recruit",
      pos: "verb / noun",
      translationRu: "нанимать / новобранец",
      trick: "Recruit = добавить нового человека в команду. Как 'рекрут' в армии — новобранец.",
      meaningEn: "To find and hire a new worker. Also: the new worker.",
      meaningRu: "Найти и нанять нового работника. Также: новый работник.",
      example: "We need to recruit three new salespeople this month.",
      collocations: ["recruit staff (нанимать персонал)", "recruit new workers (нанимать новых работников)", "actively recruit (активно нанимать)"]
    },
    {
      id: "u1_resume",
      term: "resume / CV",
      pos: "noun",
      translationRu: "резюме",
      trick: "Resume = снова (re-) подвести итог (sum) своей жизни. Для каждой новой работы — новое резюме.",
      meaningEn: "A document that shows your education, skills, and work experience.",
      meaningRu: "Документ, который показывает ваше образование, навыки и опыт работы.",
      example: "Please send your resume to the HR department.",
      collocations: ["send a CV (отправить резюме)", "update your resume (обновить резюме)", "write a CV (написать резюме)"]
    },
    {
      id: "u1_circumstances",
      term: "circumstances",
      pos: "noun (plural)",
      translationRu: "обстоятельства",
      trick: "Circum = вокруг. Circumstances = всё, что стоит вокруг тебя и определяет ситуацию.",
      meaningEn: "The conditions or situation that affect something.",
      meaningRu: "Условия или ситуация, которые влияют на что-то.",
      example: "Under these circumstances, we cannot lower the price.",
      collocations: ["under these circumstances (при данных обстоятельствах)", "exceptional circumstances (исключительные обстоятельства)", "given the circumstances (учитывая обстоятельства)"]
    },
    {
      id: "u1_subject",
      term: "subject (to)",
      pos: "adjective / verb",
      translationRu: "подлежащий (чему-либо), подвергать",
      trick: "Subject to = находиться под действием правила или условия. Sub = под.",
      meaningEn: "To be under the control of a rule or condition. To make something undergo something.",
      meaningRu: "Быть под контролем правила или условия. Подвергать что-то чему-то.",
      example: "All prices are subject to change without notice.",
      collocations: ["subject to approval (требующий одобрения)", "subject to change (подлежащий изменению)", "subject to conditions (при соблюдении условий)"]
    },
    {
      id: "u1_undesirable",
      term: "undesirable",
      pos: "adjective",
      translationRu: "нежелательный",
      trick: "Un- переворачивает слово. Desirable = желанное; undesirable = то, чего не хочешь.",
      meaningEn: "Not wanted. Something bad or unwelcome.",
      meaningRu: "Нежеланный. Что-то плохое или нежелательное.",
      example: "Losing customers is a highly undesirable situation.",
      collocations: ["highly undesirable (крайне нежелательный)", "undesirable outcome (нежелательный исход)", "undesirable side effects (нежелательные побочные эффекты)"]
    },
    {
      id: "u1_refund",
      term: "refund",
      pos: "noun / verb",
      translationRu: "возврат (денег) / возвращать деньги",
      trick: "Refund = деньги возвращаются туда, откуда пришли. Re = обратно.",
      meaningEn: "Money that is given back to a buyer. To give money back.",
      meaningRu: "Деньги, которые возвращают покупателю. Возвращать деньги.",
      example: "The shop gave me a refund for the broken phone.",
      collocations: ["request a refund (запросить возврат)", "full refund (полный возврат)", "issue a refund (выдать возврат средств)"]
    },
    {
      id: "u1_restrict",
      term: "restrict",
      pos: "verb",
      translationRu: "ограничивать",
      trick: "Restrict = сделать правила жёстче (strict) и сузить границы. Ограничить.",
      meaningEn: "To limit something. To put rules on something.",
      meaningRu: "Ограничивать что-то. Устанавливать правила для чего-то.",
      example: "The government restricts the sale of alcohol to people over 18.",
      collocations: ["restrict access (ограничить доступ)", "restrict imports (ограничить импорт)", "restrict competition (ограничить конкуренцию)"]
    },
    {
      id: "u1_control",
      term: "control",
      pos: "verb / noun",
      translationRu: "контролировать / контроль",
      trick: "Control = держать направление и власть в своих руках. Контролировать = управлять.",
      meaningEn: "To have power over something. To manage something.",
      meaningRu: "Иметь власть над чем-то. Управлять чем-то.",
      example: "The company controls 60% of the market.",
      collocations: ["take control (взять под контроль)", "quality control (контроль качества)", "under control (под контролем)"]
    }
  ],
  comics: [
    {
      id: "c1_market_war",
      title: "Competition and Monopoly",
      imageUrl: "https://media.base44.com/images/public/user_69c6a0923ba24de18ae4cd37/b0ecd45c2_photo_2_2026-04-03_18-17-39.jpg",
      vocabTags: ["competition", "compete", "competitive", "monopoly", "monopolise", "legal monopoly"],
      description: "Anya and Ben compete to sell lemonade. See how competition works — and what happens when one person takes control."
    },
    {
      id: "c1_business_start",
      title: "Overheads, Fluctuation, and Break-Even",
      imageUrl: "https://media.base44.com/images/public/user_69c6a0923ba24de18ae4cd37/070270fad_photo_1_2026-04-03_18-17-39.jpg",
      vocabTags: ["overheads", "fluctuate", "fluctuation", "break even", "break-even point"],
      description: "Three friends open a café. They learn about overheads, break-even points, and price fluctuations."
    },
    {
      id: "c1_transactions",
      title: "Purchase, Negotiate, Deal, Procedure, Permit",
      imageUrl: "https://media.base44.com/images/public/user_69c6a0923ba24de18ae4cd37/f4f04279b_photo_3_2026-04-03_18-17-39.jpg",
      vocabTags: ["purchase", "negotiate", "deal", "procedure", "permit"],
      description: "Follow a team as they purchase equipment, negotiate prices, and follow the procedure to open a business."
    },
    {
      id: "c1_authority",
      title: "Control, Restrict, Authority, Authorize, Merger",
      imageUrl: "https://media.base44.com/images/public/user_69c6a0923ba24de18ae4cd37/64e8d7364_photo_4_2026-04-03_18-17-39.jpg",
      vocabTags: ["control", "restrict", "authority", "authorize", "merger"],
      description: "See how managers control projects, restrict access, use authority, and how companies merge."
    },
    {
      id: "c1_recruitment",
      title: "Recruitment and Enterprise",
      imageUrl: "https://media.base44.com/images/public/user_69c6a0923ba24de18ae4cd37/cc9601f3b_photo_5_2026-04-03_18-17-39.jpg",
      vocabTags: ["recruitment", "recruit", "resume", "enterprise"],
      description: "A growing company needs new workers. See the recruitment process — from job opening to enterprise success."
    },
    {
      id: "c1_refund",
      title: "Deal, Complaint, Complain, Cancel, Refund",
      imageUrl: "https://media.base44.com/images/public/user_69c6a0923ba24de18ae4cd37/b4eaa30e1_photo_6_2026-04-03_18-17-39.jpg",
      vocabTags: ["deal", "complaint", "complain", "cancel", "refund"],
      description: "A customer buys a product but it arrives broken. She complains, requests a refund, and the business must deal with the situation."
    },
    {
      id: "c1_cause_damage",
      title: "Cause, Affect, Damage",
      imageUrl: "https://media.base44.com/images/public/user_69c6a0923ba24de18ae4cd37/f4f04279b_photo_3_2026-04-03_18-17-39.jpg",
      vocabTags: ["cause", "affect", "damage"],
      description: "See how one event causes another. Learn the difference between cause, affect, and damage in business and everyday contexts."
    },
    {
      id: "c1_subject_illegal",
      title: "Subject, Illegal, Control",
      imageUrl: "https://media.base44.com/images/public/user_69c6a0923ba24de18ae4cd37/64e8d7364_photo_4_2026-04-03_18-17-39.jpg",
      vocabTags: ["subject", "subject to", "illegal", "control"],
      description: "A manager discovers illegal activity. Workers are subject to company rules. Control is needed to solve the problem."
    }
  ],
  comicQuestions: [],
  exercises: [
    {
      id: "ex1_match_a",
      type: "match",
      title: "Match the Word with the Translation — A: Market and Competition vocabulary / Лексика рынка и конкуренции",
      instruction: "Connect each English word with its Russian translation.",
      pairs: [
        { en: "compete",       ru: "конкурировать" },
        { en: "monopoly",      ru: "монополия" },
        { en: "merger",        ru: "слияние" },
        { en: "enterprise",    ru: "предприятие" },
        { en: "competitive",   ru: "конкурентоспособный" },
      ]
    },
    {
      id: "ex1_match_b",
      type: "match",
      title: "Match the Word with the Translation — B: Business operations vocabulary / Деловые операции",
      instruction: "Connect each English word with its Russian translation.",
      pairs: [
        { en: "purchase",  ru: "покупать / покупка" },
        { en: "refund",    ru: "возврат денег" },
        { en: "deal",      ru: "сделка" },
        { en: "authorize", ru: "уполномочивать" },
        { en: "negotiate", ru: "вести переговоры" },
      ]
    },
    {
      id: "ex1_match_c",
      type: "match",
      title: "Match the Word with the Translation — C: Formal and descriptive vocabulary / Формальная и описательная лексика",
      instruction: "Connect each English word with its Russian translation.",
      pairs: [
        { en: "circumstances", ru: "обстоятельства" },
        { en: "overheads",     ru: "накладные расходы" },
        { en: "fluctuate",     ru: "колебаться" },
        { en: "prevail",       ru: "преобладать" },
        { en: "restrict",      ru: "ограничивать" },
      ]
    },
    {
      id: "ex1_tf",
      type: "trueFalse",
      title: "True or False?",
      instruction: "Read each sentence. Is it TRUE or FALSE?",
      items: [
        { statement: "A monopoly means many companies compete for customers.", answer: false, explanation: "A monopoly means ONE company controls the market. No competition." },
        { statement: "Overheads are fixed costs that remain the same regardless of how much the business produces.", answer: true, explanation: "✓ Correct — overheads (such as rent, salaries, and utilities) are fixed costs that do not change with production volume." },
        { statement: "To break even means to make a big profit.", answer: false, explanation: "Break even = income equals costs. No profit, no loss." },
        { statement: "A merger happens when two companies join together.", answer: true, explanation: "A merger = two companies become one bigger company." },
        { statement: "Fluctuate means to stay the same.", answer: false, explanation: "Fluctuate = to go up and down, to change often." },
        { statement: "A refund is money given back to a buyer.", answer: true, explanation: "When you return a product, you can get a refund." },
        { statement: "Competition makes prices higher for customers.", answer: false, explanation: "Competition usually makes prices lower because companies fight for customers." },
        { statement: "A complaint is a formal statement that someone is unhappy.", answer: true, explanation: "A complaint = a formal statement of dissatisfaction with a product or service." },
        { statement: "To cancel an order means to place a new order.", answer: false, explanation: "Cancel = to stop or call off something that was planned." },
        { statement: "A permit is an official document giving permission.", answer: true, explanation: "A permit allows you to legally do something (open a business, build, etc.)." },
        { statement: "To damage something means to improve it.", answer: false, explanation: "Damage = to harm or break something. The opposite of improving." },
        { statement: "Prices subject to change means they may change at any time.", answer: true, explanation: "Subject to = under the condition of. Prices can change." }
      ]
    },
    {
      id: "ex1_fill",
      type: "fillGap",
      title: "Fill in the Gaps",
      instruction: "Complete each sentence with the correct word from the box.",
      wordBank: ["monopoly", "compete", "overheads", "fluctuate", "merger", "recruit", "purchase", "negotiate", "refund", "authorize", "break even", "restrict", "cancel", "complain", "damage", "cause", "permit", "deal", "communicate", "entitle"],
      items: [
        { sentence: "Oil prices ______ every day — they go up and down.", answer: "fluctuate", explanation: "Fluctuate = change frequently, go up and down." },
        { sentence: "The company controls the whole market. It has a ______.", answer: "monopoly", explanation: "Monopoly = one company is the only seller." },
        { sentence: "We hope to ______ this year — no profit, but no loss.", answer: "break even", explanation: "Break even = income equals costs." },
        { sentence: "Small shops ______ with big supermarkets for customers.", answer: "compete", explanation: "Compete = try to be better than the other." },
        { sentence: "The two banks agreed to a ______ and became one company.", answer: "merger", explanation: "Merger = two companies join to become one." },
        { sentence: "We need to ______ five new workers for the project.", answer: "recruit", explanation: "Recruit = find and hire new workers." },
        { sentence: "The company made a large ______ of new equipment.", answer: "purchase", explanation: "Purchase = something you buy." },
        { sentence: "We must ______ a better price with the supplier.", answer: "negotiate", explanation: "Negotiate = discuss to find an agreement." },
        { sentence: "The shop gave me a ______ for the broken product.", answer: "refund", explanation: "Refund = money returned to the buyer." },
        { sentence: "The manager must ______ all important decisions.", answer: "authorize", explanation: "Authorize = give official permission." },
        { sentence: "The government decided to ______ imports of cheap goods.", answer: "restrict", explanation: "Restrict = to limit or control something." },
        { sentence: "High ______ like rent make it hard for new businesses.", answer: "overheads", explanation: "Overheads = regular costs like rent, electricity, wages." },
        { sentence: "We had to ______ the meeting because the manager was ill.", answer: "cancel", explanation: "Cancel = to call off something that was planned." },
        { sentence: "The customer called to ______ about the late delivery.", answer: "complain", explanation: "Complain = to say you are unhappy about something." },
        { sentence: "Heavy rain can ______ crops and cause losses for farmers.", answer: "damage", explanation: "Damage = to harm something physically." },
        { sentence: "Poor management can ______ a company to lose customers.", answer: "cause", explanation: "Cause = to make something happen." },
        { sentence: "You need a ______ to open a restaurant in this area.", answer: "permit", explanation: "Permit = official document giving permission." },
        { sentence: "The two companies made a ______ to share their warehouses.", answer: "deal", explanation: "Deal = a business agreement." }
      ]
    },
    {
      id: "ex1_choose",
      type: "multipleChoice",
      title: "Choose the Correct Word",
      instruction: "Choose the best word to complete each sentence.",
      items: [
        {
          sentence: "The company wants to ______ new workers.",
          options: ["recruit", "refund", "restrict", "fluctuate"],
          answer: "recruit",
          explanation: "Recruit = find and hire new workers."
        },
        {
          sentence: "One company controls 100% of the market. This is a ______.",
          options: ["competition", "merger", "monopoly", "procedure"],
          answer: "monopoly",
          explanation: "Monopoly = one company has total control."
        },
        {
          sentence: "We need to ______ a license before we can open the restaurant.",
          options: ["fluctuate", "obtain", "compete", "break even"],
          answer: "obtain",
          explanation: "Obtain = to get something officially."
        },
        {
          sentence: "The customer was not happy and wrote a formal ______.",
          options: ["deal", "complaint", "merger", "permit"],
          answer: "complaint",
          explanation: "Complaint = a formal statement that you are unhappy."
        },
        {
          sentence: "The fire ______ serious harm to the factory building.",
          options: ["cancelled", "prevailed", "caused", "communicated"],
          answer: "caused",
          explanation: "Caused = made something happen."
        },
        {
          sentence: "This warranty ______ you to free repairs for one year.",
          options: ["cancels", "entitles", "damages", "restricts"],
          answer: "entitles",
          explanation: "Entitles = gives you the right to something."
        },
        {
          sentence: "All products are ______ to inspection before delivery.",
          options: ["subject", "cancel", "prevail", "permit"],
          answer: "subject",
          explanation: "Subject to = under the condition of a rule or check."
        },
        {
          sentence: "Good managers ______ clearly with their teams every day.",
          options: ["deal", "communicate", "entitle", "cancel"],
          answer: "communicate",
          explanation: "Communicate = to share information with someone."
        }
      ]
    },
    {
      id: "ex1_concept",
      type: "conceptMatch",
      title: "Match the Concept",
      instruction: "Match each description with the correct business term.",
      pairs: [
        { description: "A company reaches this point when its total income equals its total costs, so there is no profit and no loss.", term: "break even" },
        { description: "This happens when two separate companies join together to form one company.", term: "merger" },
        { description: "This market structure exists when one company is the only seller of a product or service.", term: "monopoly" },
        { description: "These are the regular fixed costs a business must pay, such as rent, salaries, and utility bills.", term: "overheads" },
        { description: "This is a formal statement in which a customer expresses dissatisfaction with a product or service.", term: "complaint" },
        { description: "This is an official document that gives a person or company the legal right to do something.", term: "permit" },
        { description: "To be under the control of a rule, condition, or authority that must be followed.", term: "subject (to)" },
        { description: "When one idea, price, or condition becomes the most powerful or widespread in a situation.", term: "prevail" },
        { description: "To give someone an official right to receive something or to take a particular action.", term: "entitle" },
        { description: "A formal business agreement between two parties who each receive something of value.", term: "deal" }
      ]
    }
  ],
  reading: {
    title: "Markets, Competition, and Monopolies",
    guidance: "Read the text slowly. You know many words from the Dictionary. The important words are highlighted. Try to understand the main ideas.",
    guidanceRu: "Читайте текст медленно. Вы уже знаете многие слова из Словаря. Важные слова выделены. Постарайтесь понять основные идеи.",
    paragraphs: [
      {
        text: "A **market** is a place where buyers and sellers meet. Markets can be physical, like a street market, or online, like an internet shop. In a market economy, people are free to buy and sell goods and services.",
        glossary: { "market": "рынок — место, где встречаются покупатели и продавцы", "goods": "товары", "services": "услуги" }
      },
      {
        text: "When many companies sell the same product, there is **competition**. Companies **compete** for customers. They try to offer better products, lower prices, or better service. Competition is good for customers because it keeps prices low.",
        glossary: { "competition": "конкуренция", "compete": "конкурировать", "customers": "клиенты, покупатели" }
      },
      {
        text: "Sometimes one company controls the whole market. This is called a **monopoly**. When a company has a monopoly, there is no competition. The company can set high prices because customers have no other choice.",
        glossary: { "monopoly": "монополия", "controls": "контролирует" }
      },
      {
        text: "There are different types of monopolies. A **legal monopoly** is when the government gives one company the right to be the only seller. For example, a patent gives a company a legal monopoly for 20 years. A **natural monopoly** happens when it is too expensive for other companies to enter the market.",
        glossary: { "legal monopoly": "легальная монополия", "patent": "патент", "natural monopoly": "естественная монополия" }
      },
      {
        text: "The government can **restrict** monopolies by making special rules. These rules protect customers and help small businesses. The government **authority** controls fair **competition** and stops companies from using **undesirable** business methods.",
        glossary: { "restrict": "ограничивать", "authority": "власть, орган контроля", "undesirable": "нежелательный" }
      },
      {
        text: "In the labour market, companies **recruit** new workers. They look at each person's **resume** and choose the best candidates. The **recruitment** process can take weeks. Good workers are important for any **enterprise** to grow.",
        glossary: { "recruit": "нанимать", "resume": "резюме", "recruitment": "набор персонала", "enterprise": "предприятие" }
      },
      {
        text: "Running a business is not easy. Companies must pay their **overheads** — rent, electricity, salaries. Prices of materials often **fluctuate**, going up and down. A new company must work hard to reach the **break-even point** — the moment when income covers all costs.",
        glossary: { "overheads": "накладные расходы", "fluctuate": "колебаться", "break-even point": "точка безубыточности" }
      },
      {
        text: "Customers have important rights. If a product is **damaged**, a customer can **complain** and request a **refund**. The business must **communicate** clearly about the **procedure** for returning goods. Many businesses have a complaints **deal**ing process. Customers are **entitled** to a refund under certain **circumstances**.",
        glossary: { "damaged": "повреждённый", "complain": "жаловаться", "refund": "возврат денег", "communicate": "сообщать", "entitled": "имеющий право" }
      }
    ],
    postReadingTasks: [
      {
        type: 'trueFalse',
        q: 'Competition is good for customers because it keeps prices low.',
        answer: true,
        explanation: 'Yes — when companies compete, they offer lower prices and better products.'
      },
      {
        type: 'trueFalse',
        q: 'A monopoly exists when one company controls the whole market.',
        answer: true,
        explanation: 'Correct — a monopoly means one company dominates with no competition.'
      },
      {
        type: 'choice',
        q: 'What gives a company a legal monopoly for 20 years?',
        options: [
          'A patent',
          'A natural resource',
          'Government ownership',
          'High market share'
        ],
        answer: 'A patent',
        explanation: 'A patent grants exclusive rights to an invention for 20 years.'
      },
      {
        type: 'choice',
        q: 'What is the break-even point?',
        options: [
          'When a company makes its first sale',
          'When income covers all costs with no profit or loss',
          'When a company becomes a monopoly',
          'When prices fluctuate'
        ],
        answer: 'When income covers all costs with no profit or loss',
        explanation: 'The break-even point is reached when total income equals total costs.'
      },
      {
        type: 'open',
        q: 'Why do governments restrict monopolies?',
        model: 'Governments restrict monopolies to protect customers from high prices and to help small businesses compete fairly. They set rules to ensure fair competition.'
      }
    ]
  },
  comprehension: [
    { q: "What is a market?", model: "A market is a place where buyers and sellers meet to trade goods and services." },
    { q: "Why is competition good for customers?", model: "Competition is good because companies try to offer lower prices and better products." },
    { q: "What happens when one company has a monopoly?", model: "The company can set high prices because customers have no other choice." },
    { q: "What is a legal monopoly?", model: "A legal monopoly is when the government gives one company the right to be the only seller." },
    { q: "How does the government protect customers from monopolies?", model: "The government restricts monopolies by making special rules that protect customers." },
    { q: "What is the break-even point?", model: "The break-even point is the moment when a company's income covers all its costs." },
    { q: "What can a customer do if a product is damaged?", model: "The customer can complain and request a refund from the business." },
    { q: "True or False: Recruitment means firing workers.", model: "False. Recruitment means finding and hiring NEW workers." }
  ],
  media: [
    {
      mediaId: "u1_media_markets_intro",
      localSrc: "/u1_markets_intro.mp4",
      title: "Markets and Competition — Introduction",
      type: "video",
      source: "Educational Video",
      url: "https://youtu.be/4OUpUlBFmIo",
      embedId: "4OUpUlBFmIo",
      duration: "Video",
      description: "An introductory video explaining how markets work, what competition means, and how prices are set by buyers and sellers.",
      whyHelps: "You will hear the words 'market', 'competition', 'supply', and 'price' in a real educational context.",
      vocabToListen: ["market", "competition", "supply", "price", "demand"],
      task: "After watching, build a sentence: What is a market?",
      predictionTask: [
        { type: "sentenceBuilder", q: "Before watching — build a sentence about what you think this video is about:", tiles: ["This", "video", "is", "about", "markets", "and", "competition.", "how", "prices", "are", "set", "by", "buyers", "sellers", "government", "taxes"], answer: ["This", "video", "is", "about", "markets", "and", "competition."] },
        { type: "wordCheck", q: "Which words do you expect to hear? Tick all that apply.", options: ["market", "competition", "supply", "price", "demand"] }
      ],
      postQuiz: [
        { type: "trueFalse", q: "A market is a place where buyers and sellers meet to trade.", answer: true, explanation: "Correct — markets bring buyers and sellers together to exchange goods and services." },
        { type: "choice", q: "Which vocabulary group is most important in this video?", options: ["Markets and prices", "Recruitment and HR", "Insurance and taxes", "Pollution and waste"], answer: "Markets and prices", explanation: "The video focuses on markets, competition, supply, price, and demand." },
        { type: "sentenceBuilder", q: "Build the sentence.", tiles: ["A", "market", "is", "a", "place", "where", "buyers", "and", "sellers", "meet.", "monopoly", "price"], answer: ["A", "market", "is", "a", "place", "where", "buyers", "and", "sellers", "meet."] }
      ]
    },
    {
      mediaId: "u1_media_monopoly",
      localSrc: "/u1_monopoly.mp4",
      title: "What is a Monopoly?",
      type: "video",
      source: "Educational Video",
      url: "https://youtu.be/720uyg0Dd_M",
      embedId: "720uyg0Dd_M",
      duration: "Video",
      description: "A short video explaining what a monopoly is, how it forms, and why governments try to control it.",
      whyHelps: "You will hear 'monopoly', 'control', 'restrict', and 'competition' used naturally.",
      vocabToListen: ["monopoly", "control", "restrict", "competition", "legal"],
      task: "After watching, answer: Is a monopoly good or bad for customers?",
      predictionTask: [
        { type: "sentenceBuilder", q: "Before watching — build a sentence about what you think this video is about:", tiles: ["This", "video", "is", "about", "monopoly", "when", "one", "company", "controls", "the", "whole", "market.", "many", "sellers", "prices", "fall"], answer: ["This", "video", "is", "about", "monopoly", "when", "one", "company", "controls", "the", "whole", "market."] },
        { type: "wordCheck", q: "Which words do you expect to hear? Tick all that apply.", options: ["monopoly", "control", "restrict", "competition", "legal"] }
      ],
      postQuiz: [
        { type: "trueFalse", q: "A monopoly means one company controls the whole market with no real competition.", answer: true, explanation: "Correct — in a monopoly, one company dominates with little or no competition." },
        { type: "choice", q: "Which vocabulary group is most important in this video?", options: ["Monopoly and control", "Supply chain and logistics", "Recruitment and salaries", "Technology and robots"], answer: "Monopoly and control", explanation: "The video focuses on monopoly, control, restrict, competition, and legal." },
        { type: "sentenceBuilder", q: "Build the sentence:", tiles: ["A", "monopoly", "is", "when", "one", "company", "controls", "the", "whole", "market.", "many", "companies", "share", "prices", "fall"], answer: ["A", "monopoly", "is", "when", "one", "company", "controls", "the", "whole", "market."] }
      ]
    },
    {
      mediaId: "u1_media_supply_demand",
      localSrc: "/u1_supply_demand.mp4",
      title: "Supply and Demand Explained",
      type: "video",
      source: "Educational Video",
      url: "https://youtu.be/A2BOOkldCzw",
      embedId: "A2BOOkldCzw",
      duration: "Video",
      description: "A clear explanation of supply and demand — two of the most important concepts in economics.",
      whyHelps: "You will hear 'supply', 'demand', 'price', 'fluctuate', and 'market' in a clear educational context.",
      vocabToListen: ["supply", "demand", "price", "fluctuate", "market"],
      task: "After watching, build a sentence explaining the difference between supply and demand.",
      predictionTask: [
        { type: "sentenceBuilder", q: "Before watching — build a sentence about what you think this video is about:", tiles: ["This", "video", "explains", "supply", "and", "demand", "two", "key", "concepts", "in", "economics.", "technology", "jobs", "wages"], answer: ["This", "video", "explains", "supply", "and", "demand", "two", "key", "concepts", "in", "economics."] },
        { type: "wordCheck", q: "Which words do you expect to hear? Tick all that apply.", options: ["supply", "demand", "price", "fluctuate", "market"] }
      ],
      postQuiz: [
        { type: "trueFalse", q: "When demand is high and supply is low, prices usually go up.", answer: true, explanation: "Correct — high demand and low supply push prices upward." },
        { type: "choice", q: "Which vocabulary group is most important in this video?", options: ["Supply and demand", "Monopoly and mergers", "Recruitment and CV", "Insurance and overheads"], answer: "Supply and demand", explanation: "The video focuses on supply, demand, price, market, and fluctuations." },
        { type: "sentenceBuilder", q: "Build the sentence:", tiles: ["Supply", "is", "the", "amount", "of", "a", "product", "that", "sellers", "offer", "in", "the", "market.", "buyers", "demand", "consume"], answer: ["Supply", "is", "the", "amount", "of", "a", "product", "that", "sellers", "offer", "in", "the", "market."] }
      ]
    },
    {
      mediaId: "u1_media_mergers",
      localSrc: "/u1_mergers.mp4",
      title: "How Mergers Change Business",
      type: "video",
      source: "Educational Video",
      url: "https://youtu.be/J9OO9lSQnG8",
      embedId: "J9OO9lSQnG8",
      duration: "Video",
      description: "A video about what happens when two companies merge — how it affects competition, prices, and consumers.",
      whyHelps: "You will hear 'merger', 'competition', 'monopoly', 'affect', and 'authorize' in a business context.",
      vocabToListen: ["merger", "competition", "monopoly", "affect", "authorize"],
      task: "After watching, explain: What happens to competition after a merger?",
      predictionTask: [
        { type: "sentenceBuilder", q: "Before watching — build a sentence about what you think this video is about:", tiles: ["This", "video", "is", "about", "mergers", "when", "two", "companies", "join", "together", "to", "become", "one.", "separate", "smaller", "banks"], answer: ["This", "video", "is", "about", "mergers", "when", "two", "companies", "join", "together", "to", "become", "one."] },
        { type: "wordCheck", q: "Which words do you expect to hear? Tick all that apply.", options: ["merger", "competition", "monopoly", "affect", "authorize"] }
      ],
      postQuiz: [
        { type: "trueFalse", q: "A merger can reduce competition in the market.", answer: true, explanation: "Correct — when two companies merge, there are fewer competitors, which can reduce competition." },
        { type: "choice", q: "Which vocabulary group is most important in this video?", options: ["Mergers and competition", "Supply and demand", "Recruitment and salaries", "Environment and pollution"], answer: "Mergers and competition", explanation: "The video focuses on merger, competition, monopoly, affect, and authorize." },
        { type: "sentenceBuilder", q: "Build the sentence:", tiles: ["A", "merger", "happens", "when", "two", "companies", "join", "together", "to", "become", "one.", "many", "split", "apart", "three", "divide"], answer: ["A", "merger", "happens", "when", "two", "companies", "join", "together", "to", "become", "one."] }
      ]
    }
  ],
  dialogue: {
    title: "At the Office: Discussing a New Competitor",
    context: "Anna is a marketing manager. She talks to her boss, Mr Petrov, about a new company in their market.",
    lines: [
      { speaker: "Mr Petrov", text: "Anna, have you heard about the new company in our market?" },
      { speaker: "Anna", text: "Yes, I have. They sell the same product at a lower price. We need to **compete**." },
      { speaker: "Mr Petrov", text: "How can we be more **competitive**?" },
      { speaker: "Anna", text: "We can lower our prices. But our **overheads** are high — rent and salaries cost a lot." },
      { speaker: "Mr Petrov", text: "Can we **negotiate** better prices with our suppliers?" },
      { speaker: "Anna", text: "Yes, I think so. We can also **recruit** a new salesperson to help us get more customers." },
      { speaker: "Mr Petrov", text: "Good idea. We must reach the **break-even point** by December." },
      { speaker: "Anna", text: "I understand. I will prepare a plan. Under these **circumstances**, we need to act fast." },
      { speaker: "Mr Petrov", text: "I will **authorize** a budget for the new plan. Also — we received a **complaint** from a customer about a damaged delivery. Please **communicate** with the customer and arrange a **refund**." },
      { speaker: "Anna", text: "Of course. I will **deal** with it immediately. We are **entitled** to charge the supplier for the **damage**." }
    ],
    tasks: [
      { type: "fill", q: "Anna says they need to ______ with the new company.", a: "compete" },
      { type: "fill", q: "Overheads include ______ and ______.", a: "rent and salaries" },
      { type: "choice", q: "What does Mr Petrov authorize?", options: ["A new office", "A budget for the plan", "A merger"], a: "A budget for the plan" },
      { type: "fill", q: "A customer complained because the delivery was ______.", a: "damaged" },
      { type: "choice", q: "What does Anna plan to give the customer?", options: ["A discount", "A refund", "A new job"], a: "A refund" },
      { type: "choice", q: "Why does Anna want to recruit a new salesperson?", options: ["To reduce overheads", "To help get more customers and compete with the new company", "To cancel existing complaints", "To authorize refunds"], a: "To help get more customers and compete with the new company" }
    ]
  },
  writing: {
    title: "Sentence Builder: Describe a Market",
    instruction: "Build 3 sentences about markets and competition using the word tiles.",
    instructionRu: "Составьте 3 предложения о рынках и конкуренции, используя блоки слов.",
    wordBank: ["market", "competition", "compete", "monopoly", "overheads", "fluctuate", "break even", "recruit", "purchase", "enterprise", "deal", "complaint", "cancel", "damage", "permit"],
    sentenceTargets: [
      {
        prompt: "Build the sentence: What is a market?",
        tiles: ['A', 'market', 'is', 'a', 'place', 'where', 'buyers', 'and', 'sellers', 'meet.', 'monopoly', 'price'],
        answer: ['A', 'market', 'is', 'a', 'place', 'where', 'buyers', 'and', 'sellers', 'meet.']
      },
      {
        prompt: "Sentence 2 — What does competition do to prices?",
        tiles: ['Competition', 'between', 'companies', 'keeps', 'prices', 'lower', 'for', 'customers.', 'higher', 'demand', 'monopoly', 'supply'],
        answer: ['Competition', 'between', 'companies', 'keeps', 'prices', 'lower', 'for', 'customers.']
      },
      {
        prompt: "Sentence 3 — What happens with a monopoly?",
        tiles: ['If', 'one', 'company', 'has', 'a', 'monopoly', 'it', 'can', 'set', 'high', 'prices', 'because', 'customers', 'have', 'no', 'other', 'choice.', 'low', 'many'],
        answer: ['If', 'one', 'company', 'has', 'a', 'monopoly', 'it', 'can', 'set', 'high', 'prices', 'because', 'customers', 'have', 'no', 'other', 'choice.']
      }
    ],
    sampleAnswer: "A market is a place where buyers and sellers meet to trade goods. Competition between companies keeps prices lower for customers. If one company has a monopoly, it can set high prices because customers have no other choice.",
    teacherNotes: "Check that students use at least 5 unit words correctly in context. Accept simple grammar (A1–A2 level). Look for correct use of any new words: complain, cancel, damage, deal, permit."
  },
  scenario: {
    title: "Scenario Loop: You Are a Business Owner",
    description: "You own a small coffee shop. Make decisions about competition, pricing, and growth. Use Unit 1 vocabulary.",
    conclusion: "Running a business requires smart decisions about competition, costs, and long-term strategy.",
    steps: [
      {
        situation: "A big chain coffee shop opens next to you. They have lower prices. Your customers start to leave.",
        context: "You need to decide how to compete.",
        vocabFocus: "compete",
        options: [
          { text: "Lower your prices too. Compete on price.", vocabUsed: "competitive", isOptimal: false, feedback: "Lowering prices too much may cover your overheads but reduces profit. A risky strategy." },
          { text: "Offer better quality and unique products. Compete differently.", vocabUsed: "competition", isOptimal: true, feedback: "Good! Differentiating your product is a smart competitive strategy." },
          { text: "Close the shop. You cannot compete.", vocabUsed: "enterprise", isOptimal: false, feedback: "Closing too early is not a good business decision. There are other options." }
        ]
      },
      {
        situation: "Your rent and electricity bills went up. Your overheads are now very high.",
        context: "You must control costs to break even.",
        vocabFocus: "overheads",
        options: [
          { text: "Negotiate better prices with your coffee suppliers.", vocabUsed: "negotiate", isOptimal: true, feedback: "Excellent! Negotiating with suppliers is a smart way to reduce costs." },
          { text: "Hire more workers to work faster.", vocabUsed: "recruit", isOptimal: false, feedback: "More workers means higher costs — this will increase overheads, not reduce them." },
          { text: "Ignore the costs and hope things improve.", vocabUsed: "circumstances", isOptimal: false, feedback: "Ignoring costs is dangerous. You may never reach the break-even point." }
        ]
      },
      {
        situation: "A customer complained about a damaged product. They sent a formal complaint and are demanding a refund.",
        context: "You must deal with the complaint correctly.",
        vocabFocus: "complaint",
        options: [
          { text: "Communicate with the customer and process the refund. The customer is entitled to it.", vocabUsed: "refund", isOptimal: true, feedback: "Correct. Customers are entitled to a refund for damaged goods. Good customer service builds trust." },
          { text: "Cancel the refund request. It is too expensive.", vocabUsed: "cancel", isOptimal: false, feedback: "Cancelling a legitimate refund damages your reputation and may cause legal problems." },
          { text: "Ignore the complaint and hope the customer forgets.", vocabUsed: "damage", isOptimal: false, feedback: "Ignoring complaints causes serious reputational damage and is undesirable for any business." }
        ]
      },
      {
        situation: "You want to expand. A bank offers you a loan. A competitor wants to merge with you.",
        context: "Growth decision time.",
        vocabFocus: "merger",
        options: [
          { text: "Accept the merger offer. Become one bigger company.", vocabUsed: "merger", isOptimal: true, feedback: "A merger can reduce overheads and increase market power. A strong choice." },
          { text: "Take the loan and expand alone.", vocabUsed: "obtain", isOptimal: false, feedback: "A loan adds debt. If revenue doesn't grow fast enough, you may not break even." },
          { text: "Do nothing. Stay small.", vocabUsed: "enterprise", isOptimal: false, feedback: "Not growing may mean competitors eventually monopolise the local market." }
        ]
      },
      {
        situation: "The government wants to restrict large coffee chains from dominating the market. They ask for your opinion.",
        context: "You represent small business owners.",
        vocabFocus: "restrict",
        options: [
          { text: "Support the restriction. Protect small businesses from monopoly.", vocabUsed: "monopoly", isOptimal: true, feedback: "Correct logic. Restricting monopolies protects competition and helps small enterprises." },
          { text: "Oppose it. Free market means no restrictions.", vocabUsed: "authority", isOptimal: false, feedback: "Without restrictions, one company could monopolise the market and harm customers." },
          { text: "Ask the authority to authorize a full investigation first.", vocabUsed: "authorize", isOptimal: false, feedback: "Reasonable, but slow. Meanwhile the big chain may already control the market." }
        ]
      }
    ]
  },
  totalTest: {
    title: "TOTAL TEST — Unit 1: Markets & Monopolies",
    parts: [
      {
        id: "tt1_a",
        title: "Part A — Match the Word with its Definition",
        type: "match",
        instruction: "Match each business term with the correct definition. This tests your understanding of meaning, not just translation.",
        pairs: [
          { en: "competition", ru: "a situation in which multiple sellers compete to attract the same customers" },
          { en: "monopoly", ru: "a market structure in which one company is the only seller" },
          { en: "overheads", ru: "fixed costs that a business pays regardless of production volume" },
          { en: "fluctuate", ru: "to rise and fall repeatedly and unpredictably" },
          { en: "merger", ru: "the legal joining of two companies to form a single new entity" },
          { en: "recruit", ru: "to actively search for and hire new employees" },
          { en: "refund", ru: "money returned to a customer who received a faulty or unwanted product" },
          { en: "enterprise", ru: "a commercial organisation or the activity of running one" },
          { en: "purchase", ru: "a formal act of buying something" },
          { en: "authorize", ru: "to give official approval for an action to take place" },
          { en: "cancel", ru: "to officially stop or call off something that had been planned" },
          { en: "complaint", ru: "a formal statement expressing dissatisfaction with a product or service" }
        ]
      },
      {
        id: "tt1_a2",
        title: "Part A2 — Match the Word with its Definition",
        type: "match",
        instruction: "Match each word with the correct definition.",
        pairs: [
          { en: "cause", ru: "to make something happen; or the reason why something happens" },
          { en: "damage", ru: "harm done to something; or to harm or break something" },
          { en: "deal", ru: "a formal business agreement between two parties" },
          { en: "permit", ru: "an official document giving legal permission to do something" },
          { en: "entitle", ru: "to give someone the right to receive or do something" },
          { en: "prevail", ru: "to be the most powerful or widespread in a given situation" },
          { en: "communicate", ru: "to share information or ideas clearly with another person" },
          { en: "subject (to)", ru: "under the control of a rule, condition, or authority" }
        ]
      },
      {
        id: "tt1_b",
        title: "Part B — True or False",
        type: "trueFalse",
        instruction: "Read each statement carefully. Some are almost correct but contain a key inaccuracy. Decide: TRUE or FALSE?",
        items: [
          { statement: "Competition requires many sellers, not just one or two, all trying to attract the same customers.", answer: true, explanation: "Competition exists when multiple sellers compete for the same customers — it is not limited to any minimum number of sellers." },
          { statement: "A monopoly means that two companies share control of the same market equally.", answer: false, explanation: "A monopoly means ONE company is the only seller. Two companies sharing a market is a duopoly, not a monopoly." },
          { statement: "Overheads are costs that increase or decrease depending on how much a business produces.", answer: false, explanation: "Overheads are FIXED costs — they remain the same regardless of production volume." },
          { statement: "To negotiate means to have a discussion with the goal of reaching a mutual agreement.", answer: true, explanation: "Negotiate = discuss with another party to find an agreement or compromise." },
          { statement: "A legal monopoly is illegal and must be stopped by the government.", answer: false, explanation: "A legal monopoly is specifically PERMITTED by the government — for example, through a patent or state licence." },
          { statement: "Customers who receive a damaged product are entitled to claim a refund.", answer: true, explanation: "Entitled to = having the legal right to. Receiving a damaged product gives the customer the right to a refund." }
        ]
      },
      {
        id: "tt1_c",
        title: "Part C — Fill in the Gaps",
        type: "fillGap",
        instruction: "Read the paragraph carefully and fill in each gap with the correct word from the box. There are 2 extra words you will not need.",
        wordBank: ["competitive", "fluctuate", "overheads", "recruit", "monopoly", "break even", "complaint", "damage", "restrict", "prevail", "merger", "circumstances", "undesirable"],
        items: [
          { sentence: "When two companies decided to form a ______, the government became concerned about the impact on the market.", answer: "merger", explanation: "A merger = two companies joining to become one." },
          { sentence: "If one company controls the whole market, a ______ has formed, and competition disappears.", answer: "monopoly", explanation: "A monopoly = one company is the only seller." },
          { sentence: "The authorities decided to ______ the new company's market share to protect smaller businesses.", answer: "restrict", explanation: "Restrict = to limit something by rule." },
          { sentence: "The new business had very high ______ — including rent, electricity, and staff salaries.", answer: "overheads", explanation: "Overheads = fixed running costs." },
          { sentence: "Prices continued to ______ for several months before the market became stable.", answer: "fluctuate", explanation: "Fluctuate = to go up and down repeatedly." },
          { sentence: "The company hoped to ______ within its first year — covering all costs without any profit.", answer: "break even", explanation: "Break even = income equals costs exactly." },
          { sentence: "The firm needed to ______ experienced salespeople to stay ______ in the growing market.", answer: "recruit", explanation: "Recruit = to find and hire new workers." },
          { sentence: "Under such difficult ______, a formal ______ from a major customer caused serious ______ to the company's reputation.", answer: "circumstances", explanation: "Circumstances = conditions; complaint = formal statement of unhappiness; damage = harm." }
        ]
      },
      {
        id: "tt1_d",
        title: "Part D — Match the Concept",
        type: "conceptMatch",
        instruction: "Match each definition with the correct word. All definitions are complete sentences.",
        pairs: [
          { description: "This happens when a company's income is exactly equal to its costs, with no profit and no loss.", term: "break even" },
          { description: "This is the process a company uses to find, select, and formally hire new employees.", term: "recruitment" },
          { description: "This word describes a cost, condition, or outcome that nobody wants and that should be avoided.", term: "undesirable" },
          { description: "When one thing makes another thing happen, we say the first thing does this to the second.", term: "cause" },
          { description: "In competitive markets, this is what happens to the price that eventually becomes the most widespread.", term: "prevail" }
        ]
      },
      {
        id: "tt1_e",
        title: "Part E — Choose the Best Answer",
        type: "multipleChoice",
        instruction: "Choose the correct answer for each question.",
        items: [
          {
            sentence: "What is the break-even point?",
            options: ["When profit is at maximum", "When income exactly equals all costs", "When a company closes its doors", "When prices are at their highest"],
            answer: "When income exactly equals all costs"
          },
          {
            sentence: "A patent gives a company which type of market position for a defined period?",
            options: ["A competitive advantage", "A legal monopoly", "An oligopoly", "A merger benefit"],
            answer: "A legal monopoly"
          },
          {
            sentence: "Why are overheads described as 'fixed' costs?",
            options: ["They are always repaired", "They do not change with production volume", "They are set by the government", "They only apply to large companies"],
            answer: "They do not change with production volume"
          },
          {
            sentence: "If a customer is 'entitled' to a refund, what does this mean?",
            options: ["They would like one", "They have already received one", "They have a legal right to one", "They must apply in writing"],
            answer: "They have a legal right to one"
          },
          {
            sentence: "Prices that are 'subject to change without notice' means:",
            options: ["They will never change", "A formal announcement will always precede changes", "They may change at any time without prior warning", "Only the government can change them"],
            answer: "They may change at any time without prior warning"
          }
        ]
      }
    ]
  },
  crossword: {
    words: [
      { number: 1, word: 'DAMAGE',     dir: 'across', row: 0, col: 0, clue: 'To physically harm or break something.',                 clueRu: 'Повредить — причинить физический вред.' },
      { number: 2, word: 'MARKET',     dir: 'across', row: 2, col: 0, clue: 'A place where buyers and sellers meet to trade.',         clueRu: 'Рынок — место встречи покупателей и продавцов.' },
      { number: 3, word: 'PREVAIL',    dir: 'across', row: 7, col: 0, clue: 'To be the most common or to win in the end.',             clueRu: 'Преобладать — быть самым распространённым.' },
      { number: 4, word: 'CANCEL',     dir: 'across', row: 9, col: 6, clue: 'To stop something that was planned.',                    clueRu: 'Отменить — остановить запланированное.' },
      { number: 5, word: 'DEMAND',     dir: 'down',   row: 0, col: 0, clue: 'How much customers want to buy a product.',              clueRu: 'Спрос — желание покупателей купить товар.' },
      { number: 6, word: 'MERGER',     dir: 'down',   row: 0, col: 2, clue: 'Two companies joining to become one bigger company.',    clueRu: 'Слияние — два предприятия объединяются в одно.' },
      { number: 7, word: 'ENTERPRISE', dir: 'down',   row: 0, col: 5, clue: 'A business, or the initiative and courage to start one.', clueRu: 'Предприятие — бизнес или инициатива его создать.' },
    ]
  }
};