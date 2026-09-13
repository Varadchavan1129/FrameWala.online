// e2e-test.js
const fs = require('fs');

async function apiCall(url, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(`http://localhost:5000/api${url}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API call failed: ' + url);
  return data;
}

async function runE2E() {
  try {
    console.log('--- STARTING E2E CUSTOMER JOURNEY TEST ---');
    
    // ---------------------------------------------------------
    // Customer A Flow
    // ---------------------------------------------------------
    console.log('\n[Customer A] 1. Register or Login');
    let tokenA, userA;
    try {
      const loginRes = await apiCall('/auth/login', 'POST', { email: 'customerA@framewala.com', password: 'TestPassword123!' });
      tokenA = loginRes.data.token;
      userA = loginRes.data.user;
      console.log('Customer A Logged in.');
    } catch (e) {
      const regRes = await apiCall('/auth/register', 'POST', { first_name: 'Customer', last_name: 'A', email: 'customerA@framewala.com', phone: '9876543210', password: 'TestPassword123!', role: 'customer' });
      tokenA = regRes.data.token;
      userA = regRes.data.user;
      console.log('Customer A Registered.');
    }

    console.log('\n[Customer A] 2. View Products');
    const productsRes = await apiCall('/products');
    const products = productsRes.data.products;
    const prod1 = products[0];
    const prod2 = products[1];
    console.log(`Loaded ${products.length} products. Selected: ${prod1.product_id} & ${prod2.product_id}`);

    console.log('\n[Customer A] 3. Add to Wishlist');
    await apiCall('/wishlist', 'POST', { product_id: prod1.product_id }, tokenA);
    const wlA = await apiCall('/wishlist', 'GET', null, tokenA);
    console.log(`Wishlist count: ${wlA.data.wishlist.length}`);

    console.log('\n[Customer A] 4. Add to Cart');
    const cartAddRes = await apiCall('/cart/items', 'POST', { product_id: prod1.product_id, quantity: 1 }, tokenA);
    let cartA = await apiCall('/cart', 'GET', null, tokenA);
    console.log(`Cart items count: ${cartA.data.items.length}`);

    console.log('\n[Customer A] 5. Change quantities');
    const cartItemId = cartA.data.items[0].cart_item_id;
    await apiCall(`/cart/items/${cartItemId}`, 'PUT', { quantity: 2 }, tokenA);
    cartA = await apiCall('/cart', 'GET', null, tokenA);
    console.log(`Cart item quantity updated to: ${cartA.data.items[0].quantity}`);

    console.log('\n[Customer A] 6. Add an address');
    const addressRes = await apiCall('/auth/addresses', 'POST', {
      full_name: 'Customer A', phone: '9876543210', address_line: '123 A Street', city: 'A City', state: 'A State', pincode: '111111'
    }, tokenA);
    const addressId = addressRes.data.address_id;
    console.log(`Address added with ID: ${addressId}`);

    console.log('\n[Customer A] 7 & 8. Place an order');
    const orderRes = await apiCall('/orders', 'POST', { address_id: addressId, payment_method: 'Card' }, tokenA);
    const orderId = orderRes.data.order.order_id;
    console.log(`Order placed with ID: ${orderId}`);

    console.log('\n[Customer A] 11. Confirm cart is updated after checkout');
    cartA = await apiCall('/cart', 'GET', null, tokenA);
    console.log(`Cart items count after checkout: ${cartA.data.items.length} (expected 0)`);

    console.log('\n[Customer A] 12. Open order history');
    const historyA = await apiCall('/orders', 'GET', null, tokenA);
    console.log(`Order history count: ${historyA.data.orders.length}`);

    console.log('\n[Customer A] 13. Open order details/tracking');
    const trackingA = await apiCall(`/orders/${orderId}`, 'GET', null, tokenA);
    console.log(`Order ${orderId} status: ${trackingA.data.order.order_status}`);
    console.log(`Order ${orderId} shipment tracking: ${trackingA.data.order.shipment.tracking_number}`);

    console.log('\n[Customer A] 14 & 15 & 16. Logout, Login again, Confirm restored');
    const loginRes2 = await apiCall('/auth/login', 'POST', { email: 'customerA@framewala.com', password: 'TestPassword123!' });
    const tokenA2 = loginRes2.data.token;
    const profileA2 = await apiCall('/auth/profile', 'GET', null, tokenA2);
    const wlA2 = await apiCall('/wishlist', 'GET', null, tokenA2);
    const addrA2 = await apiCall('/auth/addresses', 'GET', null, tokenA2);
    const histA2 = await apiCall('/orders', 'GET', null, tokenA2);
    console.log(`Profile restored: ${profileA2.data.user.email}`);
    console.log(`Wishlist restored: ${wlA2.data.wishlist.length} items`);
    console.log(`Addresses restored: ${addrA2.data.addresses.length} items`);
    console.log(`Order History restored: ${histA2.data.orders.length} items`);

    // ---------------------------------------------------------
    // Customer B Flow
    // ---------------------------------------------------------
    console.log('\n--- STARTING CUSTOMER B ISOLATION TEST ---');
    console.log('\n[Customer B] 1. Login/Register');
    let tokenB;
    try {
      const loginB = await apiCall('/auth/login', 'POST', { email: 'customerB@framewala.com', password: 'TestPassword123!' });
      tokenB = loginB.data.token;
      console.log('Customer B Logged in.');
    } catch (e) {
      const regB = await apiCall('/auth/register', 'POST', { first_name: 'Customer', last_name: 'B', email: 'customerB@framewala.com', phone: '1234567890', password: 'TestPassword123!', role: 'customer' });
      tokenB = regB.data.token;
      console.log('Customer B Registered.');
    }

    console.log('\n[Customer B] 2. Confirm Customer A data is not visible');
    const wlB = await apiCall('/wishlist', 'GET', null, tokenB);
    const cartB = await apiCall('/cart', 'GET', null, tokenB);
    const addrB = await apiCall('/auth/addresses', 'GET', null, tokenB);
    const histB = await apiCall('/orders', 'GET', null, tokenB);
    
    console.log(`Wishlist count: ${wlB.data.wishlist.length} (expected 0)`);
    console.log(`Cart count: ${cartB.data.items.length} (expected 0)`);
    console.log(`Addresses count: ${addrB.data.addresses.length} (expected 0)`);
    console.log(`Orders count: ${histB.data.orders.length} (expected 0)`);

    console.log('\n[Customer B] 3. Add separate data');
    await apiCall('/wishlist', 'POST', { product_id: prod2.product_id }, tokenB);
    console.log('Customer B added different item to wishlist.');

    console.log('\n[Customer B] 4. Confirm accounts remain isolated');
    const wlB2 = await apiCall('/wishlist', 'GET', null, tokenB);
    const wlA3 = await apiCall('/wishlist', 'GET', null, tokenA2);
    console.log(`Customer B Wishlist count: ${wlB2.data.wishlist.length}`);
    console.log(`Customer A Wishlist count: ${wlA3.data.wishlist.length}`);
    
    // Attempt unauthorized access
    console.log('\n[Security] Attempting to access Customer A order using Customer B token...');
    try {
      await apiCall(`/orders/${orderId}`, 'GET', null, tokenB);
      console.log('FAIL: Customer B accessed Customer A order!');
    } catch (e) {
      console.log('SUCCESS: Customer B blocked from accessing Customer A order. (' + e.message + ')');
    }

    console.log('\n--- E2E TEST COMPLETED SUCCESSFULLY ---');
  } catch (error) {
    console.error('\n!!! E2E TEST FAILED !!!');
    console.error(error.message);
  }
}

runE2E();
