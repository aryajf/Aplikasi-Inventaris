const {Category, Barang} = require('../models')
const { Op } = require("sequelize")
var pdf = require("pdf-creator-node")
var fs = require("fs")
const path = require('path')

module.exports = {
    index: async(req, res) => {
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
}