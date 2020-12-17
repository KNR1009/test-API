// エントリーポイント
const indexModule = (()=>{

  

  const path = window.location.pathname
  
  switch(path){
    case '/':
      // 検索ボタンをクリックしたときの挙動
      document.getElementById('search-btn').addEventListener('click', () => {
            return searchModule.searchUsers()
          })
      // userモジュールのfetchAllUsersメソットを呼び出す
      return usersModule.fetchAllUsers()

    case '/create.html':
      document.getElementById('save-btn').addEventListener('click', () => {
        return usersModule.createUser()
      })

    case '/edit.html':
      const uid = window.location.search.split('?uid=')[1]

      document.getElementById('save-btn').addEventListener('click', ()=>{
        return usersModule.saveUser(uid)
      })

      document.getElementById('delete-btn').addEventListener('click', ()=>{
        return usersModule.deleteUsers(uid)
      })

      return usersModule.setExitstringValue(uid);
  }
  
})()
