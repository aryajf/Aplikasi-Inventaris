const {Category, Barang, Status} = require('../models')
var pdf = require("pdf-creator-node")
var fs = require("fs")
const path = require('path')

module.exports = {
    index: async(req, res) => {
        let barang = await Barang.findAll({
            include: [{
                model: Category,
                as: 'category',
            },{
                model: Status,
                as: 'status'
            }],
            order:[['updatedAt', 'ASC']]
        })
        if(barang.length <= 0){
            res.status(404).json({message : 'Tipe tidak ditemukan', status: false})
        }else{
            const listBarang = []
            barang.map(item => {
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
                    category: item.category.title,
                    dasar: dasar,
                    menengah: menengah,
                    lanjut: lanjut,
                })
            })

            let pdfOutput = `public/pdf/semua-lab.pdf`
            var html = fs.readFileSync(path.join(__dirname, '../views/pdf/semua-barang-template.html'), "utf8");
            var options = {
                format: "A3",
                orientation: "portrait",
                border: "10mm",
                header: {
                    height: "45mm",
                    contents: '<h1 style="text-align: center;">Laporan jumlah data barang</h1>'
                },
            }

            var document = {
                html: html,
                data: {
                    barang: listBarang,
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
                console.log(err)
                res.status(404).json({message : 'Terjadi kesalahan saat mengunduh', status: false})
            }
        }
    },
    show: async(req, res) => {
        let barang = await Barang.findAll({
            include: [{
                model: Category,
                as: 'category',
            },{
                model: Status,
                as: 'status',
                where: {
                    location: req.params.type
                },
            }],
            order:[['updatedAt', 'ASC']]
        })
        if(barang.length <= 0){
            res.status(404).json({message : 'Tipe tidak ditemukan', status: false})
        }else{
            const listBarang = []
            barang.map(item => {
                item.dataValues.tersedia = 0
                item.dataValues.dipakai = 0
                item.dataValues.rusak = 0
                item.status.map(status => {
                    if(status.status == 'Tersedia') item.dataValues.tersedia = status.stok
                    if(status.status == 'Dipakai') item.dataValues.dipakai = status.stok
                    if(status.status == 'Rusak') item.dataValues.rusak = status.stok
                })
                listBarang.push({
                    title: item.title,
                    category: item.category.title,
                    tersedia: item.dataValues.tersedia,
                    dipakai: item.dataValues.dipakai,
                    rusak: item.dataValues.rusak,
                })
            })

            let pdfOutput = `public/pdf/${req.params.type}.pdf`
            var html = fs.readFileSync(path.join(__dirname, '../views/pdf/show-barang-template.html'), "utf8");
            var options = {
                format: "A3",
                orientation: "portrait",
                border: "10mm",
                header: {
                    height: "45mm",
                    contents: `<h1 style="text-align: center;">Laporan barang lab ${req.params.type}</h1>`
                },
            }

            var document = {
                html: html,
                data: {
                    barang: listBarang,
                },
                path: pdfOutput,
                type: "",
            }

            try{
                await pdf.create(document, options)
                res.json({
                    pdf: process.env.BASE_URL + 'pdf/'+req.params.type+'.pdf',
                    message: 'PDF berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'pdf/'+ req.params.type
                    },
                    status: true
                })
            }catch(err){
                console.log(err)
                res.status(404).json({message : 'Terjadi kesalahan saat mengunduh', status: false})
            }
        }
    },
}