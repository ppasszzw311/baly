
// const 
const submit = document.getElementById('login-button')

submit.addEventListener('click', (e) =>{
  e.preventDefault()
  let a = getLoginInfo()
  logincheck()
})


function getLoginInfo () {
  const form = document.getElementById('login')
  const id = form[0].value
  const password = form[1].value
  payload = {
    user_id: id,
    user_password: password
  }
  return payload
}

function logincheck () {
  const form = document.getElementById('login')
  const id = form[0].value
  const password = form[1].value
  axios.post('/api/login', {
    idnum: id,
    password: password
  })
    .then( (response) => {
      let token =response.data[0].token
      localStorage.setItem("token", JSON.stringify(token))
      getStoreInfo(token)
      setTimeout(checktoken(token),2000)
    })
    .catch( (err) => console.log(err))
}



// get user info 
function getStoreInfo(token) {
  axios.get(`/api/userInfo/${token}`)
    .then( (response) => {
      let store_id = response.data.store_id
      sale_list(store_id)
    })
    .catch( (err) => console.log(err))
}

// check token 
function checktoken(token) {
  if (token.length !== 0) {
    alert('成功登入')
    window.location.href = '/' 
  }
}

// add sale list 
function sale_list(store) {
  let sale_list = []
  axios.get(`/api/getProductName/${store}`)
    .then((response) => {
      let datalist = response.data
      for (i = 0; i < datalist.length; i++) {
        sale_list.push(datalist[i])
        localStorage.setItem("saleList", JSON.stringify(sale_list))
      }
    })
    .catch((err) => console.log(err))
}




// add work shift list ???