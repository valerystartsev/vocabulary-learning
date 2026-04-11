import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { CheckCircle, Eye, RotateCcw, Lightbulb, Trophy, AlertTriangle, ChevronDown, ChevronUp, GraduationCap, Globe } from 'lucide-react';

/* ──────────────────────────────────────────────
   Unit 2 Crossword data — Adaptation Investing
   Source: adaptation_crossword_base44.json
   Topic: Economics & Finance (Unit 2 vocabulary)
   ────────────────────────────────────────────── */
const WORDS = [
  // Across
  { number: 1,  word: 'VALUE',     dir: 'across', row: 0,  col: 2,  clue: 'The worth of something in money.',                              clueRu: 'Стоимость чего-либо.' },
  { number: 5,  word: 'FUND',      dir: 'across', row: 2,  col: 3,  clue: 'A pool of money used for investment.',                          clueRu: 'Пул денег для инвестирования.' },
  { number: 8,  word: 'FLUCTUATE', dir: 'across', row: 4,  col: 0,  clue: 'To go up and down in value or price.',                          clueRu: 'Колебаться — расти и падать.' },
  { number: 10, word: 'GROWTH',    dir: 'across', row: 5,  col: 8,  clue: 'An increase in size, value, or profit.',                        clueRu: 'Рост — увеличение размера, стоимости.' },
  { number: 13, word: 'INTEREST',  dir: 'across', row: 7,  col: 1,  clue: 'Extra money paid on savings or a loan.',                        clueRu: 'Проценты по вкладу или кредиту.' },
  { number: 14, word: 'SAVINGS',   dir: 'across', row: 9,  col: 7,  clue: 'Money kept for future use.',                                    clueRu: 'Деньги, отложенные на будущее.' },
  { number: 15, word: 'MONEY',     dir: 'across', row: 10, col: 2,  clue: 'What people use to buy things and pay for services.',           clueRu: 'То, чем люди платят за товары.' },
  { number: 16, word: 'RETURN',    dir: 'across', row: 11, col: 2,  clue: 'The money you get back from an investment.',                    clueRu: 'Доход / возврат от инвестиций.' },
  // Down
  { number: 2,  word: 'AFFECT',    dir: 'down',   row: 0,  col: 3,  clue: 'To influence or change something.',                            clueRu: 'Влиять на что-то.' },
  { number: 3,  word: 'INVEST',    dir: 'down',   row: 0,  col: 12, clue: 'To put money into something to make a profit.',                 clueRu: 'Вкладывать деньги с целью прибыли.' },
  { number: 4,  word: 'PROFIT',    dir: 'down',   row: 1,  col: 0,  clue: 'The money left after paying all costs.',                        clueRu: 'Прибыль — деньги после расходов.' },
  { number: 6,  word: 'DEAL',      dir: 'down',   row: 2,  col: 6,  clue: 'An agreement between buyer and seller.',                        clueRu: 'Сделка — соглашение покупателя и продавца.' },
  { number: 7,  word: 'NEGOTIATE', dir: 'down',   row: 3,  col: 8,  clue: 'To discuss and agree on terms.',                               clueRu: 'Вести переговоры об условиях.' },
  { number: 9,  word: 'LOSS',      dir: 'down',   row: 4,  col: 10, clue: 'When you spend more money than you receive.',                   clueRu: 'Убыток — тратите больше, чем получаете.' },
  { number: 11, word: 'INCOME',    dir: 'down',   row: 6,  col: 2,  clue: 'Money received regularly from work or investment.',             clueRu: 'Доход — деньги, получаемые регулярно.' },
  { number: 12, word: 'BROKER',    dir: 'down',   row: 6,  col: 5,  clue: 'A person who buys and sells on behalf of others.',             clueRu: 'Брокер — посредник в сделках.' },
];

/* Build grid from word list */
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

const { grid: GRID, rows: GRID_ROWS, cols: GRID_COLS } = buildGrid(WORDS);

function getWordAtCell(r, c, dir) {
  const cell = GRID[r]?.[c];
  if (!cell || cell.isBlack) return null;
  const match = cell.wordIds.find(wid => WORDS[wid.wordIdx].dir === dir);
  return match ? match.wordIdx : null;
}

function getWordCells(wordIdx) {
  const w = WORDS[wordIdx];
  return Array.from({ length: w.word.length }, (_, i) => ({
    r: w.dir === 'across' ? w.row : w.row + i,
    c: w.dir === 'across' ? w.col + i : w.col,
    pos: i,
  }));
}

function getCellSize() {
  if (typeof window === 'undefined') return 34;
  const vw = window.innerWidth;
  if (vw < 400) return 22;
  if (vw < 640) return 26;
  return 34;
}

export default function Unit2Crossword({ isTeacherMode }) {
  const [cellSize, setCellSize] = useState(getCellSize);
  useEffect(() => {
    const h = () => setCellSize(getCellSize());
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const { addWeakWordsFromExercise, markSectionComplete, saveCrosswordScore } = useProgress();
  const [userInput, setUserInput] = useState({});
  const [checked, setChecked] = useState({});
  const [revealed, setRevealed] = useState(new Set());
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedDir, setSelectedDir] = useState('across');
  const [selectedWordIdx, setSelectedWordIdx] = useState(null);
  const [completionState, setCompletionState] = useState(null);
  const [showClues, setShowClues] = useState(true);
  const [showRu, setShowRu] = useState(false);
  const [teacherRevealed, setTeacherRevealed] = useState(false);

  // Ref map for inputs so we can imperatively focus them
  const inputRefs = useRef({});

  useEffect(() => {
    if (isTeacherMode && teacherRevealed) {
      const inp = {};
      WORDS.forEach(w => {
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

  // Focus the selected cell's input whenever selectedCell changes
  useEffect(() => {
    if (selectedCell) {
      const k = `${selectedCell.r},${selectedCell.c}`;
      const inp = inputRefs.current[k];
      if (inp) {
        // Use setTimeout to allow React to flush the render first
        setTimeout(() => inp.focus(), 0);
      }
    }
  }, [selectedCell]);

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
    if (dir === 'across') {
      const nc = c + 1;
      if (nc < GRID_COLS && !GRID[r]?.[nc]?.isBlack) {
        setSelectedCell({ r, c: nc });
        setSelectedWordIdx(getWordAtCell(r, nc, dir));
      }
    } else {
      const nr = r + 1;
      if (nr < GRID_ROWS && !GRID[nr]?.[c]?.isBlack) {
        setSelectedCell({ r: nr, c });
        setSelectedWordIdx(getWordAtCell(nr, c, dir));
      }
    }
  }, []);

  const moveToPrev = useCallback((r, c, dir) => {
    if (dir === 'across') {
      const nc = c - 1;
      if (nc >= 0 && !GRID[r]?.[nc]?.isBlack) {
        setSelectedCell({ r, c: nc });
        setSelectedWordIdx(getWordAtCell(r, nc, dir));
      }
    } else {
      const nr = r - 1;
      if (nr >= 0 && !GRID[nr]?.[c]?.isBlack) {
        setSelectedCell({ r: nr, c });
        setSelectedWordIdx(getWordAtCell(nr, c, dir));
      }
    }
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
      if (userInput[k]) {
        setUserInput(p => { const n = { ...p }; delete n[k]; return n; });
        setChecked(p => { const n = { ...p }; delete n[k]; return n; });
      } else {
        moveToPrev(r, c, selectedDir);
      }
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
    const next = (selectedWordIdx + delta + WORDS.length) % WORDS.length;
    const w = WORDS[next];
    setSelectedWordIdx(next);
    setSelectedDir(w.dir);
    setSelectedCell({ r: w.row, c: w.col });
  };

  const isInSelectedWord = (r, c) => {
    if (selectedWordIdx === null) return false;
    return getWordCells(selectedWordIdx).some(cell => cell.r === r && cell.c === c);
  };

  const checkAll = () => {
    const newChecked = {};
    WORDS.forEach(w => {
      for (let i = 0; i < w.word.length; i++) {
        const r = w.dir === 'across' ? w.row : w.row + i;
        const c = w.dir === 'across' ? w.col + i : w.col;
        const k = `${r},${c}`;
        if (userInput[k]) newChecked[k] = userInput[k] === w.word[i] ? 'correct' : 'wrong';
      }
    });
    setChecked(newChecked);
    const wordResults = WORDS.map((w, wi) => {
      const cells = getWordCells(wi);
      const allCorrect = cells.every(({ r, c, pos }) => (userInput[`${r},${c}`] || '') === w.word[pos]);
      const usedReveal = cells.some(({ r, c }) => revealed.has(`${r},${c}`));
      return { allCorrect, usedReveal };
    });
    if (wordResults.every(r => r.allCorrect)) {
      const solved = wordResults.filter(r => r.allCorrect && !r.usedReveal).length;
      const helped = wordResults.filter(r => r.allCorrect && r.usedReveal).length;
      setCompletionState({ solved, helped, total: WORDS.length });
      markSectionComplete?.(2, 'crossword');
      saveCrosswordScore?.(2, { solved, helped, total: WORDS.length });
      const weakIds = WORDS
        .filter((_, wi) => wordResults[wi].usedReveal || !wordResults[wi].allCorrect)
        .map(w => `u2_${w.word.toLowerCase()}`);
      if (weakIds.length > 0) addWeakWordsFromExercise(weakIds);
    }
  };

  const checkWord = () => {
    if (selectedWordIdx === null) return;
    const cells = getWordCells(selectedWordIdx);
    const newChecked = { ...checked };
    cells.forEach(({ r, c, pos }) => {
      const k = `${r},${c}`;
      if (userInput[k]) newChecked[k] = userInput[k] === WORDS[selectedWordIdx].word[pos] ? 'correct' : 'wrong';
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
      newInput[k] = WORDS[selectedWordIdx].word[pos];
      newRevealed.add(k);
    });
    setUserInput(newInput);
    setRevealed(newRevealed);
    setChecked(p => { const n = { ...p }; cells.forEach(({ r, c }) => delete n[`${r},${c}`]); return n; });
  };

  const resetPuzzle = () => {
    setUserInput({}); setChecked({}); setRevealed(new Set());
    setCompletionState(null); setSelectedCell(null); setSelectedWordIdx(null); setTeacherRevealed(false);
  };

  const uniqueCells = new Set(
    WORDS.flatMap(w => Array.from({ length: w.word.length }, (_, i) =>
      w.dir === 'across' ? `${w.row},${w.col + i}` : `${w.row + i},${w.col}`
    ))
  ).size;
  const filledCount = Object.keys(userInput).length;
  const selectedWordData = selectedWordIdx !== null ? WORDS[selectedWordIdx] : null;

  const getCellStyleFn = (r, c) => {
    const k = `${r},${c}`;
    const isSelected = selectedCell?.r === r && selectedCell?.c === c;
    const inWord = isInSelectedWord(r, c);
    const isCorrect = checked[k] === 'correct';
    const isWrong = checked[k] === 'wrong';
    const isRev = revealed.has(k);

    let bg = 'var(--col-surface)';
    let border = '1px solid #2C3B3C';
    let textColor = 'var(--col-heading)';

    if (isCorrect)       { bg = 'var(--col-accent)'; textColor = 'white'; border = '1px solid var(--col-accent)'; }
    else if (isWrong)    { bg = 'var(--col-incorrect)'; textColor = 'white'; border = '1px solid var(--col-incorrect)'; }
    else if (isRev)      { bg = '#FFF8E7'; textColor = '#856404'; border = '1px solid #ECD9A0'; }
    else if (isSelected) { bg = '#F0F7F4'; border = '2px solid var(--col-accent)'; }
    else if (inWord)     { bg = 'var(--col-accent-light)'; border = '1px solid var(--col-divider)'; }

    return { bg, border, textColor };
  };

  const renderGrid = () =>
    Array.from({ length: GRID_ROWS }).map((_, r) => (
      <div key={r} style={{ display: 'flex' }}>
        {Array.from({ length: GRID_COLS }).map((_, c) => {
          const cell = GRID[r]?.[c];
          if (!cell || cell.isBlack) {
            return (
              <div
                key={c}
                style={{ width: cellSize, height: cellSize, minWidth: cellSize, backgroundColor: 'var(--col-sidebar)', flexShrink: 0 }}
              />
            );
          }
          const { bg, border, textColor } = getCellStyleFn(r, c);
          const k = `${r},${c}`;
          const isSelected = selectedCell?.r === r && selectedCell?.c === c;
          return (
            <div
              key={c}
              className="crossword-cell relative select-none"
              style={{ width: cellSize, height: cellSize, minWidth: cellSize, flexShrink: 0, backgroundColor: bg, border, cursor: 'pointer' }}
              onClick={() => selectCell(r, c)}
            >
              {cell.number && (
                <span
                  className="absolute leading-none font-bold"
                  style={{ top: 1, left: 2, fontSize: Math.max(7, cellSize * 0.22), color: isSelected ? 'var(--col-accent)' : 'var(--col-muted)', zIndex: 1, pointerEvents: 'none' }}
                >
                  {cell.number}
                </span>
              )}
              {/* Desktop: real focusable input */}
              <input
                key={`input-${k}`}
                ref={el => { inputRefs.current[k] = el; }}
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
                style={{ color: textColor, fontSize: Math.max(9, cellSize * 0.38), pointerEvents: 'none' }}
              >
                {userInput[k] || ''}
              </span>
            </div>
          );
        })}
      </div>
    ));

  const ClueList = ({ direction }) => (
    <div>
      <h4 className="text-xs font-bold uppercase mb-2 tracking-wider" style={{ color: 'var(--col-muted)' }}>
        {direction === 'across' ? 'Across →' : 'Down ↓'}
      </h4>
      <div className="space-y-0.5">
        {WORDS.filter(w => w.dir === direction).map(w => {
          const wIdx = WORDS.indexOf(w);
          const isActive = selectedWordIdx === wIdx;
          const cells = getWordCells(wIdx);
          const solved = cells.every(({ r, c, pos }) => (userInput[`${r},${c}`] || '') === w.word[pos]);
          return (
            <button
              key={w.number}
              onClick={() => { setSelectedWordIdx(wIdx); setSelectedDir(direction); setSelectedCell({ r: w.row, c: w.col }); }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all"
              style={{
                minHeight: 44,
                backgroundColor: isActive ? 'var(--col-accent-light)' : solved ? '#F0FAF5' : 'transparent',
                borderLeft: isActive ? '3px solid var(--col-accent)' : '3px solid transparent',
                color: solved ? '#2D6050' : 'var(--col-body)',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <span className="font-bold mr-1" style={{ color: 'var(--col-accent)' }}>{w.number}.</span>
              {w.clue}
              {showRu && <span className="block text-[10px] italic mt-0.5" style={{ color: 'var(--col-muted)' }}>{w.clueRu}</span>}
              {solved && <span className="ml-1 text-[10px] font-medium" style={{ color: 'var(--col-correct)' }}>✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className="mb-8 rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
          <div>
            <h2 className="font-semibold text-lg" style={{ color: 'var(--col-heading)' }}>
              Unit 2 Crossword
            </h2>
            <p className="text-xs" style={{ color: 'var(--col-muted)' }}>
              Кроссворд по юниту 2 · Economics &amp; Finance vocabulary
            </p>
          </div>
          <span
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{ backgroundColor: 'var(--col-tag-bg)', color: 'var(--col-tag-text)' }}
          >
            {filledCount}/{uniqueCells} filled
          </span>
        </div>

        <p className="text-sm mb-1" style={{ color: 'var(--col-secondary)' }}>
          Click a cell and type. Tab moves to the next word. Click twice to switch Across/Down.
        </p>
        <p className="text-xs italic mb-4" style={{ color: 'var(--col-muted)' }}>
          Нажмите на ячейку и начните печатать. Tab переходит к следующему слову.
        </p>

        {/* Teacher controls */}
        {isTeacherMode && (
          <div className="mb-4 p-4 rounded-xl flex flex-wrap items-center gap-3" style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}>
            <GraduationCap className="h-4 w-4 shrink-0" style={{ color: 'var(--col-accent)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--col-accent-text)' }}>Teacher Mode</span>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--col-accent)', color: 'white', minHeight: 44 }} onClick={() => setTeacherRevealed(true)}>
              <Eye className="h-4 w-4" /> Reveal All Answers
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid var(--col-border)', color: 'var(--col-secondary)', minHeight: 44 }} onClick={resetPuzzle}>
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        )}

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--col-divider)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.round((filledCount / uniqueCells) * 100)}%`, backgroundColor: 'var(--col-accent)' }}
            />
          </div>
          <span className="text-xs whitespace-nowrap" style={{ color: 'var(--col-muted)' }}>
            {Math.round((filledCount / uniqueCells) * 100)}%
          </span>
        </div>

        {/* Active clue banner */}
        {selectedWordData && (
          <div
            className="mb-4 px-4 py-3 rounded-lg"
            style={{ backgroundColor: 'var(--col-accent-light)', borderLeft: '3px solid var(--col-accent)' }}
          >
            <div className="flex items-start gap-2">
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                style={{ backgroundColor: 'var(--col-accent)', color: 'white' }}
              >
                {selectedWordData.number} {selectedWordData.dir === 'across' ? '→' : '↓'}
              </span>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--col-heading)' }}>{selectedWordData.clue}</p>
                {showRu && (
                  <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>{selectedWordData.clueRu}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Grid + clues */}
        <div className="flex flex-col lg:flex-row lg:gap-6">

          {/* Grid */}
          <div className="shrink-0 mb-4 lg:mb-0">
            <div className="overflow-x-auto">
              <div style={{ display: 'inline-block', border: '2px solid var(--col-border)', borderRadius: 12, overflow: 'hidden', minWidth: GRID_COLS * cellSize }}>
                {renderGrid()}
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
              {/* Mobile action buttons */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {[
                  { label: 'Check Word', icon: CheckCircle, fn: checkWord, disabled: selectedWordIdx === null },
                  { label: 'Check All',  icon: CheckCircle, fn: checkAll,  disabled: false, primary: true },
                  { label: 'Letter',     icon: Lightbulb,   fn: revealLetter, disabled: !selectedCell },
                  { label: 'Word',       icon: Eye,         fn: revealWord,   disabled: selectedWordIdx === null },
                  { label: 'Reset',      icon: RotateCcw,   fn: resetPuzzle,  disabled: false },
                ].map(btn => (
                  <button key={btn.label} onClick={btn.fn} disabled={btn.disabled}
                    className="flex items-center justify-center gap-2 rounded-xl font-semibold text-sm disabled:opacity-40"
                    style={{ minHeight: 50, backgroundColor: btn.primary ? 'var(--col-accent)' : 'var(--col-surface-secondary)', border: btn.primary ? 'none' : '1px solid var(--col-border)', color: btn.primary ? 'white' : 'var(--col-body)', gridColumn: btn.label === 'Check All' ? 'span 2' : undefined }}>
                    <btn.icon className="h-4 w-4 shrink-0" />{btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop action buttons */}
            <div className="hidden sm:flex flex-wrap gap-2 mt-3">
              {[
                { label: 'Check Word',    icon: CheckCircle, fn: checkWord,    disabled: selectedWordIdx === null },
                { label: 'Check All',     icon: CheckCircle, fn: checkAll,     disabled: false, primary: true },
                { label: 'Reveal Letter', icon: Lightbulb,   fn: revealLetter, disabled: !selectedCell },
                { label: 'Reveal Word',   icon: Eye,         fn: revealWord,   disabled: selectedWordIdx === null },
                { label: 'Reset',         icon: RotateCcw,   fn: resetPuzzle,  disabled: false, ghost: true },
              ].map(btn => (
                <button key={btn.label} onClick={btn.fn} disabled={btn.disabled}
                  className="flex items-center gap-1.5 px-4 rounded-xl font-medium text-sm disabled:opacity-40"
                  style={{ minHeight: 44, backgroundColor: btn.primary ? 'var(--col-accent)' : btn.ghost ? 'transparent' : 'var(--col-surface-secondary)', border: btn.ghost ? 'none' : btn.primary ? 'none' : '1px solid var(--col-border)', color: btn.primary ? 'white' : 'var(--col-secondary)' }}>
                  <btn.icon className="h-4 w-4" />{btn.label}
                </button>
              ))}
              <button className="flex items-center gap-1.5 px-3 rounded-xl text-sm" style={{ color: 'var(--col-muted)', minHeight: 44 }} onClick={() => setShowRu(!showRu)}>
                <Globe className="h-3.5 w-3.5 mr-1" />
                {showRu ? 'Hide RU' : 'Show RU'}
              </button>
            </div>
          </div>

          {/* Clues panel */}
          <div className="flex-1 min-w-0">
            <button
              className="w-full flex items-center justify-between px-4 rounded-xl mb-2 lg:hidden"
              style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)', minHeight: 52 }}
              onClick={() => setShowClues(!showClues)}
            >
              <span className="text-sm font-semibold" style={{ color: 'var(--col-heading)' }}>Clues · Подсказки</span>
              {showClues ? <ChevronUp className="h-5 w-5" style={{ color: 'var(--col-muted)' }} /> : <ChevronDown className="h-5 w-5" style={{ color: 'var(--col-muted)' }} />}
            </button>
            <div className={`${showClues ? 'block' : 'hidden'} lg:block`}>
              <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                <ClueList direction="across" />
                <ClueList direction="down" />
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3 mb-4">
          {[
            { color: 'var(--col-accent-light)', label: 'Selected word' },
            { color: '#F0F7F4', border: '2px solid var(--col-accent)', label: 'Active cell' },
            { color: 'var(--col-accent)', label: 'Correct', textW: true },
            { color: 'var(--col-incorrect)', label: 'Wrong', textW: true },
            { color: '#FFF8E7', label: 'Revealed', border: '1px solid #ECD9A0' },
          ].map(item => (
            <span key={item.label} className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--col-muted)' }}>
              <span className="w-3.5 h-3.5 rounded shrink-0 inline-block" style={{ backgroundColor: item.color, border: item.border || '1px solid var(--col-border)' }} />
              {item.label}
            </span>
          ))}
        </div>

        {/* Completion card */}
        {completionState && (
          <div
            className="rounded-xl p-6 text-center mt-3"
            style={{ backgroundColor: 'var(--col-accent-light)', border: '2px solid var(--col-divider)' }}
          >
            <Trophy className="h-12 w-12 mx-auto mb-3" style={{ color: 'var(--col-accent)' }} />
            <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--col-heading)' }}>Unit 2 Crossword Complete!</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--col-muted)' }}>Кроссворд по юниту 2 завершён!</p>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {[
                { value: completionState.solved, label: 'Solved alone', color: 'var(--col-accent-text)' },
                { value: completionState.helped, label: 'Used hints', color: 'var(--col-warning)' },
                { value: completionState.total,  label: 'Total words', color: 'var(--col-heading)' },
              ].map(item => (
                <div key={item.label} className="px-4 py-2 rounded-xl" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
                  <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-xs" style={{ color: 'var(--col-muted)' }}>{item.label}</p>
                </div>
              ))}
            </div>
            {completionState.helped > 0 && (
              <div className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg mb-4"
                style={{ backgroundColor: '#FFF8E7', border: '1px solid #ECD9A0', color: '#856404' }}>
                <AlertTriangle className="h-3.5 w-3.5" />
                Words where you needed hints added to Weak Words.
              </div>
            )}
            <p className="text-sm font-medium mb-4" style={{ color: 'var(--col-body)' }}>
              {completionState.solved === completionState.total
                ? 'Perfect — all Unit 2 words solved without help.'
                : completionState.solved >= completionState.total * 0.7
                ? 'Well done. Review hinted words in the Glossary.'
                : 'Practice Unit 2 vocabulary more and try again.'}
            </p>
            <button
              className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl text-sm font-semibold"
              style={{ border: '2px solid var(--col-accent)', color: 'var(--col-accent)', minHeight: 48 }}
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