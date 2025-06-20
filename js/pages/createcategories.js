document.addEventListener('DOMContentLoaded', async() => {

    try {

        const API_URL = "http://localhost:5000"
        const CreateCategoriesContainer = document.getElementById('create-categories')

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
`;

         CreateCategoriesContainer.append(divForm)



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