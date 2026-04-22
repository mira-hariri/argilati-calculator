import { useState, useRef, useEffect } from 'react';
import './App.css';
import Calculator from './Calculator';
import { sumHistory } from './utils';

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
    clear: 'Clear',
    receipt: 'Receipt',
    receiptTitle: 'RECEIPT',
    items: 'Items',
    subtotalUsd: 'Subtotal ($)',
    subtotalLbp: 'Subtotal (LBP)',
    grandTotal: 'Grand Total',
    paid: 'Paid',
    change: 'Change',
    returned: 'Returned',
    owed: 'Still Owed',
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
    clear: 'مسح',
    receipt: 'إيصال',
    receiptTitle: 'إيصال',
    items: 'العناصر',
    subtotalUsd: 'المجموع الفرعي ($)',
    subtotalLbp: 'المجموع الفرعي (ل.ل)',
    grandTotal: 'المجموع الكلي',
    paid: 'المدفوع',
    change: 'الباقي',
    returned: 'المرتجع',
    owed: 'المتبقي',
  },
};

// ── Main App ──
function App() {
  const [totalUsdAmount, setTotalUsdAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [paidCurrency, setPaidCurrency] = useState<'USD' | 'LBP'>('USD');
  const [result, setResult] = useState<{
    usd: number; lbp: number; maxUsd: number; totalUsd: number; totalLbp: number;
  } | null>(null);
  const [baseChangeType, setBaseChangeType] = useState<'return' | 'owes' | null>(null);
  const [baseChangeLbp, setBaseChangeLbp] = useState(0);
  const [baseChangeUsd, setBaseChangeUsd] = useState(0);
  const [customUsd, setCustomUsd] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcDefaultTab, setCalcDefaultTab] = useState<'USD' | 'LBP'>('LBP');
  const [usdHistory, setUsdHistory] = useState<string[]>([]);
  const [lbpHistory, setLbpHistory] = useState<string[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
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
      setBaseChangeType(null);
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

    const totalInLBP = (totalUsd * EXCHANGE_RATE_USD_TOTAL) + (totalLbp * 1000);
    const paidInLBP = paidCurrency === 'USD' ? paid * EXCHANGE_RATE : paid * 1000;
    const changeInLBP = paidInLBP - totalInLBP;

    setBaseChangeLbp(Math.round(changeInLBP));
    setBaseChangeUsd(changeInLBP / EXCHANGE_RATE);
    setBaseChangeType(changeInLBP >= 0 ? 'return' : 'owes');

    if (changeInLBP < 0) {
      setResult({ usd: 0, lbp: Math.round(changeInLBP), maxUsd: 0, totalUsd: changeInLBP / EXCHANGE_RATE, totalLbp: Math.round(changeInLBP) });
      setCustomUsd('');
      return;
    }

    const changeInUSD = changeInLBP / EXCHANGE_RATE;
    const usdToReturn = Math.floor(changeInUSD / 5) * 5;
    const lbpToReturn = changeInLBP - (usdToReturn * EXCHANGE_RATE);

    setResult({ usd: usdToReturn, lbp: Math.round(lbpToReturn), maxUsd: Math.floor(changeInUSD), totalUsd: changeInUSD, totalLbp: Math.round(changeInLBP) });
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
    setTotalUsdAmount(''); setTotalAmount(''); setPaidAmount('');
    setResult(null); setCustomUsd('');
    setBaseChangeType(null); setBaseChangeLbp(0); setBaseChangeUsd(0);
    setUsdHistory([]); setLbpHistory([]);
  };

  const openCalc = (tab: 'USD' | 'LBP') => {
    // Seed history from field value if history is empty but field has a value
    if (tab === 'USD' && usdHistory.length === 0 && totalUsdAmount && parseFloat(totalUsdAmount) !== 0) {
      setUsdHistory([`+${totalUsdAmount}`]);
    }
    if (tab === 'LBP' && lbpHistory.length === 0 && totalAmount && parseFloat(totalAmount) !== 0) {
      setLbpHistory([`+${totalAmount}`]);
    }
    setCalcDefaultTab(tab);
    setShowCalculator(true);
  };

  const handleCalcSubmit = (newUsdHistory: string[], newLbpHistory: string[]) => {
    setUsdHistory(newUsdHistory);
    setLbpHistory(newLbpHistory);
    const usdTotal = sumHistory(newUsdHistory);
    const lbpTotal = sumHistory(newLbpHistory);
    if (usdTotal !== 0 || newUsdHistory.length > 0) setTotalUsdAmount(String(usdTotal));
    if (lbpTotal !== 0 || newLbpHistory.length > 0) setTotalAmount(String(lbpTotal));
  };

  return (
    <div className="container">
      <div className="top-left-buttons">
        <button className="language-toggle" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
          {language === 'en' ? 'AR' : 'EN'}
        </button>
        <button className="receipt-toggle" onClick={() => setShowReceipt(true)}>🧾 {t.receipt}</button>
      </div>

      {showReceipt && (
        <div className="calculator-overlay" onClick={() => setShowReceipt(false)}>
          <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowReceipt(false)} className="calc-close-btn">×</button>
            <div className="receipt-paper">
              <h2 className="receipt-header">{t.receiptTitle}</h2>
              <div className="receipt-divider">{'='.repeat(32)}</div>

              {(usdHistory.length > 0 || (totalUsdAmount && Number(totalUsdAmount) > 0)) && (
                <div className="receipt-section usd-section">
                  <div className="receipt-section-title">{t.subtotalUsd}</div>
                  {usdHistory.map((entry, i) => (
                    <div key={i} className="receipt-line"><span>{entry}</span></div>
                  ))}
                  <div className="receipt-line receipt-subtotal">
                    <span>{t.total}</span>
                    <span>${parseFloat(totalUsdAmount || '0').toLocaleString()}</span>
                  </div>
                </div>
              )}

              {(lbpHistory.length > 0 || (totalAmount && Number(totalAmount) > 0)) && (
                <div className="receipt-section lbp-section">
                  <div className="receipt-section-title">{t.subtotalLbp}</div>
                  {lbpHistory.map((entry, i) => (
                    <div key={i} className="receipt-line"><span>{entry}</span></div>
                  ))}
                  <div className="receipt-line receipt-subtotal">
                    <span>{t.total}</span>
                    <span>{((parseFloat(totalAmount || '0')) * 1000).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="receipt-divider">{'-'.repeat(32)}</div>
              <div className="receipt-line receipt-total">
                <span>{t.grandTotal}</span>
                <span>${((parseFloat(totalUsdAmount) || 0) + ((parseFloat(totalAmount) || 0) * 1000 / EXCHANGE_RATE)).toFixed(2)}</span>
              </div>
              <div className="receipt-line receipt-total-sub">
                <span></span>
                <span>({(((parseFloat(totalUsdAmount) || 0) * EXCHANGE_RATE_USD_TOTAL) + ((parseFloat(totalAmount) || 0) * 1000)).toLocaleString()} LBP)</span>
              </div>

              <div className="receipt-divider">{'-'.repeat(32)}</div>
              <div className="receipt-line">
                <span>{t.paid}</span>
                <span>{paidCurrency === 'USD' ? '$' : ''}{parseFloat(paidAmount || '0').toLocaleString()}{paidCurrency === 'LBP' ? ',000 LBP' : ''}</span>
              </div>

              {baseChangeType && (
                <>
                  <div className="receipt-line">
                    <span>{t.change}</span>
                    <span className={baseChangeType === 'owes' ? 'receipt-negative' : 'receipt-positive'}>
                      ${Math.abs(baseChangeUsd).toFixed(2)} ({Math.abs(baseChangeLbp).toLocaleString()} LBP)
                    </span>
                  </div>
                  {baseChangeType === 'return' && result && (
                    <>
                      <div className="receipt-divider">{'='.repeat(32)}</div>
                      <div className="receipt-section-title">{t.returned}</div>
                      <div className="receipt-line"><span>$</span><span>{result.usd} ({(result.usd * EXCHANGE_RATE).toLocaleString()} LBP)</span></div>
                      <div className="receipt-line"><span>LBP</span><span>{result.lbp < 0 ? '-' : ''}{Math.abs(result.lbp).toLocaleString()}</span></div>
                    </>
                  )}
                  {baseChangeType === 'owes' && (
                    <>
                      <div className="receipt-divider">{'='.repeat(32)}</div>
                      <div className="receipt-line receipt-owed"><span>{t.owed}</span><span>{Math.abs(baseChangeLbp).toLocaleString()} LBP</span></div>
                    </>
                  )}
                </>
              )}
              <div className="receipt-divider">{'='.repeat(32)}</div>
            </div>
          </div>
        </div>
      )}

      <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" className="app-logo" />

      <button className="calculator-toggle" onClick={() => openCalc('LBP')}>🧮 {t.calculator}</button>

      <Calculator
        visible={showCalculator}
        onClose={() => setShowCalculator(false)}
        onSubmit={handleCalcSubmit}
        defaultTab={calcDefaultTab}
        usdHistory={usdHistory}
        lbpHistory={lbpHistory}
        t={t}
      />

      <div className="form">
        <div className="totals-row">
          <div className="field-group">
            <div className="label-with-calc">
              <label>{t.totalUsd}</label>
              <button className="mini-calc-btn" onClick={() => openCalc('USD')}>🧮</button>
            </div>
            <div className="input-with-clear">
              <input type="text" inputMode="numeric" value={formatNumber(totalUsdAmount)} onChange={(e) => handleTotalUsdChange(e.target.value)} placeholder="$" />
              {totalUsdAmount && <button className="clear-input-btn" onClick={() => { setTotalUsdAmount(''); setUsdHistory([]); }}>×</button>}
            </div>
          </div>
          <div className="field-group">
            <div className="label-with-calc">
              <label>{t.totalLbp}</label>
              <button className="mini-calc-btn" onClick={() => openCalc('LBP')}>🧮</button>
            </div>
            <div className="input-with-clear has-suffix">
              <input ref={totalInputRef} type="text" inputMode="numeric" value={formatNumber(totalAmount)} onChange={(e) => handleTotalChange(e.target.value)} placeholder={t.enterAmount} />
              <span className="suffix">000</span>
              {totalAmount && <button className="clear-input-btn" onClick={() => { setTotalAmount(''); setLbpHistory([]); }}>×</button>}
            </div>
          </div>
        </div>

        <div className="total-sum">
          {t.total}: ${((parseFloat(totalUsdAmount) || 0) + ((parseFloat(totalAmount) || 0) * 1000 / EXCHANGE_RATE)).toFixed(2)} ({(((parseFloat(totalUsdAmount) || 0) * EXCHANGE_RATE_USD_TOTAL) + ((parseFloat(totalAmount) || 0) * 1000)).toLocaleString()} LBP)
        </div>

        <div className="field-group">
          <div className="label-with-toggle">
            <label>{t.customerPaid}</label>
            <button className={`toggle-inline ${paidCurrency === 'USD' ? 'usd' : 'lbp'}`} onClick={() => setPaidCurrency(paidCurrency === 'USD' ? 'LBP' : 'USD')}>{paidCurrency}</button>
          </div>
          {paidCurrency === 'LBP' ? (
            <div className="input-with-clear has-suffix">
              <input type="text" inputMode="numeric" value={formatNumber(paidAmount)} onChange={(e) => handlePaidChange(e.target.value)} placeholder={t.enterPaidAmount} />
              <span className="suffix">000</span>
              {paidAmount && <button className="clear-input-btn" onClick={() => setPaidAmount('')}>×</button>}
            </div>
          ) : (
            <div className="input-with-clear">
              <input type="text" inputMode="numeric" value={formatNumber(paidAmount)} onChange={(e) => handlePaidChange(e.target.value)} placeholder={t.enterPaidAmount} />
              {paidAmount && <button className="clear-input-btn" onClick={() => setPaidAmount('')}>×</button>}
            </div>
          )}
        </div>

        <button className="clear-btn" onClick={handleClearAll}>{t.clear}</button>

        <div className="result-placeholder">
          {baseChangeType !== null && (
            <>
              <div className={`result ${baseChangeType === 'owes' ? 'negative' : ''}`}>
                <h2>{baseChangeType === 'owes' ? t.customerOwes : t.returnToCustomer}</h2>
                <div className="total-change">
                  <div className="total-change-item">
                    <span className="value">${Math.abs(baseChangeUsd).toFixed(2)}</span>
                    <span className="value">({Math.abs(baseChangeLbp).toLocaleString()} LBP)</span>
                  </div>
                </div>
              </div>

              {baseChangeType === 'return' && result && (
                <div className={`result section-split ${result.lbp < 0 ? 'negative' : ''}`}>
                  <div className="custom-usd-input">
                    <label>{t.usdAmount}</label>
                    <div className="input-with-clear">
                      <input type="number" inputMode="numeric" pattern="[0-9]*" value={customUsd} onChange={(e) => handleCustomUsdChange(e.target.value)} max={result.maxUsd} min={0} />
                      {customUsd && <button className="clear-input-btn" onClick={() => handleCustomUsdChange('')}>×</button>}
                    </div>
                  </div>
                  <div className="result-values">
                    <div className="result-item">
                      <span className="currency">$</span>
                      <span className="amount">{result.usd}</span>
                      <span className="lbp-equivalent">({(result.usd * EXCHANGE_RATE).toLocaleString()} LBP)</span>
                    </div>
                    <div className="result-item">
                      <span className="amount">{result.lbp < 0 ? '-' : ''}{Math.abs(result.lbp).toLocaleString()}</span>
                      <span className="currency">LBP</span>
                      <span className="lbp-equivalent">(${(Math.abs(result.lbp) / EXCHANGE_RATE).toFixed(2)})</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
