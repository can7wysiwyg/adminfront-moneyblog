document.addEventListener('DOMContentLoaded', async() => {


    try {

        const API_URL = "http://localhost:5000"
        const dashboardMain = document.getElementById('dashboard-main')

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
        const createCategories = document.createElement('div')
        const createArticles = document.createElement('div')
        const viewArticles = document.createElement('div')
        const viewCategories = document.createElement('div')
        const manageSpellingBee = document.createElement('div')
        
          createCategories.className = "col-md-6 mb-4";
  createArticles.className = "col-md-6 mb-4";
  viewArticles.className = "col-md-6 mb-4";
  viewCategories.className = "col-md-6 mb-4";
  manageSpellingBee.className = "col-md-6 mb-4";

//   links

createCategories.onclick = () => {
    window.location.href = `createcategories.html`
}

viewCategories.onclick = () => {
  window.location.href = "viewcategories.html"
}


createArticles.onclick = () => {

  window.location.href = "createarticles.html"

}


viewArticles.onclick = () => {
  window.location.href = "viewarticles.html"
}


        createCategories.innerHTML = `
            <div class="card shadow-sm" style="cursor: pointer">
      <div class="card-body">
        <h5 class="card-title"><i class="fas fa-folder-plus me-2 text-primary"></i> Create Categories and Sub-Categories</h5>
        <p class="card-text">Add new article categories to organize content.</p>
      </div>
    </div>

        `


        createArticles.innerHTML = `
            <div class="card shadow-sm" style="cursor: pointer">
      <div class="card-body">
        <h5 class="card-title"><i class="fas fa-newspaper me-2 text-success"></i> Create Articles</h5>
        <p class="card-text">Write and publish new articles for your readers.</p>
      </div>
    </div>

        `


        viewArticles.innerHTML = `
            <div class="card shadow-sm" style="cursor: pointer">
      <div class="card-body">
        <h5 class="card-title"><i class="fas fa-eye me-2 text-info"></i> View Articles</h5>
        <p class="card-text">Browse and manage existing articles.</p>
      </div>
    </div>

        `

        viewCategories.innerHTML = `
            <div class="card shadow-sm" style="cursor: pointer">
      <div class="card-body">
        <h5 class="card-title"><i class="fas fa-list-ul me-2 text-warning"></i> View Categories</h5>
        <p class="card-text">See all available content categories.</p>
      </div>
    </div>

        `


        manageSpellingBee.innerHTML = `
            <div class="card shadow-sm">
      <div class="card-body">
        <h5 class="card-title"><i class="fas fa-spell-check me-2 text-danger"></i> Manage Spelling Bee</h5>
        <p class="card-text">Create, update, and monitor spelling bee games.</p>
      </div>
    </div>

        `


 dashboardMain.classList.add('row')
    dashboardMain.append(viewCategories)
    dashboardMain.append(createArticles)
    dashboardMain.append(manageSpellingBee)
    dashboardMain.append(createCategories)
    dashboardMain.append(viewArticles)




    } else{

        const h2 = document.createElement('h2')
        h2.classList.add("text-center")

        h2.innerHTML = `You Need To Be Logged In!`

        dashboardMain.append(h2)





    }



        
    } catch (error) {
        console.log("There was a problem", error.message)
    }


})