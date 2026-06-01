export const unit3 = {
  id: 3,
  // R3: declarative section list
  // Section list — the order shown in the nav strip and the render loop.
  // Tools moved to /interactive-lab (Phase 2 of Lab refactor):
  //   currency, worldbanking, loansim  →  Interactive Lab
  // Their data fields are still on this object so the Lab can read them.
  sections: [
    'header', 'keyideas', 'dictionary', 'moneycompass', 'moneyforms',
    'labbanner:currency-comparator',   // concrete examples of money forms
    'centralbank',
    'labbanner:world-banking-map',     // concrete examples of central banks
    'bankaccounts',
    'labbanner:loan-simulator',        // loans build on accounts/banking
    'exercises', 'reading', 'comprehension', 'media', 'crossword',
    'dialogue', 'writing', 'scenario', 'totaltest', 'answerkey', 'summary',
  ],
  title: "Money & Banking",
  subtitle: "From cash in your pocket to compound interest — how money works",
  description: "Learn how money works: its functions, forms, and how banks use it. Understand loans, interest, deposits, and currencies — the financial system that connects everyone.",
  descriptionRu: "Узнайте, как работают деньги: их функции, формы и то, как банки их используют. Поймите кредиты, проценты, депозиты и валюты — финансовую систему, которая связывает всех.",

  keyIdeas: [
    {
      term: "Money",
      termRu: "Деньги",
      meaning: "A tool that people use to pay for things, save value, and compare prices of goods.",
      meaningRu: "Инструмент, который люди используют для оплаты, сбережений и сравнения цен на товары.",
      icon: "Coins"
    },
    {
      term: "Bank",
      termRu: "Банк",
      meaning: "An institution that keeps your money safe, pays you interest, and gives loans to people who need them.",
      meaningRu: "Учреждение, которое хранит ваши деньги, начисляет проценты и выдаёт кредиты тем, кто в них нуждается.",
      icon: "Building2"
    },
    {
      term: "Loan",
      termRu: "Кредит / Заём",
      meaning: "Money you borrow from a bank and repay over time — with interest added on top.",
      meaningRu: "Деньги, которые вы берёте в банке и возвращаете со временем — с добавленными процентами.",
      icon: "HandCoins"
    }
  ],

  vocabulary: [
    {
      id: "u3_compoundinterest",
      term: "compound interest",
      pos: "noun",
      translationRu: "сложный процент",
      trick: "COMPOUND = составной, сложенный из слоёв. Процент каждый период «складывается» поверх предыдущего — как снежный ком.",
      meaningEn: "Interest calculated on both the original amount AND on the interest already earned. It grows faster than simple interest.",
      meaningRu: "Процент, начисляемый как на первоначальную сумму, так и на уже начисленные проценты. Растёт быстрее, чем простой процент.",
      example: "With compound interest, $1,000 at 10% per year becomes $1,100 after year one and $1,210 after year two.",
      collocations: ["earn compound interest (получать сложный процент)", "compound interest rate (ставка сложного процента)", "compound interest grows faster (сложный процент растёт быстрее)"]
    },
    {
      id: "u3_repayaloan",
      term: "repay a loan",
      pos: "verb phrase",
      translationRu: "погасить кредит / вернуть заём",
      trick: "RE- = снова, обратно + PAY = платить. Ты уже взял деньги — теперь платишь обратно. Возврат.",
      meaningEn: "To pay back money that you borrowed from a bank or person, usually with interest added.",
      meaningRu: "Вернуть деньги, которые вы взяли в банке или у человека, обычно с добавленными процентами.",
      example: "Arthur plans to repay the loan in five equal annual instalments.",
      collocations: ["repay a loan early (погасить кредит досрочно)", "fail to repay (не выплатить кредит)", "repay in instalments (выплачивать частями)"]
    },
    {
      id: "u3_value",
      term: "value",
      pos: "noun",
      translationRu: "стоимость, ценность",
      trick: "VALUE — ценность. Вспомни: 'valuable' = ценный. VALUE — это то, сколько что-то стоит или насколько оно важно.",
      meaningEn: "The amount of money that something is worth, or its importance.",
      meaningRu: "Сумма денег, которую что-то стоит, или его важность.",
      example: "The value of this house has gone up by 20% in two years.",
      collocations: ["market value (рыночная стоимость)", "increase in value (рост стоимости)", "store of value (средство сбережения)"]
    },
    {
      id: "u3_account",
      term: "account",
      pos: "noun",
      translationRu: "счёт (банковский)",
      trick: "ACCOUNT — как счёт в кафе, только в банке. Там записано сколько у тебя денег. Учёт средств.",
      meaningEn: "An arrangement with a bank where you keep money and can take it out when you need it.",
      meaningRu: "Договорённость с банком, по которой вы храните деньги и можете их забрать при необходимости.",
      example: "Please transfer the money to my account number 4728.",
      collocations: ["open an account (открыть счёт)", "bank account (банковский счёт)", "account balance (баланс счёта)"]
    },
    {
      id: "u3_currentaccount",
      term: "current account",
      pos: "noun",
      translationRu: "текущий счёт (BR)",
      trick: "CURRENT = нынешний, текущий. Этот счёт — для ежедневных операций. Деньги 'текут' туда-сюда.",
      meaningEn: "A British bank account for everyday transactions — you can deposit and withdraw money at any time. (US equivalent: checking account)",
      meaningRu: "Британский банковский счёт для повседневных операций — вносить и снимать деньги можно в любое время. (Американский эквивалент: checking account)",
      example: "She pays her bills from her current account every month.",
      collocations: ["current account balance (остаток на текущем счёте)", "pay from a current account (платить с текущего счёта)", "open a current account (открыть текущий счёт)"]
    },
    {
      id: "u3_checkingaccount",
      term: "checking account",
      pos: "noun",
      translationRu: "расчётный счёт (US)",
      trick: "CHECKING = для проверок и расчётов. Американский термин = британский current account. Одно и то же, разные слова.",
      meaningEn: "An American bank account for everyday use — you can write cheques, make transfers, and withdraw cash at any time. (UK equivalent: current account)",
      meaningRu: "Американский банковский счёт для повседневного использования — можно выписывать чеки, делать переводы и снимать наличные в любое время. (Британский эквивалент: current account)",
      example: "He uses his checking account to pay for groceries and bills.",
      collocations: ["checking account number (номер расчётного счёта)", "open a checking account (открыть расчётный счёт)", "checking account vs savings account (расчётный против сберегательного счёта)"]
    },
    {
      id: "u3_add",
      term: "add",
      pos: "verb",
      translationRu: "добавлять, прибавлять, суммировать",
      trick: "ADD = плюс. Как знак '+' на калькуляторе. Прибавить что-то к чему-то.",
      meaningEn: "To put something together with something else; to calculate the total of numbers.",
      meaningRu: "Присоединять что-то к чему-то; вычислять общую сумму чисел.",
      example: "The bank will add 5% interest to your savings every year.",
      collocations: ["add interest (начислять проценты)", "add to an account (пополнить счёт)", "add up the total (суммировать итог)"]
    },
    {
      id: "u3_advance",
      term: "advance",
      pos: "noun",
      translationRu: "аванс, задаток; предоплата; ссуда",
      trick: "ADVANCE = 'заранее', 'вперёд'. Ты получаешь деньги ДО того, как сделал работу или вернул долг. Как аванс от работодателя.",
      meaningEn: "Money paid before it is officially due, or a small loan given before your regular income arrives.",
      meaningRu: "Деньги, выплаченные до официального срока, или небольшой кредит, выданный до получения регулярного дохода.",
      example: "The company gave him a $500 advance on his salary before the end of the month.",
      collocations: ["salary advance (аванс на зарплату)", "cash advance (денежный аванс)", "take an advance (взять аванс)"]
    },
    {
      id: "u3_advancenotice",
      term: "advance notice",
      pos: "noun phrase",
      translationRu: "предварительное уведомление",
      trick: "ADVANCE = заранее + NOTICE = уведомление. Ты говоришь банку ЗА-РАНЕЕ, что хочешь снять деньги. Заблаговременное предупреждение.",
      meaningEn: "A formal warning or notification given before an action takes place, so the other party is prepared.",
      meaningRu: "Официальное предупреждение или уведомление, предоставленное до совершения действия, чтобы другая сторона была готова.",
      example: "The bank requires 30 days' advance notice before you can withdraw from a time deposit.",
      collocations: ["give advance notice (дать предварительное уведомление)", "30 days' advance notice (уведомление за 30 дней)", "without advance notice (без предварительного уведомления)"]
    },
    {
      id: "u3_bank_v",
      term: "bank",
      pos: "verb",
      translationRu: "хранить деньги в банке; иметь счёт в банке",
      trick: "BANK как глагол — «банковать». Если ты банкуешь с кем-то, значит держишь там свои деньги. 'I bank with HSBC' = мой банк — HSBC.",
      meaningEn: "To keep your money at a particular bank; to use banking services at a specific institution.",
      meaningRu: "Держать деньги в определённом банке; пользоваться банковскими услугами в конкретном учреждении.",
      example: "Most people in the company bank with the same local bank.",
      collocations: ["bank with (иметь счёт в)", "bank online (пользоваться онлайн-банком)", "bank locally (обслуживаться в местном банке)"]
    },
    {
      id: "u3_borrow",
      term: "borrow",
      pos: "verb",
      translationRu: "занимать, брать взаймы",
      trick: "BORROW vs LEND — запомни: ты BORROW (берёшь). Банк LEND (даёт). Стрелка всегда идёт К тебе при BORROW.",
      meaningEn: "To take money or something from a person or bank with the agreement to return it later.",
      meaningRu: "Брать деньги или что-либо у человека или банка с обязательством вернуть их позже.",
      example: "She needed to borrow $2,000 from the bank to pay for her car repairs.",
      collocations: ["borrow money (занять деньги)", "borrow from a bank (взять кредит в банке)", "borrow at interest (занять под процент)"]
    },
    {
      id: "u3_bond",
      term: "bond",
      pos: "noun",
      translationRu: "облигация",
      trick: "BOND = связь, обязательство. Когда ты покупаешь облигацию, ты как бы 'связываешь' деньги с государством или компанией — они обязуются вернуть.",
      meaningEn: "A financial instrument where you lend money to a government or company for a fixed period and they pay you back with interest.",
      meaningRu: "Финансовый инструмент, при котором вы одалживаете деньги правительству или компании на фиксированный срок, а они возвращают их с процентами.",
      example: "The government issued new bonds to raise money for infrastructure projects.",
      collocations: ["government bond (государственная облигация)", "buy a bond (купить облигацию)", "bond market (рынок облигаций)"]
    },
    {
      id: "u3_currency",
      term: "currency",
      pos: "noun",
      translationRu: "валюта",
      trick: "CURRENCY ← CURRENT = текущий, циркулирующий. Деньги, которые сейчас 'циркулируют' в стране. Это и есть currency.",
      meaningEn: "The system of money used in a particular country — the official medium of exchange.",
      meaningRu: "Система денег, используемая в конкретной стране — официальное средство обмена.",
      example: "The dollar is the world's main reserve currency.",
      collocations: ["foreign currency (иностранная валюта)", "currency exchange (обмен валюты)", "stable currency (стабильная валюта)"]
    },
    {
      id: "u3_supplyofcurrency",
      term: "the supply of currency",
      pos: "noun phrase",
      translationRu: "объём валюты в обращении",
      trick: "SUPPLY = запас, предложение. Сколько валюты сейчас «есть» в экономике — напечатано, выпущено в обращение.",
      meaningEn: "The total amount of currency available and circulating in an economy at a given time.",
      meaningRu: "Общий объём валюты, доступной и обращающейся в экономике в данный момент.",
      example: "The central bank controls the supply of currency to manage inflation.",
      collocations: ["control the supply of currency (контролировать объём валюты)", "increase the supply of currency (увеличить денежную массу)", "supply of currency in circulation (валюта в обращении)"]
    },
    {
      id: "u3_stock",
      term: "stock",
      pos: "noun",
      translationRu: "акция, ценная бумага",
      trick: "STOCK MARKET = фондовый рынок. STOCK = кусочек компании, который ты можешь купить. Ты — совладелец. Цена растёт — ты богаче.",
      meaningEn: "A share in a company that you can buy — it represents part ownership and can rise or fall in value.",
      meaningRu: "Доля в компании, которую можно купить — она представляет частичное владение и может расти или падать в цене.",
      example: "She bought 100 stocks in the company when the price was low.",
      collocations: ["buy stock (купить акцию)", "stock market (фондовый рынок)", "stock price (цена акции)"]
    },
    {
      id: "u3_deposit",
      term: "deposit",
      pos: "noun / verb",
      translationRu: "вклад / депозит (n); вносить на счёт (v)",
      trick: "DE + POSIT — 'положить вниз', в хранилище. Как кладёшь деньги в сейф банка. Deposit = положить, вклад.",
      meaningEn: "Money placed into a bank account for safekeeping (noun); to put money into a bank account (verb).",
      meaningRu: "Деньги, размещённые на банковском счёте для хранения (сущ.); поместить деньги на банковский счёт (гл.).",
      example: "He made a deposit of $500 into his savings account every month.",
      collocations: ["make a deposit (сделать вклад)", "deposit money (внести деньги)", "deposit account (депозитный счёт)"]
    },
    {
      id: "u3_demanddeposit",
      term: "demand deposit",
      pos: "noun",
      translationRu: "депозит до востребования",
      trick: "DEMAND = по требованию. Этот вклад ты можешь снять КОГДА УГОДНО — банк обязан дать по твоему требованию. Нет ограничений на снятие.",
      meaningEn: "A bank deposit that the owner can withdraw at any time without giving advance notice.",
      meaningRu: "Банковский вклад, который владелец может снять в любое время без предварительного уведомления.",
      example: "A checking account is a type of demand deposit — you can access the money any time.",
      collocations: ["withdraw a demand deposit (снять депозит до востребования)", "demand deposit account (счёт до востребования)", "demand deposit vs time deposit (депозит до востребования vs срочный)"]
    },
    {
      id: "u3_timedeposit",
      term: "time deposit",
      pos: "noun",
      translationRu: "срочный вклад / срочный депозит",
      trick: "TIME = время, срок. Ты кладёшь деньги НА ОПРЕДЕЛЁННЫЙ СРОК. За это банк платит больше процентов — потому что знает, что деньги не заберут рано.",
      meaningEn: "A bank deposit that must be kept for a fixed period of time (e.g. 6 months, 1 year) before it can be withdrawn. It earns higher interest.",
      meaningRu: "Банковский вклад, который необходимо хранить в течение фиксированного периода (например, 6 месяцев, 1 год) до снятия. По нему начисляется более высокий процент.",
      example: "A one-year time deposit at this bank pays 6.5% annual interest.",
      collocations: ["open a time deposit (открыть срочный вклад)", "time deposit rate (ставка по срочному вкладу)", "time deposit matures (срочный вклад истекает)"]
    },
    {
      id: "u3_monetaryvalue",
      term: "monetary value",
      pos: "noun phrase",
      translationRu: "денежная стоимость",
      trick: "MONETARY = денежный (от MONEY). MONETARY VALUE = ценность, выраженная в деньгах. Сколько это стоит в рублях, долларах, фунтах.",
      meaningEn: "The worth of something expressed in money — the price you would pay or receive for it.",
      meaningRu: "Ценность чего-либо, выраженная в деньгах — цена, которую вы заплатите или получите за это.",
      example: "The monetary value of the building was estimated at $2 million.",
      collocations: ["express monetary value (выразить денежную стоимость)", "monetary value of assets (денежная стоимость активов)", "assign monetary value (присвоить денежную стоимость)"]
    },
    {
      id: "u3_fiatmoney",
      term: "fiat money",
      pos: "noun",
      translationRu: "фиатные (декретные) деньги",
      trick: "FIAT — латинское слово 'да будет'. Государство говорит: 'Этот кусок бумаги = деньги'. Не золото, не серебро — просто государственный указ.",
      meaningEn: "Money that has value because the government declares it to be legal tender — not backed by gold or any physical commodity.",
      meaningRu: "Деньги, имеющие ценность потому, что государство объявляет их законным платёжным средством — не обеспеченные золотом или каким-либо физическим товаром.",
      example: "Since 1971, the US dollar has been fiat money — it is not backed by gold.",
      collocations: ["fiat money system (система фиатных денег)", "fiat currency (фиатная валюта)", "fiat money vs commodity money (фиатные vs товарные деньги)"]
    },
    {
      id: "u3_interest",
      term: "interest",
      pos: "noun",
      translationRu: "процент, проценты (по вкладу или кредиту)",
      trick: "INTEREST — буквально «между» (inter). Деньги, которые существуют МЕЖДУ суммой, которую ты взял, и суммой, которую ты вернёшь. Цена займа.",
      meaningEn: "The amount of money charged by a bank for lending money, or paid by a bank on savings deposits.",
      meaningRu: "Сумма денег, взимаемая банком за предоставление кредита, или выплачиваемая банком по сберегательным вкладам.",
      example: "The bank pays 4% interest per year on savings accounts.",
      collocations: ["earn interest (получать проценты)", "pay interest (платить проценты)", "interest on a loan (проценты по кредиту)"]
    },
    {
      id: "u3_interestrate",
      term: "interest rate",
      pos: "noun",
      translationRu: "процентная ставка",
      trick: "INTEREST (процент) + RATE (ставка, процент). Это конкретный процент — 5%, 8.5%, 12%. Условия сделки с банком.",
      meaningEn: "The percentage at which interest is calculated on a loan or deposit — for example, 8.5% per year.",
      meaningRu: "Процент, по которому рассчитывается плата по кредиту или вкладу — например, 8,5% в год.",
      example: "The bank offered a loan at an interest rate of 8.5% per annum.",
      collocations: ["interest rate rises (процентная ставка повышается)", "fixed interest rate (фиксированная процентная ставка)", "variable interest rate (переменная процентная ставка)"]
    },
    {
      id: "u3_loan",
      term: "loan",
      pos: "noun",
      translationRu: "кредит, заём",
      trick: "LOAN — как 'alone' (один). Ты один остался с чужими деньгами. Тебе их дали, ты их должен вернуть. Заём.",
      meaningEn: "A sum of money that you borrow from a bank and agree to repay with interest over a period of time.",
      meaningRu: "Сумма денег, которую вы берёте в банке и соглашаетесь вернуть с процентами в течение определённого периода.",
      example: "He took out a $15,000 personal loan to buy a second-hand car.",
      collocations: ["take out a loan (взять кредит)", "repay a loan (погасить кредит)", "personal loan (потребительский кредит)"]
    },
    {
      id: "u3_meansofexchange",
      term: "means of exchange",
      pos: "noun phrase",
      translationRu: "средство обмена",
      trick: "MEANS = способ, средство + EXCHANGE = обмен. Деньги — СПОСОБ обменяться ценностями. Без них пришлось бы меняться вещами — это неудобно.",
      meaningEn: "Something that people accept in exchange for goods and services — money's most basic function.",
      meaningRu: "Нечто, что люди принимают в обмен на товары и услуги — самая базовая функция денег.",
      example: "Money serves as a means of exchange, replacing the old barter system.",
      collocations: ["act as a means of exchange (выступать средством обмена)", "money as a means of exchange (деньги как средство обмена)", "means of exchange in trade (средство обмена в торговле)"]
    },
    {
      id: "u3_moneysupply",
      term: "money supply",
      pos: "noun",
      translationRu: "денежная масса",
      trick: "MONEY (деньги) + SUPPLY (запас, предложение). Сколько денег ВСЕГО есть в экономике — наличные, на счетах, в банках. Центробанк это контролирует.",
      meaningEn: "The total amount of money available in an economy at a given time, including notes, coins, and bank deposits.",
      meaningRu: "Общий объём денег, доступных в экономике в данный момент, включая банкноты, монеты и банковские депозиты.",
      example: "The central bank can reduce the money supply to slow down inflation.",
      collocations: ["control the money supply (контролировать денежную массу)", "increase the money supply (увеличить денежную массу)", "money supply and inflation (денежная масса и инфляция)"]
    },
    {
      id: "u3_nearmoney",
      term: "near money",
      pos: "noun",
      translationRu: "квазиденьги, «почти деньги»",
      trick: "NEAR = рядом, почти. Это вещи, которые ПОЧТИ деньги — легко превратить в наличные: сберкнижка, облигации, кредитные карты. Но не совсем наличные.",
      meaningEn: "Assets that are not cash but can be quickly and easily converted into cash — such as savings deposits, bonds, or money market funds.",
      meaningRu: "Активы, которые не являются наличными, но могут быть быстро и легко конвертированы в наличные — например, сберегательные вклады, облигации или фонды денежного рынка.",
      example: "A savings account is considered near money because you can withdraw the cash quickly.",
      collocations: ["near money assets (активы квазиденег)", "convert near money to cash (конвертировать квазиденьги в наличные)", "near money instruments (инструменты квазиденег)"]
    },
    {
      id: "u3_standardofvalue",
      term: "standard of value",
      pos: "noun phrase",
      translationRu: "мера стоимости",
      trick: "STANDARD = мерило, эталон + VALUE = стоимость. Деньги — это МЕРИЛО, которое позволяет сравнивать цены разных вещей. Как линейка, только для цен.",
      meaningEn: "Money's function as a common unit for measuring and comparing the prices of different goods and services.",
      meaningRu: "Функция денег как общей единицы для измерения и сравнения цен различных товаров и услуг.",
      example: "Money acts as a standard of value — you can compare the price of a car with the price of a phone.",
      collocations: ["serve as a standard of value (служить мерой стоимости)", "standard of value in economics (мера стоимости в экономике)", "money as a standard of value (деньги как мера стоимости)"]
    },
    {
      id: "u3_storeofvalue",
      term: "store of value",
      pos: "noun phrase",
      translationRu: "средство сбережения / накопления",
      trick: "STORE = хранить, хранилище + VALUE = ценность. Деньги ХРАНЯТ твою ценность. Заработал сегодня — потратишь через год. Ценность сохраняется.",
      meaningEn: "Money's ability to keep its value over time, so you can save it now and spend it in the future.",
      meaningRu: "Способность денег сохранять свою ценность со временем, чтобы вы могли сберегать их сейчас и тратить в будущем.",
      example: "Gold was historically used as a store of value because it does not lose its worth over time.",
      collocations: ["act as a store of value (служить средством сбережения)", "store of value over time (сбережение ценности во времени)", "money as a store of value (деньги как средство сбережения)"]
    },
    {
      id: "u3_promote",
      term: "promote",
      pos: "verb",
      translationRu: "продвигать, способствовать, стимулировать",
      trick: "PRO- = вперёд + MOTE = двигать. Продвигать что-то вперёд — будь то товар, идею или финансовый продукт. Движение вверх или вперёд.",
      meaningEn: "To support or encourage something to grow or become more successful; to advertise or publicise a product or service.",
      meaningRu: "Поддерживать или стимулировать что-то, чтобы оно росло или становилось более успешным; рекламировать или продвигать продукт или услугу.",
      example: "The bank ran a campaign to promote its new savings account with a high interest rate.",
      collocations: ["promote a product (продвигать продукт)", "promote investment (стимулировать инвестиции)", "promote savings (стимулировать сбережения)"]
    }
  ],

  // ─── НОВАЯ ФИШКА Unit 3: Money Functions Compass ──────────────────────────
  // Аналог growthImpactMap из unit2 — цепочка с вопросами на понимание функций денег
  moneyFunctionsCompass: {
    title: "Money Functions Compass",
    description: "Money has four core functions. Follow each function, understand it with a real-life example, and answer the question.",
    chain: [
      {
        id: "mfc_1",
        stage: "Means of Exchange",
        icon: "ArrowLeftRight",
        color: "#5E9E89",
        description: "You use money to buy goods and services — instead of exchanging one item for another (barter). Jane pays $50 for her weekly groceries.",
        vocab: ["means of exchange", "currency", "fiat money"],
        question: "Without money, how would people exchange goods?",
        options: ["By using credit cards only", "By exchanging goods directly — barter", "By asking the government", "By using bonds"],
        answer: "By exchanging goods directly — barter",
        explanation: "Before money, people bartered — traded goods directly. Money replaced this by acting as a universal means of exchange."
      },
      {
        id: "mfc_2",
        stage: "Store of Value",
        icon: "PiggyBank",
        color: "#3B6EA5",
        description: "You can earn money today and save it for the future. Its value does not disappear. Jane earns $3,000 this month and deposits $500 into savings.",
        vocab: ["store of value", "deposit", "time deposit"],
        question: "Which of these is a store of value?",
        options: ["A fresh apple", "A government bond", "A concert ticket", "A daily newspaper"],
        answer: "A government bond",
        explanation: "A bond keeps its value over time and can be converted to cash later — making it a classic example of a store of value. Fresh goods (apple, ticket) lose value quickly."
      },
      {
        id: "mfc_3",
        stage: "Standard of Value",
        icon: "Scale",
        color: "#7A6AB5",
        description: "Money lets you compare prices of completely different things. A car costs $30,000 — that is 50 times more than a phone that costs $600. Without money, this comparison would be impossible.",
        vocab: ["standard of value", "monetary value", "value"],
        question: "How does money serve as a standard of value?",
        options: ["By printing more notes", "By allowing us to compare prices of different goods", "By paying workers", "By reducing inflation"],
        answer: "By allowing us to compare prices of different goods",
        explanation: "As a standard of value, money gives every good a price — a common unit we can use to compare completely different items."
      },
      {
        id: "mfc_4",
        stage: "Near Money",
        icon: "CreditCard",
        color: "#C0943A",
        description: "Some things are not cash but can be quickly turned into cash. A savings account, a bond, or a money market fund — these are 'near money'. Close to cash but not quite.",
        vocab: ["near money", "bond", "demand deposit", "account"],
        question: "Which of these is the BEST example of near money?",
        options: ["A house", "A car", "A savings account", "A painting"],
        answer: "A savings account",
        explanation: "A savings account can be converted to cash quickly and easily — the definition of near money. A house or painting takes much longer to sell."
      },
      {
        id: "mfc_5",
        stage: "Fiat Money",
        icon: "Landmark",
        color: "#C05050",
        description: "Modern money (banknotes and coins) has value because the government declares it legal tender — not because it is made of gold or silver. The US dollar is fiat money since 1971.",
        vocab: ["fiat money", "currency", "money supply"],
        question: "What gives fiat money its value?",
        options: ["The gold stored in a vault", "The silver coins it replaces", "The government declaring it legal tender", "The interest rate set by banks"],
        answer: "The government declaring it legal tender",
        explanation: "Fiat money has value by government decree — 'fiat' means 'let it be so'. There is no gold or commodity backing it."
      },
      {
        id: "mfc_6",
        stage: "Money Supply",
        icon: "BarChart3",
        color: "#4A8C6A",
        description: "The total amount of money in the economy is the money supply. Central banks (like the Bank of England or the US Fed) control how much money is available to prevent inflation.",
        vocab: ["money supply", "supply of currency", "interest rate"],
        question: "What does a central bank do when inflation rises?",
        options: ["Increase the money supply", "Reduce the money supply and raise interest rates", "Print more currency", "Remove all bonds from the market"],
        answer: "Reduce the money supply and raise interest rates",
        explanation: "To fight inflation, a central bank tightens the money supply and raises interest rates — making borrowing more expensive and slowing spending."
      }
    ]
  },

  exercises: [
    {
      id: "ex3_match_a",
      type: "match",
      title: "Match the Word with the Translation — A: Loans and Deposits / Кредиты и вклады",
      instruction: "Connect each English word with its Russian translation.",
      pairs: [
        { en: "loan",            ru: "кредит, заём" },
        { en: "deposit",         ru: "вклад; вносить на счёт" },
        { en: "borrow",          ru: "занимать (деньги)" },
        { en: "interest",        ru: "проценты (по кредиту или вкладу)" },
        { en: "repay a loan",    ru: "погасить кредит" },
      ]
    },
    {
      id: "ex3_match_b",
      type: "match",
      title: "Match the Word with the Translation — B: Money Functions / Функции денег",
      instruction: "Connect each English phrase with its Russian translation.",
      pairs: [
        { en: "means of exchange",  ru: "средство обмена" },
        { en: "store of value",     ru: "средство сбережения" },
        { en: "standard of value",  ru: "мера стоимости" },
        { en: "near money",         ru: "квазиденьги / «почти деньги»" },
        { en: "fiat money",         ru: "фиатные (декретные) деньги" },
      ]
    },
    {
      id: "ex3_match_c",
      type: "match",
      title: "Match the Word with the Translation — C: Banking Vocabulary / Банковская лексика",
      instruction: "Connect each English term with its Russian translation.",
      pairs: [
        { en: "current account",   ru: "текущий счёт (BR)" },
        { en: "checking account",  ru: "расчётный счёт (US)" },
        { en: "demand deposit",    ru: "депозит до востребования" },
        { en: "time deposit",      ru: "срочный вклад" },
        { en: "compound interest", ru: "сложный процент" },
      ]
    },
    {
      id: "ex3_tf",
      type: "trueFalse",
      title: "True or False?",
      instruction: "Read each sentence. Is it TRUE or FALSE?",
      items: [
        { statement: "A loan is money you give to a bank for safekeeping.", answer: false, explanation: "A loan is money you BORROW from a bank. What you give to a bank for safekeeping is a deposit." },
        { statement: "Compound interest is calculated on the original amount AND on the interest already earned.", answer: true, explanation: "Correct — compound interest snowballs: it grows faster because it adds interest on interest." },
        { statement: "A time deposit can be withdrawn at any time without notice.", answer: false, explanation: "A time deposit must be kept for a fixed period. To withdraw early, you usually need to give advance notice." },
        { statement: "A demand deposit can be withdrawn at any time.", answer: true, explanation: "Correct — demand deposits are 'on demand', meaning the bank must release your money when you ask for it." },
        { statement: "Fiat money has value because it is made of gold.", answer: false, explanation: "Fiat money has value because the government declares it legal tender — not because of the material it is made of." },
        { statement: "The money supply includes cash, coins, and bank deposits.", answer: true, explanation: "Correct — money supply = all forms of money in the economy, including physical cash and account balances." },
        { statement: "A bond is a type of loan from you to the government or company.", answer: true, explanation: "Correct — when you buy a bond, you lend money to the issuer (government or company) for a fixed period." },
        { statement: "A stock represents a debt owed to you by a company.", answer: false, explanation: "A stock is a SHARE of the company — you are a part owner, not a creditor. If the company does well, your stock value rises." },
        { statement: "Near money is the same as cash.", answer: false, explanation: "Near money is NOT cash — it is assets that can be quickly converted to cash, like savings accounts or bonds." },
        { statement: "A current account in the UK is the same as a checking account in the US.", answer: true, explanation: "Correct — they are different names for the same type of everyday bank account in two countries." },
        { statement: "The interest rate is a fixed number that never changes.", answer: false, explanation: "Interest rates can be fixed or variable — they often change based on central bank decisions." },
        { statement: "To promote a product means to advertise and support its growth.", answer: true, explanation: "Correct — promote = to actively support, market, or advertise something to increase its visibility or success." }
      ]
    },
    {
      id: "ex3_fill",
      type: "fillGap",
      title: "Fill in the Gaps",
      instruction: "Complete each sentence with the correct word from the box.",
      wordBank: ["loan", "interest rate", "borrow", "deposit", "compound interest", "currency", "fiat money", "money supply", "bond", "near money", "means of exchange", "repay", "advance notice", "time deposit", "stock", "promote", "account", "value"],
      items: [
        { sentence: "Arthur went to the bank to ______ $15,000 for a second-hand car.", answer: "borrow", explanation: "Borrow = to take money from a bank with an agreement to return it." },
        { sentence: "The bank offered a personal ______ at 8.5% per year.", answer: "loan", explanation: "Loan = a sum of money borrowed from a bank." },
        { sentence: "Money grew faster because the bank used ______, not simple interest.", answer: "compound interest", explanation: "Compound interest grows faster because it adds interest on interest." },
        { sentence: "You need to give 30 days' ______ before withdrawing from a term deposit.", answer: "advance notice", explanation: "Advance notice = warning given before an action, required by some bank products." },
        { sentence: "The US dollar is ______ — its value comes from government authority, not gold.", answer: "fiat money", explanation: "Fiat money = money declared legal by the government, not backed by physical commodity." },
        { sentence: "She placed $5,000 in a one-year ______ to earn higher interest.", answer: "time deposit", explanation: "Time deposit = a fixed-term bank deposit that earns higher interest." },
        { sentence: "Central banks control the ______ to manage inflation.", answer: "money supply", explanation: "Money supply = total money in the economy, controlled by the central bank." },
        { sentence: "The government issued a new ______ to finance road construction.", answer: "bond", explanation: "Bond = a financial instrument where the buyer lends money to the issuer." },
        { sentence: "Money acts as a ______ — it allows people to buy goods instead of bartering.", answer: "means of exchange", explanation: "Means of exchange = the primary function of money as a medium for transactions." },
        { sentence: "A savings account is considered ______ — it is not cash but can be converted quickly.", answer: "near money", explanation: "Near money = liquid assets easily converted to cash." },
        { sentence: "The euro is the official ______ of most European Union countries.", answer: "currency", explanation: "Currency = the official money system of a country or region." },
        { sentence: "He bought 200 shares of ______ in a technology company.", answer: "stock", explanation: "Stock = a share representing part ownership in a company." },
        { sentence: "She opened a bank ______ and deposited her first salary.", answer: "account", explanation: "Account = an arrangement with a bank to keep and manage money." },
        { sentence: "The ______ of this property has increased significantly over five years.", answer: "value", explanation: "Value = the monetary worth of something." },
        { sentence: "Arthur must ______ the full loan within five years.", answer: "repay", explanation: "Repay = to pay back borrowed money." },
        { sentence: "The bank will ______ its new savings product with TV advertising.", answer: "promote", explanation: "Promote = to advertise or market a product or service." },
        { sentence: "She made a ______ of $200 into her account every Friday.", answer: "deposit", explanation: "Deposit = an amount of money placed into a bank account." },
        { sentence: "A lower ______ makes it cheaper to borrow money.", answer: "interest rate", explanation: "Interest rate = the percentage charged on a loan or paid on a deposit." }
      ]
    },
    {
      id: "ex3_choose",
      type: "multipleChoice",
      title: "Choose the Correct Word",
      instruction: "Choose the best word to complete each sentence.",
      items: [
        {
          sentence: "The government declared that the new note is legal tender. This means it is ______.",
          options: ["near money", "fiat money", "compound interest", "a time deposit"],
          answer: "fiat money",
          explanation: "Fiat money = money that is legal tender by government declaration, not backed by a physical commodity."
        },
        {
          sentence: "Mr Collins compares the price of a bicycle ($400) with the price of a laptop ($800). Money is acting as a ______.",
          options: ["means of exchange", "store of value", "standard of value", "demand deposit"],
          answer: "standard of value",
          explanation: "Standard of value = money's function as a common unit to compare prices of different goods."
        },
        {
          sentence: "Arthur borrowed $15,000 and must pay it back over 5 years. He needs to ______ the loan.",
          options: ["deposit", "promote", "repay", "advance"],
          answer: "repay",
          explanation: "Repay a loan = to pay back money that was borrowed, usually with interest."
        },
        {
          sentence: "You put $1,000 in the bank. Next year you have $1,080 ($80 interest). The following year you earn interest on $1,080, not just $1,000. This is ______.",
          options: ["simple interest", "compound interest", "monetary value", "fiat money"],
          answer: "compound interest",
          explanation: "Compound interest = interest calculated on the original amount PLUS interest already earned."
        },
        {
          sentence: "A savings account you can withdraw from any day without advance notice is a ______.",
          options: ["time deposit", "bond", "demand deposit", "stock"],
          answer: "demand deposit",
          explanation: "Demand deposit = a bank deposit accessible at any time, on demand — no notice required."
        },
        {
          sentence: "The bank pays 6% per year on a one-year fixed deposit. The ______ is 6% per annum.",
          options: ["advance", "monetary value", "interest rate", "money supply"],
          answer: "interest rate",
          explanation: "Interest rate = the percentage charged or earned on a financial product."
        },
        {
          sentence: "The company launched a marketing campaign to ______ its new banking app.",
          options: ["borrow", "advance", "promote", "deposit"],
          answer: "promote",
          explanation: "Promote = to market or actively support a product to increase awareness or sales."
        },
        {
          sentence: "You put money in the bank today and plan to use it in five years. Money is acting as a ______.",
          options: ["means of exchange", "standard of value", "store of value", "near money"],
          answer: "store of value",
          explanation: "Store of value = money keeps its worth over time so you can save it for future use."
        }
      ]
    },
    {
      id: "ex3_concept",
      type: "conceptMatch",
      title: "Match the Concept",
      instruction: "Match each description with the correct banking or money term.",
      pairs: [
        { description: "Money that has value because the government says it does — not backed by gold or any metal.", term: "fiat money" },
        { description: "Interest that is calculated on the original sum plus all previously earned interest — it grows faster over time.", term: "compound interest" },
        { description: "A bank deposit that you must keep for a fixed period, such as 6 months or 1 year, to earn a higher interest rate.", term: "time deposit" },
        { description: "A bank deposit you can withdraw at any time without giving the bank any warning.", term: "demand deposit" },
        { description: "Assets that are close to cash — such as savings accounts or bonds — that can be quickly converted to money.", term: "near money" },
        { description: "Money's ability to allow people to compare prices of completely different goods in a common unit.", term: "standard of value" },
        { description: "Money's ability to keep its worth over time, so you can save it today and use it in the future.", term: "store of value" },
        { description: "The total amount of money available in an economy, including cash and bank deposits, controlled by the central bank.", term: "money supply" },
        { description: "A financial instrument where you lend money to a government or company and receive it back with interest after a fixed period.", term: "bond" },
        { description: "The formal notice you must give a bank before withdrawing money from certain fixed-term accounts.", term: "advance notice" }
      ]
    }
  ],

  reading: {
    title: "Money, Banks, and Loans",
    guidance: "Read the text slowly. You know many words from the Dictionary. Important words are highlighted. Try to understand the main ideas.",
    guidanceRu: "Читайте медленно. Вы уже знаете многие слова из Словаря. Важные слова выделены. Постарайтесь понять основные идеи.",
    paragraphs: [
      {
        text: "**Money** is one of the most important inventions in human history. Before money, people used **barter** — they exchanged goods directly. A farmer might give ten bags of wheat in exchange for a pair of shoes. The problem was that barter only worked if both people wanted exactly what the other had. Money solved this problem by acting as a **means of exchange** that everyone accepts.",
        glossary: { "barter": "бартер — прямой обмен товарами без денег", "means of exchange": "средство обмена", "accepts": "принимает" }
      },
      {
        text: "Today, most money is **fiat money**. It has **value** not because it is made of gold or silver, but because the government declares it legal tender. The US dollar, the British pound, and the euro are all fiat currencies. The **supply of currency** in the economy is controlled by central banks, which use it to manage prices and promote economic stability.",
        glossary: { "fiat money": "фиатные деньги — не обеспеченные золотом", "supply of currency": "объём валюты в обращении", "legal tender": "законное платёжное средство" }
      },
      {
        text: "Money serves several important functions. As a **standard of value**, it lets us compare the price of completely different things — a bicycle costs $400 and a car costs $20,000, so the car is 50 times more expensive. As a **store of value**, money lets you save today and spend in the future. And near money — savings accounts, **bonds**, and other liquid assets — can also store value and be quickly converted to cash when needed.",
        glossary: { "standard of value": "мера стоимости", "store of value": "средство сбережения", "liquid assets": "ликвидные активы" }
      },
      {
        text: "Banks are the heart of the financial system. When you open an **account**, you deposit money and the bank keeps it safe. In Britain, people use a **current account** for everyday transactions. In the United States, the same product is called a **checking account**. Both let you pay bills, receive your salary, and make transfers at any time.",
        glossary: { "account": "банковский счёт", "current account": "текущий счёт (BR)", "checking account": "расчётный счёт (US)", "transactions": "транзакции, операции" }
      },
      {
        text: "If you want to save more money and earn higher interest, you can open a **time deposit**. Unlike a **demand deposit**, a time deposit must stay in the bank for a fixed period — for example, one year. In return, the bank pays a higher **interest rate**. But if you need the money early, you usually must give **advance notice** and may lose some interest.",
        glossary: { "time deposit": "срочный вклад", "demand deposit": "депозит до востребования", "interest rate": "процентная ставка", "advance notice": "предварительное уведомление" }
      },
      {
        text: "Banks use the money you deposit to give **loans** to other customers. When you **borrow** from a bank, you must pay back more than you received — the extra amount is the **interest**. Banks often use **compound interest**, which means interest is added not only to the original sum but also to the interest already paid. This makes debt grow quickly if you do not **repay a loan** on time.",
        glossary: { "loan": "кредит, заём", "borrow": "занимать", "interest": "проценты", "compound interest": "сложный процент" }
      },
      {
        text: "The **money supply** is the total amount of money in the economy. Central banks control it carefully. If there is too much money, prices rise — this is called inflation. If there is too little, people cannot borrow and spend, and the economy slows down. Banks also buy and sell **stocks** and **bonds** to promote growth and manage risk in the financial system.",
        glossary: { "money supply": "денежная масса", "inflation": "инфляция", "stocks": "акции", "bonds": "облигации" }
      },
      {
        text: "Understanding banking helps you make better decisions. Knowing the difference between a **demand deposit** and a **time deposit** tells you when you can access your money. Understanding **compound interest** shows you why repaying debt quickly saves you money. And knowing about **currency** and the **monetary value** of assets helps you understand how the whole economy connects.",
        glossary: { "monetary value": "денежная стоимость", "currency": "валюта", "assets": "активы" }
      }
    ]
  },

  comprehension: [
    { q: "What problem did money solve compared to barter?", model: "Barter only worked if both people wanted exactly what the other had. Money solved this by providing a universal means of exchange that everyone accepts." },
    { q: "What is fiat money?", model: "Fiat money is money that has value because the government declares it legal tender — not because it is made of gold or any physical commodity." },
    { q: "What is the difference between a current account and a time deposit?", model: "A current account (or demand deposit) lets you access money at any time. A time deposit must stay in the bank for a fixed period and earns higher interest." },
    { q: "Why does compound interest make debt grow quickly?", model: "Compound interest adds interest not only to the original sum but also to interest already earned — so the amount you owe grows faster over time." },
    { q: "What does the central bank do to control money supply?", model: "The central bank controls the total amount of money available. If inflation rises, it reduces the money supply and raises interest rates to slow borrowing and spending." },
    { q: "What is near money? Give one example.", model: "Near money is assets that are not cash but can be quickly converted to cash. A savings account is one example." },
    { q: "True or False: A time deposit can be withdrawn any day without notice.", model: "False. A time deposit must stay in the bank for a fixed period. Early withdrawal usually requires advance notice and may reduce interest earned." },
    { q: "How does money serve as a standard of value?", model: "Money lets you compare the prices of completely different things using a common unit — for example, a bicycle costs $400 and a car costs $20,000, so the car is 50 times more expensive." }
  ],

  // ─── НОВАЯ ФИШКА Unit 3: Bank Account Picker ────────────────────────────
  // Аналог memoSection из unit2 — разбор 4 типов счётов + задачи
  bankAccountSection: {
    title: "Bank Account Picker — Which Account is Right?",
    description: "Banks offer different types of accounts for different needs. Learn the four main types and when to use each one.",
    descriptionRu: "Банки предлагают разные типы счетов для разных нужд. Изучите четыре основных вида и узнайте, когда использовать каждый из них.",
    filters: [
      { id: 'all',          label: 'All accounts',    labelRu: 'Все счета' },
      { id: 'daily',        label: 'Daily spending',  labelRu: 'Повседневные траты' },
      { id: 'saving',       label: 'Saving long-term', labelRu: 'Долгосрочные сбережения' },
      { id: 'interest',     label: 'Earning interest', labelRu: 'Заработок процентов' },
      { id: 'no_notice',    label: 'Instant access',  labelRu: 'Мгновенный доступ' },
    ],
    accountTypes: [
      {
        id: "current",
        name: "Current Account",
        nameRu: "Текущий счёт (BR)",
        icon: "Wallet",
        color: "#5E9E89",
        region: "UK",
        tags: ['daily', 'no_notice'],
        description: "For everyday transactions. Pay bills, receive salary, make transfers. Access your money at any time.",
        descriptionRu: "Для повседневных операций. Оплата счетов, получение зарплаты, переводы. Доступ к деньгам в любое время.",
        keyFeatures: ["No restriction on withdrawals", "Low or no interest paid", "Used daily — salary, bills, shopping"],
        stats: { interest: 'Usually 0%', access: 'Immediate', term: 'None' },
        equivalents: "Also called: checking account (US)"
      },
      {
        id: "checking",
        name: "Checking Account",
        nameRu: "Расчётный счёт (US)",
        icon: "CheckSquare",
        color: "#3B6EA5",
        region: "USA",
        tags: ['daily', 'no_notice'],
        description: "The American equivalent of a current account. You write cheques, make card payments, and receive salary. Accessible at any time.",
        descriptionRu: "Американский эквивалент текущего счёта. Вы выписываете чеки, делаете карточные платежи и получаете зарплату. Доступ в любое время.",
        keyFeatures: ["Linked to cheque-writing", "No restriction on withdrawals", "Standard for salary and bills in the US"],
        stats: { interest: '0%', access: 'Immediate', term: 'None' },
        equivalents: "Also called: current account (UK)"
      },
      {
        id: "demand_deposit",
        name: "Demand Deposit",
        nameRu: "Депозит до востребования",
        icon: "Clock",
        color: "#C0943A",
        region: "USA / UK",
        tags: ['no_notice'],
        description: "Any account where you can withdraw money on demand — at any time, without advance notice. Current accounts and checking accounts are demand deposits.",
        descriptionRu: "Любой счёт, с которого можно снять деньги по требованию — в любое время, без предварительного уведомления. Текущие и расчётные счета — это депозиты до востребования.",
        keyFeatures: ["Available any time", "No notice required", "Usually low interest — the bank cannot rely on the money staying"],
        stats: { interest: 'Small / 0%', access: 'Immediate', term: 'None' },
        equivalents: "Includes: current accounts, checking accounts"
      },
      {
        id: "time_deposit",
        name: "Time Deposit",
        nameRu: "Срочный вклад",
        icon: "Calendar",
        color: "#6A5ACD",
        region: "USA / UK",
        tags: ['saving', 'interest'],
        description: "Money you lock away for a fixed period — 6 months, 1 year, or more. In return, the bank pays higher interest. You must give advance notice before withdrawing early.",
        descriptionRu: "Деньги, которые вы блокируете на фиксированный срок — 6 месяцев, 1 год и более. Взамен банк платит более высокий процент. Для досрочного снятия нужно предварительное уведомление.",
        keyFeatures: ["Fixed term — 6 months to 5 years", "Higher interest rate than demand deposits", "Advance notice required for early withdrawal"],
        stats: { interest: 'Highest', access: 'Fixed term', term: '6 mo – 5 yr' },
        equivalents: "Also called: term deposit, fixed-rate deposit, CD (US)"
      }
    ],
    tasks: [
      {
        id: "bank_match",
        type: "match",
        title: "Match the Account to the Situation",
        instruction: "Match each banking situation with the correct account type.",
        pairs: [
          { en: "Current account", ru: "An everyday account for salary and bills — access money any time (UK)" },
          { en: "Checking account", ru: "An everyday account with cheque-writing — access money any time (US)" },
          { en: "Demand deposit", ru: "Any account where you can withdraw at any time without notice" },
          { en: "Time deposit", ru: "A fixed-term account that earns higher interest but requires advance notice to withdraw" }
        ]
      },
      {
        id: "bank_tf",
        type: "trueFalse",
        title: "True or False — Bank Accounts",
        instruction: "Is each statement TRUE or FALSE?",
        items: [
          { statement: "A time deposit earns higher interest than a demand deposit.", answer: true, explanation: "Correct — because the bank can rely on the money staying for a fixed period, it pays more interest." },
          { statement: "A current account in the UK is used only once a month.", answer: false, explanation: "A current account is for everyday use — salary, bills, shopping. It is used very frequently." },
          { statement: "A demand deposit requires 30 days' advance notice before withdrawal.", answer: false, explanation: "A demand deposit requires NO advance notice — you can withdraw on demand, any time." },
          { statement: "A checking account and a current account are used for the same purpose in different countries.", answer: true, explanation: "Correct — checking account (US) and current account (UK) are different names for the same type of everyday bank account." },
          { statement: "A time deposit is a good choice if you need daily access to your money.", answer: false, explanation: "A time deposit locks money away for a fixed term. For daily access, you need a demand deposit like a current account." }
        ]
      },
      {
        id: "bank_choose",
        type: "multipleChoice",
        title: "Choose the Best Account",
        instruction: "Read the situation. Which account type is best?",
        items: [
          {
            sentence: "Maria receives her salary and pays her rent and bills from the same account every month. She needs to access it freely.",
            options: ["Time deposit", "Current account", "Government bond", "Stock account"],
            answer: "Current account",
            explanation: "A current account is designed for frequent, everyday transactions like salary deposits and bill payments."
          },
          {
            sentence: "John has $10,000 he will not need for one year. He wants to earn as much interest as possible.",
            options: ["Demand deposit", "Checking account", "Time deposit", "Current account"],
            answer: "Time deposit",
            explanation: "A time deposit earns higher interest when you agree not to withdraw the money for a fixed period."
          },
          {
            sentence: "Anna needs to give the bank advance notice before she can access her money. What type of account does she have?",
            options: ["Demand deposit", "Current account", "Time deposit", "Checking account"],
            answer: "Time deposit",
            explanation: "Time deposits require advance notice for early withdrawal — a key feature that distinguishes them from demand deposits."
          }
        ]
      }
    ]
  },

  // ─── НОВАЯ ФИШКА Unit 3: Loan Simulator (Arthur's Car) ──────────────────
  // Аналог labourMarketSection + caseStudy из unit2 — кейс Артура с данными кредита
  loanSimulator: {
    title: "Loan Simulator — Arthur's Car",
    subtitle: "Real numbers. Real vocabulary. Real decision.",
    description: "Arthur wants to buy a car. Move the sliders to see how the price, down payment, term, and interest rate change his monthly payment and total cost.",
    descriptionRu: "Артур хочет купить автомобиль. Двигайте слайдеры, чтобы увидеть, как цена, первоначальный взнос, срок и процентная ставка влияют на ежемесячный платёж и общую стоимость.",
    currency: 'RUB',
    defaults: {
      price: 1500000,        // ₽ price of the car
      downPaymentPct: 20,    // % of price paid upfront
      termMonths: 36,        // months to repay the loan
      ratePct: 14.5,         // annual interest rate %
    },
    sliders: {
      price:          { min: 500000, max: 5000000, step: 50000,  label: 'Car price',          labelRu: 'Цена автомобиля' },
      downPaymentPct: { min: 0,      max: 50,      step: 1,      label: 'Down payment',       labelRu: 'Первоначальный взнос' },
      termMonths:     { min: 6,      max: 60,      step: 6,      label: 'Term',               labelRu: 'Срок кредита' },
      ratePct:        { min: 5,      max: 25,      step: 0.5,    label: 'Annual rate',        labelRu: 'Годовая ставка' },
    },
    loanParams: {
      principal: 15000,
      interestRate: 8.5,
      years: 5,
      monthlyInstalment: 307,
      totalInterest: 3452,
      totalRepay: 18452,
      currency: "USD"
    },
    caseText: "Arthur has just finished his first year at university. He needs a car to get to his work placement across town. He visits the bank and speaks with a loan officer, Ms Williams. She explains his two options: a personal loan or an overdraft. Arthur decides to apply for a personal loan of $15,000. The principal — the amount he borrows — is $15,000. The bank charges a fixed interest rate of 8.5% per year. With compound interest, his total repayment will be $18,452 — $3,452 more than he borrowed. He will repay the loan in 60 equal monthly instalments of $307. If Arthur had chosen an overdraft instead, the rate would have been 10–12% over base rate. The loan officer advises him: the longer you take to repay, the more interest you pay. Arthur signs the loan agreement and agrees to repay in full within five years.",
    loanNarrative: "The bank officer explains: 'You are applying for a personal loan of $15,000. The principal is the amount you borrow. The interest rate is fixed at 8.5% per year. You will repay in 60 equal monthly instalments over 5 years. Total interest: $3,452. Total repayment: $18,452.'",
    characters: [
      { name: "Arthur", age: 20, situation: "A university student who needs a car for his work placement. He is borrowing $15,000 from the bank." },
      { name: "Ms Williams", age: null, situation: "The bank loan officer. She explains the personal loan and overdraft options and guides Arthur through the decision." }
    ],
    tasks: [
      {
        id: "loan_match",
        type: "match",
        title: "Match the Loan Term to its Meaning",
        instruction: "Match each banking term with the correct definition.",
        pairs: [
          { en: "principal",           ru: "The original amount of money borrowed — before any interest is added" },
          { en: "instalment",          ru: "One of a series of equal regular payments used to repay a loan" },
          { en: "interest rate",       ru: "The percentage charged by the bank for lending money" },
          { en: "compound interest",   ru: "Interest calculated on both the original amount and previously earned interest" },
          { en: "overdraft",           ru: "A short-term credit facility that lets you spend more than you have in your account" },
          { en: "repay",               ru: "To pay back borrowed money, usually with interest" }
        ]
      },
      {
        id: "loan_tf",
        type: "trueFalse",
        title: "True or False — Arthur's Loan",
        instruction: "Read each statement about the case study. Is it TRUE or FALSE?",
        items: [
          { statement: "Arthur borrowed $15,000 to buy a car.", answer: true, explanation: "Correct — the principal amount of Arthur's personal loan was $15,000." },
          { statement: "The interest rate on Arthur's loan is 10%.", answer: false, explanation: "Arthur's loan has a fixed interest rate of 8.5% per year — not 10%." },
          { statement: "Arthur will make monthly instalments of $307.", answer: true, explanation: "Correct — he repays $307 per month over 60 months (5 years)." },
          { statement: "Arthur will repay exactly $15,000 in total.", answer: false, explanation: "Arthur repays $18,452 — the $15,000 principal plus $3,452 in interest." },
          { statement: "An overdraft has a lower interest rate than Arthur's personal loan.", answer: false, explanation: "The loan officer explains that an overdraft rate would be 10–12% over base rate — higher than Arthur's 8.5% fixed rate." },
          { statement: "The longer you take to repay a loan, the more interest you pay in total.", answer: true, explanation: "Correct — a longer repayment period means more months of interest accumulating, so the total cost is higher." }
        ]
      },
      {
        id: "loan_choose",
        type: "multipleChoice",
        title: "Understand Arthur's Loan",
        instruction: "Choose the best answer for each question.",
        items: [
          {
            sentence: "What is the 'principal' in Arthur's loan?",
            options: ["The total amount he repays ($18,452)", "The monthly instalment ($307)", "The original amount borrowed ($15,000)", "The total interest ($3,452)"],
            answer: "The original amount borrowed ($15,000)",
            explanation: "The principal is always the original amount borrowed — before any interest is added."
          },
          {
            sentence: "Why does Arthur pay $18,452 instead of $15,000?",
            options: ["Because he chose an overdraft", "Because of the 8.5% interest added over 5 years", "Because the car cost more than expected", "Because he missed some payments"],
            answer: "Because of the 8.5% interest added over 5 years",
            explanation: "The extra $3,452 is the total interest charged at 8.5% per year over a 5-year repayment period."
          },
          {
            sentence: "Why might Arthur choose a personal loan over an overdraft?",
            options: ["An overdraft has a lower interest rate", "A personal loan has a higher interest rate", "A personal loan has a fixed, lower interest rate and structured instalments", "An overdraft allows him to borrow more"],
            answer: "A personal loan has a fixed, lower interest rate and structured instalments",
            explanation: "Arthur's loan at 8.5% is cheaper than an overdraft at 10–12%. A fixed rate also makes planning easier."
          }
        ]
      }
    ]
  },

  // ─── НОВАЯ ФИШКА Unit 3: Currency Comparator (£ vs $) ────────────────
  // Аналог rolePerspectives из unit2 — сравнение британской и американской денежных систем
  currencyComparator: {
    title: "British £ vs American $ — A Currency Comparator",
    description: "The UK and the US both use different currencies with different coins and notes — and even different slang! Learn the key differences.",
    descriptionRu: "В Великобритании и США используются разные валюты с разными монетами и банкнотами — и даже разным сленгом! Изучите основные различия.",
    britishSystem: {
      currency: "British Pound Sterling (£)",
      currencyRu: "Британский фунт стерлингов (£)",
      coins: [
        { name: "1 penny (1p)", slang: "p", note: "The smallest unit." },
        { name: "2 pence (2p)", slang: "2p", note: "" },
        { name: "5 pence (5p)", slang: "5p", note: "" },
        { name: "10 pence (10p)", slang: "10p", note: "" },
        { name: "20 pence (20p)", slang: "20p", note: "" },
        { name: "50 pence (50p)", slang: "50p", note: "Heptagonal coin." },
        { name: "£1 coin", slang: "quid (informal)", note: "'A quid' = £1." },
        { name: "£2 coin", slang: "two quid (informal)", note: "Two-colour coin." }
      ],
      notes: [
        { name: "£5 note", slang: "fiver", note: "'A fiver' = £5." },
        { name: "£10 note", slang: "tenner", note: "'A tenner' = £10." },
        { name: "£20 note", slang: "twenty quid", note: "Most common note." },
        { name: "£50 note", slang: "fifty", note: "Rarely used in everyday shopping." }
      ]
    },
    americanSystem: {
      currency: "US Dollar ($)",
      currencyRu: "Доллар США ($)",
      coins: [
        { name: "1 cent", slang: "penny", note: "The smallest US coin." },
        { name: "5 cents", slang: "nickel", note: "Made of nickel alloy." },
        { name: "10 cents", slang: "dime", note: "Smaller than nickel despite being worth more." },
        { name: "25 cents", slang: "quarter", note: "Most common coin." },
        { name: "50 cents", slang: "half dollar", note: "Rarely used in daily life." },
        { name: "$1 coin", slang: "dollar coin", note: "Uncommon — most people use $1 bills." }
      ],
      notes: [
        { name: "$1 bill", slang: "buck (informal)", note: "'A buck' = $1." },
        { name: "$5 bill", slang: "five bucks / Lincoln", note: "Lincoln is on the $5 bill." },
        { name: "$10 bill", slang: "ten bucks", note: "" },
        { name: "$20 bill", slang: "twenty / Jackson", note: "Most common banknote." },
        { name: "$100 bill", slang: "C-note / Benjamin", note: "Benjamin Franklin on the $100." }
      ]
    },
    tasks: [
      {
        id: "curr_match",
        type: "match",
        title: "Match the Slang to the Currency Amount",
        instruction: "Match each slang term with the correct amount.",
        pairs: [
          { en: "quid", ru: "£1 (one British pound)" },
          { en: "fiver", ru: "£5 (five British pounds)" },
          { en: "tenner", ru: "£10 (ten British pounds)" },
          { en: "buck", ru: "$1 (one US dollar)" },
          { en: "dime", ru: "$0.10 (ten US cents)" },
          { en: "nickel", ru: "$0.05 (five US cents)" }
        ]
      },
      {
        id: "curr_tf",
        type: "trueFalse",
        title: "True or False — British and American Currency",
        instruction: "Is each statement TRUE or FALSE?",
        items: [
          { statement: "The British pound and the US dollar are the same currency.", answer: false, explanation: "They are different currencies. The pound (£) is the British currency; the dollar ($) is the US currency." },
          { statement: "'A tenner' is British slang for £10.", answer: true, explanation: "Correct — 'tenner' is informal British English for a £10 banknote." },
          { statement: "A 'dime' in the US is worth more than a 'nickel'.", answer: true, explanation: "Correct — a dime = 10 cents, a nickel = 5 cents. The dime is worth twice as much, even though it is a smaller coin." },
          { statement: "The pound sterling is the official currency of the United States.", answer: false, explanation: "The official US currency is the dollar ($). The pound sterling (£) belongs to the United Kingdom." }
        ]
      },
      {
        id: "curr_choose",
        type: "multipleChoice",
        title: "British or American?",
        instruction: "Choose the correct answer.",
        items: [
          {
            sentence: "Mark says: 'That cost me a fiver.' How much did he spend?",
            options: ["$5", "£50", "£5", "£15"],
            answer: "£5",
            explanation: "'Fiver' is British slang for a £5 note."
          },
          {
            sentence: "In a US shop, which coin is worth more — a dime or a nickel?",
            options: ["A nickel (it is bigger)", "A dime (10 cents)", "They are worth the same", "A nickel (5 cents)"],
            answer: "A dime (10 cents)",
            explanation: "A dime = 10 cents, a nickel = 5 cents. Despite being smaller, the dime is worth twice as much."
          },
          {
            sentence: "The money used in a country is called its ______.",
            options: ["monetary value", "currency", "money supply", "stock"],
            answer: "currency",
            explanation: "Currency = the system of money used in a particular country (e.g. pound sterling in the UK, dollar in the US)."
          }
        ]
      }
    ]
  },

  dialogue: {
    title: "At the Bank: Applying for a Personal Loan",
    context: "Arthur is a student. He visits Westfield Bank to apply for a loan to buy a car. He speaks with Ms Williams, the loan officer.",
    lines: [
      { speaker: "Ms Williams", text: "Good morning. How can I help you today?" },
      { speaker: "Arthur", text: "Good morning. I'd like to **borrow** some money. I need a **loan** for a second-hand car." },
      { speaker: "Ms Williams", text: "Of course. What **value** are you looking for?" },
      { speaker: "Arthur", text: "I need $15,000. That's the **monetary value** of the car I want." },
      { speaker: "Ms Williams", text: "We can offer you a personal loan at a fixed **interest rate** of 8.5% per year. Your monthly **instalment** would be $307 for five years." },
      { speaker: "Arthur", text: "How much will I **repay** in total?" },
      { speaker: "Ms Williams", text: "You'll repay $18,452. The extra $3,452 is the **interest**. Because we use **compound interest**, you pay interest on the interest too." },
      { speaker: "Arthur", text: "Is there another option? What about an **advance** on my student account?" },
      { speaker: "Ms Williams", text: "That would be an overdraft — but the rate is higher, 10–12%. A personal **loan** is better for a large **deposit** like a car purchase." },
      { speaker: "Arthur", text: "I understand. I'll take the personal loan. Can I also open a **current account** to receive my salary?" },
      { speaker: "Ms Williams", text: "Absolutely. A **current account** is a **demand deposit** — you can access your money at any time. If you want higher interest on savings, we also offer **time deposits** — but those require 30 days' **advance notice** to withdraw." },
      { speaker: "Arthur", text: "Perfect. Let's **promote** my savings too! I'll put $200 a month into a time deposit." }
    ],
    tasks: [
      { type: "fill", q: "Arthur wants to ______ $15,000 from the bank.", a: "borrow" },
      { type: "fill", q: "The fixed interest ______ on Arthur's loan is 8.5%.", a: "rate" },
      { type: "choice", q: "How much interest will Arthur pay in total?", options: ["$307", "$15,000", "$3,452", "$18,452"], a: "$3,452" },
      { type: "fill", q: "Arthur will repay in 60 monthly ______.", a: "instalments" },
      { type: "choice", q: "What type of deposit can Arthur access at any time?", options: ["Time deposit", "Demand deposit", "Bond", "Stock"], a: "Demand deposit" },
      { type: "choice", q: "Why is compound interest more expensive than simple interest?", options: ["Because the rate is lower", "Because interest is added to the original amount only", "Because interest is calculated on the principal AND on previous interest", "Because you repay in fewer months"], a: "Because interest is calculated on the principal AND on previous interest" }
    ]
  },

  writing: {
    title: "Sentence Builder: Money and Banking",
    instruction: "Build 3 sentences about money and banking using the word tiles.",
    instructionRu: "Составьте 3 предложения о деньгах и банковском деле, используя блоки слов.",
    wordBank: ["loan", "interest rate", "compound interest", "deposit", "borrow", "repay", "currency", "fiat money", "store of value", "means of exchange", "money supply", "bond", "account", "time deposit", "demand deposit", "standard of value", "near money", "monetary value"],
    sentenceTargets: [
      {
        prompt: "Build the sentence: What does money act as in the economy?",
        tiles: ["Money", "acts", "as", "a", "means", "of", "exchange,", "allowing", "people", "to", "buy", "goods", "and", "services.", "barter", "stock", "currency"],
        answer: ["Money", "acts", "as", "a", "means", "of", "exchange,", "allowing", "people", "to", "buy", "goods", "and", "services."]
      },
      {
        prompt: "Sentence 2 — What happens with compound interest?",
        tiles: ["With", "compound", "interest,", "the", "amount", "you", "owe", "grows", "faster", "because", "interest", "is", "added", "to", "previous", "interest.", "loan", "rate", "deposit", "simple"],
        answer: ["With", "compound", "interest,", "the", "amount", "you", "owe", "grows", "faster", "because", "interest", "is", "added", "to", "previous", "interest."]
      },
      {
        prompt: "Sentence 3 — What is a time deposit?",
        tiles: ["A", "time", "deposit", "earns", "higher", "interest", "because", "the", "money", "stays", "in", "the", "bank", "for", "a", "fixed", "period.", "demand", "account", "loan", "advance"],
        answer: ["A", "time", "deposit", "earns", "higher", "interest", "because", "the", "money", "stays", "in", "the", "bank", "for", "a", "fixed", "period."]
      }
    ],
    sampleAnswer: "Money acts as a means of exchange, allowing people to buy goods and services. With compound interest, the amount you owe grows faster because interest is added to previous interest. A time deposit earns higher interest because the money stays in the bank for a fixed period.",
    teacherNotes: "Check that students use at least 5 unit words correctly in context. Accept A1–A2 grammar. Look for correct use of: compound interest, means of exchange, time deposit, interest, repay. Sentences should demonstrate understanding of banking concepts, not just vocabulary."
  },

  scenario: {
    title: "Scenario Loop: You Have Just Received Your First Salary",
    description: "You started your first job and received your first salary — $1,500. Make financial decisions about how to use and grow your money wisely.",
    conclusion: "Managing money well means understanding the difference between saving, borrowing, and investing — and choosing the right financial products for each goal.",
    steps: [
      {
        situation: "You receive $1,500 as your first salary. The money is in your current account. You need to decide what to do with the money you don't need for monthly expenses.",
        context: "You have $800 left after bills. Where should it go?",
        vocabFocus: "current account",
        options: [
          { text: "Put $800 in a time deposit for 12 months at 6.5% interest.", vocabUsed: "time deposit", isOptimal: true, feedback: "Great choice! A time deposit earns significantly more interest than leaving the money in a current account. After 12 months you earn $52 — without any effort." },
          { text: "Leave all $800 in your current account.", vocabUsed: "demand deposit", isOptimal: false, feedback: "Your current account pays little or no interest. The money is safe but not growing. A time deposit would be smarter for money you don't need immediately." },
          { text: "Spend it all on new things immediately.", vocabUsed: "value", isOptimal: false, feedback: "Spending everything leaves you with no savings and no store of value for emergencies. Building financial safety is important from the first salary." }
        ]
      },
      {
        situation: "Your time deposit has matured. You earned $52 in interest. Now a friend asks you to lend them $500 with no agreement to repay.",
        context: "Money and personal relationships — a difficult mix.",
        vocabFocus: "loan",
        options: [
          { text: "Only lend if there is a clear agreement on when and how they will repay.", vocabUsed: "repay", isOptimal: true, feedback: "Correct approach! Any loan — personal or bank — should have a clear repayment agreement. Without one, you may lose both the money and the friendship." },
          { text: "Lend the money without any conditions. They are a friend.", vocabUsed: "borrow", isOptimal: false, feedback: "Without an agreement, there is no obligation to repay. Informal loans between friends often cause conflict. Treat personal loans professionally." },
          { text: "Refuse completely. Never lend money to friends.", vocabUsed: "interest", isOptimal: false, feedback: "Being cautious is wise, but refusing entirely may not be necessary. A written agreement can protect both sides. Compound interest exists for a reason — it formalises the cost of lending." }
        ]
      },
      {
        situation: "Your employer offers a bonus: invest $200 in company stocks or take the cash. The stock market has been rising, but is not guaranteed.",
        context: "Stocks vs cash — risk and reward.",
        vocabFocus: "stock",
        options: [
          { text: "Take half in stocks and half in cash — balance risk and reward.", vocabUsed: "near money", isOptimal: true, feedback: "Smart! Diversifying reduces risk. Stocks can grow, but cash keeps you flexible. Near money instruments balance both needs." },
          { text: "Take all $200 as company stock.", vocabUsed: "stock", isOptimal: false, feedback: "Stocks can rise — but they can also fall. Putting everything in one company stock is risky, especially if it is your employer. If the company struggles, you lose both your job and your investment." },
          { text: "Take all $200 in cash. Stocks are too risky.", vocabUsed: "monetary value", isOptimal: false, feedback: "Cash is safe but does not grow. In the long run, some stock investment usually outperforms cash savings. Some risk is worth taking." }
        ]
      },
      {
        situation: "You need a laptop for work — it costs $1,200. You have $800 saved. You can borrow $400 from the bank at 12% per year, or use your savings plus ask for an advance on next month's salary.",
        context: "Choosing the cheapest way to bridge a funding gap.",
        vocabFocus: "advance",
        options: [
          { text: "Ask your employer for a salary advance of $400 — usually interest-free.", vocabUsed: "advance", isOptimal: true, feedback: "Excellent! A salary advance is typically interest-free — you repay from next month's salary. This is significantly cheaper than a 12% bank loan." },
          { text: "Take a bank loan of $400 at 12% per year.", vocabUsed: "interest rate", isOptimal: false, feedback: "This works, but you pay 12% interest — about $48 for a one-year loan. A salary advance costs nothing. Always look for the cheapest option first." },
          { text: "Do not buy the laptop. Wait until you save enough.", vocabUsed: "store of value", isOptimal: false, feedback: "Patience is a virtue, but if the laptop is essential for work, delaying could cost you more (missed income, reduced performance). A salary advance solves the problem efficiently." }
        ]
      },
      {
        situation: "At year-end, your savings total $2,000. The bank promotes a 2-year time deposit at 7% compound interest. If you invest all $2,000, you will have $2,289.80 after 2 years.",
        context: "Understanding the power of compound interest.",
        vocabFocus: "compound interest",
        options: [
          { text: "Open the 2-year time deposit. Let compound interest work for you.", vocabUsed: "compound interest", isOptimal: true, feedback: "Perfect! $2,000 at 7% compound interest for 2 years = $2,289.80. You earn $289.80 for doing nothing. This is the power of compound interest." },
          { text: "Keep the money as a demand deposit. It is safer.", vocabUsed: "demand deposit", isOptimal: false, feedback: "A demand deposit is safe but earns very little (usually 0.5–1%). Over 2 years, you might earn $20 instead of $289. The opportunity cost is high." },
          { text: "Buy government bonds instead.", vocabUsed: "bond", isOptimal: false, feedback: "Not a bad option — bonds are safe. But the 7% time deposit rate is likely better than a standard government bond rate. Always compare interest rates before deciding." }
        ]
      }
    ]
  },

  media: [
    {
      mediaId: "u3_media_functions_of_money",
      localSrc: "/u3_functions_of_money.mp4",
      title: "Functions of Money",
      type: "video",
      source: "Educational Video",
      url: "",
      embedId: "",
      duration: "Video",
      description: "What money really is and the four core functions it performs in an economy: medium of exchange, store of value, unit of account, and standard of deferred payment. The video also explains why money is so much more efficient than barter.",
      whyHelps: "You will hear 'medium of exchange', 'store of value', 'unit of account', 'standard of deferred payment', and 'barter' used in a clear textbook-style explanation.",
      vocabToListen: ["medium of exchange", "store of value", "unit of account", "barter", "currency"],
      task: "After watching: list the four functions of money and give one real-life example of each.",
      predictionTask: [
        { type: "sentenceBuilder", q: "Before watching — build a sentence about what you think this video is about:", tiles: ["This", "video", "explains", "what", "money", "is", "and", "the", "four", "main", "functions", "it", "serves.", "banks", "loans", "interest", "bonds"], answer: ["This", "video", "explains", "what", "money", "is", "and", "the", "four", "main", "functions", "it", "serves."] },
        { type: "wordCheck", q: "Which words do you expect to hear? Tick all that apply.", options: ["medium of exchange", "store of value", "unit of account", "barter", "currency"] }
      ],
      postQuiz: [
        { type: "trueFalse", q: "Before money existed, people exchanged goods directly — this system is called barter.", answer: true, explanation: "Correct. Barter is direct exchange of one good or service for another, without using money as an intermediate step." },
        { type: "choice", q: "Which function of money allows you to save today and spend in the future?", options: ["Medium of exchange", "Unit of account", "Store of value", "Standard of measurement"], answer: "Store of value", explanation: "Store of value = money keeps its purchasing power over time, so you can defer consumption until later." },
        { type: "sentenceBuilder", q: "Build the sentence:", tiles: ["Money", "is", "a", "medium", "of", "exchange,", "a", "store", "of", "value,", "and", "a", "unit", "of", "account.", "barter", "stock", "bond"], answer: ["Money", "is", "a", "medium", "of", "exchange,", "a", "store", "of", "value,", "and", "a", "unit", "of", "account."] }
      ]
    },
    {
      mediaId: "u3_media_dollar_vs_pound",
      localSrc: "/u3_dollar_vs_pound.mp4",
      title: "Dollar vs Pound — Comparing the World's Currencies",
      type: "video",
      source: "Educational Video",
      url: "",
      embedId: "",
      duration: "Video",
      description: "A side-by-side comparison of the US dollar (USD) and the British pound (GBP): their history, current strength, exchange rate behaviour, purchasing power, and roles in global trade and reserves.",
      whyHelps: "You will hear 'exchange rate', 'reserve currency', 'purchasing power', 'inflation', and 'currency' used in real economic comparison.",
      vocabToListen: ["currency", "exchange rate", "fiat money", "monetary value", "reserve currency"],
      task: "After watching: explain in one sentence why the US dollar is the world's main reserve currency, and name one reason the pound is still globally important.",
      predictionTask: [
        { type: "sentenceBuilder", q: "Before watching — build a sentence about this video:", tiles: ["This", "video", "compares", "the", "British", "pound", "and", "the", "US", "dollar", "as", "global", "currencies.", "barter", "loans", "deposits"], answer: ["This", "video", "compares", "the", "British", "pound", "and", "the", "US", "dollar", "as", "global", "currencies."] },
        { type: "wordCheck", q: "Which words do you expect to hear?", options: ["exchange rate", "reserve currency", "inflation", "purchasing power", "trade"] }
      ],
      postQuiz: [
        { type: "trueFalse", q: "The US dollar is the most widely held reserve currency in the world.", answer: true, explanation: "Correct. Central banks around the world hold the largest share of their reserves in US dollars, making it the dominant reserve currency." },
        { type: "choice", q: "What does 'exchange rate' mean?", options: ["The interest rate set by the central bank", "The price of one currency in terms of another", "The cost of sending money abroad", "The total money supply"], answer: "The price of one currency in terms of another", explanation: "An exchange rate tells you how many units of one currency you need to buy one unit of another — e.g. 1 GBP = 1.27 USD." },
        { type: "sentenceBuilder", q: "Build the sentence:", tiles: ["The", "exchange", "rate", "between", "the", "dollar", "and", "the", "pound", "changes", "every", "day.", "weekly", "barter", "bond"], answer: ["The", "exchange", "rate", "between", "the", "dollar", "and", "the", "pound", "changes", "every", "day."] }
      ]
    },
    {
      mediaId: "u3_media_bank_accounts",
      localSrc: "/u3_bank_accounts.mp4",
      title: "Types of Bank Accounts — Checking, Savings, MMA, CD",
      type: "video",
      source: "Educational Video",
      url: "",
      embedId: "",
      duration: "Video",
      description: "An overview of the four main types of personal bank accounts: checking, savings, money market accounts and certificates of deposit (CDs). When to use each, what they pay in interest, and what restrictions apply.",
      whyHelps: "You will hear 'checking account', 'savings account', 'interest rate', 'withdraw', 'deposit', and 'certificate of deposit' explained with practical examples.",
      vocabToListen: ["demand deposit", "time deposit", "interest rate", "near money", "money supply"],
      task: "After watching: choose which type of account would be best for an emergency fund, and explain why.",
      predictionTask: [
        { type: "sentenceBuilder", q: "Before watching — build a sentence about this video:", tiles: ["This", "video", "explains", "the", "main", "types", "of", "bank", "accounts", "and", "when", "to", "use", "each.", "stocks", "bonds", "barter"], answer: ["This", "video", "explains", "the", "main", "types", "of", "bank", "accounts", "and", "when", "to", "use", "each."] },
        { type: "wordCheck", q: "Which words do you expect to hear?", options: ["checking", "savings", "interest rate", "withdraw", "deposit"] }
      ],
      postQuiz: [
        { type: "trueFalse", q: "A savings account usually pays a higher interest rate than a checking account.", answer: true, explanation: "Correct. Checking accounts are designed for everyday transactions and pay little or no interest; savings accounts reward you for keeping your money in place." },
        { type: "choice", q: "Which account is BEST suited to daily expenses and frequent withdrawals?", options: ["Certificate of deposit", "Money market account", "Checking account", "Time deposit"], answer: "Checking account", explanation: "A checking (demand) account allows unlimited withdrawals without penalty — ideal for daily spending." },
        { type: "sentenceBuilder", q: "Build the sentence:", tiles: ["A", "certificate", "of", "deposit", "pays", "higher", "interest", "but", "locks", "your", "money", "for", "a", "fixed", "term.", "free", "lower", "bonus"], answer: ["A", "certificate", "of", "deposit", "pays", "higher", "interest", "but", "locks", "your", "money", "for", "a", "fixed", "term."] }
      ]
    },
    {
      mediaId: "u3_media_basics_of_loans",
      localSrc: "/u3_basic_of_loans.mp4",
      title: "The Basics of Loans — Borrowing Money Responsibly",
      type: "video",
      source: "Educational Video",
      url: "",
      embedId: "",
      duration: "Video",
      description: "How loans work, what types exist (student, personal, secured), the role of interest rates and credit scores, and the risks of taking on too much debt.",
      whyHelps: "You will hear 'loan', 'principal', 'interest rate', 'credit score', 'secured loan', and 'repay' explained with realistic borrower examples.",
      vocabToListen: ["loan", "interest rate", "principal", "repay", "compound interest"],
      task: "After watching: explain the difference between the principal and the interest of a loan, and name one risk of borrowing too much.",
      predictionTask: [
        { type: "sentenceBuilder", q: "Before watching — build a sentence about this video:", tiles: ["This", "video", "explains", "how", "loans", "work", "and", "the", "role", "of", "interest", "rates.", "currency", "barter", "deposit"], answer: ["This", "video", "explains", "how", "loans", "work", "and", "the", "role", "of", "interest", "rates."] },
        { type: "wordCheck", q: "Which words do you expect to hear?", options: ["loan", "interest", "principal", "credit score", "debt"] }
      ],
      postQuiz: [
        { type: "trueFalse", q: "The principal of a loan is the original amount you borrow, before any interest is added.", answer: true, explanation: "Correct. Principal = the original sum. Interest is what the lender charges on top of it." },
        { type: "choice", q: "What is most likely to happen if you fail to repay a loan on time?", options: ["The bank will forget about it", "Your credit score will fall and penalties may be added", "You receive a discount on the principal", "The loan disappears after one year"], answer: "Your credit score will fall and penalties may be added", explanation: "Missed payments lower your credit score and usually trigger late fees and higher interest — making the debt harder to escape." },
        { type: "sentenceBuilder", q: "Build the sentence:", tiles: ["The", "borrower", "must", "repay", "the", "principal", "plus", "interest", "over", "the", "term", "of", "the", "loan.", "free", "deposit", "barter"], answer: ["The", "borrower", "must", "repay", "the", "principal", "plus", "interest", "over", "the", "term", "of", "the", "loan."] }
      ]
    }
  ],

  totalTest: {
    title: "TOTAL TEST — Unit 3: Money & Banking",
    parts: [
      {
        id: "tt3_a",
        title: "Part A — Match the Word with its Definition",
        type: "match",
        instruction: "Match each banking term with the correct definition. This tests your understanding of meaning, not just translation.",
        pairs: [
          { en: "loan",              ru: "a sum of money borrowed from a bank, to be repaid with interest over time" },
          { en: "deposit",           ru: "money placed into a bank account for safekeeping" },
          { en: "compound interest", ru: "interest calculated on the original amount and on interest already earned" },
          { en: "fiat money",        ru: "money that has value because the government declares it legal tender" },
          { en: "money supply",      ru: "the total amount of money available in an economy" },
          { en: "near money",        ru: "assets that are not cash but can be quickly converted into cash" },
          { en: "interest rate",     ru: "the percentage charged on a loan or paid on a savings deposit" },
          { en: "bond",              ru: "a financial instrument where you lend money to a government or company for a fixed term" },
          { en: "demand deposit",    ru: "a bank deposit that can be withdrawn at any time without advance notice" },
          { en: "time deposit",      ru: "a bank deposit held for a fixed period, earning higher interest" },
          { en: "currency",          ru: "the system of money officially used in a country" },
          { en: "advance notice",    ru: "a formal warning given before an action, such as withdrawing from a fixed account" }
        ]
      },
      {
        id: "tt3_b",
        title: "Part B — Match the Concept",
        type: "match",
        instruction: "Match each money function with the correct definition.",
        pairs: [
          { en: "means of exchange",  ru: "money's function as the accepted medium for buying and selling goods and services" },
          { en: "store of value",     ru: "money's ability to retain its worth over time, allowing future use" },
          { en: "standard of value",  ru: "money's role as a common unit for measuring and comparing prices" },
          { en: "monetary value",     ru: "the worth of something expressed as an amount of money" },
          { en: "stock",              ru: "a share representing part ownership in a company, traded on a market" },
          { en: "repay a loan",       ru: "to pay back borrowed money, usually with interest, over time" },
          { en: "borrow",             ru: "to take money from a bank or person with an agreement to return it" },
          { en: "promote",            ru: "to actively advertise or support a product, service, or idea to increase its success" }
        ]
      },
      {
        id: "tt3_c",
        title: "Part C — True or False",
        type: "trueFalse",
        instruction: "Read each statement carefully. Some are almost correct but contain a key inaccuracy. Decide: TRUE or FALSE?",
        items: [
          { statement: "Compound interest charges the same amount each year on the original sum — it does not grow.", answer: false, explanation: "Compound interest grows each year because it is calculated on the principal AND on interest already earned — unlike simple interest." },
          { statement: "A demand deposit and a time deposit both require advance notice before withdrawal.", answer: false, explanation: "Only a time deposit requires advance notice. A demand deposit can be withdrawn at any time without any notice." },
          { statement: "The money supply includes physical cash, coins, and bank account balances.", answer: true, explanation: "Correct — the money supply is all forms of money in the economy: notes, coins, and deposits in bank accounts." },
          { statement: "A bond is a form of near money because it can be converted to cash relatively quickly.", answer: true, explanation: "Correct — bonds are a classic example of near money: not cash, but liquid enough to be converted to cash when needed." },
          { statement: "Fiat money has value because it is backed by an equivalent amount of gold in a national reserve.", answer: false, explanation: "Fiat money has value purely by government decree. Since 1971 (when the US left the gold standard), most currencies are not backed by gold." },
          { statement: "A checking account (US) and a current account (UK) serve the same everyday purpose in different countries.", answer: true, explanation: "Correct — they are regional names for the same type of account used for day-to-day banking (salary, bills, transactions)." }
        ]
      },
      {
        id: "tt3_d",
        title: "Part D — Fill in the Gaps",
        type: "fillGap",
        instruction: "Read the paragraph carefully and fill in each gap with the correct word from the box. There are 2 extra words you will not need.",
        wordBank: ["borrow", "loan", "compound interest", "repay", "interest rate", "principal", "time deposit", "demand deposit", "currency", "fiat money", "money supply", "advance notice", "near money", "promote", "stock"],
        items: [
          { sentence: "Arthur decided to ______ $15,000 from the bank to purchase a second-hand car.", answer: "borrow", explanation: "Borrow = to take money from a bank with an obligation to return it." },
          { sentence: "The ______ on his personal loan was fixed at 8.5% per year.", answer: "interest rate", explanation: "Interest rate = the percentage charged on a loan or paid on a deposit." },
          { sentence: "Because the bank used ______, Arthur paid interest not just on the $15,000 but also on the interest already charged.", answer: "compound interest", explanation: "Compound interest = interest on both the principal and previously accrued interest." },
          { sentence: "The original amount Arthur borrowed — the ______ — was $15,000.", answer: "principal", explanation: "Principal = the original sum borrowed, before any interest is added." },
          { sentence: "He signed an agreement to ______ the full amount within five years.", answer: "repay", explanation: "Repay = to pay back borrowed money." },
          { sentence: "The bank uses the ______ to manage how much money circulates in the economy.", answer: "money supply", explanation: "Money supply = total money available in the economy, controlled by the central bank." },
          { sentence: "A savings account is classified as ______ because it can be quickly converted to cash.", answer: "near money", explanation: "Near money = liquid assets close to cash but not cash itself." },
          { sentence: "To withdraw from a fixed-term account early, you must give 30 days' ______ to the bank.", answer: "advance notice", explanation: "Advance notice = formal notification given before an action." },
          { sentence: "The government's ______ is legal tender — it has value because the state declares it so.", answer: "fiat money", explanation: "Fiat money = money with value by government decree, not backed by a physical commodity." },
          { sentence: "The bank plans to ______ its new mobile app by offering a bonus interest rate for new users.", answer: "promote", explanation: "Promote = to advertise or actively support a product or service." }
        ]
      },
      {
        id: "tt3_e",
        title: "Part E — Choose the Best Answer",
        type: "multipleChoice",
        instruction: "Choose the correct answer for each question.",
        items: [
          {
            sentence: "What is the key difference between a time deposit and a demand deposit?",
            options: ["A time deposit pays lower interest", "A time deposit cannot be used for savings", "A time deposit must be held for a fixed period before withdrawal", "A demand deposit earns compound interest"],
            answer: "A time deposit must be held for a fixed period before withdrawal"
          },
          {
            sentence: "Money's function as a 'store of value' means that:",
            options: ["You can use it to buy goods immediately", "It allows you to compare prices of different items", "It retains its worth over time so you can save and use it later", "It can be printed by any individual"],
            answer: "It retains its worth over time so you can save and use it later"
          },
          {
            sentence: "If you borrow $10,000 at 10% compound interest for 2 years, you owe approximately:",
            options: ["$10,000", "$11,000", "$12,000", "$12,100"],
            answer: "$12,100",
            explanation: "Year 1: $10,000 × 1.10 = $11,000. Year 2: $11,000 × 1.10 = $12,100."
          },
          {
            sentence: "Why is a savings account described as 'near money' rather than 'money'?",
            options: ["Because it earns interest", "Because it cannot be opened without a loan", "Because it is not cash but can be quickly converted to cash", "Because it uses fiat currency"],
            answer: "Because it is not cash but can be quickly converted to cash"
          },
          {
            sentence: "The central bank decides to reduce the money supply. What is the most likely effect?",
            options: ["Inflation increases", "Borrowing becomes cheaper", "Interest rates fall", "Borrowing becomes more expensive and inflation slows"],
            answer: "Borrowing becomes more expensive and inflation slows"
          }
        ]
      }
    ]
  },

  moneyCompass: [
    {
      id: 'means_of_exchange',
      title: 'Means of exchange',
      titleRu: 'Средство обмена',
      definition: 'Money is used to pay for goods and services instead of barter. It makes trade possible between any two people — even when they have nothing the other party wants directly.',
      definitionRu: 'Деньги используются для оплаты товаров и услуг вместо бартера. Они делают торговлю возможной между любыми двумя людьми — даже если у них нет ничего, что нужно друг другу напрямую.',
      example: "Jane pays $50 at the supermarket. Money is the medium — the store doesn't need to want anything Jane owns in return. Trade happens instantly.",
      exampleRu: 'Джейн платит $50 в супермаркете. Деньги — посредник: магазину не нужно хотеть что-то из вещей Джейн. Обмен происходит мгновенно.',
      icon: 'ArrowRightLeft',
    },
    {
      id: 'store_of_value',
      title: 'Store of value',
      titleRu: 'Средство сбережения',
      definition: 'Money keeps its purchasing power over time, allowing you to save today and spend in the future. Unlike perishable goods, money does not lose its value while you hold it.',
      definitionRu: 'Деньги сохраняют покупательную способность со временем, позволяя копить сегодня и тратить в будущем. В отличие от скоропортящихся товаров, деньги не теряют ценности, пока вы их держите.',
      example: "Jane puts $15 into her savings account in January. In July she withdraws it and can still buy the same things — the money has kept its value.",
      exampleRu: 'Джейн кладёт $15 на сберегательный счёт в январе. В июле она снимает их и по-прежнему может купить то же самое — деньги сохранили свою ценность.',
      icon: 'PiggyBank',
    },
    {
      id: 'standard_of_value',
      title: 'Standard of value',
      titleRu: 'Мера стоимости',
      definition: 'Money provides a single unit of measurement that lets us compare the value of completely different things — from a cup of coffee to a car to an hour of work.',
      definitionRu: 'Деньги дают единую единицу измерения, которая позволяет сравнивать ценность совершенно разных вещей — от чашки кофе до автомобиля и часа работы.',
      example: "A car costs $30,000 and a phone costs $600. Money lets us say the car is exactly 50 times more valuable — without needing to compare them any other way.",
      exampleRu: 'Автомобиль стоит $30,000, телефон — $600. Деньги позволяют сказать, что машина ровно в 50 раз дороже — без какого-либо другого способа сравнения.',
      icon: 'BarChart3',
    },
    {
      id: 'near_money',
      title: 'Near money',
      titleRu: 'Квазиденьги',
      definition: 'Assets that are almost as liquid as cash — savings accounts, bonds, and time deposits. They are not cash themselves but can be quickly and easily converted into cash.',
      definitionRu: 'Активы, почти такие же ликвидные, как наличные: сберегательные счета, облигации, срочные вклады. Сами по себе не деньги, но легко и быстро конвертируются в наличные.',
      example: "A demand deposit in a bank is 'near money' — you can withdraw it any working day, use it at an ATM, and spend it like cash. It is part of the broader money supply.",
      exampleRu: 'Депозит до востребования в банке — это «квазиденьги»: его можно снять в любой рабочий день, использовать в банкомате и тратить как наличные. Он входит в широкую денежную массу.',
      icon: 'CreditCard',
    },
  ],

  worldBankingMap: {
    intro: "Banking systems differ around the world. Click any highlighted country to see how its central bank, currency, and banking culture work.",
    introRu: "Банковские системы разных стран устроены по-разному. Нажмите на выделенную страну, чтобы узнать про её центральный банк, валюту и банковскую культуру.",
    // CDN-hosted TopoJSON of world countries (110m resolution)
    geoUrl: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
    // Each entry highlights either a single country (isoCodes: [one code])
    // or a bloc such as the EU (isoCodes: [many codes]).
    countries: [
      {
        id: 'uk',
        flag: '🇬🇧',
        name: 'United Kingdom',
        nameRu: 'Великобритания',
        isoCodes: ['826'],
        centralBank: 'Bank of England',
        currency: 'Pound sterling (£)',
        mainAccounts: 'Current, deposit, savings',
        narrative: '90% of British adults have a bank account. Households save about 15% of their income; roughly 20% of the population own shares. Post Office banking is widespread — almost every village has a branch. The system is described as stable, extensive and complex.',
        narrativeRu: '90% взрослых британцев имеют банковский счёт. Семьи откладывают около 15% дохода, 20% населения владеют акциями. Банковские услуги через Почту работают почти в каждой деревне. Система — стабильная, обширная, сложная.',
      },
      {
        id: 'us',
        flag: '🇺🇸',
        name: 'United States',
        nameRu: 'США',
        isoCodes: ['840'],
        centralBank: 'Federal Reserve (Fed)',
        currency: 'US dollar ($)',
        mainAccounts: 'Checking, savings, time deposit, CD',
        narrative: 'The Fed is a system of 12 regional banks coordinated from Washington DC. Americans rely heavily on credit cards and personal loans. The cheque (check) remains a daily payment tool. Most households hold both a checking and a savings account; time deposits (CDs) are popular for retirement.',
        narrativeRu: 'ФРС — система из 12 региональных банков с координацией в Вашингтоне. Американцы активно используют кредитные карты и потребительские кредиты. Чек до сих пор — повседневный способ оплаты. Срочные вклады (CD) популярны для пенсионных накоплений.',
      },
      {
        id: 'eu',
        flag: '🇪🇺',
        name: 'European Union',
        nameRu: 'Европейский Союз',
        // All 27 EU member states by ISO numeric code — highlighted as a bloc
        isoCodes: [
          '040', '056', '100', '191', '196', '203', '208', '233', '246', '250',
          '276', '300', '348', '372', '380', '428', '440', '442', '470', '528',
          '616', '620', '642', '703', '705', '724', '752',
        ],
        centralBank: 'European Central Bank (ECB), Frankfurt',
        currency: 'Euro (€) — used by 20 of 27 EU states',
        mainAccounts: 'Girokonto · Compte courant · Conto corrente',
        narrative: '27 countries, one central bank for the 20 that use the euro. The ECB sets a single key interest rate that applies from Lisbon to Helsinki. National central banks (Bundesbank, Banque de France, Banca d\'Italia) keep their names but follow ECB policy. Banking culture varies: Germans prefer cash, French use Livret A savings accounts, Estonians lead in digital banking.',
        narrativeRu: '27 стран, один центральный банк для тех 20, что используют евро. ЕЦБ устанавливает единую ключевую ставку — она действует от Лиссабона до Хельсинки. Национальные ЦБ сохраняют названия (Bundesbank, Banque de France), но выполняют политику ЕЦБ. Культура разная: немцы предпочитают наличные, французы — сберегательные счета Livret A, эстонцы — лидеры цифрового банкинга.',
      },
      {
        id: 'ru',
        flag: '🇷🇺',
        name: 'Russia',
        nameRu: 'Россия',
        isoCodes: ['643'],
        centralBank: 'Bank of Russia (ЦБ РФ)',
        currency: 'Ruble (₽)',
        mainAccounts: 'Текущий счёт, депозит, вклад',
        narrative: 'The Bank of Russia sets the key rate that drives all bank interest rates. Sberbank dominates the retail market with the largest branch network. Mobile banking adoption is very high — SBP instant transfers between any banks work 24/7. Time deposits (вклады) are popular when rates are high.',
        narrativeRu: 'Банк России задаёт ключевую ставку, от которой пляшут все банковские проценты. Сбербанк доминирует в рознице с крупнейшей сетью отделений. Уровень мобильного банкинга очень высокий — СБП обеспечивает мгновенные переводы между любыми банками 24/7. При высоких ставках популярны вклады.',
      },
      {
        id: 'cn',
        flag: '🇨🇳',
        name: 'China',
        nameRu: 'Китай',
        isoCodes: ['156'],
        centralBank: "People's Bank of China (PBoC)",
        currency: 'Yuan / Renminbi (¥, CNY)',
        mainAccounts: 'Demand, fixed-term, structured deposits',
        narrative: 'The PBoC operates under direct state guidance — monetary policy is closely coordinated with the government. Four state-owned giants (ICBC, CCB, ABC, BOC) hold most household savings. Cash is almost extinct in cities: Alipay and WeChat Pay dominate everyday payments. The digital yuan (e-CNY) is being rolled out as the world\'s first state-backed digital currency.',
        narrativeRu: 'Народный банк Китая работает под прямым контролем государства — денежная политика тесно скоординирована с правительством. Четыре госбанка (ICBC, CCB, ABC, BOC) держат большинство депозитов населения. Наличные в городах почти исчезли: повсюду Alipay и WeChat Pay. Цифровой юань (e-CNY) разворачивается как первая в мире государственная цифровая валюта.',
      },
      {
        id: 'jp',
        flag: '🇯🇵',
        name: 'Japan',
        nameRu: 'Япония',
        isoCodes: ['392'],
        centralBank: 'Bank of Japan',
        currency: 'Yen (¥)',
        mainAccounts: 'Futsuu kouza, Teiki kouza',
        narrative: 'Japan has had near-zero interest rates for decades — saving in a bank earns almost nothing. Cash is still king in everyday transactions; many small shops do not accept cards. Japan Post Bank is the largest financial institution by deposits, operating from every post office. In 2024 the Bank of Japan ended its negative-rate policy for the first time in 17 years.',
        narrativeRu: 'В Японии ставки около нуля десятилетиями — вклад в банке почти ничего не приносит. Наличные по-прежнему правят в повседневных расчётах, многие магазины не принимают карты. Japan Post Bank — крупнейший по депозитам, работает в каждом почтовом отделении. В 2024 году Банк Японии впервые за 17 лет отменил отрицательную ставку.',
      },
      {
        id: 'ch',
        flag: '🇨🇭',
        name: 'Switzerland',
        nameRu: 'Швейцария',
        isoCodes: ['756'],
        centralBank: 'Swiss National Bank (SNB)',
        currency: 'Swiss franc (CHF)',
        mainAccounts: 'Privatkonto, Sparkonto, Säule 3a',
        narrative: 'Switzerland is famous for banking secrecy and stability — though the secrecy was largely dismantled after international pressure in the 2010s. Two giants (UBS and Credit Suisse, merged in 2023) dominate global wealth management. The Swiss franc is a "safe-haven" currency: investors buy it when the world looks risky. The SNB famously held its policy rate negative from 2015 to 2022.',
        narrativeRu: 'Швейцария знаменита банковской тайной и стабильностью — хотя сама тайна была во многом отменена под международным давлением в 2010-х. Два гиганта (UBS и Credit Suisse, объединившиеся в 2023) доминируют в управлении капиталом по всему миру. Швейцарский франк — «защитная» валюта: инвесторы скупают его, когда в мире становится тревожно. ШНБ держал отрицательную ставку с 2015 по 2022.',
      },
    ],
  },

  centralBankWheel: {
    intro: "A central bank is not like a regular commercial bank — it is the bank that controls the country's money. It performs six core functions.",
    introRu: "Центральный банк — не обычный коммерческий банк. Он контролирует деньги всей страны и выполняет шесть основных функций.",
    functions: [
      {
        id: 'issue_currency',
        title: 'Issue currency',
        titleRu: 'Эмитировать деньги',
        icon: 'Banknote',
        description: 'Print banknotes and mint coins. Only the central bank can legally create new physical money for the country.',
        descriptionRu: 'Печатать банкноты и чеканить монеты. Только центральный банк может законно выпускать новые наличные.',
        example: 'The Bank of England prints all the pound notes you spend.',
        exampleRu: 'Банк России выпускает все рублёвые банкноты и монеты — на банкнотах изображён герб ЦБ. Никакая другая организация в стране не имеет права чеканить рубль.',
      },
      {
        id: 'control_supply',
        title: 'Control money supply',
        titleRu: 'Контролировать денежную массу',
        icon: 'Gauge',
        description: 'Increase or decrease how much money is circulating in the economy — through reserve requirements and open-market operations.',
        descriptionRu: 'Увеличивать или уменьшать объём денег в обращении — через резервные требования и операции на открытом рынке.',
        example: 'When inflation rises, the central bank reduces the money supply to slow it down.',
        exampleRu: 'Через ключевую ставку Банк России регулирует, сколько денег в экономике. В феврале 2022 ставка была резко поднята до 20%, чтобы остановить отток рублей и сбить инфляцию.',
      },
      {
        id: 'monetary_policy',
        title: 'Implement monetary policy',
        titleRu: 'Проводить денежно-кредитную политику',
        icon: 'Activity',
        description: 'Set the key interest rate to influence borrowing, spending, and inflation across the whole economy.',
        descriptionRu: 'Устанавливать ключевую ставку для влияния на кредиты, расходы и инфляцию в экономике.',
        example: 'If the Fed raises rates, mortgages and business loans become more expensive.',
        exampleRu: 'Банк России решает уровень ключевой ставки 8 раз в год. Подняв её, ЦБ делает кредиты дороже — спрос замедляется, инфляция остывает.',
      },
      {
        id: 'last_resort',
        title: 'Lender of last resort',
        titleRu: 'Кредитор последней инстанции',
        icon: 'LifeBuoy',
        description: 'Lend money to commercial banks that are short of cash, preventing a panic from spreading through the financial system.',
        descriptionRu: 'Выдавать кредиты коммерческим банкам в кризис, предотвращая распространение паники по финансовой системе.',
        example: 'In the 2008 crisis, central banks lent trillions to keep banks open.',
        exampleRu: 'Во время паники 2008 и 2022 годов Банк России выдавал банкам стабилизационные кредиты под залог ценных бумаг, чтобы предотвратить волну банкротств.',
      },
      {
        id: 'supervise',
        title: 'Supervise banking system',
        titleRu: 'Надзор за банковской системой',
        icon: 'ShieldCheck',
        description: 'Inspect commercial banks, enforce rules, and make sure customer deposits are safe.',
        descriptionRu: 'Проверять коммерческие банки, контролировать правила и защищать вклады клиентов.',
        example: 'The Bank of Russia revokes licences from banks that break the rules.',
        exampleRu: 'С 2013 года Банк России отозвал более 400 банковских лицензий. Вкладчики получают компенсации через АСВ — Агентство страхования вкладов.',
      },
      {
        id: 'reserves',
        title: 'Impose reserve requirements',
        titleRu: 'Резервные требования',
        icon: 'Lock',
        description: 'Force commercial banks to keep a fixed percentage of customer deposits in reserve — money they cannot lend out.',
        descriptionRu: 'Обязывать банки держать фиксированный процент депозитов в резерве — деньги, которые нельзя выдавать в кредит.',
        example: 'If reserve requirement is 10%, a bank with $1B in deposits must keep $100M unused.',
        exampleRu: 'Норматив обязательных резервов в РФ — около 4–5%. Если банк собрал у клиентов 100 млрд рублей вкладов, 4–5 млрд должны лежать на счёте в Банке России, а не работать в кредитах.',
      },
    ],
    examples: [
      { flag: '🇬🇧', name: 'Bank of England',  country: 'United Kingdom', currency: '£' },
      { flag: '🇺🇸', name: 'Federal Reserve',  country: 'United States',  currency: '$' },
      { flag: '🇩🇪', name: 'Bundesbank / ECB', country: 'Germany / EU',   currency: '€' },
      { flag: '🇷🇺', name: 'Bank of Russia',   country: 'Russia',         currency: '₽' },
    ],
  },

  moneyForms: {
    intro: "Money has taken many forms through history. Click each era to see what people used and why it changed.",
    introRu: "Деньги принимали разные формы в истории. Нажмите на эпоху, чтобы увидеть, что использовали люди и почему всё менялось.",
    eras: [
      {
        id: 'barter',
        label: 'Barter',
        labelRu: 'Бартер',
        era: 'pre-3000 BC',
        description: 'No money at all — people exchanged goods directly. You wanted bread, the baker wanted shoes, you traded.',
        descriptionRu: 'Денег нет — обмен товарами напрямую. Хочешь хлеб, пекарь хочет обувь — обмен.',
        why: 'Worked for small villages, but failed at scale: you had to find someone who wanted EXACTLY what you offered.',
        vocab: ['exchange'],
        icon: 'Repeat2',
      },
      {
        id: 'commodity',
        label: 'Commodity money',
        labelRu: 'Товарные деньги',
        era: 'cattle, shells',
        description: 'Objects with their own value used as money: cattle, salt, shells, tobacco, even slaves.',
        descriptionRu: 'Предметы со своей собственной ценностью: скот, соль, ракушки, табак.',
        why: 'Hard to carry, hard to divide, and the supply was unpredictable.',
        vocab: ['monetary value', 'means of exchange'],
        icon: 'Wheat',
      },
      {
        id: 'metal',
        label: 'Metal coins',
        labelRu: 'Металлические монеты',
        era: 'gold & silver',
        description: 'Gold and silver coins — small, durable, and valuable on their own. The textbook calls these "a favorite form of money".',
        descriptionRu: 'Золотые и серебряные монеты — маленькие, прочные, с собственной ценностью.',
        why: 'But mining limited supply, and carrying gold across borders was dangerous.',
        vocab: ['currency', 'monetary value', 'standard of value'],
        icon: 'Coins',
      },
      {
        id: 'paper',
        label: 'Paper notes',
        labelRu: 'Бумажные деньги',
        era: '17th c. →',
        description: 'Paper banknotes backed by gold reserves at the central bank. Easy to carry, easy to print, easy to count.',
        descriptionRu: 'Бумажные банкноты, обеспеченные золотом в банке. Удобно переносить и считать.',
        why: 'Worked while gold backed the paper — but governments printed too much, and the gold standard collapsed.',
        vocab: ['currency', 'legal tender'],
        icon: 'Banknote',
      },
      {
        id: 'fiat',
        label: 'Fiat money',
        labelRu: 'Фиатные деньги',
        era: '1971 →',
        description: 'Money whose value comes from government decree, not from gold. Modern dollars, euros, and roubles are all fiat money.',
        descriptionRu: 'Деньги, ценность которых установлена государством, а не золотом. Современные доллары, евро, рубли — фиатные.',
        why: 'Flexible: central banks can adjust the money supply. Risky: if trust in government drops, the money loses value.',
        vocab: ['fiat money', 'legal tender', 'money supply'],
        icon: 'Landmark',
      },
      {
        id: 'digital',
        label: 'Digital money',
        labelRu: 'Цифровые деньги',
        era: 'cards, apps',
        description: 'Money that exists only as numbers in bank computers — debit cards, mobile payments, online transfers.',
        descriptionRu: 'Деньги существуют только как цифры в компьютерах банка — карты, мобильные платежи, переводы.',
        why: 'Most modern money is digital. Cash is becoming rare for large transactions.',
        vocab: ['near money', 'demand deposit'],
        icon: 'CreditCard',
      },
      {
        id: 'crypto',
        label: 'Crypto',
        labelRu: 'Криптовалюты',
        era: '2009 →',
        description: 'Bitcoin and other cryptocurrencies — money issued by computer networks, not by governments.',
        descriptionRu: 'Биткоин и другие криптовалюты — деньги, выпускаемые компьютерными сетями, а не государством.',
        why: 'Decentralised and global. But values fluctuate wildly and most economies do not accept them as legal tender.',
        vocab: ['currency', 'monetary value'],
        icon: 'Bitcoin',
      },
    ],
  },

  crossword: {
    words: [
      // ACROSS — verified intersections at (0,4)=S, (2,4)=O, (4,4)=K, (4,1)=B, (5,1)=O
      { number: 1, word: 'DEPOSIT',  dir: 'across', row: 0,  col: 0, clue: 'Money you put into a bank account.',                          clueRu: 'Сумма, которую вы вносите на банковский счёт.' },
      { number: 2, word: 'LOAN',     dir: 'across', row: 2,  col: 3, clue: 'Money borrowed from a bank that must be repaid.',             clueRu: 'Деньги, взятые в банке, которые нужно вернуть.' },
      { number: 3, word: 'BANK',     dir: 'across', row: 4,  col: 1, clue: 'An institution that keeps your money and gives loans.',       clueRu: 'Учреждение, которое хранит деньги и выдаёт кредиты.' },
      { number: 4, word: 'BOND',     dir: 'across', row: 5,  col: 0, clue: 'A loan made by an investor to a company or government.',      clueRu: 'Облигация — заём инвестора компании или государству.' },
      { number: 5, word: 'CURRENCY', dir: 'across', row: 11, col: 0, clue: 'The money system of a country — like the dollar or pound.',  clueRu: 'Валюта — денежная система страны.' },
      // DOWN
      { number: 6, word: 'STOCK',    dir: 'down',   row: 0,  col: 4, clue: 'A share of ownership in a company.',                          clueRu: 'Акция — доля владения в компании.' },
      { number: 7, word: 'BORROW',   dir: 'down',   row: 4,  col: 1, clue: 'To take money you must give back later.',                     clueRu: 'Брать в долг — деньги нужно будет вернуть.' },
      { number: 8, word: 'VALUE',    dir: 'down',   row: 5,  col: 5, clue: 'How much something is worth in money.',                       clueRu: 'Стоимость — сколько что-то стоит в деньгах.' },
    ]
  },
};