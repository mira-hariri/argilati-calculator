import { useState, useRef, useEffect } from 'react';
import './App.css';

const EXCHANGE_RATE = 89000;
const EXCHANGE_RATE_USD_TOTAL = 89000;

const translations = {
  en: {
    title: 'أرغيلتي Calculator',
    calculator: 'Calculator',
    total: 'Total',
    totalUsd: 'Total ($)',
    totalLbp: 'Total (LBP)',
    customerPaid: 'Customer Paid',
    returnToCustomer: 'Return to Customer',
    customerOwes: 'Customer Still Owes',
    totalChange: 'Total Change',
    usdAmount: 'USD Amount',
    max: 'max',
    close: 'Close',
    go: 'Go',
    enterAmount: 'Enter amount',
    enterPaidAmount: 'Enter paid amount',
    clear: 'Clear'
  },
  ar: {
    title: 'حاسبة أرغيلتي',
    calculator: 'آلة حاسبة',
    total: 'المجموع',
    totalUsd: 'المجموع ($)',
    totalLbp: 'المجموع (ل.ل)',
    customerPaid: 'دفع الزبون',
    returnToCustomer: 'الباقي للزبون',
    customerOwes: 'الزبون مدين',
    totalChange: 'مجموع الباقي',
    usdAmount: 'المبلغ بالدولار',
    max: 'الحد الأقصى',
    close: 'إغلاق',
    go: 'تطبيق',
    enterAmount: 'أدخل المبلغ',
    enterPaidAmount: 'أدخل المبلغ المدفوع',
    clear: 'مسح'
  }
};

function Calculator({ visible, onClose, onCalculateLbp, onCalculateUsd, defaultTab, initialUsd, initialLbp, t }: {
  visible: boolean;
  onClose: () => void;
  onCalculateLbp: (value: string) => void;
  onCalculateUsd: (value: string) => void;
  defaultTab: 'USD' | 'LBP';
  initialUsd: string;
  initialLbp: string;
  t: typeof translations.en;
}) {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState('');
  const [operator, setOperator] = useState('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [tab, setTab] = useState<'USD' | 'LBP'>('LBP');
  const [usdValue, setUsdValue] = useState('0');
  const [lbpValue, setLbpValue] = useState('0');

  useEffect(() => {
    if (visible) {
      const initUsd = initialUsd || '0';
      const initLbp = initialLbp || '0';
      setUsdValue(initUsd);
      setLbpValue(initLbp);
      setDisplay(defaultTab === 'USD' ? initUsd : initLbp);
      setCurrentValue('');
      setOperator('');
      setWaitingForOperand(true);
      setTab(defaultTab);
    }
  }, [visible]);

  if (!visible) return null;

  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);
    if (currentValue === '') {
      setCurrentValue(String(inputValue));
    } else if (operator) {
      const currentVal = parseFloat(currentValue);
      let newValue = currentVal;
      if (operator === '+') newValue = currentVal + inputValue;
      else if (operator === '-') newValue = currentVal - inputValue;
      setDisplay(String(newValue));
      setCurrentValue(String(newValue));
    }
    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);
    if (operator && currentValue !== '') {
      const currentVal = parseFloat(currentValue);
      let newValue = currentVal;
      if (operator === '+') newValue = currentVal + inputValue;
      else if (operator === '-') newValue = currentVal - inputValue;
      setDisplay(String(newValue));
      setCurrentValue('');
      setOperator('');
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setCurrentValue('');
    setOperator('');
    setWaitingForOperand(false);
  };

  const resolveDisplay = () => {
    if (operator && currentValue !== '') {
      const inputValue = parseFloat(display);
      const currentVal = parseFloat(currentValue);
      let newValue = currentVal;
      if (operator === '+') newValue = currentVal + inputValue;
      else if (operator === '-') newValue = currentVal - inputValue;
      setDisplay(String(newValue));
      setCurrentValue('');
      setOperator('');
      setWaitingForOperand(true);
      return String(newValue);
    }
    return display;
  };

  const switchTab = (newTab: 'USD' | 'LBP') => {
    const resolved = resolveDisplay();
    if (tab === 'USD') setUsdValue(resolved);
    else setLbpValue(resolved);
    setDisplay(newTab === 'USD' ? usdValue : lbpValue);
    setCurrentValue('');
    setOperator('');
    setWaitingForOperand(false);
    setTab(newTab);
  };

  const handleSubmit = () => {
    const resolved = resolveDisplay();
    const finalUsd = tab === 'USD' ? resolved : usdValue;
    const finalLbp = tab === 'LBP' ? resolved : lbpValue;
    if (parseFloat(finalUsd) !== 0) onCalculateUsd(finalUsd);
    if (parseFloat(finalLbp) !== 0) onCalculateLbp(finalLbp);
    onClose();
  };

  return (
    <div className="calculator-overlay" onClick={onClose}>
      <div className="calculator" onClick={(e) => e.stopPropagation()}>
        <div className="calc-target-toggle">
          <button
            className={`calc-target-btn ${tab === 'USD' ? 'active-usd' : ''}`}
            onClick={() => switchTab('USD')}
          >
            $ {tab !== 'USD' && usdValue !== '0' ? `(${parseFloat(usdValue).toLocaleString()})` : ''}
          </button>
          <button
            className={`calc-target-btn ${tab === 'LBP' ? 'active-lbp' : ''}`}
            onClick={() => switchTab('LBP')}
          >
            LBP {tab !== 'LBP' && lbpValue !== '0' ? `(${parseFloat(lbpValue).toLocaleString()})` : ''}
          </button>
        </div>
        <div className="calculator-display">{parseFloat(display).toLocaleString()}</div>
        <div className="calculator-buttons">
          <button onClick={handleClear} className="calc-btn clear">C</button>
          <button onClick={() => handleOperator('-')} className="calc-btn operator">-</button>
          <button onClick={() => handleOperator('+')} className="calc-btn operator">+</button>
          <button onClick={() => handleNumber('7')} className="calc-btn">7</button>
          <button onClick={() => handleNumber('8')} className="calc-btn">8</button>
          <button onClick={() => handleNumber('9')} className="calc-btn">9</button>
          <button onClick={() => handleNumber('4')} className="calc-btn">4</button>
          <button onClick={() => handleNumber('5')} className="calc-btn">5</button>
          <button onClick={() => handleNumber('6')} className="calc-btn">6</button>
          <button onClick={() => handleNumber('1')} className="calc-btn">1</button>
          <button onClick={() => handleNumber('2')} className="calc-btn">2</button>
          <button onClick={() => handleNumber('3')} className="calc-btn">3</button>
          <button onClick={() => handleNumber('0')} className="calc-btn zero">0</button>
          <button onClick={handleEquals} className="calc-btn operator">=</button>
          <button onClick={handleSubmit} className="calc-btn go">{t.go}</button>
        </div>
        <button onClick={onClose} className="calc-close">{t.close}</button>
      </div>
    </div>
  );
}

function App() {
  const [totalUsdAmount, setTotalUsdAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [paidCurrency, setPaidCurrency] = useState<'USD' | 'LBP'>('USD');
  const [result, setResult] = useState<{
    usd: number; lbp: number; maxUsd: number; totalUsd: number; totalLbp: number;
  } | null>(null);
  const [customUsd, setCustomUsd] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcDefaultTab, setCalcDefaultTab] = useState<'USD' | 'LBP'>('LBP');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const totalInputRef = useRef<HTMLInputElement>(null);

  const t = translations[language];

  useEffect(() => {
    if (totalInputRef.current) totalInputRef.current.focus();
  }, []);

  useEffect(() => {
    if ((totalUsdAmount || totalAmount) && paidAmount) {
      handleCalculate();
    } else {
      setResult(null);
    }
  }, [totalUsdAmount, totalAmount, paidAmount, paidCurrency]);

  const formatNumber = (value: string) => {
    const num = value.replace(/,/g, '');
    if (!num || isNaN(Number(num))) return '';
    return Number(num).toLocaleString('en-US');
  };

  const handleTotalChange = (value: string) => {
    const cleanValue = value.replace(/,/g, '');
    if (cleanValue === '' || !isNaN(Number(cleanValue))) setTotalAmount(cleanValue);
  };

  const handleTotalUsdChange = (value: string) => {
    const cleanValue = value.replace(/,/g, '');
    if (cleanValue === '' || !isNaN(Number(cleanValue))) setTotalUsdAmount(cleanValue);
  };

  const handlePaidChange = (value: string) => {
    const cleanValue = value.replace(/,/g, '');
    if (cleanValue === '' || !isNaN(Number(cleanValue))) setPaidAmount(cleanValue);
  };

  const handleCalculate = () => {
    const totalUsd = parseFloat(totalUsdAmount) || 0;
    const totalLbp = parseFloat(totalAmount) || 0;
    const paid = parseFloat(paidAmount) || 0;

    // Total USD uses rate 90,000, everything else uses 89,000
    const totalInLBP = (totalUsd * EXCHANGE_RATE_USD_TOTAL) + (totalLbp * 1000);
    const paidInLBP = paidCurrency === 'USD' ? paid * EXCHANGE_RATE : paid * 1000;
    const changeInLBP = paidInLBP - totalInLBP;

    if (changeInLBP < 0) {
      setResult({
        usd: 0,
        lbp: Math.round(changeInLBP),
        maxUsd: 0,
        totalUsd: changeInLBP / EXCHANGE_RATE,
        totalLbp: Math.round(changeInLBP)
      });
      setCustomUsd('0');
      return;
    }

    const changeInUSD = changeInLBP / EXCHANGE_RATE;
    const usdToReturn = Math.floor(changeInUSD / 5) * 5;
    const lbpToReturn = changeInLBP - (usdToReturn * EXCHANGE_RATE);

    setResult({
      usd: usdToReturn,
      lbp: Math.round(lbpToReturn),
      maxUsd: Math.floor(changeInUSD),
      totalUsd: changeInUSD,
      totalLbp: Math.round(changeInLBP)
    });
    setCustomUsd(usdToReturn.toString());
  };

  const handleCustomUsdChange = (value: string) => {
    setCustomUsd(value);
    if (result) {
      const usd = parseFloat(value) || 0;
      const newLbp = result.totalLbp - (usd * EXCHANGE_RATE);
      setResult({ ...result, usd, lbp: Math.round(newLbp) });
    }
  };

  const handleClearAll = () => {
    setTotalUsdAmount('');
    setTotalAmount('');
    setPaidAmount('');
    setResult(null);
    setCustomUsd('');
  };

  const openCalc = (tab: 'USD' | 'LBP') => {
    setCalcDefaultTab(tab);
    setShowCalculator(true);
  };

  return (
    <div className="container">
      <button className="language-toggle" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
        {language === 'en' ? 'AR' : 'EN'}
      </button>

      <h1>{t.title}</h1>

      <button className="calculator-toggle" onClick={() => openCalc('LBP')}>
        🧮 {t.calculator}
      </button>

      <Calculator
        visible={showCalculator}
        onClose={() => setShowCalculator(false)}
        onCalculateLbp={(value) => setTotalAmount(value)}
        onCalculateUsd={(value) => setTotalUsdAmount(value)}
        defaultTab={calcDefaultTab}
        initialUsd={totalUsdAmount}
        initialLbp={totalAmount}
        t={t}
      />

      <div className="form">
        <div className="totals-row">
          <div className="field-group">
            <div className="label-with-calc">
              <label>{t.totalUsd}</label>
              <button className="mini-calc-btn" onClick={() => openCalc('USD')}>🧮</button>
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={formatNumber(totalUsdAmount)}
              onChange={(e) => handleTotalUsdChange(e.target.value)}
              onFocus={() => setTotalUsdAmount('')}
              placeholder="$"
            />
          </div>
          <div className="field-group">
            <div className="label-with-calc">
              <label>{t.totalLbp}</label>
              <button className="mini-calc-btn" onClick={() => openCalc('LBP')}>🧮</button>
            </div>
            <div className="input-with-suffix">
              <input
                ref={totalInputRef}
                type="text"
                inputMode="numeric"
                value={formatNumber(totalAmount)}
                onChange={(e) => handleTotalChange(e.target.value)}
                onFocus={() => setTotalAmount('')}
                placeholder={t.enterAmount}
              />
              <span className="suffix">000</span>
            </div>
          </div>
        </div>

        <div className="field-group">
          <div className="label-with-toggle">
            <label>{t.customerPaid}</label>
            <button
              className={`toggle-inline ${paidCurrency === 'USD' ? 'usd' : 'lbp'}`}
              onClick={() => setPaidCurrency(paidCurrency === 'USD' ? 'LBP' : 'USD')}
            >
              {paidCurrency}
            </button>
          </div>
          {paidCurrency === 'LBP' ? (
            <div className="input-with-suffix">
              <input
                type="text"
                inputMode="numeric"
                value={formatNumber(paidAmount)}
                onChange={(e) => handlePaidChange(e.target.value)}
                onFocus={() => setPaidAmount('')}
                placeholder={t.enterPaidAmount}
              />
              <span className="suffix">000</span>
            </div>
          ) : (
            <input
              type="text"
              inputMode="numeric"
              value={formatNumber(paidAmount)}
              onChange={(e) => handlePaidChange(e.target.value)}
              onFocus={() => setPaidAmount('')}
              placeholder={t.enterPaidAmount}
            />
          )}
        </div>

        <button className="clear-btn" onClick={handleClearAll}>{t.clear}</button>

        <div className="result-placeholder">
          {result !== null && (
            <div className={`result ${result.lbp < 0 ? 'negative' : ''}`}>
              <h2>{result.lbp < 0 ? t.customerOwes : t.returnToCustomer}</h2>

              <div className="total-change">
                <div className="total-change-item">
                  <span className="label">{result.lbp < 0 ? t.customerOwes : t.totalChange}:</span>
                  <span className="value">${Math.abs(result.totalUsd).toFixed(2)}</span>
                  <span className="value">({Math.abs(result.totalLbp).toLocaleString()} LBP)</span>
                </div>
              </div>
              <div className="divider"></div>

              {result.lbp >= 0 && (
                <div className="custom-usd-input">
                  <label>{t.usdAmount}</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={customUsd}
                    onChange={(e) => handleCustomUsdChange(e.target.value)}
                    onFocus={() => setCustomUsd('')}
                    max={result.maxUsd}
                    min={0}
                  />
                </div>
              )}

              <div className="result-values">
                {result.lbp >= 0 && (
                  <div className="result-item">
                    <span className="currency">$</span>
                    <span className="amount">{result.usd}</span>
                    <span className="lbp-equivalent">({(result.usd * EXCHANGE_RATE).toLocaleString()} LBP)</span>
                  </div>
                )}
                <div className="result-item">
                  <span className="amount">{result.lbp < 0 ? '-' : ''}{Math.abs(result.lbp).toLocaleString()}</span>
                  <span className="currency">LBP</span>
                  <span className="lbp-equivalent">(${(Math.abs(result.lbp) / EXCHANGE_RATE).toFixed(2)})</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

