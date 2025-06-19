document.addEventListener('DOMContentLoaded', async () => {
  try {
    const API_URL = "http://localhost:5000";
    const navitems = document.getElementById('navitems');

    const response = await fetch(`${API_URL}/admin/check-session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error("Server responded with an error");
    }

    const data = await response.json();
    const admintoken = data.data?.admin?.adminToken;
    const id = data.data?.admin?._id;

   async function LogOut() {
        try {

            const adminLogOut = await fetch(`${API_URL}/admin/logout-admin/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${admintoken}`
                }
            })

            if(!adminLogOut.ok) {
                console.log("There was a problem")
            }

            const data = await adminLogOut.json()

            if(data.msg) {
                window.location.reload()
            window.location.href = "/"
            }


            
        } catch (error) {
            console.log("Failed to logout", error.message)
        }
    }

    console.log(data)

    if (!data || !admintoken) {
      const li = document.createElement('li');
      li.classList.add('nav-item');
      li.onclick = () => {
        window.location.href = `login.html`;
      };
      li.innerHTML = `<p class="nav-link"><i class="fas fa-lock"></i> Login</p>`;
      navitems.appendChild(li);
    } else {
      const li = document.createElement('li');
      li.classList.add('nav-item');
    

      li.innerHTML = `
        <p class="nav-link"><i class="fas fa-desktop"></i> Dashboard</p>
        <p class="nav-link" id="logoutBtn"><i class="fas fa-lock"></i> Logout</p>
      `;
      navitems.appendChild(li);

      const logoutEl = document.getElementById('logoutBtn');
if (logoutEl) {
  logoutEl.addEventListener('click', LogOut);
}
    }

  } catch (error) {
    console.log("There was a problem", error.message);

    // Show a visible message on the page
    const connectionMessage = document.createElement('div');
    connectionMessage.style.background = '#f8d7da';
    connectionMessage.style.color = '#721c24';
    connectionMessage.style.padding = '10px';
    connectionMessage.style.margin = '10px';
    connectionMessage.style.border = '1px solid #f5c6cb';
    connectionMessage.style.borderRadius = '5px';
    connectionMessage.innerHTML = `
      <strong><i class="fas fa-exclamation-triangle"></i> No connection:</strong> Unable to connect to the server.
    `;

    document.body.prepend(connectionMessage);
  }
});
