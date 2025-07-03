document.addEventListener('DOMContentLoaded', async() => {

try {

    const API_URL = "https://nodeapi-moneyblog.onrender.com"
        const RecentGame = document.getElementById('recentgame')
        const OrderGames = document.getElementById('oldergames')
        const NoGames = document.getElementById('nogames')


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

        const rGame = await fetch(`${API_URL}/public/all-spelling-bee-games`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if(!rGame.ok) {
            console.log("A Server Issue Prevented This Game From Loading")
        }

        const games = await rGame.json()


        

        const game = games.games 

        if(!games.games || games.games.length === 0) { 
   const divo = document.createElement('div')
   divo.innerHTML = `
   
   <h3> NO GAMES AVAILABLE</h3>

   <div>
<a href="newspellingbeegame.html"> add new game </a>

   </div>
   
   `
   NoGames.append(divo)
   return; 
}



         let rAddedGame = game[game.length -1]; //game.pop()
 
    
    


        // show recent game

        const divGame = document.createElement('div')

      divGame.innerHTML = `
  <div style="padding: 1rem; border: 1px solid #ccc; border-radius: 8px; max-width: 600px; margin: 1rem auto; background-color: #f9f9f9;">

    <h3 style="text-align: center; margin-bottom: 1.5rem; color: #333;">${rAddedGame.weekName}</h3>

    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${
        rAddedGame.spellings.map(single => `
          <div style="border: 1px solid #ddd; border-radius: 6px; padding: 1rem; background-color: #fff;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong>Game Level:</strong> ${single.difficulty}</li>
              <li style="margin-bottom: 0.5rem;"><strong>Center Letter:</strong> ${single.centerLetter}</li>
              <li><strong>Game Letters:</strong> ${single.letters.join('')}</li>
            </ul>
          </div>
        `).join('')
      }
    </div>
 <div class="text-center">
    <a 
              href="editspelling.html#${rAddedGame._id}" 
              style="text-decoration: none; color: #007bff; font-weight: 500;"
              onmouseover="this.style.textDecoration='underline'" 
              onmouseout="this.style.textDecoration='none'"
            >
            edit game
            </a>

</div>
  </div>
`;


      


        RecentGame.append(divGame)


const divOld = document.createElement('div')
 
 divOld.innerHTML = `
  <div style="margin-top: 2rem; text-align: center;">
    <h3 style="font-size: 1.5rem; color: #333; margin-bottom: 1rem;">Old Games</h3> 

    <ul style="list-style: none; padding-left: 0; display: inline-block; text-align: left;">
      ${
        game?.map(item => `
          <li style="margin-bottom: 0.5rem;">
            <a 
              href="editspelling.html#${item._id}" 
              style="text-decoration: none; color: #007bff; font-weight: 500;"
              onmouseover="this.style.textDecoration='underline'" 
              onmouseout="this.style.textDecoration='none'"
            >
              ${item.weekName}
            </a>
          </li>
        `).join('')
      }
    </ul>
  </div>
`;


OrderGames.append(divOld)

      } else {

        const h3 = document.createElement('h3')
        h3.innerText = "You're Not Authenticated"

        RecentGame.append(h3)
      }





    
} catch (error) {
    console.log("There was a problem", error.message)
}


})