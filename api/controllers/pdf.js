const {Category, Barang, History, User} = require('../models')
const { Op } = require("sequelize")
const path = require('path')
const pdfHistoryPath = path.join(__dirname, '../public/pdf/history/')
const pdfBarangPath = path.join(__dirname, '../public/pdf/barang/')
const moment = require("moment/min/moment-with-locales")
var pdf = require("pdf-creator-node")
var fs = require("fs")
const {deleteFile} = require('../config/mixins')

module.exports = {
    barang: async(req, res) => {
        const {type, keyword} = req.query
        const where = {}
        if(type){
            if(req.decoded.role === 'Admin'){
                if(type !== 'Semua Tipe'){
                    where.type = type
                }
            }else{
                where.type = req.decoded.role
            }
        }else{
            if(req.decoded.role !== 'Admin'){
                where.type = req.decoded.role
            }
        }

        if(keyword){
            where.title = {
                [Op.like]: `%${keyword}%`
            }
        }
        let barang = await Barang.findAll({
            where: where,
            include: [{
                model: Category,
                as: 'category',
            }],
            order:[['title', 'DESC']]
        })
        if(barang.length <= 0){
            res.status(404).json({message : 'Tipe tidak ditemukan', status: false})
        }else{
            let nameFile = `barang-${now.getTime().toString()}.pdf`
            let pdfOutput = `${pdfHistoryPath}${nameFile}`
            var html = fs.readFileSync(path.join(__dirname, '../views/pdf/barang-template.html'), "utf8");
            var options = {
                format: "A3",
                orientation: "portrait",
                border: "10mm",
                header: {
                    height: "45mm",
                    contents: '<h1 style="text-align: center;">Laporan Barang</h1>'
                },
            }

            var document = {
                html: html,
                data: {
                    barang: barang.map((item) => ({
                        type: item.type,
                        title: item.title,
                        category: item.category.title,
                        total: item.tersedia + item.dipakai + item.rusak,
                        tersedia: item.tersedia,
                        dipakai: item.dipakai,
                        rusak: item.rusak,
                    })),
                },
                path: pdfOutput,
                type: "",
            }

            try{
                await pdf.create(document, options)
                setTimeout(()=>{
                    deleteFile(pdfBarangPath + nameFile)
                }, 30000)
                res.json({
                    pdf: process.env.BASE_URL + `pdf/barang/${nameFile}`,
                    message: 'PDF berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'pdf'
                    },
                    status: true
                })
            }catch(err){
                res.status(404).json({message : 'Terjadi kesalahan saat mengunduh', status: false})
            }
        }
    },
    history: async(req, res) => {
        const {type, keyword} = req.query
        const include = [{
            model : Barang,
            as: 'barang',
            where: {}
        },{
            model : User,
            as: 'user',
        }]
        if(type){
            if(req.decoded.role === 'Admin'){
                if(type !== 'Semua Tipe'){
                    include[0].where.type = type
                }
            }else{
                include[0].where.type = req.decoded.role
            }
        }else{
            if(req.decoded.role !== 'Admin'){
                include[0].where.type = req.decoded.role
            }
        }

        if(keyword){
            include[0].where.title = {
                [Op.like]: `%${keyword}%`
            }
        }
        let history = await History.findAll({
            include: include,
            order: [['updatedAt', 'DESC']]
        })
        if(history.length <= 0){
            res.status(404).json({message : 'Tipe tidak ditemukan', status: false})
        }else{
            const now = new Date()
            let nameFile = `history-${now.getTime().toString()}.pdf`
            let pdfOutput = `${pdfHistoryPath}${nameFile}`
            var html = fs.readFileSync(path.join(__dirname, '../views/pdf/history-template.html'), "utf8");
            var options = {
                format: "A3",
                orientation: "portrait",
                border: "10mm",
                header: {
                    height: "45mm",
                    contents: '<h1 style="text-align: center;">Laporan Riwayat Stok</h1>'
                },
            }

            var document = {
                html: html,
                data: {
                    history: history.map((item) => ({
                        type: item.barang.type,
                        title: item.barang.title,
                        total: item.tersedia + item.dipakai + item.rusak,
                        tersedia: item.tersedia,
                        dipakai: item.dipakai,
                        rusak: item.rusak,
                        user_name: item.user.nama,
                        user_phone: item.user.phone ? `+62 ${item.user.phone}` : 'nomor belum ditambahkan',
                        updatedAt: moment(item.updatedAt).locale('id').format('L, LTS')
                    })),
                },
                path: pdfOutput,
                type: "",
            }

            try{
                await pdf.create(document, options)
                setTimeout(()=>{
                    deleteFile(pdfHistoryPath + nameFile)
                }, 30000)
                res.json({
                    pdf: process.env.BASE_URL + `pdf/history/${nameFile}`,
                    message: 'PDF berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'pdf'
                    },
                    status: true
                })
            }catch(err){
                res.status(404).json({message : 'Terjadi kesalahan saat mengunduh', status: false})
            }
        }
    },
}