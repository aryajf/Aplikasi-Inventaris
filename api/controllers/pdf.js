const {Category, Barang, History, User} = require('../models')
const { Op } = require("sequelize")
const moment = require("moment/min/moment-with-locales")
var pdf = require("pdf-creator-node")
var fs = require("fs")
const path = require('path')

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
            let pdfOutput = `public/pdf/semua-lab.pdf`
            var html = fs.readFileSync(path.join(__dirname, '../views/pdf/semua-barang-template.html'), "utf8");
            var options = {
                format: "A3",
                orientation: "portrait",
                border: "10mm",
                header: {
                    height: "45mm",
                    contents: '<h1 style="text-align: center;">Laporan Data Barang</h1>'
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
                res.json({
                    pdf: process.env.BASE_URL + 'pdf/semua-lab.pdf',
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
            let pdfOutput = `public/pdf/semua-history.pdf`
            var html = fs.readFileSync(path.join(__dirname, '../views/pdf/semua-history-template.html'), "utf8");
            var options = {
                format: "A3",
                orientation: "portrait",
                border: "10mm",
                header: {
                    height: "45mm",
                    contents: '<h1 style="text-align: center;">Laporan Data history</h1>'
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
                res.json({
                    pdf: process.env.BASE_URL + 'pdf/semua-history.pdf',
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