// IMPORTS
var questions = require('./questions')
var path = require('path')
var http = require('http')
const cookieParser = require('cookie-parser')
var express = require('express')
var {Server} = require('socket.io')
const morgan = require('morgan')

// Server Setup
var app = express()
var server = http.createServer(app)

// Express app Setup
app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, 'static')))
app.use(express.urlencoded({extended : true}))
app.use(express.json({type:'application/json'}))
app.use(cookieParser('gjalskfmkamsi238291jskmaçfm'))
app.use(morgan('short'))

var users = [
    {id : 0, username : "Lyn", highscore : 250},
    {id : 2, username : "Connor", highscore : 350},
    {id : 3, username : "Roberto", highscore : 450},
    {id : 4, username : "Ana", highscore : 550},
    {id : 5, username : "Victor", highscore : 150}
]

var unusedId = 6

app.use((req,res, next) => {
    
    var user = users.find(user => user.id == req.cookies.userId)
   
    if(user == undefined){
        user = {id : unusedId, username : null, highscore : 0}
        users.push(user)
        res.cookie('userId', user.id)
        unusedId += 1
    }

    req.user = user
    next()
})


app.get('/', (req,res) => {
    res.render('index.pug')
})

app.get('/question/:id/', (req,res) => {
    var question = questions.findById(req.params.id)
    res.json(question)
})

app.get('/randomQuestion/', (req,res) => {
    var randomQuestion = questions.random()
    res.json(randomQuestion)
})

app.get('/getScoreboard', (req,res) => {
    var allScores = users.filter(user => user.username != null)
    allScores.sort((user1,user2) => user2.highscore - user1.highscore)
    allScores = allScores.splice(0,10)

    for (let i = 0; i < allScores.length; i++) {
        const user = allScores[i];
        user.standing = i + 1
        user.isClient = user.id == req.user.id
    }

    if (allScores.find(user => user.isClient) == null){
        var userIndex = users.findIndex(user => user.id == req.user.id)
        
        var userClone = {
            id : req.user.id, 
            username : (req.user.username == null)? "Você" : req.user.username,
            standing : userIndex + 1, 
            highscore : req.user.highscore,
            isClient : true
        }

        allScores.push(userClone)
    }

    res.json(allScores)
})

app.get('/getData',(req,res) => {
    res.json(req.user)
})

// FIXME: this can easily be abused, figure out a way to verify if the user really obtained that highscore
app.post('/setScore/', (req,res) => {
    
    if(req.user.highscore < req.body.score){
        req.user.highscore = req.body.score
    }
    
    res.json("OK")
})

app.post('/setUsername/', (req,res) => {
    req.user.username = req.body.username
    res.status(200).json('OK')
})

const PORT = process.env.PORT | 3000
server.listen(PORT, () => {
    console.log(`Server Started, Listening on port ${PORT}`)
})
