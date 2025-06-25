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
    
             console.log(game.game.easy)
         const divGame = document.createElement('div')
       
           divGame.innerHTML = `
             
           <h1> ${game.week} </h1>
           <div>
           <h2 id="easy">easy</h2>

           <p>letters: ${game.game.easy.letters.join()} </p>
           <p>center letter: ${game.game.easy.centerLetter} </p>

           <form id="easyupdate">
           <p>edit letters </p>
           <div>
                <input type="text" id="easyletters" value="${game.game.easy.letters.join()}" />

                </div>

                <div>
            <input type="text" id="easyCletter" value="${game.game.easy.centerLetter}" />

                </div>
                <button type="submit" id="easyBtn"> Easy Level </button>
           </form>
           
           </div>

           <div>
           <h2 id="medium">medium </h2>

           <p>letters: ${game.game.medium.letters.join()} </p>
                      <p>center letter: ${game.game.medium.centerLetter} </p>


                      <form id="mediumupdate">
           <p>edit letters </p>
           <div>
                <input type="text" id="mediumletters" value="${game.game.medium.letters.join()}" />

                </div>

                <div>
            <input type="text" id="mediumCletter" value="${game.game.medium.centerLetter}" />

                </div>
                <button type="submit" id="mdBtn"> Medium Level </button>

           </form>
           

           
           </div>

           <div>
           <h2>Difficult Game </h2>

           <p>letters: ${game.game.difficult.letters.join()} </p>
           <p>center letter: ${game.game.difficult.centerLetter} </p>


                      <form id="difficultupdate">
           <p>edit letters </p>
           <div>
                <input type="text" id="difficultletters" value="${game.game.difficult.letters.join()}" />

                </div>

                <div>
            <input type="text" id="difficultCletter" value="${game.game.difficult.centerLetter}" />

                </div>
             <button type="submit" id="dfBtn"> Difficult Level </button>
           </form>
           
           </div>
           
           
           
           
           `


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


        


    } else{

        const h3 = document.createElement('h3')

        h3.innerText = "You Are Not Authenticated";

        EditGame.append(h3)
    }



        
    } catch (error) {
        
    }


})