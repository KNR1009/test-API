// 即時関数でモジュールかする
const usersModule = (()=>{
  const BASE_URL = "http://localhost:3000/api/v1/users"

  return {
    fetchAllUsers: async ()=>{
      // GETメソットでAPIを叩く
      const res = await fetch(BASE_URL)
      const users = await res.json();
      let body = ""
      for(let i=0; i<users.length; i++){
        const user = users[i]
        body+= `<tr>
                  <td>${user.id}</td>
                  <td>${user.name}</td>
                  <td>${user.profile}</td>
                  <td>${user.date_of_birth}</td>
                  <td>${user.created_at}</td>
                  <td>${user.updated_at}</td>
                </tr>`
        document.getElementById("users-list").innerHTML = body
      }
    }
    }
})()
