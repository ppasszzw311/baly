// node
const data_panel = document.getElementById("data-panel")
const sel_name = document.getElementById("sel_name")
const startDate = document.getElementById("startDate")
const endDate = document.getElementById("endDate")

// data
const checkinList = []

sel_name.addEventListener('change', e => {
  const class_ca = e.target.value 
  let filteredList = []
  console.log(class_ca.length)
  if (class_ca.length >= 3) {
    filteredList = checkinList
    makList(filteredList)
  } else {
    filteredList = checkinList.filter((item) => item.class.includes(class_ca)) 
    makList(filteredList)
  }
})

function filter() {
  const sel_name = document.getElementById("sel_name")
  
  let filteredList = []
  let filteredkey = {
    class: '',
    start: '',
    end: ''    
  }
  // 待處理
  
  sel_name.addEventListener('change', e => {
  const class_ca = e.target.value 
  console.log(class_ca.length)
  if (class_ca.length >= 3) {
    filteredList = checkinList
  } else {
    filteredList = checkinList.filter((item) => item.class.includes(class_ca)) 
  }
  makList(filteredList)
})
}
startDate.addEventListener('change', e => {
  const date_ca = e.target.value
  console.log(Date.parse(date_ca))
  let filteredList = []
  filteredList = checkinList.filter((item) => {
    return Date.parse(item.checkinDate) > Date.parse(date_ca)
  })
    makList(filteredList)
  }
)
endDate.addEventListener('change', e => {
  const date_ca = e.target.value
  console.log(Date.parse(date_ca))
  let filteredList = []
  if (!date_ca.length) {
    filteredList = checkinList
    makList(filteredList)
  } else {
    filteredList = checkinList.filter((item) => {
      return Date.parse(item.checkinDate) < Date.parse(date_ca)
    })
    makList(filteredList)
  }
})

axios.get('/api/checkin')
  .then( (response) => {
    checkinList.push(...response.data)
    makList(checkinList)
  })
  .catch((err) => console.log(err))


function makList(data) {
  let list = ''
  for (i = 0; i < data.length; i++) {
    let rowdata = `
      <tr>
        <td>${data[i].store_id}</td>
        <td>${data[i].name}</td>
        <td>${data[i].checkinDate.substring(0,10)}</td>
        <td>${data[i].checkinTime}</td>
        <td>${data[i].class}</td>
        <td>${data[i].user}</td>
      </tr>
    `
    list += rowdata
  }
  data_panel.innerHTML = list
}