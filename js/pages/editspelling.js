document.addEventListener('DOMContentLoaded', async() => {

    try {
         const gameId = window.location.hash.substring(1);
        const API_URL = "http://localhost:5000"
        const EditGame = document.getElementById('editgame')

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

        const singleGame = await fetch(`${API_URL}/public/spelling-bee-game/${gameId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

    

        if(!singleGame.ok) {
            console.log("A server issue prevented this action")
        }

        const game = await singleGame.json()
    
           
         const divGame = document.createElement('div')
       divGame.innerHTML = `
  <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;">

    <h1 style="text-align: center; color: #2c3e50; margin-bottom: 2rem;">${game.week}</h1>

    <div style="background: #f8f9fa; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px; border: 1px solid #ccc;">
      <h2 id="easy" style="color: #16a085;">easy</h2>
      <p><strong>Letters:</strong> ${game.game.easy.letters.join(', ')}</p>
      <p><strong>Center Letter:</strong> ${game.game.easy.centerLetter}</p>

      <form id="easyupdate">
        <p><strong>Edit Letters</strong></p>
        <div style="margin-bottom: 1rem;">
          <input type="text" id="easyletters" value="${game.game.easy.letters.join('')}" 
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
        </div>
        <div style="margin-bottom: 1rem;">
          <input type="text" id="easyCletter" value="${game.game.easy.centerLetter}" 
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
        </div>
        <button type="submit" id="easyBtn" 
          style="background: #16a085; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 4px; cursor: pointer;">
          Update Easy Level
        </button>
      </form>
    </div>

    <div style="background: #f8f9fa; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px; border: 1px solid #ccc;">
      <h2 id="medium" style="color: #2980b9;">medium</h2>
      <p><strong>Letters:</strong> ${game.game.medium.letters.join(', ')}</p>
      <p><strong>Center Letter:</strong> ${game.game.medium.centerLetter}</p>

      <form id="mediumupdate">
        <p><strong>Edit Letters</strong></p>
        <div style="margin-bottom: 1rem;">
          <input type="text" id="mediumletters" value="${game.game.medium.letters.join('')}" 
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
        </div>
        <div style="margin-bottom: 1rem;">
          <input type="text" id="mediumCletter" value="${game.game.medium.centerLetter}" 
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
        </div>
        <button type="submit" id="mdBtn" 
          style="background: #2980b9; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 4px; cursor: pointer;">
          Update Medium Level
        </button>
      </form>
    </div>

    <div style="background: #f8f9fa; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px; border: 1px solid #ccc;">
      <h2 id="difficult" style="color: #c0392b;">difficult</h2>
      <p><strong>Letters:</strong> ${game.game.difficult.letters.join(', ')}</p>
      <p><strong>Center Letter:</strong> ${game.game.difficult.centerLetter}</p>

      <form id="difficultupdate">
        <p><strong>Edit Letters</strong></p>
        <div style="margin-bottom: 1rem;">
          <input type="text" id="difficultletters" value="${game.game.difficult.letters.join('')}" 
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
        </div>
        <div style="margin-bottom: 1rem;">
          <input type="text" id="difficultCletter" value="${game.game.difficult.centerLetter}" 
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
        </div>
        <button type="submit" id="dfBtn" 
          style="background: #c0392b; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 4px; cursor: pointer;">
          Update Difficult Level
        </button>
      </form>
    </div>

  </div>


  <div class="container text-center" style="margin-bottom: 32px;">
<div>
          <p><strong>Delete Game</strong></p>

          </div>


  <form id="deleteGame">

  <button type="submit" id="dltBtn" 
          style="background: purple; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 4px; cursor: pointer;">
          Delete Game
        </button>


  </form>


  </div>
`;

          
         EditGame.append(divGame)

    //    updating easy mode
         document.getElementById('easyupdate').addEventListener('submit', async(e) => {

e.preventDefault()

try {
    const difficulty = document.getElementById('easy').innerText
    const centerLetter = document.getElementById('easyCletter').value
    const lett = document.getElementById('easyletters').value

    // const letters = [...lett] creates a lot of commas
    const letters = lett.split(',').map(l => l.trim()).filter(Boolean);


   
    

    const res = await fetch(`${API_URL}/admin/update-spelling-game/${gameId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${admintoken}`
        },
        body: JSON.stringify({centerLetter, letters, difficulty})
    })

    if(!res.ok) {
        console.log("there was a problem")
    }

    const data = await res.json()

    alert(data.msg)

    window.location.reload()
    
} catch (error) {
    console.log("there was a problem", error.message)
}

         })



         //    updating medium mode
         document.getElementById('mediumupdate').addEventListener('submit', async(e) => {

e.preventDefault()

try {
    const difficulty = document.getElementById('medium').innerText
    const centerLetter = document.getElementById('mediumCletter').value
    const lett = document.getElementById('mediumletters').value

    // const letters = [...lett] creates a lot of commas
    const letters = lett.split(',').map(l => l.trim()).filter(Boolean);


   
    

    const res = await fetch(`${API_URL}/admin/update-spelling-game/${gameId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${admintoken}`
        },
        body: JSON.stringify({centerLetter, letters, difficulty})
    })

    if(!res.ok) {
        console.log("there was a problem")
    }

    const data = await res.json()

    alert(data.msg)

    window.location.reload()
    
} catch (error) {
    console.log("there was a problem", error.message)
}

         })


        

         //    updating difficult mode
         document.getElementById('difficultupdate').addEventListener('submit', async(e) => {

e.preventDefault()

try {
    const difficulty = document.getElementById('difficult').innerText
    const centerLetter = document.getElementById('difficultCletter').value
    const lett = document.getElementById('difficultletters').value

    // const letters = [...lett] creates a lot of commas
    const letters = lett.split(',').map(l => l.trim()).filter(Boolean);


   
    

    const res = await fetch(`${API_URL}/admin/update-spelling-game/${gameId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${admintoken}`
        },
        body: JSON.stringify({centerLetter, letters, difficulty})
    })

    if(!res.ok) {
        console.log("there was a problem")
    }

    const data = await res.json()

    alert(data.msg)

    window.location.reload()
    
} catch (error) {
    console.log("there was a problem", error.message)
}

         })



        //delete game
        
        document.getElementById('deleteGame').addEventListener('submit', async(e) => {
      
          e.preventDefault()

          try {

            const dltBtn = document.getElementById('dltBtn')

            dltBtn.disabled = true


            const res = await fetch(`${API_URL}/admin/delete-spelling-game/${gameId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${admintoken}`
              }
            })

          if(!res.ok) {
            console.log("Server Error")
          }

          const data = await res.json()

          alert(data.msg)

          window.location.href = "newspellingbeegame.html"
            
          } catch (error) {
            console.log("failed to delete game", error,)
          }



        })


    } else{

        const h3 = document.createElement('h3')

        h3.innerText = "You Are Not Authenticated";

        EditGame.append(h3)
    }



        
    } catch (error) {
        
    }


})