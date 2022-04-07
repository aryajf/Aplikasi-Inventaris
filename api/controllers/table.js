const {Category, Barang} = require('../models')
const { Op } = require("sequelize")
const {getPagination, getPagingData} = require('../config/mixins')


module.exports = {
    allBarang: async(req, res) => {
        let { type, page, keyword } = req.query
        const { limit, offset } = getPagination(page, 12)
        const where = {}
        const include = [{
            model : Category,
            as: 'category'
        }]
        
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

        await Barang.findAndCountAll({where: where, include: include, limit: limit, offset: offset, order:[['updatedAt', 'ASC']]}).then(async (data) => {
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
        }).catch(() => {
            res.status(404).json({message : 'Barang tidak ditemukan', status: false})
        })
    }
}