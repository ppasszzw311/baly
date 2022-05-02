
const nutRes = document.getElementById("data-panel-nutRes")
const smoke = document.getElementById("data-panel-smoke")
const drink = document.getElementById('data-panel-drink')
renderinboundlist()

function renderinboundlist() {
  const store_id = localStorage.getItem('store_id')
  const category = ['檳榔原料','香菸','飲料']
  for ( i = 0; i < 3; i++) {
    let cat = category[i] 
    axios.get(`/api/getProductName/${store_id}/${category[i]}`)
      .then((response) => {
        if(cat === '檳榔原料') {
          nutRes.innerHTML = renderList(response.data)
          localStorage.setItem('nutReslist', JSON.stringify(response.data))
        } else if (cat === '香菸') {
          smoke.innerHTML = renderList(response.data)
          localStorage.setItem('smokelist', JSON.stringify(response.data))
        } else {
          drink.innerHTML = renderList(response.data)
          localStorage.setItem('drinklist', JSON.stringify(response.data))
        }
      })
      .catch((err) => console.log(err))
  }
}

// 檳榔部分
nutRes.addEventListener('change', e => {
  let nutRes_list = localStorage.getItem('nutReslist')
  nutRes_list = JSON.parse(nutRes_list)
  const changeItem = {
    id: parseInt(e.target.parentElement.parentElement.getAttribute("data-id")),
    value: parseInt(e.target.value)
  }
  nutRes_list.filter((item) => {
    if (item.product_id === changeItem.id ) {
      item.inbound = changeItem.value
    }
  })
  localStorage.setItem('nutReslist', JSON.stringify(nutRes_list))
})

//香菸部分
smoke.addEventListener('change', e => {
  let smoke_list = localStorage.getItem('smokelist')
  smoke_list = JSON.parse(smoke_list)
  const changeItem = {
    id: parseInt(e.target.parentElement.parentElement.getAttribute("data-id")),
    value: parseInt(e.target.value)
  }
  smoke_list.filter((item) => {
    if (item.product_id === changeItem.id ) {
      item.inbound = changeItem.value
    }
  })
  localStorage.setItem('smokelist', JSON.stringify(smoke_list))
})

// 飲料部分
drink.addEventListener('change', e => {
  let drink_list = localStorage.getItem('drinklist')
  drink_list = JSON.parse(drink_list)
  const changeItem = {
    id: parseInt(e.target.parentElement.parentElement.getAttribute("data-id")),
    value: parseInt(e.target.value)
  }
  drink_list.filter((item) => {
    if (item.product_id === changeItem.id ) {
      item.inbound = changeItem.value
    }
  })
  localStorage.setItem('drinklist', JSON.stringify(drink_list))
})


function renderList(data) {
  let list = ''
  for (i = 0; i < data.length; i++) {
    const item = `
      <tr data-id="${data[i].product_id}">
        <td>${data[i].name}</td>
        <td><input class="form-control" type="number"></td>
        <td>${data[i].inbound_unit}</td>
      </tr>
    `
    list += item
  }
  return list
}

// inbound // 進貨 // name // 名稱 // product_id // 商品id

function inbound (list) {
  axios.post('/api/inbound', {
    store_id: parseInt(localStorage.getItem('store_id')),
    store_name: localStorage.getItem('Name'),
    category: list.category,
    product_name: list.name,
    product_id: list.product_id,
    inbound_count: list.inbound,
    inbound_unit: list.inbound_unit,
    inbound_unit_count: list.inbound_unit_count,
    shift_id: localStorage.getItem('workshiftId')
  })
    .then((response) => {
      console.log('success inbound')
    })
    .catch((err) => console.log(err))
}

function updateInBoundStock (list) {
  axios.post('/api/updateInBoundStock', {
    product_id: list.product_id,
    inbound_unit_count: list.inbound_unit_count,
    stock: list.inbound
  })
    .then((response) => {
      console.log("success in stock")
    }) 
    .catch((err) => console.log(err))
}

let inbound_item = []
const submit = document.getElementById('submitCheck1')
submit.addEventListener('click', e => {
  purchaseinfo()
  inbound_item = purchaseinfo()
})

const submitcheck = document.getElementById('submitcheck')
submitcheck.addEventListener('click', e => {
  if (inbound_item.length !== 0) {
    for (i = 0 ; i < inbound_item.length; i++) {
      inbound(inbound_item[i])
      updateInBoundStock(inbound_item[i])
    }
    alert("success")
    window.location.href = '/purchase'
    renderinboundlist()
  }  
})

// purchase info 
function purchaseinfo() {
  const inbound_info = document.getElementById('inbound_info')
  let info = ''
  let inbound_item = []
  let nutRes_info = JSON.parse(localStorage.getItem('nutReslist'))
  for (i = 0; i < nutRes_info.length; i++ ) {
    let inbound_n = nutRes_info[i].inbound 
    if (inbound_n > 0) {
      nutRes_info[i].category = "檳榔"
      inbound_item.push(nutRes_info[i])
      let item = `<p><strong>檳榔_${nutRes_info[i].name}</strong> : ${inbound_n} ${nutRes_info[i].inbound_unit}</p>`
      info +=  item
    }
  }
  let smoke_info = JSON.parse(localStorage.getItem('smokelist'))
  for (i = 0; i < smoke_info.length; i++ ) {
    let inbound_n = smoke_info[i].inbound 
    if (inbound_n > 0) {
      smoke_info[i].category = "香菸"
      inbound_item.push(smoke_info[i])
      let item = `<p><strong>香菸_${smoke_info[i].name}</strong> : ${inbound_n} ${smoke_info[i].inbound_unit}</p>`
      info +=  item
    }
  }
  let drink_info = JSON.parse(localStorage.getItem('drinklist'))
  for (i = 0; i < drink_info.length; i++ ) {
    let inbound_n = drink_info[i].inbound 
    if (inbound_n > 0) {
      drink_info[i].category = "飲料"
      inbound_item.push(drink_info[i])
      let item = `<p><strong>飲料_${drink_info[i].name}</strong> : ${inbound_n} ${drink_info[i].inbound_unit}</p>`
      info +=  item
    }
  }
  inbound_info.innerHTML = info
  return inbound_item
}



