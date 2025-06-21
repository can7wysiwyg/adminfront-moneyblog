document.addEventListener('DOMContentLoaded', async () => {
  try {
    const API_URL = "http://localhost:5000";
    const CreateArticlesContainer = document.getElementById('create-articles');

    // Fetch categories
    const fetchCats = await fetch(`${API_URL}/public/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!fetchCats.ok) {
      console.log("Failed to fetch categories");
      return;
    }

    const categories = await fetchCats.json(); // contains subCategory

    // Get user session
    const response = await fetch(`${API_URL}/admin/check-session`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error("Session fetch failed");

    const data = await response.json();
    const admintoken = data.data?.admin?.adminToken;

    if (!admintoken) {
      const h4 = document.createElement('h4');
      h4.classList.add('text-center');
      h4.innerText = "You Are Not Authenticated";
      CreateArticlesContainer.append(h4);
      return;
    }

    // Create the form with category and subcategory selects
    const divForm = document.createElement('div');

    divForm.innerHTML = `
        <div class="form-container">
        <div class="form-header">
            <i class="fas fa-pen-fancy"></i>
            <h2>Create New Article</h2>
        </div>
                <div class="form-body">


      <form id="createArticleForm" enctype="multipart/form-data">
                      <div class="form-group">
                    <label class="form-label required-field" for="title">
                        <i class="fas fa-heading"></i>Article Title
                    </label>

        <input type="text" id="title" placeholder="Article Title" class="form-control mb-2"  required />

        </div>
                           <div class="form-group">
                    <label class="form-label required-field" for="content">
                        <i class="fas fa-align-left"></i>Article Content
                    </label>

        <textarea id="content" rows="5" cols="50" class="form-control mb-2" placeholder="Article content..." required>
        
        
        </textarea>
        </div>

                        <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required-field" for="categorySelect">
                            <i class="fas fa-folder"></i>Category
                        </label>

 <select id="categorySelect" class="form-select mb-2" >
          <option value="">-- Select Category --</option>
          ${categories?.map(cat => `<option  value="${cat._id}">${cat.category}</option>`).join('')}
        </select>
        </div>
                                                <div class="form-group">
                        <label class="form-label" for="subCategorySelect">
                            <i class="fas fa-folder-open"></i>Subcategory
                        </label>

        <select id="subCategorySelect" class="form-select mb-2" style="display:none;">
          <option value="">-- Select Subcategory --</option>
        </select>

        </div>

                        <div class="form-group">
                    <label class="form-label required-field">
                        <i class="fas fa-image"></i>Featured Image
                    </label>
                    <div class="file-upload-wrapper">
                        <input type="file" 
                               id="photo" 
                               class="file-upload-input" 
                               accept=".png,.jpg,.jpeg,.webp" 
                               required />
                        <label for="photo" class="file-upload-label" id="fileLabel">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Click to upload image or drag and drop</span>
                        </label>
                    </div>
                </div>

                <button type="submit" class="btn btn-create" id="sbtBtn">
                    <i class="fas fa-spinner fa-spin loading-spinner"></i>
                    <i class="fas fa-plus-circle"></i>
                    Create Article
                </button>

                
      </form>
      </div>

      </div>

      <div id="moreideas">


      </div>
    `;

    CreateArticlesContainer.append(divForm);

    // Dynamic subcategory logic
    const categorySelect = document.getElementById('categorySelect');
    const subCategorySelect = document.getElementById('subCategorySelect');

    categorySelect.addEventListener('change', () => {
      const selectedId = categorySelect.value;
      const selectedCategory = categories.find(cat => cat._id === selectedId);

      subCategorySelect.innerHTML = `<option value="">-- Select Subcategory --</option>`;

      if (selectedCategory && selectedCategory.subCategory?.length > 0) {
        selectedCategory.subCategory.forEach(sub => {
          const option = document.createElement('option');
          option.value = sub._id;
          option.textContent = sub.name;
          subCategorySelect.appendChild(option);
        });

        subCategorySelect.style.display = 'block';
      } else {
        subCategorySelect.style.display = 'none';
      }
    });



    document.getElementById('createArticleForm')?.addEventListener('submit', async(e) => {
      e.preventDefault()

      try {

        const title = document.getElementById('title').value
        const content = document.getElementById('content').value
        const catId = document.getElementById('categorySelect').value
        const subCatId = document.getElementById('subCategorySelect').value
        const input = document.getElementById('photo')
        const photo = input.files[0]
       
        const sbtBtn = document.getElementById('sbtBtn')

        sbtBtn.disabled = true


        const formData = new FormData()

        formData.append('title', title)
        formData.append('content', content)
        formData.append('catId', catId)
         formData.append('subCatId', subCatId)
         formData.append('photo', photo)



        const response = await fetch(`${API_URL}/admin/create-article`, {
            method: 'POST',
            headers: {
            
            'Authorization': `Bearer ${admintoken}`
            },
            body: formData
        })

        if(!response.ok) {
            console.log("There was a problem")
        }

        const data = await response.json()

        alert(data.msg)




      } catch (error) {
        
      }



    })

  } catch (error) {
    console.log("There was a problem", error.message);
  }
});
