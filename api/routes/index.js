var express = require('express')
var router = express.Router()
const {User} = require('../models')
const bcrypt = require('bcrypt')

// CALL CONTROLLER
const auth = require('../controllers/auth')
const barang = require('../controllers/barang')
const table = require('../controllers/table')
const chart = require('../controllers/chart')
const category = require('../controllers/category')
const pdf = require('../controllers/pdf')
const status = require('../controllers/status')
const user = require('../controllers/user')

// CALL MIDDLEWARE
const checkAuth = require('../middleware/checkAuth')
const fileUpload = require('../middleware/fileUpload')
const {Admin, Asisten} = require('../middleware/Roles');

router.get('/', async function(req, res, next) {
  let email = 'admin@gmail.com'
  let user = await User.findOne({where: {email: email}})
  if(user){
    res.status(500).json("Email sudah digunakan")
    return
  }

  await User.create({
    email: email,
    nama: 'Admin',
    password: bcrypt.hashSync('12345', 10, null),
    no_telp: '081248683857',
    role: 'Admin',
    createdAt: new Date(),
    updatedAt: new Date()
  })

  res.send('hello lab psikologi')
})

// AUTH
router.get('/all-barang', checkAuth, table.allBarang)
router.get('/all-barang/search/:keyword', checkAuth, table.searchAllBarang)
router.get('/all-barang/search/:keyword/:type', checkAuth, table.searchShowBarang)
router.get('/all-barang/:type', checkAuth, table.showBarang)
router.get('/chart-barang', checkAuth, chart.barang)
router.get('/chart-categories', checkAuth, chart.categories)
router.post('/login', auth.login)
router.get('/profile', checkAuth, auth.profile)

// PDF
router.get('/pdf', checkAuth, pdf.index)
router.get('/pdf/:type', checkAuth, pdf.show)

// BARANG
router.route('/barang')
  .get(checkAuth, barang.index)
  .post(checkAuth, fileUpload.single('gambar'), barang.store)

router.route('/barang/search/:keyword')
  .get(checkAuth, barang.search)

router.route('/barang/:slug')
  .get(checkAuth, barang.show)
  .put(checkAuth, fileUpload.single('gambar'), barang.update)
  .delete(checkAuth, barang.delete)

// CATEGORY
router.route('/category')
  .get(checkAuth, category.index)
  .post(checkAuth, category.store)

router.route('/category/search/:keyword')
  .get(checkAuth, category.search)

router.route('/category/:id')
  .get(checkAuth, category.show)
  .put(checkAuth, category.update)
  .delete(checkAuth, category.delete)

// STATUS
router.route('/status')
  .get(checkAuth, status.index)

router.route('/status/:id')
  .get(checkAuth, status.show)
  .put(checkAuth, status.update)

// ADMIN
router.route('/user')
  .get(checkAuth, Admin, user.getUsers)
  .post(checkAuth, Admin, user.createUser)
router.route('/user/search/:keyword')
    .get(checkAuth, Admin, user.searchUsers)
router.route('/user/:id')
  .get(checkAuth, Admin, user.showUsers)
  .delete(checkAuth, Admin, user.deleteUser)
  
module.exports = router
