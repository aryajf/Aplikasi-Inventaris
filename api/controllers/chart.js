const {Category, Barang, Status} = require('../models')
const { Op } = require("sequelize")

module.exports = {
    barang: async(req, res) => {
        let barang = await Barang.findAll({
            include: {
                model : Status,
                as: 'status'
            }
        })
        try{
            if(!barang){
                res.status(404).json({message: 'Kategori belum ditambahkan', status: false})
            }else{
                const barangName = []
                const barangStock = []
                const barangColor = []
                barang.map(item => {
                    let stok = 0
                    item.status.map(status => {
                        stok += status.stok
                    })
                    barangName.push(item.title)
                    barangStock.push(stok)
                    barangColor.push('#'+Math.floor(Math.random()*16777215).toString(16))
                })
                
                res.json({
                    barangName : barangName,
                    barangStock : barangStock,
                    barangColor : barangColor,
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
    },
    categories: async(req, res) => {
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