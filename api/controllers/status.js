const {Status, User, Barang} = require('../models')
const { Op } = require("sequelize")
const path = require('path')
const Validator = require('validatorjs')
const validatorMessage = require('../config/validatorMessage')
const {compressImage, deleteFile, makeDirectory, getPagination, getPagingData} = require('../config/mixins')


module.exports = {
    index: async(req, res) => {
        let { page, location, status } = req.query
        const { limit, offset } = getPagination(page, 12)

        await getStatuses(limit, offset, location, status).then(async (data) => {
            const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)
            
            if(dataPaginate.length != 0 && !isNaN(currentPage)){
                res.json({
                    totalItems : totalItems,
                    limitItems : limit,
                    totalPages : totalPages,
                    currentPage : currentPage,
                    statuses : dataPaginate,
                    message: 'Kategori berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'statuses'
                    },
                    status: true
                })
            }else{res.json({totalItems : 0, data: dataPaginate, message : 'Belum ada Kategori', status: false})}
        }).catch((err) => {
            console.log(err)
            res.status(404).json({message : 'Kategori tidak ditemukan', status: false})
        })
    },
    show: async(req, res) => {
        try{
            const statuses = await findStatuses(req.params.id)
            res.json({
                statuses : statuses,
                message: 'Item berhasil ditampilkan',
                request: {
                    method: req.method,
                    url: process.env.BASE_URL + 'statuses/' + req.params.id
                },
                status: true
            })
        }catch(err){
            res.status(404).json({message : 'Terjadi kesalahan saat menampilkan item', status: false})
        }
    },
    update: async(req, res) => {
        let statuses = await findStatuses(req.params.id)
        if(statuses == null){
            res.status(404).json({message : 'Item tidak ditemukan', status: false})
            return 
        }

        let statusesReq = {
            stok: req.body.stok,
        }

        if(statusesValidation(statusesReq) != null){
            return res.status(400).send(statusesValidation(statusesReq))
        }

        try{
            statuses.update(statusesReq)
            res.status(201).json({
                data: {
                    id: statuses.id,
                    location: statuses.location,
                    status: statuses.status,
                    stok: statuses.stok,
                },
                message: 'Stok berhasil diubah',
                request: {
                    method: req.method,
                    url: process.env.BASE_URL + 'statuses/' + req.params.id
                },
                status: true,
            })
        }catch(err){
            res.status(400).json({
                error: err.message,
                message: 'Terjadi kesalahan saat mengubah item',
                status: false
            })
        }
    }
}

function findStatuses(id){
    return Status.findOne({where: {id: id}})
}

async function getStatuses(limit, offset, location, status){
    let statement

    statement = {
        where: {},
        include: {
            model: Barang,
            as: 'barang'
        },
        limit,offset,order:[['updatedAt', 'ASC']]
    }
    
    if(location){
        statement.where.location = location
    }

    if(status){
        statement.where.status = status
    }

    return Status.findAndCountAll(statement)
}

function statusesValidation(dataRequest){
    let rules = {
        stok: 'required|numeric'
    }
    
    let validation = new Validator(dataRequest, rules, validatorMessage)
    if(validation.fails()){
        return {
            message: "Harap isi form dengan benar",
            errors: validation.errors.errors
        }
    }
}