// node 
const itemList = document.getElementById('checkUse')
const store = document.getElementById('store')
const store1 = document.getElementById('store1')
const addvalue = document.getElementById('addvalue')

const add_new = document.getElementById('add_new')
add_new.addEventListener('change', e => {
  let name = e.target.name 
  let value = e.target.value
  localStorage.setItem(name, value)
})
// 點擊更改
itemList.addEventListener('click', e=> {
  let target = e.target
  let value = target.innerHTML
  if (value.length < 20) {
    target.innerHTML = `<input class="form-control" type="text" value="${value}">`
    console.log(value)
  }
})


addvalue.addEventListener('click', e => {
  e.preventDefault();
  axios.post('/api/addproduct', {
    store_id: parseInt(localStorage.getItem("store_id")),
    name: localStorage.getItem('item_name'),
    category: localStorage.getItem('category'),
    cost: parseInt(localStorage.getItem('cost')),
    price: parseInt(localStorage.getItem('price')),
    unit: localStorage.getItem('unit'),
    unit_count: parseInt(localStorage.getItem('unit_count')),
    use_yn: 1
  })
    .then((response) => {
      localStorage.removeItem('item_name')
      localStorage.removeItem('category')
      localStorage.removeItem('cost')
      localStorage.removeItem('price')
      localStorage.removeItem('unit')
      localStorage.removeItem('unit_count')

      window.location.href = '/backend/itemData'
    })
    .catch((err) => console.log(err))
})

const storeList = []

function renderStoreList(list) {
  let stores = ''
  list.map( (item) => {
    let storeOne = `<option value="${item.id}">${item.name}</option>`
    stores += storeOne
  })
  store.innerHTML = stores
  store1.innerHTML = stores
}


axios.get('/api/store')
  .then((response) => {
    storeList.push(...response.data)
    renderStoreList(storeList)
  })
  .catch((err) => console.log(err))

axios.get('/api/product')
  .then( (response) => {
    let data = response.data
    let body =``
    let check = ''
    for(i = 0; i < data.length; i++) {
      if( data[i].use_yn === 1) {
        check = 'checked'
        let rowdata = `
          <tr data-id="${data[i].id}">
            <td name="id">${data[i].id}</td>
            <td name="category">${data[i].category}</td>
            <td name="name">${data[i].name}</td>
            <td name="cost">${data[i].cost}</td>
            <td name="price">${data[i].price}</td>
            <td name="inbount_unit">${data[i].inbound_unit}</td>
            <td name="inbound_unit_count">${data[i].inbound_unit_count}</td>
            <td><input class="form-check-input" type="checkbox" ${check} >
                <label class="form-check-label" for="flexCheckDefault">
                  使用
                </label>
            </td>
          </tr>
        `
        body += rowdata 
      } else {
        check = ' '
        let rowdata = `
          <tr data-id="${data[i].id}">
            <td name="id">${data[i].id}</td>
            <td name="category">${data[i].category}</td>
            <td name="name">${data[i].name}</td>
            <td name="cost">${data[i].cost}</td>
            <td name="price">${data[i].price}</td>
            <td name="inbount_unit">${data[i].inbound_unit}</td>
            <td name="inbound_unit_count">${data[i].inbound_unit_count}</td>
            <td><input class="form-check-input" type="checkbox" ${check} disabled>
                <label class="form-check-label" for="flexCheckDefault">
                  使用
                </label>
            </td>
          </tr>
        `
        body += rowdata 
      }
    itemList.innerHTML = body  
    }
  })
  .catch( (err) => console.log(err))