const Admin = (req, res, next) => (req.decoded.role === 'Admin') ? next() : error(res)
const Asisten = (req, res, next) => {
    (req.decoded.role === 'Dasar' || req.decoded.role === 'Menengah' || req.decoded.role === 'Lanjut') ? next(): error(res)
}

const error = (res) => res.status(403).json({
    message: 'Access denied',
    status: false
})

module.exports = {
    Admin,
    Asisten,
}