const {Category, User, History, Barang, Status} = require('../models')
const { Op } = require("sequelize")
const path = require('path')
const barangGambarPath = path.join(__dirname, '../public/images/barang/')
const Validator = require('validatorjs')
const validatorMessage = require('../config/validatorMessage')
const {compressImage, deleteFile, makeDirectory, getPagination, getPagingData} = require('../config/mixins')


module.exports = {
    index: async(req, res) => {
        let { type, page, category, keyword } = req.query
        const { limit, offset } = getPagination(page, 12)
        let categoryName = 'Semua Barang'
        const where = {}

        if(type){
            if(req.decoded.role === 'Admin'){
                where.type = type
            }else{
                where.type = req.decoded.role
            }
        }else{
            if(req.decoded.role !== 'Admin'){
                where.type = req.decoded.role
            }
        }

        if(category){
            let categoryData = await Category.findOne({where: {category_id: category}})
            if(categoryData == null){
                return res.status(404).json({message : 'Kategori tidak ditemukan', status: false})
            }
            categoryName = categoryData.title
            where.category_id = category
        }
        
        if(keyword){
            where.title = {
                [Op.like]: `%${keyword}%`
            }
        }

        await Barang.findAndCountAll({
            where: where,
            include: [{
                model : Category,
                as: 'category',
            },{
                model : History,
                as: 'histories',
            }],
            limit,offset,order:[['updatedAt', 'ASC']]
        }).then(async (data) => {
            const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)
            console.log(dataPaginate)
            
            if(dataPaginate.length != 0 && !isNaN(currentPage)){
                res.json({
                    categoryName: categoryName,
                    totalItems : totalItems,
                    limitItems : limit,
                    totalPages : totalPages,
                    currentPage : currentPage,
                    barang : dataPaginate,
                    message: 'Barang berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'barang'
                    },
                    status: true
                })
            }else{res.json({totalItems : 0, barang: dataPaginate, message : 'Belum ada barang', status: false})}
        }).catch(() => {
            res.status(404).json({message : 'Barang tidak ditemukan', status: false})
        })
    },
    show: async(req, res) => {
        try{
            const barang = await findBarang(req.params.id)
            res.json({
                barang : barang,
                message: 'Item berhasil ditampilkan',
                request: {
                    method: req.method,
                    url: process.env.BASE_URL + 'barang/' + req.params.id
                },
                status: true
            })
        }catch(err){
            res.status(404).json({message : 'Terjadi kesalahan saat menampilkan item', status: false})
        }
    },
    store: async(req, res) => {
        let barangReq = {
            title: req.body.title,
            description: req.body.description,
            gambar: '',
            category_id: req.body.category_id,
            type: req.decoded.role,
            tersedia: 0,
            dipakai: 0,
            rusak: 0,
        }
        
        !req.file ? barangReq.gambar = null : barangReq.gambar = req.file.filename
        if(barangValidation(barangReq) != null){
            res.status(400).send(barangValidation(barangReq))
            if(barangReq.gambar){
                deleteFile(req.file.path)
            }
            return
        }

        try{
            let barang = await Barang.create(barangReq)
            
            // 1. Make directory 2. Compress image
            makeDirectory(barangGambarPath)
            compressImage('public/uploads/'+req.file.filename, barangGambarPath, req.file.path)
            res.status(201).json({
                data: {
                    id: barang.id,
                    title: barang.title,
                },
                message: 'Item berhasil ditambah',
                request: {
                    method: req.method,
                    url: process.env.BASE_URL + 'barang'
                },
                status: true,
            })
        }catch(err){
            deleteFile(req.file.path)
            res.status(400).json({
                error: err.message,
                message: 'Terjadi kesalahan saat menambah item',
                status: false
            })
        }
    },
    update: async(req, res) => {
        let barang = await findBarang(req.params.id)
        if(barang == null){
            res.status(404).json({message : 'Item tidak ditemukan', status: false})
            deleteFile(req.file.path)
            return 
        }

        let categoryId = barang.category_id

        let barangReq = {
            title: req.body.title,
            description: req.body.description,
            gambar: '',
            category_id: req.body.category_id ? req.body.category_id : categoryId,
            tersedia: req.body.tersedia,
            dipakai: req.body.dipakai,
            rusak: req.body.rusak,
        }
        
        if(!req.file){
            barangReq.gambar = barang.gambar
            if(barangValidation(barangReq) != null){
                res.status(400).send(barangValidation(barangReq))
                return
            }
        }else{
            barangReq.gambar = req.file.filename
            if(barangValidation(barangReq) != null){
                res.status(400).send(barangValidation(barangReq))
                deleteFile(req.file.path)
                return
            }
            compressImage('public/uploads/'+req.file.filename, barangGambarPath, req.file.path)
            deleteFile(barangGambarPath + barang.gambar)
        }

        try{
            barang.update(barangReq)
            res.status(201).json({
                data: {
                    id: barang.id,
                    title: barang.title,
                },
                message: 'Item berhasil diubah',
                request: {
                    method: req.method,
                    url: process.env.BASE_URL + 'barang/' + req.params.id
                },
                status: true,
            })
        }catch(err){
            res.status(400).json({
                error: err.message,
                message: 'Terjadi kesalahan saat mengubah item',
                status: false
            })
        }
    },
    updateStok: async(req, res) => {
        let barang = await findBarang(req.params.id)
        if(barang == null){
            res.status(404).json({message : 'Item tidak ditemukan', status: false})
            deleteFile(req.file.path)
            return 
        }

        let barangReq = {
            tersedia: req.body.tersedia,
            dipakai: req.body.dipakai,
            rusak: req.body.rusak,
        }

        if(stokValidation(barangReq) != null){
            return res.status(400).send(stokValidation(barangReq))
        }

        try{
            barang.update(barangReq)
            await History.create({
                barang_id: barang.id,
                user_id: req.decoded.id,
                tersedia: barangReq.tersedia,
                dipakai: barangReq.dipakai,
                rusak: barangReq.rusak,
            })
            res.status(201).json({
                data: {
                    id: barang.id,
                    title: barang.title,
                },
                message: 'Item berhasil diubah',
                request: {
                    method: req.method,
                    url: process.env.BASE_URL + 'barang/stok/' + req.params.id
                },
                status: true,
            })
        }catch(err){
            res.status(400).json({
                error: err.message,
                message: 'Terjadi kesalahan saat mengubah item',
                status: false
            })
        }
    },
    delete: async(req, res) => {
        let barang = await findBarang(req.params.id)
        if(barang != null){
            deleteFile(barangGambarPath + barang.gambar)

            try{
                barang.destroy()
                await Status.destroy({where: {barang_id: barang.id}})

                res.json({
                    message: 'Item berhasil dihapus',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'barang/' + req.params.id
                    },
                    status: true
                })
            }catch(err){
                res.status(400).json({
                    error: err.message,
                    message: 'Terjadi kesalahan saat menghapus item',
                    status: false
                })
            }
        }else{res.status(404).json({message : 'Item tidak ditemukan', status: false})}
    },
    
}

function findBarang(id){
    return Barang.findOne({where: {id: id}, include: [{
        model : Category,
        as: 'category',
    },{
        model : History,
        as: 'histories',
        include: {
            model : User,
            as: 'user',
        }
    }]})
}

function barangValidation(dataRequest){
    let rules = {
        title: 'required|min:3',
        description: 'required|min:3',
        gambar: 'required',
        category_id: 'required',
    }
    
    let validation = new Validator(dataRequest, rules, validatorMessage)
    if(validation.fails()){
        return {
            message: "Harap isi form dengan benar",
            errors: validation.errors.errors
        }
    }
}

function stokValidation(dataRequest){
    let rules = {
        tersedia: 'required|numeric',
        dipakai: 'required|numeric',
        rusak: 'required|numeric',
    }
    
    let validation = new Validator(dataRequest, rules, validatorMessage)
    if(validation.fails()){
        return {
            message: "Harap isi form dengan benar",
            errors: validation.errors.errors
        }
    }
}