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
            let pdfOutput = `public/pdf/semua-lab.pdf`
            var html = fs.readFileSync(path.join(__dirname, '../views/template.html'), "utf8");
            var options = {
                format: "A3",
                orientation: "portrait",
                border: "10mm",
                header: {
                    height: "45mm",
                    contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
                },
                footer: {
                    height: "28mm",
                    contents: {
                        first: 'Cover page',
                        2: 'Second page', // Any page number is working. 1-based index
                        default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                        last: 'Last Page'
                    }
                }
            }

            var document = {
                html: html,
                data: {
                    barang: barang,
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
                console.error(error);
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
            let pdfOutput = `public/pdf/${req.params.type}.pdf`
            var html = fs.readFileSync(path.join(__dirname, '../views/template.html'), "utf8");
            var options = {
                format: "A3",
                orientation: "portrait",
                border: "10mm",
                header: {
                    height: "45mm",
                    contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
                },
                footer: {
                    height: "28mm",
                    contents: {
                        first: 'Cover page',
                        2: 'Second page', // Any page number is working. 1-based index
                        default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                        last: 'Last Page'
                    }
                }
            }

            var document = {
                html: html,
                data: {
                    barang: barang,
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
                console.error(error);
            }
        }
    },
}