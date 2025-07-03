document.addEventListener('DOMContentLoaded', async() => {

    try {

        const API_URL = "https://nodeapi-moneyblog.onrender.com"
        const CreateCategoriesContainer = document.getElementById('create-categories')

        // fetch categories

        const fetchCats = await fetch(`${API_URL}/public/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if(!fetchCats.ok) {
            console.log("Failed to fetch categories")

        }

        const categories = await fetchCats.json()


    //     const categoryHtml = categories?.map(cat => `
            
    //         <li class="list-group-item-action d-flex align-items-center"
    // style="font-size: 1.1rem;">  <a href="singlecategory.html#${cat?._id}"><i class="fas fa-folder me-2 text-primary"></i>${cat.category}</a> </li>
    //         `).join('')


    const categoryHtml = Array.isArray(categories) ? categories.map(cat => `
    <li class="list-group-item-action d-flex align-items-center"
        style="font-size: 1.1rem;">
        <a href="singlecategory.html#${cat?._id}">
            <i class="fas fa-folder me-2 text-primary"></i>${cat.category}
        </a>
    </li>
`).join('') : '';
        


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

    const data = await response.json();
    const admintoken = data.data?.admin?.adminToken;


    if(admintoken) {
        const divForm = document.createElement('div')


        divForm.innerHTML = `
  <form id="categoryForm" class="p-4 shadow rounded bg-white" style="max-width: 500px; margin: auto;">
    <h5 class="mb-3 text-center text-secondary">
      <i class="fas fa-folder-plus me-2 text-primary"></i>
      Create a Category
    </h5>

    <div class="mb-3 position-relative">
      <input
        type="text"
        class="form-control ps-4"
        id="category"
        placeholder="Enter category name"
        required
      >
      <i class="fas fa-tag position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"></i>
    </div>

    <button type="submit" class="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2" id="submitBtn">
      <i class="fas fa-spinner fa-spin loading-spinner d-none" id="loadingIcon"></i>
      <i class="fas fa-plus-circle"></i>
      Create Category
    </button>
  </form>

    <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">

        <div class="card shadow-sm border-0">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0"><i class="fas fa-folder-open me-2"></i>Available Categories</h4>
          </div>
          
          <ul class="list-group list-group-flush">
            ${categoryHtml}
          </ul>
        </div>

      </div>
    </div>
  </div>

`;



         CreateCategoriesContainer.append(divForm)



        //  submit form

      document.getElementById('categoryForm')?.addEventListener('submit', async(e) => {
           e.preventDefault()

           try {
            const category = document.getElementById('category').value 
            const submitBtn = document.getElementById('submitBtn')

            submitBtn.disabled = true

            const responseCat = await fetch(`${API_URL}/admin/create_category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${admintoken}`
                },
                body: JSON.stringify({category})
            })

            if(!responseCat.ok) {
            console.log("There was a problem")
        }

        const data = await responseCat.json()

       
        window.location.reload()

        if(data.msg) {
            alert(data.msg)
            window.location.href = "dashboard.html"
        }
            
           } catch (error) {
            console.log("Error while creating Category", error.message)
           }

      })        



    } else{
 const h2 = document.createElement('h2')
        h2.classList.add("text-center")

        h2.innerHTML = `You Need To Be Logged In!`

        CreateCategoriesContainer.append(h2)


    }



        
    } catch (error) {
        console.log("There was a problem", error.message)
    }


})