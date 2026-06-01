// ════════════════════════════════════════════════════════════════════════
// SECTION REGISTRY — single source of truth for unit page sections
// ════════════════════════════════════════════════════════════════════════
//
// Every section the UnitPage can render is declared here. UnitPage imports
// only what it needs from this module — it does NOT know about individual
// section components.
//
// Each entry tells the page:
//   - which React component renders the section
//   - which data field on `unit` activates it (or `null` for always-shown)
//   - the nav label (EN / RU) shown in the section nav strip
//
// To add a new section:
//   1. Build the component in src/components/unit/<Name>.jsx
//   2. Import it here, add to SECTION_COMPONENTS
//   3. Add an entry to SECTION_LABELS describing how it appears in nav
//   4. (Optional) add the section to a unit's data file in the right place
//
// This module enables R2/R3/R4 of the Phase 3 refactoring plan — the
// progression from `unit.id === N` checks toward a fully declarative
// section list driven by unit data.
//
// ════════════════════════════════════════════════════════════════════════

import UnitHeader from './UnitHeader';
import KeyIdeas from './KeyIdeas';
import Dictionary from './Dictionary';
import ComicsBlock from './ComicsBlock';
import ReadingSection from './ReadingSection';
import ComprehensionQuestions from './ComprehensionQuestions';
import MediaLab from './MediaLab';
import MediaQuest from './MediaQuest';
import DialogueBlock from './DialogueBlock';
import WritingBlock from './WritingBlock';
import TotalTest from './TotalTest';
import VocabularyRadar from './VocabularyRadar';
import ScenarioLoop from './ScenarioLoop';
import CrosswordChallenge from './CrosswordChallenge';
import MoneyCompass from './MoneyCompass';
import MoneyFormsSpectrum from './MoneyFormsSpectrum';
import CurrencyComparator from './CurrencyComparator';
import CentralBankWheel from './CentralBankWheel';
import BankAccountPicker from './BankAccountPicker';
import WorldBankingMap from './WorldBankingMap';
import LoanSimulator from './LoanSimulator';
import GDPCalculator from './GDPCalculator';
import EconomicIndicatorsDashboard from './EconomicIndicatorsDashboard';
import BusinessCycleSwitcher from './BusinessCycleSwitcher';
import BalanceSheetBuilder from './BalanceSheetBuilder';
import AnnualReportReader from './AnnualReportReader';
import MarketStructureCompass from './MarketStructureCompass';
import ComplaintResolutionPath from './ComplaintResolutionPath';
import GrowthDriversCompass from './GrowthDriversCompass';
import TechJobsFlow from './TechJobsFlow';
import GrowthTimeline from './GrowthTimeline';
import MemoSection from './MemoSection';
import LabourMarketSection from './LabourMarketSection';
import CaseStudySection from './CaseStudySection';
import RolePerspectives from './RolePerspectives';
import GrammarSection from './GrammarSection';
import PeopleProgressCards from './PeopleProgressCards';
import EmploymentSnapshot from './EmploymentSnapshot';

// Component registry — sectionId → React component
// UnitPage and any other consumer should look up components from here,
// never import them directly.
export const SECTION_COMPONENTS = {
  header:            UnitHeader,
  keyideas:          KeyIdeas,
  moneycompass:      MoneyCompass,
  moneyforms:        MoneyFormsSpectrum,
  currency:          CurrencyComparator,
  centralbank:       CentralBankWheel,
  bankaccounts:      BankAccountPicker,
  worldbanking:      WorldBankingMap,
  loansim:           LoanSimulator,
  gdpcalc:           GDPCalculator,
  indicators:        EconomicIndicatorsDashboard,
  businesscycle:     BusinessCycleSwitcher,
  balancesheet:      BalanceSheetBuilder,
  annualreport:      AnnualReportReader,
  marketstructures:  MarketStructureCompass,
  complaintpath:     ComplaintResolutionPath,
  growthdrivers:     GrowthDriversCompass,
  techjobsflow:      TechJobsFlow,
  dictionary:        Dictionary,
  comics:            ComicsBlock,
  timeline:          GrowthTimeline,        // formerly 'impactmap' (Unit 2)
  impactmap:         GrowthTimeline,        // legacy alias — keep until full migration
  reading:           ReadingSection,
  comprehension:     ComprehensionQuestions,
  media:             MediaLab,
  mediaquest:        MediaQuest,
  crossword:         CrosswordChallenge,
  casestudy:         CaseStudySection,
  roleperspectives:  RolePerspectives,
  labourmarket:      LabourMarketSection,
  dialogue:          DialogueBlock,
  memo:              MemoSection,
  grammar:           GrammarSection,
  writing:           WritingBlock,
  scenario:          ScenarioLoop,
  totaltest:         TotalTest,
  // 'answerkey' and 'summary' are rendered inline by UnitPage — they are
  // not standalone components, so they don't appear here.
};

// Section label config — what each section calls itself in the nav strip
// and section banner.
export const SECTION_LABELS = {
  header:           { label: 'Intro',        labelRu: '' },
  keyideas:         { label: 'Key Ideas',    labelRu: 'Идеи' },
  moneycompass:     { label: 'Money Compass', labelRu: 'Компас денег' },
  moneyforms:       { label: 'Money Forms',  labelRu: 'Формы денег' },
  currency:         { label: '£ vs $',       labelRu: 'Валюты' },
  centralbank:      { label: 'Central Bank', labelRu: 'ЦБ' },
  bankaccounts:     { label: 'Accounts',     labelRu: 'Счета' },
  worldbanking:     { label: 'World Map',    labelRu: 'Мировая карта' },
  loansim:          { label: 'Loan Sim',     labelRu: 'Кредит' },
  gdpcalc:          { label: 'GDP Calc',     labelRu: 'ВВП' },
  indicators:       { label: 'Indicators',   labelRu: 'Индикаторы' },
  businesscycle:    { label: 'Cycle',        labelRu: 'Цикл' },
  balancesheet:     { label: 'Balance Sheet', labelRu: 'Баланс' },
  annualreport:     { label: 'Annual Report', labelRu: 'Годовой отчёт' },
  marketstructures: { label: 'Market Types',  labelRu: 'Типы рынков' },
  complaintpath:    { label: 'Complaint Path', labelRu: 'Жалоба' },
  growthdrivers:    { label: 'Growth Drivers', labelRu: 'Факторы роста' },
  techjobsflow:     { label: 'Tech & Jobs',  labelRu: 'Технологии и труд' },
  dictionary:       { label: 'Dictionary',   labelRu: 'Словарь' },
  comics:           { label: 'Comics',       labelRu: 'Комикс' },
  timeline:         { label: 'Timeline',     labelRu: 'Шкала' },
  impactmap:        { label: 'Timeline',     labelRu: 'Шкала' },
  reading:          { label: 'Reading',      labelRu: 'Чтение' },
  comprehension:    { label: 'Questions',    labelRu: 'Вопросы' },
  media:            { label: 'Media Lab',    labelRu: 'Медиа' },
  mediaquest:       { label: 'Media Quest',  labelRu: 'Квест' },
  crossword:        { label: 'Crossword',    labelRu: 'Кроссворд' },
  casestudy:        { label: 'Case Study',   labelRu: 'Кейс' },
  roleperspectives: { label: 'Perspectives', labelRu: 'Роли' },
  labourmarket:     { label: 'Labour',       labelRu: 'Труд' },
  dialogue:         { label: 'Dialogue',     labelRu: 'Диалог' },
  memo:             { label: 'Memo',         labelRu: 'Меморандум' },
  grammar:          { label: 'Grammar',      labelRu: 'Грамматика' },
  writing:          { label: 'Writing',      labelRu: 'Письмо' },
  scenario:         { label: 'Scenario',     labelRu: 'Сценарий' },
  totaltest:        { label: 'Total Test',   labelRu: 'Тест' },
  answerkey:        { label: 'Answer Key',   labelRu: 'Ответы' },
  summary:          { label: 'Summary',      labelRu: 'Итог' },
};

// Re-export auxiliary components that UnitPage still uses inline
// (PeopleProgressCards / EmploymentSnapshot are rendered as decoration
// above Role Perspectives and Labour Market — keeping them accessible).
export { PeopleProgressCards, EmploymentSnapshot, VocabularyRadar };
