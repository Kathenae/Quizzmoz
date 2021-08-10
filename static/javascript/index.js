
var userData
var currentQuestion
var timeInSeconds
var correctlyAnsweredCount
var currentQuestionCount
var timeout
var choiceIsMade

var choiceButtons = [
    document.getElementById('choice1'),
    document.getElementById('choice2'),
    document.getElementById('choice3'),
    document.getElementById('choice4'),
]

Init()

function Init() {

    var returnAction = (evt) => {
        stopTimer()
        showPanel('menuPanel')
    }
    document.getElementById('returnButton').onclick = returnAction
    document.getElementById('returnButton2').onclick = returnAction
    document.getElementById('returnButton3').onclick = returnAction
    document.getElementById('returnButton4').onclick = returnAction
    document.getElementById('returnButton5').onclick = returnAction

    document.getElementById('menuPanel').onShown = function () {
        if (userData.username) {
            $('#username').text(userData.username)
        }

        // Setup menu buttons
        document.getElementById('startButton').onclick = (evt) => {
            showPanel('playPanel')
            startGame()
        }

        document.getElementById('multiplayerButton').onclick = (evt) => {
            showPanel('multiplayerPanel')
        }

        document.getElementById('scoreboardButton').onclick = (evt) => {
            showPanel('scoreboardPanel')
        }

        document.getElementById('challengeButton').onclick = (evt) => {
            showPanel('challengePanel')
        }

    }

    document.getElementById('playPanel').onShown = function () {
        
        // Setup next question button handler
        nextQuestionButton.onclick = (evt) => {
            if (timeout == false) {
                startTimer()
                showPanel('playPanel')
            }
        }

        // Setup choice buttons click handler
        for (let i = 0; i < choiceButtons.length; i++) {
            choiceButtons[i].onclick = (evt) => {
                onChoiceMade(i)
            }
        }
        

        // hide content until we fetch stuff
        stopTimer()
        document.getElementById('questionContent').style.opacity = "0%"
        $('#spinner').show()

        fetchRandomQuestion((newQuestion) => {
            
            // when fetch is done
            startTimer()
            document.getElementById('questionContent').style.opacity = "100%"
            $('#spinner').hide()

            currentQuestion = newQuestion

            for (let i = 0; i < choiceButtons.length; i++) {
                const button = choiceButtons[i];
                button.className = "btn btn-primary m-2"
                button.innerText = currentQuestion.choices[i]
            }

            choiceIsMade = false
            document.getElementById('nextQuestionButton').hidden = true
            document.getElementById('explanationLabel').innerText = ""
            document.getElementById('questioNProgressLabel').innerText = `Pergunta ${currentQuestionCount}`
            document.getElementById('correctAnswersLabel').innerText = `${correctlyAnsweredCount * 50} Pts`
            document.getElementById('answerResultLabel').innerText = ""
            document.getElementById('question').innerText = currentQuestion.text
        })
    }

    document.getElementById('scoreboardPanel').onShown = function () {
        $(document).load('/getScoreboard', (scores) => {
            scores = JSON.parse(scores)
            document.getElementById('scoreList').innerHTML = ""
            for (let i = 0; i < scores.length; i++) {
                const userScore = scores[i];
                const userClass = (userScore.isClient)? "text-flash" : ""
                document.getElementById('scoreList').innerHTML += `<button class="btn btn-secondary m-2" style="width:100%">
                <h3 class="float-left">${userScore.standing}.</h3>
                <span class=${userClass}>${userScore.username}</span>
                <br>
                <span class="badge badge-info m-0">${userScore.highscore}pts</span>
            </button>`
            }
        })
    }

    document.getElementById('endGamePanel').onShown = function () {
        document.getElementById('playAgainButton').onclick = (evt) => {
            startGame()
        }

        document.getElementById('scoreboardButton2').onclick = (evt) => {
            showPanel('scoreboardPanel')
        }

    }

    document.getElementById('multiplayerPanel').onShown = function (){

    }

    // Load user data
    $(document).load('/getData', (data) => {
        userData = JSON.parse(data)
        showPanel('menuPanel')
    })

}

function startGame() {
    timeInSeconds = 120
    correctlyAnsweredCount = 0
    currentQuestionCount = 1
    timeout = false
    choiceIsMade = false
    startTimer()
    showPanel('playPanel')
}

function onChoiceMade(choiceNumber) {

    if(choiceIsMade || timeout){
        return
    }

    currentQuestionCount += 1

    // stops user from making any choices
    choiceIsMade = true
    stopTimer()

    // Show the explanation, if defined
    if (currentQuestion.explanation != undefined) {
        document.getElementById('explanationLabel').innerText = currentQuestion.explanation
    }

    // figure out if the choice is correct
    var correctChoices = currentQuestion.correctChoicesNumbers
    var choiceIsCorrect = correctChoices.find(n => n == choiceNumber) != undefined

    if (choiceIsCorrect == false) {
        showCorrectChoices(correctChoices)

        choiceButtons[choiceNumber].className = "btn btn-danger m-2"
        document.getElementById('answerResultLabel').innerText = "Resposta Errada"
        document.getElementById('answerResultLabel').className = "text-danger"
        playSound('wrong.mp3')
    }
    else {
        correctlyAnsweredCount += 1
        showCorrectChoices(correctChoices)
        document.getElementById('answerResultLabel').innerText = "Resposta Correcta!"
        document.getElementById('answerResultLabel').className = "text-success"
        choiceButtons[choiceNumber].className = "btn btn-outline-success m-2"
        playSound('correct.mp3')
    }

    document.getElementById('nextQuestionButton').hidden = false
    document.getElementById('correctAnswersLabel').innerText = `${correctlyAnsweredCount * 50} Pts`
}

function showCorrectChoices(correctChoices) {
    correctChoices.forEach(number => {
        choiceButtons[number].className = "btn btn-success m-2"
    })
}

function fetchRandomQuestion(callback) {
    $(document).load('./randomQuestion/', (questionJson) => {
        var question = JSON.parse(questionJson)

        if (currentQuestion != undefined && question.id == currentQuestion.id) {
            fetchRandomQuestion(callback)
        }
        else {
            callback(question)
        }
    })
}

timerIsRunning = false

function startTimer() {
    timerIsRunning = true
}

function stopTimer() {
    timerIsRunning = false
}

setInterval(() => {

    if (timerIsRunning == false) {
        return
    }

    playSound('tick.mp3')

    var minutes = Math.floor(timeInSeconds / 60)
    var seconds = Math.floor(timeInSeconds % 60)
    document.getElementById('timeLabel').innerText = `${minutes}:${seconds}`

    timeInSeconds -= 1
    timeInSeconds = (timeInSeconds <= 0) ? 0 : timeInSeconds

    if (seconds == 0 && minutes == 0) {
        timeout = true
        choiceIsMade = true
        stopTimer()
        playSound('timeout.mp3')

        // Show the explanation, if defined
        if (currentQuestion.explanation != undefined) {
            document.getElementById('explanationLabel').innerText = currentQuestion.explanation
        }

        document.getElementById('answerResultLabel').innerText = "Tempo Esgotado!!"
        document.getElementById('answerResultLabel').className = "text-danger"
        showCorrectChoices(currentQuestion.correctChoicesNumbers)

        // Send score to server for processing
        var score = correctlyAnsweredCount * 50
        postData('/setScore', { score }, (status) => { console.log(status) })

        // Wait for some time, then show the endgamePanel
        setTimeout(() => {
            showPanel('endGamePanel')
            document.getElementById('finalScoreBadge').innerText = `${score}pts`

            if (userData.username != null) {
                $('#usernameForm').hide()
                $('#showScoreBoardButton').show()
                return
            }

            $('#showScoreBoardButton').hide()

            $('#sendButton').on('click', (evt) => {
                document.getElementById('usernameErrorLabel').innerText = ""

                var username = document.getElementById('usernameField').value.trim()

                var hasErrors = username.length < 3 || username.length > 12

                if (hasErrors) {
                    document.getElementById('usernameErrorLabel').innerText = 'O nome deve conter 3 a 12 letras'
                    return
                }

                postData('/setUsername/', { username: username }, (response) => {
                    if (response != "OK")
                        return
                    userData.username = username
                    $('#usernameForm').hide()
                    $('#showScoreBoardButton').show()
                })


            })

        }, 2000)
    }

}, 1000)

var foundSounds = {}

function postData(url, data, onDone) {

    $.ajax({
        url,
        data: JSON.stringify(data),
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
    })
        .then(response => onDone(response))
        .catch(err => console.log('error ', err))

}

function showPanel(panelName) {

    // Hide every panel... done manually for now
    $('#playPanel').hide()
    $('#menuPanel').hide()
    $('#endGamePanel').hide()
    $('#scoreboardPanel').hide()
    $('#multiplayerPanel').hide()
    $('#challengePanel').hide()

    // show the panel
    $("#" + panelName).show()
    
    var panelDOM = document.getElementById(panelName)
    panelDOM.style.animation = 'none'
    panelDOM.offsetHeight
    panelDOM.style.animation = null

    if (panelDOM.onShown){
        panelDOM.onShown()
    }
}

function playSound(soundName) {
    document.getElementById(soundName).play()
}