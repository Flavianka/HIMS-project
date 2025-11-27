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
          <p class="value">0</p>
        </div>

        <div class="card">
          <h3>Total Admins</h3>
          <p class="value">0</p>
        </div>

        <div class="card">
          <h3>Total Inventory</h3>
          <p class="value">0</p>
        </div>

        <div class="card">
          <h3>Sales</h3>
          <p class="value">0</p>
        </div>
      </div>

      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <div class="activity-container">
          <ul class="activity-log">
            <!-- Activities will be loaded here dynamically -->
          </ul>
        </div>
      </div>
    </div>`;
  
  document.getElementById('main-content').innerHTML = content;
  loadDashboardStats();
  loadRecentActivities(); // This will now work properly
  
  // Refresh activities every 30 seconds
  if (window.activityRefreshInterval) {
    clearInterval(window.activityRefreshInterval);
  }
  window.activityRefreshInterval = setInterval(loadRecentActivities, 30000);
}else if(section === 'register-admin'){
    content = `<div class="register-admin-form">
        <h2>Register New Admin</h2>
        <!-- Add enctype="multipart/form-data" to the form -->
        <form id="adminRegistrationForm" method="POST" enctype="multipart/form-data">
        <div class="name-fields">
          <div class="field-group">
          <label for="first-name">First Name</label>
          <input type="text" id="first-name" name="first_name" required>
          </div>
          <div class="field-group">
          <label for="last-name">Last Name</label>
          <input type="text" id="last-name" name="last_name" required>
          </div>
          </div>

          <label for="username">Username</label>
          <input type="text" id="username" name="username" required>

          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>

          <label for="phone">Phone Number</label>
          <input id="phone" type="tel" name="phone" />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" required>

          <label for="confirm_password">Confirm Password</label>
          <input type="password" id="confirm_password" name="confirm_password" required>

          <label for="photo">Profile Photo</label>
          <input type="file" id="photo" name="photo" accept="image/*" required>

          <button type="submit">Register Admin</button>
        </form>
        <div id="admin-registration-message"></div>
      </div>`;
}else if(section === 'view-admins'){
  content = `
    <div class="admin-cards-grid" id="adminCardsContainer">
      <!-- Cards will be dynamically injected here by loadAdminCards() -->
    </div>`;

    document.getElementById('main-content').innerHTML = content;
    loadAdminCards(); // Fetch from DB
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
        <p>Set 2FA, view login history and activity</p>
        <button class="settings-btn" onclick="openSettingsModal('security')">Open</button>
      </div>
    </div>
  </div>`;
}
else {
    content = `<h2>${section.replace('-', ' ')} (Coming soon)</h2>`;
  }



  document.getElementById('main-content').innerHTML = content;

  // edit populaete admin cards if section is view-admins
  if (section === 'view-admins') {
    setTimeout(loadAdminCards, 100); // small delay to ensure content is loaded
    loadAdminCards(); // fetch real admin data and populate cards
  }

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
}

// Load recent activities
function loadRecentActivities() {
    fetch('../php/get_recent_activity.php')
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            if (data.status === 'success') {
                if (data.activities && data.activities.length > 0) {
                    displayRecentActivities(data.activities);
                } else {
                    displayDefaultActivities();
                }
            } else {
                console.error('Error from server:', data.message);
                displayDefaultActivities();
            }
        })
        .catch(err => {
            console.error('Error loading recent activities:', err);
            displayDefaultActivities();
        });
}

// Display activities in the UI
function displayRecentActivities(activities) {
    const activityLog = document.querySelector('.activity-log');
    if (!activityLog) {
        console.warn('Activity log element not found');
        return;
    }

    activityLog.innerHTML = '';

    activities.forEach(activity => {
        const li = document.createElement('li');
        li.className = `activity-item activity-${activity.type || 'default'}`;
        
        li.innerHTML = `
            <span class="activity-description">${activity.description}</span>
            <span class="activity-time">${activity.time_ago}</span>
        `;
        
        activityLog.appendChild(li);
    });
}

// Display default activities if none found
function displayDefaultActivities() {
    const activityLog = document.querySelector('.activity-log');
    if (!activityLog) return;

    activityLog.innerHTML = `
        <li class="activity-item activity-default">
            <span class="activity-description">No recent activity found</span>
            <span class="activity-time">Just now</span>
        </li>
        <li class="activity-item activity-default">
            <span class="activity-description">System is ready for new activities</span>
            <span class="activity-time">Just now</span>
        </li>
    `;
}
// View admins section - open edit modal
function openEditModal(adminId) {
  console.log('Opening edit modal for admin ID:', adminId);
  
  fetch(`../php/get_admin_by_id.php?id=${adminId}`)
    .then(res => {
      // First check if response is OK
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(data => {
      console.log('Admin data received:', data);
      
      if (data.error) {
        alert('Error: ' + data.error);
        return;
      }

      // Populate the form fields
      document.getElementById('editAdminId').value = data.id;
      document.getElementById('editFirstName').value = data.first_name;
      document.getElementById('editLastName').value = data.last_name;
      document.getElementById('editEmail').value = data.email;
      document.getElementById('editPhone').value = data.phone;

      // Show the modal
      document.getElementById('editAdminModal').classList.remove('hidden');
    })
    .catch(err => {
      console.error('Error fetching admin details:', err);
      alert('Error loading admin details. Please check the console for more information.');
    });
}
function closeEditModal() {
  document.getElementById('editAdminModal').classList.add('hidden');
}

// Close modal when clicking outside
document.getElementById('editAdminModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeEditModal();
  }
});

// Close modal with escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && !document.getElementById('editAdminModal').classList.contains('hidden')) {
    closeEditModal();
  }
});

//Handle edit form submission
document.getElementById('editAdminForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  formData.append('id', document.getElementById('editAdminId').value);

  fetch('../php/update_admin.php', {
    method: 'POST',
    body: formData
  })
    .then(res => res.text())
    .then(response => {
      alert(response);
      closeEditModal();
      loadAdminCards(); // Reload the updated list
    })
    .catch(err => console.error('Error updating admin:', err));
});

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
  const username = "Flavian"; // For now, hardcoded

  let timeOfDay = "Good evening";
  if (hours < 12) timeOfDay = "Good morning";
  else if (hours < 18) timeOfDay = "Good afternoon";

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString(undefined, options);
  const formattedTime = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  greetingDiv.innerHTML = `
  <img src="../assets/icons/waving-hand-emoji.png" alt="Waving Hand Emoji" style="height: 34px; vertical-align: middle; margin-right: 8px;" />
  ${timeOfDay} ${username}, it's ${formattedDate} at ${formattedTime}`;
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
 
// Handle admin registration form submission
// Handle admin registration form submission
document.addEventListener('submit', function(e) {
  if (e.target && e.target.id === 'adminRegistrationForm') {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const messageDiv = document.getElementById('admin-registration-message');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Registering...';
    
    fetch('../php/register_admin.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        messageDiv.style.color = 'green';
        messageDiv.textContent = data.message;
        e.target.reset(); // Clear the form
      } else {
        messageDiv.style.color = 'red';
        messageDiv.textContent = data.message;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      messageDiv.style.color = 'red';
      messageDiv.textContent = 'An error occurred during registration';
    })
    .finally(() => {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = 'Register Admin';
    });
  }
});


// View admin information
function loadAdminCards() {
  fetch('../php/get_admins.php')
    .then(res => res.json())
    .then(admins => {
      const container = document.getElementById('adminCardsContainer'); // Fixed ID
      if (!container) {
        console.error('Admin cards container not found');
        return;
      }
      
      container.innerHTML = '';

      if (!admins || admins.length === 0) {
        container.innerHTML = '<p>No admins found.</p>';
        return;
      }

      admins.forEach(admin => {
        const card = document.createElement('div');
        card.classList.add('admin-card');

        card.innerHTML = `
        <img src="../uploads/${admin.photo}" alt="Admin Photo" class="admin-photo">
        <div class="admin-info">
          <p class="admin-name">${admin.first_name} ${admin.last_name} (${admin.username})</p>
          <p class="admin-email">${admin.email}</p>
          <p class="admin-role">System Admin</p>
          <div class="admin-actions">
            <button class="edit-btn" data-id="${admin.id}">Edit</button>
            <button class="delete-btn" data-id="${admin.id}">Delete</button>
          </div>
        </div>
       `;

        // Add event listeners
        card.querySelector('.edit-btn').addEventListener('click', () => {
          openEditModal(admin.id); // Pass only the ID
        });

        card.querySelector('.delete-btn').addEventListener('click', () => {
          deleteAdmin(admin.id);
        });

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Error loading admins:', err);
      const container = document.getElementById('adminCardsContainer'); // Fixed ID
      if (container) {
        container.innerHTML = '<p>Error loading admins.</p>';
      }
    });
}

// Delete admin
function deleteAdmin(adminId) {
  if (!confirm("Are you sure you want to delete this admin?")) return;

  fetch(`../php/delete_admin.php?id=${adminId}`, { method: 'GET' })
    .then(res => res.text())
    .then(response => {
      alert(response);
      loadAdminCards(); // Reload the admin cards
    })
    .catch(err => console.error('Error deleting admin:', err));
}



// Update admin information
document.getElementById('editAdminForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("id", document.getElementById('editAdminId').value);
  formData.append("first_name", document.getElementById('editFirstName').value);
  formData.append("last_name", document.getElementById('editLastName').value);
  formData.append("email", document.getElementById('editEmail').value);
  formData.append("phone", document.getElementById('editPhone').value);

  fetch('../php/update_admin.php', {
    method: 'POST',
    body: formData
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.text();
  })
  .then(response => {
    alert(response);
    closeEditModal();
    loadAdminCards(); // Reload the admin cards
  })
  .catch(err => {
    console.error('Error updating admin:', err);
    alert('Error updating admin. Please check the console for details.');
  });
});

// Handle Account Settings Form Submission
document.addEventListener('submit', function (e) {
  if (e.target && e.target.id === 'accountSettingsForm') {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    fetch('../php/update_account_settings.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.text())
    .then(response => {
      document.getElementById('settings-message').textContent = response;
      form.reset();
    })
    .catch(err => {
      document.getElementById('settings-message').textContent = "Error updating settings.";
      console.error(err);
    });
  }
});

// Load super admin info ("username to be specific") on page load
function loadSuperAdminInfo() {
  fetch('../php/get_superadmin_info.php')
    .then(res => res.json())
    .then(data => {
      const usernameSpan = document.getElementById('superadmin-username');
      if (usernameSpan) {
        usernameSpan.textContent = data.username;
      }
    })
    .catch(err => {
      console.error('Failed to load super admin info:', err);
    });
}

window.addEventListener('DOMContentLoaded', loadSuperAdminInfo);



// Load dashboard stats with error handling
function loadDashboardStats() {
    fetch('../php/get_dashboard_stats.php')
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            if (data.status === 'error') {
                console.error('Error loading stats:', data.message);
                showDefaultValues();
                return;
            }

            // Update the card values
            const cards = document.querySelectorAll('.summary-cards .card .value');
            if (cards.length >= 4) {
                cards[0].textContent = data.total_users.toLocaleString();
                cards[1].textContent = data.total_admins.toLocaleString();
                cards[2].textContent = data.total_inventory.toLocaleString();
                cards[3].textContent = data.new_orders.toLocaleString();
            }
        })
        .catch(err => {
            console.error("Failed to load dashboard stats:", err);
            showDefaultValues();
        });
}