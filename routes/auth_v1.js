const { Router } = require("express");
const { error_handler } = require("../libs/error_handler");
const tables_function = require("../database/tables_function");
const jwt_handler = require("../libs/jwt_handler");

const auth_v1 = Router({
    strict: true
})

.post('/admin/login', async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password

        const response = await tables_function.v1.admin.login(username, password)

        if(!response.success) {
            return error_handler(res, response)
        }

        const { foto, ...userdata} = response.data

        const response_jwt = jwt_handler.generate({
            ...userdata,
            status: 'admin'
        })

        if(!response_jwt.success) {
            return error_handler(res, response_jwt)
        }

        return res.status(200).json({
            message: 'Berhasil login',
            data: response_jwt.data
        })
    } catch (error) {
        error_handler(res, error)
    }
})

.post('/user/login', async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password

        const response = await tables_function.v1.user.login(username, password)

        if(!response.success) {
            return error_handler(res, response)
        }

        const { foto, ...userdata} = response.data

        const response_jwt = jwt_handler.generate({
            ...userdata,
            status: 'user'
        })

        if(!response_jwt.success) {
            return error_handler(res, response_jwt)
        }

        return res.status(200).json({
            message: 'Berhasil login',
            data: response_jwt.data
        })
    } catch (error) {
        error_handler(res, error)
    }
})

.post('/user/register', async (req, res) => {
    try {
        const payload = req.body

        const response = await tables_function.v1.user.create(payload)

        if(response.message === 'Validation error') {
            return res.status(403).json({
                message: 'Akun tersebut sudah ada!'
            })
        }

        if(!response.success) {
            return res.status(500).json({
                message: response.message
            })
        }

        return res.status(200).json({
            message: 'Berhasil registrasi'
        })
    } catch (error) {
        error_handler(res, error)
    }
})

module.exports = auth_v1