document.addEventListener('DOMContentLoaded', async() => {

    try {
        const artId = window.location.hash.substring(1);
        
    const API_URL = "https://nodeapi-moneyblog.onrender.com"
    const DeleteAticle = document.getElementById('deletearticle')
  
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
    
    const admintoken = data.data?.admin?._id

   
   const item = await fetch(`${API_URL}/public/special-single/${artId}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
   })

   if(!item.ok) {
    console.log("problem")
   }


   const itemData = await item.json()

   const article = itemData.article

   if(admintoken) {
    const divSin = document.createElement('div')

    divSin.innerHTML = `
    <div style="max-width: 600px; margin: 2rem auto; padding: 1.5rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--light-gray); box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <img 
    src="${article.photo}" 
    alt="article photo" 
    width="100%" 
    style="border-radius: 8px; margin-bottom: 1rem;"
  />

  <h4 
    style="font-size: 1.25rem; font-weight: bold; color: var(--dark-gray); margin-bottom: 1rem; text-align: center;"
  >
    ${article.title}
  </h4>

  <form id="dltForm" style="text-align: center;">
    <button 
      id="dltBtn" 
      type="submit" 
      style="padding: 0.6rem 1.2rem; background: var(--primary-red); color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer;"
    >
      Delete Article
    </button>
  </form>
</div>

    `

    DeleteAticle.append(divSin)


    document.getElementById('dltForm')?.addEventListener('submit', async(e) => {
        e.preventDefault()

        try {
                console.log("here")
          const dltBtn = document.getElementById('dltBtn')

          

          const response = await fetch(`${API_URL}/admin/erase_article/${artId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${admintoken}`
            }
          })


          if(!response.ok) {
            console.log("error")
          }

          const dltData = await response.json()

          alert(dltData.msg)

          window.location.href ="viewarticles.html"
            
        } catch (error) {
            console.log("problem", error.message)
        }

    })
   } else{
            const h3 = document.createElement('h3')
                h3.classList.add('text-center')

                h3.innerText = "You Are Not Authenticated"

                DeleteAticle.append(h3)


        }

    

        
    } catch (error) {
        console.log("failed to load", error.message)
    }


})