document.getElementById('loginForm').addEventListener('submit', async(e) => {
            e.preventDefault()


    try {
        const API_URL = "http://localhost:5000"

       
        const adminMail = document.getElementById('email').value
        const adminKey = document.getElementById('password').value
        const submitBtn = document.getElementById('submitBtn')
        //  submitBtn.classList.add('spinner-border')
        submitBtn.disabled = true

        const response = await fetch(`${API_URL}/admin/user-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({adminMail, adminKey})
        })

        if(!response.ok) {
            console.log("There was a problem")
        }

        const data = await response.json()

       
        window.location.reload()

        if(data.msg) {
            alert(data.msg)
        } else  if(data.message){
            window.location.href = "/"
            
        }




        
    } catch (error) {
        console.log('There was a problem ', error.message)
    }


})