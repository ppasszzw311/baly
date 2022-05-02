const db = require('../models/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// get all
module.exports.checkinAll = (req,res) => {
  try {
    db.query('SELECT check_in.`store_id`, store.name , DATE(check_in.created_at) as checkinDate, Time(check_in.created_at) as checkinTime, class, user FROM check_in LEFT JOIN store ON check_in.`store_id` = store.id', (err, result) => {
      const result1 = result
      res.json(result1)
    }) 
  } catch (err) {
    throw err;
  } 
}
module.exports.inboundAll = (req, res) => {
  db.query('SELECT * FROM inbound', (err, result) => {
    if (err) throw err;
    const inboundAll = result
    res.json(inboundAll)
  })
}
module.exports.label_printAll = (req, res) => {
  db.query('SELECT * FROM label_print', (err, result) => {
    if(err) throw err;
    const labelPrint = result
    res.json(labelPrint)
  })
}
module.exports.productsAll = (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if(err) throw err;
    const product = result
    res.json(product)
  })
}
module.exports.storeAll = (req, res) => {
  db.query('SELECT * FROM store', (err, result) => {
    if(err) throw err;
    const store = result
    res.json(store)
  })
}
module.exports.userAll = (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if(err) throw err;
    const users = result;
    res.json(users)
  })
}
module.exports.vendor = (req, res) => {
  db.query('SELECT * FROM vendor', (err, result) => {
    if(err) throw err;
    const vendor = result
    res.json(vendor)
  })
}
module.exports.workshiftAll = (req, res) => {
  db.query('SELECT * FROM workshift', (err,result) => {
    if(err) throw err;
    const workShift = result
    res.json(workShift)
  })
}
module.exports.workshiftDtAll = (req, res) => {
  db.query('SELECT * FROM workshift_dt', (err,result) => {
    if(err) throw err;
    const workShift = result
    res.json(workShift)
  })
}

// 打卡編號查詢
module.exports.getCurrentWorkShiftId = (req, res) => {
  
}

// 列印標籤頁面中取得商品名稱
module.exports.getProductName = (req, res) => {
  const storeId = parseInt(req.params.store_id)
  const category = req.params.category
  db.query('SELECT id as product_id, name, inbound_unit, inbound_unit_count FROM products WHERE category = ? and store_id = ? and use_yn = 1', [category, storeId], (err, result) => {
    if (err) throw err;
    const productList = result
    res.json(productList)
    console.log(storeId, category)
  }) 
}
module.exports.productNamebyStore = (req, res) => {
  const storeId = parseInt(req.params.store_id)
  db.query('SELECT id as product_id, name, category, inbound_unit, inbound_unit_count FROM products WHERE store_id = ? and use_yn = 1', storeId, (err, result) => {
    if (err) throw err;
    const productList = result
    res.json(productList)
  }) 
}


// 取得商品資料
module.exports.getWorkShiftProductInfo = (req, res) => {
  const storeId = req.params.store_id
  const sql = 'SELECT id as product_id,name,stock,price,unit,inbound_unit_count FROM bndb.products where store_id=? and use_yn=1'
  db.query(sql, storeId, (err, result) => {
    if(err) throw err;
    const productList = result
    res.json(productList)
    // product_id(int)：商品代碼 name(string)：商品名稱 stock(int)：庫存量 price(int)：售價 unit(string)：單位 inbound_unit_count(int)：商品進貨單位 
  })
}
// 取得檳榔工作資料
module.exports.getNutWorkInfo = (req, res) => {
  const shift_id = req.params.shift_id
  const sql = 'SELECT product_id,product_name,store_id,sum(package) as package,sum(broken) as broken,sum(total) as total FROM bndb.label_print where shift_id= ? group by product_id,product_name,store_id'
  db.query( sql, shift_id, (err, result) => {
    if (err) throw err;
    const workshift = result
    res.json(workshift)
    // product_id(int)：商品代碼 product_name(string)：商品名稱 store_id(int)：店代碼 package(int)：包數 broken(int)： 毀損顆數 total(int)：總顆數
  })
}
// 取得進貨資料
module.exports.getInboundInfo = (req, res) => {
  const shift_id = req.params.shift_id
  const sql = 'SELECT product_id,product_name,store_id,category,sum(inbound_count) as inbound_count FROM bndb.inbound where shift_id=? group by store_id,product_id,product_name,category '
  db.query(sql, shift_id, (err, result) => {
    if(err) throw err;
    const inboundList = result
    res.json(inboundList)
    // product_id(int)：商品代碼 product_name(string)：商品名稱 product_id(int)：店代碼 inbound_count(int)：進貨數量

  })
}


// post 
// checkin
module.exports.clockInAndOut = (req, res) => {
  const userId = req.body.user_id
  const user = req.body.user
  const storeId = req.body.storeId
  const className = req.body.class
  const status = req.body.status
  let sql = 'INSERT INTO check_in (user_id, user, store_id, class, status) VALUES (?,?,?,?,?)'
  db.query(sql, [userId, user, storeId, className, status], (err, result) => {
    if (err) throw err
    console.log(storeId)
    db.query('SELECT `created_at`, `user_id`, `user`, `store_id`, `class`, `shift_id` FROM `check_in` WHERE `store_id` = ? ORDER by `shift_id` DESC', storeId, (err, result) => {
      if(err) throw err 
      const clockList = result
      res.json(clockList)
    })
  })
}
// 交班銷售
module.exports.inserWorkShift = (req, res) => {
  const workShift = {
    store_id: req.body.store_id,
    class: req.body.class,
    user_id: req.body.user_id,
    user: req.body.user,
    operator: req.body.operator,
    successor: req.body.successor,
    handover_amount: req.body.handover_amount,
    shortage_amount: req.body.handover_amount,
    total_sales: req.body.total_sales,
    betelnut_sales: req.body.total_sales,
    drinks_sales: req.body.drinks_sales,
    cigarette_sales: req.body.cigarette_sales,   
    shift_id: req.body.shift_id
  }
  const sql = 'INSERT INTO `workshift` (`store_id`, `class`, `user_id`, `user`, `operator`, `successor`, `handover_amount`, `shortage_amount`, `total_sales`, `betelnut_sales`, `drinks_sales`, `cigarette_sales`, `shift_id`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)'
  db.query(sql, [workShift.store_id, workShift.class, workShift.user_id, workShift.user, workShift.operator, workShift.successor, workShift.handover_amount, workShift.shortage_amount, workShift.total_sales, workShift.betelnut_sales, workShift.drinks_sales, workShift.cigarette_sales, workShift.shift_id], (err, result) => {
    if (err) throw err;
    const message = {
      status: 1
    }
    res.json(message)
    // store_id(string):店代碼 class(string):班別(早班,中班,晚班) user_id(string):使用者代碼 user(string):使用者名稱 operator(string):值班人名稱 successor(string):接班人名稱 handover_amount(string):交班金額 shortage_amount(string):短溢金額 total_sales(string):總銷售額 betelnut_sales(string):檳榔銷售額 drinks_sales(string):飲料銷售額 cigarette_sales(string):香菸銷售額 shift_id(string):交班代碼 
  })
}

// 列印標籤頁面按列印後資料寫入資料庫同時列印標籤
module.exports.insertLabelPrint = (req, res) => {
  const labelData = {
    product_id: req.body.product_id,
    product_name: req.body.product_name,
    store_id: req.body.store_id,
    class: req.body.class,
    user_id: req.body.user_id,
    user: req.body.user,
    package: req.body.package,
    piece: req.body.piece,
    total: req.body.total,
    broken: req.body.broken,
    shift_id: req.body.shift_id
  } // product_id(int)：商品代碼 product_name(string)：商品名稱 store_id(int)：店代碼 class(string)：班別 user_id(int)：使用者代碼 user(string)：使用者名稱 package(int)：包數 piece(int)：顆數 total(int)：總顆數 broken(int)：損毀數 shift_id(string):交班代碼

  let sql = 'INSERT INTO `label_print` (`product_id`,`product_name`,`store_id`,`class`,`user_id`,`user`,`package`,`piece`,`total`,`broken`,`shift_id`) VALUES(?,?,?,?,?,?,?,?,?,?,?)'
  console.log(labelData)
  db.query(sql, [labelData.product_id, labelData.product_name, labelData.store_id, labelData.class, labelData.user_id, labelData.user, labelData.package, labelData.piece, labelData.total, labelData.broken, labelData.shift_id], (err, result) => {
    if (err) throw err;
    let message = {
      status: 1
    }
    res.json(message)
  }
  )
}

// 交班商品明細
module.exports.inserWorkShiftDt = (req, res) => {
  const workshiftDt = {
    shift_id: req.body.shift_id,
    product_id: req.body.product_id, 
    product_class: req.body.product_class,
    product_name: req.body.product_name, 
    before_pcs: req.body.before_pcs, 
    inbound_pcs: req.body.inbound_pcs, 
    inbound_unit_sales_pcs: req.body.inbound_unit_sales_pcs, 
    retail_unit_sales_pcs: req.body.retail_unit_sales_pcs, 
    after_pcs: req.body.after_pcs, 
    sales_pcs: req.body.sales_pcs,
    total_sales: req.body.total_sales,
    used_pcs: req.body.used_pcs,
    nut_package: req.body.nut_package,
    nut_package_pcs: req.body.nut_package_pcs,
    unit: req.body.unit,
    inbound_unit_count: req.body.inbound_unit_count
  }
  const sql = 'INSERT INTO `workshift_dt` (`shift_id`, `product_id`, `product_class`,  `product_name`, `before_pcs`, `inbound_pcs`, `inbound_unit_sales_pcs`, `retail_unit_sales_pcs`, `after_pcs`, `sales_pcs`, `total_sales`, `used_pcs`, `nut_package`, `nut_package_pcs`, `unit`, `inbound_unit_count`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
  db.query(sql, [workshiftDt.shift_id, workshiftDt.product_id, workshiftDt.product_class,workshiftDt.product_name, workshiftDt.before_pcs, workshiftDt.inbound_pcs, workshiftDt.inbound_unit_sales_pcs, workshiftDt.retail_unit_sales_pcs, workshiftDt.after_pcs, workshiftDt.sales_pcs, workshiftDt.total_sales, workshiftDt.used_pcs, workshiftDt.nut_package, workshiftDt.nut_package_pcs, workshiftDt.unit, workshiftDt.inbound_unit_count], (err, result) => {
    if (err) throw err;
    const message = {
      status: 1
    }
    res.json(message)
    // shift_id(string):交班代碼 product_id(int):商品代碼 product_class(string):商品類別 product_name(string):商品名稱 before_pcs(int):交班前數量 inbound_pcs(int):進貨數量 inbound_unit_sales_pcs(int):進貨單位銷售量 retail_unit_sales_pcs(int):零售單位銷售量 after_pcs(int):交班後數量 sales_pcs(int):銷售量 total_sales(int):銷售金額 used_pcs(int):檳榔原料使用數量(只有檳榔有其他香菸檳榔填null) nut_package(int):檳榔列印標籤包數 nut_package_pcs(int):檳榔一包有幾顆的數量 unit(string):進貨單位 inbound_unit_count(int):進貨單位數量
  })
}

// inbound 進貨
module.exports.inbound = (req, res) => {
  const inboundValue = {
    store_id: req.body.store_id,
    store_name: req.body.store_name,
    category: req.body.category,
    product_name: req.body.product_name,
    product_id: req.body.product_id,
    inbound_count: req.body.inbound_count,
    inbound_unit: req.body.inbound_unit,
    inbound_unit_count: req.body.inbound_unit_count,
    shift_id: req.body.shift_id
  }
  console.log(inboundValue)
  const sql = "INSERT INTO `bndb`.`inbound` (`store_id`,`store_name`,`category`,`product_name`,`product_id`,  `inbound_count`, `inbound_unit`, `inbound_unit_count`,`shift_id`) VALUES(?,?,?,?,?,?,?,?,?)"
  db.query(sql, [inboundValue.store_id, inboundValue.store_name, inboundValue.category, inboundValue.product_name, inboundValue.product_id, inboundValue.inbound_count,  inboundValue.inbound_unit, inboundValue.inbound_unit_count, inboundValue.shift_id], (err, result) => {
    if (err) {
      console.log('sql error', err)
    } else {
      console.log("success")
    }
  })
}

// login 
module.exports.login = (req, res) => {
  const idnum = req.body.idnum
  const userPassword = req.body.password
  db.query('SELECT * FROM users WHERE id = ?', idnum, (err, result) => {
    if (err) {
      console.log('SQL error', error)
    } else if (Object.keys(result).length === 0) {
      const message = {
        ststus: 'no id number'
      }
      res.json(message)
    } else {
      const dbHashPassword = result[0].password
      bcrypt.compare(userPassword, dbHashPassword).then((response) => {
        if (response) { // 成功
          // 產生jwt
          const payload = {
            user_id: result[0].id,
            user_name: result[0].name
          }
          const token = jwt.sign({ payload, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)}, 'nut_manager');
          console.log('req.body', req.body, 'token', token)
          let na = [{
            status: "success login",
            idnum: idnum,
            password: userPassword,
            token: token
          }]
          res.json(na)
        } else {
          let message = {
            status: "密碼錯誤"
          }
          res.json(message)
        }
      })
    }
  })
}

// get user 
module.exports.userInfo = (req, res) => {
  const token = req.params.token
  const SECRET = 'nut_manager'
  const decoded = jwt.verify(token, SECRET)
  const user_id = decoded.payload.user_id
  db.query('SELECT store_id from users WHERE id = ?', user_id, (err, result) => {
    if (err) throw err;
    let storeid = result[0].store_id
    const userinfo = {
      user_id: decoded.payload.user_id,
      user_name: decoded.payload.user_name,
      store_id: storeid
    }
    res.json(userinfo)
  })
  
  
}

// get itemEdit 


// get store


// get checkin list
// module.exports.checkinlist

// insert product 
module.exports.addProduct = (req, res) => {
  const store_id = req.body.store_id // 店家
  const product_name = req.body.name  // 名稱
  const category = req.body.category // 類型
  const cost = req.body.cost // 進價
  const price = req.body.price // 售價
  const unit = req.body.unit // 單位
  const unit_count = req.body.unit_count // 進貨單位
  const use_yn = req.body.use_yn // 有無使用
  const sql = 'INSERT INTO products (`store_id`, `name`, `category`, `cost`, `price`, `unit`, `unit_count`, `use_yn`) VALUES (?,?,?,?,?,?,?,?)'
  db.query(sql, [store_id, product_name, category, cost, price, unit, unit_count, use_yn], (err, result) => {
    if(err) throw err;
    const message = {
      status: 1
    }
    res.json(message)
  })
}

// 11-1 更新庫存量
module.exports.updateInBoundStock = (req, res) => {
  const id = req.body.product_id
  const newstock = req.body.stock
  const inbound_unit_count = req.body.inbound_unit_count
  db.query("SELECT stock FROM products WHERE id = ?", id, (err,result) => {
    if(err) throw err;
    let stock = result[0].stock
    stock = stock + (newstock * inbound_unit_count)
    console.log("檳榔"  + stock)
    db.query("UPDATE products SET stock=?  where id=? ", [stock, id], (err, result) => {
       if(err) throw err;
       const message = { status: 1}
       res.json(message)
      })
  })
  // update bndb.products set stock=stock+25  where id=10 and name="特幼"
}