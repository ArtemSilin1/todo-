const { Client } = require("pg")

const client = new Client({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
})

client.connect()
.then(() => console.log("Подключено к бд успешно"))
.catch(error => console.log("Ошибка подключения к бд: ", error))

module.exports = client