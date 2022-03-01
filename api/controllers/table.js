const {Category, Barang, Status} = require('../models')
const { Op } = require("sequelize")
const {getPagination, getPagingData} = require('../config/mixins')


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
    searchAllBarang: async(req, res) => {
        let { page } = req.query
        const { limit, offset } = getPagination(page, 12)

        await getBarang(limit, offset, req.params.keyword).then(async (data) => {
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

            dataPaginate.map(barang => {
                barang.dataValues.tersedia = 0
                barang.dataValues.dipakai = 0
                barang.dataValues.rusak = 0
                barang.status.map(status => {
                    if(status.status == 'Tersedia') barang.dataValues.tersedia = status.stok
                    if(status.status == 'Dipakai') barang.dataValues.dipakai = status.stok
                    if(status.status == 'Rusak') barang.dataValues.rusak = status.stok
                })
                delete barang.dataValues.status
            })
            
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
    searchShowBarang: async(req, res) => {
        console.log(req.params)
        let { page } = req.query
        const { limit, offset } = getPagination(page, 12)
        const type = req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1)

        await Barang.findAndCountAll({
            where: {
                title: {
                    [Op.like]: `%${req.params.keyword}%`
                }
            },
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

            dataPaginate.map(barang => {
                barang.dataValues.tersedia = 0
                barang.dataValues.dipakai = 0
                barang.dataValues.rusak = 0
                barang.status.map(status => {
                    if(status.status == 'Tersedia') barang.dataValues.tersedia = status.stok
                    if(status.status == 'Dipakai') barang.dataValues.dipakai = status.stok
                    if(status.status == 'Rusak') barang.dataValues.rusak = status.stok
                })
                delete barang.dataValues.status
            })
            
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