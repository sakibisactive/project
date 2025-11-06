import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Upgrade.css';

const PAYMENT_METHODS = ['bKash', 'Nagad', 'Rocket'];

const Upgrade = () => {
  const { user, token } = useContext(AuthContext);
  const [hasReferral, setHasReferral] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [method, setMethod] = useState('bKash');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [paymentInfo, setPaymentInfo] = useState(null);

  // Fetch referral status
  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const { data } = await axios.get('/api/referral/check', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHasReferral(!!data.hasReferral);
      } catch (_) {}
    };
    fetchReferral();
  }, [token]);

  const computedAmount = () => {
    // Non-premium upgrading
    if (user.role === 'non-premium') {
      return hasReferral ? 900 : 1000;
    }
    // Premium renew pricing based on referral status flags on user (if available)
    if (user.role === 'premium') {
      if (user.hasReferred) return 800;
      if (user.referred === 'YES') return 900;
      return 1000;
    }
    return 1000;
  };

  const handleApplyReferral = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (!/^\w{6}$/.test(referralCode)) {
      setError('Enter last 6 digits of a premium member\'s ID');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/referral/apply-code', { code6: referralCode }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHasReferral(true);
      setMessage(data.message || 'Referral submitted. Awaiting admin approval.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit referral code');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    setError(''); setMessage(''); setPaymentInfo(null);
    setLoading(true);
    try {
      const { data } = await axios.post('/api/payment/initiate', {
        amount: computedAmount(),
        method,
        hasReferral,
        referralCode: referralCode || undefined
      }, { headers: { Authorization: `Bearer ${token}` } });
      setPaymentInfo(data.paymentInfo);
      setMessage('Payment initiated. Admin will verify and approve your upgrade.');
      // Notify admin
      try {
        await axios.post('/api/admin/notification', {
          type: 'upgrade_request',
          userId: user._id,
          userName: user.name,
          amount: data.paymentInfo?.amount,
          method,
          referralCode: referralCode || null,
          message: `${user.name} requested premium upgrade (${method}).`
        });
      } catch (_) {}
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upgrade-container">
      <header className="upgrade-header">
        <h1>Upgrade to Premium</h1>
        <p>Unlock owner contact, MEET requests, offers and more.</p>
      </header>

      {message && <div className="success-box">✓ {message}</div>}
      {error && <div className="error-box">✗ {error}</div>}

      <section className="pricing-card">
        <h2>Membership Fee</h2>
        <p className="price">TK {computedAmount()}</p>
        <p className="price-note">{hasReferral ? '(Referral applied)' : '(No referral applied)'}</p>
      </section>

      <section className="pay-section">
        <h3>Select Payment Method</h3>
        <div className="methods">
          {PAYMENT_METHODS.map(m => (
            <label key={m} className={`method ${method===m?'active':''}`}>
              <input type="radio" name="method" value={m} checked={method===m} onChange={e=>setMethod(e.target.value)} />
              {m}
            </label>
          ))}
        </div>
        <button className="btn-pay" onClick={handlePay} disabled={loading}>{loading? 'Processing...':'Pay'}</button>
      </section>

      <section className="referral-section">
        <h3>Have a referral code?</h3>
        <p>Enter last 6 digits of a Premium member's ID</p>
        <form onSubmit={handleApplyReferral} className="referral-form">
          <input value={referralCode} onChange={e=>setReferralCode(e.target.value.trim())} maxLength={6} placeholder="e.g. A1B2C3" />
          <button type="submit" disabled={loading}>Submit</button>
        </form>
        <small>Admin approval is required to activate your premium membership.</small>
      </section>

      {paymentInfo && (
        <section className="payment-info">
          <h4>Payment Info</h4>
          <ul>
            <li>Transaction: {paymentInfo.transactionId}</li>
            <li>Amount: TK {paymentInfo.amount}</li>
            <li>Method: {paymentInfo.method}</li>
          </ul>
        </section>
      )}
    </div>
  );
};

export default Upgrade;


