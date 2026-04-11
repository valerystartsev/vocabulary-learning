import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { CheckCircle, XCircle, Eye, RotateCcw, Lightbulb, Trophy, AlertTriangle, ChevronDown, ChevronUp, GraduationCap, Globe } from 'lucide-react';

/* ── Crossword data ── */
const CROSSWORD_WORDS = [
  { number: 1,  word: 'MARKET',      dir: 'across', row: 0,  col: 0,  clue: 'A place where buyers and sellers meet to trade.',         clueRu: 'Место встречи покупателей и продавцов.' },
  { number: 2,  word: 'MONOPOLY',    dir: 'across', row: 2,  col: 0,  clue: 'When one company controls the whole market.',             clueRu: 'Когда одна компания контролирует весь рынок.' },
  { number: 3,  word: 'MERGER',      dir: 'across', row: 4,  col: 1,  clue: 'Two companies join to become one bigger company.',        clueRu: 'Два предприятия объединяются в одно.' },
  { number: 4,  word: 'OVERHEADS',   dir: 'across', row: 6,  col: 0,  clue: 'Regular costs like rent, electricity, and salaries.',     clueRu: 'Постоянные расходы: аренда, электричество.' },
  { number: 5,  word: 'RECRUIT',     dir: 'across', row: 8,  col: 2,  clue: 'To find and hire new workers.',                           clueRu: 'Найти и нанять новых сотрудников.' },
  { number: 6,  word: 'REFUND',      dir: 'across', row: 10, col: 0,  clue: 'Money given back to a buyer for a returned product.',     clueRu: 'Возврат денег покупателю.' },
  { number: 7,  word: 'COMPETE',     dir: 'down',   row: 0,  col: 2,  clue: 'To try to be better than another company.',               clueRu: 'Стараться быть лучше конкурента.' },
  { number: 8,  word: 'ENTERPRISE',  dir: 'down',   row: 0,  col: 5,  clue: 'A business or the courage to start one.',                 clueRu: 'Бизнес или смелость его начать.' },
  { number: 9,  word: 'AUTHORITY',   dir: 'down',   row: 2,  col: 1,  clue: 'The power to make decisions or a controlling group.',     clueRu: 'Власть или орган контроля.' },
  { number: 10, word: 'RESTRICT',    dir: 'down',   row: 4,  col: 7,  clue: 'To limit or put rules on something.',                    clueRu: 'Ограничивать или устанавливать правила.' },
  { number: 11, word: 'PURCHASE',    dir: 'down',   row: 6,  col: 4,  clue: 'To buy something. Also: the thing you buy.',              clueRu: 'Купить. Также: то, что вы купили.' },
  { number: 12, word: 'DEMAND',      dir: 'down',   row: 8,  col: 0,  clue: 'How much customers want to buy a product.',               clueRu: 'Насколько покупатели хотят купить товар.' },
];

function buildGrid(words) {
  let maxRow = 0, maxCol = 0;
  words.forEach(w => {
    if (w.dir === 'across') { maxRow = Math.max(maxRow, w.row); maxCol = Math.max(maxCol, w.col + w.word.length - 1); }
    else { maxRow = Math.max(maxRow, w.row + w.word.length - 1); maxCol = Math.max(maxCol, w.col); }
  });
  const rows = maxRow + 1, cols = maxCol + 1;
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ letter: '', number: null, wordIds: [], isBlack: true }))
  );
  words.forEach((w, wi) => {
    for (let i = 0; i < w.word.length; i++) {
      const r = w.dir === 'across' ? w.row : w.row + i;
      const c = w.dir === 'across' ? w.col + i : w.col;
      if (grid[r]?.[c]) {
        grid[r][c].letter = w.word[i];
        grid[r][c].isBlack = false;
        grid[r][c].wordIds.push({ wordIdx: wi, posInWord: i });
        if (i === 0) grid[r][c].number = w.number;
      }
    }
  });
  return { grid, rows, cols };
}

const { grid: GRID, rows: GRID_ROWS, cols: GRID_COLS } = buildGrid(CROSSWORD_WORDS);

function getWordAtCell(r, c, dir) {
  const cell = GRID[r]?.[c];
  if (!cell || cell.isBlack) return null;
  const match = cell.wordIds.find(wid => CROSSWORD_WORDS[wid.wordIdx].dir === dir);
  return match ? match.wordIdx : null;
}

function getWordCells(wordIdx) {
  const w = CROSSWORD_WORDS[wordIdx];
  return Array.from({ length: w.word.length }, (_, i) => ({
    r: w.dir === 'across' ? w.row : w.row + i,
    c: w.dir === 'across' ? w.col + i : w.col,
    pos: i,
  }));
}

/* Responsive cell size — computed at mount */
function getCellSize() {
  if (typeof window === 'undefined') return 36;
  const vw = window.innerWidth;
  if (vw < 400) return 26;
  if (vw < 640) return 30;
  return 38;
}

export default function CrosswordChallenge({ unitId, isTeacherMode }) {
  const { addWeakWordsFromExercise, markSectionComplete, saveCrosswordScore } = useProgress();
  const [cellSize, setCellSize] = useState(getCellSize);
  const [userInput, setUserInput] = useState({});
  const [checked, setChecked] = useState({});
  const [revealed, setRevealed] = useState(new Set());
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedDir, setSelectedDir] = useState('across');
  const [selectedWordIdx, setSelectedWordIdx] = useState(null);
  const [completionState, setCompletionState] = useState(null);
  const [showClues, setShowClues] = useState(false);
  const [showRu, setShowRu] = useState(false);
  const [teacherRevealed, setTeacherRevealed] = useState(false);
  const clueListRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setCellSize(getCellSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isTeacherMode && teacherRevealed) {
      const inp = {};
      CROSSWORD_WORDS.forEach(w => {
        for (let i = 0; i < w.word.length; i++) {
          const r = w.dir === 'across' ? w.row : w.row + i;
          const c = w.dir === 'across' ? w.col + i : w.col;
          inp[`${r},${c}`] = w.word[i];
        }
      });
      setUserInput(inp);
      setChecked({});
    }
  }, [isTeacherMode, teacherRevealed]);

  // Auto-scroll active clue into view
  useEffect(() => {
    if (selectedWordIdx !== null && clueListRef.current) {
      const el = clueListRef.current.querySelector(`[data-clue-idx="${selectedWordIdx}"]`);
      if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedWordIdx]);

  const selectCell = useCallback((r, c) => {
    if (GRID[r]?.[c]?.isBlack) return;
    if (selectedCell?.r === r && selectedCell?.c === c) {
      const newDir = selectedDir === 'across' ? 'down' : 'across';
      const wIdx = getWordAtCell(r, c, newDir) ?? getWordAtCell(r, c, selectedDir);
      setSelectedDir(newDir);
      setSelectedWordIdx(wIdx);
    } else {
      setSelectedCell({ r, c });
      let wIdx = getWordAtCell(r, c, selectedDir);
      let dir = selectedDir;
      if (wIdx === null) { dir = selectedDir === 'across' ? 'down' : 'across'; wIdx = getWordAtCell(r, c, dir); }
      setSelectedDir(dir);
      setSelectedWordIdx(wIdx);
    }
  }, [selectedCell, selectedDir]);

  const moveToNext = useCallback((r, c, dir) => {
    if (dir === 'across') { const nc = c + 1; if (nc < GRID_COLS && !GRID[r]?.[nc]?.isBlack) { setSelectedCell({ r, c: nc }); setSelectedWordIdx(getWordAtCell(r, nc, dir)); } }
    else { const nr = r + 1; if (nr < GRID_ROWS && !GRID[nr]?.[c]?.isBlack) { setSelectedCell({ r: nr, c }); setSelectedWordIdx(getWordAtCell(nr, c, dir)); } }
  }, []);

  const moveToPrev = useCallback((r, c, dir) => {
    if (dir === 'across') { const nc = c - 1; if (nc >= 0 && !GRID[r]?.[nc]?.isBlack) { setSelectedCell({ r, c: nc }); setSelectedWordIdx(getWordAtCell(r, nc, dir)); } }
    else { const nr = r - 1; if (nr >= 0 && !GRID[nr]?.[c]?.isBlack) { setSelectedCell({ r: nr, c }); setSelectedWordIdx(getWordAtCell(nr, c, dir)); } }
  }, []);

  const handleCellInput = useCallback((r, c, letter) => {
    const k = `${r},${c}`;
    if (revealed.has(k)) return;
    setUserInput(p => ({ ...p, [k]: letter.toUpperCase() }));
    setChecked(p => { const n = { ...p }; delete n[k]; return n; });
    moveToNext(r, c, selectedDir);
  }, [revealed, selectedDir, moveToNext]);

  const handleCellKeyDown = useCallback((e, r, c) => {
    const key = e.key;
    if (key === 'Backspace') {
      e.preventDefault();
      const k = `${r},${c}`;
      if (userInput[k]) { setUserInput(p => { const n = { ...p }; delete n[k]; return n; }); setChecked(p => { const n = { ...p }; delete n[k]; return n; }); }
      else moveToPrev(r, c, selectedDir);
      return;
    }
    if (key === 'ArrowRight') { e.preventDefault(); selectCell(r, Math.min(c + 1, GRID_COLS - 1)); return; }
    if (key === 'ArrowLeft')  { e.preventDefault(); selectCell(r, Math.max(c - 1, 0)); return; }
    if (key === 'ArrowDown')  { e.preventDefault(); selectCell(Math.min(r + 1, GRID_ROWS - 1), c); return; }
    if (key === 'ArrowUp')    { e.preventDefault(); selectCell(Math.max(r - 1, 0), c); return; }
    if (key === 'Tab')        { e.preventDefault(); advanceWord(e.shiftKey ? -1 : 1); return; }
    if (/^[a-zA-Z]$/.test(key)) { e.preventDefault(); handleCellInput(r, c, key); }
  }, [userInput, selectedDir, selectCell, moveToPrev, handleCellInput]);

  const advanceWord = (delta) => {
    if (selectedWordIdx === null) return;
    const next = (selectedWordIdx + delta + CROSSWORD_WORDS.length) % CROSSWORD_WORDS.length;
    const w = CROSSWORD_WORDS[next];
    setSelectedWordIdx(next); setSelectedDir(w.dir); setSelectedCell({ r: w.row, c: w.col });
  };

  const isInSelectedWord = (r, c) => {
    if (selectedWordIdx === null) return false;
    return getWordCells(selectedWordIdx).some(cell => cell.r === r && cell.c === c);
  };

  const checkAll = () => {
    const newChecked = {};
    CROSSWORD_WORDS.forEach(w => {
      for (let i = 0; i < w.word.length; i++) {
        const r = w.dir === 'across' ? w.row : w.row + i;
        const c = w.dir === 'across' ? w.col + i : w.col;
        const k = `${r},${c}`;
        if (userInput[k]) newChecked[k] = userInput[k] === w.word[i] ? 'correct' : 'wrong';
      }
    });
    setChecked(newChecked);
    const wordResults = CROSSWORD_WORDS.map((w, wi) => {
      const cells = getWordCells(wi);
      const allCorrect = cells.every(({ r, c, pos }) => (userInput[`${r},${c}`] || '') === w.word[pos]);
      const usedReveal = cells.some(({ r, c }) => revealed.has(`${r},${c}`));
      return { allCorrect, usedReveal };
    });
    if (wordResults.every(r => r.allCorrect)) {
      const solved = wordResults.filter(r => r.allCorrect && !r.usedReveal).length;
      const helped = wordResults.filter(r => r.allCorrect && r.usedReveal).length;
      setCompletionState({ solved, helped, total: CROSSWORD_WORDS.length });
      markSectionComplete?.(unitId, 'crossword');
      saveCrosswordScore?.(unitId, { solved, helped, total: CROSSWORD_WORDS.length });
      const weakIds = CROSSWORD_WORDS.filter((_, wi) => wordResults[wi].usedReveal || !wordResults[wi].allCorrect).map(w => `u1_${w.word.toLowerCase()}`);
      if (weakIds.length > 0) addWeakWordsFromExercise(weakIds);
    }
  };

  const checkWord = () => {
    if (selectedWordIdx === null) return;
    const cells = getWordCells(selectedWordIdx);
    const newChecked = { ...checked };
    cells.forEach(({ r, c, pos }) => {
      const k = `${r},${c}`;
      if (userInput[k]) newChecked[k] = userInput[k] === CROSSWORD_WORDS[selectedWordIdx].word[pos] ? 'correct' : 'wrong';
    });
    setChecked(newChecked);
  };

  const revealLetter = () => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    const letter = GRID[r]?.[c]?.letter;
    if (!letter) return;
    const k = `${r},${c}`;
    setUserInput(p => ({ ...p, [k]: letter }));
    setRevealed(prev => new Set([...prev, k]));
    setChecked(p => { const n = { ...p }; delete n[k]; return n; });
    moveToNext(r, c, selectedDir);
  };

  const revealWord = () => {
    if (selectedWordIdx === null) return;
    const cells = getWordCells(selectedWordIdx);
    const newInput = { ...userInput };
    const newRevealed = new Set(revealed);
    cells.forEach(({ r, c, pos }) => {
      const k = `${r},${c}`;
      newInput[k] = CROSSWORD_WORDS[selectedWordIdx].word[pos];
      newRevealed.add(k);
    });
    setUserInput(newInput); setRevealed(newRevealed);
    setChecked(p => { const n = { ...p }; cells.forEach(({ r, c }) => delete n[`${r},${c}`]); return n; });
  };

  const resetPuzzle = () => {
    setUserInput({}); setChecked({}); setRevealed(new Set());
    setCompletionState(null); setSelectedCell(null); setSelectedWordIdx(null); setTeacherRevealed(false);
  };

  const uniqueCells = new Set(CROSSWORD_WORDS.flatMap(w => Array.from({ length: w.word.length }, (_, i) => w.dir === 'across' ? `${w.row},${w.col + i}` : `${w.row + i},${w.col}`))).size;
  const filledCount = Object.keys(userInput).length;
  const pct = Math.round((filledCount / uniqueCells) * 100);
  const selectedWordData = selectedWordIdx !== null ? CROSSWORD_WORDS[selectedWordIdx] : null;

  const getCellStyle = (r, c) => {
    const k = `${r},${c}`;
    const isSelected = selectedCell?.r === r && selectedCell?.c === c;
    const inWord = isInSelectedWord(r, c);
    const isCorrect = checked[k] === 'correct';
    const isWrong = checked[k] === 'wrong';
    const isRev = revealed.has(k);

    if (isCorrect) return { bg: '#4A8C6A', border: `${cellSize >= 36 ? 2 : 1}px solid #3A7A5A`, textColor: 'white' };
    if (isWrong)   return { bg: '#C05050', border: `${cellSize >= 36 ? 2 : 1}px solid #A03A3A`, textColor: 'white' };
    if (isRev)     return { bg: '#FEF9EE', border: `${cellSize >= 36 ? 2 : 1}px solid #D4B86A`, textColor: '#8B6914' };
    if (isSelected)return { bg: '#FFFFFF', border: `2px solid #C9955A`, textColor: 'var(--col-heading)' };
    if (inWord)    return { bg: 'var(--col-accent-light)', border: `1px solid var(--col-divider)`, textColor: 'var(--col-heading)' };
    return { bg: 'var(--col-surface)', border: `1px solid #C8C4B8`, textColor: 'var(--col-heading)' };
  };

  const gridWidth = GRID_COLS * cellSize;

  const ClueList = () => (
    <div ref={clueListRef} className="space-y-4 overflow-y-auto" style={{ maxHeight: 420 }}>
      {['across', 'down'].map(dir => (
        <div key={dir}>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-2 sticky top-0 py-1"
            style={{ color: 'var(--col-muted)', backgroundColor: 'var(--col-surface)', zIndex: 1 }}>
            {dir === 'across' ? 'Across →' : 'Down ↓'}
          </h4>
          <div className="space-y-0.5">
            {CROSSWORD_WORDS.filter(w => w.dir === dir).map(w => {
              const wIdx = CROSSWORD_WORDS.indexOf(w);
              const isActive = selectedWordIdx === wIdx;
              const cells = getWordCells(wIdx);
              const solved = cells.every(({ r, c, pos }) => (userInput[`${r},${c}`] || '') === w.word[pos]);
              return (
                <button
                  key={w.number}
                  data-clue-idx={wIdx}
                  onClick={() => { setSelectedWordIdx(wIdx); setSelectedDir(dir); setSelectedCell({ r: w.row, c: w.col }); }}
                  className="w-full text-left px-3 py-2.5 rounded-lg transition-all"
                  style={{
                    minHeight: 44,
                    backgroundColor: isActive ? 'var(--col-accent-light)' : solved ? '#F0FAF5' : 'transparent',
                    borderLeft: isActive ? '3px solid #C9955A' : '3px solid transparent',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <span className="text-xs font-bold mr-1.5" style={{ color: '#C9955A' }}>{w.number}.</span>
                  <span className="text-xs" style={{ color: solved ? '#2D6050' : 'var(--col-body)' }}>{w.clue}</span>
                  {showRu && <span className="block text-[10px] italic mt-0.5" style={{ color: 'var(--col-muted)' }}>{w.clueRu}</span>}
                  {solved && <span className="ml-1.5 text-[10px] font-semibold" style={{ color: '#4A8C6A' }}>✓ solved</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  const ActionBar = ({ mobile = false }) => {
    const btns = [
      { label: 'Check Word',    short: 'Check Word',  icon: CheckCircle, fn: checkWord,    disabled: selectedWordIdx === null, primary: false },
      { label: 'Check All',     short: 'Check All',   icon: CheckCircle, fn: checkAll,     disabled: false, primary: true },
      { label: 'Reveal Letter', short: 'Letter',      icon: Lightbulb,   fn: revealLetter, disabled: !selectedCell, primary: false },
      { label: 'Reveal Word',   short: 'Word',        icon: Eye,         fn: revealWord,   disabled: selectedWordIdx === null, primary: false },
      { label: 'Reset',         short: 'Reset',       icon: RotateCcw,   fn: resetPuzzle,  disabled: false, ghost: true },
    ];

    if (mobile) {
      return (
        <div className="grid grid-cols-2 gap-2 mt-3">
          {btns.map(btn => (
            <button
              key={btn.label}
              onClick={btn.fn}
              disabled={btn.disabled}
              className="flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40"
              style={{
                minHeight: 50,
                backgroundColor: btn.primary ? '#C9955A' : btn.ghost ? 'transparent' : 'var(--col-surface-secondary)',
                border: btn.ghost ? '1px solid var(--col-border)' : btn.primary ? 'none' : '1px solid var(--col-border)',
                color: btn.primary ? 'white' : 'var(--col-body)',
                gridColumn: btn.label === 'Check All' ? 'span 2' : undefined,
              }}
            >
              <btn.icon className="h-4 w-4 shrink-0" />
              {btn.short}
            </button>
          ))}
          <button
            className="col-span-2 flex items-center justify-center gap-2 rounded-xl text-sm py-3 transition-colors"
            style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)', color: 'var(--col-secondary)', minHeight: 44 }}
            onClick={() => setShowRu(!showRu)}
          >
            <Globe className="h-3.5 w-3.5" />
            {showRu ? 'Hide Russian hints' : 'Show Russian hints'}
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {btns.map(btn => (
          <button
            key={btn.label}
            onClick={btn.fn}
            disabled={btn.disabled}
            className="flex items-center gap-1.5 px-4 rounded-xl font-medium text-sm transition-colors disabled:opacity-40"
            style={{
              minHeight: 44,
              backgroundColor: btn.primary ? '#C9955A' : btn.ghost ? 'transparent' : 'var(--col-surface-secondary)',
              border: btn.ghost ? 'none' : btn.primary ? 'none' : '1px solid var(--col-border)',
              color: btn.primary ? 'white' : 'var(--col-secondary)',
            }}
          >
            <btn.icon className="h-4 w-4" />
            {btn.label}
          </button>
        ))}
        <button
          className="flex items-center gap-1.5 px-3 rounded-xl text-sm transition-colors"
          style={{ color: 'var(--col-muted)', minHeight: 44 }}
          onClick={() => setShowRu(!showRu)}
        >
          <Globe className="h-3.5 w-3.5" />
          {showRu ? 'Hide RU' : 'Show RU'}
        </button>
      </div>
    );
  };

  return (
    <div className="mb-8 rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
      <div className="p-4 sm:p-6">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
          <div>
            <h2 className="font-bold text-lg" style={{ color: 'var(--col-heading)' }}>Crossword Challenge</h2>
            <p className="text-xs" style={{ color: 'var(--col-muted)' }}>Кроссворд · Unit 1 vocabulary reinforcement</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--col-tag-bg)', color: 'var(--col-tag-text)' }}>
            {filledCount}/{uniqueCells} filled
          </span>
        </div>

        <p className="text-sm mb-3 hidden sm:block" style={{ color: 'var(--col-secondary)' }}>
          Click a cell and type. Tab moves to the next word. Tap a cell twice to switch Across/Down.
        </p>
        <p className="text-sm mb-3 sm:hidden" style={{ color: 'var(--col-secondary)' }}>
          Tap a cell to select it, then use the keyboard below. Tap twice to switch direction.
        </p>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--col-divider)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: '#C9955A' }} />
          </div>
          <span className="text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--col-secondary)', minWidth: 36, textAlign: 'right' }}>{pct}%</span>
        </div>

        {/* Teacher controls */}
        {isTeacherMode && (
          <div className="mb-4 p-4 rounded-xl flex flex-wrap items-center gap-3"
            style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}>
            <GraduationCap className="h-4 w-4 shrink-0" style={{ color: '#C9955A' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--col-accent-text)' }}>Teacher Mode</span>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#C9955A', color: 'white', minHeight: 44 }} onClick={() => setTeacherRevealed(true)}>
              <Eye className="h-4 w-4" /> Reveal All Answers
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid var(--col-border)', color: 'var(--col-secondary)', minHeight: 44 }} onClick={resetPuzzle}>
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        )}

        {/* Active clue banner */}
        {selectedWordData && (
          <div className="mb-4 px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--col-accent-light)', borderLeft: '4px solid #C9955A' }}>
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold px-2 py-1 rounded-lg shrink-0" style={{ backgroundColor: '#C9955A', color: 'white', marginTop: 1 }}>
                {selectedWordData.number} {selectedWordData.dir === 'across' ? '→' : '↓'}
              </span>
              <div>
                <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--col-heading)' }}>{selectedWordData.clue}</p>
                {showRu && <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>{selectedWordData.clueRu}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Grid + clues — side by side on desktop, stacked on mobile */}
        <div className="flex flex-col lg:flex-row lg:gap-6">

          {/* Grid */}
          <div className="shrink-0 mb-4 lg:mb-0">
            <div className="overflow-x-auto">
              <div
                style={{ display: 'inline-block', border: '2px solid var(--col-border)', borderRadius: 12, overflow: 'hidden', minWidth: gridWidth }}
              >
                {Array.from({ length: GRID_ROWS }).map((_, r) => (
                  <div key={r} style={{ display: 'flex' }}>
                    {Array.from({ length: GRID_COLS }).map((_, c) => {
                      const cell = GRID[r]?.[c];
                      if (!cell || cell.isBlack) {
                        return <div key={c} style={{ width: cellSize, height: cellSize, minWidth: cellSize, backgroundColor: 'var(--col-sidebar)', flexShrink: 0 }} />;
                      }
                      const { bg, border, textColor } = getCellStyle(r, c);
                      const k = `${r},${c}`;
                      const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                      return (
                        <div
                          key={c}
                          className="crossword-cell relative select-none"
                          style={{ width: cellSize, height: cellSize, minWidth: cellSize, flexShrink: 0, backgroundColor: bg, border, cursor: 'pointer', position: 'relative' }}
                          onClick={() => selectCell(r, c)}
                        >
                          {cell.number && (
                            <span className="absolute leading-none font-bold" style={{ top: 1, left: 2, fontSize: Math.max(7, cellSize * 0.22), color: isSelected ? '#C9955A' : 'var(--col-muted)', zIndex: 1, pointerEvents: 'none' }}>
                              {cell.number}
                            </span>
                          )}
                          {/* Desktop: real input for keyboard */}
                          <input
                            type="text"
                            maxLength={1}
                            value={userInput[k] || ''}
                            readOnly
                            onKeyDown={(e) => handleCellKeyDown(e, r, c)}
                            onFocus={() => selectCell(r, c)}
                            className="hidden sm:block absolute inset-0 w-full h-full text-center font-bold uppercase bg-transparent border-none outline-none cursor-pointer"
                            style={{ color: textColor, fontSize: Math.max(11, cellSize * 0.38), caretColor: 'transparent' }}
                            tabIndex={isSelected ? 0 : -1}
                          />
                          {/* Mobile: plain text display */}
                          <span
                            className="sm:hidden absolute inset-0 flex items-center justify-center font-bold uppercase"
                            style={{ color: textColor, fontSize: Math.max(10, cellSize * 0.38), pointerEvents: 'none' }}
                          >
                            {userInput[k] || ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile virtual keyboard */}
            <div className="sm:hidden mt-4">
              <div className="grid grid-cols-9 gap-1 mb-1.5">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
                  <button
                    key={letter}
                    className="flex items-center justify-center rounded-lg font-bold text-sm active:scale-95"
                    style={{ height: 42, backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)', color: 'var(--col-heading)', touchAction: 'manipulation' }}
                    onTouchStart={(e) => { e.preventDefault(); if (selectedCell) handleCellInput(selectedCell.r, selectedCell.c, letter); }}
                    onClick={() => { if (selectedCell) handleCellInput(selectedCell.r, selectedCell.c, letter); }}
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <button
                className="w-full flex items-center justify-center gap-2 rounded-xl font-semibold text-sm"
                style={{ height: 46, backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', touchAction: 'manipulation' }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  if (!selectedCell) return;
                  const { r, c } = selectedCell;
                  const k = `${r},${c}`;
                  if (userInput[k]) { setUserInput(p => { const n = { ...p }; delete n[k]; return n; }); setChecked(p => { const n = { ...p }; delete n[k]; return n; }); }
                  else moveToPrev(r, c, selectedDir);
                }}
                onClick={() => {
                  if (!selectedCell) return;
                  const { r, c } = selectedCell;
                  const k = `${r},${c}`;
                  if (userInput[k]) { setUserInput(p => { const n = { ...p }; delete n[k]; return n; }); setChecked(p => { const n = { ...p }; delete n[k]; return n; }); }
                  else moveToPrev(r, c, selectedDir);
                }}
              >
                ← Backspace
              </button>
              <ActionBar mobile />
            </div>

            {/* Desktop action bar */}
            <div className="hidden sm:block">
              <ActionBar />
            </div>
          </div>

          {/* Clues panel */}
          <div className="flex-1 min-w-0">
            {/* Mobile clues toggle */}
            <button
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl lg:hidden"
              style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)', minHeight: 52 }}
              onClick={() => setShowClues(!showClues)}
            >
              <span className="text-sm font-semibold" style={{ color: 'var(--col-heading)' }}>Clues · Подсказки</span>
              {showClues ? <ChevronUp className="h-5 w-5" style={{ color: 'var(--col-muted)' }} /> : <ChevronDown className="h-5 w-5" style={{ color: 'var(--col-muted)' }} />}
            </button>

            <div className={`${showClues ? 'block' : 'hidden'} lg:block mt-2 lg:mt-0`}>
              <ClueList />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 mb-2">
          {[
            { color: 'var(--col-accent-light)', label: 'Selected word' },
            { color: '#FFFFFF', border: '2px solid #C9955A', label: 'Active cell' },
            { color: '#4A8C6A', label: 'Correct', textW: true },
            { color: '#C05050', label: 'Wrong', textW: true },
            { color: '#FEF9EE', border: '1px solid #D4B86A', label: 'Revealed' },
          ].map(item => (
            <span key={item.label} className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--col-muted)' }}>
              <span className="w-4 h-4 rounded-sm shrink-0 inline-block" style={{ backgroundColor: item.color, border: item.border || '1px solid var(--col-border)' }} />
              {item.label}
            </span>
          ))}
        </div>

        {/* Completion card */}
        {completionState && (
          <div className="rounded-2xl p-6 text-center mt-4" style={{ backgroundColor: 'var(--col-accent-light)', border: '2px solid var(--col-divider)' }}>
            <Trophy className="h-14 w-14 mx-auto mb-3" style={{ color: '#C9955A' }} />
            <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--col-heading)' }}>Crossword Complete!</h3>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {[
                { value: completionState.solved, label: 'Solved alone', color: '#C9955A' },
                { value: completionState.helped, label: 'Used hints', color: '#B87820' },
                { value: completionState.total,  label: 'Total words', color: 'var(--col-heading)' },
              ].map(item => (
                <div key={item.label} className="px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)', minWidth: 90 }}>
                  <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-xs" style={{ color: 'var(--col-muted)' }}>{item.label}</p>
                </div>
              ))}
            </div>
            {completionState.helped > 0 && (
              <div className="flex items-center justify-center gap-1.5 text-xs px-4 py-2.5 rounded-xl mb-4" style={{ backgroundColor: '#FEF9EE', border: '1px solid #D4B86A', color: '#8B6914' }}>
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                Words where you used hints have been added to Weak Words for review.
              </div>
            )}
            <p className="text-sm font-medium mb-5" style={{ color: 'var(--col-body)' }}>
              {completionState.solved === completionState.total ? '⭐ Perfect — solved everything without help!' : completionState.solved >= completionState.total * 0.7 ? '✓ Well done! Review hinted words in Glossary.' : 'Practice the vocabulary more and try again.'}
            </p>
            <button
              className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl text-sm font-semibold"
              style={{ border: '2px solid #C9955A', color: '#C9955A', minHeight: 48 }}
              onClick={resetPuzzle}
            >
              <RotateCcw className="h-4 w-4" /> Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}