const db = require('../models/db')

exports.login = (req, res) => {

  res.render('login')
}

exports.home = (req, res) => res.render('home')
exports.checkin = (req, res) => res.render('checkin')
exports.workshift = (req, res) => res.render('workshift')
exports.printAndSale = (req, res) => res.render('printAndSale')
exports.checkinList = (req, res) => res.render('checkinList')
exports.purchase = (req, res) => res.render('purchase')
exports.manager = (req, res) => res.render('manager')
exports.saleRank = (req, res) => res.render('saleRank')
exports.monlyReport = (req, res) => res.render('monlyReport')
exports.itemData = (req, res) => res.render('itemData')
exports.errorfix = (req, res) => res.render('errorfix')
exports.record = (req, res) => res.render('record')

// page test 
exports.pagetest = (req, res) => res.render('pagetest')

// error
exports.notFound = (req, res) => res.render('404')
exports.serverError = (err, req, res, next) => res.render('500')