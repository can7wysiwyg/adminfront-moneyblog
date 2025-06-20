document.addEventListener('DOMContentLoaded', async() => {

    try {
        
            const catId = window.location.hash.substring(1); 
            const API_URL = "http://localhost:5000"
            const ShowCategory = document.getElementById('show-category')

            if(!catId) {
                const h3 = document.createElement('h3')
                h3.classList.add('text-center')

                h3.innerText = "Id is missing"

                ShowCategory.append(h3)
                
            }


            // fetch categories

        const fetchCat = await fetch(`${API_URL}/public/category/${catId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if(!fetchCat.ok) {
            console.log("Failed to fetch category")

        }

        const data = await fetchCat.json()

        const category = data.category

        const subHtml = category?.subCategory.map(subbed => `

            <li> ${subbed.name} </li>
            
            `)

    

        // get user

        const response = await fetch(`${API_URL}/admin/check-session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error("Server responded with an error");
    }

    const userData = await response.json();
    const admintoken = userData.data?.admin?.adminToken;

    if(admintoken) {

        const divCat = document.createElement('div')

        divCat.innerHTML = `
        
        <h3>${category.category} </h3>
        <ul>
           ${subHtml}
        </ul>

        <div class="container">

        <form id="subCatForm">

        <div>

        <input type="text" id="subcat" placeholder="create subcategory" required/>

        </div>

        <button type="submit" id="subtBtn">
        Create SubCategory

        </button>

        </form>


        </div>
        `

        ShowCategory.append(divCat)


        document.getElementById('subCatForm')?.addEventListener('submit', async(e) => {


            try {
                const name = document.getElementById('subcat').value 
                const subtBtn = document.getElementById('subtBtn')

                subtBtn.disabled = true

                const CreatingSub = await fetch(`${API_URL}/admin/create_subcategory/${catId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    'Authorization': `Bearer ${admintoken}`
                    },
                    body: JSON.stringify({name})
                })


                if(!CreatingSub.ok) {
                    console.log("Server Error")
                }

                const msg = await CreatingSub.json()

                if(msg.msg) {
                    alert(msg.msg)
                    window.location.reload()
                }




                
            } catch (error) {
                console.log("failed to submit", error.message)
            }



        })



        

    } else{

        const h3 = document.createElement('h3')
                h3.classList.add('text-center')

                h3.innerText = "You Are Not Authenticated"

                ShowCategory.append(h3)
                

    }


    

        
    } catch (error) {
        console.log("There was a problem", error.message)
    }


})