const db_column = require("../helpers/column_builder");
const db_model_options = require("../helpers/model_options_builder");
const db = require("./config");

const User = db.define('User', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('nama').str().null().build(),
    ...db_column('username').str().notNull().unique('USER_UNIQUE_USERNAME').build(),
    ...db_column('no_hp').str().null().build(),
    ...db_column('password').str().notNull().build(),
    ...db_column('alamat').str().null().build(),
    ...db_column('foto').longBlob().null().build(),
    ...db_column('foto_mimetype').str().null().build(),
    ...db_column('aktif').bool().default(true).build(),
    ...db_column('created_at').str().null().build(),
    ...db_column('updated_at').str().null().build(),
},
    db_model_options()
    .timestamps(false)
    .tableName('User')
    .indexes([
        {
            fields: ['username'],
            name: 'USER_UNIQUE_USERNAME',
            unique: true
        }
    ])
    .build()
)

const Admin = db.define('Admin', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('nama').str().null().build(),
    ...db_column('username').str().notNull().unique('ADMIN_UNIQUE_USERNAME').build(),
    ...db_column('password').str().notNull().build(),
    ...db_column('alamat').str().null().build(),
    ...db_column('foto').longBlob().null().build(),
    ...db_column('foto_mimetype').str().null().build(),
    ...db_column('aktif').bool().default(true).build(),
    ...db_column('created_at').str().null().build(),
    ...db_column('updated_at').str().null().build(),
},
    db_model_options()
    .timestamps(false)
    .tableName('Admin')
    .indexes([
        {
            fields: ['username'],
            name: 'USER_UNIQUE_USERNAME',
            unique: true
        }
    ])
    .build()
)

const Promosi = db.define('Promosi', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('nama').str().null().build(),
    ...db_column('deskripsi').str().null().build(),
    ...db_column('potongan').int().default(10).build(),
    ...db_column('promosi_start').str().null().build(),
    ...db_column('promosi_end').str().null().build(),
    ...db_column('minimal_nominal_pembelian').int().default(50000).build(),
    ...db_column('aktif').bool().default(true).build(),
    ...db_column('created_at').str().null().build(),
    ...db_column('updated_at').str().null().build(),
}, 
    db_model_options()
    .timestamps(false)
    .tableName('Promosi')
    .build()
)

const Produk = db.define('Produk', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('nama').str().null().build(),
    ...db_column('deskripsi').str().null().build(),
    ...db_column('stok').int().default(10).notNull().build(),
    ...db_column('satuan').str().null().default('pcs').build(),
    ...db_column('harga_per_satuan').int().notNull().default(10000).build(),
    ...db_column('foto').longBlob().null().build(),
    ...db_column('foto_mimetype').str().null().build(),
    ...db_column('fk_promosi').int().null().ref('Promosi').build(),
    ...db_column('created_at').str().null().build(),
    ...db_column('updated_at').str().null().build()
}, 
    db_model_options()
    .timestamps(false)
    .tableName('Produk')
    .build()
)

const Kategori = db.define('Kategori', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('nama').str().notNull().unique('KATEGORI_UNIQUE_NAMA').build(),
    ...db_column('deskripsi').str().null().default('Ini adalah Deskripsi Produk').build(),
    ...db_column('aktif').bool().default(true).build(),
    ...db_column('created_at').str().null().build(),
    ...db_column('updated_at').str().null().build()
},
    db_model_options()
        .timestamps(false)
        .tableName('Kategori')
        .indexes([
            {
                fields: ['nama'],
                name: 'KATEGORI_UNIQUE_NAMA',
                unique: true
            }
        ])
        .build()
)

const Kategori_Produk = db.define('Kategori_Produk', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('fk_produk').int().notNull().ref('Produk').build(),
    ...db_column('fk_kategori').int().notNull().ref('Kategori').build(),
    ...db_column('created_at').str().null().build(),
    ...db_column('updated_at').str().null().build()
}, 
    db_model_options()
        .timestamps(false)
        .tableName('Kategori_Produk')
        .build()
)

const Order = db.define('Order', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('fk_produk').int().notNull().ref('Produk').build(),
    ...db_column('fk_user').int().notNull().ref('User').build(),
    ...db_column('jumlah').int().notNull().default(1).build(),
    ...db_column('total').float().notNull().default(0.0).build(),
    ...db_column('is_keranjang').bool().default(true).build(),
    ...db_column('is_paid').bool().default(false).build(),
    ...db_column('paid_with').str().default('COD').build(),
    ...db_column('foto_bukti_pembayaran').longBlob().null().build(),
    ...db_column('foto_bukti_pembayaran').str().null().build(),
    ...db_column('is_confirmed').bool().default(false).build(),
    ...db_column('is_cancelled').bool().default(false).build(),
    ...db_column('reason_confirmed').str().null().build(),
    ...db_column('tanggal_confirmed').str().null().build(),
    ...db_column('created_at').str().null().build(),
    ...db_column('updated_at').str().null().build()
}, 
    db_model_options()
        .timestamps(false)
        .tableName('Order')
        .build()
)

const Supplier = db.define('Supplier', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('nama').str().notNull().unique('SUPPLIER_UNIQUE_NAMA').build(),
    ...db_column('alamat').str().null().build(),
    ...db_column('aktif').bool().default(true).build()
},
    db_model_options()
        .timestamps(false)
        .tableName('Supplier')
        .indexes([
            {
                fields: ['nama'],
                name: 'SUPPLIER_UNIQUE_NAMA',
                unique: true
            }
        ])
        .build()
)

const Restock = db.define('Restock', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('fk_produk').int().notNull().ref('Produk').build(),
    ...db_column('fk_supplier').int().notNull().ref('Supplier').build(),
    ...db_column('fk_admin').int().notNull().ref('Admin').build(),
    ...db_column('jumlah').int().notNull().default(0).build(),
    ...db_column('created_at').str().null().build(),
    ...db_column('updated_at').str().null().build()
},
    db_model_options()
        .timestamps(false)
        .tableName('Restock')
        .build()
)

// ======================================== RELATIONS START HERE

User.hasMany(Order, {
    foreignKey: 'fk_user',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Order.belongsTo(User, {
    foreignKey: 'fk_user',
    targetKey: 'id'
})

Promosi.hasMany(Produk, {
    foreignKey: 'fk_promosi',
    sourceKey: 'id',
    onDelete: 'SET NULL'
})

Produk.belongsTo(Promosi, {
    foreignKey: 'fk_promosi',
    targetKey: 'id'
})

Produk.hasMany(Order, {
    foreignKey: 'fk_produk',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Order.belongsTo(Produk, {
    foreignKey: 'fk_produk',
    targetKey: 'id'
})

Kategori.hasMany(Kategori_Produk, {
    foreignKey: 'fk_kategori',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Kategori_Produk.belongsTo(Kategori, {
    foreignKey: 'fk_kategori',
    targetKey: 'id'
})

Produk.hasMany(Kategori_Produk, {
    foreignKey: 'fk_produk',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Kategori_Produk.belongsTo(Produk, {
    foreignKey: 'fk_produk',
    targetKey: 'id'
})

Produk.hasMany(Restock, {
    foreignKey: 'fk_produk',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Restock.belongsTo(Produk, {
    foreignKey: 'fk_produk',
    targetKey: 'id'
})

Supplier.hasMany(Restock, {
    foreignKey: 'fk_supplier',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Restock.belongsTo(Supplier, {
    foreignKey: 'fk_supplier',
    targetKey: 'id'
})

Admin.hasMany(Restock, {
    foreignKey: 'fk_admin',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Restock.belongsTo(Admin, {
    foreignKey: 'fk_admin',
    targetKey: 'id'
})

module.exports = {
    User, Admin, Promosi, Produk, Kategori, Kategori_Produk, Order, Supplier, Restock
}