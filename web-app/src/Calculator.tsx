import { useState, useEffect, useRef } from 'react';
import { sumHistory } from './utils';

interface CalculatorProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (usdHistory: string[], lbpHistory: string[]) => void;
  defaultTab: 'USD' | 'LBP';
  usdHistory: string[];
  lbpHistory: string[];
  t: { go: string; close: string };
}

export default function Calculator({ visible, onClose, onSubmit, defaultTab, usdHistory, lbpHistory, t }: CalculatorProps) {
  const [inputBuffer, setInputBuffer] = useState('');
  const [pendingOp, setPendingOp] = useState<'+' | '-'>('+');
  const [tab, setTab] = useState<'USD' | 'LBP'>('LBP');
  const [localUsd, setLocalUsd] = useState<string[]>([]);
  const [localLbp, setLocalLbp] = useState<string[]>([]);

  // Refs to access latest state in keyboard handler
  const stateRef = useRef({ inputBuffer, pendingOp, tab, localUsd, localLbp });
  stateRef.current = { inputBuffer, pendingOp, tab, localUsd, localLbp };

  useEffect(() => {
    if (visible) {
      setLocalUsd([...usdHistory]);
      setLocalLbp([...lbpHistory]);
      setTab(defaultTab);
      setInputBuffer('');
      setPendingOp('+');
    }
  }, [visible]);

  // Keyboard support
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (key >= '0' && key <= '9') {
        e.preventDefault();
        setInputBuffer(prev => prev + key);
      } else if (key === '+') {
        e.preventDefault();
        doOperator('+');
      } else if (key === '-') {
        e.preventDefault();
        doOperator('-');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        doEquals();
      } else if (key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (key === 'Backspace') {
        e.preventDefault();
        setInputBuffer(prev => prev.slice(0, -1));
      } else if (key === 'Delete') {
        e.preventDefault();
        doClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, onClose]);

  // Helper to commit from ref state (for keyboard handler)
  const doCommit = () => {
    const s = stateRef.current;
    if (!s.inputBuffer) return;
    const entry = `${s.pendingOp}${s.inputBuffer}`;
    const history = s.tab === 'USD' ? s.localUsd : s.localLbp;
    const newHistory = [...history, entry];
    if (s.tab === 'USD') setLocalUsd(newHistory);
    else setLocalLbp(newHistory);
    setInputBuffer('');
  };

  const doOperator = (op: '+' | '-') => {
    doCommit();
    setPendingOp(op);
  };

  const doEquals = () => {
    doCommit();
    setPendingOp('+');
  };

  const doClear = () => {
    const s = stateRef.current;
    setInputBuffer('');
    setPendingOp('+');
    if (s.tab === 'USD') setLocalUsd([]);
    else setLocalLbp([]);
  };

  if (!visible) return null;

  const getHistory = () => tab === 'USD' ? localUsd : localLbp;
  const otherTotal = sumHistory(tab === 'USD' ? localLbp : localUsd);
  const currentTotal = sumHistory(getHistory());

  const removeHistoryEntry = (index: number) => {
    const history = getHistory();
    const newHistory = history.filter((_, i) => i !== index);
    if (tab === 'USD') setLocalUsd(newHistory);
    else setLocalLbp(newHistory);
  };

  const commitEntry = (): { usd: string[]; lbp: string[] } => {
    if (!inputBuffer) return { usd: localUsd, lbp: localLbp };
    const entry = `${pendingOp}${inputBuffer}`;
    const newHistory = [...getHistory(), entry];
    if (tab === 'USD') {
      setLocalUsd(newHistory);
      return { usd: newHistory, lbp: localLbp };
    } else {
      setLocalLbp(newHistory);
      return { usd: localUsd, lbp: newHistory };
    }
  };

  const handleNumber = (num: string) => {
    setInputBuffer(prev => prev + num);
  };

  const handleOperator = (op: '+' | '-') => {
    doOperator(op);
  };

  const handleEquals = () => {
    doEquals();
  };

  const handleClear = () => {
    doClear();
  };

  const switchTab = (newTab: 'USD' | 'LBP') => {
    if (inputBuffer) commitEntry();
    setInputBuffer('');
    setPendingOp('+');
    setTab(newTab);
  };

  const handleSubmitClick = () => {
    const final = commitEntry();
    onSubmit(final.usd, final.lbp);
    onClose();
  };

  const displayStr = inputBuffer
    ? `${currentTotal !== 0 ? currentTotal.toLocaleString() + ' ' + pendingOp + ' ' : (pendingOp === '-' ? '- ' : '')}${parseFloat(inputBuffer).toLocaleString()}`
    : currentTotal.toLocaleString();

  const history = getHistory();

  return (
    <div className="calculator-overlay" onClick={onClose}>
      <div className="calculator" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="calc-close-btn">×</button>
        <div className="calc-target-toggle">
          <button className={`calc-target-btn ${tab === 'USD' ? 'active-usd' : ''}`} onClick={() => switchTab('USD')}>
            $ {tab !== 'USD' && otherTotal !== 0 ? `(${otherTotal.toLocaleString()})` : ''}
          </button>
          <button className={`calc-target-btn ${tab === 'LBP' ? 'active-lbp' : ''}`} onClick={() => switchTab('LBP')}>
            LBP {tab !== 'LBP' && otherTotal !== 0 ? `(${otherTotal.toLocaleString()})` : ''}
          </button>
        </div>
        <div className="calculator-display">{displayStr}</div>
        <div className="calc-history">
          {history.map((entry, i) => (
            <span key={i} className={`calc-history-entry clickable ${entry.startsWith('-') ? 'minus' : ''}`} onClick={() => removeHistoryEntry(i)}>{entry}</span>
          ))}
          {inputBuffer && (
            <span className={`calc-history-entry ${pendingOp === '-' ? 'minus' : ''} pending`}>{pendingOp}{inputBuffer}</span>
          )}
        </div>
        <div className="calculator-buttons">
          <button onClick={() => handleNumber('7')} className="calc-btn">7</button>
          <button onClick={() => handleNumber('8')} className="calc-btn">8</button>
          <button onClick={() => handleNumber('9')} className="calc-btn">9</button>
          <button onClick={() => setInputBuffer(prev => prev.slice(0, -1))} className="calc-btn clear">⌫</button>
          <button onClick={() => handleNumber('4')} className="calc-btn">4</button>
          <button onClick={() => handleNumber('5')} className="calc-btn">5</button>
          <button onClick={() => handleNumber('6')} className="calc-btn">6</button>
          <button onClick={() => handleOperator('-')} className="calc-btn operator">-</button>
          <button onClick={() => handleNumber('1')} className="calc-btn">1</button>
          <button onClick={() => handleNumber('2')} className="calc-btn">2</button>
          <button onClick={() => handleNumber('3')} className="calc-btn">3</button>
          <button onClick={() => handleOperator('+')} className="calc-btn operator">+</button>
          <button onClick={handleClear} className="calc-btn clear">C</button>
          <button onClick={() => handleNumber('0')} className="calc-btn">0</button>
          <button onClick={() => handleNumber('00')} className="calc-btn">00</button>
          <button onClick={handleEquals} className="calc-btn operator">=</button>
          <button onClick={handleSubmitClick} className="calc-btn go">{t.go}</button>
        </div>
      </div>
    </div>
  );
}
