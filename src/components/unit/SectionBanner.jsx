import React from 'react';
import { CheckCircle, BookOpen, Pencil, FileText, Headphones, MessageSquare, BookMarked, PenLine, Layers, ClipboardList, Grid3X3, KeyRound, Flag, HelpCircle, Search, TrendingUp, Users, BarChart2, Shield, Compass, Scale } from 'lucide-react';

const SECTION_CONFIG = {
  comics:           { icon: BookMarked,    label: 'Comics',             labelRu: 'Комикс',          bg: 'var(--col-sec-comics-bg)',    text: 'var(--col-sec-comics-text)',    border: 'var(--col-sec-comics-border)',    purpose: 'Visual vocabulary introduction' },
  impactmap:        { icon: TrendingUp,    label: 'Timeline & Impact',  labelRu: 'Шкала и карта',   bg: 'var(--col-sec-comics-bg)',    text: 'var(--col-sec-comics-text)',    border: 'var(--col-sec-comics-border)',    purpose: 'Follow the story and chain of economic growth' },
  dictionary:       { icon: BookOpen,      label: 'Dictionary',         labelRu: 'Словарь',         bg: 'var(--col-sec-vocab-bg)',     text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'Learn terms, translations, and mnemonics' },
  keyideas:         { icon: Layers,        label: 'Key Ideas',          labelRu: 'Ключевые идеи',   bg: 'var(--col-sec-vocab-bg)',     text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'Core concepts of this unit' },
  moneycompass:     { icon: Compass,       label: 'Money Compass',      labelRu: 'Компас денег',    bg: 'var(--col-sec-vocab-bg)',     text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'Four functions of money — click each to explore' },
  moneyforms:       { icon: Layers,        label: 'Money Forms',        labelRu: 'Формы денег',     bg: 'var(--col-sec-vocab-bg)',     text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'Barter → fiat → digital — how money evolved' },
  currency:         { icon: BarChart2,     label: '£ vs $',             labelRu: 'Сравнение валют', bg: 'var(--col-sec-vocab-bg)',     text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'British pound vs American dollar — side by side' },
  centralbank:      { icon: Shield,        label: 'Central Bank',       labelRu: 'Центральный банк', bg: 'var(--col-sec-vocab-bg)',    text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'Six functions of a central bank' },
  bankaccounts:     { icon: Layers,        label: 'Bank Accounts',      labelRu: 'Банковские счета', bg: 'var(--col-sec-vocab-bg)',    text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'Pick the right account for your need' },
  worldbanking:     { icon: TrendingUp,    label: 'World Banking',      labelRu: 'Банки мира',       bg: 'var(--col-sec-vocab-bg)',    text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'Tour 7 banking systems around the world' },
  loansim:          { icon: BarChart2,     label: 'Loan Simulator',     labelRu: 'Кредитный симулятор', bg: 'var(--col-sec-vocab-bg)', text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'Adjust principal, rate, term — see the cost' },
  gdpcalc:          { icon: BarChart2,     label: 'GDP Calculator',     labelRu: 'Калькулятор ВВП', bg: 'var(--col-sec-vocab-bg)',     text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'Two approaches, one number — prove the equivalence' },
  indicators:       { icon: TrendingUp,    label: 'Indicators',         labelRu: 'Индикаторы',       bg: 'var(--col-sec-vocab-bg)',    text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'Sort each indicator: leading, coincident, or lagging' },
  businesscycle:    { icon: TrendingUp,    label: 'Business Cycle',     labelRu: 'Бизнес-цикл',      bg: 'var(--col-sec-vocab-bg)',    text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'Four phases of the economy — see which metrics move' },
  balancesheet:     { icon: Scale,         label: 'Balance Sheet',      labelRu: 'Балансовый отчёт', bg: 'var(--col-sec-vocab-bg)',    text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'Drag & drop — Assets = Liabilities + Equity' },
  annualreport:     { icon: FileText,      label: 'Annual Report',      labelRu: 'Годовой отчёт',    bg: 'var(--col-sec-vocab-bg)',    text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'Read a real company report — vocabulary in context' },
  marketstructures: { icon: BarChart2,     label: 'Market Types',       labelRu: 'Типы рынков',      bg: 'var(--col-sec-vocab-bg)',    text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'Compare the four market structures — competition to monopoly' },
  complaintpath:    { icon: HelpCircle,    label: 'Complaint Path',     labelRu: 'Путь жалобы',      bg: 'var(--col-sec-vocab-bg)',    text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'Walk through the 4-step customer-complaint resolution flow' },
  growthdrivers:    { icon: TrendingUp,    label: 'Growth Drivers',     labelRu: 'Факторы роста',    bg: 'var(--col-sec-vocab-bg)',    text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'The four forces behind long-run economic growth' },
  techjobsflow:     { icon: Users,         label: 'Tech & Jobs',        labelRu: 'Технологии и труд', bg: 'var(--col-sec-vocab-bg)',   text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'How new technology ripples through the labour market' },
  exercises:        { icon: Pencil,        label: 'Exercises',          labelRu: 'Упражнения',      bg: 'var(--col-sec-exercises-bg)', text: 'var(--col-sec-exercises-text)', border: 'var(--col-sec-exercises-border)', purpose: 'Practice and reinforce vocabulary' },
  reading:          { icon: FileText,      label: 'Reading',            labelRu: 'Чтение',          bg: 'var(--col-sec-reading-bg)',   text: 'var(--col-sec-reading-text)',   border: 'var(--col-sec-reading-border)',   purpose: 'Academic text with highlighted vocabulary' },
  comprehension:    { icon: HelpCircle,    label: 'Questions',          labelRu: 'Вопросы',         bg: 'var(--col-sec-reading-bg)',   text: 'var(--col-sec-reading-text)',   border: 'var(--col-sec-reading-border)',   purpose: 'Check reading comprehension' },
  media:            { icon: Headphones,    label: 'Media Lab',          labelRu: 'Медиа',           bg: 'var(--col-sec-media-bg)',     text: 'var(--col-sec-media-text)',     border: 'var(--col-sec-media-border)',     purpose: 'Videos, podcasts, and articles' },
  mediaquest:       { icon: Search,        label: 'Media Quest',        labelRu: 'Медиа-квест',     bg: 'var(--col-sec-media-bg)',     text: 'var(--col-sec-media-text)',     border: 'var(--col-sec-media-border)',     purpose: 'Deeper media exploration tasks' },
  casestudy:        { icon: Users,         label: 'Case Study',         labelRu: 'Кейс',            bg: 'var(--col-sec-comics-bg)',    text: 'var(--col-sec-comics-text)',    border: 'var(--col-sec-comics-border)',    purpose: 'Technology, jobs, and social costs — a real story' },
  roleperspectives: { icon: MessageSquare, label: 'Perspectives',       labelRu: 'Точки зрения',    bg: 'var(--col-sec-exercises-bg)', text: 'var(--col-sec-exercises-text)', border: 'var(--col-sec-exercises-border)', purpose: 'Who would say this?' },
  labourmarket:     { icon: BarChart2,     label: 'Labour Market',      labelRu: 'Рынок труда',     bg: 'var(--col-sec-reading-bg)',   text: 'var(--col-sec-reading-text)',   border: 'var(--col-sec-reading-border)',   purpose: 'Employment data and labour trends' },
  dialogue:         { icon: MessageSquare, label: 'Dialogue',           labelRu: 'Диалог',          bg: 'var(--col-sec-exercises-bg)', text: 'var(--col-sec-exercises-text)', border: 'var(--col-sec-exercises-border)', purpose: 'Real-life business conversation' },
  memo:             { icon: FileText,      label: 'Business Memo',      labelRu: 'Меморандум',      bg: 'var(--col-sec-reading-bg)',   text: 'var(--col-sec-reading-text)',   border: 'var(--col-sec-reading-border)',   purpose: 'Learn to write and read business memos' },
  grammar:          { icon: BookOpen,      label: 'Grammar: Modals',    labelRu: 'Грамматика',      bg: 'var(--col-sec-vocab-bg)',     text: 'var(--col-sec-vocab-text)',     border: 'var(--col-sec-vocab-border)',     purpose: 'Modal verbs: possibility, probability, deduction' },
  writing:          { icon: PenLine,       label: 'Writing',            labelRu: 'Письмо',          bg: 'var(--col-sec-exercises-bg)', text: 'var(--col-sec-exercises-text)', border: 'var(--col-sec-exercises-border)', purpose: 'Use vocabulary in your own sentences' },
  scenario:         { icon: Layers,        label: 'Scenario Loop',      labelRu: 'Сценарий',        bg: 'var(--col-sec-comics-bg)',    text: 'var(--col-sec-comics-text)',    border: 'var(--col-sec-comics-border)',    purpose: 'Make real business decisions' },
  totaltest:        { icon: ClipboardList, label: 'Total Test',         labelRu: 'Итоговый тест',   bg: 'var(--col-sec-test-bg)',      text: 'var(--col-sec-test-text)',      border: 'var(--col-sec-test-border)',      purpose: 'Final assessment for this unit' },
  crossword:        { icon: Grid3X3,       label: 'Crossword',          labelRu: 'Кроссворд',       bg: 'var(--col-sec-reading-bg)',   text: 'var(--col-sec-reading-text)',   border: 'var(--col-sec-reading-border)',   purpose: 'Vocabulary reinforcement puzzle' },
  answerkey:        { icon: KeyRound,      label: 'Answer Key',         labelRu: 'Ключи ответов',   bg: 'var(--col-sec-teacher-bg)',   text: 'var(--col-sec-teacher-text)',   border: 'rgba(160,176,192,0.3)',           purpose: 'Teacher reference only' },
  summary:          { icon: Flag,          label: 'Unit Complete',      labelRu: 'Итог',            bg: 'var(--col-accent-light)',     text: 'var(--col-accent-text)',        border: 'var(--col-divider)',              purpose: 'Unit finished — review or continue' },
};

export default function SectionBanner({ sectionId, isDone }) {
  const cfg = SECTION_CONFIG[sectionId] || {
    icon: BookOpen, label: sectionId, labelRu: '', bg: 'var(--col-surface)', text: 'var(--col-heading)', border: 'var(--col-border)', purpose: ''
  };
  const Icon = cfg.icon;

  return (
    <div
      className="section-banner fade-in-up"
      style={{
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderLeft: `3px solid ${cfg.border}`,
      }}
    >
      <div
        className="shrink-0 flex items-center justify-center rounded"
        style={{ width: 28, height: 28, backgroundColor: `${cfg.border}30` }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color: cfg.text }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span style={{ fontSize: 15, fontWeight: 600, color: cfg.text, lineHeight: 1.2 }}>{cfg.label}</span>
          {cfg.labelRu && (
            <span style={{ fontSize: 11, color: cfg.text, opacity: 0.6 }}>{cfg.labelRu}</span>
          )}
        </div>
        {cfg.purpose && (
          <p style={{ fontSize: 11.5, color: cfg.text, opacity: 0.7, lineHeight: 1.4, marginTop: 2 }}>{cfg.purpose}</p>
        )}
      </div>
      {isDone ? (
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded shrink-0"
          style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
        >
          <CheckCircle className="h-3 w-3" style={{ color: 'var(--col-accent)' }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--col-accent-text)' }}>Done</span>
        </div>
      ) : (
        <div
          className="w-5 h-5 rounded border shrink-0"
          style={{ borderColor: cfg.border, opacity: 0.45 }}
        />
      )}
    </div>
  );
}