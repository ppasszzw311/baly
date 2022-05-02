const dateTime = document.getElementById("datetime")
const nutCatory = document.getElementById('nutCatory')

const nut = document.getElementById('nut')
const smoke = document.getElementById('smoke')
const drink = document.getElementById('drink')


nut.addEventListener('change', e => {
  let value = parseInt(e.target.value)
  let item_id = parseInt(e.target.parentElement.parentElement.getAttribute("data-id")) // name
  let sale_list = JSON.parse(localStorage.getItem('saleList'))
  sale_list.filter((item) => {
    if (item.product_id === item_id) {
      item.sale_value = value
    }
  })
  localStorage.setItem("saleList", JSON.stringify(sale_list))
  let sale = {
    item_id: parseInt(item_id),
    drink_sale : parseInt(value)
  }
  localStorage.setItem("sale", JSON.stringify(sale))
})

smoke.addEventListener('change', e => {
  let value = parseInt(e.target.value)
  let item_id = parseInt(e.target.parentElement.parentElement.getAttribute("data-id")) // name
  let sale_list = JSON.parse(localStorage.getItem('saleList'))
  sale_list.filter((item) => {
    if (item.product_id === item_id) {
      item.sale_value = value
    }
  })
  localStorage.setItem("saleList", JSON.stringify(sale_list))
  let sale = {
    item_id: parseInt(item_id),
    drink_sale : parseInt(value)
  }
  localStorage.setItem("sale", JSON.stringify(sale))
})

drink.addEventListener('change', e => {
  let value = parseInt(e.target.value)
  let item_id = parseInt(e.target.parentElement.parentElement.getAttribute("data-id")) // name
  let sale_list = JSON.parse(localStorage.getItem('saleList'))
  sale_list.filter((item) => {
    if (item.product_id === item_id) {
      item.sale_value = value
    }
  })
  localStorage.setItem("saleList", JSON.stringify(sale_list))
  let sale = {
    item_id: parseInt(item_id),
    drink_sale : parseInt(value)
  }
  localStorage.setItem("sale", JSON.stringify(sale))
})

ShowTime()
getClassin()
insertLabelPrint()

salecount()
renderItemList ()

// 銷售
function salecount() {
  const saleRecord = document.getElementById('saleRecord')
  let sale_list = JSON.parse(localStorage.getItem('saleList')) // 商品列表
  let sale_Record = localStorage.getItem('saleRecord') // 銷售總數

  saleRecord.addEventListener('click', e => {
    if (sale_Record.length > 10) {
      let Record = JSON.parse(localStorage.getItem('saleRecord'))
      for (i = 0 ; i < sale_list.length ; i ++) {
        console.log(Record[i].value)
        // if (Record[i].value === null) {Record[i].value =0}
        Record.filter((item) => {
          if (item.product_id === sale_list[i].product_id) {
            let value = parseInt(item.value)
            let addvalue =  parseInt(sale_list[i].sale_value)
            value += addvalue
            item.value = value
          }
        })  
      }
      console.log(Record)
      renderItemList ()
      localStorage.setItem("saleRecord", JSON.stringify(Record))
      // makeSaleList(parseInt(localStorage.getItem('store_id'))) // 重設銷售清單
    } else {
      let sale = []
      for (i = 0 ; i < sale_list.length ; i++) {
        let item = {
          product_id: sale_list[i].product_id, 
          value: sale_list[i].sale_value
        }
        sale.push(item)
      }
      sale_Record = JSON.stringify(sale)
      makeSaleList(parseInt(localStorage.getItem('store_id')))
      localStorage.setItem('saleRecord', sale_Record)
    }
    alert('輸入完成')
    // window.location.href = '/printAndSale'
  })
}

function renderItemList () {
  const store_id = localStorage.getItem('store_id')
  let category1 = '檳榔'
  axios.get(`/api/getProductName/${store_id}/${category1}`)
    .then((response) => {
      renderCategory(response.data)
      renderNutList(response.data)
    })
    .catch((err) => console.log(err))

  let category2 = '香菸'
  axios.get(`/api/getProductName/${store_id}/${category2}`)
    .then((response) => {
      renderSmokeList(response.data)
    })
    .catch((err) => console.log(err))

  let category3 = '飲料'
  axios.get(`/api/getProductName/${store_id}/${category3}`)
    .then((response) => {
      renderDrinkList(response.data)
    })
    .catch((err) => console.log(err))
}



function renderCategory(data) {
  list = ''
  for( i = 0; i < data.length; i++) {
    let row = `
      <option data-id="${data[i].product_id}" value="${data[i].name}">${data[i].name}</option>
    `
    list += row
  }
  nutCatory.innerHTML = list
}

function renderNutList (data) {
  list = ''
  for( i = 0; i < data.length; i++) {
    let row = `
      <tr>
        <td name="${data[i].product_id}">${data[i].name}</td>
        <td name="nut_total" class="total_value">0</td>
        <td ><input class="form-control" name="nut_sale" type="number"></td>
      </tr>
    `
    list += row
  }
  nut.innerHTML = list
}

const label_num = document.getElementById('label_num')
label_num.addEventListener('change', e => {
  console.log(e.target.name, e.target.innerText, e.target.value)
  localStorage.setItem('')
})


function renderSmokeList (data) {
  list = ''
  for( i = 0; i < data.length; i++) {
    let row = `
      <tr data-id="${data[i].product_id}">
        <td name="${data[i].name}">${data[i].name}</td>
        <td name="smoke_total" class="total_value">0</td>
        <td name="smoke_sale"><input class="form-control" type="number"></td>
      </tr>
    `
    list += row
  }
  smoke.innerHTML = list
}
function renderDrinkList (data) {
  list = ''
  for( i = 0; i < data.length; i++) {
    const countList = JSON.parse(localStorage.getItem('saleList'))
    const saleList = JSON.parse(localStorage.getItem('saleRecord'))
    let id = data[i].product_id
    for (j = 0; j < countList.length; j++) {
      if (countList[j].product_id === id) {
        let saleadd = countList[j].sale_value
        let salehave = saleList[j].value
        if (!saleadd) {saleadd = 0} 
        if (!salehave) {salehave =0}
        
        let row = `
        <tr data-id="${data[i].product_id}">
          <td name="${data[i].name}">${data[i].name}</td>
          <td name="drink_total" class="total_value">${salehave}</td>
          <td ><input class="form-control" name="drink_sale" type="number" value=${saleadd}></td>
        </tr>
        `
        list += row
      } 
    }
    // let row = `
    //   <tr data-id="${data[i].product_id}">
    //     <td name="${data[i].name}">${data[i].name}</td>
    //     <td name="drink_total" class="total_value">0</td>
    //     <td ><input class="form-control" name="drink_sale" type="number"></td>
    //   </tr>
    // `
    // list += row
  }
  drink.innerHTML = list
}

function ShowTime() {
  let NowDate = new Date()
  let Y = NowDate.getFullYear()
  let M = zeroTen(NowDate.getMonth()+1) 
  let D = zeroTen(NowDate.getDate())
  let h = zeroTen(NowDate.getHours())
  let m = zeroTen(NowDate.getMinutes())
  let s = zeroTen(NowDate.getSeconds())
  let time = `${Y}年 ${M}月 ${D}日 ${h}:${m}:${s}`
  dateTime.innerHTML = '日期時間：' + time
  setTimeout('ShowTime()', 1000)
}

// to ten to zero
function zeroTen(number) {
  if (number < 10) {
    return '0' + number
  } else {
    return number
  }
}

function getClassin() {
  const class_in = document.getElementById('class_in')
  const workshift = document.getElementById('workshift')
  let nowClass = localStorage.getItem('class')
  let workShiftID = localStorage.getItem('workshiftId')
  class_in.innerText = nowClass
  workshift.innerText = workShiftID
} 

function insertLabelPrint() { // 列印標籤
  const printLable = document.getElementById('printLable')
  let labelData = {
    product_id: parseInt(localStorage.getItem('product_id')),
    product_name: parseInt(localStorage.getItem('product_name')),
    store_id: parseInt(localStorage.getItem('store_id')),
    class: localStorage.getItem('class'),
    user_id: parseInt(localStorage.getItem('user_id')),
    user: localStorage.getItem('Name'),
    package: parseInt(localStorage.getItem('label_package')),
    piece: parseInt(localStorage.getItem('label_piece')),
    total: parseInt(localStorage.getItem('label_total')),
    broken: parseInt(localStorage.getItem('label_boken')),
    shift_id: localStorage.getItem('workshiftId')
  }
  printLable.addEventListener('click', e=>{
    console.log(e.target)
    axios.post('/api/insertLabelPrint', {
      product_id : labelData.product_id,
      product_name: labelData.product_name,
      store_id: labelData.store_id,
      class: labelData.class,
      user_id: labelData.user_id,
      user: labelData.user,
      package: labelData.package,
      piece: labelData.piece,
      total: labelData.total,
      break: labelData.broken,
      shift_id: labelData.shift_id
    })
      .then ((response) => {
        console.log(response.data)
      })
      .catch((err) => console.log(err))
    }) 
  localStorage.removeItem('product_id')
  localStorage.removeItem('product_name')
  localStorage.removeItem('label_package')
  localStorage.removeItem('label_piece')
  localStorage.removeItem('label_total')
  localStorage.removeItem('label_boken')
}


// add sale list 
function makeSaleList(store) {
  let sale_list = []
  axios.get(`/api/getProductName/${store}`)
    .then((response) => {
      let datalist = response.data
      for (i = 0; i < datalist.length; i++) {
        datalist[i].sale_value = 0
        sale_list.push(datalist[i])
        localStorage.setItem("saleList", JSON.stringify(sale_list))
      }
    })
    .catch((err) => console.log(err))
}


