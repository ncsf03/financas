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

db.connect(err=> {
    if (err) throw err
    console.log('conectado ao banco de dados MySQL')
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html')
})

app.post('/register', (req, res) => {
    const { usuario, senha } = req.body
    db.query('INSERT INTO usuarios (usuario, senha VALUES (?,?)', [usuario, senha], (err) => {
        if (err) {
            console.error(err)
            return res.send('Erro ao cadastrar usuário')
        }
        res.send('Usuario cadastrado com sucesso!')
    })
})

app.post('/login', (req, res) =>{
    const {usuario, senha} = req.body
    db.query('SELECT * FROM usuarios WHERE usuario = ? AND senha = ?', [usuario, senha], (err, results) => {
        if (err) {
            console.error(err)
            return res.send('Erro ao verificar login')
        }
        if(results.length > 0) {
            res.send('Login bem sucedido')
        } else{
            res.send('Usuário ou senha inválidos')
        }
    })
})

app.get('/', (req, res) => {
    res.send('Olá Mundo!')
})

app.listen(port, () => {
    console.log('Rodando na porta:${port}')
})