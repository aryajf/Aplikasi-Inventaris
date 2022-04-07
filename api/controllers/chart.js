const {Category, Barang} = require('../models')
const { Op } = require("sequelize")

module.exports = {
    type: async(req, res) => {
        try{
            let dasar = await Barang.findAll({where: {type: 'Dasar'}})
            let menengah = await Barang.findAll({where: {type: 'Menengah'}})
            let lanjut = await Barang.findAll({where: {type: 'Lanjut'}})
            if(!dasar && menengah && !lanjut){
                return res.status(404).json({message: 'Kategori belum ditambahkan', status: false})
            }else{
                const typeName = ['Dasar','Menengah','Lanjut']
                const typeStock = [dasar.length, menengah.length, lanjut.length]
                const typeColor = ['#'+Math.floor(Math.random()*16777215).toString(16), '#'+Math.floor(Math.random()*16777215).toString(16), '#'+Math.floor(Math.random()*16777215).toString(16)]
                
                res.json({
                    typeName : typeName,
                    typeStock : typeStock,
                    typeColor : typeColor,
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
    barang: async(req, res) => {
        try{
            let {type} = req.query
            if(!type){
                return res.status(404).json({message: 'Belum memilih tipe', status: false})
            }else{
                if(type === 'Semua Tipe'){
                    return res.status(404).json({message: 'Belum memilih tipe', status: false})
                }
            }

            let barang = await Barang.findAll({where: {type: type}})
            if(!barang){
                res.status(404).json({message: 'Barang belum ditambahkan', status: false})
            }else{
                const barangName = []
                const barangStock = []
                const barangColor = []
                barang.map(item => {
                    barangName.push(item.title)
                    barangStock.push(item.tersedia + item.dipakai + item.rusak)
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
            console.log(err)
            res.status(404).json({message : 'Terjadi kesalahan pada produk', status: false})
        }
    },
    categories: async(req, res) => {
        // let category = await Category.findAll({
        //     include: {
        //         model : Barang,
        //         as: 'barang'
        //     }
        // })
        // try{
        //     if(!category){
        //         return res.status(404).json({message: 'Kategori belum ditambahkan', status: false})
        //     }else{
        //         const categoriesName = []
        //         const categoriesStock = []
        //         const categoriesColor = []
        //         category.map(item => {
        //             categoriesName.push(item.title)
        //             categoriesStock.push(item.barang.length)
        //             categoriesColor.push('#'+Math.floor(Math.random()*16777215).toString(16))
        //         })
                
        //         res.json({
        //             categoriesName : categoriesName,
        //             categoriesStock : categoriesStock,
        //             categoriesColor : categoriesColor,
        //             message: 'Total kategori berhasil ditampilkan',
        //             request: {
        //                 method: req.method,
        //                 url: process.env.BASE_URL + 'product'
        //             },
        //             status: true
        //         })
        //     }
        // }catch(err){
        //     res.status(404).json({message : 'Terjadi kesalahan pada produk', status: false})
        // }
    }
}