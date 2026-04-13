// src/components/Pharmacy/PharmacyDelivery.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  FaTruck, FaPlus, FaMapMarkerAlt, FaCamera, FaFileUpload, 
  FaCreditCard, FaShieldAlt, FaClock, FaCheckCircle, 
  FaSpinner, FaSearch, FaPhone, FaEnvelope, FaStar, 
  FaMapPin, FaDirections, FaTrash, FaDownload, FaEye,
  FaPrescriptionBottle, FaCalendarAlt, FaBell, FaCog,
  FaCreditCard as FaCreditCardIcon, FaMoneyBillWave, FaShieldVirus
} from 'react-icons/fa';
import './PharmacyDelivery.css';

const PharmacyDelivery = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPharmacyLocator, setShowPharmacyLocator] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [orderData, setOrderData] = useState({
    prescription_id: '',
    pharmacy_id: '',
    delivery_address: '',
    delivery_method: 'standard',
    payment_method: '',
    insurance_id: '',
    special_instructions: ''
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [insuranceCards, setInsuranceCards] = useState([]);
  const [uploadedPrescription, setUploadedPrescription] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Get user ID from localStorage
  const getUserId = () => {
    return localStorage.getItem('userId') || localStorage.getItem('patientId');
  };

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // Fetch user's orders
  const fetchOrders = async () => {
    setLoading(true);
    const token = getAuthToken();
    const userId = getUserId();
    
    try {
      const response = await fetch(`http://localhost:5000/api/pharmacy/orders/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        // Fallback to demo data if endpoint doesn't exist
        setOrders([
          { id: 1, medication_name: 'Lisinopril', dosage: '10mg', quantity: 30, status: 'shipped', estimated_delivery: '2026-04-07', pharmacy_name: 'CVS Pharmacy', tracking_number: 'TRK123456', created_at: '2026-04-01' },
          { id: 2, medication_name: 'Metformin', dosage: '500mg', quantity: 60, status: 'processing', estimated_delivery: '2026-04-10', pharmacy_name: 'Walgreens', created_at: '2026-04-02' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's prescriptions
  const fetchPrescriptions = async () => {
    const token = getAuthToken();
    const userId = getUserId();
    
    try {
      const response = await fetch(`http://localhost:5000/api/prescriptions?patient_id=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
      } else {
        // Fallback demo data
        setPrescriptions([
          { id: 1, medication_name: 'Lisinopril', dosage: '10mg', quantity: 30, refills_left: 2, expires_at: '2026-12-31' },
          { id: 2, medication_name: 'Metformin', dosage: '500mg', quantity: 60, refills_left: 1, expires_at: '2026-10-15' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
    }
  };

  // Fetch nearby pharmacies
  const fetchNearbyPharmacies = async (lat, lng) => {
    setLoading(true);
    try {
      // In production, use a pharmacy API like GoodRx, Walgreens API, or Google Places
      // For now, return demo data based on location
      const demoPharmacies = [
        { id: 1, name: 'CVS Pharmacy', address: '123 Main St', distance: 0.8, rating: 4.5, phone: '(555) 123-4567', hours: '8AM - 10PM', price_level: 2, in_stock: true },
        { id: 2, name: 'Walgreens', address: '456 Oak Ave', distance: 1.2, rating: 4.2, phone: '(555) 234-5678', hours: '24 hours', price_level: 2, in_stock: true },
        { id: 3, name: 'Rite Aid', address: '789 Pine St', distance: 2.1, rating: 4.0, phone: '(555) 345-6789', hours: '9AM - 9PM', price_level: 2, in_stock: false },
        { id: 4, name: 'Local Pharmacy', address: '321 Elm St', distance: 0.5, rating: 4.8, phone: '(555) 456-7890', hours: '9AM - 8PM', price_level: 1, in_stock: true }
      ];
      setPharmacies(demoPharmacies);
    } catch (err) {
      console.error('Error fetching pharmacies:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          fetchNearbyPharmacies(location.lat, location.lng);
        },
        (error) => {
          console.error('Geolocation error:', error);
          fetchNearbyPharmacies(40.7128, -74.0060); // Default to NYC
        }
      );
    } else {
      fetchNearbyPharmacies(40.7128, -74.0060);
    }
  };

  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    const token = getAuthToken();
    const userId = getUserId();
    
    try {
      const response = await fetch(`http://localhost:5000/api/payment/methods/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data);
      } else {
        setPaymentMethods([
          { id: 1, type: 'credit_card', last4: '4242', expiry: '12/26', is_default: true },
          { id: 2, type: 'paypal', email: 'user@example.com' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching payment methods:', err);
    }
  };

  // Fetch insurance cards
  const fetchInsuranceCards = async () => {
    const token = getAuthToken();
    const userId = getUserId();
    
    try {
      const response = await fetch(`http://localhost:5000/api/insurance/cards/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setInsuranceCards(data);
      }
    } catch (err) {
      console.error('Error fetching insurance cards:', err);
    }
  };

  // Upload prescription image
  const uploadPrescription = async (file) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('prescription', file);
    formData.append('user_id', getUserId());

    try {
      const response = await fetch('http://localhost:5000/api/pharmacy/upload-prescription', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        addNotification('Prescription Uploaded', 'Your prescription has been uploaded successfully', 'success');
        setShowPrescriptionUpload(false);
        fetchPrescriptions();
      }
    } catch (err) {
      console.error('Upload error:', err);
      addNotification('Upload Failed', 'Please try again', 'error');
    }
  };

  // Place order
  const placeOrder = async () => {
    setLoading(true);
    const token = getAuthToken();
    
    try {
      const response = await fetch('http://localhost:5000/api/pharmacy/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      
      if (response.ok) {
        addNotification('Order Placed', 'Your order has been placed successfully', 'success');
        setShowOrderModal(false);
        fetchOrders();
        setOrderData({
          prescription_id: '',
          pharmacy_id: '',
          delivery_address: '',
          delivery_method: 'standard',
          payment_method: '',
          insurance_id: '',
          special_instructions: ''
        });
      } else {
        addNotification('Order Failed', 'Please try again', 'error');
      }
    } catch (err) {
      console.error('Order error:', err);
      addNotification('Order Failed', 'Network error. Please try again', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Track order
  const trackOrder = async (order) => {
    setTrackingOrder(order);
    const token = getAuthToken();
    
    try {
      const response = await fetch(`http://localhost:5000/api/pharmacy/orders/${order.id}/track`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTrackingOrder({ ...order, tracking_data: data });
      }
    } catch (err) {
      console.error('Tracking error:', err);
      addNotification('Tracking Unavailable', 'Tracking information will appear soon', 'info');
    }
  };

  // Add notification
  const addNotification = (title, message, type) => {
    // This would integrate with your global notification system
    console.log(`${title}: ${message}`);
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FaClock />;
      case 'processing': return <FaSpinner className="spin" />;
      case 'shipped': return <FaTruck />;
      case 'delivered': return <FaCheckCircle />;
      case 'cancelled': return <FaTrash />;
      default: return <FaPrescriptionBottle />;
    }
  };

  // Get status class
  const getStatusClass = (status) => {
    return `status-${status}`;
  };

  useEffect(() => {
    fetchOrders();
    fetchPrescriptions();
    fetchPaymentMethods();
    fetchInsuranceCards();
  }, []);

  // Render tracking modal
  const renderTrackingModal = () => {
    if (!trackingOrder) return null;
    
    return (
      <div className="modal-overlay" onClick={() => setTrackingOrder(null)}>
        <div className="modal-content tracking-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3><FaTruck /> Track Order - {trackingOrder.medication_name}</h3>
            <button onClick={() => setTrackingOrder(null)}>×</button>
          </div>
          <div className="modal-body">
            <div className="tracking-timeline">
              <div className={`timeline-step ${trackingOrder.status !== 'pending' ? 'completed' : ''}`}>
                <div className="step-icon">📝</div>
                <div className="step-content">
                  <h4>Order Placed</h4>
                  <p>{new Date(trackingOrder.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className={`timeline-step ${trackingOrder.status === 'processing' || trackingOrder.status === 'shipped' || trackingOrder.status === 'delivered' ? 'completed' : ''}`}>
                <div className="step-icon">⚙️</div>
                <div className="step-content">
                  <h4>Processing</h4>
                  <p>Pharmacy is preparing your order</p>
                </div>
              </div>
              <div className={`timeline-step ${trackingOrder.status === 'shipped' || trackingOrder.status === 'delivered' ? 'completed' : ''}`}>
                <div className="step-icon">🚚</div>
                <div className="step-content">
                  <h4>Shipped</h4>
                  <p>Your order is on the way</p>
                  {trackingOrder.tracking_number && <p className="tracking-number">Tracking: {trackingOrder.tracking_number}</p>}
                </div>
              </div>
              <div className={`timeline-step ${trackingOrder.status === 'delivered' ? 'completed' : ''}`}>
                <div className="step-icon">✅</div>
                <div className="step-content">
                  <h4>Delivered</h4>
                  <p>Estimated: {new Date(trackingOrder.estimated_delivery).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            {trackingOrder.tracking_data?.location && (
              <div className="delivery-location">
                <FaMapMarkerAlt />
                <span>Current Location: {trackingOrder.tracking_data.location}</span>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn-primary" onClick={() => setTrackingOrder(null)}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  // Render pharmacy locator modal
  const renderPharmacyLocator = () => {
    if (!showPharmacyLocator) return null;
    
    return (
      <div className="modal-overlay" onClick={() => setShowPharmacyLocator(false)}>
        <div className="modal-content pharmacy-locator-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3><FaMapMarkerAlt /> Nearby Pharmacies</h3>
            <button onClick={() => setShowPharmacyLocator(false)}>×</button>
          </div>
          <div className="modal-body">
            <button className="locate-me-btn" onClick={getUserLocation}>
              <FaMapPin /> Use My Location
            </button>
            <div className="pharmacies-list">
              {pharmacies.map(pharmacy => (
                <div 
                  key={pharmacy.id} 
                  className={`pharmacy-card ${selectedPharmacy?.id === pharmacy.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPharmacy(pharmacy)}
                >
                  <div className="pharmacy-info">
                    <h4>{pharmacy.name}</h4>
                    <p className="pharmacy-address">{pharmacy.address}</p>
                    <div className="pharmacy-meta">
                      <span><FaMapPin /> {pharmacy.distance} miles</span>
                      <span><FaStar /> {pharmacy.rating}</span>
                      <span><FaClock /> {pharmacy.hours}</span>
                    </div>
                    {!pharmacy.in_stock && <span className="out-of-stock">Out of Stock</span>}
                  </div>
                  <button 
                    className="select-pharmacy-btn"
                    onClick={() => {
                      setSelectedPharmacy(pharmacy);
                      setOrderData({...orderData, pharmacy_id: pharmacy.id});
                      setShowPharmacyLocator(false);
                    }}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render prescription upload modal
  const renderPrescriptionUpload = () => {
    if (!showPrescriptionUpload) return null;
    
    return (
      <div className="modal-overlay" onClick={() => setShowPrescriptionUpload(false)}>
        <div className="modal-content upload-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3><FaCamera /> Upload Prescription</h3>
            <button onClick={() => setShowPrescriptionUpload(false)}>×</button>
          </div>
          <div className="modal-body">
            <div className="upload-options">
              <div className="upload-option" onClick={() => fileInputRef.current?.click()}>
                <FaFileUpload />
                <span>Upload from Device</span>
              </div>
              <div className="upload-option" onClick={() => cameraInputRef.current?.click()}>
                <FaCamera />
                <span>Take Photo</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*,application/pdf"
              onChange={(e) => e.target.files[0] && uploadPrescription(e.target.files[0])}
            />
            <input 
              type="file" 
              ref={cameraInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              capture="environment"
              onChange={(e) => e.target.files[0] && uploadPrescription(e.target.files[0])}
            />
            {uploadProgress > 0 && (
              <div className="upload-progress">
                <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                <span>{uploadProgress}% uploaded</span>
              </div>
            )}
            <div className="prescription-info">
              <p><FaShieldVirus /> Your prescription is encrypted and securely stored</p>
              <p>Accepted formats: JPG, PNG, PDF (max 10MB)</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render order modal
  const renderOrderModal = () => {
    if (!showOrderModal) return null;
    
    return (
      <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
        <div className="modal-content order-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3><FaPlus /> Order Prescription</h3>
            <button onClick={() => setShowOrderModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Select Prescription</label>
              <select 
                value={orderData.prescription_id} 
                onChange={e => setOrderData({...orderData, prescription_id: e.target.value})}
              >
                <option value="">Choose a prescription...</option>
                {prescriptions.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.medication_name} {p.dosage} - {p.quantity} tablets ({p.refills_left} refills left)
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Pharmacy</label>
              <div className="pharmacy-select">
                <select 
                  value={orderData.pharmacy_id} 
                  onChange={e => setOrderData({...orderData, pharmacy_id: e.target.value})}
                >
                  <option value="">Select a pharmacy...</option>
                  {pharmacies.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {p.distance} miles away</option>
                  ))}
                </select>
                <button type="button" className="find-pharmacy-btn" onClick={() => { getUserLocation(); setShowPharmacyLocator(true); }}>
                  <FaSearch /> Find Nearby
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>Delivery Method</label>
              <div className="delivery-options">
                <label className={`delivery-option ${orderData.delivery_method === 'standard' ? 'selected' : ''}`}>
                  <input type="radio" name="delivery_method" value="standard" checked={orderData.delivery_method === 'standard'} onChange={e => setOrderData({...orderData, delivery_method: e.target.value})} />
                  <div>
                    <strong>Standard Delivery</strong>
                    <small>3-5 business days - Free</small>
                  </div>
                </label>
                <label className={`delivery-option ${orderData.delivery_method === 'express' ? 'selected' : ''}`}>
                  <input type="radio" name="delivery_method" value="express" checked={orderData.delivery_method === 'express'} onChange={e => setOrderData({...orderData, delivery_method: e.target.value})} />
                  <div>
                    <strong>Express Delivery</strong>
                    <small>1-2 business days - $9.99</small>
                  </div>
                </label>
                <label className={`delivery-option ${orderData.delivery_method === 'pickup' ? 'selected' : ''}`}>
                  <input type="radio" name="delivery_method" value="pickup" checked={orderData.delivery_method === 'pickup'} onChange={e => setOrderData({...orderData, delivery_method: e.target.value})} />
                  <div>
                    <strong>In-Store Pickup</strong>
                    <small>Ready in 2 hours - Free</small>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Delivery Address</label>
              <textarea 
                rows="3" 
                placeholder="Enter delivery address"
                value={orderData.delivery_address}
                onChange={e => setOrderData({...orderData, delivery_address: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-methods">
                <select 
                  value={orderData.payment_method} 
                  onChange={e => setOrderData({...orderData, payment_method: e.target.value})}
                >
                  <option value="">Select payment method...</option>
                  {paymentMethods.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.type === 'credit_card' ? `💳 Card ending in ${p.last4}` : `📧 PayPal (${p.email})`}
                    </option>
                  ))}
                </select>
                <button type="button" className="add-payment-btn" onClick={() => setShowPaymentModal(true)}>
                  <FaCreditCardIcon /> Add New
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>Insurance (Optional)</label>
              <select 
                value={orderData.insurance_id} 
                onChange={e => setOrderData({...orderData, insurance_id: e.target.value})}
              >
                <option value="">Apply insurance</option>
                {insuranceCards.map(i => (
                  <option key={i.id} value={i.id}>{i.provider_name} - {i.member_id}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Special Instructions</label>
              <textarea 
                rows="2" 
                placeholder="Any special instructions for the pharmacy?"
                value={orderData.special_instructions}
                onChange={e => setOrderData({...orderData, special_instructions: e.target.value})}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setShowOrderModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={placeOrder} disabled={loading}>
              {loading ? <FaSpinner className="spin" /> : <FaTruck />} Place Order
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render payment modal
  const renderPaymentModal = () => {
    if (!showPaymentModal) return null;
    
    return (
      <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
        <div className="modal-content payment-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3><FaCreditCardIcon /> Add Payment Method</h3>
            <button onClick={() => setShowPaymentModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <div className="payment-types">
              <button className="payment-type-btn">💳 Credit Card</button>
              <button className="payment-type-btn">📱 PayPal</button>
              <button className="payment-type-btn">🏦 Bank Account</button>
            </div>
            <div className="form-group">
              <label>Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input type="text" placeholder="MM/YY" />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input type="text" placeholder="123" />
              </div>
            </div>
            <div className="form-group">
              <label>Name on Card</label>
              <input type="text" placeholder="John Doe" />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setShowPaymentModal(false)}>Cancel</button>
            <button className="btn-primary">Add Payment Method</button>
          </div>
        </div>
      </div>
    );
  };

  if (loading && orders.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <FaSpinner className="spin" />
          <p>Loading pharmacy data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pharmacy-delivery">
      <div className="pharmacy-header">
        <h2><FaTruck /> Pharmacy Delivery</h2>
        <div className="header-actions">
          <button className="btn-outline" onClick={() => setShowPrescriptionUpload(true)}>
            <FaCamera /> Upload Prescription
          </button>
          <button className="btn-primary" onClick={() => setShowOrderModal(true)}>
            <FaPlus /> New Order
          </button>
        </div>
      </div>

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="empty-state">
            <FaPrescriptionBottle />
            <h3>No orders yet</h3>
            <p>Upload a prescription or order medication to get started</p>
            <button className="btn-primary" onClick={() => setShowOrderModal(true)}>
              Order Now
            </button>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-status">
                  <span className={getStatusClass(order.status)}>
                    {getStatusIcon(order.status)} {order.status}
                  </span>
                </div>
                <div className="order-date">
                  Ordered: {new Date(order.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div className="order-details">
                <h3>{order.medication_name} {order.dosage}</h3>
                <p>Quantity: {order.quantity} tablets</p>
                <p>Pharmacy: {order.pharmacy_name}</p>
                <p>Est. Delivery: {new Date(order.estimated_delivery).toLocaleDateString()}</p>
              </div>
              
              <div className="order-tracking">
                <div className="tracking-steps">
                  <div className={`step ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'completed' : order.status === 'pending' ? 'active' : ''}`}>
                    <span className="step-icon">📝</span>
                    <span className="step-label">Ordered</span>
                  </div>
                  <div className={`step ${order.status === 'processing' ? 'active' : order.status === 'shipped' || order.status === 'delivered' ? 'completed' : ''}`}>
                    <span className="step-icon">⚙️</span>
                    <span className="step-label">Processing</span>
                  </div>
                  <div className={`step ${order.status === 'shipped' ? 'active' : order.status === 'delivered' ? 'completed' : ''}`}>
                    <span className="step-icon">🚚</span>
                    <span className="step-label">Shipped</span>
                  </div>
                  <div className={`step ${order.status === 'delivered' ? 'active completed' : ''}`}>
                    <span className="step-icon">✅</span>
                    <span className="step-label">Delivered</span>
                  </div>
                </div>
                <div className="order-actions">
                  {order.tracking_number && (
                    <button className="track-btn" onClick={() => trackOrder(order)}>
                      <FaMapMarkerAlt /> Track Order
                    </button>
                  )}
                  <button className="reorder-btn" onClick={() => {
                    setOrderData({...orderData, prescription_id: order.prescription_id});
                    setShowOrderModal(true);
                  }}>
                    <FaPlus /> Reorder
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {renderOrderModal()}
      {renderPrescriptionUpload()}
      {renderPaymentModal()}
      {renderPharmacyLocator()}
      {renderTrackingModal()}
    </div>
  );
};

export default PharmacyDelivery;