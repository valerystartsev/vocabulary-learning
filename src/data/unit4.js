export const unit4 = {
  id: 4,
  // R3: declarative section list
  // Section list — the order shown in the nav strip and the render loop.
  // Tools moved to /interactive-lab (Phase 2 of Lab refactor):
  //   gdpcalc, balancesheet  →  Interactive Lab
  // Their data fields (gdpTwoApproaches, balanceSheet) are still on
  // this object so the Lab can read them.
  sections: [
    'header', 'keyideas',
    'labbanner:gdp-calculator',         // GDP is foundational — calculator helps before reading
    'dictionary', 'indicators', 'businesscycle', 'annualreport',
    'labbanner:balance-sheet-builder',  // annual report contains a balance sheet
    'exercises', 'reading', 'comprehension', 'media', 'crossword',
    'dialogue', 'writing', 'scenario', 'totaltest', 'answerkey', 'summary',
  ],
  title: "Measuring the Economy",
  subtitle: "GDP, economic indicators, balance sheets, and government policy",
  description: "Learn how economies are measured, what economic indicators reveal, and how governments shape policy. Understand GDP, business cycles, annual reports, and the basics of business telephone communication.",
  descriptionRu: "Узнайте, как измеряется экономика, что показывают экономические индикаторы и как правительства формируют политику. Поймите ВВП, экономические циклы, годовые отчёты и основы делового телефонного общения.",

  keyIdeas: [
    {
      term: "GDP",
      termRu: "ВВП",
      meaning: "Gross Domestic Product — the total monetary value of all final goods and services produced in a country in one year.",
      meaningRu: "Валовой внутренний продукт — общая денежная стоимость всех конечных товаров и услуг, произведённых в стране за год.",
      icon: "BarChart3"
    },
    {
      term: "Indicators",
      termRu: "Индикаторы",
      meaning: "Statistics used to measure the health of an economy — leading, coincident, and lagging.",
      meaningRu: "Статистические показатели, используемые для оценки состояния экономики — опережающие, совпадающие и отстающие.",
      icon: "LineChart"
    },
    {
      term: "Performance",
      termRu: "Результаты",
      meaning: "How well a company or economy is doing — measured by profit, growth, assets, and other financial figures.",
      meaningRu: "Насколько хорошо работает компания или экономика — измеряется прибылью, ростом, активами и другими финансовыми показателями.",
      icon: "TrendingUp"
    }
  ],

  vocabulary: [
    {
      id: "u4_approach",
      term: "approach",
      pos: "noun",
      translationRu: "подход, метод",
      trick: "AP- = к + PROACH (от proche/proximus = близкий). APPROACH = «подход» — каким путём ты приближаешься к проблеме. 'Our approach' = наш метод.",
      meaningEn: "A way of dealing with a problem or task; a method of doing something.",
      meaningRu: "Способ решения проблемы или задачи; метод выполнения чего-либо.",
      example: "There are two approaches to calculating GDP: the earnings-and-cost approach and the flow-of-product approach.",
      collocations: ["a new approach (новый подход)", "different approaches (разные методы)", "take an approach (применять подход)", "approach to a problem (подход к проблеме)"]
    },
    {
      id: "u4_earningsapproach",
      term: "earnings-and-cost approach",
      pos: "noun phrase",
      translationRu: "метод суммирования доходов и затрат",
      trick: "EARNINGS = заработок + COST = затраты. Этот метод считает ВВП через ВСЕ доходы: зарплаты + рента + процент + прибыль. Кто-то заработал — кто-то заплатил.",
      meaningEn: "A method of calculating GDP by adding up all income earned in the economy: wages, rent, interest, and profit.",
      meaningRu: "Метод расчёта ВВП через сложение всех доходов в экономике: заработной платы, ренты, процента и прибыли.",
      example: "Using the earnings-and-cost approach, the economy's GDP equals the sum of all wages, rent, interest, and profits earned.",
      collocations: ["calculate GDP using the earnings-and-cost approach", "the earnings-and-cost approach to GDP"]
    },
    {
      id: "u4_flowapproach",
      term: "flow-of-product approach",
      pos: "noun phrase",
      translationRu: "метод суммирования конечных продуктов",
      trick: "FLOW = поток + PRODUCT = продукт. Метод считает поток конечных товаров: что куплено домохозяйствами, фирмами, государством, плюс чистый экспорт.",
      meaningEn: "A method of calculating GDP by adding up spending on all final goods and services: household consumption, investment, government spending, and net exports.",
      meaningRu: "Метод расчёта ВВП через сложение расходов на все конечные товары и услуги: потребление домохозяйств, инвестиции, государственные расходы и чистый экспорт.",
      example: "The flow-of-product approach measures GDP by counting every dollar spent on final goods.",
      collocations: ["the flow-of-product approach to GDP", "use the flow-of-product approach"]
    },
    {
      id: "u4_asset",
      term: "asset",
      pos: "noun",
      translationRu: "актив, имущество",
      trick: "ASSET = то, чем владеет компания. Любая ценная собственность: деньги, машины, здания, патенты. Запоминай: 'a set of valuables' — набор ценностей.",
      meaningEn: "Something owned by a person or company that has monetary value — cash, equipment, buildings, inventory.",
      meaningRu: "Что-то, чем владеет человек или компания и что имеет денежную стоимость — деньги, оборудование, здания, запасы.",
      example: "The company's total assets exceeded $5 billion, including factories, equipment, and cash deposits.",
      collocations: ["fixed assets (основные средства)", "current assets (оборотные активы)", "total assets (общие активы)", "valuable asset (ценный актив)"]
    },
    {
      id: "u4_coincident",
      term: "coincident economic indicators",
      pos: "noun phrase",
      translationRu: "совпадающие экономические индикаторы",
      trick: "CO- = вместе + INCIDENT = случай. Coincident = совпадающие во времени. Эти показатели меняются ОДНОВРЕМЕННО с экономикой — показывают «сейчас».",
      meaningEn: "Economic indicators that change at the same time as the overall economy, showing the current state of economic activity.",
      meaningRu: "Экономические индикаторы, которые изменяются одновременно с экономикой в целом, показывая её текущее состояние.",
      example: "Coincident economic indicators include employment levels, industrial production, and personal income — they show what is happening right now.",
      collocations: ["coincident indicators show current activity", "track coincident economic indicators"]
    },
    {
      id: "u4_contract",
      term: "contract",
      pos: "verb",
      translationRu: "сокращаться, сжиматься",
      trick: "CONTRACT как ГЛАГОЛ = сжиматься (не путать с существительным «договор»!). CON- = вместе + TRACT = тянуть. Экономика contracts — стягивается.",
      meaningEn: "To become smaller or shorter; to shrink. In economics: when the economy declines or shrinks.",
      meaningRu: "Становиться меньше или короче; сжиматься. В экономике: когда экономика снижается или сокращается.",
      example: "The economy began to contract in the second quarter — GDP fell by 0.5%.",
      collocations: ["the economy contracts (экономика сокращается)", "industries contract (отрасли сокращаются)", "contract sharply (резко сокращаться)"]
    },
    {
      id: "u4_contraction",
      term: "contraction",
      pos: "noun",
      translationRu: "сокращение, спад",
      trick: "CONTRACTION = существительное от contract (глагол). Период, когда экономика contracts → contraction. Фаза бизнес-цикла перед впадиной (trough).",
      meaningEn: "A period of economic decline, when GDP falls and business activity slows down. Part of the business cycle.",
      meaningRu: "Период экономического спада, когда ВВП падает и деловая активность замедляется. Часть экономического цикла.",
      example: "During an economic contraction, businesses cut staff and consumers reduce spending.",
      collocations: ["economic contraction (экономический спад)", "period of contraction (период сокращения)", "sharp contraction (резкое сокращение)"]
    },
    {
      id: "u4_equity",
      term: "equity",
      pos: "noun",
      translationRu: "собственный капитал",
      trick: "EQUITY от EQUAL = равный, справедливый. Equity — то, что принадлежит ВЛАДЕЛЬЦАМ компании после оплаты всех долгов. Активы минус обязательства.",
      meaningEn: "The value of a company that belongs to the owners after all debts (liabilities) are paid. Equity = assets − liabilities.",
      meaningRu: "Стоимость компании, принадлежащая владельцам после оплаты всех долгов (обязательств). Капитал = активы минус обязательства.",
      example: "The company's total assets are $10M and liabilities $4M — so the owners' equity is $6M.",
      collocations: ["owners' equity (собственный капитал владельцев)", "equity in a company (доля в компании)", "shareholders' equity (акционерный капитал)"]
    },
    {
      id: "u4_entrepreneur",
      term: "entrepreneur",
      pos: "noun",
      translationRu: "предприниматель",
      trick: "ENTREPRENEUR — французское слово (entre = между + prendre = брать). Тот, кто БЕРЁТ риск создания бизнеса. Стив Джобс — entrepreneur.",
      meaningEn: "A person who starts a new business, taking on financial risk in the hope of making profit.",
      meaningRu: "Человек, который создаёт новый бизнес, принимая на себя финансовый риск ради получения прибыли.",
      example: "Every entrepreneur faces the risk that their new business might fail in the first three years.",
      collocations: ["successful entrepreneur (успешный предприниматель)", "young entrepreneur (молодой предприниматель)", "tech entrepreneur (технологический предприниматель)"]
    },
    {
      id: "u4_exaggerate",
      term: "exaggerate",
      pos: "verb",
      translationRu: "преувеличивать",
      trick: "EX- = сильно + AGGER- = усиливать. Преувеличивать — слишком сильно подчёркивать. «Don't exaggerate the numbers» — не преувеличивай цифры.",
      meaningEn: "To make something appear larger, better, worse, or more important than it really is.",
      meaningRu: "Представлять что-то большим, лучшим, худшим или более важным, чем оно есть на самом деле.",
      example: "Executives must not exaggerate the company's performance in the annual report — investors rely on accurate numbers.",
      collocations: ["exaggerate the figures (преувеличивать цифры)", "exaggerate results (преувеличивать результаты)", "exaggerate the risk (преувеличивать риск)"]
    },
    {
      id: "u4_executive",
      term: "executive",
      pos: "noun",
      translationRu: "руководитель, исполнительный директор",
      trick: "EXECUTE = выполнять. EXECUTIVE — тот, кто ВЫПОЛНЯЕТ решения. CEO = Chief EXECUTIVE Officer — главный руководитель компании.",
      meaningEn: "A senior manager in a business or government who has the power to make important decisions.",
      meaningRu: "Старший менеджер в компании или правительстве, имеющий полномочия принимать важные решения.",
      example: "The chief executive made the final decision to invest in the new factory.",
      collocations: ["senior executive (старший руководитель)", "chief executive officer / CEO (генеральный директор)", "executive board (совет директоров)", "executive decision (управленческое решение)"]
    },
    {
      id: "u4_depreciation",
      term: "depreciation",
      pos: "noun",
      translationRu: "амортизация, обесценивание",
      trick: "DE- = вниз + PRECI- = ценить. DEPRECIATION = снижение стоимости с течением времени. Машина новая стоит $30K, через 5 лет — $10K. Это depreciation.",
      meaningEn: "The decrease in value of an asset over time due to use, wear, or age. In accounting: the cost spread across the years of the asset's useful life.",
      meaningRu: "Снижение стоимости актива со временем из-за использования, износа или возраста. В бухгалтерии: затраты, распределённые по годам полезного использования актива.",
      example: "The factory equipment depreciates by 10% each year — this depreciation is recorded as a cost in the income statement.",
      collocations: ["depreciation cost (амортизационные расходы)", "annual depreciation (ежегодная амортизация)", "depreciation of assets (амортизация активов)"]
    },
    {
      id: "u4_final",
      term: "final",
      pos: "adjective",
      translationRu: "конечный, окончательный",
      trick: "FINAL = конечный (от лат. finis — конец). 'Final goods' = конечные товары — те, что покупает потребитель. В отличие от 'input' (сырьё).",
      meaningEn: "Last in a series; the final stage of something. In economics: 'final goods' = goods sold to the end-consumer, not for further production.",
      meaningRu: "Последний в серии; окончательный этап. В экономике: 'final goods' = товары, продаваемые конечному потребителю.",
      example: "GDP only counts final goods — not the inputs used to make them.",
      collocations: ["final goods (конечные товары)", "final decision (окончательное решение)", "final answer (окончательный ответ)", "final stage (заключительный этап)"]
    },
    {
      id: "u4_leading",
      term: "leading economic indicators",
      pos: "noun phrase",
      translationRu: "опережающие экономические индикаторы",
      trick: "LEAD = вести вперёд. LEADING indicators — ВЕДУЩИЕ, идущие впереди экономики. Они меняются ДО того, как меняется экономика. Прогнозируют будущее.",
      meaningEn: "Economic indicators that change before the overall economy changes, helping to predict where the economy is heading.",
      meaningRu: "Экономические индикаторы, которые изменяются раньше экономики в целом, помогая предсказать её будущее направление.",
      example: "Stock prices, building permits, and new business orders are leading economic indicators — they signal future economic activity.",
      collocations: ["leading indicators predict future trends", "follow the leading economic indicators"]
    },
    {
      id: "u4_highlights",
      term: "highlights",
      pos: "noun",
      translationRu: "основные моменты, главные показатели",
      trick: "HIGH + LIGHTS = яркие моменты, ключевые точки. В годовом отчёте highlights — самые важные цифры на первой странице.",
      meaningEn: "The most important, interesting, or memorable parts of something. In business: the key figures and achievements from a report.",
      meaningRu: "Самые важные, интересные или запоминающиеся части чего-либо. В бизнесе: ключевые показатели и достижения из отчёта.",
      example: "The annual report's highlights showed revenue up 12% and net profit up 8% year on year.",
      collocations: ["financial highlights (финансовые показатели)", "performance highlights (основные результаты)", "annual report highlights (главное в годовом отчёте)"]
    },
    {
      id: "u4_household",
      term: "household",
      pos: "noun",
      translationRu: "домохозяйство",
      trick: "HOUSE + HOLD = то, что внутри дома. Household = все люди, живущие в одном доме и принимающие общие экономические решения. Семья как экономическая единица.",
      meaningEn: "All the people living together in one home as an economic unit. In economics: a key sector that earns income and spends on goods and services.",
      meaningRu: "Все люди, живущие вместе в одном доме как экономическая единица. В экономике: ключевой сектор, который получает доход и тратит на товары и услуги.",
      example: "Household spending accounts for around 60% of GDP in most developed economies.",
      collocations: ["household income (доход домохозяйства)", "household spending (расходы домохозяйства)", "household consumption (потребление домохозяйств)", "average household (среднее домохозяйство)"]
    },
    {
      id: "u4_lagging",
      term: "lagging economic indicators",
      pos: "noun phrase",
      translationRu: "отстающие экономические индикаторы",
      trick: "LAG = отставать. LAGGING indicators — ОТСТАЮЩИЕ от экономики. Они меняются ПОСЛЕ того, как изменилась экономика. Подтверждают тренд, а не предсказывают.",
      meaningEn: "Economic indicators that change after the overall economy changes, confirming trends after they have already happened.",
      meaningRu: "Экономические индикаторы, изменяющиеся позже общей экономики, подтверждая тренды уже после их завершения.",
      example: "Unemployment rate and inflation are lagging economic indicators — they confirm the direction of the economy after the change has occurred.",
      collocations: ["lagging indicators confirm past trends", "track the lagging economic indicators"]
    },
    {
      id: "u4_input",
      term: "input",
      pos: "noun",
      translationRu: "ресурсы, вводимые в производство",
      trick: "IN + PUT = положить ВНУТРЬ. Input — то, что вкладывается в производство: сырьё, труд, капитал. В отличие от output — что получается на выходе.",
      meaningEn: "Resources used in production — raw materials, labour, energy, or capital.",
      meaningRu: "Ресурсы, используемые в производстве — сырьё, труд, энергия или капитал.",
      example: "Steel and electricity are key inputs in the car manufacturing industry.",
      collocations: ["production inputs (производственные ресурсы)", "labour input (трудовой ресурс)", "key input (ключевой ресурс)", "raw input (сырьё)"]
    },
    {
      id: "u4_liability",
      term: "liability",
      pos: "noun",
      translationRu: "обязательство, пассив (долг)",
      trick: "LIABLE = ответственный. LIABILITY = обязательство, то, за что компания должна отвечать. Долги, кредиты, налоги к уплате — всё это liabilities.",
      meaningEn: "Money that a company owes to others — debts, loans, accounts payable. The opposite of an asset.",
      meaningRu: "Деньги, которые компания должна другим — долги, кредиты, кредиторская задолженность. Противоположность активу.",
      example: "The company's liabilities included $4M in bank loans and $1M in accounts payable to suppliers.",
      collocations: ["total liabilities (общие обязательства)", "current liabilities (краткосрочные обязательства)", "long-term liabilities (долгосрочные обязательства)", "assets vs liabilities (активы vs пассивы)"]
    },
    {
      id: "u4_measure",
      term: "measure",
      pos: "verb",
      translationRu: "измерять, оценивать",
      trick: "MEASURE = мерить. Measure GDP = измерять ВВП. Measure performance = оценивать результаты. Существует и существительное (a measure = мера).",
      meaningEn: "To find the size, amount, or value of something using a system or method.",
      meaningRu: "Определять размер, количество или ценность чего-либо с помощью системы или метода.",
      example: "Economists measure economic activity using GDP, employment data, and other indicators.",
      collocations: ["measure performance (оценивать результаты)", "measure GDP (измерять ВВП)", "measure results (измерять результаты)", "measure progress (измерять прогресс)"]
    },
    {
      id: "u4_net",
      term: "net",
      pos: "adjective",
      translationRu: "чистый (после вычетов)",
      trick: "NET = чистый, после всех вычетов. NET profit = чистая прибыль (после всех расходов и налогов). Противоположное — GROSS = валовой.",
      meaningEn: "The amount remaining after all deductions, costs, or taxes have been subtracted. The opposite of 'gross'.",
      meaningRu: "Сумма, остающаяся после вычета всех расходов, затрат или налогов. Противоположное 'gross' (валовой).",
      example: "The company had gross revenue of $10M, but net profit was only $1.2M after all costs.",
      collocations: ["net profit (чистая прибыль)", "net income (чистый доход)", "net exports (чистый экспорт)", "net value (чистая стоимость)"]
    },
    {
      id: "u4_performance",
      term: "performance",
      pos: "noun",
      translationRu: "результаты, показатели",
      trick: "PERFORM = выполнять + -ANCE = результат. Performance = насколько хорошо компания работает. Финансовое или операционное достижение.",
      meaningEn: "How well a company, person, or economy is functioning, measured by results such as profit, growth, or productivity.",
      meaningRu: "Насколько хорошо функционирует компания, человек или экономика — оценивается по результатам: прибыль, рост, производительность.",
      example: "The company's performance this year was excellent — revenue grew 15% and profit margins improved.",
      collocations: ["strong performance (сильные результаты)", "financial performance (финансовые показатели)", "measure performance (оценивать результаты)", "annual performance (годовые результаты)"]
    },
    {
      id: "u4_profit",
      term: "profit",
      pos: "noun",
      translationRu: "прибыль",
      trick: "PROFIT — от лат. proficere = «продвигаться вперёд». Прибыль = доход минус расходы. Если revenue выше costs — есть profit. Если ниже — loss.",
      meaningEn: "The money a business earns after all costs and expenses have been paid; the financial gain.",
      meaningRu: "Деньги, которые бизнес получает после оплаты всех расходов и издержек; финансовая выгода.",
      example: "After paying salaries, rent, and taxes, the company made a profit of $340,000.",
      collocations: ["make a profit (получать прибыль)", "net profit (чистая прибыль)", "profit margin (прибыльность)", "annual profit (годовая прибыль)"]
    },
    {
      id: "u4_receipt",
      term: "receipt",
      pos: "noun",
      translationRu: "квитанция, чек, получение",
      trick: "RECEIPT от RECEIVE = получать. То, что вы ПОЛУЧАЕТЕ, заплатив за товар — подтверждение оплаты. Бумажка или электронный документ.",
      meaningEn: "A written or printed statement showing that money or goods have been received. Also: the act of receiving.",
      meaningRu: "Письменный или печатный документ, подтверждающий получение денег или товаров. Также: акт получения.",
      example: "Keep the receipt — you'll need it if you want to return the laptop within 30 days.",
      collocations: ["keep a receipt (сохранить чек)", "issue a receipt (выписать квитанцию)", "receipt of payment (получение оплаты)", "receipts and expenses (приходы и расходы)"]
    },
    {
      id: "u4_withdraw",
      term: "withdraw",
      pos: "verb",
      translationRu: "снимать (деньги со счёта); отзывать",
      trick: "WITH- = от + DRAW = тянуть. WITHDRAW = вытянуть, забрать обратно. Снять деньги с банкомата = withdraw cash. Также: отозвать предложение / заявление.",
      meaningEn: "To take money out of a bank account. Also: to remove or take back something previously offered.",
      meaningRu: "Снимать деньги с банковского счёта. Также: убирать или забирать обратно что-то ранее предложенное.",
      example: "She went to the ATM to withdraw £200 in cash. Later, the company withdrew its offer.",
      collocations: ["withdraw cash (снять наличные)", "withdraw from an account (снять со счёта)", "withdraw an offer (отозвать предложение)", "withdraw funds (изъять средства)"]
    },
    {
      id: "u4_withdrawal",
      term: "withdrawal",
      pos: "noun",
      translationRu: "снятие (с депозита), изъятие",
      trick: "WITHDRAWAL — существительное от withdraw. Сам акт снятия денег или изъятия. 'A cash withdrawal of $200' = снятие наличных на 200.",
      meaningEn: "The act of taking money out of a bank account. Also: the act of removing or taking something back.",
      meaningRu: "Действие по снятию денег с банковского счёта. Также: акт устранения или возвращения чего-либо.",
      example: "Large cash withdrawals over $10,000 must be reported to the central bank in many countries.",
      collocations: ["cash withdrawal (снятие наличных)", "make a withdrawal (сделать снятие)", "withdrawal limit (лимит на снятие)", "early withdrawal (досрочное снятие)"]
    }
  ],

  // ── НОВАЯ ФИШКА: GDP Two Approaches (вместо comics/growthImpactMap) ──────────
  gdpTwoApproaches: {
    title: "Two Ways to Measure GDP",
    description: "GDP can be calculated two different ways — yet both give the same total. Explore each approach, see the numbers, and understand why every dollar earned is a dollar spent.",
    descriptionRu: "ВВП можно рассчитать двумя разными способами — и оба дают одинаковый результат. Изучите каждый подход, увидьте цифры и поймите, почему каждый заработанный доллар — это потраченный доллар.",
    columns: [
      {
        id: "earnings",
        title: "Earnings-and-Cost Approach",
        titleRu: "Метод суммирования доходов",
        subtitle: "Adds up all income earned in the economy",
        subtitleRu: "Складывает все доходы, полученные в экономике",
        color: "#5E9E89",
        icon: "Wallet",
        lineItems: [
          { label: "Wages", labelRu: "Заработная плата", value: 450, vocabId: null },
          { label: "Rent", labelRu: "Рента", value: 80, vocabId: null },
          { label: "Interest", labelRu: "Проценты", value: 60, vocabId: null },
          { label: "Profit", labelRu: "Прибыль", value: 110, vocabId: "u4_profit" }
        ],
        total: 700,
        vocab: ["earnings-and-cost approach", "profit", "approach", "measure"]
      },
      {
        id: "product",
        title: "Flow-of-Product Approach",
        titleRu: "Метод суммирования продукта",
        subtitle: "Adds up all spending on final goods",
        subtitleRu: "Складывает все расходы на конечные товары",
        color: "#C9955A",
        icon: "Package",
        lineItems: [
          { label: "Household spending", labelRu: "Расходы домохозяйств", value: 420, vocabId: "u4_household" },
          { label: "Investment", labelRu: "Инвестиции", value: 140, vocabId: null },
          { label: "Government spending", labelRu: "Государственные расходы", value: 100, vocabId: null },
          { label: "Net exports", labelRu: "Чистый экспорт", value: 40, vocabId: "u4_net" }
        ],
        total: 700,
        vocab: ["flow-of-product approach", "household", "net", "final", "input"]
      }
    ],
    verdict: {
      match: true,
      message: "Both approaches give $700. Every dollar of income is a dollar of spending — this is the circular flow of the economy.",
      messageRu: "Оба подхода дают $700. Каждый доллар дохода — это доллар расхода. Это круговорот доходов в экономике."
    },
    explanation: "Why does this work? When a business pays a worker $50 in wages, that worker spends $50 on goods. The $50 appears in BOTH columns: as wage income (earnings-and-cost) and as consumer spending (flow-of-product). Same dollar, counted from two angles. That is why both approaches give the same total GDP.",
    explanationRu: "Почему так получается? Когда бизнес платит работнику $50 зарплаты, этот работник тратит $50 на товары. Те же $50 появляются в ОБЕИХ колонках: как зарплатный доход (метод доходов) и как потребительская трата (метод продукта). Один и тот же доллар, посчитанный с двух сторон."
  },

  exercises: [
    {
      id: "ex4_match_a",
      type: "match",
      title: "Match the Word with the Translation — A: GDP and approaches",
      instruction: "Connect each English term with its Russian translation.",
      pairs: [
        { en: "approach",                     ru: "подход, метод" },
        { en: "earnings-and-cost approach",   ru: "метод суммирования доходов" },
        { en: "flow-of-product approach",     ru: "метод суммирования конечных продуктов" },
        { en: "household",                    ru: "домохозяйство" },
        { en: "input",                        ru: "вводимые ресурсы" }
      ]
    },
    {
      id: "ex4_match_b",
      type: "match",
      title: "Match the Word with the Translation — B: Indicators and the business cycle",
      instruction: "Connect each English term with its Russian translation.",
      pairs: [
        { en: "leading economic indicators",      ru: "опережающие индикаторы" },
        { en: "coincident economic indicators",   ru: "совпадающие индикаторы" },
        { en: "lagging economic indicators",      ru: "отстающие индикаторы" },
        { en: "contract (v)",                     ru: "сокращаться (об экономике)" },
        { en: "contraction",                      ru: "спад, сжатие" }
      ]
    },
    {
      id: "ex4_match_c",
      type: "match",
      title: "Match the Word with the Translation — C: Balance sheet and performance",
      instruction: "Connect each English term with its Russian translation.",
      pairs: [
        { en: "asset",         ru: "актив" },
        { en: "liability",     ru: "обязательство, пассив" },
        { en: "equity",        ru: "собственный капитал" },
        { en: "depreciation",  ru: "амортизация" },
        { en: "net",           ru: "чистый (после вычетов)" }
      ]
    },
    {
      id: "ex4_tf",
      type: "trueFalse",
      title: "True or False?",
      instruction: "Read each sentence. Is it TRUE or FALSE?",
      items: [
        { statement: "GDP only counts final goods and services, not the inputs used to make them.", answer: true, explanation: "Correct — counting inputs separately would double-count, so GDP includes only final goods sold to end users." },
        { statement: "The earnings-and-cost approach and the flow-of-product approach give different totals when calculating GDP.", answer: false, explanation: "Both approaches give the SAME total — every dollar earned is a dollar spent. They are two views of the same economic activity." },
        { statement: "Leading economic indicators show what is happening in the economy right now.", answer: false, explanation: "Leading indicators predict the FUTURE. Coincident indicators show the present. Lagging indicators confirm the past." },
        { statement: "A contraction is a period when the economy shrinks and GDP falls.", answer: true, explanation: "Correct — economic contraction = the phase of the business cycle when GDP declines and activity slows down." },
        { statement: "Equity in a company equals total assets plus total liabilities.", answer: false, explanation: "Equity = assets MINUS liabilities. If you own a $300K house with a $200K mortgage, your equity is $100K, not $500K." },
        { statement: "Depreciation is the increase in the value of an asset over time.", answer: false, explanation: "Depreciation is the DECREASE in value over time — machines, cars, equipment all depreciate." },
        { statement: "An entrepreneur is someone who creates a new business and takes on financial risk.", answer: true, explanation: "Correct — entrepreneurs build new ventures, accepting the risk of failure for the chance of profit." },
        { statement: "Net profit is the same as revenue.", answer: false, explanation: "Revenue = total income from sales. Net profit = revenue MINUS all costs and taxes. Net profit is usually much smaller than revenue." },
        { statement: "Lagging economic indicators include unemployment rate and the average duration of unemployment.", answer: true, explanation: "Correct — these confirm trends after the economy has already changed. Unemployment usually rises after a contraction has already started." },
        { statement: "Household spending is a key part of the flow-of-product approach to GDP.", answer: true, explanation: "Correct — households are one of the four sectors (households, businesses, government, foreign sector) that spend on final goods." },
        { statement: "To exaggerate the company's performance in a financial report is a sign of good business practice.", answer: false, explanation: "Exaggerating numbers is unethical and often illegal. Investors and regulators require accurate, verifiable financial data." },
        { statement: "A receipt is a written confirmation that money or goods have been received.", answer: true, explanation: "Correct — a receipt is documentary proof of a transaction." }
      ]
    },
    {
      id: "ex4_fill",
      type: "fillGap",
      title: "Fill in the Gaps",
      instruction: "Complete each sentence with the correct word from the box.",
      wordBank: ["approach", "GDP", "household", "input", "leading", "coincident", "lagging", "contract", "contraction", "asset", "liability", "equity", "entrepreneur", "executive", "depreciation", "final", "highlights", "measure", "net", "performance", "profit", "receipt", "withdraw", "withdrawal", "exaggerate"],
      items: [
        { sentence: "______ counts the total monetary value of all final goods and services produced in a country in one year.", answer: "GDP", explanation: "GDP = Gross Domestic Product, the most common measure of an economy's size." },
        { sentence: "There are two ______ to calculating GDP: the earnings-and-cost approach and the flow-of-product approach.", answer: "approach", explanation: "An approach is a method or way of solving a problem." },
        { sentence: "______ spending makes up about 60% of GDP in most developed economies.", answer: "Household", explanation: "Households are families living together as an economic unit, spending on consumption." },
        { sentence: "Stock prices and building permits are examples of ______ economic indicators — they predict future trends.", answer: "leading", explanation: "Leading indicators change BEFORE the economy as a whole." },
        { sentence: "The unemployment rate is a ______ indicator — it confirms trends after they have already occurred.", answer: "lagging", explanation: "Lagging indicators move AFTER the economy changes." },
        { sentence: "During an economic ______, GDP falls and businesses cut jobs.", answer: "contraction", explanation: "Contraction = the phase of the business cycle when activity shrinks." },
        { sentence: "Buildings, machines, and inventory are all ______ owned by the company.", answer: "assets", explanation: "An asset is anything of monetary value owned by a person or business." },
        { sentence: "A bank loan of $300,000 is a ______ — money the company owes.", answer: "liability", explanation: "Liabilities are debts and obligations." },
        { sentence: "The owners' ______ in the company equals total assets minus total liabilities.", answer: "equity", explanation: "Equity = the remaining value belonging to the owners after debts are paid." },
        { sentence: "Each year, the factory equipment loses 10% of its value — this is recorded as ______ in the income statement.", answer: "depreciation", explanation: "Depreciation = the decrease in value of an asset over time." },
        { sentence: "Sergei is an ______ — he founded the company and took the risk of starting a new business.", answer: "entrepreneur", explanation: "An entrepreneur creates and runs a new business venture." },
        { sentence: "The chief ______ approved the budget for next year's expansion plans.", answer: "executive", explanation: "An executive is a senior decision-maker in a company." },
        { sentence: "Economists ______ the economy using GDP, employment data, and price indices.", answer: "measure", explanation: "Measure = to determine the size or value of something." },
        { sentence: "After all costs and taxes, the company's ______ profit was $340 million.", answer: "net", explanation: "Net = after all deductions; the final amount." },
        { sentence: "She went to the ATM to ______ £200 in cash for the weekend.", answer: "withdraw", explanation: "Withdraw = to take money out of a bank account." },
        { sentence: "The annual report ______ showed revenue up 12% and profit up 8% year on year.", answer: "highlights", explanation: "Highlights = the most important figures and achievements." }
      ]
    },
    {
      id: "ex4_choose",
      type: "multipleChoice",
      title: "Choose the Correct Word",
      instruction: "Choose the best answer to complete each sentence.",
      items: [
        {
          sentence: "What does GDP measure?",
          options: ["Total population of a country", "Total monetary value of all final goods and services produced in a year", "The number of companies in the economy", "The interest rate set by the central bank"],
          answer: "Total monetary value of all final goods and services produced in a year",
          explanation: "GDP = the size of an economy measured by total output."
        },
        {
          sentence: "Which two approaches are used to calculate GDP?",
          options: ["Inflation and unemployment", "Earnings-and-cost AND flow-of-product", "Imports and exports only", "Public and private sectors only"],
          answer: "Earnings-and-cost AND flow-of-product",
          explanation: "These two approaches give the same total because every dollar earned is a dollar spent."
        },
        {
          sentence: "Which is a LEADING economic indicator?",
          options: ["Unemployment rate", "Stock market prices", "Inflation rate", "Average duration of unemployment"],
          answer: "Stock market prices",
          explanation: "Stock prices reflect expectations about future profits — they predict economic direction."
        },
        {
          sentence: "If a company has $5M in assets and $3M in liabilities, what is its equity?",
          options: ["$8M", "$2M", "$15M", "−$2M"],
          answer: "$2M",
          explanation: "Equity = Assets − Liabilities = $5M − $3M = $2M."
        },
        {
          sentence: "What is depreciation in an annual report?",
          options: ["The increase in value of an asset over time", "The decrease in value of an asset over time, recorded as a cost", "The total profit of a company", "A type of liability"],
          answer: "The decrease in value of an asset over time, recorded as a cost",
          explanation: "Depreciation reflects the gradual wearing out or obsolescence of fixed assets."
        },
        {
          sentence: "Who is most likely to be an entrepreneur?",
          options: ["A government tax officer", "A senior accountant in a large corporation", "A person starting a new tech company at financial risk", "A central bank economist"],
          answer: "A person starting a new tech company at financial risk",
          explanation: "Entrepreneurs are founders who accept risk to build new ventures."
        },
        {
          sentence: "If revenue is $10M and total costs are $8M, what is net profit?",
          options: ["$10M", "$8M", "$2M", "$18M"],
          answer: "$2M",
          explanation: "Net profit = Revenue − Costs = $10M − $8M = $2M."
        },
        {
          sentence: "What is a household in economic terms?",
          options: ["Only married couples", "A factory that produces consumer goods", "All people living together as an economic unit, sharing income and expenses", "A government department"],
          answer: "All people living together as an economic unit, sharing income and expenses",
          explanation: "In economics, a household is the consumption unit — families plus singles living independently."
        }
      ]
    },
    {
      id: "ex4_concept",
      type: "conceptMatch",
      title: "Match the Concept",
      instruction: "Match each description with the correct economic term.",
      pairs: [
        { description: "The phase of the business cycle when GDP declines and economic activity slows down.", term: "contraction" },
        { description: "A measurement that changes BEFORE the overall economy changes — used to predict future trends.", term: "leading economic indicator" },
        { description: "The value that belongs to the owners of a company after all debts are subtracted from total assets.", term: "equity" },
        { description: "Money that a company owes to others, such as bank loans or unpaid bills to suppliers.", term: "liability" },
        { description: "The systematic decrease in the value of a long-term asset over time, recorded as an expense.", term: "depreciation" },
        { description: "A person who creates a new business venture, taking on financial risk in exchange for potential profit.", term: "entrepreneur" },
        { description: "The total monetary value of all final goods and services produced in a country in one year.", term: "GDP" },
        { description: "All the people living together as one economic unit, earning income and spending on goods and services.", term: "household" }
      ]
    }
  ],

  reading: {
    title: "A Nation's Economy: GDP, Indicators, and Performance",
    guidance: "Read the text slowly. Many words are familiar from the Dictionary. Important terms are highlighted. Read for the main ideas first, then go back to check the details.",
    guidanceRu: "Читайте текст медленно. Многие слова знакомы из Словаря. Важные термины выделены. Сначала читайте ради основных идей, потом возвращайтесь за деталями.",
    paragraphs: [
      {
        text: "How do we know if a country's economy is doing well? Economists **measure** national economic activity using **GDP** — Gross Domestic Product. GDP is the total **monetary value** of all **final** goods and services produced in a country in one year. The word **final** is important: GDP only counts finished products that consumers buy, not the **inputs** like steel, fabric, or electricity used to make them. Counting inputs separately would mean counting the same value twice.",
        glossary: { "GDP": "ВВП — Валовой Внутренний Продукт", "monetary value": "денежная стоимость", "final": "конечный", "input": "ресурсы (вводимые в производство)" }
      },
      {
        text: "There are two main **approaches** to calculating GDP. The **earnings-and-cost approach** adds up all the income earned in the economy: wages paid to workers, rent paid for property, interest paid on loans, and **profit** earned by businesses. The **flow-of-product approach** adds up all the spending on **final** goods and services: by **households**, by businesses (investment), by the government, and by foreign buyers (net exports). Both **approaches** give the same total — because every dollar of income is a dollar of someone's spending.",
        glossary: { "approach": "подход, метод", "earnings-and-cost approach": "метод суммирования доходов", "flow-of-product approach": "метод суммирования продукта", "household": "домохозяйство", "profit": "прибыль" }
      },
      {
        text: "Beyond GDP, economists track **economic indicators** to follow the health of the economy. There are three categories. **Leading economic indicators** change before the economy does — they help to predict future trends. Examples include stock prices, building permits, and new business orders. **Coincident economic indicators** change at the same time as the economy — they show what is happening now. These include employment levels, industrial production, and **household** income. **Lagging economic indicators** change after the economy — they confirm trends. Unemployment rate and inflation are classic lagging indicators.",
        glossary: { "leading economic indicators": "опережающие индикаторы", "coincident economic indicators": "совпадающие индикаторы", "lagging economic indicators": "отстающие индикаторы" }
      },
      {
        text: "Economies move through cycles. During expansion, GDP grows steadily. At the peak, growth slows. Then comes the **contraction** — when the economy **contracts**, GDP falls, and businesses cut staff. Finally, the trough — the lowest point — before recovery begins and the cycle starts again. Understanding the **business cycle** helps **executives** plan: they expand operations during growth and tighten budgets during a **contraction**. Forward-thinking companies watch the **leading economic indicators** carefully to anticipate change.",
        glossary: { "contract": "сжиматься, сокращаться", "contraction": "сокращение, спад", "executive": "руководитель" }
      },
      {
        text: "Companies report their economic **performance** in annual reports. These reports begin with **highlights** — the headline figures investors want to see immediately: revenue, **net profit**, and growth percentages. The financial statements follow: the balance sheet lists **assets** (what the company owns — cash, equipment, buildings), **liabilities** (what it owes — loans, accounts payable), and **equity** (the owners' share, calculated as **assets** minus **liabilities**). The income statement shows revenue, costs, **depreciation**, and the final **net profit**.",
        glossary: { "performance": "результаты, показатели", "highlights": "основные моменты", "net profit": "чистая прибыль", "asset": "актив", "liability": "обязательство", "equity": "собственный капитал", "depreciation": "амортизация" }
      },
      {
        text: "Many **assets** lose value over time — this is **depreciation**. A factory machine bought for $100,000 may be worth only $20,000 after 10 years of use. Accountants spread this $80,000 loss across the years, recording $8,000 of **depreciation** each year as a cost. This reduces the company's reported **net profit** but reflects economic reality: equipment wears out, technology becomes obsolete, and buildings deteriorate. **Depreciation** is not a cash payment — it's an accounting recognition that **assets** are not worth what they were.",
        glossary: { "asset": "актив", "depreciation": "амортизация, обесценивание" }
      },
      {
        text: "Behind every successful business is an **entrepreneur** — someone who saw an opportunity and took the financial risk of creating something new. As the company grows, **executives** take over the daily management and strategic decisions. Both **entrepreneurs** and **executives** must understand the financial **highlights**, **measure** the company's **performance** honestly, and never **exaggerate** the numbers. Every claim in a report must be backed by evidence — every transaction by a **receipt** or financial record. Investors trust companies that report clearly.",
        glossary: { "entrepreneur": "предприниматель", "executive": "руководитель", "highlights": "основные моменты", "measure": "измерять", "exaggerate": "преувеличивать", "receipt": "квитанция" }
      },
      {
        text: "National governments shape the economy through monetary and fiscal **policy**. Monetary **policy** controls the money supply and interest rates — the central bank's tool. Fiscal **policy** uses taxes and government spending. Different countries follow different **approaches**. Germany and the Netherlands traditionally focus on stability and balanced budgets. France takes a more interventionist approach, with a large public sector. Russia's economy is heavily influenced by natural resources and state-owned enterprises. China combines central planning with market reforms — a system often called 'state capitalism'. Understanding these national strategies is essential in international business.",
        glossary: { "policy": "политика", "approach": "подход" }
      }
    ],
    postReadingTasks: [
      {
        type: 'trueFalse',
        q: 'GDP counts the value of intermediate goods like steel and fabric used in production.',
        answer: false,
        explanation: 'False — GDP only counts final goods to avoid double-counting the same value.'
      },
      {
        type: 'trueFalse',
        q: 'Leading economic indicators change before the economy does.',
        answer: true,
        explanation: 'Yes — leading indicators like stock prices help predict future economic trends.'
      },
      {
        type: 'choice',
        q: 'What is the earnings-and-cost approach to calculating GDP based on?',
        options: [
          'All the spending on final goods and services',
          'All the income earned in the economy',
          'The government\'s tax revenue',
          'Foreign trade only'
        ],
        answer: 'All the income earned in the economy',
        explanation: 'The earnings-and-cost approach adds up wages, rent, interest, and profit.'
      },
      {
        type: 'choice',
        q: 'What is depreciation in business terms?',
        options: [
          'A sudden increase in asset value',
          'The decrease in value of assets over time',
          'A type of loan',
          'The cost of raw materials'
        ],
        answer: 'The decrease in value of assets over time',
        explanation: 'Depreciation is the gradual loss of value due to wear, age, or obsolescence.'
      },
      {
        type: 'open',
        q: 'Why is it important for companies to report financial highlights honestly?',
        model: 'Honest reporting builds trust with investors. Every claim must be backed by evidence, and accurate numbers help stakeholders make informed decisions about the company\'s performance.'
      }
    ]
  },

  comprehension: [
    { q: "What does GDP measure?", model: "GDP measures the total monetary value of all final goods and services produced in a country in one year. It is the most common way to measure the size of an economy." },
    { q: "Why does GDP count only final goods, not inputs?", model: "Counting inputs would mean counting the same value twice — once as the cost of materials and again as part of the finished product. GDP includes only final goods to avoid double-counting." },
    { q: "Explain the difference between the earnings-and-cost approach and the flow-of-product approach.", model: "The earnings-and-cost approach adds up all income earned in the economy (wages, rent, interest, profit). The flow-of-product approach adds up all spending on final goods (households, investment, government, net exports). Both give the same total." },
    { q: "Give one example of a leading economic indicator and explain why it is 'leading'.", model: "Stock prices are a leading indicator because they reflect investors' expectations about future profits. They change before the overall economy changes, helping to predict trends." },
    { q: "What is the difference between assets, liabilities, and equity?", model: "Assets = what the company owns (cash, equipment, buildings). Liabilities = what the company owes (loans, unpaid bills). Equity = assets minus liabilities — the owners' share of the company." },
    { q: "What is depreciation and why is it recorded in the income statement?", model: "Depreciation is the decrease in value of a long-term asset over time, due to wear, age, or obsolescence. It is recorded as a cost because the asset is gradually losing its value as it is used." },
    { q: "What role does an entrepreneur play in the economy compared to an executive?", model: "An entrepreneur creates a new business and takes financial risk. An executive is a senior manager who runs the daily operations of an existing company and makes strategic decisions." },
    { q: "Name two ways governments influence the economy.", model: "Through monetary policy (controlling the money supply and interest rates via the central bank) and fiscal policy (using taxes and government spending). Different countries combine these in different ways." }
  ],

  // ── НОВАЯ ФИШКА: Telephone Etiquette Section (обязательная тема №2) ──────────
  telephoneEtiquetteSection: {
    title: "Telephone Etiquette in Business English",
    description: "Business phone calls follow clear conventions. Knowing the right phrases makes you sound professional, no matter who you are calling. Learn the four key situations: greeting, holding the line, taking a message, and transferring calls.",
    descriptionRu: "Деловые звонки следуют чётким правилам. Знание правильных фраз делает вашу речь профессиональной независимо от того, кому вы звоните. Изучите четыре ключевые ситуации: приветствие, ожидание на линии, передача сообщения и перевод звонка.",
    phraseGroups: [
      {
        id: "greeting",
        situation: "Answering the call / Greeting",
        situationRu: "Ответ на звонок / Приветствие",
        icon: "Phone",
        color: "#5E9E89",
        phrases: [
          { phrase: "Good morning, [Company Name]. How may I help you?", russianHint: "Стандартное приветствие в компании" },
          { phrase: "[Company Name], this is [Your Name] speaking. How can I help?", russianHint: "Полное представление" },
          { phrase: "Hello, you've reached [Department]. This is [Name].", russianHint: "Для звонков внутри отдела" },
          { phrase: "Thank you for calling [Company]. How may I direct your call?", russianHint: "Для секретаря/ресепшен" }
        ]
      },
      {
        id: "holding",
        situation: "Asking to hold / Holding the line",
        situationRu: "Просьба подождать / Ожидание на линии",
        icon: "PauseCircle",
        color: "#C9955A",
        phrases: [
          { phrase: "Could you hold the line for a moment, please?", russianHint: "Вежливая просьба подождать" },
          { phrase: "Please hold while I check that for you.", russianHint: "Пока проверяю информацию" },
          { phrase: "I'm putting you on hold for just a moment.", russianHint: "Ставлю на удержание" },
          { phrase: "Thank you for holding. I have the information now.", russianHint: "Возвращение после ожидания" }
        ]
      },
      {
        id: "message",
        situation: "Taking a message",
        situationRu: "Принятие сообщения",
        icon: "Pencil",
        color: "#4A8C6A",
        phrases: [
          { phrase: "I'm afraid [Name] is not available right now. Can I take a message?", russianHint: "Сотрудник недоступен" },
          { phrase: "Would you like me to take a message?", russianHint: "Предложение записать сообщение" },
          { phrase: "Could you spell your surname, please?", russianHint: "Просьба продиктовать фамилию по буквам" },
          { phrase: "May I have your phone number so we can call you back?", russianHint: "Запрос номера для перезвона" }
        ]
      },
      {
        id: "transfer",
        situation: "Transferring the call",
        situationRu: "Перевод звонка",
        icon: "ArrowRightLeft",
        color: "#3B6EA5",
        phrases: [
          { phrase: "I'll put you through to [Name / Department] now.", russianHint: "Сейчас переведу" },
          { phrase: "Please hold while I transfer your call.", russianHint: "Подождите, перевожу звонок" },
          { phrase: "One moment, please. I'll connect you to the right person.", russianHint: "Момент, соединяю с нужным человеком" },
          { phrase: "I'm sorry, the line is busy. Can I take a message instead?", russianHint: "Линия занята — предложение оставить сообщение" }
        ]
      }
    ],
    tasks: [
      {
        id: "phone_match",
        type: "match",
        title: "Match the Phone Situation to the Best Phrase",
        instruction: "Match each situation with the phrase that fits best.",
        pairs: [
          { en: "Answering a business call professionally", ru: "Good morning, [Company]. How may I help you?" },
          { en: "Asking the caller to wait briefly", ru: "Could you hold the line for a moment, please?" },
          { en: "The person being called is not available", ru: "I'm afraid [Name] is not available. Can I take a message?" },
          { en: "Connecting the caller to another person", ru: "I'll put you through to [Name] now." },
          { en: "The other person's line is busy", ru: "I'm sorry, the line is busy. Can I take a message instead?" }
        ]
      },
      {
        id: "phone_tf",
        type: "trueFalse",
        title: "True or False — Phone Etiquette",
        instruction: "Read each statement about business telephone etiquette. Is it TRUE or FALSE?",
        items: [
          { statement: "When answering a business call, it is professional to greet the caller and identify yourself or your company.", answer: true, explanation: "Correct — a clear greeting that includes the company name (and sometimes your own) sets a professional tone." },
          { statement: "It is acceptable to put a customer on hold without asking permission first.", answer: false, explanation: "You should always ASK first: 'Could you hold the line for a moment, please?' Putting someone on hold without warning is rude." },
          { statement: "If the person being called is unavailable, you should hang up and let the caller try again.", answer: false, explanation: "Offer to take a message: 'Can I take a message?' or ask if you can transfer them to someone who can help." },
          { statement: "When taking a message, it is important to confirm the spelling of names and the phone number.", answer: true, explanation: "Correct — accurate information matters. Confirming details ensures the message gets through correctly." },
          { statement: "Saying 'Hold on!' loudly is the most professional way to ask someone to wait on a business call.", answer: false, explanation: "'Hold on!' is informal and abrupt. The professional phrase is 'Could you hold the line for a moment, please?'" }
        ]
      },
      {
        id: "phone_choose",
        type: "multipleChoice",
        title: "Choose the Most Professional Phrase",
        instruction: "Choose the most appropriate phrase for each business phone situation.",
        items: [
          {
            sentence: "You answer the company phone. What do you say first?",
            options: [
              "Hello?",
              "Good morning, RusTech Solutions. How may I help you?",
              "Yeah, who is this?",
              "Speak."
            ],
            answer: "Good morning, RusTech Solutions. How may I help you?",
            explanation: "Professional greeting includes the time of day, the company name, and an offer of help."
          },
          {
            sentence: "The executive your caller wants is in a meeting. What do you say?",
            options: [
              "Call back later.",
              "I'm afraid Ms Petrova is not available right now. Can I take a message?",
              "She is busy. Goodbye.",
              "I don't know where she is."
            ],
            answer: "I'm afraid Ms Petrova is not available right now. Can I take a message?",
            explanation: "Explain politely that she is unavailable and offer the next step — a message."
          },
          {
            sentence: "You need to find some information for the caller. What do you say before going to check?",
            options: [
              "Wait!",
              "Could you hold the line for a moment, please?",
              "Don't go anywhere.",
              "Bye for now."
            ],
            answer: "Could you hold the line for a moment, please?",
            explanation: "A polite request to wait — and 'please' makes it courteous."
          },
          {
            sentence: "The caller asked for the accounting department. What do you say before connecting them?",
            options: [
              "I'll put you through to accounting now.",
              "Hang up and try a different number.",
              "Accounting? Why?",
              "I'm transferring you, bye."
            ],
            answer: "I'll put you through to accounting now.",
            explanation: "'Put you through' is the standard professional phrase for transferring a call."
          }
        ]
      }
    ]
  },

  // ── НОВАЯ ФИШКА: Economic Indicators Dashboard ───────────────────────────────
  economicIndicatorsDashboard: {
    title: "The Three Types of Economic Indicators",
    description: "Economic indicators come in three groups. Each tells a different story about the economy: what is coming, what is happening now, and what has already happened.",
    descriptionRu: "Экономические индикаторы делятся на три группы. Каждая рассказывает свою историю об экономике: что приближается, что происходит сейчас и что уже произошло.",
    categories: [
      {
        id: "leading",
        title: "Leading Indicators",
        titleRu: "Опережающие индикаторы",
        subtitle: "Predict the future of the economy",
        subtitleRu: "Предсказывают будущее экономики",
        color: "#5E9E89",
        icon: "TrendingUp",
        when: "Change BEFORE the economy changes",
        whenRu: "Изменяются ДО того, как изменится экономика",
        indicators: [
          { name: "Stock market prices", nameRu: "Цены на фондовом рынке", reason: "Investors anticipate future profits" },
          { name: "Building permits", nameRu: "Разрешения на строительство", reason: "New construction signals investment in future capacity" },
          { name: "New business formation", nameRu: "Создание новых компаний", reason: "Entrepreneurs respond early to expected growth" },
          { name: "Consumer confidence index", nameRu: "Индекс потребительского доверия", reason: "Confident consumers will spend more in the future" }
        ]
      },
      {
        id: "coincident",
        title: "Coincident Indicators",
        titleRu: "Совпадающие индикаторы",
        subtitle: "Show what is happening right now",
        subtitleRu: "Показывают, что происходит сейчас",
        color: "#C9955A",
        icon: "Activity",
        when: "Change AT THE SAME TIME as the economy",
        whenRu: "Изменяются ОДНОВРЕМЕННО с экономикой",
        indicators: [
          { name: "Industrial production", nameRu: "Объём промышленного производства", reason: "Reflects current factory output" },
          { name: "Employment levels", nameRu: "Уровень занятости", reason: "More jobs = active economy right now" },
          { name: "Retail sales", nameRu: "Розничные продажи", reason: "Shows current household spending" },
          { name: "Household personal income", nameRu: "Доход домохозяйств", reason: "Tracks earnings as the economy operates" }
        ]
      },
      {
        id: "lagging",
        title: "Lagging Indicators",
        titleRu: "Отстающие индикаторы",
        subtitle: "Confirm trends after they have happened",
        subtitleRu: "Подтверждают тренды после их завершения",
        color: "#3B6EA5",
        icon: "History",
        when: "Change AFTER the economy has changed",
        whenRu: "Изменяются ПОСЛЕ изменения экономики",
        indicators: [
          { name: "Unemployment rate", nameRu: "Уровень безработицы", reason: "Companies fire workers slowly, after a downturn has begun" },
          { name: "Inflation (CPI)", nameRu: "Инфляция (ИПЦ)", reason: "Prices adjust slowly after demand changes" },
          { name: "Corporate profits (reported)", nameRu: "Корпоративная прибыль (отчётная)", reason: "Profits are reported quarterly, after the period ends" },
          { name: "Average duration of unemployment", nameRu: "Средняя продолжительность безработицы", reason: "Builds up after a contraction has already started" }
        ]
      }
    ],
    tasks: [
      {
        id: "indic_match",
        type: "match",
        title: "Match the Indicator to its Type",
        instruction: "Match each indicator with whether it is leading, coincident, or lagging.",
        pairs: [
          { en: "Stock market prices", ru: "Leading — predicts future economic activity" },
          { en: "Industrial production", ru: "Coincident — shows current activity" },
          { en: "Unemployment rate", ru: "Lagging — confirms past trends" },
          { en: "Building permits", ru: "Leading — signals future construction" },
          { en: "Retail sales", ru: "Coincident — current household spending" },
          { en: "Inflation rate (CPI)", ru: "Lagging — prices respond slowly to demand changes" }
        ]
      },
      {
        id: "indic_choose",
        type: "multipleChoice",
        title: "Identify the Indicator Type",
        instruction: "Choose the correct category for each economic indicator.",
        items: [
          {
            sentence: "Construction companies receive 25% more building permits than last quarter. This is a:",
            options: ["Leading indicator", "Coincident indicator", "Lagging indicator", "Not an indicator"],
            answer: "Leading indicator",
            explanation: "Building permits signal future construction activity — they predict economic expansion."
          },
          {
            sentence: "The unemployment rate has risen for three months in a row, after GDP started falling earlier. This shows that unemployment is a:",
            options: ["Leading indicator", "Coincident indicator", "Lagging indicator", "Not an indicator"],
            answer: "Lagging indicator",
            explanation: "Companies don't lay off workers immediately. Unemployment rises AFTER the contraction has begun."
          },
          {
            sentence: "Factories report a 12% increase in production this month — at the same time GDP is also growing. Industrial production is a:",
            options: ["Leading indicator", "Coincident indicator", "Lagging indicator", "Not an indicator"],
            answer: "Coincident indicator",
            explanation: "Industrial production moves at the same time as the overall economy."
          },
          {
            sentence: "An entrepreneur watching the economy wants to predict the next 6 months. Which indicator should she watch?",
            options: ["Lagging indicators only", "Coincident indicators only", "Leading indicators", "She cannot predict using indicators"],
            answer: "Leading indicators",
            explanation: "Leading indicators are designed exactly for forecasting future trends."
          }
        ]
      }
    ]
  },

  // ── НОВАЯ ФИШКА: Annual Report Reader (вместо caseStudy у unit2) ─────────────
  businessCycle: {
    title: "The Business Cycle — Four Phases",
    description: "The economy moves through four repeating phases. Click each phase to see which metrics rise, fall, or stay flat at that point.",
    descriptionRu: "Экономика движется через четыре повторяющиеся фазы. Нажмите на фазу, чтобы увидеть, какие показатели растут, падают или остаются на месте.",
    phases: [
      {
        id: 'expansion',
        label: 'Expansion',
        labelRu: 'Подъём',
        color: '#5E9E89',
        summary: 'The economy is growing. Output, jobs, and spending are all increasing.',
        summaryRu: 'Экономика растёт. Производство, занятость и расходы увеличиваются.',
        metrics: [
          { name: 'GDP',                   direction: 'up',   note: 'Rising steadily' },
          { name: 'Employment',            direction: 'up',   note: 'Companies hire' },
          { name: 'Household consumption', direction: 'up',   note: 'Consumers spend more' },
          { name: 'Inflation',             direction: 'flat', note: 'Moderate, under control' },
          { name: 'Leading indicators',    direction: 'up',   note: 'All signs point upward' },
          { name: 'Performance',           direction: 'up',   note: 'Corporate profits grow' },
        ],
      },
      {
        id: 'peak',
        label: 'Peak',
        labelRu: 'Пик',
        color: '#C9955A',
        summary: 'The economy is at its highest point. Growth is slowing — the next move will be down.',
        summaryRu: 'Экономика на своей высшей точке. Рост замедляется — следующее движение будет вниз.',
        metrics: [
          { name: 'GDP',                   direction: 'flat', note: 'Highest level, levelling off' },
          { name: 'Employment',            direction: 'flat', note: 'Near full employment' },
          { name: 'Household consumption', direction: 'up',   note: 'Strong, starting to cool' },
          { name: 'Inflation',             direction: 'up',   note: 'Often rising' },
          { name: 'Leading indicators',    direction: 'down', note: 'Already pointing down' },
          { name: 'Performance',           direction: 'flat', note: 'Maximum output' },
        ],
      },
      {
        id: 'contraction',
        label: 'Contraction',
        labelRu: 'Сокращение',
        color: '#B91C1C',
        summary: 'The economy is shrinking. GDP falls, unemployment rises. Also called "recession".',
        summaryRu: 'Экономика сокращается. ВВП падает, безработица растёт. Также называется «рецессия».',
        metrics: [
          { name: 'GDP',                   direction: 'down', note: 'Declining' },
          { name: 'Employment',            direction: 'down', note: 'Companies cut jobs' },
          { name: 'Household consumption', direction: 'down', note: 'Consumers spend less' },
          { name: 'Inflation',             direction: 'down', note: 'Demand falls, prices ease' },
          { name: 'Leading indicators',    direction: 'down', note: 'Continue downward' },
          { name: 'Performance',           direction: 'down', note: 'Profits decline' },
        ],
      },
      {
        id: 'trough',
        label: 'Trough',
        labelRu: 'Дно',
        color: '#6B7280',
        summary: 'The lowest point. Decline has stopped. Recovery begins — the next phase is expansion.',
        summaryRu: 'Низшая точка. Падение остановилось. Начинается восстановление — следующая фаза подъём.',
        metrics: [
          { name: 'GDP',                   direction: 'flat', note: 'Lowest level, levelling off' },
          { name: 'Employment',            direction: 'flat', note: 'Stops falling' },
          { name: 'Household consumption', direction: 'flat', note: 'Bottoming out' },
          { name: 'Inflation',             direction: 'down', note: 'Lowest, may turn up' },
          { name: 'Leading indicators',    direction: 'up',   note: 'First signs of recovery' },
          { name: 'Performance',           direction: 'flat', note: 'Stabilising' },
        ],
      },
    ],
  },

  balanceSheet: {
    title: "Balance Sheet Builder — Drag & Drop",
    description: "Drag each card into the correct column. The accounting equation must always hold: Assets = Liabilities + Equity. The balance check turns green when both sides match.",
    descriptionRu: "Перетащите каждую карточку в правильную колонку. Уравнение бухучёта должно всегда выполняться: Активы = Обязательства + Капитал. Проверка балансировки станет зелёной, когда обе стороны совпадут.",
    unitLabel: 'K $',
    unitLabelRu: 'тыс. долларов',
    // 12 items — totals balance to $1,500K on both sides when correctly placed:
    //   assets:   250 + 150 + 100 + 300 + 500 + 200 = 1,500
    //   liab:     400 + 200 + 150 + 50  =   800
    //   equity:   300 + 400             =   700
    //   liab+eq:  800 + 700             = 1,500
    items: [
      // ── Assets ─────────────────────────────────────────────
      { id: 'cash',         label: 'Cash',                 labelRu: 'Денежные средства',           value: 250, category: 'asset' },
      { id: 'receivable',   label: 'Accounts receivable',  labelRu: 'Дебиторская задолженность',   value: 150, category: 'asset' },
      { id: 'inventory',    label: 'Inventory',            labelRu: 'Запасы',                      value: 100, category: 'asset' },
      { id: 'equipment',    label: 'Equipment',            labelRu: 'Оборудование',                value: 300, category: 'asset' },
      { id: 'buildings',    label: 'Buildings',            labelRu: 'Здания',                      value: 500, category: 'asset' },
      { id: 'patents',      label: 'Patents & software',   labelRu: 'Патенты и ПО',                value: 200, category: 'asset' },
      // ── Liabilities ────────────────────────────────────────
      { id: 'bank_loan',    label: 'Bank loan',            labelRu: 'Банковский кредит',           value: 400, category: 'liability' },
      { id: 'bonds',        label: 'Bonds outstanding',    labelRu: 'Облигации в обращении',       value: 200, category: 'liability' },
      { id: 'payable',      label: 'Accounts payable',     labelRu: 'Кредиторская задолженность',  value: 150, category: 'liability' },
      { id: 'wages_owed',   label: 'Wages payable',        labelRu: 'Задолженность по зарплате',   value:  50, category: 'liability' },
      // ── Equity ─────────────────────────────────────────────
      { id: 'common_stock', label: 'Common stock',         labelRu: 'Уставный капитал',            value: 300, category: 'equity' },
      { id: 'retained',     label: 'Retained earnings',    labelRu: 'Нераспределённая прибыль',    value: 400, category: 'equity' },
    ],
  },

  annualReportReader: {
    title: "Annual Report Reader: RusTech Solutions",
    subtitle: "How to read a company annual report — highlights, letter, balance sheet",
    description: "Every public company publishes an annual report. This shows their performance to investors, employees, and the public. Read each tab to see how a real annual report uses Unit 4 vocabulary in context.",
    descriptionRu: "Каждая публичная компания публикует годовой отчёт. Он показывает её результаты инвесторам, сотрудникам и общественности. Прочитайте каждую вкладку, чтобы увидеть, как настоящий годовой отчёт использует лексику Юнита 4 в контексте.",
    company: {
      name: "RusTech Solutions",
      sector: "Technology & Industrial Software",
      year: 2025
    },
    tabs: [
      {
        id: "highlights",
        title: "Highlights",
        titleRu: "Ключевые показатели",
        content: {
          stats: [
            { label: "Revenue", value: "$2.4B", change: "+12% YoY", direction: "up" },
            { label: "Net profit", value: "$340M", change: "+8% YoY", direction: "up" },
            { label: "Total assets", value: "$5.1B", change: "+4% YoY", direction: "up" },
            { label: "Owners' equity", value: "$2.7B", change: "+6% YoY", direction: "up" }
          ],
          summary: "RusTech Solutions delivered strong performance across all business segments. Revenue and net profit grew, driven by record household demand for our cloud services. Total assets expanded as we invested in new infrastructure. Our equity strengthened as retained earnings grew."
        }
      },
      {
        id: "letter",
        title: "Letter to Shareholders",
        titleRu: "Письмо акционерам",
        content: {
          author: "Sergei Mikhailov, Chief Executive Officer",
          authorRu: "Сергей Михайлов, Генеральный директор",
          letter: "Dear Shareholders,\n\nI am pleased to present our company's 2025 annual report. Our **performance** this year exceeded expectations. **Net** revenue grew by 12%, driven by record **household** demand for our digital products. We continued to invest in capital **assets** — particularly new server equipment and software platforms — despite the rising **depreciation** charges these generate.\n\nOur **equity** position strengthened as retained earnings grew, while total **liabilities** remained stable at $2.4B. We **measure** success not only by **profit**, but by the consistency of our **performance** through the economic cycle.\n\nThis year saw a brief **contraction** in the technology sector worldwide, but our company continued to grow. Our **leading indicators** — new contracts and customer enquiries — remained strong throughout. We do not **exaggerate** the challenges, but we also recognise the strength of our long-term strategy.\n\nLooking forward, we will pursue careful expansion. Every dollar of revenue is matched by a clear **receipt** in our accounting records. Every investment will be measured against expected returns.\n\nThank you for your continued trust.\n\nSergei Mikhailov\nChief Executive Officer",
          highlightedTerms: ["performance", "net", "household", "asset", "depreciation", "equity", "liability", "measure", "profit", "contraction", "leading indicators", "exaggerate", "receipt"]
        }
      },
      {
        id: "balancesheet",
        title: "Balance Sheet",
        titleRu: "Балансовый отчёт",
        content: {
          assets: {
            title: "Assets — what we own",
            titleRu: "Активы — то, чем владеем",
            items: [
              { label: "Cash and cash equivalents", value: "$420M" },
              { label: "Accounts receivable", value: "$280M" },
              { label: "Inventory", value: "$95M" },
              { label: "Equipment (net of depreciation)", value: "$1.8B" },
              { label: "Buildings", value: "$1.5B" },
              { label: "Intangible assets (patents, software)", value: "$1.0B" }
            ],
            total: { label: "Total assets", value: "$5.1B" }
          },
          liabilities: {
            title: "Liabilities + Equity — what we owe + what is left for owners",
            titleRu: "Обязательства + Капитал — то, что должны + то, что остаётся владельцам",
            items: [
              { label: "Bank loans", value: "$1.2B", section: "liabilities" },
              { label: "Bonds outstanding", value: "$800M", section: "liabilities" },
              { label: "Accounts payable", value: "$400M", section: "liabilities" },
              { label: "Total liabilities", value: "$2.4B", section: "total" },
              { label: "Owners' equity", value: "$2.7B", section: "equity" }
            ],
            total: { label: "Total liabilities + equity", value: "$5.1B" }
          },
          equation: "Assets ($5.1B) = Liabilities ($2.4B) + Equity ($2.7B) ✓",
          equationRu: "Активы ($5.1B) = Обязательства ($2.4B) + Капитал ($2.7B) ✓"
        }
      },
      {
        id: "vocab",
        title: "Vocabulary in Context",
        titleRu: "Лексика в контексте",
        content: {
          intro: "Key Unit 4 vocabulary as used in this annual report:",
          introRu: "Ключевая лексика Юнита 4, использованная в этом отчёте:",
          entries: [
            { term: "performance", definition: "How well the company has done — the financial and operational results.", inContext: "Our performance exceeded expectations." },
            { term: "net", definition: "After all costs and taxes have been deducted.", inContext: "Net revenue grew by 12%." },
            { term: "household", definition: "Families and individuals as economic consumers.", inContext: "Record household demand drove our growth." },
            { term: "asset", definition: "Something the company owns that has monetary value.", inContext: "We invested in capital assets such as servers." },
            { term: "depreciation", definition: "The decline in value of assets recorded as a cost.", inContext: "Rising depreciation charges from new equipment." },
            { term: "equity", definition: "The owners' share of the company (assets minus liabilities).", inContext: "Our equity position strengthened." },
            { term: "liability", definition: "Money owed to others — loans, bonds, unpaid bills.", inContext: "Total liabilities remained stable at $2.4B." },
            { term: "contraction", definition: "Period of economic decline.", inContext: "A brief contraction in the technology sector." },
            { term: "leading indicators", definition: "Signals that predict future performance.", inContext: "Our leading indicators remained strong." }
          ]
        }
      }
    ],
    tasks: [
      {
        id: "ar_match",
        type: "match",
        title: "Match Balance Sheet Items to their Category",
        instruction: "Decide whether each item is an asset, liability, or equity.",
        pairs: [
          { en: "Cash and cash equivalents", ru: "Asset — money the company owns" },
          { en: "Bank loans", ru: "Liability — money the company owes" },
          { en: "Equipment", ru: "Asset — physical property owned" },
          { en: "Bonds outstanding", ru: "Liability — debt to bondholders" },
          { en: "Owners' equity", ru: "Equity — owners' share of the company" },
          { en: "Accounts payable", ru: "Liability — unpaid bills to suppliers" }
        ]
      },
      {
        id: "ar_choose",
        type: "multipleChoice",
        title: "Read the Annual Report",
        instruction: "Use the data from RusTech Solutions to answer.",
        items: [
          {
            sentence: "What is RusTech Solutions' total assets and total liabilities?",
            options: [
              "Assets $2.4B and Liabilities $5.1B",
              "Assets $5.1B and Liabilities $2.4B",
              "Assets $2.7B and Liabilities $5.1B",
              "Both are $5.1B"
            ],
            answer: "Assets $5.1B and Liabilities $2.4B",
            explanation: "From the balance sheet: total assets = $5.1B, total liabilities = $2.4B."
          },
          {
            sentence: "Calculate the equity using the balance sheet equation.",
            options: ["$2.4B", "$2.7B", "$5.1B", "$340M"],
            answer: "$2.7B",
            explanation: "Equity = Assets − Liabilities = $5.1B − $2.4B = $2.7B."
          },
          {
            sentence: "By how much did revenue grow this year?",
            options: ["8% year-on-year", "12% year-on-year", "4% year-on-year", "It declined"],
            answer: "12% year-on-year",
            explanation: "The highlights tab states revenue grew +12% YoY."
          },
          {
            sentence: "Why does the report mention 'rising depreciation charges'?",
            options: [
              "Because the company is losing money on assets",
              "Because new equipment invested in this year loses value over time, increasing the depreciation cost",
              "Because depreciation increases profit",
              "Because depreciation is a kind of asset"
            ],
            answer: "Because new equipment invested in this year loses value over time, increasing the depreciation cost",
            explanation: "When companies invest in new long-term assets, more depreciation must be recorded each year — this is a cost in the income statement."
          },
          {
            sentence: "What did the CEO mean by 'we do not exaggerate the challenges'?",
            options: [
              "He admits the company has no challenges",
              "He commits to reporting difficulties honestly, without overstating them",
              "He plans to ignore all problems",
              "He thinks the challenges are bigger than they appear"
            ],
            answer: "He commits to reporting difficulties honestly, without overstating them",
            explanation: "Not exaggerating means presenting the truth — neither hiding bad news nor making it sound worse than it is."
          }
        ]
      }
    ]
  },

  // ── НОВАЯ ФИШКА: Economic Policy Map — 5 стран (обязательная тема №4) ────────
  economicPolicyMap: {
    title: "Government Economic Policy: Five National Approaches",
    description: "Different countries pursue different economic policies. Compare five major economies and learn how they balance state involvement, fiscal discipline, and market forces.",
    descriptionRu: "Разные страны проводят разную экономическую политику. Сравните пять крупных экономик и узнайте, как они балансируют государственное участие, фискальную дисциплину и рыночные силы.",
    countries: [
      {
        id: "netherlands",
        name: "Netherlands",
        nameRu: "Нидерланды",
        flag: "🇳🇱",
        capital: "Amsterdam",
        lat: 52.37,
        lng: 4.90,
        currency: "Euro (€)",
        policyApproach: "Open trade economy with strong fiscal discipline",
        policyApproachRu: "Открытая торговая экономика с сильной фискальной дисциплиной",
        keyFeatures: [
          "One of the most open economies in the world — trade is over 80% of GDP",
          "Strong support for the financial sector and shipping (Rotterdam port)",
          "Conservative fiscal policy with balanced government budgets",
          "Member of the eurozone — uses the euro as currency"
        ],
        keyFeaturesRu: [
          "Одна из самых открытых экономик в мире — торговля более 80% ВВП",
          "Сильная поддержка финансового сектора и судоходства (порт Роттердам)",
          "Консервативная фискальная политика с сбалансированным бюджетом",
          "Член еврозоны — использует евро как валюту"
        ],
        leadingIndicatorsFocus: "Trade volume through Rotterdam, building permits, business confidence",
        vocabConnection: "Netherlands' approach to fiscal policy emphasises low liabilities, high equity in public finance, and supports entrepreneurs in international trade.",
        color: "#FF6B35"
      },
      {
        id: "germany",
        name: "Germany",
        nameRu: "Германия",
        flag: "🇩🇪",
        capital: "Berlin",
        lat: 52.52,
        lng: 13.40,
        currency: "Euro (€)",
        policyApproach: "Ordoliberalism — rules-based market economy with balanced budgets",
        policyApproachRu: "Ордолиберализм — рыночная экономика на основе правил с сбалансированным бюджетом",
        keyFeatures: [
          "Largest economy in Europe — industrial powerhouse (cars, engineering, chemicals)",
          "Strong vocational training links industry and education",
          "'Schwarze Null' (black zero) — long-standing commitment to no budget deficit",
          "Central role in the European Central Bank and eurozone policy"
        ],
        keyFeaturesRu: [
          "Крупнейшая экономика Европы — индустриальная держава (автомобили, машиностроение, химия)",
          "Сильная система профессионального образования",
          "Schwarze Null — приверженность бездефицитному бюджету",
          "Ключевая роль в Европейском центральном банке"
        ],
        leadingIndicatorsFocus: "Manufacturing orders (Ifo index), exports, automotive production",
        vocabConnection: "Germany measures economic performance through industrial output, manages liabilities carefully, and uses lagging indicators to assess policy success.",
        color: "#FFC107"
      },
      {
        id: "france",
        name: "France",
        nameRu: "Франция",
        flag: "🇫🇷",
        capital: "Paris",
        lat: 48.86,
        lng: 2.35,
        currency: "Euro (€)",
        policyApproach: "Active state with large public sector and strong social spending",
        policyApproachRu: "Активное государство с большим государственным сектором и сильными социальными расходами",
        keyFeatures: [
          "Large public sector — state controls or owns key industries (energy, transport)",
          "High government spending as % of GDP — strong welfare state",
          "Active fiscal policy: government uses spending to support employment",
          "Innovation hub in aerospace, luxury goods, and pharmaceuticals"
        ],
        keyFeaturesRu: [
          "Крупный государственный сектор — государство контролирует ключевые отрасли (энергетика, транспорт)",
          "Высокие государственные расходы в % от ВВП — сильное социальное государство",
          "Активная фискальная политика: государство использует расходы для поддержки занятости",
          "Инновационный центр в аэрокосмической отрасли, предметах роскоши и фармацевтике"
        ],
        leadingIndicatorsFocus: "Consumer confidence, retail sales, household spending",
        vocabConnection: "France's approach uses high government spending to support household income — making household consumption a key part of GDP using the flow-of-product approach.",
        color: "#0055A4"
      },
      {
        id: "russia",
        name: "Russia",
        nameRu: "Россия",
        flag: "🇷🇺",
        capital: "Moscow",
        lat: 55.75,
        lng: 37.62,
        currency: "Russian Ruble (₽)",
        policyApproach: "Resource-based economy with strong state involvement",
        policyApproachRu: "Сырьевая экономика с сильным государственным участием",
        keyFeatures: [
          "Major exporter of oil, natural gas, and metals — energy is core to GDP",
          "Large state-owned enterprises in energy, defence, banking",
          "Central Bank of Russia manages monetary policy — interest rates often high",
          "Economy sensitive to global commodity prices and sanctions"
        ],
        keyFeaturesRu: [
          "Крупный экспортёр нефти, природного газа и металлов — энергетика — основа ВВП",
          "Крупные государственные предприятия в энергетике, обороне, банковской сфере",
          "ЦБ России управляет монетарной политикой — процентные ставки часто высокие",
          "Экономика чувствительна к мировым ценам на сырьё и санкциям"
        ],
        leadingIndicatorsFocus: "Oil and gas prices, exchange rate of the ruble, central bank interest rate",
        vocabConnection: "Russia's GDP depends heavily on energy assets and commodity exports. Economic indicators must include resource prices alongside standard measures.",
        color: "#D52B1E"
      },
      {
        id: "china",
        name: "China",
        nameRu: "Китай",
        flag: "🇨🇳",
        capital: "Beijing",
        lat: 39.90,
        lng: 116.40,
        currency: "Chinese Yuan / Renminbi (¥)",
        policyApproach: "State capitalism — central planning combined with market reforms",
        policyApproachRu: "Государственный капитализм — центральное планирование в сочетании с рыночными реформами",
        keyFeatures: [
          "Largest manufacturing economy in the world",
          "Five-Year Plans set strategic direction for key industries",
          "State-owned enterprises dominate banking, energy, telecom",
          "Active currency management and large foreign reserves"
        ],
        keyFeaturesRu: [
          "Крупнейшая в мире производственная экономика",
          "Пятилетние планы задают стратегическое направление для ключевых отраслей",
          "Государственные предприятия доминируют в банковской сфере, энергетике, телекоме",
          "Активное управление валютой и большие валютные резервы"
        ],
        leadingIndicatorsFocus: "Manufacturing PMI, export volumes, fixed asset investment",
        vocabConnection: "China measures economic performance through both industrial output (coincident indicator) and investment in fixed assets (leading indicator). The state plays an executive role across many sectors.",
        color: "#DE2910"
      }
    ],
    tasks: [
      {
        id: "policy_match",
        type: "match",
        title: "Match the Country to its Policy Approach",
        instruction: "Match each country with the description of its economic policy.",
        pairs: [
          { en: "Netherlands", ru: "Open trade economy with strong fiscal discipline — over 80% of GDP from trade" },
          { en: "Germany", ru: "Ordoliberalism: rules-based market economy with balanced budgets" },
          { en: "France", ru: "Active state with large public sector and strong social spending" },
          { en: "Russia", ru: "Resource-based economy with strong state involvement in energy and metals" },
          { en: "China", ru: "State capitalism: central planning combined with market reforms" }
        ]
      },
      {
        id: "policy_tf",
        type: "trueFalse",
        title: "True or False — Country Policies",
        instruction: "Is each statement TRUE or FALSE?",
        items: [
          { statement: "The Netherlands has one of the most open trade economies — international trade makes up over 80% of GDP.", answer: true, explanation: "Correct — the port of Rotterdam and Schiphol airport make the Netherlands a global trade hub." },
          { statement: "Germany's economic approach focuses on running large government deficits to stimulate growth.", answer: false, explanation: "Germany follows 'Schwarze Null' — a long-standing commitment to balanced budgets, NOT deficits." },
          { statement: "France maintains a large public sector with government control of key industries like energy and transport.", answer: true, explanation: "Correct — France has more state ownership in strategic sectors than many other Western economies." },
          { statement: "Russia's economy depends heavily on oil, gas, and metal exports.", answer: true, explanation: "Correct — natural resources make up a significant share of Russian exports and government revenue." },
          { statement: "China's economic system is purely free-market with no government planning.", answer: false, explanation: "China follows 'state capitalism' — market reforms exist, but the state still plans key sectors through Five-Year Plans." }
        ]
      },
      {
        id: "policy_choose",
        type: "multipleChoice",
        title: "Understand Government Policies",
        instruction: "Choose the best answer based on the policy approaches of the five countries.",
        items: [
          {
            sentence: "A multinational company wants to set up European operations and needs a country with low government deficits and stable rules. Which country's traditional approach fits best?",
            options: ["France", "Russia", "Germany", "China"],
            answer: "Germany",
            explanation: "Germany's ordoliberal approach emphasises balanced budgets and clear, stable rules for business."
          },
          {
            sentence: "Which country's economy is most influenced by global commodity prices (especially oil and gas)?",
            options: ["Netherlands", "France", "Russia", "Germany"],
            answer: "Russia",
            explanation: "Russia is a major energy exporter — when oil and gas prices change, the Russian economy is significantly affected."
          },
          {
            sentence: "Five-Year Plans set strategic economic direction in which country?",
            options: ["France", "Netherlands", "China", "Germany"],
            answer: "China",
            explanation: "China continues to use Five-Year Plans — a feature of central planning — alongside market reforms."
          },
          {
            sentence: "Which country has a particularly high level of government spending and an active state role in key industries?",
            options: ["Netherlands", "Germany", "France", "United States"],
            answer: "France",
            explanation: "France maintains one of the highest ratios of government spending to GDP in developed economies."
          }
        ]
      }
    ]
  },

  // ── НОВАЯ ФИШКА: Government Policy Section (обязательная тема №3) ────────────
  governmentPolicySection: {
    title: "Government Economic Policy: Fiscal vs Monetary",
    description: "Governments influence the economy in two main ways: fiscal policy (taxes and spending) and monetary policy (interest rates and money supply). Together, these are the main tools of national economic management.",
    descriptionRu: "Правительства влияют на экономику двумя основными способами: фискальная политика (налоги и расходы) и монетарная политика (процентные ставки и денежная масса). Вместе это основные инструменты управления национальной экономикой.",
    policyTypes: [
      {
        id: "fiscal",
        title: "Fiscal Policy",
        titleRu: "Фискальная политика",
        controlledBy: "Government / Ministry of Finance",
        controlledByRu: "Правительство / Министерство финансов",
        tools: ["Taxes (raise or lower)", "Government spending (increase or cut)", "Public investment programmes", "Welfare and social spending"],
        toolsRu: ["Налоги (повышение или снижение)", "Государственные расходы (увеличение или сокращение)", "Программы государственных инвестиций", "Социальные расходы"],
        effect: "Directly changes how much money flows into or out of the economy through government action.",
        effectRu: "Напрямую меняет, сколько денег поступает в экономику или уходит из неё через государственные действия.",
        example: "During a contraction, the government may cut taxes and increase public spending to support household income and create jobs.",
        color: "#5E9E89"
      },
      {
        id: "monetary",
        title: "Monetary Policy",
        titleRu: "Монетарная политика",
        controlledBy: "Central Bank (e.g. ECB, Federal Reserve, Bank of Russia)",
        controlledByRu: "Центральный банк (например, ЕЦБ, ФРС, ЦБ РФ)",
        tools: ["Interest rates (raise or lower)", "Money supply (expand or contract)", "Bank reserve requirements", "Currency interventions"],
        toolsRu: ["Процентные ставки (повышение или понижение)", "Денежная масса (расширение или сужение)", "Резервные требования для банков", "Валютные интервенции"],
        effect: "Changes the cost and availability of money in the financial system — affecting borrowing, saving, and investment.",
        effectRu: "Меняет стоимость и доступность денег в финансовой системе — влияет на заимствования, сбережения и инвестиции.",
        example: "If inflation rises too quickly, the central bank can raise interest rates to slow borrowing and cool the economy.",
        color: "#C9955A"
      }
    ],
    tasks: [
      {
        id: "policy_basic_match",
        type: "match",
        title: "Match the Tool to the Policy Type",
        instruction: "Match each policy tool with whether it is fiscal or monetary.",
        pairs: [
          { en: "Raising income tax", ru: "Fiscal policy — government uses tax to change spending power" },
          { en: "Lowering the central bank interest rate", ru: "Monetary policy — central bank changes the cost of money" },
          { en: "Increasing government spending on roads", ru: "Fiscal policy — direct injection of money into the economy" },
          { en: "Quantitative easing (expanding money supply)", ru: "Monetary policy — central bank tool" }
        ]
      },
      {
        id: "policy_basic_choose",
        type: "multipleChoice",
        title: "Government Policy in Action",
        instruction: "Choose the most appropriate policy response for each situation.",
        items: [
          {
            sentence: "Inflation rises sharply. The central bank wants to slow down the economy. What does it do?",
            options: [
              "Lower interest rates to encourage borrowing",
              "Raise interest rates to make borrowing more expensive",
              "Increase government spending",
              "Cut income taxes for everyone"
            ],
            answer: "Raise interest rates to make borrowing more expensive",
            explanation: "Higher interest rates discourage borrowing → less spending → reduced demand → lower inflation. This is classic monetary policy."
          },
          {
            sentence: "GDP is contracting and unemployment is rising. The government wants to stimulate the economy through fiscal policy. What does it do?",
            options: [
              "Raise taxes and cut spending",
              "Increase government spending and cut taxes",
              "Privatise state-owned enterprises",
              "Restrict imports"
            ],
            answer: "Increase government spending and cut taxes",
            explanation: "Expansionary fiscal policy puts money into the economy: tax cuts leave more money with households, and spending creates jobs directly."
          },
          {
            sentence: "Which body usually controls monetary policy?",
            options: ["The parliament", "The Ministry of Finance", "The central bank", "The stock exchange"],
            answer: "The central bank",
            explanation: "Most modern democracies make the central bank independent of government to manage monetary policy professionally."
          }
        ]
      }
    ]
  },

  dialogue: {
    title: "Business Call: Reviewing the Annual Report",
    context: "Sergei is the CEO (chief executive) of RusTech Solutions. He calls his investor, Anna Pavlova, who is a private equity executive. They discuss the company's annual report and economic outlook. The call follows business telephone etiquette.",
    lines: [
      { speaker: "Anna", text: "Good morning, Anna Pavlova speaking. How may I help you?" },
      { speaker: "Sergei", text: "Good morning, Anna. This is Sergei Mikhailov from RusTech Solutions. I'm calling to discuss our annual report — do you have a moment?" },
      { speaker: "Anna", text: "Of course, Sergei. Could you hold the line for a moment, please? I'll just get the report in front of me." },
      { speaker: "Anna", text: "Thank you for holding. I have it now. Your **performance** highlights look strong — 12% revenue growth and 8% **net** profit growth." },
      { speaker: "Sergei", text: "Yes, **household** demand for our software platforms grew faster than we expected. We continued to invest in capital **assets**, particularly cloud servers — although this has increased our **depreciation** charges this year." },
      { speaker: "Anna", text: "I noticed your **liabilities** stayed stable at $2.4 billion. How is your **equity** position now?" },
      { speaker: "Sergei", text: "Our **equity** strengthened to $2.7 billion — we retained more **profit** rather than paying it all out as dividends. We **measure** success carefully, and we don't want to **exaggerate** these numbers." },
      { speaker: "Anna", text: "Wise. The sector saw a brief **contraction** earlier this year. How did your **leading indicators** look during that period?" },
      { speaker: "Sergei", text: "Our **leading indicators** — new contracts, customer enquiries, and pipeline — stayed positive throughout the **contraction**. That gave us confidence to keep investing." },
      { speaker: "Anna", text: "Excellent. As an **entrepreneur** who became an **executive**, you understand both the risk and the management side. One more question — what is your view on government economic **policy** for next year?" },
      { speaker: "Sergei", text: "We expect the central bank to keep interest rates stable. Fiscal **policy** will probably focus on supporting **households** through targeted spending. I think there's a reasonable **approach** to economic stability." },
      { speaker: "Anna", text: "Thank you, Sergei. I'll review the full report and call you back next week to discuss the dividend strategy." }
    ],
    tasks: [
      { type: "fill", q: "Sergei opens the call professionally with: 'This is Sergei Mikhailov from RusTech Solutions. I'm calling to ______ our annual report.'", a: "discuss" },
      { type: "fill", q: "Anna's polite phrase to ask for a moment: 'Could you ______ the line for a moment, please?'", a: "hold" },
      { type: "choice", q: "What did Sergei say about the company's depreciation?", options: ["It decreased this year", "It increased due to investments in new cloud servers", "It stayed the same", "It is a type of liability"], a: "It increased due to investments in new cloud servers" },
      { type: "fill", q: "Sergei said the company's ______ strengthened to $2.7 billion — this is the owners' share of the company.", a: "equity" },
      { type: "choice", q: "How did the company's leading indicators behave during the sector contraction?", options: ["They fell sharply", "They became lagging indicators", "They stayed positive throughout the contraction", "They were replaced with coincident indicators"], a: "They stayed positive throughout the contraction" },
      { type: "choice", q: "What is Sergei's transition from entrepreneur to executive?", options: ["He founded the company and now manages it as a senior executive", "He was always an executive", "He works in two unrelated companies", "He left the business completely"], a: "He founded the company and now manages it as a senior executive" }
    ]
  },

  writing: {
    title: "Sentence Builder: GDP, Indicators, and the Balance Sheet",
    instruction: "Build 3 sentences about economic concepts and company performance using the word tiles.",
    instructionRu: "Составьте 3 предложения об экономических понятиях и показателях компании, используя блоки слов.",
    wordBank: ["GDP", "approach", "household", "leading", "coincident", "lagging", "indicator", "asset", "liability", "equity", "depreciation", "net", "profit", "performance", "highlights", "entrepreneur", "executive", "measure", "contraction", "withdraw"],
    sentenceTargets: [
      {
        prompt: "How is GDP calculated using two approaches?",
        tiles: ['GDP', 'can', 'be', 'measured', 'by', 'the', 'earnings-and-cost', 'approach', 'or', 'the', 'flow-of-product', 'approach.', 'banks', 'stocks', 'household'],
        answer: ['GDP', 'can', 'be', 'measured', 'by', 'the', 'earnings-and-cost', 'approach', 'or', 'the', 'flow-of-product', 'approach.']
      },
      {
        prompt: "What does the balance sheet equation show?",
        tiles: ['A', 'company\'s', 'assets', 'equal', 'its', 'liabilities', 'plus', 'the', 'owners\'', 'equity.', 'minus', 'multiplied', 'depreciation', 'profit'],
        answer: ['A', 'company\'s', 'assets', 'equal', 'its', 'liabilities', 'plus', 'the', 'owners\'', 'equity.']
      },
      {
        prompt: "What is the role of leading economic indicators?",
        tiles: ['Leading', 'economic', 'indicators', 'change', 'before', 'the', 'economy', 'changes', 'and', 'help', 'to', 'predict', 'future', 'trends.', 'after', 'lagging', 'household'],
        answer: ['Leading', 'economic', 'indicators', 'change', 'before', 'the', 'economy', 'changes', 'and', 'help', 'to', 'predict', 'future', 'trends.']
      }
    ],
    sampleAnswer: "GDP can be measured by the earnings-and-cost approach or the flow-of-product approach. A company's assets equal its liabilities plus the owners' equity. Leading economic indicators change before the economy changes and help to predict future trends.",
    teacherNotes: "Accept any grammatically correct sentence using Unit 4 vocabulary. Check correct use of: approach (vs approaches), GDP measurement methods, the balance sheet equation (Assets = Liabilities + Equity), the three indicator categories. A1–A2 grammar is acceptable but technical terms must be accurate."
  },

  scenario: {
    title: "Scenario Loop: You Are a CFO",
    description: "You are the Chief Financial Officer (CFO) of a growing technology company. Make decisions about reporting, investment, and economic outlook using Unit 4 vocabulary.",
    conclusion: "A good CFO measures performance honestly, manages assets and liabilities carefully, and uses economic indicators to plan ahead — without exaggerating the results.",
    steps: [
      {
        situation: "It is time to prepare the annual report. Revenue grew by 18% but the company invested heavily in new equipment, increasing depreciation costs significantly. Net profit only grew by 4%.",
        context: "How do you present the highlights honestly?",
        vocabFocus: "performance",
        options: [
          { text: "Present both numbers clearly: 18% revenue growth AND 4% net profit growth, with the depreciation explanation.", vocabUsed: "highlights", isOptimal: true, feedback: "Correct. Honest reporting builds investor trust. Showing the depreciation context explains why net profit lags revenue this year — that's responsible communication." },
          { text: "Show only the 18% revenue figure and hide the modest profit growth.", vocabUsed: "exaggerate", isOptimal: false, feedback: "This effectively exaggerates performance. Selective disclosure damages credibility — investors will see the full data eventually and lose trust." },
          { text: "Skip the highlights section and bury both figures in the financial statements.", vocabUsed: "performance", isOptimal: false, feedback: "Investors look at highlights first. Hiding key figures suggests you have something to hide — even when there is nothing wrong." }
        ]
      },
      {
        situation: "The leading economic indicators are pointing down — stock prices falling, building permits dropping, business confidence weakening. Your company is considering a $50M expansion.",
        context: "Do you proceed or wait?",
        vocabFocus: "leading indicators",
        options: [
          { text: "Pause the expansion. Leading indicators predict a possible contraction — wait 3–6 months and reassess.", vocabUsed: "contraction", isOptimal: true, feedback: "Wise. Leading indicators exist exactly for this purpose. Investing $50M as a contraction approaches could create excess capacity and high depreciation with falling revenue." },
          { text: "Proceed with the full $50M expansion — leading indicators are just noise.", vocabUsed: "leading", isOptimal: false, feedback: "Ignoring leading indicators is risky. They are designed to give early warning. The opportunity cost of waiting is small compared to the cost of expanding into a contraction." },
          { text: "Triple the expansion to $150M — buy assets cheaply during the downturn.", vocabUsed: "asset", isOptimal: false, feedback: "Contrarian investing can work, but tripling commitment based on weakening indicators is excessive risk. Conservative CFOs preserve equity through cycles." }
        ]
      },
      {
        situation: "Your company has $200M in cash and your finance team proposes three options: (A) repay $200M of bank loans early, (B) buy bonds yielding 4.5%, (C) invest in new equipment with expected 12% return but high depreciation.",
        context: "How do you optimise the balance sheet?",
        vocabFocus: "asset",
        options: [
          { text: "Split: $100M to repay loans (reduce liabilities), $50M to bonds (safe income), $50M to equipment (high return).", vocabUsed: "liability", isOptimal: true, feedback: "Balanced. Reducing liabilities strengthens equity. Bonds provide near money for emergencies. Equipment investment offers higher returns but accepts depreciation as a cost. A diversified asset allocation." },
          { text: "Repay all $200M in loans — be debt-free.", vocabUsed: "liability", isOptimal: false, feedback: "Being debt-free is psychologically appealing but financially suboptimal. Some debt at favourable rates can be cheaper than equity capital. Diversification is more efficient." },
          { text: "Put everything into new equipment — chase the 12% return.", vocabUsed: "depreciation", isOptimal: false, feedback: "12% return looks attractive but ignores depreciation costs and the risk of equipment becoming obsolete. Concentrating $200M in one asset class is risky." }
        ]
      },
      {
        situation: "An entrepreneur calls your CFO line about a possible acquisition. You answer the phone. The call is unexpected and you are about to enter a meeting.",
        context: "How do you handle the call professionally?",
        vocabFocus: "executive",
        options: [
          { text: "'Good morning, [Company]. This is [Name]. I'm afraid I'm just heading into a meeting — could I take your number and call you back this afternoon?'", vocabUsed: "executive", isOptimal: true, feedback: "Perfect business etiquette. You greet professionally, acknowledge constraints honestly, and propose a clear next step. This is how senior executives manage urgent calls." },
          { text: "Hang up without explanation.", vocabUsed: "withdraw", isOptimal: false, feedback: "Unprofessional and damages relationships. Even if the call is poorly timed, every business contact deserves a brief, polite response." },
          { text: "Let the call ring through to voicemail without ever responding.", vocabUsed: "exaggerate", isOptimal: false, feedback: "Ignoring an entrepreneur with a business opportunity is a missed chance. Always respond — even if just to reschedule." }
        ]
      }
    ]
  },

  media: [
    {
      mediaId: "u4_media_gdp",
      localSrc: "/u4_gdp.mp4",
      title: "What is GDP and How is it Measured?",
      type: "video",
      source: "Educational Video",
      url: "",
      embedId: "",
      duration: "Video",
      description: "What Gross Domestic Product really measures, how it is calculated, what it includes (and importantly, what it leaves out), and what its key limitations are when used as a measure of economic health.",
      whyHelps: "You will hear 'GDP', 'final goods', 'per capita', 'household', and 'approach' explained in a clear textbook style.",
      vocabToListen: ["GDP", "household", "final", "approach", "measure"],
      task: "After watching: explain in one sentence why GDP only counts FINAL goods and services, and name one important limitation of using GDP as a measure of well-being.",
      predictionTask: [
        { type: "sentenceBuilder", q: "Before watching — build a sentence about this video:", tiles: ["This", "video", "explains", "what", "GDP", "is", "and", "how", "it", "is", "measured.", "household", "stocks", "bonds"], answer: ["This", "video", "explains", "what", "GDP", "is", "and", "how", "it", "is", "measured."] },
        { type: "wordCheck", q: "Which words do you expect to hear?", options: ["GDP", "final goods", "per capita", "household", "growth"] }
      ],
      postQuiz: [
        { type: "trueFalse", q: "GDP only counts the value of FINAL goods and services, not raw materials or intermediate inputs.", answer: true, explanation: "Correct. Counting raw materials separately would mean counting the same value twice, since their cost is already included in the final product." },
        { type: "choice", q: "Which of the following is a recognised LIMITATION of GDP?", options: ["It is easy to calculate", "It does not measure well-being or income distribution", "It includes too many final goods", "It is only used in Europe"], answer: "It does not measure well-being or income distribution", explanation: "GDP measures economic activity but ignores inequality, environmental damage, unpaid labour and quality of life — major reasons it is not a perfect well-being measure." },
        { type: "sentenceBuilder", q: "Build the sentence:", tiles: ["GDP", "measures", "the", "total", "monetary", "value", "of", "all", "final", "goods", "produced", "in", "one", "year.", "borrowed", "deposited", "interest"], answer: ["GDP", "measures", "the", "total", "monetary", "value", "of", "all", "final", "goods", "produced", "in", "one", "year."] }
      ]
    },
    {
      mediaId: "u4_media_fiscal_monetary",
      localSrc: "/u4_fiscal_and_monetary_policy.mp4",
      title: "Fiscal vs Monetary Policy",
      type: "video",
      source: "Educational Video",
      url: "",
      embedId: "",
      duration: "Video",
      description: "The difference between fiscal policy (government spending and taxes) and monetary policy (central bank interest rates and money supply): who controls each one, what tools they use, and how they fight unemployment and inflation.",
      whyHelps: "You will hear 'fiscal policy', 'monetary policy', 'central bank', 'interest rate', 'inflation', and 'unemployment' in a clear comparative explanation.",
      vocabToListen: ["fiscal policy", "monetary policy", "central bank", "inflation", "interest rate"],
      task: "After watching: name which body controls fiscal policy and which controls monetary policy, and give one tool used by each.",
      predictionTask: [
        { type: "sentenceBuilder", q: "Before watching — build a sentence about this video:", tiles: ["This", "video", "explains", "the", "difference", "between", "fiscal", "policy", "and", "monetary", "policy.", "barter", "stocks", "bonds"], answer: ["This", "video", "explains", "the", "difference", "between", "fiscal", "policy", "and", "monetary", "policy."] },
        { type: "wordCheck", q: "Which words do you expect to hear?", options: ["fiscal", "monetary", "central bank", "inflation", "interest rate"] }
      ],
      postQuiz: [
        { type: "trueFalse", q: "Fiscal policy is controlled by the government, while monetary policy is controlled by the central bank.", answer: true, explanation: "Correct. Governments set taxes and spending (fiscal policy); central banks set interest rates and control the money supply (monetary policy)." },
        { type: "choice", q: "Which of the following is a tool of MONETARY policy?", options: ["Raising income tax rates", "Increasing government spending on roads", "Changing the central bank's interest rate", "Sending stimulus cheques to citizens"], answer: "Changing the central bank's interest rate", explanation: "Adjusting interest rates is the classic monetary policy tool. The other options are fiscal policy — they involve government taxes or spending." },
        { type: "sentenceBuilder", q: "Build the sentence:", tiles: ["Expansionary", "fiscal", "policy", "means", "the", "government", "increases", "spending", "or", "cuts", "taxes.", "raises", "freezes", "ignores"], answer: ["Expansionary", "fiscal", "policy", "means", "the", "government", "increases", "spending", "or", "cuts", "taxes."] }
      ]
    },
    {
      mediaId: "u4_media_annual_report",
      localSrc: "/u4_annual_report.mp4",
      title: "Annual Report — What Businesses Must File",
      type: "video",
      source: "Educational Video",
      url: "",
      embedId: "",
      duration: "Video",
      description: "What an Annual Report (or Biennial Statement) is for an LLC, why it must be filed with the state, what it contains, and why timely filing is essential for business compliance.",
      whyHelps: "You will hear 'annual report', 'LLC', 'compliance', 'registered agent', 'filing', and 'state requirements' explained from a business owner's perspective.",
      vocabToListen: ["annual report", "asset", "liability", "equity", "performance"],
      task: "After watching: list three things that are typically included in an Annual Report, and explain in one sentence why filing it on time matters.",
      predictionTask: [
        { type: "wordCheck", q: "Which words do you expect to hear?", options: ["annual report", "LLC", "compliance", "filing", "state"] }
      ],
      postQuiz: [
        { type: "trueFalse", q: "An Annual Report is filed with the state to keep a business in good legal standing.", answer: true, explanation: "Correct. Filing the Annual Report is a compliance requirement — failing to file can lead to fines or even dissolution of the business." },
        { type: "choice", q: "Why is it important to file an Annual Report on time?", options: ["So shareholders can vote on dividends", "To stay in legal compliance and avoid penalties", "Because banks require it for loans every year", "To reset the company's tax rate"], answer: "To stay in legal compliance and avoid penalties", explanation: "On-time filing is a state requirement. Late filing usually triggers fines and can put the business at risk of administrative dissolution." },
        { type: "trueFalse", q: "Every LLC must usually appoint a registered agent who can receive official documents on its behalf.", answer: true, explanation: "Correct. A registered agent is the official point of contact for legal and government correspondence — a standard part of staying compliant." },
        { type: "sentenceBuilder", q: "Build the sentence:", tiles: ["The", "annual", "report", "shows", "the", "company's", "assets,", "liabilities,", "and", "equity", "for", "the", "year.", "stocks", "interest", "barter"], answer: ["The", "annual", "report", "shows", "the", "company's", "assets,", "liabilities,", "and", "equity", "for", "the", "year."] }
      ]
    }
  ],

  totalTest: {
    title: "TOTAL TEST — Unit 4: Measuring the Economy",
    parts: [
      {
        id: "tt4_a",
        title: "Part A — Match the Word with its Definition",
        type: "match",
        instruction: "Match each term with its complete definition. This tests your understanding, not just translation.",
        pairs: [
          { en: "GDP", ru: "the total monetary value of all final goods and services produced in a country in one year" },
          { en: "earnings-and-cost approach", ru: "a method of calculating GDP by adding up all income earned in the economy" },
          { en: "flow-of-product approach", ru: "a method of calculating GDP by adding up all spending on final goods and services" },
          { en: "leading economic indicators", ru: "measurements that change before the overall economy changes, predicting future trends" },
          { en: "coincident economic indicators", ru: "measurements that change at the same time as the economy, showing current activity" },
          { en: "lagging economic indicators", ru: "measurements that change after the economy, confirming trends after they happen" },
          { en: "asset", ru: "something owned by a company that has monetary value" },
          { en: "liability", ru: "money that a company owes to others, such as loans or unpaid bills" },
          { en: "equity", ru: "the value remaining for the owners after all liabilities are subtracted from assets" },
          { en: "depreciation", ru: "the decrease in value of a long-term asset over time, recorded as a cost" },
          { en: "entrepreneur", ru: "a person who starts a new business and takes on the financial risk" },
          { en: "executive", ru: "a senior manager in a company who has the power to make important decisions" }
        ]
      },
      {
        id: "tt4_b",
        title: "Part B — True or False",
        type: "trueFalse",
        instruction: "Read each statement carefully. Some are almost correct but contain a key inaccuracy. Decide: TRUE or FALSE?",
        items: [
          { statement: "The earnings-and-cost approach and the flow-of-product approach to GDP give different totals, because they count different things.", answer: false, explanation: "Both approaches give the SAME total. Every dollar earned is a dollar spent — they are two views of the same economic activity." },
          { statement: "A contraction in the business cycle is the phase when GDP grows steadily and businesses expand.", answer: false, explanation: "Contraction = GDP FALLS, businesses cut staff. GDP growth happens during EXPANSION, the opposite phase." },
          { statement: "Equity in a company equals total assets minus total liabilities.", answer: true, explanation: "Correct — Equity = Assets − Liabilities. This is the fundamental balance sheet equation." },
          { statement: "Depreciation increases the net profit reported on the income statement.", answer: false, explanation: "Depreciation is a COST — it REDUCES net profit. A high depreciation charge means lower net profit for that period." },
          { statement: "Leading economic indicators help to predict future economic trends, while lagging indicators confirm past changes.", answer: true, explanation: "Correct — this is the fundamental distinction. Leading indicators change first; lagging indicators change last." },
          { statement: "An entrepreneur is the same as an executive — both terms mean exactly the same thing.", answer: false, explanation: "Different roles. Entrepreneur = founder, takes risk to create a NEW business. Executive = senior manager of an EXISTING business. The same person can be both, but the words have different meanings." }
        ]
      },
      {
        id: "tt4_c",
        title: "Part C — Fill in the Gaps",
        type: "fillGap",
        instruction: "Read each sentence carefully and fill in the correct word from the box. There are 2 extra words you will not need.",
        wordBank: ["GDP", "approach", "household", "input", "leading", "coincident", "lagging", "contraction", "asset", "liability", "equity", "depreciation", "entrepreneur", "executive", "net", "performance", "highlights", "exaggerate", "measure", "withdraw"],
        items: [
          { sentence: "______ is the total monetary value of all final goods and services produced in a country in one year.", answer: "GDP", explanation: "GDP = Gross Domestic Product — the size of an economy." },
          { sentence: "Economists use two main ______ to calculate GDP: the earnings-and-cost method and the flow-of-product method.", answer: "approach", explanation: "Approach = a way of solving a problem (here, calculating GDP)." },
          { sentence: "______ spending on goods and services makes up about 60% of GDP in most developed economies.", answer: "Household", explanation: "Household consumption is the largest component of GDP in most countries." },
          { sentence: "Stock prices and building permits are examples of ______ economic indicators.", answer: "leading", explanation: "Leading indicators change before the overall economy — they help predict future trends." },
          { sentence: "Unemployment rate and inflation are ______ economic indicators — they confirm what has already happened.", answer: "lagging", explanation: "Lagging indicators change AFTER the economy." },
          { sentence: "During an economic ______, GDP falls and businesses often cut staff.", answer: "contraction", explanation: "Contraction = the declining phase of the business cycle." },
          { sentence: "A bank loan of $300,000 is a ______ — money the company must repay.", answer: "liability", explanation: "Liabilities = obligations and debts." },
          { sentence: "The owners' ______ equals total assets minus total liabilities.", answer: "equity", explanation: "Equity is the residual value belonging to owners after debts are paid." },
          { sentence: "Factory equipment loses 10% of its value each year — this loss is recorded as ______ in the income statement.", answer: "depreciation", explanation: "Depreciation spreads the cost of an asset across its useful life." },
          { sentence: "Maria founded a software company three years ago — she is an ______ who took on financial risk.", answer: "entrepreneur", explanation: "An entrepreneur is a founder who accepts risk to create a new business." },
          { sentence: "After all costs and taxes, the company's ______ profit was $5 million.", answer: "net", explanation: "Net profit = revenue minus all costs and taxes — the final figure." },
          { sentence: "It is unethical to ______ company performance in financial reports.", answer: "exaggerate", explanation: "Exaggerating numbers misleads investors and may be illegal." }
        ]
      },
      {
        id: "tt4_d",
        title: "Part D — Match the Concept",
        type: "conceptMatch",
        instruction: "Match each definition with the correct term. All definitions are complete sentences.",
        pairs: [
          { description: "The phase of the business cycle when GDP falls, businesses cut staff, and economic activity slows.", term: "contraction" },
          { description: "A measurement that signals where the economy is heading before the overall economy changes.", term: "leading economic indicator" },
          { description: "The value that belongs to the owners of a company after all debts have been subtracted from total assets.", term: "equity" },
          { description: "The systematic decrease in the value of a long-term asset over time, recorded as an accounting cost.", term: "depreciation" },
          { description: "A person who creates a new business venture, taking on financial risk in exchange for potential profit.", term: "entrepreneur" }
        ]
      },
      {
        id: "tt4_e",
        title: "Part E — Choose the Best Answer",
        type: "multipleChoice",
        instruction: "Choose the correct answer for each question.",
        items: [
          {
            sentence: "Why does the earnings-and-cost approach always give the same total as the flow-of-product approach?",
            options: [
              "Because they both ignore depreciation",
              "Because every dollar of income earned is a dollar of someone's spending",
              "Because they are calculated by the same government department",
              "Because GDP is always the same number"
            ],
            answer: "Because every dollar of income earned is a dollar of someone's spending"
          },
          {
            sentence: "If a company has $8M in assets and $3M in liabilities, what is its equity?",
            options: ["$11M", "$5M", "$3M", "$24M"],
            answer: "$5M"
          },
          {
            sentence: "An economist wants to predict whether the economy will grow next quarter. Which type of indicator should she examine?",
            options: ["Lagging economic indicators only", "Coincident economic indicators only", "Leading economic indicators", "She cannot predict using indicators"],
            answer: "Leading economic indicators"
          },
          {
            sentence: "Which of the following correctly describes depreciation in an annual report?",
            options: [
              "An increase in cash held by the company",
              "The systematic accounting recognition that long-term assets lose value over time",
              "A type of liability owed to the bank",
              "A new asset being purchased"
            ],
            answer: "The systematic accounting recognition that long-term assets lose value over time"
          },
          {
            sentence: "Which country's economic approach is best described as 'state capitalism with central planning combined with market reforms'?",
            options: ["Netherlands", "Germany", "China", "France"],
            answer: "China"
          }
        ]
      }
    ]
  },

  crossword: {
    words: [
      // ACROSS
      { number: 1, word: 'CONTRACT',  dir: 'across', row: 0,  col: 0, clue: 'When the economy gets smaller — opposite of expand.',          clueRu: 'Сокращаться — экономика уменьшается.' },
      { number: 2, word: 'EQUITY',    dir: 'across', row: 4,  col: 1, clue: 'What the owners own after subtracting debts from assets.',     clueRu: 'Капитал — то, что остаётся владельцам после вычета долгов.' },
      { number: 3, word: 'HOUSEHOLD', dir: 'across', row: 6,  col: 0, clue: 'A family or group living together — they buy goods.',          clueRu: 'Домохозяйство — семья, потребляющая товары и услуги.' },
      { number: 4, word: 'WITHDRAW',  dir: 'across', row: 8,  col: 0, clue: 'To take money out of a bank account.',                          clueRu: 'Снять деньги со счёта.' },
      { number: 5, word: 'PROFIT',    dir: 'across', row: 10, col: 0, clue: 'The money left after paying all costs.',                        clueRu: 'Прибыль — деньги после вычета расходов.' },
      { number: 6, word: 'MEASURE',   dir: 'across', row: 12, col: 0, clue: 'To find the size or amount of something.',                      clueRu: 'Измерять размер или количество.' },
      // DOWN
      { number: 7, word: 'NET',       dir: 'down',   row: 0,  col: 2, clue: 'After all deductions — like "net profit".',                     clueRu: 'Чистый — после всех вычетов.' },
      { number: 8, word: 'ASSET',     dir: 'down',   row: 0,  col: 5, clue: 'Something a company owns that has value.',                      clueRu: 'Актив — то ценное, чем владеет компания.' },
    ]
  }
};