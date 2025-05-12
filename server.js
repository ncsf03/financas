const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static('public'))

const db = mysql.createConnection({
    host:'localhost',
    user:'root',    
    password:'555',    
    database:'financas'
})

app.get('/', (req, res) => {
    res.send('Olá Mundo!')
})

app.listen(port, () => {
    console.log('Rodando na porta ${port}')
})