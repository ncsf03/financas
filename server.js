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

app.post('/transacoes', (req, res) => {
    const {tipo, valor, descricao} = req.body
    const usuarioId = req.session.usuario.id
    
    const query = 'INSERT INTO transacoes (usuario_id, tipo, valor, descricao, data_transacao) VALUES(?, ?, ?, ?, NOW())'

    db.query(query, [usuarioId, tipo, valor, descricao], (err) =>{
        if (err) {
            console.error(err)
            return res.send('Erro ao salvar transação')
        }

        res.redirect('/transacoes')
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

        db.query(`SELECT
            SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) - SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) AS saldo
            FROM transacoes WHERE usuario_id = ?`, 
        [usuarioId],
        (err, resultadoSaldo) => {
            if(err){
                console.log(err)
                return res.send("erro ao calcular saldo :/")
            }
            
            const saldo = resultadoSaldo[0].saldo || 0

            db.query('SELECT nome FROM categorias ORDER BY nome', (err, categorias) => {
               if (err) {
                console.log(err)
                return res.send("Erro ao buscar categorias")
                } 

                res.render('transacoes', {
                    usuario: req.session.usuario,
                    transacoes: results,
                    saldo: saldo,
                    categorias
                })
            })
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
    console.log(`Rodando na porta: ${port}`)
})