// 即時関数でモジュールかする
const usersModule = (()=>{
  const BASE_URL = "http://localhost:3000/api/v1/users"

  const headers = new Headers()
  headers.set("Content-Type", "application/json")

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
    },
    // 以下に新規登録APIを叩くためのメソットを作成する
    createUser: async() => {
      // 入力された値を取得する
      const name = document.getElementById('name').value
      const profile = document.getElementById('profile').value
      const dateOfbirth = document.getElementById('date-of-birth').value

      // リクエストbodyに代入して、bodypaserで変換してくれる
      const body = {
        name: name,
        profile: profile,
        date_ofc_birth:dateOfbirth
      }

      // POSTメソットを叩く
       const res = await fetch(BASE_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      })

      const resJson = await res.json()

      // 成功した時にalertを出す(res.jsonの値)
      alert(resJson.message)
      window.location.href = "/"
    }
    }
})()
