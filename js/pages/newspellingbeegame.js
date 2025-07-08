document.addEventListener('DOMContentLoaded', async() => {

    try {
        const API_URL = "https://nodeapi-moneyblog.onrender.com"
        const SpellingGame = document.getElementById('newspellinggame')

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

    

    if(admintoken) {

        const divSpell = document.createElement('div')

        

        divSpell.innerHTML = `

        <form id="createGame" style="max-width: 600px; margin: 2rem auto; padding: 2rem; border: 1px solid #ccc; border-radius: 8px; font-family: sans-serif; background: #f9f9f9;">
  <h3 style="text-align: center; margin-bottom: 1.5rem;">Create Spelling Bee Game</h3>

  <div style="margin-bottom: 1rem;">
    <input type="text" id="gameWeek" placeholder="Game Week" style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
  </div>

  <!-- Easy Mode -->
  <div style="margin-bottom: 2rem;">
    <h4 style="color: green;">Easy Mode</h4>
    <input type="text" id="easy-letters" placeholder="Write 7 letters" style="width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
    <input type="text" id="easy-centerLetter" placeholder="Center Letter" style="width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
    <select id="easy-level" style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
      <option value="easy">Easy</option>
    </select>
  </div>

  <!-- Medium Mode -->
  <div style="margin-bottom: 2rem;">
    <h4 style="color: orange;">Medium Mode</h4>
    <input type="text" id="medium-letters" placeholder="Write 7 letters" style="width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
    <input type="text" id="medium-centerLetter" placeholder="Center Letter" style="width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
    <select id="medium-level" style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
      <option value="medium">Medium</option>
    </select>
  </div>

  <!-- Difficult Mode -->
  <div style="margin-bottom: 2rem;">
    <h4 style="color: red;">Hard Mode</h4>
    <input type="text" id="difficult-letters" placeholder="Write 7 letters" style="width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
    <input type="text" id="difficult-centerLetter" placeholder="Center Letter" style="width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
    <select id="difficult-level" style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
      <option value="difficult">Difficult</option>
    </select>
  </div>

  <div style="text-align: center;">
    <button type="submit" id="subBtn" style="padding: 0.75rem 1.5rem; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer;">
      Create Game
    </button>
  </div>
</form>

        
        `


        SpellingGame.append(divSpell)

        document.getElementById('createGame').addEventListener('submit', async(e) => {
           e.preventDefault()

            try { 
                 const weekName = document.getElementById('gameWeek').value
                const easyLevel = document.getElementById('easy-level').value 
                const easyCenterLetter = document.getElementById('easy-centerLetter').value 
                const easyletters = document.getElementById('easy-letters').value.trim().toLowerCase();

                const mediumLevel = document.getElementById('medium-level').value 
                const mediumCenterLetter = document.getElementById('medium-centerLetter').value 
                const mediumletters = document.getElementById('medium-letters').value.trim().toLowerCase();

                const difficultLevel = document.getElementById('difficult-level').value 
                const difficultCenterLetter = document.getElementById('difficult-centerLetter').value 
                const difficultletters = document.getElementById('difficult-letters').value.trim().toLowerCase();



                 const subBtn = document.getElementById('subBtn')


                 if(easyletters.length !== 7 || mediumletters.length !== 7 || difficultletters.length !== 7) {

                   alert("A Game Level needs to have 7 LETTERS!!") }


                    if(easyCenterLetter.length !== 1 || mediumCenterLetter.length !== 1 || difficultCenterLetter.length !== 1) {

                    alert('A game level needs a Single Center LETTER!!')           
                
                }


                 const dLetters = [...difficultletters]
                 const eLetters = [...easyletters]
                 const mLetters = [...mediumletters]


                 let spellings = [
                    {letters: eLetters, centerLetter: easyCenterLetter, difficulty: easyLevel},
                    {letters: mLetters, centerLetter: mediumCenterLetter, difficulty: mediumLevel},
                    {letters: dLetters, centerLetter: difficultCenterLetter, difficulty: difficultLevel}
                 ]

                
                         
            

                 subBtn.disabled = true


                const response = await fetch(`${API_URL}/admin/create-full-spellingbee-week`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
            'Authorization': `Bearer ${admintoken}`

                    },
                    body: JSON.stringify({weekName, spellings})
                })

                if(!response.ok) {
                    console.log("There was a problem")
                }

                const data = await response.json()

               alert(data.msg) 

               window.location.href = "viewrecentpellingbeegame.html"



                
            } catch (error) {
                console.log("failed to submit form")
            }


        })


        


    } else{
                const h2 = document.createElement('h2')
        h2.classList.add("text-center")

        h2.innerHTML = `You Need To Be Logged In!`

        SpellingGame.append(h2)

    }

        
    } catch (error) {
        console.log("there was a problem", error.message)
    }


})