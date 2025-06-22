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

    if(admintoken) {

        articles.forEach(article => {
               const divArt = document.createElement('div')

               
                 const modalId = `takeActionModal-${article._id}`;

  divArt.innerHTML = `
    <div>
      <img src="${article.photo}" width="50%" alt="article photo" />
      <div>
        <h3>${article.title}</h3>
      </div>

      <div>
        <button 
          data-bs-toggle="modal" 
          data-bs-target="#${modalId}" 
          style="padding: 0.5rem 1rem; background: var(--primary-red); color: white; border: none; border-radius: 4px;">
          Press button to take action
        </button>
      </div>
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
  `



               ViewArticles.append(divArt)

               setTimeout(() => {
  const modalTrigger = divArt.querySelector('[data-toggle="modal"]');
  if (modalTrigger) {
    modalTrigger.addEventListener('click', () => {
      $('#takeActionModal').modal('show');
    });
  }
}, 100);


        })

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