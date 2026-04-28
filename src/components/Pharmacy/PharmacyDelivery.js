// src/components/Pharmacy/PharmacyDelivery.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FaTruck, FaPlus, FaMapMarkerAlt, FaCamera, FaFileUpload, 
  FaCreditCard, FaClock, FaCheckCircle, 
  FaSpinner, FaSearch, FaStar, FaMapPin,
  FaPrescriptionBottle, FaTrash, FaMinus, FaPlus as FaPlusIcon,
  FaShoppingCart, FaHeart, FaHeartBroken, FaTag, FaStore,
  FaTimes, FaFilter, FaSortAmountDown, FaSortAmountUp,
  FaRegClock, FaShieldAlt, FaPills, FaSyringe, FaTablets,
  FaEye, FaInfoCircle, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import './PharmacyDelivery.css';

// Medicine Catalog Data
const MEDICINES = [
  { 
    id: 1, 
    name: "Paracetamol", 
    generic_name: "Acetaminophen",
    category: "Pain Relief",
    dosage: "500mg",
    form: "Tablet",
    price: 250,
    old_price: 350,
    manufacturer: "Kenya Medical Supplies",
    prescription_required: false,
    in_stock: true,
    stock_quantity: 500,
    rating: 4.5,
    reviews: 128,
    image: "/api/placeholder/200/200",
    description: "Used for fever and mild to moderate pain relief",
    usage: "Take 1-2 tablets every 4-6 hours as needed",
    side_effects: "Usually well tolerated. May cause nausea in some people."
  },
  { 
    id: 2, 
    name: "Amoxicillin", 
    generic_name: "Amoxicillin Trihydrate",
    category: "Antibiotics",
    dosage: "500mg",
    form: "Capsule",
    price: 450,
    old_price: null,
    manufacturer: "Laboratory & Allied Ltd",
    prescription_required: true,
    in_stock: true,
    stock_quantity: 250,
    rating: 4.8,
    reviews: 95,
    image: "/api/placeholder/200/200",
    description: "Antibiotic used to treat bacterial infections",
    usage: "Take as prescribed by your doctor",
    side_effects: "Diarrhea, nausea, rash"
  },
  { 
    id: 3, 
    name: "Omeprazole", 
    generic_name: "Omeprazole",
    category: "Digestive Health",
    dosage: "20mg",
    form: "Capsule",
    price: 380,
    old_price: 450,
    manufacturer: "Cosmos Limited",
    prescription_required: false,
    in_stock: true,
    stock_quantity: 180,
    rating: 4.3,
    reviews: 210,
    image: "/api/placeholder/200/200",
    description: "Treats heartburn, acid reflux, and stomach ulcers",
    usage: "Take before breakfast daily",
    side_effects: "Headache, constipation, nausea"
  },
  { 
    id: 4, 
    name: "Cetirizine", 
    generic_name: "Cetirizine HCl",
    category: "Allergy",
    dosage: "10mg",
    form: "Tablet",
    price: 180,
    old_price: 250,
    manufacturer: "Regal Pharmaceuticals",
    prescription_required: false,
    in_stock: true,
    stock_quantity: 320,
    rating: 4.6,
    reviews: 167,
    image: "/api/placeholder/200/200",
    description: "Relieves allergy symptoms like sneezing and runny nose",
    usage: "One tablet daily",
    side_effects: "Drowsiness, dry mouth"
  },
  { 
    id: 5, 
    name: "Ibuprofen", 
    generic_name: "Ibuprofen",
    category: "Pain Relief",
    dosage: "400mg",
    form: "Tablet",
    price: 300,
    old_price: null,
    manufacturer: "Dawa Limited",
    prescription_required: false,
    in_stock: true,
    stock_quantity: 450,
    rating: 4.4,
    reviews: 302,
    image: "/api/placeholder/200/200",
    description: "Anti-inflammatory pain reliever",
    usage: "Take 1 tablet every 6-8 hours with food",
    side_effects: "Stomach upset, heartburn"
  },
  { 
    id: 6, 
    name: "Metformin", 
    generic_name: "Metformin HCl",
    category: "Diabetes",
    dosage: "500mg",
    form: "Tablet",
    price: 220,
    old_price: 300,
    manufacturer: "Universal Corporation",
    prescription_required: true,
    in_stock: true,
    stock_quantity: 150,
    rating: 4.7,
    reviews: 88,
    image: "/api/placeholder/200/200",
    description: "Controls blood sugar levels in type 2 diabetes",
    usage: "Take with meals twice daily",
    side_effects: "Nausea, diarrhea, stomach upset"
  },
  { 
    id: 7, 
    name: "Vitamin C", 
    generic_name: "Ascorbic Acid",
    category: "Vitamins",
    dosage: "1000mg",
    form: "Effervescent Tablet",
    price: 450,
    old_price: 550,
    manufacturer: "KAM Industries",
    prescription_required: false,
    in_stock: true,
    stock_quantity: 600,
    rating: 4.9,
    reviews: 520,
    image: "/api/placeholder/200/200",
    description: "Boosts immune system and fights infections",
    usage: "Dissolve one tablet in water daily",
    side_effects: "Generally safe, may cause diarrhea in high doses"
  },
  { 
    id: 8, 
    name: "Losartan", 
    generic_name: "Losartan Potassium",
    category: "Blood Pressure",
    dosage: "50mg",
    form: "Tablet",
    price: 350,
    old_price: null,
    manufacturer: "Elys Chemical Industries",
    prescription_required: true,
    in_stock: false,
    stock_quantity: 0,
    rating: 4.2,
    reviews: 45,
    image: "/api/placeholder/200/200",
    description: "Treats high blood pressure",
    usage: "One tablet daily",
    side_effects: "Dizziness, fatigue"
  }
];

const CATEGORIES = [
  "All", "Pain Relief", "Antibiotics", "Digestive Health", 
  "Allergy", "Diabetes", "Vitamins", "Blood Pressure"
];

// Cart Item Component
const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <div className="cart-item">
    <div className="cart-item-info">
      <h4>{item.name}</h4>
      <p>{item.dosage} - {item.form}</p>
      <p className="cart-item-price">KSh {item.price.toLocaleString()}</p>
    </div>
    <div className="cart-item-quantity">
      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
        <FaMinus />
      </button>
      <span>{item.quantity}</span>
      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
        <FaPlusIcon />
      </button>
      <button className="remove-btn" onClick={() => onRemove(item.id)}>
        <FaTrash />
      </button>
    </div>
  </div>
);

// Medicine Card Component
const MedicineCard = ({ medicine, isInCart, onAddToCart, onViewDetails, onToggleWishlist, isWishlisted }) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="medicine-card">
      {medicine.old_price && (
        <span className="sale-badge">-{Math.round((1 - medicine.price/medicine.old_price) * 100)}%</span>
      )}
      {medicine.prescription_required && (
        <span className="rx-badge">Rx Required</span>
      )}
      
      <div className="medicine-image">
        {!imageError ? (
          <img 
            src={medicine.image} 
            alt={medicine.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="medicine-image-placeholder">
            <FaPills />
          </div>
        )}
      </div>
      
      <div className="medicine-info">
        <div className="medicine-header">
          <h4>{medicine.name}</h4>
          <button 
            className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={() => onToggleWishlist(medicine.id)}
          >
            {isWishlisted ? <FaHeart /> : <FaHeartBroken />}
          </button>
        </div>
        <p className="generic-name">{medicine.generic_name}</p>
        <div className="medicine-meta">
          <span className="dosage">{medicine.dosage} | {medicine.form}</span>
          <span className="category-tag">{medicine.category}</span>
        </div>
        <div className="rating">
          <FaStar className="star" />
          <span>{medicine.rating}</span>
          <span className="reviews">({medicine.reviews} reviews)</span>
        </div>
        <div className="price-section">
          <span className="current-price">KSh {medicine.price.toLocaleString()}</span>
          {medicine.old_price && (
            <span className="old-price">KSh {medicine.old_price.toLocaleString()}</span>
          )}
        </div>
        <div className="stock-status">
          {medicine.in_stock ? (
            <span className="in-stock"><FaCheckCircle /> In Stock ({medicine.stock_quantity} units)</span>
          ) : (
            <span className="out-of-stock"><FaTimes /> Out of Stock</span>
          )}
        </div>
        <div className="card-actions">
          <button className="view-btn" onClick={() => onViewDetails(medicine)}>
            <FaEye /> View
          </button>
          <button 
            className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''}`}
            onClick={() => onAddToCart(medicine)}
            disabled={!medicine.in_stock}
          >
            {isInCart ? <FaCheckCircle /> : <FaShoppingCart />}
            {isInCart ? ' Added' : ' Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const PharmacyDelivery = () => {
  // State
  const [medicines, setMedicines] = useState(MEDICINES);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('pharmacyCart');
    const savedWishlist = localStorage.getItem('pharmacyWishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);
  
  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('pharmacyCart', JSON.stringify(cart));
  }, [cart]);
  
  useEffect(() => {
    localStorage.setItem('pharmacyWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Filter and sort medicines
  const filteredMedicines = medicines
    .filter(medicine => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.generic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || medicine.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
      else if (sortBy === 'price') comparison = a.price - b.price;
      else if (sortBy === 'rating') comparison = a.rating - b.rating;
      else if (sortBy === 'popularity') comparison = a.reviews - b.reviews;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Cart functions
  const addToCart = (medicine) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === medicine.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Wishlist functions
  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(itemId => itemId !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const isInWishlist = (id) => wishlist.includes(id);

  // Checkout
  const handleCheckout = async () => {
    setLoading(true);
    // Simulate order placement
    setTimeout(() => {
      setLoading(false);
      setShowCheckoutModal(false);
      setCart([]);
      alert('Order placed successfully! Your medicines will be delivered within 2-3 days.');
    }, 2000);
  };

  // View medicine details
  const viewMedicineDetails = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDetailsModal(true);
  };

  return (
    <div className="pharmacy-delivery">
      {/* Header */}
      <div className="pharmacy-header">
        <div>
          <h2><FaStore /> Online Pharmacy</h2>
          <p>Quality medicines delivered to your doorstep</p>
        </div>
        <div className="header-actions">
          <button className="cart-btn" onClick={() => setShowCart(true)}>
            <FaShoppingCart />
            {cart.length > 0 && <span className="cart-badge">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>}
          </button>
          <button className="btn-primary" onClick={() => setShowCheckoutModal(true)} disabled={cart.length === 0}>
            Checkout
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search medicines by name, brand, or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-section">
          <div className="category-filters">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="sort-section">
            <FaSortAmountDown />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
              <option value="popularity">Sort by Popularity</option>
            </select>
            <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
              {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        Found {filteredMedicines.length} medicines
        {searchTerm && ` matching "${searchTerm}"`}
        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
      </div>

      {/* Medicine Grid */}
      <div className="medicines-grid">
        {filteredMedicines.map(medicine => (
          <MedicineCard 
            key={medicine.id}
            medicine={medicine}
            isInCart={cart.some(item => item.id === medicine.id)}
            onAddToCart={addToCart}
            onViewDetails={viewMedicineDetails}
            onToggleWishlist={toggleWishlist}
            isWishlisted={isInWishlist(medicine.id)}
          />
        ))}
      </div>

      {filteredMedicines.length === 0 && (
        <div className="empty-state">
          <FaPills />
          <h3>No medicines found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="cart-sidebar-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h3><FaShoppingCart /> Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</h3>
              <button className="close-cart" onClick={() => setShowCart(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <FaShoppingCart />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <CartItem 
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateCartQuantity}
                    onRemove={removeFromCart}
                  />
                ))
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Subtotal:</span>
                  <span>KSh {getCartTotal().toLocaleString()}</span>
                </div>
                <div className="cart-total">
                  <span>Delivery Fee:</span>
                  <span>KSh 150</span>
                </div>
                <div className="cart-grand-total">
                  <span>Total:</span>
                  <span>KSh {(getCartTotal() + 150).toLocaleString()}</span>
                </div>
                <button className="checkout-btn" onClick={() => {
                  setShowCart(false);
                  setShowCheckoutModal(true);
                }}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Medicine Details Modal */}
      {showDetailsModal && selectedMedicine && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedMedicine.name}</h3>
              <button onClick={() => setShowDetailsModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body details-body">
              <div className="details-grid">
                <div className="details-info">
                  <p><strong>Generic Name:</strong> {selectedMedicine.generic_name}</p>
                  <p><strong>Category:</strong> {selectedMedicine.category}</p>
                  <p><strong>Dosage:</strong> {selectedMedicine.dosage}</p>
                  <p><strong>Form:</strong> {selectedMedicine.form}</p>
                  <p><strong>Manufacturer:</strong> {selectedMedicine.manufacturer}</p>
                  <p><strong>Prescription Required:</strong> {selectedMedicine.prescription_required ? 'Yes' : 'No'}</p>
                </div>
                <div className="details-price">
                  <p className="price">KSh {selectedMedicine.price.toLocaleString()}</p>
                  <button 
                    className="add-to-cart-btn large"
                    onClick={() => {
                      addToCart(selectedMedicine);
                      setShowDetailsModal(false);
                    }}
                    disabled={!selectedMedicine.in_stock}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="details-description">
                <h4>Description</h4>
                <p>{selectedMedicine.description}</p>
                <h4>Usage</h4>
                <p>{selectedMedicine.usage}</p>
                <h4>Side Effects</h4>
                <p>{selectedMedicine.side_effects}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="modal-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div className="modal-content checkout-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Checkout</h3>
              <button onClick={() => setShowCheckoutModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="order-summary">
                <h4>Order Summary</h4>
                {cart.map(item => (
                  <div key={item.id} className="order-item">
                    <span>{item.name} x {item.quantity}</span>
                    <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="order-total">
                  <strong>Total:</strong>
                  <strong>KSh {(getCartTotal() + 150).toLocaleString()}</strong>
                </div>
              </div>
              
              <div className="form-group">
                <label>Delivery Address</label>
                <textarea 
                  rows="3" 
                  placeholder="Enter your delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="">Select payment method</option>
                  <option value="mpesa">M-Pesa</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="delivery">Cash on Delivery</option>
                </select>
              </div>
              
              {paymentMethod === 'mpesa' && (
                <div className="form-group">
                  <label>M-Pesa Phone Number</label>
                  <input type="tel" placeholder="0712345678" />
                  <small>You will receive a prompt to complete payment</small>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCheckoutModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCheckout} disabled={loading}>
                {loading ? <FaSpinner className="spin" /> : <FaTruck />} Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyDelivery;