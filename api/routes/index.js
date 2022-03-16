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
const isAdmin = require('../middleware/isAdmin')

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
router.get('/all-barang', table.allBarang)
router.get('/all-barang/search/:keyword', table.searchAllBarang)
router.get('/all-barang/search/:keyword/:type', table.searchShowBarang)
router.get('/all-barang/:type', table.showBarang)
router.get('/chart-barang', chart.barang)
router.get('/chart-categories', chart.categories)
router.post('/login', auth.login)
router.get('/profile', checkAuth, auth.profile)
router.put('/profile/update', checkAuth, auth.updateProfile)
router.put('/profile/updateAvatar', checkAuth, fileUpload.single('avatar'), auth.updateAvatar)
router.post('/password/forgot', auth.forgotPasswordRequest)
router.put('/password/update/:email/:token', auth.updatePassword)
router.post('/password/change', checkAuth, auth.changePassword)

// PDF
router.get('/pdf', pdf.index)
router.get('/pdf/:type', pdf.show)

// BARANG
router.route('/barang')
  .get(barang.index)
  .post(checkAuth, fileUpload.single('gambar'), barang.store)

router.route('/barang/search/:keyword')
  .get(barang.search)

router.route('/barang/:slug')
  .get(barang.show)
  .put(checkAuth, fileUpload.single('gambar'), barang.update)
  .delete(checkAuth, barang.delete)

// CATEGORY
router.route('/category')
  .get(category.index)
  .post(checkAuth, category.store)

router.route('/category/search/:keyword')
  .get(category.search)

router.route('/category/:id')
  .get(category.show)
  .put(checkAuth, category.update)
  .delete(checkAuth, category.delete)

// STATUS
router.route('/status')
  .get(status.index)

router.route('/status/:id')
  .get(status.show)
  .put(checkAuth, status.update)

// ADMIN
router.route('/user')
  .get(checkAuth, isAdmin, user.getUsers)
  .post(checkAuth, isAdmin, user.createUser)
router.route('/user/search/:keyword')
    .get(checkAuth, isAdmin, user.searchUsers)
router.route('/user/:id')
  .get(checkAuth, isAdmin, user.showUsers)
  .delete(checkAuth, isAdmin, user.deleteUser)
  
module.exports = router
