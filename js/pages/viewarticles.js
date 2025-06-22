document.addEventListener('DOMContentLoaded', async() => {

try {

    const API_URL = "http://localhost:5000"
        const ViewArticles = document.getElementById('view-articles')

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

    const articlesFetch = await fetch(`${API_URL}/admin/added-article`, {
        method: 'GET',
        headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${admintoken}`
        }
    })

    if(!articlesFetch.ok) {
        console.log("There was a problem")
    }


    const articlesData = await articlesFetch.json()

    const articles = articlesData.articles
const paginationControls = document.getElementById('paginationControls');

const articlesPerPage = 12;
let currentPage = 1;
const totalPages = Math.ceil(articles.length / articlesPerPage);


    if(admintoken) {

        function renderPage(pageNumber) {
  ViewArticles.innerHTML = ''; // Clear current content

  const start = (pageNumber - 1) * articlesPerPage;
  const end = start + articlesPerPage;
  const pageArticles = articles.slice(start, end);

  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.flexWrap = 'wrap';
  row.style.gap = '1rem';

  pageArticles.forEach(article => {
    const divArt = document.createElement('div');
    divArt.style.flex = '0 0 calc(25% - 1rem)';
    divArt.style.boxSizing = 'border-box';

    const modalId = `takeActionModal-${article._id}`;

    divArt.innerHTML = `
      <div style="border: 1px solid var(--border-color); padding: 1rem; border-radius: 8px; background: var(--light-gray);">
        <img src="${article.photo}" width="100%" alt="article photo" style="border-radius: 4px; margin-bottom: 1rem;" />
        <h4 style="font-size: 1rem; color: var(--dark-gray);">${article.title}</h4>
        <button 
          data-bs-toggle="modal" 
          data-bs-target="#${modalId}" 
          style="padding: 0.5rem; background: var(--primary-red); color: white; border: none; border-radius: 4px; width: 100%;">
          Take Action
        </button>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="${modalId}" tabindex="-1" role="dialog" aria-labelledby="updatePhotoModalLabel-${article._id}" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="updatePhotoModalLabel-${article._id}">Take Action</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <ul style="list-style: none; padding: 0;">
                <li><a href="updatearticle.html#${article._id}">Update Article</a></li>
                <li><a href="deletearticle.html#${article._id}">Delete Article</a></li>
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                <i class="fas fa-times"></i> Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    row.appendChild(divArt);

    setTimeout(() => {
  const modalTrigger = divArt.querySelector('[data-toggle="modal"]');
  if (modalTrigger) {
    modalTrigger.addEventListener('click', () => {
      $('#takeActionModal').modal('show');
    });
  }
}, 100);
  });

  ViewArticles.appendChild(row);
  renderPaginationControls();
}

function renderPaginationControls() {
  paginationControls.innerHTML = ''; // Clear old buttons

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Previous';
  prevBtn.disabled = currentPage === 1;
  prevBtn.style.marginRight = '10px';
  prevBtn.onclick = () => {
    currentPage--;
    renderPage(currentPage);
  };

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    currentPage++;
    renderPage(currentPage);
  };

  paginationControls.appendChild(prevBtn);
  paginationControls.appendChild(document.createTextNode(` Page ${currentPage} of ${totalPages} `));
  paginationControls.appendChild(nextBtn);
}

// Initial render
renderPage(currentPage);


        
               


    

    } else{
        const h3 = document.createElement('h3')
                h3.classList.add('text-center')

                h3.innerText = "You Are Not Authenticated"

                ViewArticles.append(h3)


    }

    
} catch (error) {
    console.log("there was an error", error.message)
}


})