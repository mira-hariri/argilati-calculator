import { useState, useRef, useEffect } from "react";
import "./App.css";

const EXCHANGE_RATE = 89000;
const EXCHANGE_RATE_USD_TOTAL = 89000;

const translations = {
  en: {
    title: "أرغيلتي Calculator",
    calculator: "Calculator",
    total: "Total",
    totalUsd: "Total ($)",
    totalLbp: "Total (LBP)",
    customerPaid: "Customer Paid",
    returnToCustomer: "Return to Customer",
    customerOwes: "Customer Still Owes",
    totalChange: "Total Change",
    usdAmount: "USD Amount",
    max: "max",
    close: "Close",
    go: "Go",
    enterAmount: "Enter amount",
    enterPaidAmount: "Enter paid amount",
    clear: "Clear",
    receipt: "Receipt",
    receiptTitle: "RECEIPT",
    items: "Items",
    subtotalUsd: "Subtotal ($)",
    subtotalLbp: "Subtotal (LBP)",
    grandTotal: "Grand Total",
    paid: "Paid",
    change: "Change",
    returned: "Returned",
    owed: "Still Owed",
  },
  ar: {
    title: "حاسبة أرغيلتي",
    calculator: "آلة حاسبة",
    total: "المجموع",
    totalUsd: "المجموع ($)",
    totalLbp: "المجموع (ل.ل)",
    customerPaid: "دفع الزبون",
    returnToCustomer: "الباقي للزبون",
    customerOwes: "الزبون مدين",
    totalChange: "مجموع الباقي",
    usdAmount: "المبلغ بالدولار",
    max: "الحد الأقصى",
    close: "إغلاق",
    go: "تطبيق",
    enterAmount: "أدخل المبلغ",
    enterPaidAmount: "أدخل المبلغ المدفوع",
    clear: "مسح",
    receipt: "إيصال",
    receiptTitle: "إيصال",
    items: "العناصر",
    subtotalUsd: "المجموع الفرعي ($)",
    subtotalLbp: "المجموع الفرعي (ل.ل)",
    grandTotal: "المجموع الكلي",
    paid: "المدفوع",
    change: "الباقي",
    returned: "المرتجع",
    owed: "المتبقي",
  },
};

function Calculator({
  visible,
  onClose,
  onCalculateLbp,
  onCalculateUsd,
  defaultTab,
  initialUsd,
  initialLbp,
  usdHistory,
  lbpHistory,
  onUpdateHistory,
  t,
}: {
  visible: boolean;
  onClose: () => void;
  onCalculateLbp: (value: string) => void;
  onCalculateUsd: (value: string) => void;
  defaultTab: "USD" | "LBP";
  initialUsd: string;
  initialLbp: string;
  usdHistory: string[];
  lbpHistory: string[];
  onUpdateHistory: (usd: string[], lbp: string[]) => void;
  t: typeof translations.en;
}) {
  const [display, setDisplay] = useState("0");
  const [currentValue, setCurrentValue] = useState("");
  const [operator, setOperator] = useState("");
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [tab, setTab] = useState<"USD" | "LBP">("LBP");
  const [usdValue, setUsdValue] = useState("0");
  const [lbpValue, setLbpValue] = useState("0");
  const [localUsdHistory, setLocalUsdHistory] = useState<string[]>([]);
  const [localLbpHistory, setLocalLbpHistory] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      const initUsd = initialUsd || "0";
      const initLbp = initialLbp || "0";
      setUsdValue(initUsd);
      setLbpValue(initLbp);
      setDisplay(defaultTab === "USD" ? initUsd : initLbp);
      setCurrentValue("");
      setOperator("");
      setWaitingForOperand(true);
      setTab(defaultTab);
      setLocalUsdHistory([...usdHistory]);
      setLocalLbpHistory([...lbpHistory]);
    }
  }, [visible]);

  if (!visible) return null;

  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);
    if (currentValue === "") {
      // First number entered — record it if history is empty
      if (tab === "USD" && localUsdHistory.length === 0) {
        setLocalUsdHistory([String(inputValue)]);
      } else if (tab === "LBP" && localLbpHistory.length === 0) {
        setLocalLbpHistory([String(inputValue)]);
      }
      setCurrentValue(String(inputValue));
    } else if (operator) {
      const currentVal = parseFloat(currentValue);
      let newValue = currentVal;
      if (operator === "+") newValue = currentVal + inputValue;
      else if (operator === "-") newValue = currentVal - inputValue;
      // Record the operation
      const entry = `${operator}${inputValue}`;
      if (tab === "USD") setLocalUsdHistory((prev) => [...prev, entry]);
      else setLocalLbpHistory((prev) => [...prev, entry]);
      setDisplay(String(newValue));
      setCurrentValue(String(newValue));
    }
    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);
    if (operator && currentValue !== "") {
      const currentVal = parseFloat(currentValue);
      let newValue = currentVal;
      if (operator === "+") newValue = currentVal + inputValue;
      else if (operator === "-") newValue = currentVal - inputValue;
      const entry = `${operator}${inputValue}`;
      if (tab === "USD") setLocalUsdHistory((prev) => [...prev, entry]);
      else setLocalLbpHistory((prev) => [...prev, entry]);
      setDisplay(String(newValue));
      setCurrentValue("");
      setOperator("");
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setCurrentValue("");
    setOperator("");
    setWaitingForOperand(false);
    if (tab === "USD") setLocalUsdHistory([]);
    else setLocalLbpHistory([]);
  };

  const resolveDisplay = () => {
    if (operator && currentValue !== "") {
      const inputValue = parseFloat(display);
      const currentVal = parseFloat(currentValue);
      let newValue = currentVal;
      if (operator === "+") newValue = currentVal + inputValue;
      else if (operator === "-") newValue = currentVal - inputValue;
      const entry = `${operator}${inputValue}`;
      if (tab === "USD") setLocalUsdHistory((prev) => [...prev, entry]);
      else setLocalLbpHistory((prev) => [...prev, entry]);
      setDisplay(String(newValue));
      setCurrentValue("");
      setOperator("");
      setWaitingForOperand(true);
      return String(newValue);
    }
    return display;
  };

  const switchTab = (newTab: "USD" | "LBP") => {
    const resolved = resolveDisplay();
    if (tab === "USD") setUsdValue(resolved);
    else setLbpValue(resolved);
    setDisplay(newTab === "USD" ? usdValue : lbpValue);
    setCurrentValue("");
    setOperator("");
    setWaitingForOperand(false);
    setTab(newTab);
  };

  const handleSubmit = () => {
    const finalUsdHistory = [...localUsdHistory];
    const finalLbpHistory = [...localLbpHistory];
    let resolvedDisplay = display;

    if (operator && currentValue !== "") {
      const inputValue = parseFloat(display);
      const currentVal = parseFloat(currentValue);
      let newValue = currentVal;
      if (operator === "+") newValue = currentVal + inputValue;
      else if (operator === "-") newValue = currentVal - inputValue;
      const entry = `${operator}${inputValue}`;
      if (tab === "USD") finalUsdHistory.push(entry);
      else finalLbpHistory.push(entry);
      resolvedDisplay = String(newValue);
    } else if (!waitingForOperand && display !== "0") {
      if (tab === "USD") {
        if (finalUsdHistory.length === 0) finalUsdHistory.push(display);
        else finalUsdHistory.push(`+${display}`);
      } else {
        if (finalLbpHistory.length === 0) finalLbpHistory.push(display);
        else finalLbpHistory.push(`+${display}`);
      }
    }

    const finalUsd = tab === "USD" ? resolvedDisplay : usdValue;
    const finalLbp = tab === "LBP" ? resolvedDisplay : lbpValue;
    onCalculateUsd(finalUsd);
    onCalculateLbp(finalLbp);
    onUpdateHistory(finalUsdHistory, finalLbpHistory);
    onClose();
  };

  return (
    <div className="calculator-overlay" onClick={onClose}>
      <div className="calculator" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="calc-close-btn">
          ×
        </button>
        <div className="calc-target-toggle">
          <button
            className={`calc-target-btn ${tab === "USD" ? "active-usd" : ""}`}
            onClick={() => switchTab("USD")}
          >
            ${" "}
            {tab !== "USD" && usdValue !== "0"
              ? `(${parseFloat(usdValue).toLocaleString()})`
              : ""}
          </button>
          <button
            className={`calc-target-btn ${tab === "LBP" ? "active-lbp" : ""}`}
            onClick={() => switchTab("LBP")}
          >
            LBP{" "}
            {tab !== "LBP" && lbpValue !== "0"
              ? `(${parseFloat(lbpValue).toLocaleString()})`
              : ""}
          </button>
        </div>
        <div className="calculator-display">
          {parseFloat(display).toLocaleString()}
        </div>
        <div className="calc-history">
          {(tab === "USD" ? localUsdHistory : localLbpHistory).map(
            (entry, i) => (
              <span
                key={i}
                className={`calc-history-entry ${entry.startsWith("-") ? "minus" : ""}`}
              >
                {entry}
              </span>
            ),
          )}
        </div>
        <div className="calculator-buttons">
          <button onClick={handleClear} className="calc-btn clear">
            C
          </button>
          <button
            onClick={() => handleOperator("-")}
            className="calc-btn operator"
          >
            -
          </button>
          <button
            onClick={() => handleOperator("+")}
            className="calc-btn operator"
          >
            +
          </button>
          <button onClick={() => handleNumber("7")} className="calc-btn">
            7
          </button>
          <button onClick={() => handleNumber("8")} className="calc-btn">
            8
          </button>
          <button onClick={() => handleNumber("9")} className="calc-btn">
            9
          </button>
          <button onClick={() => handleNumber("4")} className="calc-btn">
            4
          </button>
          <button onClick={() => handleNumber("5")} className="calc-btn">
            5
          </button>
          <button onClick={() => handleNumber("6")} className="calc-btn">
            6
          </button>
          <button onClick={() => handleNumber("1")} className="calc-btn">
            1
          </button>
          <button onClick={() => handleNumber("2")} className="calc-btn">
            2
          </button>
          <button onClick={() => handleNumber("3")} className="calc-btn">
            3
          </button>
          <button onClick={() => handleNumber("0")} className="calc-btn zero">
            0
          </button>
          <button onClick={handleEquals} className="calc-btn operator">
            =
          </button>
          <button onClick={handleSubmit} className="calc-btn go">
            {t.go}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [totalUsdAmount, setTotalUsdAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [paidCurrency, setPaidCurrency] = useState<"USD" | "LBP">("USD");
  const [result, setResult] = useState<{
    usd: number;
    lbp: number;
    maxUsd: number;
    totalUsd: number;
    totalLbp: number;
  } | null>(null);
  const [baseChangeType, setBaseChangeType] = useState<
    "return" | "owes" | null
  >(null);
  const [baseChangeLbp, setBaseChangeLbp] = useState(0);
  const [baseChangeUsd, setBaseChangeUsd] = useState(0);
  const [customUsd, setCustomUsd] = useState("");
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcDefaultTab, setCalcDefaultTab] = useState<"USD" | "LBP">("LBP");
  const [usdHistory, setUsdHistory] = useState<string[]>([]);
  const [lbpHistory, setLbpHistory] = useState<string[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">("en");
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
    const num = value.replace(/,/g, "");
    if (!num || isNaN(Number(num))) return "";
    return Number(num).toLocaleString("en-US");
  };

  const handleTotalChange = (value: string) => {
    const cleanValue = value.replace(/,/g, "");
    if (cleanValue === "" || !isNaN(Number(cleanValue)))
      setTotalAmount(cleanValue);
  };

  const handleTotalUsdChange = (value: string) => {
    const cleanValue = value.replace(/,/g, "");
    if (cleanValue === "" || !isNaN(Number(cleanValue)))
      setTotalUsdAmount(cleanValue);
  };

  const handlePaidChange = (value: string) => {
    const cleanValue = value.replace(/,/g, "");
    if (cleanValue === "" || !isNaN(Number(cleanValue)))
      setPaidAmount(cleanValue);
  };

  const handleCalculate = () => {
    const totalUsd = parseFloat(totalUsdAmount) || 0;
    const totalLbp = parseFloat(totalAmount) || 0;
    const paid = parseFloat(paidAmount) || 0;

    const totalInLBP = totalUsd * EXCHANGE_RATE_USD_TOTAL + totalLbp * 1000;
    const paidInLBP =
      paidCurrency === "USD" ? paid * EXCHANGE_RATE : paid * 1000;
    const changeInLBP = paidInLBP - totalInLBP;

    // Section 1: base change from the 3 fields only
    setBaseChangeLbp(Math.round(changeInLBP));
    setBaseChangeUsd(changeInLBP / EXCHANGE_RATE);
    setBaseChangeType(changeInLBP >= 0 ? "return" : "owes");

    if (changeInLBP < 0) {
      setResult({
        usd: 0,
        lbp: Math.round(changeInLBP),
        maxUsd: 0,
        totalUsd: changeInLBP / EXCHANGE_RATE,
        totalLbp: Math.round(changeInLBP),
      });
      setCustomUsd("");
      return;
    }

    const changeInUSD = changeInLBP / EXCHANGE_RATE;
    const usdToReturn = Math.floor(changeInUSD / 5) * 5;
    const lbpToReturn = changeInLBP - usdToReturn * EXCHANGE_RATE;

    setResult({
      usd: usdToReturn,
      lbp: Math.round(lbpToReturn),
      maxUsd: Math.floor(changeInUSD),
      totalUsd: changeInUSD,
      totalLbp: Math.round(changeInLBP),
    });
    setCustomUsd(usdToReturn.toString());
  };

  const handleCustomUsdChange = (value: string) => {
    setCustomUsd(value);
    if (result) {
      const usd = parseFloat(value) || 0;
      const newLbp = result.totalLbp - usd * EXCHANGE_RATE;
      setResult({ ...result, usd, lbp: Math.round(newLbp) });
    }
  };

  const handleClearAll = () => {
    setTotalUsdAmount("");
    setTotalAmount("");
    setPaidAmount("");
    setResult(null);
    setCustomUsd("");
    setBaseChangeType(null);
    setBaseChangeLbp(0);
    setBaseChangeUsd(0);
    setUsdHistory([]);
    setLbpHistory([]);
  };

  const openCalc = (tab: "USD" | "LBP") => {
    setCalcDefaultTab(tab);
    setShowCalculator(true);
  };

  return (
    <div className="container">
      <div className="top-left-buttons">
        <button
          className="language-toggle"
          onClick={() => setLanguage(language === "en" ? "ar" : "en")}
        >
          {language === "en" ? "AR" : "EN"}
        </button>
        <button className="receipt-toggle" onClick={() => setShowReceipt(true)}>
          🧾 {t.receipt}
        </button>
      </div>

      {showReceipt && (
        <div
          className="calculator-overlay"
          onClick={() => setShowReceipt(false)}
        >
          <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowReceipt(false)}
              className="calc-close-btn"
            >
              ×
            </button>
            <div className="receipt-paper">
              <h2 className="receipt-header">{t.receiptTitle}</h2>
              <div className="receipt-divider">{"=".repeat(32)}</div>

              {(usdHistory.length > 0 ||
                (totalUsdAmount && Number(totalUsdAmount) > 0)) && (
                <div className="receipt-section usd-section">
                  <div className="receipt-section-title">{t.subtotalUsd}</div>
                  {usdHistory.map((entry, i) => (
                    <div key={i} className="receipt-line">
                      <span>{entry}</span>
                    </div>
                  ))}
                  <div className="receipt-line receipt-subtotal">
                    <span>{t.total}</span>
                    <span>
                      ${parseFloat(totalUsdAmount || "0").toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {(lbpHistory.length > 0 ||
                (totalAmount && Number(totalAmount) > 0)) && (
                <div className="receipt-section lbp-section">
                  <div className="receipt-section-title">{t.subtotalLbp}</div>
                  {lbpHistory.map((entry, i) => (
                    <div key={i} className="receipt-line">
                      <span>{entry}</span>
                    </div>
                  ))}
                  <div className="receipt-line receipt-subtotal">
                    <span>{t.total}</span>
                    <span>
                      {(parseFloat(totalAmount || "0") * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="receipt-divider">{"-".repeat(32)}</div>
              <div className="receipt-line receipt-total">
                <span>{t.grandTotal}</span>
                <span>
                  $
                  {(
                    (parseFloat(totalUsdAmount) || 0) +
                    ((parseFloat(totalAmount) || 0) * 1000) / EXCHANGE_RATE
                  ).toFixed(2)}
                </span>
              </div>
              <div className="receipt-line receipt-total-sub">
                <span></span>
                <span>
                  (
                  {(
                    (parseFloat(totalUsdAmount) || 0) *
                      EXCHANGE_RATE_USD_TOTAL +
                    (parseFloat(totalAmount) || 0) * 1000
                  ).toLocaleString()}{" "}
                  LBP)
                </span>
              </div>

              <div className="receipt-divider">{"-".repeat(32)}</div>
              <div className="receipt-line">
                <span>{t.paid}</span>
                <span>
                  {paidCurrency === "USD" ? "$" : ""}
                  {parseFloat(paidAmount || "0").toLocaleString()}
                  {paidCurrency === "LBP" ? ",000 LBP" : ""}
                </span>
              </div>

              {baseChangeType && (
                <>
                  <div className="receipt-line">
                    <span>{t.change}</span>
                    <span
                      className={
                        baseChangeType === "owes"
                          ? "receipt-negative"
                          : "receipt-positive"
                      }
                    >
                      ${Math.abs(baseChangeUsd).toFixed(2)} (
                      {Math.abs(baseChangeLbp).toLocaleString()} LBP)
                    </span>
                  </div>

                  {baseChangeType === "return" && result && (
                    <>
                      <div className="receipt-divider">{"=".repeat(32)}</div>
                      <div className="receipt-section-title">{t.returned}</div>
                      <div className="receipt-line">
                        <span>$</span>
                        <span>
                          {result.usd} (
                          {(result.usd * EXCHANGE_RATE).toLocaleString()} LBP)
                        </span>
                      </div>
                      <div className="receipt-line">
                        <span>LBP</span>
                        <span>
                          {result.lbp < 0 ? "-" : ""}
                          {Math.abs(result.lbp).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}

                  {baseChangeType === "owes" && (
                    <>
                      <div className="receipt-divider">{"=".repeat(32)}</div>
                      <div className="receipt-line receipt-owed">
                        <span>{t.owed}</span>
                        <span>
                          {Math.abs(baseChangeLbp).toLocaleString()} LBP
                        </span>
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="receipt-divider">{"=".repeat(32)}</div>
            </div>
          </div>
        </div>
      )}

      <h1>{t.title}</h1>

      <button className="calculator-toggle" onClick={() => openCalc("LBP")}>
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
        usdHistory={usdHistory}
        lbpHistory={lbpHistory}
        onUpdateHistory={(usd, lbp) => {
          setUsdHistory(usd);
          setLbpHistory(lbp);
        }}
        t={t}
      />

      <div className="form">
        <div className="totals-row">
          <div className="field-group">
            <div className="label-with-calc">
              <label>{t.totalUsd}</label>
              <button className="mini-calc-btn" onClick={() => openCalc("USD")}>
                🧮
              </button>
            </div>
            <div className="input-with-clear">
              <input
                type="text"
                inputMode="numeric"
                value={formatNumber(totalUsdAmount)}
                onChange={(e) => handleTotalUsdChange(e.target.value)}
                placeholder="$"
              />
              {totalUsdAmount && (
                <button
                  className="clear-input-btn"
                  onClick={() => {
                    setTotalUsdAmount("");
                    setUsdHistory([]);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="field-group">
            <div className="label-with-calc">
              <label>{t.totalLbp}</label>
              <button className="mini-calc-btn" onClick={() => openCalc("LBP")}>
                🧮
              </button>
            </div>
            <div className="input-with-clear has-suffix">
              <input
                ref={totalInputRef}
                type="text"
                inputMode="numeric"
                value={formatNumber(totalAmount)}
                onChange={(e) => handleTotalChange(e.target.value)}
                placeholder={t.enterAmount}
              />
              <span className="suffix">000</span>
              {totalAmount && (
                <button
                  className="clear-input-btn"
                  onClick={() => {
                    setTotalAmount("");
                    setLbpHistory([]);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="total-sum">
          {t.total}: $
          {(
            (parseFloat(totalUsdAmount) || 0) +
            ((parseFloat(totalAmount) || 0) * 1000) / EXCHANGE_RATE
          ).toFixed(2)}{" "}
          (
          {(
            (parseFloat(totalUsdAmount) || 0) * EXCHANGE_RATE_USD_TOTAL +
            (parseFloat(totalAmount) || 0) * 1000
          ).toLocaleString()}{" "}
          LBP)
        </div>

        <div className="field-group">
          <div className="label-with-toggle">
            <label>{t.customerPaid}</label>
            <button
              className={`toggle-inline ${paidCurrency === "USD" ? "usd" : "lbp"}`}
              onClick={() =>
                setPaidCurrency(paidCurrency === "USD" ? "LBP" : "USD")
              }
            >
              {paidCurrency}
            </button>
          </div>
          {paidCurrency === "LBP" ? (
            <div className="input-with-clear has-suffix">
              <input
                type="text"
                inputMode="numeric"
                value={formatNumber(paidAmount)}
                onChange={(e) => handlePaidChange(e.target.value)}
                placeholder={t.enterPaidAmount}
              />
              <span className="suffix">000</span>
              {paidAmount && (
                <button
                  className="clear-input-btn"
                  onClick={() => setPaidAmount("")}
                >
                  ×
                </button>
              )}
            </div>
          ) : (
            <div className="input-with-clear">
              <input
                type="text"
                inputMode="numeric"
                value={formatNumber(paidAmount)}
                onChange={(e) => handlePaidChange(e.target.value)}
                placeholder={t.enterPaidAmount}
              />
              {paidAmount && (
                <button
                  className="clear-input-btn"
                  onClick={() => setPaidAmount("")}
                >
                  ×
                </button>
              )}
            </div>
          )}
        </div>

        <button className="clear-btn" onClick={handleClearAll}>
          {t.clear}
        </button>

        <div className="result-placeholder">
          {baseChangeType !== null && (
            <>
              {/* Section 1: Base change from 3 fields only */}
              <div
                className={`result ${baseChangeType === "owes" ? "negative" : ""}`}
              >
                <h2>
                  {baseChangeType === "owes"
                    ? t.customerOwes
                    : t.returnToCustomer}
                </h2>
                <div className="total-change">
                  <div className="total-change-item">
                    <span className="value">
                      ${Math.abs(baseChangeUsd).toFixed(2)}
                    </span>
                    <span className="value">
                      ({Math.abs(baseChangeLbp).toLocaleString()} LBP)
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Split breakdown - only when base is return */}
              {baseChangeType === "return" && result && (
                <div
                  className={`result section-split ${result.lbp < 0 ? "negative" : ""}`}
                >
                  <div className="custom-usd-input">
                    <label>{t.usdAmount}</label>
                    <div className="input-with-clear">
                      <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={customUsd}
                        onChange={(e) => handleCustomUsdChange(e.target.value)}
                        max={result.maxUsd}
                        min={0}
                      />
                      {customUsd && (
                        <button
                          className="clear-input-btn"
                          onClick={() => handleCustomUsdChange("")}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="result-values">
                    <div className="result-item">
                      <span className="currency">$</span>
                      <span className="amount">{result.usd}</span>
                      <span className="lbp-equivalent">
                        ({(result.usd * EXCHANGE_RATE).toLocaleString()} LBP)
                      </span>
                    </div>
                    <div className="result-item">
                      <span className="amount">
                        {result.lbp < 0 ? "-" : ""}
                        {Math.abs(result.lbp).toLocaleString()}
                      </span>
                      <span className="currency">LBP</span>
                      <span className="lbp-equivalent">
                        (${(Math.abs(result.lbp) / EXCHANGE_RATE).toFixed(2)})
                      </span>
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
