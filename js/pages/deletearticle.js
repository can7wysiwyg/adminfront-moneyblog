document.addEventListener('DOMContentLoaded', async() => {

    try {
        const artId = window.location.hash.substring(1);
        console.log(artId)
    const API_URL = "http://localhost:5000"
    const DeleteAticle = document.getElementById('deletearticle')
  
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

   console.log(admintoken)

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
    <div>
            <img src="${article.photo}" width="100%" alt="article photo" style="border-radius: 4px; margin-bottom: 1rem;" />
        <h4 style="font-size: 1rem; color">${article.title}</h4>
        <button id"dltBtn" type="submit">delete article </button>


    </div>
    
    `

    DeleteAticle.append(divSin)


    document.getElementById('dltBtn')?.addEventListener('submit', async(e) => {
        e.preventDefault()

        try {

          const dltBtn = document.getElementById('dltBtn')

          dltBtn.disabled = true


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