const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const session = require('express-session')


const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static('public'))

app.use(session({
    secret: 'shhh',
    resave: false,
    saveUninitialized: true
}))

const db = mysql.createConnection({
    host:'localhost',
    user:'root',    
    password:'555',    
    database:'financas',
    port: 3306
})

db.connect(err=> {
    if (err) throw err
    console.log('conectado ao banco de dados MySQL')
})

app.get('/register', (req, res) => {
    res.render('registro')
})

app.post('/register', (req, res) => {
    const { usuario, senha } = req.body
    db.query('INSERT INTO usuarios (usuario, senha) VALUES (?,?)', [usuario, senha], (err) => {
        if (err) {
            console.error(err)
            return res.send('Erro ao cadastrar usuário')
        }
        res.send('Usuario cadastrado com sucesso!')
    })
})

app.get('/transacoes', (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/login')
    }

    const usuarioId = req.session.usuario.id

    db.query('SELECT * FROM transacoes WHERE usuario_id = ? ORDER BY data_transacao DESC', [usuarioId], (err, results) => {
        if (err) {
            console.error(err)
            return res.send("Erro ao buscar transações")
        }

        res.render('transacoes', {
            usuario: req.session.usuario,
            transacoes: results
        })
    })
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) =>{
    const {usuario, senha} = req.body
    db.query('SELECT * FROM usuarios WHERE usuario = ? AND senha = ?', [usuario, senha], (err, results) => {
        if (err) {
            console.error(err)
            return res.send('Erro ao verificar login')
        }
        if(results.length > 0) {
            req.session.usuario = results[0]
            res.redirect('/transacoes')
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