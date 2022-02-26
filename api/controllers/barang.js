const {Category, User, Barang, Status} = require('../models')
const { Op } = require("sequelize")
const path = require('path')
const barangGambarPath = path.join(__dirname, '../public/images/barang/')
const Validator = require('validatorjs')
const validatorMessage = require('../config/validatorMessage')
const {compressImage, deleteFile, makeDirectory, checkSlug, createSlug, getPagination, getPagingData} = require('../config/mixins')


module.exports = {
    index: async(req, res) => {
        let { page, category } = req.query
        const { limit, offset } = getPagination(page, 12)
        let categoryName = 'Semua Barang'

        if(category){
            let categoryData = await Category.findOne({where: {category_id: category}})
            if(categoryData == null){
                return res.status(404).json({message : 'Kategori tidak ditemukan', status: false})
            }
            categoryName = categoryData.title
        }

        await getBarang(limit, offset, category).then(async (data) => {
            const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)
            
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
            }else{res.json({totalItems : 0, data: dataPaginate, message : 'Belum ada barang', status: false})}
        }).catch(() => {
            res.status(404).json({message : 'Barang tidak ditemukan', status: false})
        })
    },
    search: async(req, res) => {
        if(req.params.keyword == ''){
            res.status(404).json({message : 'Barang tidak ditemukan', status: false})
        }

        let { page, category } = req.query
        const { limit, offset } = getPagination(page, 12)
        let categoryName = 'Semua Produk'

        if(category){
            let categoryData = await Category.findOne({where: {id: category, type: 'Barang'}})
            if(categoryData == null){
                return res.status(404).json({message : 'Kategori tidak ditemukan', status: false})
            }
            categoryName = categoryData.title
        }
        
        await getBarang(limit, offset, category, req.params.keyword).then(async(data) => {
            const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)

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
            }else{res.json({totalItems : 0, data: dataPaginate, message : 'Barang tidak ditemukan', status: false})}
        }).catch(() => {
            res.status(404).json({message : 'Terjadi kesalahan saat mencari barang', status: false})
        })
    },
    show: async(req, res) => {
        try{
            const barang = await findBarang(req.params.slug)
            res.json({
                barang : barang,
                message: 'Item berhasil ditampilkan',
                request: {
                    method: req.method,
                    url: process.env.BASE_URL + 'barang/' + req.params.slug
                },
                status: true
            })
        }catch(err){
            res.status(404).json({message : 'Terjadi kesalahan saat menampilkan item', status: false})
        }
    },
    store: async(req, res) => {
        let slug, title = req.body.title
        title == null ? slug = title : slug = createSlug(title)

        let barangReq = {
            title: req.body.title,
            description: req.body.description,
            slug: slug,
            gambar: '',
            category_id: req.body.category_id,
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
            let checkSlug = await Barang.findOne({where: {slug: barangReq.slug}})
            if(checkSlug){
                barangReq.slug = createSlug(title) + '-' + 1
            }
            let barang = await Barang.create(barangReq)
            
            
            // Untuk tipe Dasar
            await Status.create({location: 'Dasar',status: 'Tersedia',stok: 0,barang_id: barang.id})
            await Status.create({location: 'Dasar',status: 'Dipakai',stok: 0,barang_id: barang.id})
            await Status.create({location: 'Dasar',status: 'Rusak',stok: 0,barang_id: barang.id})

            // Untuk tipe Menengah
            await Status.create({location: 'Menengah',status: 'Tersedia',stok: 0,barang_id: barang.id})
            await Status.create({location: 'Menengah',status: 'Dipakai',stok: 0,barang_id: barang.id})
            await Status.create({location: 'Menengah',status: 'Rusak',stok: 0,barang_id: barang.id})

            // Untuk tipe Lanjut
            await Status.create({location: 'Lanjut',status: 'Tersedia',stok: 0,barang_id: barang.id})
            await Status.create({location: 'Lanjut',status: 'Dipakai',stok: 0,barang_id: barang.id})
            await Status.create({location: 'Lanjut',status: 'Rusak',stok: 0,barang_id: barang.id})
            
            // 1. Make directory 2. Compress image
            makeDirectory(barangGambarPath)
            compressImage('public/uploads/'+req.file.filename, barangGambarPath, req.file.path)
            res.status(201).json({
                data: {
                    slug: barang.slug,
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
            console.log(err)
            deleteFile(req.file.path)
            res.status(400).json({
                error: err.message,
                message: 'Terjadi kesalahan saat menambah item',
                status: false
            })
        }
    },
    update: async(req, res) => {
        let barang = await findBarang(req.params.slug)
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
                    slug: barang.slug,
                    title: barang.title,
                },
                message: 'Item berhasil diubah',
                request: {
                    method: req.method,
                    url: process.env.BASE_URL + 'barang/' + req.params.slug
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
        let barang = await findBarang(req.params.slug)
        if(barang != null){
            deleteFile(barangGambarPath + barang.gambar)

            try{
                barang.destroy()
                await Status.destroy({where: {barang_id: barang.id}})

                res.json({
                    message: 'Item berhasil dihapus',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'barang/' + req.params.slug
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

function findBarang(slug){
    return Barang.findOne({where: {slug: slug}, include: [{
        model : Status,
        as: 'status'
    },{
        model : Category,
        as: 'category'
    }]})
}

async function getBarang(limit, offset, category, keyword){
    let statement

    if(keyword){
        statement = {
            where: {
                title:{}
            },
            include: {
                model : Category,
                as: 'category'
            },
            limit,offset,order:[['updatedAt', 'ASC']]
        }
    }else{
        statement = {
            where: {},
            include: {
                model : Category,
                as: 'category'
            },
            limit,offset,order:[['updatedAt', 'ASC']]
        }
    }

    if(category){
        statement.where.category_id = category
    }
    
    if(keyword){
        statement.where.title = {
            [Op.like]: `%${keyword}%`
        }
    }

    return Barang.findAndCountAll(statement)
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