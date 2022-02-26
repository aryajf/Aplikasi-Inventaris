const {User} = require('../models')
const { Op } = require("sequelize")
const path = require('path')
const bcrypt = require('bcrypt')
const avatarPath = path.join(__dirname, '../public/images/avatar/')
const Validator = require('validatorjs')
const validatorMessage = require('../config/validatorMessage')
const {BASE_URL} = process.env
const {deleteFile, getPagination, getPagingData} = require('../config/mixins')

module.exports = {
    getUsers: async(req, res) => {
        await User.findAll().then(data=>{
            if(data.length == 0){
                res.json({totalItems : 0,message : 'User tidak ditemukan', status: false})
                return
            }
        })

        let { page } = req.query
        const { limit, offset } = getPagination(page, 10)

        await User.findAndCountAll({limit,offset,order:[['updatedAt', 'DESC']],where:{role: 'Asisten'}}).then(data => {
            const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)

            if(dataPaginate.length != 0 && !isNaN(currentPage)){
                res.json({
                    totalItems : totalItems,
                    limitItems : limit,
                    totalPages : totalPages,
                    currentPage : currentPage,
                    users : dataPaginate,
                    message: 'User berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: BASE_URL + 'user'
                    },
                    status: true
                })
            }else{res.json({totalItems : 0,message : 'User tidak ditemukan', status: false})}
        }).catch(() => {
            res.status(404).json({message : 'User tidak ditemukan', status: false})
        })
    },
    createUser: async(req, res) => {
        const userReq = {
            email: req.body.email,
            nama: req.body.nama,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        }
        
        if(userValidation(userReq, req.url) != null) return res.status(400).send(userValidation(userReq, req.url))
        
        let user = await findUserEmail(req.body.email)
        if(user){
            return res.status(400).json({email: req.body.email, message: 'Alamat email sudah digunakan', status: false})
        }else{
            try{
                await User.create({
                    email: userReq.email,
                    nama: userReq.nama,
                    password: hashPassword(userReq.password),
                    role: 'Asisten'
                })

                res.status(201).json({
                    message: 'User berhasil didaftarkan',
                    request: {
                        method: req.method,
                        url: BASE_URL + 'user'
                    },
                    status: true,
                })
            }catch(err){
                res.status(400).json({
                    error: err.message,
                    message: 'Terjadi kesalahan saat menambah user',
                    status: false
                })
            }
        }
    },
    showUsers: async(req, res) => {
        await User.findOne({where:{id:req.params.id,role: 'Asisten'}}).then(user => {
            if(user != null){
                res.json({
                    user : user,
                    message: 'User berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: BASE_URL + 'user/' + req.params.id
                    },
                    status: true
                })
            }else{res.status(400).json({message : 'User tidak ditemukan', status: false})}
        }).catch(() => {
            res.status(400).json({message : 'User tidak ditemukan', status: false})
        })
    },
    searchUsers: async(req, res) => {
        if(req.params.keyword == ''){
            res.status(404).json({message : 'User tidak ditemukan', status: false})
        }
        
        let { page } = req.query
        const { limit, offset } = getPagination(page, 10)

        await User.findAndCountAll({limit,offset,where:{
            [Op.or]: [{
                nama : {[Op.like]: `%${req.params.keyword}%`},
            },{
                email : {[Op.like]: `%${req.params.keyword}%`},
            },{
                phone : {[Op.like]: `%${req.params.keyword}%`},
            }],
            role: 'Asisten'
        }}).then(data => {
            const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)

            if(dataPaginate.length != 0 && !isNaN(currentPage)){
                res.json({
                    totalItems : totalItems,
                    limitItems : limit,
                    totalPages : totalPages,
                    currentPage : currentPage,
                    users : dataPaginate,
                    message: 'User berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: BASE_URL + 'user/search/' + req.params.keyword
                    },
                    status: true
                })
            }else{res.json({totalItems : 0, message : 'User tidak ditemukan', status: false})}
        }).catch(() => {
            res.json({totalItems : 0, message : 'User tidak ditemukan', status: false})
        })
    },
    deleteUser: async(req, res) => {
        const user = await findUser(req.params.id)
        if(user != null){
            deleteFile(avatarPath + user.avatar)
            try{
                user.destroy()

                res.json({
                    data : {
                        id: user.id,
                        email: user.email,
                        nama: user.nama,
                    },
                    message: 'Asisten berhasil dihapus',
                    request: {
                        method: req.method,
                        url: BASE_URL + 'user/' + req.params.id
                    },
                    status: true
                })
            }catch(err){
                res.status(400).json({
                    error: err.message,
                    message: 'Terjadi kesalahan saat menghapus user',
                    status: false
                })
            }
        }else{res.status(404).json({message : 'User tidak ditemukan', status: false})}
    },
}

function findUser(id){
    return User.findOne({where: {id: id}})
}

function findUserEmail(email){
    return User.findOne({where: {email: email}})
}

function hashPassword(password){
    return bcrypt.hashSync(password, 10, null)
}

function userValidation(dataRequest, url){
    let rules
    if(url == '/user'){
        rules = {
            nama: 'required|min:3',
            email: 'required|email|min:5',
            password: 'required|min:5',
            confirmPassword: 'required|min:5|same:password'
        }
    }

    let validation = new Validator(dataRequest, rules, validatorMessage)
    if(validation.fails()){
        return {
            message: "Harap isi form dengan benar",
            errors: validation.errors.errors
        }
    }
}