import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const EXCHANGE_RATE = 89000;

const translations = {
  en: {
    title: 'Currency Calculator',
    calculator: 'Calculator',
    total: 'Total',
    customerPaid: 'Customer Paid',
    returnToCustomer: 'Return to Customer',
    customerOwes: 'Customer Still Owes',
    totalChange: 'Total Change',
    usdAmount: 'USD Amount',
    max: 'max',
    close: 'Close',
    go: 'Go',
    enterAmount: 'Enter amount',
    enterPaidAmount: 'Enter paid amount'
  },
  ar: {
    title: 'حاسبة العملات',
    calculator: 'آلة حاسبة',
    total: 'المجموع',
    customerPaid: 'دفع الزبون',
    returnToCustomer: 'الباقي للزبون',
    customerOwes: 'الزبون مدين',
    totalChange: 'مجموع الباقي',
    usdAmount: 'المبلغ بالدولار',
    max: 'الحد الأقصى',
    close: 'إغلاق',
    go: 'تطبيق',
    enterAmount: 'أدخل المبلغ',
    enterPaidAmount: 'أدخل المبلغ المدفوع'
  }
};

function Calculator({ visible, onClose, onCalculate, t }: { visible: boolean; onClose: () => void; onCalculate: (value: string) => void; t: any }) {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState('');
  const [operator, setOperator] = useState('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);

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

      if (operator === '+') {
        newValue = currentVal + inputValue;
      } else if (operator === '-') {
        newValue = currentVal - inputValue;
      }

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

      if (operator === '+') {
        newValue = currentVal + inputValue;
      } else if (operator === '-') {
        newValue = currentVal - inputValue;
      }

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

  const handleGo = () => {
    if (operator && currentValue !== '') {
      handleEquals();
      setTimeout(() => {
        onCalculate(display);
        onClose();
      }, 100);
    } else {
      onCalculate(display);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.calculatorOverlay}>
        <View style={styles.calculator}>
          <Text style={styles.calculatorDisplay}>{parseFloat(display).toLocaleString()}</Text>
          <View style={styles.calculatorButtons}>
            <TouchableOpacity onPress={handleClear} style={[styles.calcBtn, styles.calcBtnClear]}>
              <Text style={styles.calcBtnText}>C</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOperator('-')} style={[styles.calcBtn, styles.calcBtnOperator]}>
              <Text style={styles.calcBtnText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOperator('+')} style={[styles.calcBtn, styles.calcBtnOperator]}>
              <Text style={styles.calcBtnText}>+</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleNumber('7')} style={styles.calcBtn}>
              <Text style={styles.calcBtnTextDark}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNumber('8')} style={styles.calcBtn}>
              <Text style={styles.calcBtnTextDark}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNumber('9')} style={styles.calcBtn}>
              <Text style={styles.calcBtnTextDark}>9</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleNumber('4')} style={styles.calcBtn}>
              <Text style={styles.calcBtnTextDark}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNumber('5')} style={styles.calcBtn}>
              <Text style={styles.calcBtnTextDark}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNumber('6')} style={styles.calcBtn}>
              <Text style={styles.calcBtnTextDark}>6</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleNumber('1')} style={styles.calcBtn}>
              <Text style={styles.calcBtnTextDark}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNumber('2')} style={styles.calcBtn}>
              <Text style={styles.calcBtnTextDark}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNumber('3')} style={styles.calcBtn}>
              <Text style={styles.calcBtnTextDark}>3</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleNumber('0')} style={[styles.calcBtn, styles.calcBtnZero]}>
              <Text style={styles.calcBtnTextDark}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEquals} style={[styles.calcBtn, styles.calcBtnOperator]}>
              <Text style={styles.calcBtnText}>=</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleGo} style={[styles.calcBtn, styles.calcBtnGo]}>
              <Text style={styles.calcBtnText}>{t.go}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.calcClose}>
            <Text style={styles.calcCloseText}>{t.close}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function App() {
  const [totalAmount, setTotalAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [paidCurrency, setPaidCurrency] = useState<'USD' | 'LBP'>('USD');
  const [result, setResult] = useState<{ usd: number; lbp: number; maxUsd: number; totalUsd: number; totalLbp: number } | null>(null);
  const [customUsd, setCustomUsd] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const t = translations[language];

  useEffect(() => {
    if (totalAmount && paidAmount) {
      handleCalculate();
    } else {
      setResult(null);
    }
  }, [totalAmount, paidAmount, paidCurrency]);

  const formatNumber = (value: string) => {
    const num = value.replace(/,/g, '');
    if (!num || isNaN(Number(num))) return '';
    return Number(num).toLocaleString('en-US');
  };

  const handleTotalChange = (value: string) => {
    const cleanValue = value.replace(/,/g, '');
    if (cleanValue === '' || !isNaN(Number(cleanValue))) {
      setTotalAmount(cleanValue);
    }
  };

  const handlePaidChange = (value: string) => {
    const cleanValue = value.replace(/,/g, '');
    if (cleanValue === '' || !isNaN(Number(cleanValue))) {
      setPaidAmount(cleanValue);
    }
  };

  const handleCalculate = () => {
    const total = parseFloat(totalAmount) || 0;
    const paid = parseFloat(paidAmount) || 0;

    const totalInLBP = total * 1000;
    const paidInLBP = paidCurrency === 'USD' ? paid * EXCHANGE_RATE : paid * 1000;

    const changeInLBP = paidInLBP - totalInLBP;

    if (changeInLBP < 0) {
      setResult({ 
        usd: 0, 
        lbp: Math.round(changeInLBP),
        maxUsd: 0,
        totalUsd: 0,
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
      if (result.lbp >= 0) {
        const totalChangeInLBP = result.totalLbp;
        const newLbp = totalChangeInLBP - (usd * EXCHANGE_RATE);
        setResult({ ...result, usd, lbp: Math.round(newLbp) });
      } else {
        const totalOwedInLBP = result.totalLbp;
        const newLbp = totalOwedInLBP + (usd * EXCHANGE_RATE);
        setResult({ ...result, usd, lbp: Math.round(newLbp) });
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.wrapper}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <StatusBar style="light" />
          
          <TouchableOpacity style={styles.languageToggle} onPress={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
            <Text style={styles.languageToggleText}>{language === 'en' ? 'AR' : 'EN'}</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>{t.title}</Text>
          
          <TouchableOpacity style={styles.calculatorToggle} onPress={() => setShowCalculator(true)}>
            <Text style={styles.calculatorToggleText}>🧮 {t.calculator}</Text>
          </TouchableOpacity>

          <Calculator
            visible={showCalculator}
            onClose={() => setShowCalculator(false)}
            onCalculate={(value) => setTotalAmount(value)}
            t={t}
          />
          
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t.total} (LBP)</Text>
              <View style={styles.inputWithSuffix}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={formatNumber(totalAmount)}
                  onChangeText={handleTotalChange}
                  onFocus={() => setTotalAmount('')}
                  placeholder={t.enterAmount}
                  placeholderTextColor="#999"
                />
                <Text style={styles.suffix}>000</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.labelWithToggle}>
                <Text style={styles.label}>{t.customerPaid}</Text>
                <TouchableOpacity
                  style={[styles.toggleInline, paidCurrency === 'USD' ? styles.toggleUsd : styles.toggleLbp]}
                  onPress={() => setPaidCurrency(paidCurrency === 'USD' ? 'LBP' : 'USD')}
                >
                  <Text style={styles.toggleText}>{paidCurrency}</Text>
                </TouchableOpacity>
              </View>
              {paidCurrency === 'LBP' ? (
                <View style={styles.inputWithSuffix}>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={formatNumber(paidAmount)}
                    onChangeText={handlePaidChange}
                    onFocus={() => setPaidAmount('')}
                    placeholder={t.enterPaidAmount}
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.suffix}>000</Text>
                </View>
              ) : (
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={formatNumber(paidAmount)}
                  onChangeText={handlePaidChange}
                  onFocus={() => setPaidAmount('')}
                  placeholder={t.enterPaidAmount}
                  placeholderTextColor="#999"
                />
              )}
            </View>

            {result !== null && (
              <View style={[styles.result, result.lbp < 0 && styles.resultNegative]}>
                <Text style={styles.resultTitle}>
                  {result.lbp < 0 ? t.customerOwes : t.returnToCustomer}
                </Text>
                
                <View style={styles.totalChange}>
                  <Text style={styles.totalChangeLabel}>{result.lbp < 0 ? t.customerOwes : t.totalChange}:</Text>
                  <Text style={styles.totalChangeValue}>
                    ${Math.abs(result.totalUsd).toFixed(2)} ({Math.abs(result.totalLbp).toLocaleString()} LBP)
                  </Text>
                </View>
                <View style={styles.divider} />
                
                {result.lbp >= 0 && (
                  <View style={styles.customUsdInput}>
                    <Text style={styles.customUsdLabel}>
                      {t.usdAmount} ({t.max}: ${result.maxUsd})
                    </Text>
                    <TextInput
                      style={styles.customUsdInputField}
                      keyboardType="numeric"
                      value={customUsd}
                      onChangeText={handleCustomUsdChange}
                      onFocus={() => setCustomUsd('')}
                      placeholderTextColor="rgba(255,255,255,0.6)"
                    />
                  </View>
                )}

                <View style={styles.resultValues}>
                  {result.lbp >= 0 && (
                    <View style={styles.resultItem}>
                      <Text style={styles.currency}>$</Text>
                      <Text style={styles.amount}>{result.usd}</Text>
                      <Text style={styles.lbpEquivalent}>
                        ({(result.usd * EXCHANGE_RATE).toLocaleString()} LBP)
                      </Text>
                    </View>
                  )}
                  <View style={styles.resultItem}>
                    <Text style={styles.amount}>
                      {result.lbp < 0 ? '-' : ''}{Math.abs(result.lbp).toLocaleString()}
                    </Text>
                    <Text style={styles.currency}>LBP</Text>
                    <Text style={styles.lbpEquivalent}>
                      (${(Math.abs(result.lbp) / EXCHANGE_RATE).toFixed(2)})
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 60,
    elevation: 10,
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
    fontSize: 28,
    fontWeight: 'bold',
  },
  languageToggle: {
    position: 'absolute',
    top: 20,
    left: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#10b981',
    borderRadius: 8,
    zIndex: 10,
  },
  languageToggleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  calculatorToggle: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#667eea',
    borderRadius: 8,
    zIndex: 10,
  },
  calculatorToggleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    gap: 20,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    color: '#555',
    fontSize: 18,
    marginBottom: 8,
  },
  labelWithToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputWithSuffix: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 18,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    fontSize: 20,
    color: '#333',
  },
  suffix: {
    position: 'absolute',
    right: 18,
    color: '#999',
    fontSize: 20,
    fontWeight: '600',
  },
  toggleInline: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleUsd: {
    backgroundColor: '#10b981',
  },
  toggleLbp: {
    backgroundColor: '#f59e0b',
  },
  toggleText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  result: {
    marginTop: 30,
    padding: 24,
    backgroundColor: '#f093fb',
    borderRadius: 15,
  },
  resultNegative: {
    backgroundColor: '#ff6b6b',
  },
  resultTitle: {
    fontSize: 22,
    marginBottom: 16,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  totalChange: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    alignItems: 'center',
  },
  totalChangeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    opacity: 0.9,
    marginBottom: 8,
  },
  totalChangeValue: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  divider: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 20,
  },
  customUsdInput: {
    marginBottom: 20,
  },
  customUsdLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
    opacity: 0.95,
  },
  customUsdInputField: {
    width: '100%',
    padding: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    fontSize: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontWeight: '600',
  },
  resultValues: {
    gap: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  currency: {
    fontSize: 26,
    color: 'white',
    opacity: 0.9,
    fontWeight: '700',
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
  },
  lbpEquivalent: {
    fontSize: 16,
    opacity: 0.85,
    fontWeight: '500',
    color: 'white',
    marginLeft: 8,
  },
  calculatorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculator: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 350,
  },
  calculatorDisplay: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    textAlign: 'right',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
    minHeight: 60,
    color: '#333',
  },
  calculatorButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  calcBtn: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  calcBtnText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  calcBtnTextDark: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  calcBtnOperator: {
    backgroundColor: '#667eea',
  },
  calcBtnClear: {
    backgroundColor: '#ff6b6b',
  },
  calcBtnGo: {
    width: '100%',
    backgroundColor: '#10b981',
  },
  calcBtnZero: {
    width: '63%',
  },
  calcClose: {
    width: '100%',
    marginTop: 15,
    padding: 12,
    backgroundColor: '#6c757d',
    borderRadius: 10,
  },
  calcCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
