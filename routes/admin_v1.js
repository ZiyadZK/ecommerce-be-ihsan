const { Router, response } = require("express");
const { error_handler } = require("../libs/error_handler");
const tables_function = require("../database/tables_function");
const { upload_image } = require("../libs/multer_handler");

const response_handler = (
    res = response,
    response_payload = {
        data: null || [],
        message: null,
        debug: null,
        success: true
    },
    status = 200, 
    add_new_response = {},
) => {
    if(response_payload.success) {
        return res.status(200).json({
            ...response_payload,
            ...add_new_response
        })
    }else{
        return res.status(500).json({
            ...response_payload,
            ...add_new_response
        })
    }
}

const admin_v1 = Router({
    strict: true
})

// ============================================ DATA ADMIN
admin_v1.route('/data/admin')
    .get(async (req, res) => {
        try {

            const response = await tables_function.v1.admin.get_all()

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                data: response.data
            })

        } catch (error) {
            error_handler(res, error)
        }
    })
    .post(async (req, res) => {
        try {
            const payload = req.body

            const response = await tables_function.v1.admin.create(payload)

            if(!response.success) {
                if(response.message === 'Validation error') {
                    return error_handler(res, {
                        message: 'Akun sudah ada'
                    })
                }
                return error_handler(res, response)
            }

            return response_handler(res, response)
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            const id = req.body.id || req.query.id
            const payload = req.body.payload || req.body

            const response = await tables_function.v1.admin.update(id, payload)

            if(response.message === 'Validation error') {
                return response_handler(res, {
                    ...response,
                    message: 'Terdapat data yang sama!'
                })
            }
            response_handler(res, response)
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            const id = req.body.id || req.query.id

            const response = await tables_function.v1.admin.delete(id)

            response_handler(res, response)
        } catch (error) {
            error_handler(res, error)
        }
    })

admin_v1.route('/profil')
    .get(async (req, res) => {
        try {
            const userdata = req.userdata_admin

            const response = await tables_function.v1.admin.get_by_id(userdata['id'])

            return response_handler(res, response)
        } catch (error) {
            error_handler(res, error)
        }
    })

admin_v1.route('/foto-profil')
    .put(async (req, res) => {
        try {
            const userdata = req.userdata_admin

            await upload_image.single('foto_profil_admin')(req, res, async (err) => {
                if(err) {
                    return error_handler(res, err)
                }

                if(!req.file) {
                    return error_handler(res, {
                        message: 'Anda perlu mengupload foto terlebih dahulu!'
                    })
                }

                const { mimetype, buffer } = req.file

                const response = await tables_function.v1.admin.update(userdata['id'], {
                    foto: buffer,
                    foto_mimetype: mimetype
                })

                return response_handler(res, response)
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })

// ======================================== DATA USER
admin_v1.route('/data/user')
    .get(async (req, res) => {
        try {
            const response = await tables_function.v1.user.get_all()

            return response_handler(res, response)
        } catch (error) {
            error_handler(res, error)
        }
    })
    .post(async (req, res) => {
        try {
            const payload = req.body

            const response = await tables_function.v1.user.create(payload)

            if(response.message === 'Validation error') {
                return response_handler(res, {
                    ...response,
                    message: 'Data user sudah ada'
                })
            } 

            return response_handler(res, response)
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            const id = req.body.id || req.query.id
            const payload = req.body.payload || req.body

            const response = await tables_function.v1.user.update(id, payload)

            if(response.message === 'Validation error') {
                return response_handler(res, {
                    ...response,
                    message: 'Terdapat data yang sama!'
                })
            }
            response_handler(res, response)
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            const id = req.body.id || req.query.id

            const response = await tables_function.v1.user.delete(id)

            return response_handler(res, response)
        } catch (error) {
            error_handler(res, error)
        }
    })

// ======================================= PRODUK
admin_v1.route('/data/produk')
    .get(async (req, res) => {
        try {
            const { expand } = req.query

            console.log({
                 expand
            })
            let response = null

            if(expand) {
                if(expand.includes('kategori')) {
                    response = await tables_function.v1.produk.get_all_with_kategori()
                }else{
                    response = await tables_function.v1.produk.get_all()
                }
            }else{
                response = await tables_function.v1.produk.get_all()
            }


            return response_handler(res, response)
        } catch (error) {
            error_handler(res, error)
        }
    })
    .post(async (req, res) => {
        try {
            const payload = req.body
            const response = await tables_function.v1.produk.create(payload)

            return response_handler(res, response)
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            const id = req.body.id || req.query.id
            const payload = req.body.payload || req.body

            const response = await tables_function.v1.produk.update(id, payload)

            return response_handler(res, response)
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            const id = req.body.id || req.query.id

            const response = await tables_function.v1.produk.delete(id)

            return response_handler(res, response)
        } catch (error) {
            error_handler(res, error)
        }
    })

admin_v1.route('/data/kategori-produk')
    .get(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .post(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })

// ======================================= PROMOSI
admin_v1.route('/data/promosi')
    .get(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .post(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })

// ======================================= KATEGORI
admin_v1.route('/data/kategori')
    .get(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .post(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })

// =================================== Order
admin_v1.route('/data/order')
    .get(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })

// ======================================= SUPPLIER

admin_v1.route('/data/supplier')
    .get(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .post(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })

admin_v1.route('/data/supplier-restock')
    .get(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .post(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            
        } catch (error) {
            error_handler(res, error)
        }
    })

module.exports = admin_v1
