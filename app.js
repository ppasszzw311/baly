const express = require('express')
const { engine } = require('express-handlebars')
const sassMiddleware = require('node-sass-middleware')
const path = require('path')

const PORT = process.env.PORT || '8080'

const app = express()
app.set('port', PORT)

// main js
const menu = require('./lib/handlers')


// set engine
app.engine('handlebars', engine ({extname:'.hbs', defultLayous: 'main', }))
app.set('view engine', 'handlebars')
app.set('views', './views')

// set public filedirect 
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'scss'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
  })
)
app.use(express.static(__dirname + '/public'))


// db
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// page


app.get('/', (req,res) => res.render('index'))
app.get('/intro1', (req,res) => res.render('intro1'))
app.get('/intro2', (req,res) => res.render('intro2'))
app.get('/intro3', (req,res) => res.render('intro3'))








// 自訂404
app.use(menu.notFound)

// 自訂500 網頁
app.use(menu.serverError)

if(require.main === module) {
  app.listen(PORT, () => console.log(`
  Express started on http://localhost:${PORT}; `
  ))
} else {
  module.exports = app
}