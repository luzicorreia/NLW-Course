// Teste: console.log(dados), console.log('entrei aqui') ou  {proffys, title: "Olha eu aqui"})
// Servidor 
const express = require('express')
const server = express()
const{
    pageLanding,
    pageStudy,
    pageGiveClasses,
    saveClasses
} = require('./pages')
    
//Configurar nunjucks (template engine)
const nunjucks = require('nunjucks')
nunjucks.configure('src/views', {
    express: server,
    noCache: true,
})

// Inicio e configuração do servidor
server
// receber os dados do req.body
.use(express.urlencoded({ extended: true}))
// Configurar arquivos estaticos (css, scripts, imagens)
.use(express.static("public"))
// rotas de aplicação
.get("/", pageLanding)
.get("/study", pageStudy)
.get("/give-classes", pageGiveClasses)
.post("/save-classes", saveClasses)
// Start do servidor
.listen(5502)