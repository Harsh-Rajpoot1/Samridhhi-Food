// ============================================
// HYBRID FIRESTORE & LOCALSTORAGE DATABASE HELPERS
// ============================================

import { db, isFirebaseConfigured } from './firebase-config.js';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { SAMPLE_PRODUCTS, SAMPLE_DELIVERY_RATES, SAMPLE_ORDERS } from './sample-data.js';

// Helper to determine if we should call Firebase
function useFirebase() {
  return isFirebaseConfigured();
}

// Event dispatcher for real-time listener simulation in local mode
function notifyOrdersChanged() {
  window.dispatchEvent(new CustomEvent('samriddhi-orders-changed'));
}

// ---- Products ----

export async function getProducts(categoryFilter = null) {
  if (useFirebase()) {
    try {
      let q;
      if (categoryFilter && categoryFilter !== 'all') {
        q = query(
          collection(db, 'products'),
          where('category', '==', categoryFilter),
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error('Firebase error, using local fallback:', error);
      return getLocalProducts(categoryFilter);
    }
  } else {
    return getLocalProducts(categoryFilter);
  }
}

export async function getProduct(productId) {
  if (useFirebase()) {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Firebase error, using local fallback:', error);
      return getLocalProduct(productId);
    }
  } else {
    return getLocalProduct(productId);
  }
}

export async function getFeaturedProducts() {
  if (useFirebase()) {
    try {
      const q = query(
        collection(db, 'products'),
        where('featured', '==', true),
        where('inStock', '==', true),
        limit(4)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error('Firebase error, using local fallback:', error);
      return getLocalFeaturedProducts();
    }
  } else {
    return getLocalFeaturedProducts();
  }
}

export async function addProduct(productData) {
  if (useFirebase()) {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Firebase error, saving locally:', error);
      return addLocalProduct(productData);
    }
  } else {
    return addLocalProduct(productData);
  }
}

export async function updateProduct(productId, productData) {
  if (useFirebase()) {
    try {
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, productData);
    } catch (error) {
      console.error('Firebase error, updating locally:', error);
      updateLocalProduct(productId, productData);
    }
  } else {
    updateLocalProduct(productId, productData);
  }
}

export async function deleteProduct(productId) {
  if (useFirebase()) {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      console.error('Firebase error, deleting locally:', error);
      deleteLocalProduct(productId);
    }
  } else {
    deleteLocalProduct(productId);
  }
}

// ---- Orders ----

export async function createOrder(orderData) {
  if (useFirebase()) {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Firebase error, saving order locally:', error);
      return createLocalOrder(orderData);
    }
  } else {
    return createLocalOrder(orderData);
  }
}

export async function getOrders(statusFilter = null) {
  if (useFirebase()) {
    try {
      let q;
      if (statusFilter && statusFilter !== 'all') {
        q = query(
          collection(db, 'orders'),
          where('status', '==', statusFilter),
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error('Firebase error, fetching local orders:', error);
      return getLocalOrders(statusFilter);
    }
  } else {
    return getLocalOrders(statusFilter);
  }
}

export async function getOrder(orderId) {
  if (useFirebase()) {
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Firebase error, fetching local order:', error);
      return getLocalOrder(orderId);
    }
  } else {
    return getLocalOrder(orderId);
  }
}

export async function getOrderByOrderId(displayOrderId) {
  if (useFirebase()) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('orderId', '==', displayOrderId)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const d = snapshot.docs[0];
        return { id: d.id, ...d.data() };
      }
      return null;
    } catch (error) {
      console.error('Firebase error, finding order locally:', error);
      return getLocalOrderByOrderId(displayOrderId);
    }
  } else {
    return getLocalOrderByOrderId(displayOrderId);
  }
}

export async function getOrdersByPhone(phone) {
  if (useFirebase()) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('phone', '==', phone),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error('Firebase error, fetching orders by phone locally:', error);
      return getLocalOrdersByPhone(phone);
    }
  } else {
    return getLocalOrdersByPhone(phone);
  }
}

export async function updateOrderStatus(docId, newStatus) {
  if (useFirebase()) {
    try {
      const docRef = doc(db, 'orders', docId);
      await updateDoc(docRef, { status: newStatus });
    } catch (error) {
      console.error('Firebase error, updating order status locally:', error);
      updateLocalOrderStatus(docId, newStatus);
    }
  } else {
    updateLocalOrderStatus(docId, newStatus);
  }
}

let orderListeners = [];
export function onOrdersSnapshot(callback) {
  if (useFirebase()) {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(orders);
    }, (error) => {
      console.error('onSnapshot error, falling back to local simulation:', error);
      setupLocalOrdersListener(callback);
    });
  } else {
    return setupLocalOrdersListener(callback);
  }
}

function setupLocalOrdersListener(callback) {
  callback(getLocalOrders());
  const listener = () => {
    callback(getLocalOrders());
  };
  window.addEventListener('samriddhi-orders-changed', listener);
  return () => {
    window.removeEventListener('samriddhi-orders-changed', listener);
  };
}

// ---- Delivery Rates ----

export async function getDeliveryRates() {
  if (useFirebase()) {
    try {
      const snapshot = await getDocs(collection(db, 'deliveryRates'));
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error('Firebase error, fetching local rates:', error);
      return getLocalDeliveryRates();
    }
  } else {
    return getLocalDeliveryRates();
  }
}

export async function getDeliveryRateByPincode(pincode) {
  if (useFirebase()) {
    try {
      const rates = await getDeliveryRates();
      for (const zone of rates) {
        if (zone.pincodes && zone.pincodes.includes(pincode)) {
          return zone;
        }
      }
      return null;
    } catch (error) {
      console.error('Firebase error, finding rate locally:', error);
      return getLocalDeliveryRateByPincode(pincode);
    }
  } else {
    return getLocalDeliveryRateByPincode(pincode);
  }
}

export async function addDeliveryRate(rateData) {
  if (useFirebase()) {
    try {
      const docRef = await addDoc(collection(db, 'deliveryRates'), rateData);
      return docRef.id;
    } catch (error) {
      console.error('Firebase error, adding rate locally:', error);
      return addLocalDeliveryRate(rateData);
    }
  } else {
    return addLocalDeliveryRate(rateData);
  }
}

export async function updateDeliveryRate(rateId, rateData) {
  if (useFirebase()) {
    try {
      await updateDoc(doc(db, 'deliveryRates', rateId), rateData);
    } catch (error) {
      console.error('Firebase error, updating rate locally:', error);
      updateLocalDeliveryRate(rateId, rateData);
    }
  } else {
    updateLocalDeliveryRate(rateId, rateData);
  }
}

export async function deleteDeliveryRate(rateId) {
  if (useFirebase()) {
    try {
      await deleteDoc(doc(db, 'deliveryRates', rateId));
    } catch (error) {
      console.error('Firebase error, deleting rate locally:', error);
      deleteLocalDeliveryRate(rateId);
    }
  } else {
    deleteLocalDeliveryRate(rateId);
  }
}

// ---- Store Settings ----

export async function getStoreSettings() {
  if (useFirebase()) {
    try {
      const docRef = doc(db, 'settings', 'store');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return getLocalStoreSettings();
    } catch (error) {
      console.error('Firebase error, fetching local settings:', error);
      return getLocalStoreSettings();
    }
  } else {
    return getLocalStoreSettings();
  }
}

export async function updateStoreSettings(settings) {
  if (useFirebase()) {
    try {
      const docRef = doc(db, 'settings', 'store');
      await updateDoc(docRef, settings);
    } catch (error) {
      console.error('Firebase error, saving settings locally:', error);
      saveLocalStoreSettings(settings);
    }
  } else {
    saveLocalStoreSettings(settings);
  }
}

// ============================================
// LOCAL STORAGE DATA ACCESS IMPLEMENTATIONS
// ============================================

function getLocalProducts(categoryFilter = null) {
  let list = [];
  try {
    const saved = localStorage.getItem('samriddhi_admin_products');
    list = saved ? JSON.parse(saved) : SAMPLE_PRODUCTS;
    if (!saved) {
      localStorage.setItem('samriddhi_admin_products', JSON.stringify(SAMPLE_PRODUCTS));
    }
  } catch {
    list = SAMPLE_PRODUCTS;
  }
  if (categoryFilter && categoryFilter !== 'all') {
    return list.filter(p => p.category === categoryFilter);
  }
  return list;
}

function getLocalProduct(productId) {
  const list = getLocalProducts();
  return list.find(p => p.id === productId) || null;
}

function getLocalFeaturedProducts() {
  const list = getLocalProducts();
  return list.filter(p => p.featured && p.inStock).slice(0, 4);
}

function addLocalProduct(productData) {
  const list = getLocalProducts();
  const id = 'prod_' + Date.now();
  const newProd = { ...productData, id, createdAt: new Date().toISOString() };
  list.push(newProd);
  localStorage.setItem('samriddhi_admin_products', JSON.stringify(list));
  return id;
}

function updateLocalProduct(productId, productData) {
  const list = getLocalProducts();
  const idx = list.findIndex(p => p.id === productId);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...productData };
    localStorage.setItem('samriddhi_admin_products', JSON.stringify(list));
  }
}

function deleteLocalProduct(productId) {
  let list = getLocalProducts();
  list = list.filter(p => p.id !== productId);
  localStorage.setItem('samriddhi_admin_products', JSON.stringify(list));
}

function getLocalOrders(statusFilter = null) {
  let list = [];
  try {
    const saved = localStorage.getItem('samriddhi_orders');
    list = saved ? JSON.parse(saved) : SAMPLE_ORDERS;
    if (!saved) {
      localStorage.setItem('samriddhi_orders', JSON.stringify(SAMPLE_ORDERS));
    }
  } catch {
    list = SAMPLE_ORDERS;
  }
  
  // Sort descending by date
  list.sort((a, b) => new Date(b.createdAt?.toDate ? b.createdAt.toDate() : b.createdAt) - new Date(a.createdAt?.toDate ? a.createdAt.toDate() : a.createdAt));

  if (statusFilter && statusFilter !== 'all') {
    return list.filter(o => o.status === statusFilter);
  }
  return list;
}

function getLocalOrder(orderId) {
  const list = getLocalOrders();
  return list.find(o => o.id === orderId) || null;
}

function getLocalOrderByOrderId(displayOrderId) {
  const list = getLocalOrders();
  return list.find(o => o.orderId === displayOrderId) || null;
}

function getLocalOrdersByPhone(phone) {
  const list = getLocalOrders();
  return list.filter(o => o.phone === phone);
}

function createLocalOrder(orderData) {
  const list = getLocalOrders();
  const id = 'order_' + Date.now();
  const newOrder = { ...orderData, id, createdAt: new Date().toISOString() };
  list.unshift(newOrder); // Add to top
  localStorage.setItem('samriddhi_orders', JSON.stringify(list));
  notifyOrdersChanged();
  return id;
}

function updateLocalOrderStatus(docId, newStatus) {
  const list = getLocalOrders();
  // Try docId first, then orderId fallback
  let idx = list.findIndex(o => o.id === docId);
  if (idx === -1) idx = list.findIndex(o => o.orderId === docId);

  if (idx !== -1) {
    list[idx].status = newStatus;
    localStorage.setItem('samriddhi_orders', JSON.stringify(list));
    notifyOrdersChanged();
  }
}

function getLocalDeliveryRates() {
  let list = [];
  try {
    const saved = localStorage.getItem('samriddhi_admin_rates');
    list = saved ? JSON.parse(saved) : SAMPLE_DELIVERY_RATES;
    if (!saved) {
      localStorage.setItem('samriddhi_admin_rates', JSON.stringify(SAMPLE_DELIVERY_RATES));
    }
  } catch {
    list = SAMPLE_DELIVERY_RATES;
  }
  return list;
}

function getLocalDeliveryRateByPincode(pincode) {
  const list = getLocalDeliveryRates();
  return list.find(zone => zone.pincodes && zone.pincodes.includes(pincode)) || null;
}

function addLocalDeliveryRate(rateData) {
  const list = getLocalDeliveryRates();
  const id = 'zone_' + Date.now();
  const newRate = { ...rateData, id };
  list.push(newRate);
  localStorage.setItem('samriddhi_admin_rates', JSON.stringify(list));
  return id;
}

function updateLocalDeliveryRate(rateId, rateData) {
  const list = getLocalDeliveryRates();
  const idx = list.findIndex(r => r.id === rateId);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...rateData };
    localStorage.setItem('samriddhi_admin_rates', JSON.stringify(list));
  }
}

function deleteLocalDeliveryRate(rateId) {
  let list = getLocalDeliveryRates();
  list = list.filter(r => r.id !== rateId);
  localStorage.setItem('samriddhi_admin_rates', JSON.stringify(list));
}

function getLocalStoreSettings() {
  try {
    const saved = localStorage.getItem('samriddhi_settings');
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    storeName: 'Shree Samvriddhi Foods',
    phone: '+91 73928 66843 / +91 88089 92699',
    phone1: '+91 73928 66843',
    phone2: '+91 88089 92699',
    whatsapp: '+917392866843',
    whatsapp2: '+918808992699',
    address: '00 Near ITI Hostel, Indaurabagh, Devrai Kala, Bakshi Ka Talab Tahsil, Lucknow, Uttar Pradesh - 226202 (Plus Code: XWW4+568)',
    freeDeliveryThreshold: 500,
    fssaiRegNo: '22726102000723',
    fssaiValidUpto: '14-09-2027',
    fssaiAddress: '00 Near ITI Hostel, Indaurabagh, Lucknow, Indara, Bakshi Ka Talab Tahsil, Lucknow, Uttar Pradesh - 226202 (Landmark: ITI Hostel)'
  };
}

function saveLocalStoreSettings(settings) {
  localStorage.setItem('samriddhi_settings', JSON.stringify(settings));
}
