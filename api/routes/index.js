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
router.get('/chart-type', checkAuth, chart.type)
router.get('/chart-barang', checkAuth, chart.barang)
router.get('/chart-categories', checkAuth, chart.categories)
router.post('/login', auth.login)
router.get('/profile', checkAuth, auth.profile)
router.put('/profile/update', checkAuth, auth.updateProfile)
router.put('/profile/updateAvatar', checkAuth, fileUpload.single('avatar'), auth.updateAvatar)
router.post('/password/change', checkAuth, auth.changePassword)

// PDF
router.get('/pdf', checkAuth, pdf.index)

// BARANG
router.route('/barang')
  .get(checkAuth, barang.index)
  .post(checkAuth, Asisten, fileUpload.single('gambar'), barang.store)
  
router.route('/barang/stok/:id')
  .put(checkAuth, Asisten, barang.updateStok)

router.route('/barang/search/:keyword')
  .get(checkAuth, barang.search)

router.route('/barang/:id')
  .get(checkAuth, barang.show)
  .put(checkAuth, Asisten, fileUpload.single('gambar'), barang.update)
  .delete(checkAuth, Asisten, barang.delete)

// CATEGORY
router.route('/category')
  .get(checkAuth, Asisten, category.index)
  .post(checkAuth, Asisten, category.store)

router.route('/category/search/:keyword')
  .get(checkAuth, Asisten, category.search)

router.route('/category/:id')
  .get(checkAuth, Asisten, category.show)
  .put(checkAuth, Asisten, category.update)
  .delete(checkAuth, Asisten, category.delete)

// ADMIN
router.route('/user')
  .get(checkAuth, Admin, user.getUsers)
  .post(checkAuth, Admin, user.createUser)
router.route('/user/:id')
  .get(checkAuth, Admin, user.showUsers)
  .delete(checkAuth, Admin, user.deleteUser)
  
module.exports = router
