function loadSection(section, element = null) {
  // Remove 'active' class from all nav options
  document.querySelectorAll('.nav-option').forEach(opt => opt.classList.remove('active'));

  // Add 'active' class to the clicked option
  if (element) element.classList.add('active');

  // Simulate section loading with static content for now
  let content = '';
  if (section === 'overview') {
  generateGreeting();
  content = `
    <div class="overview">
      <div class="greeting-card">
       <h1 class="section-title" id="greeting"></h1>
      </div>

      <div class="summary-cards">
        <div class="card">
          <h3>Total Users</h3>
          <p class="value" id="total-users">0</p>
        </div>

        <div class="card">
          <h3>Total Admins</h3>
          <p class="value" id="total-admins">0</p>
        </div>

        <div class="card">
          <h3>Total Inventory</h3>
          <p class="value" id="total-inventory">0</p>
        </div>

        <div class="card">
          <h3>New Orders</h3>
          <p class="value" id="new-orders">0</p>
        </div>
      </div>

      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <ul class="activity-log" id="activity-log">
          <li>Loading recent activity...</li>
        </ul>
      </div>
    </div>
  `;
  
  document.getElementById('main-content').innerHTML = content;
  
  // Load the data after the content is rendered
  setTimeout(() => {
    loadOverviewStats();
    loadRecentActivity();
  }, 100);
} else if (section === 'make-sale') {
  content = `
    <div class="make-sale-section">
      <div class="pos-wrapper">
        <div class="make-sale-title">
          <img src="../assets/icons/icons8-sell-100(mod).png" alt="make sale Icon" class="make-sale-icon" />
          <h2>Point of Sale</h2>
        </div>

        <div class="pos-main-grid">
          <!-- Product Selection Area -->
          <div class="product-selection">
            <h3>Product Selection</h3>
            <form onsubmit="handleAddToCart(event)">
              <div class="autocomplete-group">
                <label for="product-search">Search Product</label>
                <input type="text" id="product-search" placeholder="Start typing product name..." oninput="filterProducts()" autocomplete="off" />
                <ul id="product-list" class="autocomplete-list"></ul>
              </div>

              <div class="product-details-grid">
                <div class="pos-group">
                  <label>Quantity (Litres)</label>
                  <input type="number" id="quantity" min="1" oninput="updatePOSPrice()" required />
                </div>

                <div class="pos-group">
                  <label>Unit Price</label>
                  <input type="text" id="unit-price" readonly value="0" />
                </div>

                <div class="pos-group">
                  <label>Total Amount</label>
                  <input type="text" id="total" readonly />
                </div>

                <div class="pos-group">
                  <label>Change</label>
                  <input type="text" id="change" readonly />
                </div>
              </div>

              <div class="pos-actions">
                <button type="submit" class="pos-primary-btn">Add to Cart</button>
                <button type="button" id="proceed-payment-btn" class="pos-secondary-btn" onclick="showPaymentSection()">Proceed to Payment</button>
              </div>
            </form>

            <!-- Payment Section -->
            <div class="payment-section" id="payment-section" style="display: none;">
              <h3>Payment Details</h3>
              
              <div class="payment-methods">
                <button type="button" class="payment-method-btn" data-method="cash" onclick="selectPaymentMethod('cash')">Cash</button>
                <button type="button" class="payment-method-btn" data-method="mpesa" onclick="selectPaymentMethod('mpesa')">M-PESA</button>
                <button type="button" class="payment-method-btn" data-method="card" onclick="selectPaymentMethod('card')">Card</button>
              </div>

              <div class="payment-fields">
                <div class="payment-field cash-field" id="cash-field">
                  <div class="pos-group">
                    <label>Amount Received</label>
                    <input type="number" id="cash-paid" oninput="calculateChange()" placeholder="Enter amount received" />
                  </div>
                </div>

                <div class="payment-field mpesa-field" id="mpesa-field">
                  <div class="pos-group">
                    <label>Phone Number</label>
                    <input type="tel" id="mpesa-phone" placeholder="07XXXXXXXX" pattern="^07\d{8}$" title="Please enter a valid phone number (07XXXXXXXX)" />
                  </div>
                </div>

                <div class="payment-field card-field" id="card-field">
                  <div class="pos-group">
                    <label>Card Number</label>
                    <input type="text" id="card-number" placeholder="XXXX-XXXX-XXXX-XXXX" />
                  </div>
                </div>
              </div>

              <button type="button" class="complete-sale-btn" onclick="completeSale()">Complete Sale</button>
            </div>
          </div>

          <!-- Cart Area -->
          <div class="cart-area">
            <h3>Order Summary</h3>
            <div class="cart-items" id="cart-items">
              <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <p>Cart is empty</p>
                <p>Add products to get started</p>
              </div>
            </div>
            
            <div class="cart-total">
              <div class="cart-total-line">
                <span>Subtotal:</span>
                <span>Ksh <span id="cart-subtotal">0.00</span></span>
              </div>
              <div class="cart-total-line">
                <span>Tax (0%):</span>
                <span>Ksh 0.00</span>
              </div>
              <div class="cart-total-line">
                <span><strong>Total:</strong></span>
                <span><strong>Ksh <span id="cart-total">0.00</span></strong></span>
              </div>
            </div>
            
            <button type="button" class="complete-sale-btn" disabled onclick="completeSale()">Complete Sale</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('main-content').innerHTML = content;
  
  // Load products immediately after rendering POS section
  setTimeout(() => {
    loadProducts();
  }, 100);
} else if (section === 'my-sales') {
  content =`
    <div class="sales-overview-section">
      <div class="mysales-title">
        <img src="../assets/icons/icons8-coins-100.png" alt="Sales Icon" class="sales-icon" />
        <h2 class="section-title">My Sales</h2>
      </div>

      <div class="filters">
        <label>Date Range:
          <input type="date" id="start-date" onchange="filterSales()" />
          to
          <input type="date" id="end-date" onchange="filterSales()" />
        </label>
        <button type="button" onclick="filterSales()" style="margin-left: 10px; padding: 5px 15px; background: #00796b; color: white; border: none; border-radius: 4px; cursor: pointer;">Apply Filter</button>
        <button type="button" onclick="clearFilters()" style="margin-left: 5px; padding: 5px 15px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Clear</button>
      </div>

      <!-- Sales Summary -->
      <div id="sales-summary" class="summary-cards" style="margin-bottom: 20px;">
        <!-- Summary will be loaded dynamically -->
      </div>

      <!-- Sales Graph -->
      <div class="card">
        <h3>Sales Trend (Last 7 Days)</h3>
        <canvas id="sales-trend-chart" height="100"></canvas>
      </div>

      <!-- Sales Table -->
      <div class="sales-table table-container">
        <h3>Recent Sales</h3>
        <table>
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Products</th>
              <th>Items</th>
              <th>Total (Ksh)</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody id="sales-table-body">
            <tr>
              <td colspan="5" style="text-align: center; padding: 20px;">Loading sales data...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  document.getElementById('main-content').innerHTML = content;
  
  // Load sales data after rendering My Sales section
  setTimeout(() => {
    fetchMySales();
  }, 100);
} else if (section === 'support') {
  content = `
    <div class="support-section">
      <div class="support-title">
        <img src="../assets/icons/icons8-support-100(mod).png" alt="Support Icon" class="support-icon" />
        <h2 class="section-title">Support</h2>
      </div>

      <div class="support-layout">
        <!-- New Support Request Form -->
        <div class="card">
          <h3>Submit New Request</h3>
          <form id="support-form" onsubmit="handleSupportSubmit(event)">
            <div class="form-group">
              <label for="support-subject">Subject</label>
              <select id="support-subject" required>
                <option value="">Select subject</option>
                <option value="return">Product Return Request</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing Inquiry</option>
                <option value="feedback">General Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="support-message">Message</label>
              <textarea id="support-message" rows="5" placeholder="Explain your issue or request here..." required></textarea>
            </div>

            <div class="form-group">
              <label for="support-priority">Priority</label>
              <select id="support-priority">
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <button type="submit" class="submit-sale-btn">Send Request</button>
          </form>
        </div>

        <!-- Support Requests History -->
        <div class="card">
          <h3>My Support Requests</h3>
          <div id="support-requests-list">
            <div class="loading-text">Loading your support requests...</div>
          </div>
        </div>
      </div>
    </div>`;
  
  document.getElementById('main-content').innerHTML = content;
  
  // Load support requests history
  setTimeout(() => {
    loadMySupportRequests();
  }, 100);
}else if(section === 'settings'){
    content =`<div class="settings-section">
    <h2 class="section-title">Settings</h2>
    <div class="settings-cards">
      <div class="settings-card">
        <img src="../assets/icons/icons8-user-settings-100.png" alt="User Settings" />
        <h3>Account Settings</h3>
        <p>Manage username, email, and password</p>
        <button class="settings-btn" onclick="openSettingsModal('profile')">Open</button>
      </div>
      <div class="settings-card">
        <img src="../assets/icons/icons8-theme-100.png" alt="Appearance" />
        <h3>Appearance</h3>
        <p>Customize theme and layout preferences</p>
        <button class="settings-btn" onclick="openSettingsModal('appearance')">Open</button>
      </div>
      <div class="settings-card">
        <img src="../assets/icons/icons8-security-lock-100.png" alt="Security" />
        <h3>Security</h3>
        <p>Setup 2-Factor Authentication</p>
        <button class="settings-btn" onclick="openSettingsModal('security')">Open</button>
      </div>
    </div>
  </div>`;
}else {
    content = `<h2>${section.replace('-', ' ')} (Coming soon)</h2>`;
  }



  document.getElementById('main-content').innerHTML = content;
  // Re-render the sales chart if the section is 'my-sales'
  renderSalesChart();
  
  if (section === 'overview') {
    generateGreeting();
  }
  // Load products when POS section is loaded
document.addEventListener('DOMContentLoaded', function() {
    // This will be called when the page loads
    loadProducts();
});
}

//Theme switch functionality
// Apply saved preferences on page load
window.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme');
  const layout = localStorage.getItem('layout');

  if (theme) {
    document.body.classList.remove('theme-default', 'theme-dark', 'theme-light');
    document.body.classList.add(`theme-${theme}`);
  }

  if (layout) {
    document.body.classList.remove('layout-standard', 'layout-compact');
    document.body.classList.add(`layout-${layout}`);
  }
});
//Save theme preference
function applyAppearanceSettings() {
  const theme = document.getElementById('theme-select').value;
  const layout = document.getElementById('layout-select').value;

  // Save to localStorage
  localStorage.setItem('theme', theme);
  localStorage.setItem('layout', layout);

  // Apply theme
  document.body.classList.remove('theme-default', 'theme-dark', 'theme-light');
  document.body.classList.add(`theme-${theme}`);

  // Apply layout
  document.body.classList.remove('layout-standard', 'layout-compact');
  document.body.classList.add(`layout-${layout}`);

  alert("Appearance settings saved!");
}
//Load greeting message

function generateGreeting() {
  const greetingDiv = document.getElementById("greeting");
  if (!greetingDiv) return;

  const now = new Date();
  const hours = now.getHours();
  
  let timeOfDay = "Good evening";
  if (hours < 12) timeOfDay = "Good morning";
  else if (hours < 18) timeOfDay = "Good afternoon";

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString(undefined, options);
  const formattedTime = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  // Fetch user's username from the server
  fetch('../php/get_user_profile.php')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const username = data.username || "User";
        greetingDiv.innerHTML = `
          <img src="../assets/icons/waving-hand-emoji.png" alt="Waving Hand Emoji" style="height: 34px; vertical-align: middle; margin-right: 8px;" />
          ${timeOfDay} ${username}, it's ${formattedDate} at ${formattedTime}`;
      } else {
        // Fallback if fetch fails
        greetingDiv.innerHTML = `
          <img src="../assets/icons/waving-hand-emoji.png" alt="Waving Hand Emoji" style="height: 34px; vertical-align: middle; margin-right: 8px;" />
          ${timeOfDay}, it's ${formattedDate} at ${formattedTime}`;
      }
    })
    .catch(err => {
      console.error("Error fetching user profile:", err);
      // Fallback on error
      greetingDiv.innerHTML = `
        <img src="../assets/icons/waving-hand-emoji.png" alt="Waving Hand Emoji" style="height: 34px; vertical-align: middle; margin-right: 8px;" />
        ${timeOfDay}, it's ${formattedDate} at ${formattedTime}`;
    });
}


// Load overview by default when page loads
window.addEventListener('DOMContentLoaded', () => {
  const defaultNav = document.querySelector('.nav-option');
  loadSection('overview', defaultNav);

  // Periodically refresh the greeting every minute
  setInterval(() => {
    const greetingExists = document.getElementById('greeting');
    if (greetingExists) generateGreeting();
  }, 60000); // Refresh every 60,000 milliseconds = 1 minute
});

// Fetch overview stats
// Fetch overview stats
function loadOverviewStats() {
  fetch('../php/get_overview_stats.php')
    .then(res => res.json())
    .then(data => {
      console.log('Overview stats received:', data);
      
      // Update the cards with the correct IDs from your HTML
      const totalUsersEl = document.getElementById('total-users');
      const totalAdminsEl = document.getElementById('total-admins');
      const totalInventoryEl = document.getElementById('total-inventory');
      const newOrdersEl = document.getElementById('new-orders');
      
      if (totalUsersEl) totalUsersEl.textContent = data.total_users || 0;
      if (totalAdminsEl) totalAdminsEl.textContent = data.total_admins || 0;
      if (totalInventoryEl) totalInventoryEl.textContent = data.total_inventory || 0;
      if (newOrdersEl) newOrdersEl.textContent = data.new_orders || 0;
    })
    .catch(err => console.error("Error loading stats:", err));
}

// Fetch recent activity
function loadRecentActivity() {
  fetch('../php/get_recent_activity.php')
    .then(res => res.json())
    .then(data => {
      const activityLog = document.getElementById('activity-log');
      if (!activityLog) return;
      
      activityLog.innerHTML = ''; // Clear loading text
      
      // Handle different response formats
      let activities = [];
      
      if (Array.isArray(data)) {
        // If data is directly an array
        activities = data;
      } else if (data && data.activities && Array.isArray(data.activities)) {
        // If data has an activities property that's an array
        activities = data.activities;
      } else if (data && data.data && Array.isArray(data.data)) {
        // If data has a data property that's an array
        activities = data.data;
      } else if (data && data.status === 'success' && Array.isArray(data.data)) {
        // If data has status and data properties
        activities = data.data;
      }
      
      console.log('Activities data:', activities); // Debug log
      
      if (activities.length === 0) {
        activityLog.innerHTML = '<li>No recent activity found</li>';
      } else {
        activities.forEach(item => {
          const li = document.createElement('li');
          // Handle different property names in the activity items
          const description = item.description || item.message || item.activity || 'Unknown activity';
          const type = item.type || item.activity_type || 'system';
          li.textContent = `${description} (${type})`;
          activityLog.appendChild(li);
        });
      }
    })
    .catch(err => {
      console.error("Error loading activity:", err);
      const activityLog = document.getElementById('activity-log');
      if (activityLog) {
        activityLog.innerHTML = '<li>Error loading recent activity</li>';
      }
    });
}
// Fetch recent activity
fetch('../php/get_recent_activity.php')
  .then(res => res.json())
  .then(data => {
    const activityLog = document.getElementById('activity-log');
    activityLog.innerHTML = ''; // Clear loading text
    if (data.length === 0) {
      activityLog.innerHTML = '<li>No recent activity</li>';
    } else {
      data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.description} (${item.type})`;
        activityLog.appendChild(li);
      });
    }
  })
  .catch(err => console.error("Error loading activity:", err));

//Make Sale Section

// Point of Sale (POS) functionality
let cart = [];
let selectedProduct = null;
let products = []; // Make sure this is accessible globally

// Fetch real products from database
// Fetch real products from database
function loadProducts() {
    console.log('Loading products from: ../php/get_products.php');
    
    fetch('../php/get_products.php')
        .then(res => {
            console.log('Response status:', res.status);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log('Products API response:', data);
            if (data.status === 'success') {
                window.products = data.products;
                console.log('Products loaded successfully:', window.products);
                
                // Initialize with fallback products if empty
                if (!window.products || window.products.length === 0) {
                    console.warn('No products returned from server, using fallback');
                    window.products = getFallbackProducts();
                }
            } else {
                console.error('Failed to load products:', data.message);
                window.products = getFallbackProducts();
            }
        })
        .catch(err => {
            console.error('Error loading products:', err);
            window.products = getFallbackProducts();
        });
}

// Fallback products in case API fails
function getFallbackProducts() {
    return [
        { id: 1, name: "Petrol", price: 145, stock: 1000 },
        { id: 2, name: "Diesel", price: 130, stock: 800 },
        { id: 3, name: "Lubricant", price: 350, stock: 50 },
        { id: 4, name: "Brake Fluid", price: 180, stock: 30 },
        { id: 5, name: "Engine Oil", price: 1600, stock: 20 }
    ];
}
function filterProducts() {
    const input = document.getElementById('product-search');
    const list = document.getElementById('product-list');
    
    if (!input || !list) {
        console.error('Search elements not found');
        return;
    }
    
    const query = input.value.toLowerCase();
    console.log('Searching for:', query, 'Products available:', window.products);
    
    // Clear previous results
    list.innerHTML = "";
    list.style.display = 'none';

    if (!query || !window.products || window.products.length === 0) {
        console.log('No query or products available');
        return;
    }

    const matches = window.products.filter(p => 
        p.name.toLowerCase().includes(query) && p.stock > 0
    );
    
    console.log('Found matches:', matches);
    
    if (matches.length === 0) {
        const li = document.createElement('li');
        li.textContent = "No products found";
        li.style.color = '#666';
        li.style.cursor = 'default';
        li.style.padding = '10px';
        list.appendChild(li);
        list.style.display = 'block';
    } else {
        matches.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div style="padding: 10px; cursor: pointer;">
                    <strong>${product.name}</strong>
                    <div style="font-size: 12px; color: #666;">
                        Ksh ${product.price} | Stock: ${product.stock}L
                    </div>
                </div>
            `;
            li.onclick = () => {
                console.log('Product selected:', product);
                selectProduct(product);
            };
            li.style.borderBottom = '1px solid #eee';
            list.appendChild(li);
        });
        list.style.display = 'block';
    }
}


function selectProduct(product) {
    console.log('Selecting product:', product);
    
    const searchInput = document.getElementById('product-search');
    const list = document.getElementById('product-list');
    
    if (searchInput) searchInput.value = product.name;
    if (list) {
        list.innerHTML = '';
        list.style.display = 'none';
    }
    
    selectedProduct = product;
    console.log('Selected product set to:', selectedProduct);
    
    // Update unit price field immediately
    const unitPriceField = document.getElementById('unit-price');
    if (unitPriceField) {
        unitPriceField.value = product.price;
        console.log('Unit price updated to:', product.price);
    }
    
    // Reset quantity and focus
    const quantityField = document.getElementById('quantity');
    if (quantityField) {
        quantityField.value = '';
        quantityField.focus();
    }
    
    // Update prices
    updatePOSPrice();
}

function updatePOSPrice() {
    console.log('Updating POS price...');
    
    const quantityInput = document.getElementById('quantity');
    const unitPriceField = document.getElementById('unit-price');
    const totalField = document.getElementById('total');
    
    if (!quantityInput || !totalField) {
        console.error('Required fields not found');
        return;
    }
    
    const quantity = parseFloat(quantityInput.value) || 0;
    console.log('Quantity:', quantity, 'Selected Product:', selectedProduct);

    if (selectedProduct && quantity > 0) {
        console.log('Calculating price for:', selectedProduct.name);
        
        // Check stock availability
        if (quantity > selectedProduct.stock) {
            alert(`Only ${selectedProduct.stock}L available in stock`);
            quantityInput.value = selectedProduct.stock;
            // Recursively call with corrected quantity
            updatePOSPrice();
            return;
        }
        
        const total = selectedProduct.price * quantity;
        totalField.value = total.toFixed(2);
        console.log('Total calculated:', total);
        
        // Update unit price display
        if (unitPriceField) {
            unitPriceField.value = selectedProduct.price;
        }
    } else {
        totalField.value = '0.00';
        if (unitPriceField && selectedProduct) {
            unitPriceField.value = selectedProduct.price;
        } else if (unitPriceField) {
            unitPriceField.value = '0';
        }
        console.log('No product selected or quantity is 0');
    }
    
    // Always calculate change based on cart total
    calculateChange();
}

function calculateChange() {
    const cashInput = document.getElementById('cash-paid');
    const totalInput = document.getElementById('total');
    const cartTotal = getCartTotal(); // Get the actual cart total
    const changeField = document.getElementById('change');

    if (!cashInput || !changeField) return;

    const paid = parseFloat(cashInput.value || 0);
    
    // Use cart total instead of individual product total
    const total = cartTotal;

    console.log('Change calculation - Paid:', paid, 'Total:', total, 'Cart Total:', cartTotal);

    const change = paid - total;

    if (isNaN(change)) {
        changeField.value = '';
    } else if (change < 0) {
        changeField.value = 'Insufficient: Ksh ' + Math.abs(change).toFixed(2);
        changeField.style.color = '#dc3545';
    } else {
        changeField.value = 'Ksh ' + change.toFixed(2);
        changeField.style.color = '#28a745';
    }
}

function selectPaymentMethod(method) {
    // Remove active class from all buttons
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    const activeBtn = document.querySelector(`.payment-method-btn[data-method="${method}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Show corresponding payment field
    document.querySelectorAll('.payment-field').forEach(field => {
        field.classList.remove('active');
    });
    
    const activeField = document.querySelector(`.${method}-field`);
    if (activeField) {
        activeField.classList.add('active');
    }
    
    // Reset cash payment fields if switching from cash
    if (method !== 'cash') {
        const cashPaid = document.getElementById('cash-paid');
        const changeField = document.getElementById('change');
        if (cashPaid) cashPaid.value = '';
        if (changeField) {
            changeField.value = '';
            changeField.style.color = '';
        }
    }
}

function showPaymentSection() {
    if (cart.length === 0) {
        alert("Add items to the cart first.");
        return;
    }
    
    const proceedBtn = document.getElementById('proceed-payment-btn');
    const paymentSection = document.getElementById('payment-section');
    
    if (proceedBtn) proceedBtn.style.display = 'none';
    if (paymentSection) paymentSection.style.display = 'block';
}

function handleAddToCart(e) {
    e.preventDefault();

    const productName = document.getElementById('product-search').value;
    const quantityInput = document.getElementById('quantity');
    const quantity = parseFloat(quantityInput.value);

    // Debug logging
    console.log('Selected Product:', selectedProduct);
    console.log('Quantity:', quantity);
    console.log('Product Name:', productName);

    if (!selectedProduct) {
        alert("Please select a valid product from the list.");
        return;
    }

    if (!quantity || quantity <= 0 || isNaN(quantity)) {
        alert("Please enter a valid quantity.");
        return;
    }

    // Check stock availability
    if (quantity > selectedProduct.stock) {
        alert(`Only ${selectedProduct.stock}L available in stock`);
        quantityInput.value = selectedProduct.stock;
        updatePOSPrice();
        return;
    }

    const total = selectedProduct.price * quantity;
    const cartItem = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: quantity,
        price: selectedProduct.price,
        total: total
    };

    cart.push(cartItem);
    
    // Update product stock locally
    selectedProduct.stock -= quantity;

    renderCart();
    
    // Reset form but keep product selected for quick additions
    quantityInput.value = '';
    updatePOSPrice();
    
    // Show success message
    console.log('Item added to cart:', cartItem);
}

function renderCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const completeSaleBtn = document.querySelector('.complete-sale-btn');
    let subtotal = 0;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <p>Cart is empty</p>
                <p>Add products to get started</p>
            </div>
        `;
        if (completeSaleBtn) completeSaleBtn.disabled = true;
        return;
    }

    cartItemsDiv.innerHTML = '';
    cart.forEach((item, index) => {
        subtotal += item.total;
        
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.productName}</div>
                <div class="cart-item-details">${item.quantity}L × Ksh ${item.price}/L</div>
            </div>
            <div class="cart-item-actions">
                <span class="cart-item-price">Ksh ${item.total.toFixed(2)}</span>
                <button class="remove-item-btn" onclick="removeFromCart(${index})" title="Remove item">×</button>
            </div>
        `;
        cartItemsDiv.appendChild(cartItemDiv);
    });

    // Update totals
    document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('cart-total').textContent = subtotal.toFixed(2);
    
    // Enable complete sale button
    if (completeSaleBtn) completeSaleBtn.disabled = false;
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        const removedItem = cart[index];
        
        // Restore stock locally
        const product = window.products.find(p => p.id === removedItem.productId);
        if (product) {
            product.stock += removedItem.quantity;
        }
        
        cart.splice(index, 1);
        renderCart();
        
        // Update product search if the removed product was selected
        if (selectedProduct && selectedProduct.id === removedItem.productId) {
            const productSearch = document.getElementById('product-search');
            if (productSearch) productSearch.value = selectedProduct.name;
        }
    }
}

function completeSale() {
    if (cart.length === 0) {
        alert("Cart is empty. Add items to complete sale.");
        return;
    }
    
    const paymentMethod = document.querySelector('.payment-method-btn.active')?.dataset.method;
    if (!paymentMethod) {
        alert("Please select a payment method.");
        return;
    }
    
    // Validate payment details
    if (paymentMethod === 'mpesa') {
        let mpesaPhone = document.getElementById('mpesa-phone').value;
        
        // Convert 07XXXXXXXX to 254XXXXXXXXX format
        if (mpesaPhone.startsWith('07') && mpesaPhone.length === 10) {
            mpesaPhone = '254' + mpesaPhone.substring(1);
        }
        
        // Validate the converted format
        if (!mpesaPhone || !/^254\d{9}$/.test(mpesaPhone)) {
            alert("Please enter a valid M-PESA phone number (07XXXXXXXX).");
            return;
        }
        
        // Update the sale data with converted phone
        saleData = {
            items: cart,
            payment_method: paymentMethod,
            total_amount: getCartTotal(),
            cash_received: paymentMethod === 'cash' ? parseFloat(document.getElementById('cash-paid').value) : 0,
            mpesa_phone: mpesaPhone, // Use the converted 254 format
            card_number: paymentMethod === 'card' ? document.getElementById('card-number').value : ''
        };
    } else {
        // For non-M-Pesa payments
        saleData = {
            items: cart,
            payment_method: paymentMethod,
            total_amount: getCartTotal(),
            cash_received: paymentMethod === 'cash' ? parseFloat(document.getElementById('cash-paid').value) : 0,
            mpesa_phone: '',
            card_number: paymentMethod === 'card' ? document.getElementById('card-number').value : ''
        };
    }

    submitSaleToServer(saleData);
}

function getCartTotal() {
    return cart.reduce((total, item) => total + item.total, 0);
}

function submitSaleToServer(saleData) {
    console.log('Submitting sale data:', saleData);
    
    const completeBtn = document.querySelector('.complete-sale-btn');
    const originalText = completeBtn.textContent;
    completeBtn.textContent = 'Processing...';
    completeBtn.disabled = true;
    
    
    fetch('../php/make_sale.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData)
    })
    .then(res => {
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);
        return res.text(); // Get raw text first
    })
    .then(text => {
        console.log('Raw response:', text);
        
        // Try to parse as JSON
        try {
            const data = JSON.parse(text);
            console.log('Parsed response:', data);
            
            if (data.success) {
                if (data.mpesa_initiated) {
                    showMpesaInstructions(data.message);
                } else {
                    alert("Sale completed successfully!");
                    clearCart();
                    resetPOS();
                    loadProducts();
                }
            } else {
                alert("Error: " + data.message);
            }
        } catch (e) {
            console.error('JSON parse error:', e);
            console.error('Raw response that failed:', text);
            
            // Try to extract JSON from the response
            const jsonMatch = text.match(/\{.*\}/s);
            if (jsonMatch) {
                try {
                    const data = JSON.parse(jsonMatch[0]);
                    console.log('Extracted JSON:', data);
                    
                    if (data.success) {
                        if (data.mpesa_initiated) {
                            showMpesaInstructions(data.message);
                        } else {
                            alert("Sale completed successfully!");
                            clearCart();
                            resetPOS();
                            loadProducts();
                        }
                    } else {
                        alert("Error: " + data.message);
                    }
                } catch (e2) {
                    alert("Server returned an invalid response. Check console for details.");
                }
            } else {
                alert("Server returned an invalid response. Check console for details.");
            }
        }
    })
    .catch(err => {
        console.error("Sale error:", err);
        alert("Network error: " + err.message);
    })
    .finally(() => {
        completeBtn.textContent = originalText;
        completeBtn.disabled = false;
    });
}

function showMpesaInstructions(message) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; max-width: 400px; text-align: center;">
            <h3>M-Pesa Payment</h3>
            <p>${message}</p>
            <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                <p><strong>Instructions:</strong></p>
                <p>1. Check your phone for M-Pesa prompt</p>
                <p>2. Enter your M-Pesa PIN</p>
                <p>3. Wait for confirmation</p>
            </div>
            <button onclick="this.closest('div').parentElement.remove(); clearCart(); resetPOS(); loadProducts();" 
                    style="padding: 10px 20px; background: #00796b; color: white; border: none; border-radius: 5px; cursor: pointer;">
                OK
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function clearCart() {
    cart = [];
    renderCart();
}

function resetPOS() {
    // Reset all form fields
    document.getElementById('product-search').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('unit-price').value = '0';
    document.getElementById('total').value = '0.00';
    document.getElementById('change').value = '';
    document.getElementById('change').style.color = '';
    document.getElementById('cash-paid').value = '';
    document.getElementById('mpesa-phone').value = '';
    document.getElementById('card-number').value = '';
    
    // Reset payment section
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.payment-field').forEach(field => {
        field.classList.remove('active');
    });
    
    // Show proceed button again
    const proceedBtn = document.getElementById('proceed-payment-btn');
    const paymentSection = document.getElementById('payment-section');
    if (proceedBtn) proceedBtn.style.display = 'block';
    if (paymentSection) paymentSection.style.display = 'none';
    
    selectedProduct = null;
    document.getElementById('product-list').innerHTML = '';
}

//My Sales Section
// My Sales Section - Updated Functions
function fetchMySales() {
    const startDate = document.getElementById('start-date')?.value;
    const endDate = document.getElementById('end-date')?.value;
    
    console.log('Fetching sales with filters:', { startDate, endDate });

    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    fetch(`../php/get_my_sales.php?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
            console.log('Sales data received:', data);
            if (data.success) {
                updateSalesTable(data.sales);
                // Load analytics after loading sales
                loadSalesAnalytics();
            } else {
                console.error('Failed to load sales:', data.message);
                updateSalesTable([]);
            }
        })
        .catch(err => {
            console.error("Error fetching sales:", err);
            updateSalesTable([]);
        });
}

function updateSalesTable(sales) {
    const tbody = document.getElementById("sales-table-body");
    if (!tbody) {
        console.error('Sales table body not found');
        return;
    }
    
    tbody.innerHTML = '';

    if (!sales || sales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No sales found for the selected period</td></tr>';
        return;
    }

    sales.forEach(sale => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>#S${sale.sale_id.toString().padStart(3, '0')}</td>
            <td>${sale.products}</td>
            <td>${sale.quantity}</td>
            <td>${sale.total}</td>
            <td>${sale.sale_date}</td>
        `;
        tbody.appendChild(row);
    });
}

function loadSalesAnalytics() {
    fetch('../php/get_sales_analytics.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                updateSalesChart(data.chart_data);
                updateSalesSummary(data.summary);
            } else {
                console.error('Failed to load analytics:', data.message);
            }
        })
        .catch(err => {
            console.error("Error fetching analytics:", err);
        });
}

function updateSalesSummary(summary) {
    // You can add summary cards to your My Sales section if needed
    console.log('Sales Summary:', summary);
    
    // Example: Update summary elements if they exist
    const summaryElement = document.getElementById('sales-summary');
    if (summaryElement) {
        summaryElement.innerHTML = `
            <div class="summary-cards">
                <div class="card">
                    <h3>Total Sales</h3>
                    <p class="value">${summary.total_sales}</p>
                </div>
                <div class="card">
                    <h3>Total Revenue</h3>
                    <p class="value">Ksh ${summary.total_revenue}</p>
                </div>
                <div class="card">
                    <h3>Average Sale</h3>
                    <p class="value">Ksh ${summary.average_sale}</p>
                </div>
                <div class="card">
                    <h3>Largest Sale</h3>
                    <p class="value">Ksh ${summary.largest_sale}</p>
                </div>
            </div>
        `;
    }
}

// Updated renderSalesChart function
function renderSalesChart() {
    const canvas = document.getElementById("sales-trend-chart");
    if (!canvas) {
        console.warn("Chart canvas not found!");
        return;
    }

    // Destroy existing chart if it exists
    if (window.salesChart) {
        window.salesChart.destroy();
    }

    const ctx = canvas.getContext("2d");

    // Load real data
    loadSalesAnalytics();
}

function updateSalesChart(chartData) {
    const canvas = document.getElementById("sales-trend-chart");
    if (!canvas) return;

    // Destroy existing chart if it exists
    if (window.salesChart) {
        window.salesChart.destroy();
    }

    const ctx = canvas.getContext("2d");

    // Check if we have valid data
    const hasValidData = chartData && 
                        chartData.dates && 
                        chartData.dates.length > 0 && 
                        chartData.totals && 
                        chartData.totals.length > 0;

    const dates = hasValidData ? chartData.dates : ["No Data", "Available"];
    const totals = hasValidData ? chartData.totals : [0, 0];

    console.log('Chart data:', { hasValidData, dates, totals, chartData });

    const trendColor = hasValidData ? getTrendColor(totals) : '#6c757d';

    window.salesChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                label: hasValidData ? "Daily Sales (Ksh)" : "No Sales Data Available",
                data: totals,
                fill: true,
                backgroundColor: trendColor + '20',
                borderColor: trendColor,
                tension: 0.4,
                pointBackgroundColor: trendColor,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `Sales: Ksh ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (Ksh)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}

// Updated filterSales function
function filterSales() {
    const start = document.getElementById("start-date").value;
    const end = document.getElementById("end-date").value;
    
    console.log(`Filtering sales from ${start} to ${end}`);
    fetchMySales();
}

function clearFilters() {
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    fetchMySales();
}
function getTrendColor(values) {
    if (!values || values.length === 0) return '#6c757d'; // Default gray for no data
    
    const slope = values[values.length - 1] - values[0];
    if (slope > 0) return "#22c55e";       // green for increasing trend
    if (slope < 0) return "#ef4444";       // red for decreasing trend
    return "#f59e0b";                      // amber for stable trend
}
// --- Support section ---
// Enhanced support request handler
function handleSupportSubmit(event) {
  event.preventDefault();

  const subject = document.getElementById('support-subject').value;
  const message = document.getElementById('support-message').value;
  const priority = document.getElementById('support-priority').value;

  // Basic validation
  if (!subject || !message) {
    alert('Please fill in all required fields');
    return;
  }

  const formData = new FormData();
  formData.append('subject', subject);
  formData.append('message', message);
  formData.append('priority', priority);

  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');

  fetch('../php/submit_support.php', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(response => {
    alert(response.message);
    if (response.status === 'success') {
      document.getElementById('support-form').reset();
      loadMySupportRequests();
    }
  })
  .catch(err => {
    console.error('Support request failed:', err);
    alert("Something went wrong. Please try again.");
  })
  .finally(() => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  });
}

// Load user's support requests
function handleSupportSubmit(event) {
  event.preventDefault();

  const subject = document.getElementById('support-subject').value;
  const message = document.getElementById('support-message').value;
  const priority = document.getElementById('support-priority').value;

  const formData = new FormData();
  formData.append('subject', subject);
  formData.append('message', message);
  formData.append('priority', priority);

  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  fetch('../php/submit_support.php', {
    method: 'POST',
    body: formData
  })
  .then(res => {
    console.log('Response status:', res.status);
    console.log('Response headers:', res.headers);
    return res.text(); // Use text() first to see raw response
  })
  .then(text => {
    console.log('Raw response:', text);
    
    try {
      // Try to parse as JSON
      const response = JSON.parse(text);
      alert(response.message);
      if (response.status === 'success') {
        document.getElementById('support-form').reset();
        loadMySupportRequests();
      }
    } catch (e) {
      console.error('JSON parse error:', e);
      console.error('Raw response that failed to parse:', text);
      alert('Server returned an invalid response. Check console for details.');
    }
  })
  .catch(err => {
    console.error('Support request failed:', err);
    alert("Network error. Please try again.");
  })
  .finally(() => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  });
}

// Load user's support requests with better error handling
function loadMySupportRequests() {
  const requestsList = document.getElementById('support-requests-list');
  if (!requestsList) return;

  // Show loading state
  requestsList.innerHTML = '<div class="loading-text">Loading your support requests...</div>';

  fetch('../php/get_my_support_requests.php')
    .then(res => {
      console.log('Support requests response status:', res.status);
      return res.text();
    })
    .then(text => {
      console.log('Raw support requests response:', text);
      
      try {
        const data = JSON.parse(text);
        
        if (data.success) {
          renderSupportRequests(data.requests);
        } else {
          requestsList.innerHTML = `<div class="error-text">Failed to load support requests: ${data.message}</div>`;
        }
      } catch (e) {
        console.error('JSON parse error for support requests:', e);
        console.error('Raw response that failed to parse:', text);
        requestsList.innerHTML = `
          <div class="error-text">
            <p>Server returned an invalid response.</p>
            <p>Please check the browser console for details.</p>
          </div>
        `;
      }
    })
    .catch(err => {
      console.error('Network error loading support requests:', err);
      requestsList.innerHTML = `<div class="error-text">Network error loading support requests</div>`;
    });
}

// Render support requests
function renderSupportRequests(requests) {
  const container = document.getElementById('support-requests-list');
  
  if (!requests || requests.length === 0) {
    container.innerHTML = `
      <div class="no-requests">
        <p>No support requests found.</p>
        <p>Submit a request above to get help.</p>
      </div>
    `;
    return;
  }

  let html = `
    <div class="requests-table">
      <div class="request-header">
        <span>Subject</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Date</span>
      </div>
  `;

  requests.forEach(request => {
    // Update status classes to match your ENUM values
    const statusClass = request.status === 'resolved' ? 'status-resolved' : 
                       request.status === 'in_progress' ? 'status-in-progress' : 'status-pending';
    
    const priorityClass = request.priority === 'urgent' ? 'priority-urgent' : 'priority-normal';

    html += `
      <div class="request-item" onclick="toggleRequestDetails(${request.id})">
        <div class="request-summary">
          <span class="request-subject">${request.subject}</span>
          <span class="status-badge ${statusClass}">${request.status}</span>
          <span class="priority-badge ${priorityClass}">${request.priority}</span>
          <span class="request-date">${request.created_at}</span>
        </div>
        <div class="request-details" id="request-details-${request.id}" style="display: none;">
          <div class="request-message">
            <strong>Your Message:</strong>
            <p>${request.message}</p>
          </div>
          ${request.admin_notes ? `
            <div class="admin-notes">
              <strong>Admin Response:</strong>
              <p>${request.admin_notes}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

// Add these 2FA functions to your user.js (same as admin functions)

// 2FA Management Functions
function setup2FA() {
    console.log('Starting 2FA setup...');
    
    fetch('../php/enable_2fa.php')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                show2FASetupModal(data.qrCodeUrl, data.secret, data.backupCodes);
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(err => {
            console.error('Error setting up 2FA:', err);
            alert('Error setting up 2FA');
        });
}

function show2FASetupModal(qrCodeUrl, secret, backupCodes) {
    const modal = document.getElementById('settings-modal');
    const modalContent = document.getElementById('settings-modal-content');

    const content = `
        <h2>Enable Two-Factor Authentication</h2>
        <div class="twofa-setup-content">
            <p><strong>Step 1:</strong> Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):</p>
            <div class="qrcode-container">
                <img src="${qrCodeUrl}" alt="QR Code for 2FA" class="qrcode-image">
            </div>
            
            <p><strong>Step 2:</strong> Or enter this secret manually:</p>
            <div class="secret-code">
                <code>${secret}</code>
                <button onclick="copyToClipboard('${secret}')" class="copy-btn">Copy</button>
            </div>
            
            <p><strong>Step 3:</strong> Save these backup codes in a secure location:</p>
            <div class="backup-codes">
                ${backupCodes.map(code => `<div class="backup-code-item"><code>${code}</code></div>`).join('')}
            </div>
            
            <p><strong>Step 4:</strong> Enter the 6-digit code from your authenticator app to verify:</p>
            <div class="verification-section">
                <input type="text" id="verification-code" maxlength="6" placeholder="000000" class="verification-input">
                <button onclick="verify2FASetup()" class="verify-btn">Verify and Enable</button>
            </div>
            
            <div class="modal-actions">
                <button onclick="closeSettingsModal()" class="cancel-btn">Cancel</button>
            </div>
        </div>
    `;

    modalContent.innerHTML = content;
    modal.style.display = 'flex';
}

function verify2FASetup() {
    const codeInput = document.getElementById('verification-code');
    const code = codeInput.value.trim();
    
    console.log('Verifying code:', code);
    
    if (code.length !== 6) {
        alert('Please enter a valid 6-digit code');
        codeInput.focus();
        return;
    }
    
    // Show loading state
    const verifyBtn = document.querySelector('.verify-btn');
    const originalText = verifyBtn.textContent;
    verifyBtn.textContent = 'Verifying...';
    verifyBtn.disabled = true;
    
    fetch('../php/verify_2fa_setup.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            code: code 
        })
    })
    .then(res => {
        console.log('Response status:', res.status);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        console.log('Verification response:', data);
        
        if (data.status === 'success') {
            alert('2FA enabled successfully!');
            closeSettingsModal();
            update2FAStatus(true);
        } else {
            alert('Error: ' + data.message);
            // Clear the input for retry
            codeInput.value = '';
            codeInput.focus();
        }
    })
    .catch(err => {
        console.error('Error verifying 2FA:', err);
        alert('Error verifying 2FA. Please check the console for details.');
    })
    .finally(() => {
        // Restore button state
        verifyBtn.textContent = originalText;
        verifyBtn.disabled = false;
    });
}

function disable2FA() {
    const code = prompt('Enter your 2FA code or a backup code to disable 2FA:');
    
    if (!code) return;
    
    fetch('../php/disable_2fa.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            alert('2FA disabled successfully!');
            update2FAStatus(false);
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(err => {
        console.error('Error disabling 2FA:', err);
        alert('Error disabling 2FA');
    });
}

function update2FAStatus(isEnabled) {
    const statusElement = document.getElementById('2fa-status');
    const enableBtn = document.getElementById('enable-2fa-btn');
    const disableBtn = document.getElementById('disable-2fa-btn');
    
    if (statusElement) {
        statusElement.textContent = isEnabled ? 'Enabled' : 'Disabled';
        statusElement.className = isEnabled ? 'status-enabled' : 'status-disabled';
    }
    if (enableBtn) enableBtn.style.display = isEnabled ? 'none' : 'block';
    if (disableBtn) disableBtn.style.display = isEnabled ? 'block' : 'none';
}

function load2FAStatus() {
    fetch('../php/get_2fa_status.php')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                update2FAStatus(data.twoFactorEnabled);
            }
        })
        .catch(err => {
            console.error('Error loading 2FA status:', err);
        });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Secret copied to clipboard!');
    });
}

// Toggle request details
function toggleRequestDetails(requestId) {
  const details = document.getElementById(`request-details-${requestId}`);
  if (details) {
    details.style.display = details.style.display === 'none' ? 'block' : 'none';
  }
}

// Load user profile data and prefill the form
function loadUserProfile() {
  fetch('../php/get_user_profile.php')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Prefill the form with user data
        document.getElementById('profile-username').value = data.username || '';
        document.getElementById('profile-email').value = data.email || '';
      } else {
        showProfileMessage('Error loading profile data', 'error');
      }
    })
    .catch(err => {
      console.error('Error loading profile:', err);
      showProfileMessage('Error loading profile data', 'error');
    });
}

// Update user profile
function updateProfile(event) {
  event.preventDefault();
  
  const username = document.getElementById('profile-username').value;
  const email = document.getElementById('profile-email').value;
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  // Validate passwords if changing
  if (newPassword && newPassword !== confirmPassword) {
    showProfileMessage('New passwords do not match', 'error');
    return;
  }
  
  if (newPassword && newPassword.length < 6) {
    showProfileMessage('New password must be at least 6 characters', 'error');
    return;
  }
  
  // Show loading state
  const saveBtn = event.target.querySelector('.save-btn');
  const originalText = saveBtn.textContent;
  saveBtn.textContent = 'Saving...';
  saveBtn.disabled = true;
  
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('current_password', currentPassword);
  if (newPassword) {
    formData.append('new_password', newPassword);
  }
  
  fetch('../php/update_profile.php', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      showProfileMessage('Profile updated successfully!', 'success');
      // Clear password fields
      document.getElementById('current-password').value = '';
      document.getElementById('new-password').value = '';
      document.getElementById('confirm-password').value = '';
      
      // Update greeting if username changed
      generateGreeting();
    } else {
      showProfileMessage('Error: ' + data.message, 'error');
    }
  })
  .catch(err => {
    console.error('Error updating profile:', err);
    showProfileMessage('Network error updating profile', 'error');
  })
  .finally(() => {
    saveBtn.textContent = originalText;
    saveBtn.disabled = false;
  });
}

// Show profile update messages
function showProfileMessage(message, type) {
  const messageDiv = document.getElementById('profile-message');
  messageDiv.textContent = message;
  messageDiv.className = type === 'success' ? 'message success' : 'message error';
  messageDiv.style.display = 'block';
  
  // Auto-hide success messages after 3 seconds
  if (type === 'success') {
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 3000);
  }
}