// Auto-fill from cookie
window.addEventListener('DOMContentLoaded', () => {
  const remembered = getCookie("remember_me");
  if (remembered) {
    document.querySelectorAll('input[type="text"]').forEach(el => {
      el.value = remembered;
    });
  }
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function switchTab(type) {
  const userTab = document.getElementById("userTab");
  const adminTab = document.getElementById("adminTab");
  const userForm = document.getElementById("userForm");
  const adminForm = document.getElementById("adminForm");
  
  if (type === 'user') {
    userTab.classList.add('active');
    adminTab.classList.remove('active');
    userForm.style.display = 'flex';
    adminForm.style.display = 'none';
  } else {
    adminTab.classList.add('active');
    userTab.classList.remove('active');
    adminForm.style.display = 'flex';
    userForm.style.display = 'none';
  }
}

// Handle form submissions
// Handle form submissions - UPDATED FOR 2FA
document.querySelectorAll(".login-form").forEach(form => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isUserForm = form.id === "userForm";
    const formData = new FormData(this);
    
    // Add role to form data
    formData.append('role', isUserForm ? 'user' : 'admin');

    fetch("php/login.php", {
      method: "POST",
      body: formData
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(data => {
      if (data.success) {
        // CHECK IF 2FA IS REQUIRED
        if (data.requires_2fa) {
          show2FAPrompt();
        } else {
          // Set remember me cookie if checked
          const rememberCheckbox = form.querySelector('input[type="checkbox"]');
          if (rememberCheckbox && rememberCheckbox.checked) {
            const username = form.querySelector('input[name="username"]').value;
            setCookie("remember_me", username, 30);
          }
          
          window.location.href = data.redirect;
        }
      } else {
        alert(data.message || "Login failed");
      }
    })
    .catch(err => {
      console.error("Login failed:", err);
      alert("Login failed. Please try again.");
    });
  });
});

// Show 2FA prompt
function show2FAPrompt() {
    // Create a modal for 2FA input instead of using prompt()
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 400px; text-align: center;">
            <h2 style="margin-bottom: 1rem; color: #333;">Two-Factor Authentication Required</h2>
            <p style="margin-bottom: 1.5rem; color: #666;">
                Please enter the 6-digit code from your authenticator app to continue.
            </p>
            <input type="text" 
                   id="2fa-code-input" 
                   maxlength="6" 
                   placeholder="000000" 
                   style="width: 150px; 
                          padding: 12px; 
                          font-size: 1.2rem; 
                          text-align: center; 
                          letter-spacing: 0.3rem;
                          border: 2px solid #00796b;
                          border-radius: 4px;
                          margin-bottom: 1.5rem;" 
                   autocomplete="one-time-code">
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="verify2FALogin()" 
                        style="padding: 10px 20px; 
                               background: #00796b; 
                               color: white; 
                               border: none; 
                               border-radius: 4px; 
                               cursor: pointer;">
                    Verify
                </button>
                <button onclick="close2FAModal()" 
                        style="padding: 10px 20px; 
                               background: #6c757d; 
                               color: white; 
                               border: none; 
                               border-radius: 4px; 
                               cursor: pointer;">
                    Cancel
                </button>
            </div>
            <p style="margin-top: 1rem; font-size: 0.9rem; color: #888;">
                Can't access your authenticator? Use a backup code instead.
            </p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus on input and add auto-submit
    const input = document.getElementById('2fa-code-input');
    input.focus();
    
    input.addEventListener('input', function(e) {
        if (this.value.length === 6) {
            verify2FALogin();
        }
    });
    
    // Store modal reference for cleanup
    window.twoFAModal = modal;
}

function close2FAModal() {
    if (window.twoFAModal) {
        window.twoFAModal.remove();
        window.twoFAModal = null;
    }
}

function verify2FALogin() {
    const codeInput = document.getElementById('2fa-code-input');
    const code = codeInput.value.trim();
    
    if (!code) {
        alert('Please enter a 6-digit code');
        codeInput.focus();
        return;
    }
    
    if (code.length !== 6) {
        alert('Please enter a valid 6-digit code');
        codeInput.focus();
        return;
    }
    
    // Show loading state - FIXED: Better way to find the verify button
    const verifyBtn = document.querySelector('button[onclick="verify2FALogin()"]');
    const originalText = verifyBtn.textContent;
    verifyBtn.textContent = 'Verifying...';
    verifyBtn.disabled = true;
    
    // Verify 2FA code
    fetch('php/verify_2fa_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        if (data.status === 'success') {
            close2FAModal();
            window.location.href = data.redirect;
        } else {
            alert('Error: ' + data.message);
            codeInput.value = '';
            codeInput.focus();
        }
    })
    .catch(err => {
        console.error('2FA verification failed:', err);
        alert('2FA verification failed. Please try again.');
    })
    .finally(() => {
        // Restore button state
        if (verifyBtn) {
            verifyBtn.textContent = originalText;
            verifyBtn.disabled = false;
        }
    });
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}