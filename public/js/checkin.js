const number = document.querySelector('#number10')
const dateTime = document.querySelector('#datetime')
const id = document.querySelector('#id_input')
const loginSubmit = document.getElementById('loginSubmit')
const submitCheck = document.getElementById('submitcheck')



loginSubmit.addEventListener('click', e => {
  showCheckin()
})

submitCheck.addEventListener('click', e => {
  const data = showCheckin()
  axios.post('/api/clockInAndOut', {
    user_id: parseInt(localStorage.getItem('user_id')),
    user: localStorage.getItem('Name'),
    storeId: parseInt(localStorage.getItem('store_id')),
    class: data.class,
    status: "上班"
  })
    .then( ( response) => {
      let checkin = response.data[0].shift_id
      localStorage.setItem('workshiftId', checkin)
      window.location.href = '/'
    })
    .catch( (err) => console.log(err))
})

// show now
function ShowTime() {
  let NowDate = new Date()
  let Y = NowDate.getFullYear()
  let M = zeroTen(NowDate.getMonth()+1) 
  let D = zeroTen(NowDate.getDate())
  let h = zeroTen(NowDate.getHours())
  let m = zeroTen(NowDate.getMinutes())
  let s = zeroTen(NowDate.getSeconds())
  let time = `${Y}年 ${M}月 ${D}日 ${h}:${m}:${s}`
  return time
}


// to ten to zero
function zeroTen(number) {
  if (number < 10) {
    return '0' + number
  } else {
    return number
  }
}

// console.log checkin 


function showCheckin() {
  const classT = document.getElementById('class')
  const timeT = document.getElementById('time')
  const form = document.getElementById('checkin')
  for (i = 0; i < 3; i++) {
    if (form[i].checked === true) {
      const data = {
        time: ShowTime(),
        class: form[i].value
      }
      localStorage.setItem("class", form[i].value)
      classT.innerHTML = data.class
      timeT.innerHTML = data.time
      return data
    }
  } 
}

