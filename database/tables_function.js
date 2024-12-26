const { Model, Op } = require("sequelize")
const date_handler = require("../libs/date_handler")
const { Admin, User, Order, Produk, Promosi, Kategori_Produk, Kategori, Supplier, Restock } = require("./tables")

const success = {
    false: (error) => {
        return {
            success: false,
            message: error?.message || error?.error,
            debug: error?.stack
        }
    },
    true: (data) => {
        return {
            success: true,
            data
        }
    },
    error: (error) => {
        return {
            success: false,
            message: error?.message || error?.error,
            debug: error?.stack
        }
    }
}

const timestamps = (payload, isUpdate = false) => {
    const now = date_handler().now();
    if (Array.isArray(payload)) {
        return payload.map(item => {
            if(isUpdate) {
                return {
                    ...item,
                    updated_at: now
                }
            }else{
                return {
                    ...item,
                    created_at: now,
                    updated_at: now
                }
            }
            
        });
    }else{
        if(isUpdate) {
            return {
                ...payload,
                updated_at: now
            }
        }else{
            return {
                ...payload,
                created_at: now,
                updated_at: now
            }
        }

    }
}

const post_handler = async (model = Model, payload) => {
    let data = null
    if(Array.isArray(payload)) {
        data = await model.bulkCreate(timestamps(payload))
    }else{
        data = await model.create(timestamps(payload))
    }
}

const tables_function = {
    v1: {
        admin: {
            get_all: async () => {
                try {
                    const data = await Admin.findAll({
                        raw: true,
                        attributes: {
                            exclude: ['foto']
                        }
                    })

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            create: async (payload) => {
                try {
                    let data = null
                    if(Array.isArray(payload)) {
                        data = await Admin.bulkCreate(timestamps(payload))
                    }else{
                        data = await Admin.create(timestamps(payload))
                    }

                    return {
                        success: true,
                        data
                    }
                } catch (error) {
                    return success.false(error)
                }
            },
            update: async (id, payload) => {
                try {
                    let data = null
                    if(Array.isArray(id)) {
                        data = await Admin.update(timestamps(payload, true), {
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await Admin.update(timestamps(payload, true), {
                            where: {
                                id
                            }
                        })
                    }

                    return {
                        success: true,
                        data
                    }
                } catch (error) {
                    return success.false(error)
                }
            },
            delete: async (id) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await Admin.destroy({
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await Admin.destroy({
                            where: {
                                id
                            }
                        })
                    }

                    return {
                        success: true,
                        data
                    }
                } catch (error) {
                    return success.false(error)
                }
            },
            login: async (username, password) => {
                try {
                    const data = await Admin.findOne({
                        raw: true,
                        where: {
                            [Op.and]: [
                                {
                                    username
                                },
                                {
                                    password
                                }
                            ]
                        }
                    })

                    if(!data) {
                        return success.error({ message: 'Username atau Password tidak ditemukan '})
                    }

                    if(!data['aktif']) {
                        return success.error({ message: 'Akun anda sedang dinonaktifkan' })
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            get_by_id: async (id) => {
                try {
                    const data = await Admin.findOne({
                        raw: true,
                        where: {
                            id
                        }
                    })

                    if(!data) {
                        return success.error({ message: `Data Admin dengan id ${id} tidak ditemukan `})
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            }
        },
        user: {
            get_all: async () => {
                try {
                    const data = await User.findAll({
                        raw: true,
                        attributes: {
                            exclude: ['foto']
                        }
                    })

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            create: async (payload) => {
                try {
                    let data = null

                    if(Array.isArray(payload)) {
                        data = await User.bulkCreate(timestamps(payload))
                    }else{
                        data = await User.create(timestamps(payload))
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            update: async (id, payload) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await User.update(timestamps(payload, true), {
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await User.update(timestamps(payload, true), {
                            where: {
                                id
                            }
                        })
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            delete: async (id) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await User.destroy({
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await User.destroy({
                            where: {
                                id
                            }
                        })
                    }

                    return {
                        success: true,
                        data
                    }
                } catch (error) {
                    return success.false(error)
                }
            },
            login: async (username, password) => {
                try {
                    const data = await User.findOne({
                        raw: true,
                        where: {
                            [Op.and]: [
                                {
                                    username
                                },
                                {
                                    password
                                }
                            ]
                        }
                    })

                    if(!data) {
                        return success.error({ message: 'Username atau Password tidak ditemukan '})
                    }

                    if(!data['aktif']) {
                        return success.error({ message: 'Akun anda sedang dinonaktifkan' })
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            get_by_id: async (id) => {
                try {
                    const data = await User.findOne({
                        raw: true,
                        where: {
                            id
                        }
                    })

                    if(!data) {
                        return success.error({ message: `Data User dengan id ${id} tidak ditemukan `})
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            produk: {
                keranjang: async (id) => {
                    try {
                        const data = await Order.findAll({
                            raw: true,
                            where: {
                                fk_user: id,
                                is_keranjang: true,
                                is_paid: false,
                                is_confirmed: false,
                                is_cancelled: false
                            },
                            include: [
                                {
                                    model: Produk
                                }
                            ]
                        })
    
                        return success.true(data)
                    } catch (error) {
                        return success.false(error)
                    }
                },
                sudah_bayar: async (id) => {
                    try {
                        const data = await Order.findAll({
                            raw: true,
                            where: {
                                fk_user: id,
                                is_keranjang: false,
                                is_paid: true,
                                is_confirmed: false,
                                is_cancelled: false
                            },
                            include: [
                                {
                                    model: Produk
                                }
                            ]
                        })
    
                        return success.true(data)
                    } catch (error) {
                        return success.false(error)
                    }
                },
                selesai: async (id) => {
                    try {
                        const data = await Order.findAll({
                            raw: true,
                            where: {
                                fk_user: id,
                                is_keranjang: false,
                                is_paid: true,
                                is_confirmed: true,
                                is_cancelled: false
                            },
                            include: [
                                {
                                    model: Produk
                                }
                            ]
                        })
    
                        return success.true(data)
                    } catch (error) {
                        return success.false(error)
                    }
                },
                batal: async (id) => {
                    try {
                        const data = await Order.findAll({
                            raw: true,
                            where: {
                                fk_user: id,
                                is_keranjang: false,
                                is_paid: true,
                                is_confirmed: false,
                                is_cancelled: true
                            },
                            include: [
                                {
                                    model: Produk
                                }
                            ]
                        })
    
                        return success.true(data)
                    } catch (error) {
                        return success.false(error)
                    }
                },
                ditolak: async (id) => {
                    try {
                        const data = await Order.findAll({
                            raw: true,
                            where: {
                                fk_user: id,
                                is_keranjang: true,
                                is_paid: false,
                                is_confirmed: false,
                                is_cancelled: false
                            },
                            include: [
                                {
                                    model: Produk
                                }
                            ]
                        })
    
                        return success.true(data)
                    } catch (error) {
                        return success.false(error)
                    }
                }
            }
        },
        order: {
            get_all: async () => {
                try {
                    
                } catch (error) {
                    return success.false(error)
                }
            },
            get_by_today: async () => {
                try {
                    
                } catch (error) {
                    return success.false(error)
                }
            },
            create: async () => {
                try {
                    
                } catch (error) {
                    return success.false(error)
                }
            },
            update: async () => {
                try {
                    
                } catch (error) {
                    return success.false(error)
                }
            },
            delete: async () => {
                try {
                    
                } catch (error) {
                    return success.false(error)
                }
            }
        },
        produk: {
            get_all: async () => {
                try {
                    const data = await Produk.findAll({
                        raw: true,
                        include: [
                            {
                                model: Promosi
                            }
                        ]
                    })

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            create: async (payload) => {
                try {
                    let data = null

                    if(Array.isArray(payload)) {
                        data = await Produk.bulkCreate(timestamps(payload))
                    }else{
                        data = await Produk.create(timestamps(payload))
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            update: async (id, payload) => {
                try {
                    let data = null

                    if(Array.isArray(payload)) {
                        data = await Produk.update(timestamps(payload, true), {
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await Produk.update(timestamps(payload, true), {
                            where: {
                                id
                            }
                        })
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            delete: async (id) => {
                try {
                    let data = null
                    if(Array.isArray(id)) {
                        data = await Produk.destroy({
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await Produk.destroy({
                            where: {
                                id
                            }
                        })
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            kategori: {
                add: async (fk_produk, fk_kategori) => {
                    try {
                        const data = await Kategori_Produk.findOrCreate({
                            where: {
                                fk_produk,
                                fk_kategori
                            }
                        })

                        return success.true(data)
                    } catch (error) {
                        return success.false(error)
                    }
                },
                delete: async (id) => {
                    try {
                        const data = await Kategori_Produk.destroy({
                            where: {
                                id
                            }
                        })

                        return success.true(data)
                    } catch (error) {
                        return success.false(error)
                    }
                },
                update: async (id, fk_produk, fk_kategori) => {
                    try {
                        const data = await Kategori_Produk.findOne({
                            where: {
                                fk_produk, 
                                fk_kategori
                            },
                            raw: true
                        })

                        if(data) {
                            return success.false({
                                message: 'Data sudah ada'
                            })
                        }

                        data = await Kategori_Produk.update({
                            fk_produk, fk_kategori
                        }, { 
                            where: {
                                id
                            }
                        })

                        return success.true(data)
                    } catch (error) {
                        return success.false(error)
                    }
                }
            },
            get_all_with_kategori: async () => {
                try {
                    const data = await Produk.findAll({
                        raw: true,
                        include: [
                            {
                                model: Promosi
                            },
                            {
                                model: Kategori_Produk,
                                include: [
                                    {
                                        model: Kategori
                                    }
                                ]
                            }
                        ]
                    })

                    const updated_data = Array.from(new Set(data.map(v => v['id']))).map(id => ({
                        id,
                        nama: data.find(v => v['id'] === id)?.nama,
                        deskripsi: data.find(v => v['id'] === id)?.deskripsi,
                        stok: data.find(v => v['id'] === id)?.stok,
                        satuan: data.find(v => v['id'] === id)?.satuan,
                        harga_per_satuan: data.find(v => v['id'] === id)?.harga_per_satuan,
                        created_at: data.find(v => v['id'] === id)?.created_at,
                        updated_at: data.find(v => v['id'] === id)?.updated_at,
                        promosi: {
                            aktif: data.find(v => v['id'] === id)?.fk_promosi && data.find(v => v['id'] === id)['Promosi.aktif'] ? true : false,
                            id: data.find(v => v['id'] === id)?.fk_promosi,
                            nama: data.find(v => v['id'] === id)?.fk_promosi && data.find(v => v['id'] === id)['Promosi.nama'] ,
                            deskripsi: data.find(v => v['id'] === id)?.fk_promosi && data.find(v => v['id'] === id)['Promosi.deskripsi'] ,
                            potongan: data.find(v => v['id'] === id)?.fk_promosi && data.find(v => v['id'] === id)['Promosi.potongan'] ,
                            promosi_start: data.find(v => v['id'] === id)?.fk_promosi && data.find(v => v['id'] === id)['Promosi.promosi_start'] ,
                            promosi_end: data.find(v => v['id'] === id)?.fk_promosi && data.find(v => v['id'] === id)['Promosi.promosi_end'] ,
                            minimal_nominal_pembelian: data.find(v => v['id'] === id)?.fk_promosi && data.find(v => v['id'] === id)['Promosi.minimal_nominal_pembelian'] ,
                        },
                        kategori: Array.from(new Set(data.filter(v => v['id'] === id).filter(v => v['Kategori_Produks.id']).map(v => v['Kategori_Produks.id']))).map(id_kategori_produk => ({
                            id_kategori_produk,
                            id_kategori: data.find(v => v['id'] === id && v['Kategori_Produks.id'] === id_kategori_produk)['Kategori_Produks.Kategori.id'],
                            nama: data.find(v => v['id'] === id && v['Kategori_Produks.id'] === id_kategori_produk)['Kategori_Produks.Kategori.nama'],
                        }))
                    }))

                    return success.true(updated_data)
                } catch (error) {
                    return success.false(error)
                }
            }
        },
        kategori: {
            get_all: async () => {
                try {
                    const data = await Kategori.findAll({
                        raw: true,
                        include: [
                            {
                                model: Kategori_Produk,
                                include: [
                                    {
                                        model: Produk
                                    }
                                ]
                            }
                        ]
                    })

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            create: async (payload) => {
                try {
                    let data = null

                    if(Array.isArray(payload)) {
                        data = await Kategori.bulkCreate(timestamps(payload))
                    }else{
                        data = await Kategori.create(timestamps(payload))
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            update: async (id, payload) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await Kategori.update(timestamps(payload, true), {
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await Kategori.update(timestamps(payload, true), {
                            where: {
                                id
                            }
                        })
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            delete: async (id) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await Kategori.destroy({
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await Kategori.destroy({
                            where: {
                                id
                            }
                        })
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            }
        },
        supplier: {
            get_all: async () => {
                try {
                    const data = await Supplier.findAll({
                        raw: true
                    })
                    
                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            create: async (payload) => {
                try {
                    let data = null

                    if(Array.isArray(payload)) {
                        data = await Supplier.bulkCreate(timestamps(payload))
                    }else{
                        data = await Supplier.create(timestamps(payload))
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            update: async (id, payload) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await Supplier.update(timestamps(payload, true), {
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await Supplier.update(timestamps(payload, true), {
                            where: {
                                id
                            }
                        })
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            delete: async (id) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await Supplier.destroy({
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await Supplier.destroy({
                            where: {
                                id
                            }
                        })
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            }
        },
        restock: {
            get_all: async () => {
                try {
                    const data = Restock.findAll({
                        raw: true
                    })

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            create: async (payload) => {
                try {
                    let data = null

                    if(Array.isArray(payload)) {
                        data = await Restock.bulkCreate(timestamps(payload))
                    }else{
                        data = await Restock.create(timestamps(payload))
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            update: async (id, payload) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await Restock.update(timestamps(payload, true), {
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await Restock.update(timestamps(payload, true), {
                            where: {
                                id
                            }
                        })
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            },
            delete: async (id) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await Restock.destroy({
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await Restock.destroy({
                            where: {
                                id
                            }
                        })
                    }

                    return success.true(data)
                } catch (error) {
                    return success.false(error)
                }
            }
        }
    }
}

module.exports = tables_function