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


        const categoryHtml = categories?.map(cat => `
            
            <li class="list-group-item-action d-flex align-items-center"
    style="font-size: 1.1rem;">  <a href="singlecategory.html#${cat._id}"><i class="fas fa-folder me-2 text-primary"></i>${cat.category}</a> </li>
            `).join('')

        


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