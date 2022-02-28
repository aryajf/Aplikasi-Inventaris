const {Category, Barang, Status} = require('../models')
const { Op } = require("sequelize")
const path = require('path')
const {compressImage, deleteFile, makeDirectory, checkSlug, createSlug, getPagination, getPagingData} = require('../config/mixins')


module.exports = {
    allBarang: async(req, res) => {
        let { page } = req.query
        const { limit, offset } = getPagination(page, 12)

        await getBarang(limit, offset).then(async (data) => {
            const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)

            const listBarang = []

            dataPaginate.map(item => {
                let dasar = 0
                let menengah = 0
                let lanjut = 0
                item.status.map(status => {
                    if(status.location == 'Dasar'){
                        dasar += status.stok
                    }
                    if(status.location == 'Menengah'){
                        menengah += status.stok
                    }
                    if(status.location == 'Lanjut'){
                        lanjut += status.stok
                    }
                })
                listBarang.push({
                    title: item.title,
                    slug: item.slug,
                    category: item.category.title,
                    dasar: dasar,
                    menengah: menengah,
                    lanjut: lanjut,
                })
            })
            
            if(dataPaginate.length != 0 && !isNaN(currentPage)){
                res.json({
                    totalItems : totalItems,
                    limitItems : limit,
                    totalPages : totalPages,
                    currentPage : currentPage,
                    barang : listBarang,
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
    showBarang: async(req, res) => {
        let { page } = req.query
        const { limit, offset } = getPagination(page, 12)
        const type = req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1)

        await Barang.findAndCountAll({
            include: [{
                model: Category,
                as: 'category',
            },{
                model: Status,
                as: 'status',
                where: {
                    location: type
                },
            }],
            limit: limit,
            offset: offset,
            order:[['updatedAt', 'ASC']]
        }).then(async (data) => {
            const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)
            
            if(dataPaginate.length != 0 && !isNaN(currentPage)){
                res.json({
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
        }).catch((err) => {
            res.status(404).json({message : 'Barang tidak ditemukan', status: false})
        })
    },
    allCategories: async(req, res) => {
        let category = await Category.findAll({
            include: {
                model : Barang,
                as: 'barang'
            }
        })
        try{
            if(!category){
                res.status(404).json({message: 'Kategori belum ditambahkan', status: false})
            }else{
                const categoriesName = []
                const categoriesStock = []
                const categoriesColor = []
                category.map(item => {
                    categoriesName.push(item.title)
                    categoriesStock.push(item.barang.length)
                    categoriesColor.push('#'+Math.floor(Math.random()*16777215).toString(16))
                })
                
                res.json({
                    categoriesName : categoriesName,
                    categoriesStock : categoriesStock,
                    categoriesColor : categoriesColor,
                    message: 'Total kategori berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'product'
                    },
                    status: true
                })
            }
        }catch(err){
            res.status(404).json({message : 'Terjadi kesalahan pada produk', status: false})
        }
    }
}

async function getBarang(limit, offset, keyword){
    let statement

    if(keyword){
        statement = {
            where: {
                title:{}
            },
            include: [{
                model : Category,
                as: 'category'
            },{
                model : Status,
                as: 'status'
            }],
            limit,offset,order:[['updatedAt', 'ASC']]
        }
    }else{
        statement = {
            where: {},
            include: [{
                model : Category,
                as: 'category'
            },{
                model : Status,
                as: 'status'
            }],
            limit,offset,order:[['updatedAt', 'ASC']]
        }
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