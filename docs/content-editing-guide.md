# Гайд по редактированию контента курса Adaptation

Документ описывает, **как менять любые тексты, видео, упражнения и
интерактивы** в курсе. Везде даны пути к файлам, шаблоны полей и
пошаговые инструкции.

> Главный принцип: **всё содержимое юнитов хранится в
> `src/data/unit1.js` … `src/data/unit4.js`**. Чтобы внести правку,
> нужно отредактировать соответствующий файл, закоммитить и запушить —
> Vercel пересоберёт и выложит на прод за 1–2 минуты.

---

## 1. Где что лежит

| Что | Файл |
|-----|------|
| Контент Unit 1 (Markets & Monopolies) | `src/data/unit1.js` |
| Контент Unit 2 (Growth & Labour) | `src/data/unit2.js` |
| Контент Unit 3 (Money & Banking) | `src/data/unit3.js` |
| Контент Unit 4 (Measuring the Economy) | `src/data/unit4.js` |
| Реестр юнитов | `src/data/courseData.js` |
| Реестр секций (как они рендерятся) | `src/components/unit/sectionRegistry.js` |
| Видео (MP4) | `public/u<N>_<name>.mp4` |
| Аудио | `public/audio/` |
| Welcome-страница | `src/pages/Landing.jsx` |
| Sidebar и шапка | `src/components/Layout.jsx` |

---

## 2. Структура файла юнита

Каждый файл `unit<N>.js` экспортирует один объект со следующими
крупными секциями:

```js
export const unit3 = {
  id: 3,
  title: 'Money and Banking',
  subtitle: '...',
  description: '...',
  descriptionRu: '...',

  // Порядок отображения секций в навигации и на странице
  sections: ['header', 'keyideas', 'dictionary', 'moneycompass', ...],

  // Ключевые идеи юнита (Key Ideas)
  keyIdeas: [...],

  // Словарь (Dictionary)
  vocabulary: [...],

  // Комиксы
  comics: [...],

  // Упражнения
  exercises: [...],

  // Текст для чтения
  reading: { ... },

  // Вопросы на понимание
  comprehension: [...],

  // Видео для Media Lab
  media: [...],

  // Диалог
  dialogue: { ... },

  // Письменное задание
  writing: { ... },

  // Сценарий (Scenario Loop)
  scenario: { ... },

  // Кроссворд
  crossword: { ... },

  // Итоговый тест
  totalTest: { ... },

  // Специфичные интерактивные секции
  moneyCompass: [...],
  loanSimulator: { ... },
  // и т.д.
};
```

---

## 3. Как поменять видео в Media Lab

### Шаг 1. Положить файл в public

Скопируй MP4-файл в директорию `public/` с понятным именем по шаблону
`u<unit>_<name>.mp4`:

```
public/u3_new_video.mp4
```

> **Размер:** до ~50 МБ на файл. Если больше — стоит переэнкодить в
> H.264 с битрейтом ~2 Mbps (можно через HandBrake или ffmpeg).

### Шаг 2. Прописать в `unit<N>.js` → media

Открой соответствующий `src/data/unit<N>.js`, найди секцию `media: [`
и добавь/замени блок:

```js
{
  mediaId: "u3_media_new_topic",        // уникальный ID — важно для прогресса
  localSrc: "/u3_new_video.mp4",        // путь от public (с /)
  title: "Новое название видео",
  type: "video",
  source: "Educational Video",
  url: "",                              // оставь пустым если нет YouTube-fallback
  embedId: "",
  duration: "Video",
  description: "Описание о чём видео...",
  whyHelps: "Какую лексику услышит студент...",
  vocabToListen: ["term1", "term2", "term3"],
  task: "Финальное задание для студента после просмотра.",

  // Задания ДО просмотра (1–2 элемента)
  predictionTask: [
    {
      type: "sentenceBuilder",
      q: "Build a sentence about this video:",
      tiles: ["This", "video", "explains", "...", "и плитки-обманки"],
      answer: ["This", "video", "explains", "..."]
    },
    {
      type: "wordCheck",
      q: "Which words do you expect to hear?",
      options: ["word1", "word2", "word3"]
    }
  ],

  // Задания ПОСЛЕ просмотра (3 элемента)
  postQuiz: [
    {
      type: "trueFalse",
      q: "Утверждение",
      answer: true,
      explanation: "Объяснение почему true/false"
    },
    {
      type: "choice",
      q: "Вопрос?",
      options: ["вариант 1", "вариант 2", "вариант 3", "вариант 4"],
      answer: "вариант 2",
      explanation: "Объяснение почему этот"
    },
    {
      type: "sentenceBuilder",
      q: "Build the sentence:",
      tiles: ["слова", "в", "порядке", "+ обманки"],
      answer: ["слова", "в", "порядке"]
    }
  ]
}
```

### Шаг 3. Закоммитить и запушить

```bash
git add public/u3_new_video.mp4 src/data/unit3.js
git commit -m "feat(media): add new video for Unit 3"
git push origin main
```

Vercel автоматически пересоберёт прод за 1–2 минуты.

---

## 4. Как изменить текст в Reading

В файле `src/data/unit<N>.js` найди секцию `reading:`. Структура:

```js
reading: {
  title: "Заголовок текста",
  intro: "Краткий пролог перед текстом",
  paragraphs: [
    "Первый абзац. Слова в **двойных звёздочках** становятся словарными — при наведении показывают перевод.",
    "Второй абзац. Можешь добавить **competition**, **demand** как термины из словаря.",
    "Третий абзац..."
  ]
}
```

Чтобы слово в тексте было активной словарной плашкой:
1. Обернуть в `**...**`
2. Убедиться, что то же слово есть в `vocabulary` юнита

---

## 5. Как изменить словарь (Dictionary)

В файле юнита найди массив `vocabulary: [`. Каждое слово — объект:

```js
{
  id: "u3_compoundinterest",           // уникальный ID, начинай с u<N>_
  term: "compound interest",            // термин на английском
  pos: "noun",                          // часть речи
  translationRu: "сложный процент",     // перевод на русский
  trick: "Мнемоника: «процент на процент»",  // подсказка для запоминания
  meaningEn: "Interest calculated on principal AND accumulated interest.",
  meaningRu: "Процент, начисляемый на основной долг и уже накопленные проценты.",
  example: "Compound interest is the eighth wonder of the world.",
  collocations: ["earn compound interest", "compound interest rate"]
}
```

> Чтобы слово участвовало в кроссворде, итоговом тесте или Vocabulary
> Radar — ничего отдельно делать не нужно, эти модули автоматически
> подтягивают всё из `vocabulary`.

---

## 6. Как добавить упражнение

В файле юнита, массив `exercises: [`. Шаблон зависит от типа:

### Matching (соединение пар)

```js
{
  id: "u3_match_money_functions",      // уникальный ID
  type: "matching",
  title: "Match the function with its meaning",
  titleRu: "Сопоставьте функцию с описанием",
  pairs: [
    { a: "medium of exchange", b: "money buys goods directly" },
    { a: "store of value",     b: "money keeps worth over time" },
    { a: "unit of account",    b: "money lets us compare prices" }
  ]
}
```

### Fill in the gap (заполнить пропуск)

```js
{
  id: "u3_gap_interest",
  type: "fillGap",
  title: "Fill in the missing words",
  items: [
    {
      sentence: "The bank charges 8% _______ on its loans.",
      answer: "interest",
      explanation: "Interest = плата за пользование кредитом."
    },
    {
      sentence: "She made a _______ of $500 into her savings account.",
      answer: "deposit"
    }
  ]
}
```

### Multiple Choice

```js
{
  id: "u3_choice_loans",
  type: "multipleChoice",
  title: "Choose the best answer",
  items: [
    {
      sentence: "What is the principal of a loan?",
      options: [
        "The interest rate",
        "The original amount borrowed",
        "The total cost including interest",
        "The monthly payment"
      ],
      answer: "The original amount borrowed",
      explanation: "Principal = первоначальная сумма заимствования."
    }
  ]
}
```

### Sentence Builder

```js
{
  id: "u3_builder_savings",
  type: "sentenceBuilder",
  title: "Build the sentences",
  items: [
    {
      q: "Translate: «Я открыл сберегательный счёт»",
      tiles: ["I", "opened", "a", "savings", "account.", "deposit", "money"],
      answer: ["I", "opened", "a", "savings", "account."]
    }
  ]
}
```

> Финальный пунктуационный знак (`.`, `?`, `!`) **должен быть приклеен к
> последнему слову** ответа, а не быть отдельной плиткой.

---

## 7. Как изменить итоговый тест (Total Test)

Секция `totalTest:` в файле юнита. Структура:

```js
totalTest: {
  title: "TOTAL TEST — Unit 3: Money & Banking",
  parts: [
    {
      id: "tt3_a",
      title: "Part A — Match the Word with its Definition",
      type: "match",
      instruction: "Match each term with its definition.",
      pairs: [
        { en: "loan", ru: "a sum of money borrowed from a bank..." },
        ...
      ]
    },
    {
      id: "tt3_b",
      title: "Part B — True or False",
      type: "trueFalse",
      instruction: "Read carefully. Decide TRUE or FALSE.",
      items: [
        { statement: "...", answer: true, explanation: "..." }
      ]
    },
    {
      id: "tt3_c",
      title: "Part C — Fill in the Gaps",
      type: "fillGap",
      instruction: "...",
      wordBank: ["word1", "word2", "word3"],
      items: [
        { sentence: "...______...", answer: "word1", explanation: "..." }
      ]
    },
    {
      id: "tt3_d",
      title: "Part D — Multiple Choice",
      type: "multipleChoice",
      instruction: "...",
      items: [
        { sentence: "...", options: [...], answer: "...", explanation: "..." }
      ]
    }
  ]
}
```

> Можно добавлять/удалять `parts`. Тест автоматически считает баллы по
> всем частям. Поддерживаются типы: `match`, `trueFalse`, `fillGap`,
> `multipleChoice`, `conceptMatch`.

---

## 8. Как поменять диалог

Секция `dialogue:`:

```js
dialogue: {
  title: "At the Bank",
  scenario: "Анна открывает сберегательный счёт.",
  lines: [
    { role: "Anna", text: "Good morning. I'd like to open a savings account." },
    { role: "Clerk", text: "Of course. Could you fill in this form, please?" },
    ...
  ],
  tasks: [
    {
      q: "What does Anna want to do?",
      a: "open a savings account"
    }
  ]
}
```

---

## 9. Как поменять сценарий (Scenario Loop)

Секция `scenario:`:

```js
scenario: {
  title: "Your savings strategy",
  intro: "Ты только что получил первую зарплату. Что делать с деньгами?",
  steps: [
    {
      question: "Куда положить $1000?",
      options: [
        { text: "Checking account",  isOptimal: false, feedback: "Не получает процентов." },
        { text: "Savings account",   isOptimal: true,  feedback: "Растёт за счёт процентов." },
        { text: "Под подушку",       isOptimal: false, feedback: "Не защищено от инфляции." }
      ]
    },
    // следующий шаг
  ]
}
```

Логика подсчёта: студент получает 100% если выбрал все optimal-варианты.

---

## 10. Как изменить интерактивные виджеты (Money Compass, Loan Sim и т.п.)

### Money Compass / Growth Drivers Compass / Market Structure Compass

Структура `moneyCompass:` / `growthDrivers:` / `marketStructures:`:

```js
moneyCompass: [
  {
    id: "medium",
    title: "Medium of exchange",
    titleRu: "Средство обмена",
    icon: "ArrowRightLeft",          // имя иконки из lucide-react
    definition: "Money is accepted for goods and services...",
    definitionRu: "Деньги принимаются в обмен на товары...",
    example: "When you buy bread with $5...",
    exampleRu: "Когда покупаешь хлеб за $5..."
  },
  // ещё 3 функции
]
```

### Loan Simulator

```js
loanSimulator: {
  title: "Arthur's Car Loan",
  intro: "...",
  defaults: { principal: 1500000, rateAnnual: 18, termMonths: 60 },
  ranges: {
    principal: { min: 100000, max: 5000000, step: 50000 },
    rateAnnual: { min: 5, max: 30, step: 0.5 },
    termMonths: { min: 12, max: 84, step: 6 }
  }
}
```

### Bank Account Picker

```js
bankAccountSection: {
  description: "...",
  filters: [
    { id: "all", label: "All accounts", labelRu: "Все счета" },
    { id: "daily", label: "Daily use", labelRu: "Ежедневно" }
  ],
  accountTypes: [
    {
      id: "checking",
      label: "Checking account",
      labelRu: "Текущий счёт",
      icon: "Wallet",
      tags: ["daily"],
      features: ["Unlimited withdrawals", "Low/no interest"]
    }
  ]
}
```

> Полные шаблоны и примеры — смотри в существующих юнитах. Каждый
> виджет имеет одноимённую секцию в файле юнита.

---

## 11. Как поменять Welcome-страницу

Файл: `src/pages/Landing.jsx`

Что можно менять без боли:

- **Заголовок и подзаголовок** — в JSX компонента `Landing`
- **Описание курса** (длинный параграф) — в JSX
- **Список «How it works»** — массив `howItWorks` в начале файла
- **Числа в hero-статистике** — массив `stats`, сейчас динамические

> Палитра, типографика и анимации — лучше не трогать без причины.

---

## 12. Деплой и проверка

После любой правки:

```bash
# 1. Закоммитить
git add <изменённые файлы>
git commit -m "feat(content): краткое описание правки"

# 2. Запушить в main
git push origin main
```

Vercel автоматически:
- Получит уведомление о пуше
- Соберёт проект (~1 минута)
- Выкатит на прод
- Через 1–2 минуты правка появится на `https://adaptation-fa.ru`

### Проверка локально перед пушем (опционально)

```bash
npm install   # один раз
npm run dev   # запустит локальный сервер http://localhost:5173
```

### Проверка сборки перед пушем

```bash
npm run build
```

Если выдало ошибку — правка некорректна, нужно исправлять синтаксис.

---

## 13. Куда смотреть, если что-то сломалось

| Симптом | Возможная причина |
|---------|-------------------|
| После пуша сайт не обновился | Подожди 2 минуты, потом Ctrl+F5; проверь Vercel Deployments на ошибки |
| `npm run build` падает с SyntaxError | Где-то лишняя запятая, скобка или кавычка в файле юнита |
| Видео не воспроизводится | Файл не в `public/` или путь в `localSrc` неверный |
| Упражнение не появляется | Не уникальный `id`, или забыл закрыть массив |
| Прогресс не записывается | Проверь `mediaId`/`id` — они должны быть уникальны |

---

## 14. Что точно НЕ нужно делать

- **Не редактировать** файлы в `dist/`. Это сборка, переписывается автоматически.
- **Не менять** `package.json` без необходимости.
- **Не изменять** структуру JSON-ключей в колонке `saved_progress`. Это сломает прогресс ранее работавших студентов.
- **Не удалять** существующие `mediaId`, упражнения и тесты. Это также сломает прогресс. Вместо удаления заменяйте содержимое под тем же `id`.

---

## 15. Файлы, которые часто меняют

| Файл | Когда трогать |
|------|---------------|
| `src/data/unit<N>.js` | При изменении любого контента юнита |
| `public/u<N>_*.mp4` | При замене видео |
| `src/pages/Landing.jsx` | При изменении welcome-страницы |
| `src/components/Layout.jsx` | При изменении sidebar/header |
| `src/components/unit/SectionBanner.jsx` | При добавлении нового типа секции |

## 16. Файлы, которые трогать НЕ нужно (без понимания архитектуры)

- `src/context/ProgressContext.jsx` — логика прогресса
- `src/lib/AuthContext.jsx` — авторизация
- `src/lib/supabaseClient.js` — клиент БД
- `src/App.jsx` — роутинг
- `src/utils/sectionStatus.js` — статусы секций
- `src/pages/TeacherDashboard.jsx` — преподавательская панель

---

Любой вопрос — пиши в чат разработчику, прилагай скриншот и описание
«что хотел сделать → что получилось».
