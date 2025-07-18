document.addEventListener('DOMContentLoaded', async () => {
  try {
        
    const API_URL = "https://nodeapi-moneyblog.onrender.com"
    
    const navitems = document.getElementById('navitems');

    const key = localStorage.getItem('key')

    const response = await fetch(`${API_URL}/admin/check-session?key=${key}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    
    });

    if (!response.ok) {
      throw new Error("Server responded with an error");
    }

    const data = await response.json();
    
    
    const admintoken = data.data?.admin?._id;

    
    
   async function LogOut() {
        try {

            const adminLogOut = await fetch(`${API_URL}/admin/logout-admin`, {
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
              localStorage.removeItem('key')
                window.location.reload()
            window.location.href = "index.html"
            }


            
        } catch (error) {
            console.log("Failed to logout", error.message)
        }
    }

    
    if (data.msg) {
      const li = document.createElement('li');
      li.classList.add('nav-item');
      
      li.innerHTML = `<a href="login.html" class="nav-link"><i class="fas fa-lock"></i> Login</a>`;
      navitems.appendChild(li);
    } else if(admintoken) {

const dashboardLi = document.createElement('li');
dashboardLi.classList.add('nav-item');



dashboardLi.innerHTML = `
  <a href="dashboard.html" class="nav-link"><i class="fas fa-desktop"></i> Dashboard</a>
`;



const logoutLi = document.createElement('li');
logoutLi.classList.add('nav-item');
logoutLi.innerHTML = `
  <p class="nav-link" id="logoutBtn"><i class="fas fa-lock"></i> Logout</p>
`;

navitems.appendChild(dashboardLi);
navitems.appendChild(logoutLi);


document.getElementById('logoutBtn')?.addEventListener('click', LogOut);


    }

  } catch (error) {
    console.log("There was a problem", error.message);

    
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
