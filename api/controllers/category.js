const {Category, User, Barang, Status} = require('../models')
const { Op } = require("sequelize")
const path = require('path')
const Validator = require('validatorjs')
const validatorMessage = require('../config/validatorMessage')
const {compressImage, deleteFile, makeDirectory, getPagination, getPagingData} = require('../config/mixins')


module.exports = {
    index: async(req, res) => {
        let { page } = req.query
        const { limit, offset } = getPagination(page, 12)

        await getCategory(limit, offset).then(async (data) => {
            const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)
            
            if(dataPaginate.length != 0 && !isNaN(currentPage)){
                res.json({
                    totalItems : totalItems,
                    limitItems : limit,
                    totalPages : totalPages,
                    currentPage : currentPage,
                    category : dataPaginate,
                    message: 'Status berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'category'
                    },
                    status: true
                })
            }else{res.json({totalItems : 0, data: dataPaginate, message : 'Belum ada Kategori', status: false})}
        }).catch((err) => {
            res.status(404).json({message : 'Status tidak ditemukan', status: false})
        })
    },
    search: async(req, res) => {
        if(req.params.keyword == ''){
            res.status(404).json({message : 'Status tidak ditemukan', status: false})
        }

        let { page } = req.query
        const { limit, offset } = getPagination(page, 12)
        
        await getCategory(limit, offset, req.params.keyword).then(async(data) => {
            const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)

            if(dataPaginate.length != 0 && !isNaN(currentPage)){
                res.json({
                    totalItems : totalItems,
                    limitItems : limit,
                    totalPages : totalPages,
                    currentPage : currentPage,
                    category : dataPaginate,
                    message: 'Status berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'category'
                    },
                    status: true
                })
            }else{res.json({totalItems : 0, data: dataPaginate, message : 'Status tidak ditemukan', status: false})}
        }).catch(() => {
            res.status(404).json({message : 'Terjadi kesalahan saat mencari Status', status: false})
        })
    },
    show: async(req, res) => {
        try{
            const category = await findCategory(req.params.id)
            res.json({
                category : category,
                message: 'Item berhasil ditampilkan',
                request: {
                    method: req.method,
                    url: process.env.BASE_URL + 'category/' + req.params.id
                },
                status: true
            })
        }catch(err){
            res.status(404).json({message : 'Terjadi kesalahan saat menampilkan item', status: false})
        }
    },
    store: async(req, res) => {
        let categoryReq = {
            title: req.body.title,
        }

        if(categoryValidation(categoryReq) != null){
            return res.status(400).send(categoryValidation(categoryReq))
        }
        
        try{
            await Category.create(categoryReq)
            res.status(201).json({
                message: 'Item berhasil ditambah',
                request: {
                    method: req.method,
                    url: process.env.BASE_URL + 'category'
                },
                status: true,
            })
        }catch(err){
            res.status(400).json({
                error: err.message,
                message: 'Terjadi kesalahan saat menambah item',
                status: false
            })
        }
    },
    update: async(req, res) => {
        let category = await findCategory(req.params.id)
        if(category == null){
            res.status(404).json({message : 'Item tidak ditemukan', status: false})
            return 
        }

        let categoryReq = {
            title: req.body.title,
        }

        if(categoryValidation(categoryReq) != null){
            return res.status(400).send(categoryValidation(categoryReq))
        }

        try{
            category.update(categoryReq)
            res.status(201).json({
                data: {
                    id: category.id,
                    title: category.title,
                },
                message: 'Item berhasil diubah',
                request: {
                    method: req.method,
                    url: process.env.BASE_URL + 'category/' + req.params.id
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
        let category = await findCategory(req.params.id)
        if(category != null){
            try{
                category.destroy()
                let barang = await Barang.findAll({where:{category_id: category.id}})
                barang.map(async (item) => {
                    await Barang.destroy({where:{id: item.id}})
                    await Status.destroy({where:{barang_id: item.id}})
                })

                res.json({
                    message: 'Item berhasil dihapus',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'category/' + req.params.id
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

function findCategory(id){
    return Category.findOne({where: {id: id}})
}

async function getCategory(limit, offset, keyword){
    let statement

    if(keyword){
        statement = {
            where: {
                title:{}
            },
            limit,offset,order:[['updatedAt', 'DESC']]
        }
    }else{
        statement = {
            where: {},
            limit,offset,order:[['updatedAt', 'DESC']]
        }
    }
    
    if(keyword){
        statement.where.title = {
            [Op.like]: `%${keyword}%`
        }
    }

    return Category.findAndCountAll(statement)
}

function categoryValidation(dataRequest){
    let rules = {
        title: 'required|min:3',
    }
    
    let validation = new Validator(dataRequest, rules, validatorMessage)
    if(validation.fails()){
        return {
            message: "Harap isi form dengan benar",
            errors: validation.errors.errors
        }
    }
}