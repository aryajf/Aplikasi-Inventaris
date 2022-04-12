const {Category, Barang, History, User} = require('../models')
const { Op } = require("sequelize")
const {getPagination, getPagingData} = require('../config/mixins')


module.exports = {
    allHistory: async(req, res) => {
        let { type, page, keyword } = req.query
        const { limit, offset } = getPagination(page, 12)
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

        await History.findAndCountAll({include: include, limit: limit, offset: offset, order:[['updatedAt', 'DESC']]}).then(async (data) => {
            const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)
            
            if(dataPaginate.length != 0 && !isNaN(currentPage)){
                res.json({
                    totalItems : totalItems,
                    limitItems : limit,
                    totalPages : totalPages,
                    currentPage : currentPage,
                    history : dataPaginate,
                    message: 'Riwayat berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'history'
                    },
                    status: true
                })
            }else{res.json({totalItems : 0, data: dataPaginate, message : 'Belum ada Riwayat', status: false})}
        }).catch(() => {
            res.status(404).json({message : 'Riwayat tidak ditemukan', status: false})
        })
    }
}