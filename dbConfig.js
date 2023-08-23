require("dotenv").config();

const {Pool} = require('pg');

// const isProduction = process.env.NODE_ENV === 'production';

// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
    
    user: "postgres",
    password: "5454",
    host: "localhost", // Fix the typo here
    port: 5432,
    database: "authentication"
    
})

module.exports = {pool}