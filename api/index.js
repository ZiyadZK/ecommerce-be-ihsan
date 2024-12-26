const express = require('express')
const cors = require('cors')
const admin_v1 = require('../routes/admin_v1')
const auth_v1 = require('../routes/auth_v1')
const { middleware } = require('../mid_handler')
require('dotenv').config()

const port = process.env.PORT || 8080
const app = express()

app.use(cors({
    origin: ['*'],
    methods: ['GET POST PUT DELETE']
}))

app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use((req, res, next) => {
    try {
        if(req.method !== 'GET') {
            return express.json({ limit: '10mb' })(req, res, next)
        }

        next()
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({
                message: error?.message,
                debug: error?.stack
            })
        }else{
            return res.status(500).json({
                message: error?.message,
                debug: error?.stack
            })
        }
    }
})

app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'API is Connected'
    })
})

app.use('/v1/admin', middleware.api.key, middleware.api.admin_only, admin_v1)
app.use('/v1/auth', auth_v1)


app.use((req, res, next) => {
    return res.status(404).json({
        message: 'Route not found',
        route: `${req.method} ${req.url}`
    })
})

app.listen(port, () => {
    console.log(`[API]: Server is listening to port ${port}`)
})