
class Question{
    constructor(id,text, choices,correctChoicesNumbers, explanation){
        this.id = id
        this.text = text;
        this.choices = choices;
        this.correctChoicesNumbers = correctChoicesNumbers
        this.explanation = explanation
    }

    isChoiceCorrect(choiceNumber){
        return this.correctChoicesNumbers.find(n => n == choiceNumber) != undefined
    }
}

const questionsList = [
    new Question("Q1", "Qual das seguintes opções não é uma linguagem de programação?", ["Javascript", "Html", "Python", "C"], [1], "Html não é considerada uma linguagem de programação"),
    new Question("Q2", "Das opções abaixo, identifique o intruso", ["2", "4", "8", "7"], [3], "Sete(7) não é um multiplo de 2"), 
    new Question("Q3", "Quantos bits tem um byte?", ["2", "8", "16", "254"], [1]), 
    new Question("Q4", "Qual dos seguintes softwares não é considerado uma IDE", ["Eclipse", "Visual Studio", "Visual Studio Code", "Android Studio"], [2]), 
    new Question("Q5", "Qual será o valor de x na expressão \'x = 1+1 == 2\'", ["true/verdadeiro", "2", "false/falso", "Nenhuma"], [0]), 
    new Question("Q7", "Bill Gates, é um dos fundadores de que empresa desenvolvedora de sistemas operativos", ["Apple", "Microsoft", "Tesla", "Nokia"], [1], 'Microsoft é conhecida principalmente por desenvolver o sistema operativo Windows'), 
    new Question("Q8", "Qual deste algoritmos é usado para ordenar elementos numa lista", ["Bubble Sort", "AStar", "Game of Life", "HashMap"], [0]), 
    new Question("Q9", "Qual destas opções é exemplo de um Game Engine (Motor de Jogo)", ["Unity", "Play Store", "Apple Store", "Blender"], [0]), 
    new Question("Q10", "Qual destes navegadores foi desenvolvido pela Google", ["Opera", "Internet Explorer", "Chrome", "Edge"], [2]), 
    new Question("Q11", "Escolha a sua linguagem de programação preferida", ["Html", "Javascript", "C#", "Java"], [1,2,3], 'Todas opções são validas, excepto html... não é uma linguagem usada para programar'), 
    new Question("Q12", "HTTP é exemplo de?", ["Uma linguagem de programação", "Uma IDE", "Um motor de busca", "Um protocolo da Internet"], [3]), 
    new Question("Q13", "Qual destes não é uma framework do backend", ["NextJS", "Django", "ReactJS", "Microsoft Asp.Net"], [2]), 
    new Question("Q14", "Eclipse é uma IDE usada para desenvolver softwares em que linguagem", ["Português", "Inglês", "Java", "Python"], [2]), 
    new Question("Q15", "Qual é a representação de 5 em bits", ["0101", "0010", "1010", "1111"], [0]), 
    new Question("Q16", "A Sigla RGBA significa", ["Royal Great Britain Army", "Red Green Blue Alpha", "Real Great British Army", "Red Green Blue Amethyst"], [1], "A Sigla é usada referindo se a combinaçáo de cores que formam um pixel, onde Alpha refere-se a opacidade do pixel"), 
    new Question("Q17", "Photoshop é exemplo de que tipo de software", ["Editor de texto", "Editor de imagens", "Editor de video", "Editor de Audio"], [1]), 
    new Question("Q18", "Escolha a tua rede social favorita", ["Youtube", "Facebook", "Firefox", "Twitter"], [0,1,3]), 
    new Question("Q19", "Das opções abaixo, identifique o introso", ["Bill Gates", "Barrack Obama", "Steve Jobs", "Steve Wozniack"], [1]), 
    new Question("Q20", "Das opções abaixo, identifique o introso", ["[1,2,3]", "[45,46,47]", "[2,3,1,5,4,7]", "[12,13,13,14,15]"], [2], "A lista [2,3,1,5,4,7] não esta ordenada"), 
    new Question("Q21", "O que significa \"www\"?", ["World Wide Web", "Wide Western Web", "Worst Wet Weather", "Western World War"], [0]), 
    new Question("Q22", "Qual é o comprimento de uma piscina olímpica", ["50 metros", "100 metros", "200 metros", "500 metros"], [0]),
    new Question("Q23", "Que forma geométrica é geralmente usada para sinais de parada?", ["Triângulo", "Círculo", "Octágono", "Quadrado"], [2]), 
    new Question("Q24", "O que é \"acrofobia\"?", ["Medo do escuro", "medo de altura", "medo de água", "nehuma das opções"], [1]),
    new Question("Q25", "Qual é o nome do homem que lançou o eBay em 1995?", ["Jeff Bezos", "Steve Jobs", "Pierre Omidyar", "nehuma das opções"], [2]), 
    new Question("Q26", "Que animal é usado no logotipo da Porshe?", ["Leão", "Serpente", "Cavalo", "Urso"], [2]), 
    new Question("Q27", "Qual é o nome do maior oceano na Terra?", ["Oceano Pacífico", "Oceano Indico", "Oceano Atlântico", "Oceano Glacial Ártico"], [0]),
    new Question("Q28", "O Oceano Pacífico esta situado entre que continentes?", ["Continente Americano e Africano", "Continente Europeu e Africano", "Continente Asiático e Antártico", "Continente Americano e Ásiatico"],[3]),
    new Question("Q29", "São países do continente americano excepto?", ["Canada", "Estados Unidos", "Mexico", "Espanha"], [3], "Espanha localiza se no continente Europeu"),
    new Question("Q30", "Qual foi o primeiro refrigerante no espaço?", ["Coca Cola", "Pepsi", "7 Up", "Sprite"], [0], "A Coca se tornou o primeiro refrigerante a ser consumido no espaço sideral a bordo do Ônibus Espacial Challanger em 12 de julho de 1985"), 
]
 
exports.all = () => questionsList
exports.random = () => questionsList[Math.round(Math.random() * questionsList.length)]
exports.findById = (id) => questionsList.find(q => q.id == id)
