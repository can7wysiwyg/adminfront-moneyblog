document.addEventListener('DOMContentLoaded', async() => {

try {
    const artId = window.location.hash.substring(1);
    const API_URL = "http://localhost:5000"
    const UpdateAticle = document.getElementById('update-article')
  
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

    const fetchArticle = await fetch(`${API_URL}/public/special-single/${artId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if(!fetchArticle.ok) {
        console.log("There was a problem")
    }

    const article = await fetchArticle.json()


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
  




        if(admintoken) {
            

            const divForma =  document.createElement('div')

           divForma.innerHTML = `
    <div class="update-form-container">
        <!-- Header Section -->
        <div class="form-header">
            <i class="fas fa-edit"></i>
            <h2>Update Article</h2>
        </div>

        <!-- Photo Update Section -->
        <div class="photo-update-section">
            <div class="current-photo-preview">
                <img src="${article.article.photo}" alt="Current article image" class="current-image" />
            </div>
            <button type="button" class="btn btn-photo-update" data-bs-toggle="modal" data-bs-target="#updatePhotoModal">
                <i class="fas fa-camera"></i>
                Update Photo
            </button>
        </div>

        <!-- Main Update Form -->
        <form id="updateForm" class="update-form">
            <!-- Title Section -->
            <div class="form-group">
                <label class="form-label required-field" for="title">
                    <i class="fas fa-heading"></i>Article Title
                </label>
                <input type="text" 
                       id="title" 
                       class="form-control" 
                       value="${article.article.title}" 
                       placeholder="Enter article title" 
                       required />
            </div>

            <!-- Category Section -->
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label required-field" for="categorySelect">
                        <i class="fas fa-folder"></i>Category
                    </label>
                    <select id="categorySelect" class="form-select">
                        <option value="${article.article.catId._id}">${article.article.catId.category} (Current)</option>
                        ${categories?.map(cat => `<option value="${cat._id}">${cat.category}</option>`).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label" for="subCategorySelect">
                        <i class="fas fa-folder-open"></i>Subcategory
                    </label>
                    <select id="subCategorySelect" class="form-select" style="display:none;">
                        <option value="${article.article.subCatId}">-- Select Subcategory --</option>
                    </select>
                </div>
            </div>

            <!-- Keywords Section -->
            <div class="form-group">
                <label class="form-label">
                    <i class="fas fa-tags"></i>Article Keywords (5 required)
                </label>
                <div class="keywords-grid">
                    <input type="text" 
                           class="form-control keyword-input" 
                           id="keyword1" 
                           value="${article.article.articleKeywords[0] || ''}" 
                           placeholder="Keyword 1" 
                           required>
                    <input type="text" 
                           class="form-control keyword-input" 
                           id="keyword2" 
                           value="${article.article.articleKeywords[1] || ''}" 
                           placeholder="Keyword 2" 
                           required>
                    <input type="text" 
                           class="form-control keyword-input" 
                           id="keyword3" 
                           value="${article.article.articleKeywords[2] || ''}" 
                           placeholder="Keyword 3" 
                           required>
                    <input type="text" 
                           class="form-control keyword-input" 
                           id="keyword4" 
                           value="${article.article.articleKeywords[3] || ''}" 
                           placeholder="Keyword 4" 
                           required>
                    <input type="text" 
                           class="form-control keyword-input" 
                           id="keyword5" 
                           value="${article.article.articleKeywords[4] || ''}" 
                           placeholder="Keyword 5" 
                           required>
                </div>
            </div>

            <!-- Content Editor Section -->
            <div class="form-group">
                <label class="form-label required-field">
                    <i class="fas fa-align-left"></i>Article Content
                </label>
                <div id="editor">${article.article.content}</div>
            </div>

            <!-- Submit Button -->
            <div class="form-actions">
                <button type="submit" class="btn btn-update" id="updBtn">
                    <i class="fas fa-spinner fa-spin loading-spinner" style="display: none;"></i>
                    <i class="fas fa-save"></i>
                    Update Article
                </button>
            </div>
        </form>
    </div>

    <!-- Photo Update Modal -->
    <div class="modal fade" id="updatePhotoModal" tabindex="-1" role="dialog" aria-labelledby="updatePhotoModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="updatePhotoModalLabel">
                        <i class="fas fa-camera"></i>
                        Update Article Photo
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <div class="modal-body">
                    <!-- Current Photo Display -->
                    <div class="current-photo-section">
                        <h6 class="mb-3">
                            <i class="fas fa-image"></i>
                            Current Photo
                        </h6>
                        <div class="current-photo-container">
                            <img src="${article.article.photo}" alt="Current article image" class="modal-current-image" />
                        </div>
                    </div>

                    <!-- Photo Upload Form -->
                    <form id="UpdatePhoto" enctype="multipart/form-data" class="photo-update-form">
                        <div class="form-group">
                            <label class="form-label required-field">
                                <i class="fas fa-upload"></i>
                                Select New Photo
                            </label>
                            <div class="file-upload-wrapper">
                                <input type="file" 
                                       id="photo" 
                                       class="file-upload-input" 
                                       accept=".png,.jpg,.jpeg,.webp" 
                                       required />
                                <label for="photo" class="file-upload-label">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <span>Click to upload new image</span>
                                </label>
                            </div>
                        </div>

                        <div class="modal-form-actions">
                            <button type="submit" class="btn btn-update-photo" id="photoBtn">
                                <i class="fas fa-spinner fa-spin loading-spinner" style="display: none;"></i>
                                <i class="fas fa-camera"></i>
                                Update Photo
                            </button>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times"></i>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>


`; 
            
            

            UpdateAticle.append(divForma)




            const quill = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: [
          // First row - Text formatting
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          
          // Second row - Text styling
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          
          // Third row - Text alignment and direction
          [{ 'align': [] }],
          [{ 'direction': 'rtl' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          
          // Fourth row - Lists and blocks
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['blockquote', 'code-block'],
          
          // Fifth row - Media and links
          ['link', 'image', 'video'],
          ['formula'],
          
          // Sixth row - Cleanup
          ['clean']
        ]
      },
      placeholder: 'Write your article content here...',
      readOnly: false
    });



    setTimeout(() => {
  const modalTrigger = divForma.querySelector('[data-toggle="modal"]');
  if (modalTrigger) {
    modalTrigger.addEventListener('click', () => {
      $('#updatePhotoModal').modal('show');
    });
  }
}, 100);




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



    document.getElementById('UpdatePhoto')?.addEventListener('submit', async(e) => {

e.preventDefault()

try {
     const input = document.getElementById('photo')
        const photo = input.files[0]
       
        const photoBtn = document.getElementById('photoBtn')

        photoBtn.disabled = true

        const formData = new FormData()

        formData.append('photo', photo)

        const response = await fetch(`${API_URL}/admin/update-photo/${artId}`, {
            method: 'PUT',
            headers: {
            
            'Authorization': `Bearer ${admintoken}`
            },
            body: formData


        })

        if(!response.ok) {
            console.log("failed to update photo")
        }

        const data = await response.json()

        alert(data.msg)
        window.location.reload()

    
} catch (error) {
    console.log("Failed To Update Photo", error.message)
}


    })



    document.getElementById('updateForm')?.addEventListener('submit', async(e) => {
    e.preventDefault()

    try {
    const articleKeywords = [
  document.getElementById('keyword1').value.trim(),
  document.getElementById('keyword2').value.trim(),
  document.getElementById('keyword3').value.trim(),
  document.getElementById('keyword4').value.trim(),
  document.getElementById('keyword5').value.trim()
].filter(Boolean); 

      const title = document.getElementById('title').value
        
        const content = quill.root.innerHTML  
        const catId = document.getElementById('categorySelect').value
        const subCatId = document.getElementById('subCategorySelect').value


        const response = await fetch(`${API_URL}/admin/update-article/${artId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',

                'Authorization': `Bearer ${admintoken}`
            },
            body: JSON.stringify({title, content, catId, subCatId, articleKeywords})
        })


        const data = await response.json()

        alert(data.msg)
        window.location.reload()



        
    } catch (error) {
        console.log("there was a problem", error.message)
    }


}

    )








        } else{
            const h3 = document.createElement('h3')
                h3.classList.add('text-center')

                h3.innerText = "You Are Not Authenticated"

                UpdateAticle.append(h3)


        }

    
} catch (error) {
    console.log("There was a problem", error.message)
}

})