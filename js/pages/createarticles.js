document.addEventListener('DOMContentLoaded', async () => {
  try {
    const API_URL = "https://nodeapi-moneyblog.onrender.com";
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
                        
      
        <div id="editor">

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
          ['link'],
          ['formula'],
          
          // Sixth row - Cleanup
          ['clean']
        ]
      },
      placeholder: 'Write your article content here...',
      readOnly: false
    });



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
        
        const content = quill.root.innerHTML  
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

        alert(data.messg)

       if(data.messg) {

        const moreIdeas = document.getElementById('moreideas')

        try {

          const response = await fetch(`${API_URL}/admin/last-added-article`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${admintoken}`
            }
          })

          if(!response.ok) {
            console.log("There was a problem")
          }

          const data = await response.json()

           const article = data.article[0]


                   moreIdeas.innerHTML = `
            <div class="success-container">
                <div class="success-header">
                    <i class="fas fa-check-circle text-success"></i>
                    <h3>Article Created Successfully!</h3>
                </div>
                
                <div class="article-preview">
                    <div class="preview-header">
                        <h4>Article Preview</h4>
                    </div>
                    
                    <div class="preview-content">
                        <div class="preview-item">
                            <label><i class="fas fa-heading"></i> Title:</label>
                            <p>${article.title || 'No title'}</p>
                        </div>
                        
                        <div class="preview-item">
                            <label><i class="fas fa-align-left"></i> Content:</label>
                            <p class="content-preview">${article.content ? article.content.substring(0, 200) + (article.content.length > 200 ? '...' : '') : 'No content'}</p>
                        </div>
                        
                        
                        <div class="preview-item">
                            <label><i class="fas fa-calendar"></i> Created:</label>
                            <p>${new Date(article.createdAt).toLocaleDateString()}</p>
                        </div>
                        
                        <div class="preview-actions">
                            
                            <a href="updatearticle.html#${article._id}" class="btn btn-secondary" >
                                <i class="fas fa-plus"></i> Add Article Keywords
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

      
        moreIdeas.style.marginTop = '20px';
        moreIdeas.style.padding = '15px';
        moreIdeas.style.backgroundColor = '#f8f9fa';
        moreIdeas.style.borderRadius = '8px';
        moreIdeas.style.border = '1px solid #e9ecef';



           
          
        } catch (error) {
          console.log("failed to get recent added article", error.message)
        }


       }



      } catch (error) {
        
      }



    })

  } catch (error) {
    console.log("There was a problem", error.message);
  }
});
