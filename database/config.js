const { Sequelize } = require('sequelize')

require('dotenv').config()

const db_env = process.env.DB_ENV

const config = {
    name:  db_env === 'development'
        ? process.env.DB_DEV_NAME
        : process.env.DB_PROD_NAME,
    user: db_env === 'development'
        ? process.env.DB_DEV_USER
        : process.env.DB_PROD_USER,
    pass:  db_env === 'development'
        ? process.env.DB_DEV_PASS
        : process.env.DB_PROD_PASS,
    host: db_env === 'development'
        ? process.env.DB_DEV_HOST
        : process.env.DB_PROD_HOST,
    dialect: db_env === 'development'
        ? process.env.DB_DEV_DIALECT
        : process.env.DB_PROD_DIALECT,
    timezone: db_env === 'development'
        ? process.env.DB_DEV_TIMEZONE
        : process.env.DB_PROD_TIMEZONE,
    port: db_env === 'development'
        ? process.env.DB_DEV_PORT
        : process.env.DB_PROD_PORT,
    pool: db_env === 'development'
        ? process.env.DB_DEV_POOL
        : process.env.DB_PROD_POOL
}

const db = new Sequelize(
    config.name,
    config.user,
    config.pass,
    {
        host: config.host,
        dialect: config.dialect,
        dialectModule: config.dialect === 'postgres'
            ? require('pg')
            : require('mysql2'),
        timezone: config.timezone,
        port: config.port,
        pool: config.pool,
        logging: false
    }
)

console.log(`[DATABASE]: Connecting to database..`)

db.authenticate().then(() => {
    console.log(`[DATABASE]: Database is connected to ${config.host} named '${config.name}'`)
})

console.log(`[DATABASE]: Synchronizing database...`)

db.sync({ alter: true }).then(() => {
    console.log(`[DATABASE]: Database has been synced!`)
})

module.exports = db