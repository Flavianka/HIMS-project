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
            <img src="../assets/icons/icons8-users-96.png" alt="Total Users Icon" />
            <p class="value">Loading...</p>
          </div>

          <div class="card">
            <h3>Total Revenue</h3>
            <img src="../assets/icons/icons8-coins-100 (1).png" alt="Total Revenue Icon" />
            <p class="value">Loading...</p>
          </div>

          <div class="card">
            <h3>Total Products</h3>
            <img src="../assets/icons/icons8-boxes1-64.png" alt="Total Products Icon" />
            <p class="value">Loading...</p>
          </div>

          <div class="card">
            <h3>Total Sales</h3>
            <img src="../assets/icons/icons8-sales-96.png" alt="Total Sales Icon" />
            <p class="value">Loading...</p>
          </div>
        </div>

        <div class="summary-cards info-cards">
          <div class="card low-stock-card">
            <h3>Low Stock Alerts</h3>
            <p class="alert-count">Loading...</p>
          </div>

          <div class="card top-products-card">
            <h3>Top Selling Products</h3>
            <div class="top-products-list" id="topProductsList">
              <p>Loading top products...</p>
            </div>
          </div>

          <div class="card sales-chart">
            <h3>Sales Performance</h3>
            <div class="chart-placeholder">
              <canvas id="salesChartMini" width="200" height="100"></canvas>
            </div>
          </div>
        </div>

        <div class="recent-activity">
          <h2>Recent Activity</h2>
          <div class="activity-header">
            <span>Activity</span>
            <span>Time</span>
          </div>
          <ul class="activity-log">
            <li>Loading activities...</li>
          </ul>
        </div>
      </div>`;
    
    document.getElementById('main-content').innerHTML = content;
    loadDashboardStats(); // Load real data
    }else if(section === 'settings'){
      content =`<div class="settings-section">
      <h2 class="section-title">Settings</h2>
      <div class="settings-cards">
        <div class="settings-card">
          <img src="../assets/icons/icons8-user-settings-100.png" alt="User Settings" />
          <h3>Account Settings</h3>
          <p>Manage username, email, phone number, and password</p>
          <button class="settings-btn" onclick="openSettingsModal('profile')">Open</button>
        </div>
        <div class="settings-card">
          <img src="../assets/icons/icons8-theme-100.png" alt="Appearance" />
          <h3>Appearance</h3>
          <p>Customize theme and layout preferences</p><br>
          <button class="settings-btn" onclick="openSettingsModal('appearance')">Open</button>
        </div>
        <div class="settings-card">
          <img src="../assets/icons/icons8-security-lock-100.png" alt="Security" />
          <h3>Security</h3>
          <p>Set 2FA, view login history and activity</p><br>
          <button class="settings-btn" onclick="openSettingsModal('security')">Open</button>
        </div>
      </div>
    </div>`;
  }else if (section === 'manage-inventory') {
    content = `
    <div class="container">
      <div class="inventory-header">
        <div class="inventory-title">
          <img src="../assets/icons/icons8-inventory-100.png" alt="Inventory Icon" class="inventory-icon" />
          <h2>Inventory Management</h2>
        </div>
        <div class="inventory-controls">
          <div class="search-wrapper">
            <input type="text" id="inventorySearch" placeholder="Search inventory..." />
            <button type="button" class="search-btn" onclick="loadInventoryTable()">
              <img src="../assets/icons/icons8-search-100.png" alt="Search Icon">
            </button>
          </div> 
          <select id="categoryFilter" onchange="loadInventoryTable()">
            <option value="">All Categories</option>
            <option value="fuel">Fuel</option>
            <option value="oil">Lubricants</option>
            <option value="tools">Tools</option>
          </select>
          <button onclick="openAddItemModal()" class="add-btn">+ Add Item</button>
        </div>
      </div>

      <div class="table-container">
        <table id="inventoryTable">
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Image</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="inventoryTableBody">
            <tr>
              <td colspan="8" style="text-align: center;">Loading inventory...</td>
            </tr>
          </tbody>
        </table>

        <div class="table-footer" id="inventoryFooter">
          <div class="entry-info" id="entryInfo">Loading...</div>
            <div class="pagination-controls" id="paginationControls">
              <button class="pagination-btn" onclick="changePage(1)">«</button>
              <button class="pagination-btn">1</button>
              <button class="pagination-btn">»</button>
            </div>
            <div class="entries-per-page">
              Show 
              <input type="number" id="perPage" min="1" value="10" class="entry-count" onchange="loadInventoryTable()" />
              entries
            </div>
          </div>
        </div>
      </div>`;
  
    document.getElementById('main-content').innerHTML = content;
    loadInventoryTable(); // Load data immediately

  } else if (section === 'sales-management') {
  content = `
    <div class="sales-management">
      <div class="inventory-title">
        <img src="../assets/icons/icons8-sales-100.png" alt="Sales Icon" class="sales-icon" />
        <h2 class="section-title">Sales Management</h2>
      </div>


      <div class="sales-summary-cards" id="salesSummaryCards">
        <div class="card"><h3>Total Sales</h3><p class="value">Loading...</p></div>
        <div class="card"><h3>Total Revenue</h3><p class="value">Loading...</p></div>
        <div class="card"><h3>Top Product</h3><p class="value">Loading...</p></div>
      </div>

      <div class="filters">
        <label>Date Range: 
          <input type="date" id="startDate" /> 
          to 
          <input type="date" id="endDate" />
        </label>
        <label>User: 
          <select id="userFilter">
            <option value="">All Users</option>
          </select>
        </label>
        <button onclick="loadSalesData()">Filter</button>
        <button onclick="exportSalesCSV()">Export CSV</button>
        <button onclick="openSalesGraphModal()">View Sales Graph</button>
      </div>

      <div class="sales-table table-container">
        <table id="salesTable">
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>User</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total (Ksh)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody id="salesTableBody">
            <tr>
              <td colspan="6" style="text-align: center;">Loading sales data...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`;
  
  document.getElementById('main-content').innerHTML = content;
  loadSalesData(); // Load sales data immediately
  loadUserFilter(); // Load users for filter dropdown
}else if (section === 'view-users') {
  content =`
    <div class="manage-users-section">
      <div class="users-header">
        <div class="users-title-section">
          <div class="inventory-title">
            <img src="../assets/icons/icons8-users-96(1).png" alt="Users Icon" class="inventory-icon" />
            <h2 class="section-title">User Management</h2>
          </div>
          <div class="users-search-section">
            <div class="search-wrapper">
              <input type="text" id="userSearch" placeholder="Search users..." />
              <button type="button" class="search-btn" onclick="loadUsersData()">
                <img src="../assets/icons/icons8-search-100.png" alt="Search Icon">
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <div class="user-cards-container" id="userCardsContainer">
        <div class="loading-message">Loading users...</div>
      </div>
    </div>`;
  
  document.getElementById('main-content').innerHTML = content;
  loadUsersData(); // Load users data immediately
    // Add event listener for search input
    setTimeout(() => {
        const searchInput = document.getElementById('userSearch');
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    loadUsersData();
                }
            });
        }
    }, 100);
}else {
    content = `
      <div class="support-management-section">
        <div class="support-header">
          <div class="inventory-title">
            <img src="../assets/icons/icons8-support (mod).png" alt="Support Icon" class="inventory-icon" />
            <h2 class="section-title">Support Requests Management</h2>
          </div>
          
          <div class="support-controls">
            <div class="search-wrapper">
              <input type="text" id="supportSearch" placeholder="Search support requests..." />
              <button type="button" class="search-btn" onclick="loadSupportRequests()">
                <img src="../assets/icons/icons8-search-100.png" alt="Search Icon">
              </button>
            </div>
            
            <select id="statusFilter" onchange="loadSupportRequests()">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <select id="priorityFilter" onchange="loadSupportRequests()">
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div class="support-stats-cards">
          <div class="card">
            <h3>Total Requests</h3>
            <p class="value" id="totalRequests">Loading...</p>
          </div>
          <div class="card">
            <h3>Pending</h3>
            <p class="value pending-count" id="pendingRequests">Loading...</p>
          </div>
          <div class="card">
            <h3>In Progress</h3>
            <p class="value in-progress-count" id="inProgressRequests">Loading...</p>
          </div>
          <div class="card">
            <h3>Resolved</h3>
            <p class="value resolved-count" id="resolvedRequests">Loading...</p>
          </div>
        </div>

        <div class="table-container">
          <table id="supportTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Submitted On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="supportTableBody">
              <tr>
                <td colspan="8" style="text-align: center;">Loading support requests...</td>
              </tr>
            </tbody>
          </table>

          <div class="table-footer" id="supportFooter">
            <div class="entry-info" id="supportEntryInfo">Loading...</div>
            <div class="pagination-controls" id="supportPaginationControls">
              <button class="pagination-btn" onclick="changeSupportPage(1)">«</button>
              <button class="pagination-btn">1</button>
              <button class="pagination-btn">»</button>
            </div>
            <div class="entries-per-page">
              Show 
              <input type="number" id="supportPerPage" min="1" value="10" class="entry-count" onchange="loadSupportRequests()" />
              entries
            </div>
          </div>
        </div>
      </div>`;
    
    document.getElementById('main-content').innerHTML = content;
    loadSupportRequests(); // Load data immediately
    
    // Add event listener for search input
    setTimeout(() => {
        const searchInput = document.getElementById('supportSearch');
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    loadSupportRequests(1);
                }
            });
        }
    }, 100);
}



  document.getElementById('main-content').innerHTML = content;
  // edit admin registration form popup
  
  //phone field styling
    const phoneInput = document.querySelector("#phone");
  if (phoneInput) {
    window.intlTelInput(phoneInput, {
      initialCountry: "auto",
      geoIpLookup: function (callback) {
        fetch("https://ipapi.co/json")
          .then(res => res.json())
          .then(data => callback(data.country_code))
          .catch(() => callback("us"));
      },
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18/build/js/utils.js"
    });
  }

  


  if (section === 'overview') {
    generateGreeting();
  }
  // Add this to your loadSection function after the inventory content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // This will run after the inventory section is loaded
    const searchInput = document.getElementById('inventorySearch');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadInventoryTable(1);
            }
        });
    }
});

// Also add this to your loadSection function in the inventory section
if (section === 'manage-inventory') {
    // ... existing code ...
    
    // Add event listener for search input
    setTimeout(() => {
        const searchInput = document.getElementById('inventorySearch');
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    loadInventoryTable(1);
                }
            });
        }
    }, 100);
}
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
  fetch('../php/get_admin_profile.php')
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

// Load dashboard statistics

function loadDashboardStats() {
    fetch('../php/get_admin_dashboard_stats.php')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                updateDashboardCards(data.data);
                updateRecentActivities(data.data.recent_activities);
                // Load additional dashboard data
                loadTopProducts();
                loadSalesPerformance();
            } else {
                console.error('Error loading dashboard stats:', data.message);
                setDefaultValues();
                loadTopProducts();
                loadSalesPerformance();
            }
        })
        .catch(err => {
            console.error('Failed to load dashboard stats:', err);
            setDefaultValues();
            loadTopProducts();
            loadSalesPerformance();
        });
}
// Load top selling products
function loadTopProducts() {
    fetch('../php/get_top_products.php')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                updateTopProducts(data.data);
            } else {
                console.error('Error loading top products:', data.message);
                showTopProductsError();
            }
        })
        .catch(err => {
            console.error('Failed to load top products:', err);
            showTopProductsError();
        });
}

// Update top products list
// Update top products list
function updateTopProducts(products) {
    const topProductsList = document.getElementById('topProductsList');
    
    if (!products || products.length === 0) {
        topProductsList.innerHTML = '<p>No sales data available</p>';
        return;
    }
    
    topProductsList.innerHTML = products.map(product => `
        <div class="top-product-item">
            <span>${product.name}</span>
            <div class="product-stats">
                <span class="quantity">${product.total_quantity} sold</span>
                <span class="sales-count">${product.sales_count} sales</span>
            </div>
        </div>
    `).join('');
}

function showTopProductsError() {
    const topProductsList = document.getElementById('topProductsList');
    if (topProductsList) {
        topProductsList.innerHTML = '<p>Error loading top products</p>';
    }
}

// Load sales performance chart
function loadSalesPerformance() {
    fetch('../php/get_sales_performance.php')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                renderSalesPerformanceChart(data.data);
            } else {
                console.error('Error loading sales performance:', data.message);
                renderDefaultPerformanceChart();
            }
        })
        .catch(err => {
            console.error('Failed to load sales performance:', err);
            renderDefaultPerformanceChart();
        });
}

// Render sales performance chart
function renderSalesPerformanceChart(salesData) {
    const ctx = document.getElementById('salesChartMini').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.salesPerformanceChart) {
        window.salesPerformanceChart.destroy();
    }
    
    // Process data for chart
    const labels = salesData.map(item => {
        const date = new Date(item.month + '-01');
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    
    const revenueData = salesData.map(item => item.revenue);
    const salesCountData = salesData.map(item => item.sales_count);
    const quantityData = salesData.map(item => item.total_quantity);
    
    window.salesPerformanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Revenue (Ksh)',
                    data: revenueData,
                    borderColor: '#00796b',
                    backgroundColor: 'rgba(0, 121, 107, 0.1)',
                    yAxisID: 'y',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Items Sold',
                    data: quantityData,
                    borderColor: '#ff9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Revenue (Ksh)'
                    },
                    ticks: {
                        callback: function(value) {
                            return 'Ksh ' + value.toLocaleString();
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Items Sold'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Sales Performance (Last 6 Months)'
                }
            }
        }
    });
}

// Update the dashboard cards with real data
function updateDashboardCards(stats) {
    // Update main cards
    document.querySelector('.card:nth-child(1) .value').textContent = stats.total_users.toLocaleString();
    document.querySelector('.card:nth-child(2) .value').textContent = `Ksh ${stats.total_revenue.toLocaleString()}`;
    document.querySelector('.card:nth-child(3) .value').textContent = stats.total_products.toLocaleString();
    document.querySelector('.card:nth-child(4) .value').textContent = stats.total_sales.toLocaleString();
    
    // Update info cards
    const infoCards = document.querySelectorAll('.info-cards .card');
    if (infoCards.length >= 1) {
        infoCards[0].innerHTML = `
            <h3>Low Stock Alerts</h3>
            <p class="alert-count">${stats.low_stock_alerts} items need attention</p>
            ${stats.low_stock_alerts > 0 ? '<button class="view-alerts-btn" onclick="viewLowStockItems()">View Alerts</button>' : ''}
        `;
    }
}

// Update recent activities with real data
function updateRecentActivities(activities) {
    const activityLog = document.querySelector('.activity-log');
    if (!activityLog) return;
    
    if (activities.length === 0) {
        activityLog.innerHTML = `
            <li>No recent activity found</li>
            <li>Activities will appear here as they occur</li>
        `;
        return;
    }
    
    activityLog.innerHTML = '';
    activities.forEach(activity => {
        const li = document.createElement('li');
        li.className = 'activity-item';
        li.innerHTML = `
            <span class="activity-text">${activity.description}</span>
            <span class="activity-time">${formatTimeAgo(activity.created_at)}</span>
        `;
        activityLog.appendChild(li);
    });
}

// Format time ago for activities
function formatTimeAgo(timestamp) {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - activityTime) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
}

// Set default values when data fails to load
function setDefaultValues() {
    const cards = document.querySelectorAll('.card .value');
    cards[0].textContent = '0';
    cards[1].textContent = 'Ksh 0';
    cards[2].textContent = '0';
    cards[3].textContent = '0';
    
    const infoCards = document.querySelectorAll('.info-cards .card');
    if (infoCards.length >= 1) {
        infoCards[0].innerHTML = '<h3>Low Stock Alerts</h3><p class="alert-count">0 items need attention</p>';
    }
}


// View low stock items - UPDATED FUNCTION


// Alternative approach: Open a modal with low stock items
function viewLowStockItemsModal() {
    fetch('../php/get_low_stock_items.php')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                openLowStockModal(data.data);
            } else {
                console.error('Error loading low stock items:', data.message);
                showNotification('Error loading low stock items', 'error');
            }
        })
        .catch(err => {
            console.error('Failed to load low stock items:', err);
            showNotification('Failed to load low stock items', 'error');
        });
}

// Open low stock items modal
function openLowStockItemsModal() {
    const modal = document.getElementById('settings-modal');
    const modalContent = document.getElementById('settings-modal-content');

    // Show loading state
    modalContent.innerHTML = `
        <h2>Low Stock Alerts</h2>
        <div class="loading-message">Loading low stock items...</div>
    `;
    modal.style.display = 'flex';

    // Fetch low stock items
    fetch('../php/get_low_stock_items.php')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success' && data.data.length > 0) {
                renderLowStockModal(data.data);
            } else {
                modalContent.innerHTML = `
                    <h2>Low Stock Alerts</h2>
                    <div class="no-alerts-message">
                        <p>No low stock items found. All inventory levels are good!</p>
                        <button onclick="closeSettingsModal()" class="cancel-btn">Close</button>
                    </div>
                `;
            }
        })
        .catch(err => {
            console.error('Error loading low stock items:', err);
            modalContent.innerHTML = `
                <h2>Low Stock Alerts</h2>
                <div class="error-message">
                    <p>Error loading low stock items. Please try again.</p>
                    <button onclick="closeSettingsModal()" class="cancel-btn">Close</button>
                </div>
            `;
        });
}

// Render low stock items in modal - UPDATED WITH IMAGES
function renderLowStockModal(lowStockItems) {
    const modalContent = document.getElementById('settings-modal-content');
    
    modalContent.innerHTML = `
        <h2>Low Stock Alerts</h2>
        <div class="low-stock-list">
            <p class="alert-count">${lowStockItems.length} items need attention</p>
            
            <div class="low-stock-items">
                ${lowStockItems.map(item => `
                    <div class="low-stock-item">
                        <div class="item-image-column">
                            <img src="../uploads/inventory/${item.image || 'default-item.png'}" 
                                 alt="${item.name}" 
                                 class="item-image-small"
                                 onerror="this.src='../assets/icons/default-item.png'">
                        </div>
                        <div class="item-info">
                            <h4>${item.name}</h4>
                            <p class="item-code">Code: ${item.item_code}</p>
                            <p class="item-category">Category: ${item.category}</p>
                        </div>
                        <div class="stock-info">
                            <p class="current-stock ${item.stock <= 5 ? 'critical-stock' : 'low-stock'}">
                                Current: ${item.stock} ${getUnitForCategory(item.category)}
                            </p>
                            <p class="threshold">Threshold: ${item.low_stock_threshold || 10} ${getUnitForCategory(item.category)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="modal-actions">
                <button onclick="closeSettingsModal(); loadSection('manage-inventory');" class="action-btn primary">
                    Go to Inventory Management
                </button>
                <button onclick="closeSettingsModal()" class="cancel-btn">
                    Close
                </button>
            </div>
        </div>
    `;
}

// Update the dashboard cards function to use the modal approach
function updateDashboardCards(stats) {
    // Update main cards
    document.querySelector('.card:nth-child(1) .value').textContent = stats.total_users.toLocaleString();
    document.querySelector('.card:nth-child(2) .value').textContent = `Ksh ${stats.total_revenue.toLocaleString()}`;
    document.querySelector('.card:nth-child(3) .value').textContent = stats.total_products.toLocaleString();
    document.querySelector('.card:nth-child(4) .value').textContent = stats.total_sales.toLocaleString();
    
    // Update info cards - CHANGED TO USE MODAL APPROACH
    const infoCards = document.querySelectorAll('.info-cards .card');
    if (infoCards.length >= 1) {
        infoCards[0].innerHTML = `
            <h3>Low Stock Alerts</h3>
            <p class="alert-count">${stats.low_stock_alerts} items need attention</p>
            ${stats.low_stock_alerts > 0 ? '<button class="view-alerts-btn" onclick="openLowStockItemsModal()">View Alerts</button>' : ''}
        `;
    }
}

// Add notification function
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    if (type === 'info') {
        notification.style.backgroundColor = '#2196F3';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
    } else if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .low-stock-list {
        max-width: 600px;
        max-height: 70vh;
        overflow-y: auto;
    }
    
    .low-stock-items {
        margin: 20px 0;
    }
    
    .low-stock-item {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .item-info h4 {
        margin: 0 0 5px 0;
        color: #333;
    }
    
    .item-code, .item-category {
        margin: 2px 0;
        font-size: 0.9em;
        color: #666;
    }
    
    .stock-info {
        text-align: center;
    }
    
    .current-stock {
        font-weight: bold;
        margin: 0;
    }
    
    .critical-stock {
        color: #f44336;
    }
    
    .low-stock {
        color: #ff9800;
    }
    
    .threshold {
        margin: 2px 0;
        font-size: 0.9em;
        color: #666;
    }
    
    .item-actions {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .edit-btn.small, .view-btn.small {
        padding: 5px 10px;
        font-size: 0.8em;
        white-space: nowrap;
    }
    
    .modal-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
    }
    
    .action-btn.primary {
        background: #00796b;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .no-alerts-message, .error-message {
        text-align: center;
        padding: 40px 20px;
    }
    
    .no-alerts-message p, .error-message p {
        margin-bottom: 20px;
        color: #666;
    }
    
    .alert-count {
        font-size: 1.2em;
        font-weight: bold;
        color: #ff9800;
        text-align: center;
        margin: 10px 0;
    }
`;
document.head.appendChild(style);

let currentPage = 1;
let currentSearch = '';
let currentCategory = '';

// Load inventory table with data
function loadInventoryTable(page = 1) {
    currentPage = page;
    currentSearch = document.getElementById('inventorySearch')?.value || '';
    currentCategory = document.getElementById('categoryFilter')?.value || '';
    
    const perPage = document.getElementById('perPage')?.value || 10;
    
    const params = new URLSearchParams({
        page: currentPage,
        per_page: perPage,
        search: currentSearch,
        category: currentCategory
    });
    
    fetch(`../php/get_inventory.php?${params}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                renderInventoryTable(data.data, data.pagination);
            } else {
                console.error('Error loading inventory:', data.message);
                document.getElementById('inventoryTableBody').innerHTML = 
                    '<tr><td colspan="8" style="text-align: center; color: red;">Error loading inventory</td></tr>';
            }
        })
        .catch(err => {
            console.error('Failed to load inventory:', err);
            document.getElementById('inventoryTableBody').innerHTML = 
                '<tr><td colspan="8" style="text-align: center; color: red;">Failed to load inventory</td></tr>';
        });
}

// Render inventory table
function renderInventoryTable(items, pagination) {
    const tbody = document.getElementById('inventoryTableBody');
    
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No inventory items found</td></tr>';
        return;
    }
    
    tbody.innerHTML = items.map(item => `
        <tr class="${item.stock <= (item.low_stock_threshold || 10) ? 'low-stock' : ''}">
            <td>${item.item_code}</td>
            <td>
                <img src="../uploads/inventory/${item.image || 'default-item.png'}" 
                     alt="${item.item_name}" 
                     class="item-image"
                     onerror="this.src='../assets/icons/default-item.png'">
            </td>
            <td>${item.item_name}</td>
            <td>
                <span class="category-badge category-${item.category}">${item.category}</span>
            </td>
            <td>
                <span class="stock-amount ${item.stock <= (item.low_stock_threshold || 10) ? 'low-stock-warning' : ''}">
                    ${item.stock} ${getUnitForCategory(item.category)}
                </span>
            </td>
            <td>Ksh ${parseFloat(item.price).toLocaleString()}</td>
            <td>${formatDate(item.updated_at)}</td>
            <td>
                <button class="edit-btn" onclick="openEditItemModal(${item.id})">
                    <img src="../assets/icons/icons8-edit-64.png" alt="Edit Icon" class="edit-icon"/>
                </button>
                <button class="delete-btn" onclick="deleteItem(${item.id})">
                    <img src="../assets/icons/icons8-delete-96.png" alt="Delete Icon" class="delete-icon"/>
                </button>
            </td>
        </tr>
    `).join('');
    
    updatePagination(pagination);
    updateEntryInfo(pagination);
}
// Helper functions
function getUnitForCategory(category) {
    const units = {
        'fuel': 'L',
        'oil': 'L',
        'tools': 'pcs'
    };
    return units[category] || '';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function updatePagination(pagination) {
    const controls = document.getElementById('paginationControls');
    const totalPages = pagination.total_pages;
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `<button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
        onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>«</button>`;
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
            onclick="changePage(${i})">${i}</button>`;
    }
    
    // Next button
    paginationHTML += `<button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
        onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>»</button>`;
    
    controls.innerHTML = paginationHTML;
}

function updateEntryInfo(pagination) {
    const start = ((currentPage - 1) * pagination.per_page) + 1;
    const end = Math.min(start + pagination.per_page - 1, pagination.total);
    
    document.getElementById('entryInfo').textContent = 
        `Showing ${start}–${end} of ${pagination.total} entries`;
}

function changePage(page) {
    loadInventoryTable(page);
}

// Delete item function
function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    fetch(`../php/delete_inventory_item.php?id=${itemId}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Item deleted successfully');
                loadInventoryTable(currentPage);
            } else {
                alert('Failed to delete item: ' + data.message);
            }
        })
        .catch(err => {
            console.error('Error deleting item:', err);
            alert('Error deleting item');
        });
}

//inventory add item modal
function openAddItemModal() {
  const modal = document.getElementById('settings-modal');
  const modalContent = document.getElementById('settings-modal-content');

  const content = `
    <h2>Add New Inventory Item</h2>
    <label>Item Name</label>
    <input type="text" name="name" placeholder="Enter item name" required />

    <label>Category</label>
    <select name="category" required>
      <option value="">Select category</option>
      <option value="fuel">Fuel</option>
      <option value="oil">Lubricants</option>
      <option value="tools">Tools</option>
    </select>

    <label>Stock Quantity</label>
    <input type="number" name="stock" min="0" placeholder="e.g., 100" required />

    <label>Price</label>
    <input type="number" name="price" min="0" step="0.01" placeholder="e.g., 150.00" required />

    <label>Item Image</label>
    <input type="file" name="image" accept="image/*" />

    <button onclick="submitAddItem()">Add Item</button>
  `;

  modalContent.innerHTML = content;
  modal.style.display = 'flex';
}

function submitAddItem() {
  const modal = document.getElementById('settings-modal');
  const formData = new FormData();

  const modalContent = modal.querySelector('#settings-modal-content');
  const itemName = modalContent.querySelector('[name="name"]').value;
  const category = modalContent.querySelector('[name="category"]').value;
  const stock = modalContent.querySelector('[name="stock"]').value;
  const price = modalContent.querySelector('[name="price"]').value;
  const image = modalContent.querySelector('[name="image"]').files[0];

  if (!itemName || !category || !stock || !price) {
    alert("Please fill in all required fields.");
    return;
  }

  formData.append('name', itemName);
  formData.append('category', category);
  formData.append('stock', stock);
  formData.append('price', price);
  if (image) formData.append('image', image);

  fetch('../php/add_inventory_item.php', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    if (data.success) {
      modal.style.display = 'none';
      loadInventoryTable(); // Optional: you can define this to reload inventory
    }
  })
  .catch(err => {
    console.error("Error:", err);
    alert("Failed to add item.");
  });
}
// Open edit item modal
function openEditItemModal(itemId) {
    console.log('Opening edit modal for item ID:', itemId);
    
    fetch(`../php/get_inventory_item.php?id=${itemId}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                populateEditForm(data.data);
                document.getElementById('editInventoryModal').classList.remove('hidden');
            } else {
                alert('Error loading item: ' + data.message);
            }
        })
        .catch(err => {
            console.error('Error fetching item details:', err);
            alert('Failed to load item details');
        });
}

// Populate edit form with item data
function populateEditForm(item) {
    document.getElementById('editItemId').value = item.id;
    document.getElementById('editItemCode').value = item.item_code;
    document.getElementById('editItemName').value = item.item_name;
    document.getElementById('editCategory').value = item.category;
    document.getElementById('editStock').value = item.stock;
    document.getElementById('editPrice').value = item.price;
    document.getElementById('editLowStockThreshold').value = item.low_stock_threshold || 10;
    
    // Handle image preview
    const imageContainer = document.getElementById('currentImageContainer');
    const imagePreview = document.getElementById('currentImagePreview');
    
    if (item.image) {
        imagePreview.src = `../uploads/inventory/${item.image}`;
        imagePreview.onerror = function() {
            this.src = '../assets/icons/default-item.png';
        };
        imageContainer.style.display = 'block';
    } else {
        imageContainer.style.display = 'none';
    }
}

// Close edit item modal
function closeEditItemModal() {
    document.getElementById('editInventoryModal').classList.add('hidden');
    document.getElementById('editItemForm').reset();
    document.getElementById('currentImageContainer').style.display = 'none';
}

// Handle edit form submission
document.addEventListener('DOMContentLoaded', function() {
    const editForm = document.getElementById('editItemForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitEditItem();
        });
    }
});

// Submit edited item
function submitEditItem() {
    const form = document.getElementById('editItemForm');
    const formData = new FormData(form);
    
    const submitBtn = form.querySelector('.save-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;
    
    fetch('../php/update_inventory_item.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            closeEditItemModal();
            loadInventoryTable(currentPage); // Reload the table
        }
    })
    .catch(err => {
        console.error('Error updating item:', err);
        alert('Failed to update item');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// Load sales data
function loadSalesData() {
    const startDate = document.getElementById('startDate')?.value || '';
    const endDate = document.getElementById('endDate')?.value || '';
    const userFilter = document.getElementById('userFilter')?.value || '';

    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (userFilter) params.append('user', userFilter);

    // Show loading state
    const tbody = document.getElementById('salesTableBody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Loading sales data...</td></tr>';
    }

    fetch(`../php/get_sales_data.php?${params}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                return res.text().then(text => {
                    console.error('Expected JSON, got:', text);
                    throw new Error('Server returned non-JSON response');
                });
            }
            return res.json();
        })
        .then(data => {
            if (data.status === 'success') {
                updateSalesSummary(data.data.summary);
                renderSalesTable(data.data.sales);
            } else {
                console.error('Error loading sales data:', data.message);
                showSalesError();
            }
        })
        .catch(err => {
            console.error('Failed to load sales data:', err);
            showSalesError();
        });
}
// Load users for filter dropdown
function loadUserFilter() {
    fetch('../php/get_users_for_filter.php')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                const userSelect = document.getElementById('userFilter');
                if (userSelect) {
                    userSelect.innerHTML = '<option value="">All Users</option>';
                    
                    data.users.forEach(user => {
                        const option = document.createElement('option');
                        option.value = user.username;
                        option.textContent = user.username;
                        userSelect.appendChild(option);
                    });
                }
            }
        })
        .catch(err => {
            console.error('Failed to load users:', err);
        });
}

// Update sales summary cards
function updateSalesSummary(summary) {
    const summaryCards = document.querySelectorAll('#salesSummaryCards .card .value');
    
    if (summaryCards.length >= 3) {
        summaryCards[0].textContent = summary.total_sales ? summary.total_sales.toLocaleString() : '0';
        summaryCards[1].textContent = summary.total_revenue ? `Ksh ${summary.total_revenue.toLocaleString()}` : 'Ksh 0';
        summaryCards[2].textContent = summary.top_product || 'No sales';
    }
}

// Render sales table
function renderSalesTable(sales) {
    const tbody = document.getElementById('salesTableBody');
    if (!tbody) return;
    
    if (!sales || sales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No sales found for the selected filters</td></tr>';
        return;
    }
    
    tbody.innerHTML = sales.map(sale => `
        <tr>
            <td>${sale.sale_id || 'N/A'}</td>
            <td>${sale.user || 'Unknown'}</td>
            <td>${sale.product || 'N/A'}</td>
            <td>${sale.quantity || 0}</td>
            <td>Ksh ${(sale.total || 0).toLocaleString()}</td>
            <td>${sale.date || 'Unknown'}</td>
        </tr>
    `).join('');
}

// Show error state
function showSalesError() {
    const tbody = document.getElementById('salesTableBody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error loading sales data</td></tr>';
    }
    
    const summaryCards = document.querySelectorAll('#salesSummaryCards .card .value');
    summaryCards.forEach(card => {
        if (card) card.textContent = 'Error';
    });
}

// Export sales data to CSV
function exportSalesCSV() {
    const startDate = document.getElementById('startDate')?.value || '';
    const endDate = document.getElementById('endDate')?.value || '';
    const userFilter = document.getElementById('userFilter')?.value || '';

    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (userFilter) params.append('user', userFilter);
    params.append('export', 'csv');

    // Open in new tab to trigger download
    window.open(`../php/get_sales_data.php?${params}`, '_blank');
}

// Sales graph modal with real data
function openSalesGraphModal() {
    document.getElementById('sales-graph-modal').style.display = 'flex';
    
    // Fetch sales data for the chart
    fetch('../php/get_sales_data.php')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                renderSalesChart(data.data.sales);
            } else {
                console.error('Error loading chart data:', data.message);
                renderDefaultChart();
            }
        })
        .catch(err => {
            console.error('Failed to load chart data:', err);
            renderDefaultChart();
        });
}

// Render sales chart with real data
function renderSalesChart(sales) {
    const ctx = document.getElementById('salesChart').getContext('2d');

    // Destroy existing chart
    if (window.salesChartInstance) {
        window.salesChartInstance.destroy();
    }

    // Process data for chart - group by month
    const monthlyData = {};
    sales.forEach(sale => {
        const date = new Date(sale.date);
        const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = 0;
        }
        monthlyData[monthYear] += sale.total;
    });

    const labels = Object.keys(monthlyData);
    const data = Object.values(monthlyData);

    window.salesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Monthly Revenue (Ksh)',
                data: data,
                borderColor: '#00796b',
                backgroundColor: 'rgba(0, 121, 107, 0.15)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        font: { size: 14 }
                    }
                },
                title: {
                    display: true,
                    text: 'Sales Performance Over Time',
                    font: { size: 16 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Ksh ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Render default chart if data fails to load
function renderDefaultChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');

    if (window.salesChartInstance) {
        window.salesChartInstance.destroy();
    }

    window.salesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Revenue (Ksh)',
                data: [4200, 5800, 7100, 6300, 8500, 9200],
                borderColor: '#00796b',
                backgroundColor: 'rgba(0, 121, 107, 0.15)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        font: { size: 14 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1000
                    }
                }
            }
        }
    });
}

function closeSalesGraphModal() {
  document.getElementById('sales-graph-modal').style.display = 'none';
}

// Load users data
function loadUsersData() {
    const search = document.getElementById('userSearch')?.value || '';
    
    // Close all cards before loading new data
    closeAllUserCards();
    
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    
    fetch(`../php/get_users_data.php?${params}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                renderUserCards(data.data);
            } else {
                console.error('Error loading users data:', data.message);
                showUsersError();
            }
        })
        .catch(err => {
            console.error('Failed to load users data:', err);
            showUsersError();
        });
}

// Render user cards
// Render user cards with expandable functionality
function renderUserCards(users) {
    const container = document.getElementById('userCardsContainer');
    
    if (users.length === 0) {
        container.innerHTML = `
            <div class="no-users-message">
                <img src="../assets/icons/icons8-users-96.png" alt="No Users" style="width: 80px; opacity: 0.5; margin-bottom: 16px;">
                <h3>No users found</h3>
                <p>No users match your search criteria.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = users.map(user => `
        <div class="user-card" onclick="toggleUserCard(this)">
            <div class="user-card-header">
                <img src="../uploads/${user.photo || 'default-user.png'}" 
                     alt="${user.username}" 
                     class="user-photo"
                     onerror="this.src='../assets/icons/default-user.png'">
                <div class="user-basic-info">
                    <p class="user-name">${user.username}</p>
                    <p class="user-email">${user.email}</p>
                    <p class="user-status ${user.status.toLowerCase()}">${user.status}</p>
                </div>
                <div class="expand-icon">▼</div>
            </div>
            
            <div class="user-card-content">
                <div class="user-details">
                    <div class="user-detail-item">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${user.phone || 'Not provided'}</span>
                    </div>
                    <div class="user-detail-item">
                        <span class="detail-label">Member since:</span>
                        <span class="detail-value">${formatDate(user.created_at)}</span>
                    </div>
                    <div class="user-detail-item">
                        <span class="detail-label">Total Sales:</span>
                        <span class="detail-value">${user.total_orders}</span>
                    </div>
                    <div class="user-detail-item">
                        <span class="detail-label">Last Sale:</span>
                        <span class="detail-value">${user.last_order_date ? formatDate(user.last_order_date) : 'Never'}</span>
                    </div>
                </div>
                
                <div class="user-revenue">
                    <p class="user-revenue-label">Total Revenue</p>
                    <p class="revenue-count">Ksh ${user.total_revenue.toLocaleString()}</p>
                </div>
                
                <div class="user-actions">
                    <button class="edit-user-btn" onclick="event.stopPropagation(); openEditUserModal(${user.id})">
                        Edit
                    </button>
                    <button class="delete-user-btn" onclick="event.stopPropagation(); deleteUser(${user.id})">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle card expansion
function toggleUserCard(card) {
    const isExpanded = card.classList.contains('expanded');
    
    // Close all other cards
    document.querySelectorAll('.user-card.expanded').forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('expanded');
            otherCard.querySelector('.expand-icon').textContent = '▼';
        }
    });
    
    // Toggle current card
    if (!isExpanded) {
        card.classList.add('expanded');
        card.querySelector('.expand-icon').textContent = '▲';
    } else {
        card.classList.remove('expanded');
        card.querySelector('.expand-icon').textContent = '▼';
    }
}

// Close all cards (useful when searching or filtering)
function closeAllUserCards() {
    document.querySelectorAll('.user-card.expanded').forEach(card => {
        card.classList.remove('expanded');
        card.querySelector('.expand-icon').textContent = '▼';
    });
}

// Show error state for users
function showUsersError() {
    const container = document.getElementById('userCardsContainer');
    container.innerHTML = `
        <div class="error-message">
            <img src="../assets/icons/icons8-error-96.png" alt="Error" style="width: 80px; margin-bottom: 16px;">
            <h3>Error Loading Users</h3>
            <p>Failed to load user data. Please try again.</p>
            <button onclick="loadUsersData()" class="retry-btn">Retry</button>
        </div>
    `;
}

// Delete user function
function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    fetch(`../php/delete_user.php?id=${userId}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('User deleted successfully');
                loadUsersData(); // Reload the user list
            } else {
                alert('Failed to delete user: ' + data.message);
            }
        })
        .catch(err => {
            console.error('Error deleting user:', err);
            alert('Error deleting user');
        });
}

// Open edit user modal
function openEditUserModal(userId) {
    fetch(`../php/get_user_details.php?id=${userId}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                openEditUserForm(data.data);
            } else {
                alert('Error loading user details: ' + data.message);
            }
        })
        .catch(err => {
            console.error('Error fetching user details:', err);
            alert('Failed to load user details');
        });
}

// Open edit user form in modal
function openEditUserForm(user) {
    const modal = document.getElementById('settings-modal');
    const modalContent = document.getElementById('settings-modal-content');

    const content = `
        <h2>Edit User</h2>
        <form id="editUserForm">
            <input type="hidden" name="id" value="${user.id}">
            
            <div class="form-row">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value="${user.username}" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value="${user.email}" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" value="${user.phone || ''}">
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label>Profile Photo</label>
                <input type="file" name="photo" accept="image/*">
                <small>Leave empty to keep current photo</small>
            </div>
            
            ${user.photo ? `
            <div class="current-photo">
                <label>Current Photo:</label>
                <img src="../uploads/${user.photo}" alt="Current Photo" style="max-width: 100px; display: block; margin-top: 5px;">
            </div>
            ` : ''}
            
            <div class="form-actions">
                <button type="submit" class="save-btn">Save Changes</button>
                <button type="button" onclick="closeSettingsModal()" class="cancel-btn">Cancel</button>
            </div>
        </form>
    `;

    modalContent.innerHTML = content;
    modal.style.display = 'flex';
    
    // Add form submit handler
    setTimeout(() => {
        const form = document.getElementById('editUserForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                submitEditUser();
            });
        }
    }, 100);
}

// Submit edited user
function submitEditUser() {
    const form = document.getElementById('editUserForm');
    const formData = new FormData(form);
    
    const submitBtn = form.querySelector('.save-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;
    
    fetch('../php/update_user.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            closeSettingsModal();
            loadUsersData(); // Reload the user list
        }
    })
    .catch(err => {
        console.error('Error updating user:', err);
        alert('Failed to update user');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// Open add user modal
function openAddUserModal() {
    const modal = document.getElementById('settings-modal');
    const modalContent = document.getElementById('settings-modal-content');

    const content = `
        <h2>Add New User</h2>
        <form id="addUserForm">
            <div class="form-row">
                <div class="form-group">
                    <label>Username *</label>
                    <input type="text" name="username" required>
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Password *</label>
                    <input type="password" name="password" required>
                </div>
                <div class="form-group">
                    <label>Confirm Password *</label>
                    <input type="password" name="confirm_password" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone">
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label>Profile Photo</label>
                <input type="file" name="photo" accept="image/*">
            </div>
            
            <div class="form-actions">
                <button type="submit" class="save-btn">Add User</button>
                <button type="button" onclick="closeSettingsModal()" class="cancel-btn">Cancel</button>
            </div>
        </form>
    `;

    modalContent.innerHTML = content;
    modal.style.display = 'flex';
    
    // Add form submit handler
    setTimeout(() => {
        const form = document.getElementById('addUserForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                submitAddUser();
            });
        }
    }, 100);
}




//Support requests management section
// Support requests management
let currentSupportPage = 1;
let currentSupportSearch = '';
let currentStatusFilter = '';
let currentPriorityFilter = '';

// Load support requests
function loadSupportRequests(page = 1) {
    currentSupportPage = page;
    currentSupportSearch = document.getElementById('supportSearch')?.value || '';
    currentStatusFilter = document.getElementById('statusFilter')?.value || '';
    currentPriorityFilter = document.getElementById('priorityFilter')?.value || '';
    
    const perPage = document.getElementById('supportPerPage')?.value || 10;
    
    const params = new URLSearchParams({
        page: currentSupportPage,
        per_page: perPage,
        search: currentSupportSearch,
        status: currentStatusFilter,
        priority: currentPriorityFilter
    });
    
    // In your loadSupportRequests function, replace the fetch call with:
    fetch(`../php/get_support_requests.php?${params}`)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            return res.text().then(text => {
                console.error('Expected JSON, got:', text);
                throw new Error('Server returned non-JSON response');
            });
        }
        return res.json();
    })
    .then(data => {
        if (data.status === 'success') {
            renderSupportTable(data.data.requests, data.pagination);
            updateSupportStats(data.data.stats);
        } else {
            console.error('Error loading support requests:', data.message);
            showSupportError();
        }
    })
    .catch(err => {
        console.error('Failed to load support requests:', err);
        showSupportError();
    });
}

// Render support table
function renderSupportTable(requests, pagination) {
    const tbody = document.getElementById('supportTableBody');
    
    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No support requests found</td></tr>';
        return;
    }
    
    tbody.innerHTML = requests.map(request => `
        <tr class="support-request ${request.status}">
            <td>#${request.id}</td>
            <td>
                <div class="user-info">
                    <img src="../uploads/${request.user_photo || 'default-user.png'}" 
                         alt="${request.username}" 
                         class="user-avatar"
                         onerror="this.src='../assets/icons/default-user.png'">
                    <span>${request.username}</span>
                </div>
            </td>
            <td class="subject-cell">${request.subject}</td>
            <td class="message-cell">
                <div class="message-preview">${request.message}</div>
                ${request.message.length > 100 ? 
                  `<button class="view-more-btn" onclick="viewFullMessage(${request.id}, '${request.subject}', \`${request.message.replace(/`/g, '\\`')}\`)">View More</button>` : 
                  ''}
            </td>
            <td>
                <span class="priority-badge priority-${request.priority}">${request.priority}</span>
            </td>
            <td>
                <span class="status-badge status-${request.status}">${request.status}</span>
            </td>
            <td>${formatDate(request.created_at)}</td>
            <td>
                <div class="support-actions">
                    ${request.status !== 'resolved' ? `
                        <button class="action-btn resolve-btn" onclick="updateRequestStatus(${request.id}, 'resolved')" 
                                title="Mark as Resolved">
                            <img src="../assets/icons/icons8-checkmark-96.png" alt="Resolve" />
                        </button>
                        ${request.status !== 'in_progress' ? `
                            <button class="action-btn progress-btn" onclick="updateRequestStatus(${request.id}, 'in_progress')" 
                                    title="Mark as In Progress">
                                <img src="../assets/icons/icons8-progress-100.png" alt="In Progress" />
                            </button>
                        ` : ''}
                    ` : ''}
                    <button class="action-btn view-btn" onclick="viewRequestDetails(${request.id})" 
                            title="View Details">
                        <img src="../assets/icons/icons8-eye-100.png" alt="View" />
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteSupportRequest(${request.id})" 
                            title="Delete Request">
                        <img src="../assets/icons/icons8-delete-96.png" alt="Delete" />
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updateSupportPagination(pagination);
    updateSupportEntryInfo(pagination);
}

// Update support stats cards
// Update support stats cards
function updateSupportStats(stats) {
    console.log('📊 Stats data received:', stats);
    
    // Ensure stats is an object and has the required properties
    if (!stats || typeof stats !== 'object') {
        console.error('Invalid stats data:', stats);
        stats = {
            total: 0,
            pending: 0,
            in_progress: 0,
            resolved: 0
        };
    }
    
    // Set default values for missing properties
    const safeStats = {
        total: stats.total || 0,
        pending: stats.pending || 0,
        in_progress: stats.in_progress || 0,
        resolved: stats.resolved || 0
    };
    
    console.log('✅ Safe stats to display:', safeStats);
    
    // Update the DOM elements
    const totalElement = document.getElementById('totalRequests');
    const pendingElement = document.getElementById('pendingRequests');
    const inProgressElement = document.getElementById('inProgressRequests');
    const resolvedElement = document.getElementById('resolvedRequests');
    
    if (totalElement) totalElement.textContent = safeStats.total.toLocaleString();
    if (pendingElement) pendingElement.textContent = safeStats.pending.toLocaleString();
    if (inProgressElement) inProgressElement.textContent = safeStats.in_progress.toLocaleString();
    if (resolvedElement) resolvedElement.textContent = safeStats.resolved.toLocaleString();
}

// Update support pagination
function updateSupportPagination(pagination) {
    const controls = document.getElementById('supportPaginationControls');
    const totalPages = pagination.total_pages;
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `<button class="pagination-btn ${currentSupportPage === 1 ? 'disabled' : ''}" 
        onclick="changeSupportPage(${currentSupportPage - 1})" ${currentSupportPage === 1 ? 'disabled' : ''}>«</button>`;
    
    // Page numbers
    const startPage = Math.max(1, currentSupportPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="pagination-btn ${i === currentSupportPage ? 'active' : ''}" 
            onclick="changeSupportPage(${i})">${i}</button>`;
    }
    
    // Next button
    paginationHTML += `<button class="pagination-btn ${currentSupportPage === totalPages ? 'disabled' : ''}" 
        onclick="changeSupportPage(${currentSupportPage + 1})" ${currentSupportPage === totalPages ? 'disabled' : ''}>»</button>`;
    
    controls.innerHTML = paginationHTML;
}

function updateSupportEntryInfo(pagination) {
    const start = ((currentSupportPage - 1) * pagination.per_page) + 1;
    const end = Math.min(start + pagination.per_page - 1, pagination.total);
    
    document.getElementById('supportEntryInfo').textContent = 
        `Showing ${start}–${end} of ${pagination.total} entries`;
}

function changeSupportPage(page) {
    loadSupportRequests(page);
}

// Show error state for support requests
function showSupportError() {
    const tbody = document.getElementById('supportTableBody');
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: red;">Error loading support requests</td></tr>';
    
    const statsCards = document.querySelectorAll('.support-stats-cards .value');
    statsCards.forEach(card => card.textContent = 'Error');
}

// Update request status
function updateRequestStatus(requestId, newStatus) {
    const statusText = newStatus.replace('_', ' ');
    
    if (!confirm(`Are you sure you want to mark this request as ${statusText}?`)) return;
    
    fetch('../php/update_support_status.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${requestId}&status=${newStatus}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(`Request marked as ${statusText} successfully`);
            loadSupportRequests(currentSupportPage);
        } else {
            alert('Failed to update request: ' + data.message);
        }
    })
    .catch(err => {
        console.error('Error updating request:', err);
        alert('Error updating request');
    });
}


// View full message - FIXED VERSION
function viewFullMessage(requestId, subject, message) {
    const modal = document.getElementById('settings-modal');
    const modalContent = document.getElementById('settings-modal-content');

    const content = `
        <span class="close-btn" onclick="closeSettingsModal()">&times;</span>
        <h2>${subject}</h2>
        <div class="message-full-view">
            <h4>Full Message:</h4>
            <div class="message-content">${message}</div>
        </div>
        <div class="form-actions">
            <button type="button" onclick="closeSettingsModal()" class="cancel-btn">Close</button>
        </div>
    `;

    modalContent.innerHTML = content;
    modal.style.display = 'flex';
    
    // Force scroll to top
    window.scrollTo(0, 0);
    modal.scrollTop = 0;
    modalContent.scrollTop = 0;
    
    setTimeout(() => {
        modal.scrollTop = 0;
        modalContent.scrollTop = 0;
    }, 50);
}

// View request details
function viewRequestDetails(requestId) {
    fetch(`../php/get_support_request_details.php?id=${requestId}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                openRequestDetailsModal(data.data);
            } else {
                alert('Error loading request details: ' + data.message);
            }
        })
        .catch(err => {
            console.error('Error fetching request details:', err);
            alert('Failed to load request details');
        });
}

// View request details - USING SEPARATE MODAL
function viewRequestDetails(requestId) {
    fetch(`../php/get_support_request_details.php?id=${requestId}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                openSupportDetailsModal(data.data);
            } else {
                alert('Error loading request details: ' + data.message);
            }
        })
        .catch(err => {
            console.error('Error fetching request details:', err);
            alert('Failed to load request details');
        });
}

// Open support details modal - SEPARATE MODAL
function openSupportDetailsModal(request) {
    const modal = document.getElementById('support-details-modal');
    const modalBody = document.getElementById('support-details-body');

    const content = `
        <h2>Support Request Details</h2>
        <div class="request-details">
            <div class="detail-row">
                <label>Request ID:</label>
                <span>#${request.id}</span>
            </div>
            <div class="detail-row">
                <label>User:</label>
                <span>${request.username} (${request.email})</span>
            </div>
            <div class="detail-row">
                <label>Subject:</label>
                <span>${request.subject}</span>
            </div>
            <div class="detail-row">
                <label>Priority:</label>
                <span class="priority-badge priority-${request.priority}">${request.priority}</span>
            </div>
            <div class="detail-row">
                <label>Status:</label>
                <span class="status-badge status-${request.status}">${request.status}</span>
            </div>
            <div class="detail-row">
                <label>Submitted:</label>
                <span>${formatDate(request.created_at)}</span>
            </div>
            <div class="detail-row full-width">
                <label>Message:</label>
                <div class="message-content">${request.message}</div>
            </div>
            ${request.admin_notes ? `
            <div class="detail-row full-width">
                <label>Admin Notes:</label>
                <div class="admin-notes">${request.admin_notes}</div>
            </div>
            ` : ''}
        </div>
        
        <div class="request-actions">
            <h4>Update Request:</h4>
            <div class="status-buttons">
                ${request.status !== 'resolved' ? `
                    <button class="action-btn resolve-btn" onclick="updateRequestStatus(${request.id}, 'resolved')">
                        Mark as Resolved
                    </button>
                ` : ''}
                ${request.status !== 'in_progress' ? `
                    <button class="action-btn progress-btn" onclick="updateRequestStatus(${request.id}, 'in_progress')">
                        Mark as In Progress
                    </button>
                ` : ''}
                ${request.status !== 'pending' ? `
                    <button class="action-btn pending-btn" onclick="updateRequestStatus(${request.id}, 'pending')">
                        Mark as Pending
                    </button>
                ` : ''}
            </div>
            
            <div class="add-notes-section">
                <label>Add Admin Notes:</label>
                <textarea id="adminNotes" placeholder="Add notes or follow-up information..."></textarea>
                <button class="save-notes-btn" onclick="saveAdminNotes(${request.id})">Save Notes</button>
            </div>
        </div>
        
        <div class="form-actions">
            <button type="button" onclick="closeSupportDetailsModal()" class="cancel-btn">Close</button>
        </div>
    `;

    modalBody.innerHTML = content;
    modal.style.display = 'flex';
    
    // Force scroll to top
    window.scrollTo(0, 0);
    modal.scrollTop = 0;
    
    setTimeout(() => {
        modal.scrollTop = 0;
    }, 50);
}

// Close support details modal
function closeSupportDetailsModal() {
    const modal = document.getElementById('support-details-modal');
    modal.style.display = 'none';
    // Reset scroll position
    modal.scrollTop = 0;
}

// Also update viewFullMessage to use the separate modal
function viewFullMessage(requestId, subject, message) {
    const modal = document.getElementById('support-details-modal');
    const modalBody = document.getElementById('support-details-body');

    const content = `
        <h2>${subject}</h2>
        <div class="message-full-view">
            <h4>Full Message:</h4>
            <div class="message-content">${message}</div>
        </div>
        <div class="form-actions">
            <button type="button" onclick="closeSupportDetailsModal()" class="cancel-btn">Close</button>
        </div>
    `;

    modalBody.innerHTML = content;
    modal.style.display = 'flex';
    
    window.scrollTo(0, 0);
    modal.scrollTop = 0;
    
    setTimeout(() => {
        modal.scrollTop = 0;
    }, 50);
}

// Update saveAdminNotes to close the correct modal
function saveAdminNotes(requestId) {
    const notes = document.getElementById('adminNotes').value;
    
    if (!notes.trim()) {
        alert('Please enter some notes');
        return;
    }
    
    fetch('../php/update_support_notes.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${requestId}&notes=${encodeURIComponent(notes)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Notes saved successfully');
            closeSupportDetailsModal();
        } else {
            alert('Failed to save notes: ' + data.message);
        }
    })
    .catch(err => {
        console.error('Error saving notes:', err);
        alert('Error saving notes');
    });
}

// Delete support request
function deleteSupportRequest(requestId) {
    if (!confirm('Are you sure you want to delete this support request? This action cannot be undone.')) return;
    
    fetch(`../php/delete_support_request.php?id=${requestId}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Support request deleted successfully');
                loadSupportRequests(currentSupportPage);
            } else {
                alert('Failed to delete request: ' + data.message);
            }
        })
        .catch(err => {
            console.error('Error deleting request:', err);
            alert('Error deleting request');
        });
}

// 2FA Management Functions
function setup2FA() {
    console.log('Starting 2FA setup...');
    
    // Show loading state
    const enableBtn = document.getElementById('enable-2fa-btn');
    const originalText = enableBtn.textContent;
    enableBtn.textContent = 'Loading...';
    enableBtn.disabled = true;
    
    fetch('../php/enable_2fa.php')
        .then(res => {
            console.log('Response status:', res.status);
            console.log('Response URL:', res.url);
            
            // First get the response as text to see what we're getting
            return res.text().then(text => {
                console.log('Raw response text:', text);
                
                try {
                    // Try to parse as JSON
                    const data = JSON.parse(text);
                    console.log('Parsed JSON data:', data);
                    return data;
                } catch (e) {
                    console.error('Failed to parse JSON:', e);
                    console.log('Raw response that failed to parse:', text);
                    throw new Error('Server returned invalid JSON: ' + text.substring(0, 100));
                }
            });
        })
        .then(data => {
            console.log('2FA setup response data:', data);
            
            if (data.status === 'success') {
                console.log('Success! Showing QR code modal...');
                show2FASetupModal(data.qrCodeUrl, data.secret, data.backupCodes);
            } else {
                console.error('Server returned error:', data.message);
                alert('Error: ' + data.message);
            }
        })
        .catch(err => {
            console.error('Error setting up 2FA:', err);
            alert('Error setting up 2FA: ' + err.message);
        })
        .finally(() => {
            // Restore button state
            enableBtn.textContent = originalText;
            enableBtn.disabled = false;
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
            
            // Show success message
            showNotification('Two-factor authentication has been enabled successfully!', 'success');
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

function debug2FASession() {
    fetch('../php/debug_session.php')
        .then(res => res.json())
        .then(data => {
            console.log('Session debug:', data);
            alert('Check console for session debug info');
        })
        .catch(err => {
            console.error('Debug error:', err);
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

function viewLoginActivity() {
    alert('Login activity feature coming soon!');
    // You can implement this later to show admin login history
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
