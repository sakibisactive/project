import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Payment.css';

const Payment = ({ darkMode }) => {
  const { token, user } = useContext(AuthContext);
  const { t } = useLanguage();

  // State management
  const [paymentStep, setPaymentStep] = useState(1);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [hasReferral, setHasReferral] = useState(false);
  const [referralDiscount, setReferralDiscount] = useState(0);
  const [isReferrer, setIsReferrer] = useState(false);
  const [referredUsers, setReferredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bkash');

  // Prices
  const BASE_PRICE = 1000;
  const REFERRAL_PRICE = 500;

  useEffect(() => {
    checkReferralStatus();
    checkIfReferrer();
    // eslint-disable-next-line
  }, [user]);

  const checkReferralStatus = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:5001/api/referral/check', { headers });
      if (response.data.hasReferral) {
        setHasReferral(true);
        setReferralCode(response.data.referralCode);
        setReferralDiscount(response.data.discount || (BASE_PRICE - REFERRAL_PRICE));
      }
    } catch (error) {
      console.error('Error checking referral status:', error);
    }
  };

  const checkIfReferrer = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:5001/api/referral/referrer-stats', { headers });
      if (response.data.isReferrer) {
        setIsReferrer(true);
        setReferredUsers(response.data.referredUsers || []);
      }
    } catch (error) {
      console.error('Error checking referrer status:', error);
    }
  };

  const applyReferralCode = async () => {
    if (!referralCode.trim()) {
      setError(t('pleaseEnterReferralCode'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        'http://localhost:5001/api/referral/apply',
        { referralCode: referralCode.trim() },
        { headers }
      );
      if (response.data.success) {
        setHasReferral(true);
        setReferralDiscount(response.data.discount || (BASE_PRICE - REFERRAL_PRICE));
        setSuccessMessage(`${t('referralApplied')} ${t('youGetDiscount').replace('{amount}', response.data.discount)}`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || t('invalidReferral'));
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalPrice = () => (hasReferral ? REFERRAL_PRICE : BASE_PRICE);

  const handleInitiatePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const finalPrice = calculateFinalPrice();
      const response = await axios.post(
        'http://localhost:5001/api/payment/initiate',
        {
          amount: finalPrice,
          method: paymentMethod,
          hasReferral: hasReferral,
          referralCode: hasReferral ? referralCode : null
        },
        { headers }
      );
      setPaymentInfo(response.data.paymentInfo);
      setPaymentStep(2);
    } catch (error) {
      setError(error.response?.data?.message || t('errorInitiatingPayment'));
      console.error('Error initiating payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(
        'http://localhost:5001/api/payment/confirm',
        {
          transactionId: paymentInfo?.transactionId || `TXN_${Date.now()}`,
          amount: paymentInfo?.amount,
          method: paymentMethod
        },
        { headers }
      );
      setSuccessMessage(t('paymentConfirmed'));
      setTimeout(() => {
        setPaymentStep(1);
        setReferralCode('');
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || t('errorConfirmingPayment'));
      console.error('Error confirming payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPaymentStep(1);
    setPaymentInfo(null);
    setError('');
  };

  const finalPrice = calculateFinalPrice();
  const savings = BASE_PRICE - finalPrice;

  return (
    <div className={`payment-container${darkMode ? ' dark' : ''}`}>

      {/* Header */}
      <div className="payment-header">
        <h1>{t('P A Y M E N T')}</h1>
        
      </div>

      {/* Success & Error Messages */}
      {successMessage && (
        <div className="success-message">
          <p>✓ {successMessage}</p>
        </div>
      )}
      {error && (
        <div className="error-message">
          <p>✗ {error}</p>
        </div>
      )}

      {/* === Centered Form for Premium Members === */}
      {user.role === 'premium' ? (
        <div className="center-payment-form">
          <div className="price-card due-card">
            <div className="final-price-display">
              <span className="label">{t('YOUR DUE')}</span>
              <span className="final-price">TK {BASE_PRICE}</span>
            </div>
          </div>
          <div className="payment-method-section">
            <h3>{t('selectPaymentMethod')}</h3>
            <div className="payment-methods">
              <label className="method-option">
                <input
                  type="radio"
                  name="method"
                  value="bkash"
                  checked={paymentMethod === 'bkash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="method-label">📱 {t('bkash')}</span>
              </label>
              <label className="method-option">
                <input
                  type="radio"
                  name="method"
                  value="nagad"
                  checked={paymentMethod === 'nagad'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="method-label">💳 {t('nagad')}</span>
              </label>
              <label className="method-option">
                <input
                  type="radio"
                  name="method"
                  value="rocket"
                  checked={paymentMethod === 'rocket'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="method-label">🚀 {t('rocket')}</span>
              </label>
            </div>
          </div>
          <button
            className="btn btn-pay"
            onClick={handleInitiatePayment}
            disabled={loading}
          >
            {loading ? t('processing') : `${t('pay')} TK ${finalPrice}`}
          </button>
          <p className="security-note">
            🔒 {t('secureNote')}
          </p>
        </div>
      ) : (
        /* === Grid/Column Layout for Non-Premium Members === */
        <div className="payment-content">
          {/* Benefits List for non-premium users */}
          <div className="premium-benefits-section">
            <h2>{t('membershipBenefits')}</h2>
            <ul className="benefits-list">
              <li>✅ {t('viewContactInfo') || "View property owner contact information"}</li>
              <li>✅ {t('requestMeetings') || "Request meetings with owners"}</li>
              <li>✅ {t('rateReview') || "Rate and review properties"}</li>
              <li>✅ {t('makeOffers') || "Make property offers"}</li>
              <li>✅ {t('locationBasedSuggestions') || "Location-based suggestions"}</li>
              <li>✅ {t('advertiseProperties') || "Advertise your properties"}</li>
              <li>✅ {t('virtualTours') || "360° property tours"}</li>
              <li>✅ {t('prioritySupport') || "Priority support"}</li>
              <li>✅ {t('adFree') || "Ad-free experience"}</li>
              <li>✅ {t('monthlyPriceAnalysis') || "Monthly price analysis"}</li>
            </ul>
            {/* Referrer Info */}
            {isReferrer && referredUsers.length > 0 && (
              <div className="referrer-info">
                <h3>🎉 {t('youAreReferrer') || "You Are a Referrer!"}</h3>
                <p>{t('youHaveReferred').replace('{count}', referredUsers.length) || `You have referred ${referredUsers.length} user(s)`}</p>
                <p className="referrer-discount">{t('eachUserGetsDiscount') || "Each referred user gets 500 TK discount!"}</p>
              </div>
            )}
          </div>
          {/* Payment Form Section */}
          <div className="payment-form-section">
            {paymentStep === 1 ? (
              <>
                <div className="price-card">
                  <div className="price-display">
                    <span className="label">{t('regularPrice') || "Regular Price:"}</span>
                    <span className="regular-price" style={{ textDecoration: 'line-through', color: '#aaa' }}>TK {BASE_PRICE}</span>
                  </div>
                  <div className="final-price-display">
                    <span className="label">{t('yourPrice') || "Your Price:"}</span>
                    <span className="final-price">TK {finalPrice}</span>
                  </div>
                  {hasReferral && (
                    <div className="discount-display">
                      <span className="label">{t('referralDiscount') || "Referral Discount:"}</span>
                      <span className="discount">TK 500</span>
                    </div>
                  )}
                </div>
                {/* Referral Code Input */}
                {!hasReferral && (
                  <div className="referral-input-section">
                    <h3>{t('haveReferralCode') || "Have a referral code?"}</h3>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder={t('enterReferralCode') || "Enter referral code"}
                        value={referralCode}
                        onChange={(e) => {
                          setReferralCode(e.target.value);
                          setError('');
                        }}
                        className="referral-input"
                      />
                      <button
                        onClick={applyReferralCode}
                        className="btn btn-apply"
                        disabled={loading || !referralCode.trim()}
                      >
                        {loading ? t('applying') || "Applying..." : t('apply') || "Apply"}
                      </button>
                    </div>
                    <p className="referral-info">
                      {t('getDiscountWithReferralCode') || "Get TK 500 discount when you use a referral code!"}
                    </p>
                  </div>
                )}
                {/* Payment Method Selection */}
                <div className="payment-method-section">
                  <h3>{t('selectPaymentMethod')}</h3>
                  <div className="payment-methods">
                    <label className="method-option">
                      <input
                        type="radio"
                        name="method"
                        value="bkash"
                        checked={paymentMethod === 'bkash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="method-label">📱 {t('bkash')}</span>
                    </label>
                    <label className="method-option">
                      <input
                        type="radio"
                        name="method"
                        value="nagad"
                        checked={paymentMethod === 'nagad'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="method-label">💳 {t('nagad')}</span>
                    </label>
                    <label className="method-option">
                      <input
                        type="radio"
                        name="method"
                        value="rocket"
                        checked={paymentMethod === 'rocket'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="method-label">🚀 {t('rocket')}</span>
                    </label>
                  </div>
                </div>
                <button
                  className="btn btn-pay"
                  onClick={handleInitiatePayment}
                  disabled={loading}
                >
                  {loading ? t('processing') || "Processing..." : `${t('pay')} TK ${finalPrice}`}
                </button>
                <p className="security-note">
                  🔒 {t('secureNote')}
                </p>
              </>
            ) : (
              <>
                {/* Payment Processing - non-premium */}
                <div className="payment-processing">
                  <h2>{t('completeYourPayment') || "Complete Your Payment"}</h2>
                  <div className="payment-details">
                    <div className="detail-row">
                      <span className="label">{t('amount') || "Amount:"}</span>
                      <span className="value">TK {paymentInfo?.amount}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">{t('method') || "Method:"}</span>
                      <span className="value">{paymentMethod.toUpperCase()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">{t('transactionId') || "Transaction ID:"}</span>
                      <span className="value">{paymentInfo?.transactionId}</span>
                    </div>
                  </div>
                  <div className="payment-instruction">
                    <h3>📲 {t('paymentInstructions') || "Payment Instructions:"}</h3>
                    <ol>
                      <li>{t('openApp').replace('{app}', paymentMethod.toUpperCase()) || `Open your ${paymentMethod.toUpperCase()} app`}</li>
                      <li>{t('sendAmountTo').replace('{amount}', paymentInfo?.amount).replace('{merchant}', paymentInfo?.merchantNumber) || `Send TK ${paymentInfo?.amount} to ${paymentInfo?.merchantNumber}`}</li>
                      <li>{t('reference') || "Reference:"} {paymentInfo?.transactionId}</li>
                      <li>{t('returnAndConfirm') || "Return here and click \"Confirm Payment\""}</li>
                    </ol>
                  </div>
                  <div className="payment-actions">
                    <button
                      className="btn btn-confirm"
                      onClick={handleConfirmPayment}
                      disabled={loading}
                    >
                      {loading ? t('confirming') || "Confirming..." : t('confirmPayment') || "Confirm Payment"}
                    </button>
                    <button
                      className="btn btn-cancel"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      {t('cancel') || "Cancel"}
                    </button>
                  </div>
                  <p className="processing-note">
                    {t('paymentWillBeVerified') || "Payment will be verified within 1-2 minutes"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
