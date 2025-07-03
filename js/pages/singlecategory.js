document.addEventListener('DOMContentLoaded', async() => {

    try {
        
            const catId = window.location.hash.substring(1); 
            const API_URL = "https://nodeapi-moneyblog.onrender.com"
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

            <li data-subid="${subbed._id}" id="stylelist"> ${subbed.name}
            
              <button class="btn btn-sm btn-danger delete-sub">Delete</button>

            </li>



            
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
        
        <h3 style="cursor: pointer;"  data-bs-toggle="modal" data-bs-target="#mainCatModal">${category.category} </h3>
        <ul id="uordered">
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


        <!-- Modals -->

        <!-- Main Category Modal -->


          <div class="modal fade" id="mainCatModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Delete Category</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
         <form id="deleteMainCatForm">

            <button class="btn btn-warning" type="submit" id="subDeleteMainCatBtn">
                 Delete Category
            </button>


         </form>
        
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      
      </div>
    </div>
  </div>
</div>


 <!-- End Main Category Modal -->




        `

        ShowCategory.append(divCat)
        
setTimeout(() => {
  const modalTrigger = divCat.querySelector('[data-toggle="modal"]');
  if (modalTrigger) {
    modalTrigger.addEventListener('click', () => {
      $('#mainCatModal').modal('show');
    });
  }
}, 100);




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


        // delete main category

        document.getElementById('deleteMainCatForm')?.addEventListener('submit', async(e) => {

       e.preventDefault()

       try {

        const subDeleteMainCatBtn = document.getElementById('subDeleteMainCatBtn')

        subDeleteMainCatBtn.disabled = true


        const deleteQuery = await fetch(`${API_URL}/admin/erase_category/${catId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${admintoken}`
          }
        })

        if(!deleteQuery.ok) {
          console.log("There was a problem")
        }

        const DeleteResult = await deleteQuery.json()

        alert(DeleteResult.msg)

        window.location.href = "dashboard.html"
        
       } catch (error) {
        console.log('failed to delete', error.message)
       }


        })



        // delete subcategory

        document.querySelectorAll('.delete-sub').forEach(btn => {


          btn.addEventListener('click', async(e) => {
                const li = e.target.closest('li')
    const subId = li.getAttribute('data-subid')

    if (!subId) return alert('No subcategory ID found')

    const confirmDelete = confirm('Are you sure you want to delete this subcategory?')
    if (!confirmDelete) return


    try {

            const res = await fetch(`${API_URL}/admin/erase_subcategory/${catId}/${subId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${admintoken}`
        }
      })

      const data = await res.json()
      alert(data.msg)
      window.location.reload()

      
    } catch (error) {
      console.log("There was a problem while deleting", error.message)
    }


          })

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