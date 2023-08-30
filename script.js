const MainCanvas = document.getElementById("game")
const InvCanvas = document.getElementById("inventory")
const ctx = MainCanvas.getContext("2d")
const inv = InvCanvas.getContext("2d")
//нарисуем сетку
let width = MainCanvas.width
let height = MainCanvas.height

let invWidth = InvCanvas.width
let invHeight = InvCanvas.height
inv.fillRect(0,0,invWidth,invHeight)

let fon = new Image(width,height)
fon.src = "img/l1.png"
ctx.drawImage(fon,0,0)
i = 0
coins = 0
inventory = []
CurrentDialog = []
roundsRes = [0,0,0]
currentScene = 1
PlayerDiceCell=1
NovelTimer=0
isDialog = false
ctx.font = "20px serif";

// ? Функция для ограничения числа
function Ranger(num,min,max){
    if (num<min)
        num = min
    if (num>max)
        num = max
    return num
}
// ? Функция для рандома
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
// ? Коллизия объектов с курсором на сцене
function collision(x,y,xo,yo,width,height){
    if (x>xo && x<xo+width && y>yo && y<yo+height){
        return true
    }else{
        return false
    }
}
// ? Функция для постепенного отображения текста в диалоге (Не в игре в кости)
function novellPrint(txt){
    if(NovelTimer>txt.txt.length){
        NovelTimer=0;
        return
    }
    if (txt.name===undefined){
        txt.name="..."
    }
    sayDialog(txt.txt.slice(0, NovelTimer),txt.name)
    NovelTimer++
    setTimeout(novellPrint,5,txt)
}
//? Функция клика по инвентарю вне игры в кости
function InvClick(x,y){
    invY = Math.floor(y/40)
    console.log("inv y:"+invY)
    //кликнули ли мы по проедмету
    if (invY>0){
        //кликнули ли мы в нужную фазу боя?
        if (CanDrink != 1){
            alert("Сейчас бухать нельзя")
            return
        }
        if (inventory[invY-1]=="Эль"){
            lowest = 7
            lowestI = 0
            for (i in enemyScore){
                if (enemyScore[i]<lowest){
                    lowestI = i
                }
            }
            enemyScore[lowestI]=1
            ctx.fillStyle="rgb(110,40,40)"
            ctx.fillRect(DiceCell2X + DiceCellmargin*-lowestI + DiceCellSize*-lowestI,DiceCell2Y,DiceCellSize,DiceCellSize)
            ctx.fillStyle="rgb(200,0,0)"
            ctx.fillText(enemyScore[lowestI],DiceCell2X-(DiceCellSize+DiceCellmargin)*lowestI+25,DiceCell2Y+80)
            if (game==1)// переключение раунда в обучении
                round=4
            delItem("Эль")
        }else{
            alert("С этим нельзя взаимодействовать")
        }
    }
}
let magaz = new Image(width,height)
magaz.src = "img/scene/magaz.png"
let portnoy = new Image(width,height)
portnoy.src = "img/scene/portnoy.png"
firstBarShop=true
function ShopOpen(Shop){
    if (Shop == 0){
        //Открываем барную стойку
        if (firstBarShop){
            CurrentDialog=
            [{txt:"Наш герой, как обычно, находит Пита, начинающимначищающим деревянные кружки до блеска.", name:"Рассказчик"},
            {txt:"Здравствуйте!", name:"Герой (главный)"},
            {txt:"Привет. Что хотел?", name:"Пит"},
            {txt:"У меня есть знакомый, которому очень нужна ваша помощь.", name:"Герой (главный)"},
            {txt:"Кто он и как я то ему помогу?", name:"Пит"},
            {txt:"А вот, смотрите.", name:"Герой (главный)"},
            {txt:"И указывает Питу на Петра, собирающего объедки со стола.", name:"Рассказчик"},
            {txt:"Обычный нищий, которому я позволяю ночевать в зале, лишь только потому что он не мешает никому. Чем ему ещё помочь то? Работы у меня для него нет.", name:"Пит"},
            {txt:"Он мне рассказывал, что уже много лет странствует по королевству и ищет своих родителей, от которых ушёл когда-то…", name:"Герой (главный)"},
            {txt:"На лице Пита отразилось множество эмоций. Видно было, что в нём глубоко откликнулась беда Петра.", name:"Рассказчик"},
            {txt:"И поэтому он всё хотел поговорить с вами. Много же странствующего люду в таверне, может слышали чего. Сильно подсобите ему.", name:"Герой (главный)"},
            {txt:"Ответ не заставил себя ждать", name:"Рассказчик"},
            {txt:"Я помогу ему. Как зовут то хоть твоего друга?", name:"Пит"},
            {txt:"Пётр", name:"Герой (главный)"},]
            dialog()
            firstBarShop=false
        }
        
        ctx.drawImage(magaz,0,0)
        //Ассоротимент 
        assort = ["Ром","Медовуха","Эль"]

        //Отрисовка асортимента из массива
        MainCanvas.onclick = function(e) { // обрабатываем клики мышью
            var x = (e.pageX - MainCanvas.offsetLeft) | 0;
            var y = (e.pageY - MainCanvas.offsetTop)  | 0;
            console.log([x, y]); // выхов функции действия
            // alert("Магазик")
            if (!collision(x,y,300,50,500,600)){
                drawScene(currentScene)
            }
        };
    }
    if (Shop == 1){
        //Открываем портного
        
        ctx.drawImage(portnoy,0,0)
        //Ассоротимент 
        assort = ["Одежда1","Одежда2","Одежда3"]

        //Отрисовка асортимента из массива
        MainCanvas.onclick = function(e) { // обрабатываем клики мышью
            var x = (e.pageX - MainCanvas.offsetLeft) | 0;
            var y = (e.pageY - MainCanvas.offsetTop)  | 0;
            console.log([x, y]); // выхов функции действия
            // alert("Магазик")
            if (!collision(x,y,300,50,500,600)){
                drawScene(currentScene)
            }
        };
    }
}
let ukaz = new Image(width,height)
ukaz.src = "img/scene/ukaz.png"
function Label(){
    //открывается листочек с текстом
    
    ctx.drawImage(ukaz,0,0)
    MainCanvas.onclick = function(e) { // обрабатываем клики мышью
        drawScene(currentScene)
    };
}
// ? Запуск игры в кости и включение соответствующих функций
function DiceGame(game){
    //* ------------- Dice Game -------------
    round = 0
    BattleRound=0
    playerScore = []
    enemyScore = []
    Animation = false
    function DrawRoundIndicator(){
        roundsRes[BattleRound] = Ranger(summer(),-1,1)
        ctx.fillStyle="rgb(160,160,160)"
        ctx.fillRect(700,610,300,100)

        ctx.fillStyle="rgb("+(Ranger(-roundsRes[0],0,1)*100+110)+","+(Ranger(roundsRes[0],0,1)*100+110)+",110)"
        ctx.fillRect(725,620,70,70)
        ctx.fillStyle="rgb("+(Ranger(-roundsRes[1],0,1)*100+110)+","+(Ranger(roundsRes[1],0,1)*100+110)+",110)"
        ctx.fillRect(805,620,70,70)
        ctx.fillStyle="rgb("+(Ranger(-roundsRes[2],0,1)*100+110)+","+(Ranger(roundsRes[2],0,1)*100+110)+",110)"
        ctx.fillRect(885,620,70,70)
        console.log(roundsRes)
    }
    function drawDiceGame(){
        // fon
        ctx.fillStyle="rgb(254,250,230)"
        ctx.fillRect(0,0,width,height)

        // dice cells
        DiceCellSize = 100
        DiceCellmargin = 10
        DiceCell1X = 20
        DiceCell1Y = 600
        DiceCell2X = 1165
        DiceCell2Y = 25
        ctx.fillStyle="rgb(250,240,220)"
        ctx.fillRect(DiceCell1X-DiceCellmargin,DiceCell1Y-DiceCellmargin,(DiceCellmargin+DiceCellSize)*5+DiceCellmargin,DiceCellSize+DiceCellmargin*2)
        ctx.fillRect(DiceCell2X-(DiceCellmargin+DiceCellSize)*4-DiceCellmargin,DiceCell2Y-DiceCellmargin,(DiceCellmargin+DiceCellSize)*5+DiceCellmargin,DiceCellSize+DiceCellmargin*2)

        ctx.fillStyle="rgb(220,200,200)"
        for (i=0;i<5;i++){
            ctx.fillRect(DiceCell1X + DiceCellmargin*i + DiceCellSize*i,DiceCell1Y,DiceCellSize,DiceCellSize)

            ctx.fillRect(DiceCell2X + DiceCellmargin*-i + DiceCellSize*-i,DiceCell2Y,DiceCellSize,DiceCellSize)
        }

        //Числа
        ctx.fillStyle="rgb(0,17,17)"
        ctx.font = "70px serif";
        for (i in playerScore){
            ctx.fillText(playerScore[i],DiceCell1X+(DiceCellSize+DiceCellmargin)*i+25,DiceCell1Y+80)
        }
        for (i in enemyScore){
            ctx.fillText(enemyScore[i],DiceCell2X-(DiceCellSize+DiceCellmargin)*i+25,DiceCell2Y+80)
        }
        //иконки
        ctx.fillStyle="rgb(100,170,170)"
        ctx.fillRect(10,10,200,200)
        ctx.fillRect(1070,510,200,200)

        //поле
        ctx.fillStyle="rgb(100,100,100)"
        ctx.fillRect(235,210,810,300)

        //индикатор раунда
        
        DrawRoundIndicator()
    }
    // ? Функция для постепенного отображения текста в диалоге (В ИГРЕ в кости)
    function InGameNovellPrint(txt){
        if(NovelTimer>txt.txt.length){
            console.log("@:end")
            console.log(txt.txt.length+"/"+NovelTimer)
            NovelTimer=0;
            return
        }
        console.log("@:"+txt.txt)
        sayDialog(txt.txt.slice(0, NovelTimer),txt.name)
        NovelTimer+=1
        setTimeout(InGameNovellPrint,5,txt)
    }
    //? Аналог запуска диалога внутри игры, необходимо изменение переменной CurrentDialog
    function InGameDialog(){
        if (!isDialog)
            openDialog()
        if (currentTextPart>=CurrentDialog.length){
            Block.innerHTML = ""
            isDialog = false
            currentTextPart=0
            drawDiceGame()
        }
        if (isDialog){
            console.log(currentTextPart)
            NovelTimer=0
            InGameNovellPrint(CurrentDialog[currentTextPart])
        }
    }
    //! Клик по инвентарю, с обработкой нажатия на различные предметы
    function InvClick(x,y){
        invY = Math.floor(y/40)
        console.log("inv y:"+invY)
        //кликнули ли мы по проедмету
        if (invY>0){
            //кликнули ли мы в нужную фазу боя?
            if (CanDrink != 1){
                alert("Сейчас спаивать нельзя")
                return
            }
            if (inventory[invY-1]=="Эль"){
                lowest = 7
                lowestI = 0
                for (i in enemyScore){
                    if (enemyScore[i]<lowest){
                        lowest = enemyScore[i]
                        lowestI = i
                    }
                }
                enemyScore[lowestI]=1
                ctx.fillStyle="rgb(110,40,40)"
                ctx.fillRect(DiceCell2X + DiceCellmargin*-lowestI + DiceCellSize*-lowestI,DiceCell2Y,DiceCellSize,DiceCellSize)
                ctx.fillStyle="rgb(200,0,0)"
                ctx.fillText(enemyScore[lowestI],DiceCell2X-(DiceCellSize+DiceCellmargin)*lowestI+25,DiceCell2Y+80)
                if (game==1)// переключение раунда в обучении
                    round=4
                delItem("Эль")
            }
            if (inventory[invY-1]=="Медовуха"){
                Highest = 0
                HighestI = 0
                for (i in enemyScore){
                    if (enemyScore[i]>lowest){
                        Highest = enemyScore[i]
                        HighestI = i
                    }
                }
                enemyScore[HighestI]=2
                ctx.fillStyle="rgb(100,40,40)"
                ctx.fillRect(DiceCell2X + DiceCellmargin*-HighestI + DiceCellSize*-HighestI,DiceCell2Y,DiceCellSize,DiceCellSize)
                ctx.fillStyle="rgb(200,10,10)"
                ctx.fillText(enemyScore[HighestI],DiceCell2X-(DiceCellSize+DiceCellmargin)*HighestI+25,DiceCell2Y+80)
                if (game==1)// переключение раунда в обучении
                    round=4
                delItem("Медовуха")
            }
            if (inventory[invY-1]=="Ром"){
                Highest = 0
                HighestI = 0
                for (i in enemyScore){
                    if (enemyScore[i]>lowest){
                        Highest = enemyScore[i]
                        HighestI = i
                    }
                }
                enemyScore[HighestI]-=2
                ctx.fillStyle="rgb(100,40,40)"
                ctx.fillRect(DiceCell2X + DiceCellmargin*-HighestI + DiceCellSize*-HighestI,DiceCell2Y,DiceCellSize,DiceCellSize)
                ctx.fillStyle="rgb(200,10,10)"
                ctx.fillText(enemyScore[HighestI],DiceCell2X-(DiceCellSize+DiceCellmargin)*HighestI+25,DiceCell2Y+80)
                if (game==1)// переключение раунда в обучении
                    round=4
                delItem("Медовуха")
            }
        }
        DrawRoundIndicator()
    }
    //? функция бросания кубиков, заносит значения в массивы
    function rollDice(){
        //оба игрока кидают кубики
        try{
            for (i in x)
            clearTimeout(x[i]);
        }catch{
            x = []
        }
        DiceX = 250
        DiceY = 300
        DiceDX = 6
        DiceDY = 1.2
        console.log("Все кинули кубики")
        i=0
        //значение на кубике
        playerScore = []
        for (i=0;i<PlayerDiceCell;i++){
            playerScore[i]=getRandomInt(6)+1
        }
        //значение на кубике
        enemyScore = []
        for (i=0;i<enemyDiceCell;i++){
            enemyScore[i]=getRandomInt(6)+1
        }
        enemyReroll()
        drawDiceGame()
        //анимация
        // while ((DiceDX+DiceDY)>1){
        //     i+=1
            
        //     DiceX   += DiceDX
        //     DiceY   += DiceDY
        //     DiceDX  *= 0.9
        //     DiceDY  *= 0.9
        //     DiceSize = 60
        //     x[i] = setTimeout((DiceX,DiceY)=>{
        //         drawDiceGame()
        //         ctx.fillStyle="rgb(250,250,250)"
        //         ctx.beginPath();
        //         ctx.lineTo(DiceX+30*Math.sin(DiceX/30), DiceY-30*Math.cos(DiceX/30));
        //         ctx.lineTo(DiceX-30*Math.cos(DiceX/30), DiceY-30*Math.sin(DiceX/30));
        //         ctx.lineTo(DiceX-30*Math.sin(DiceX/30), DiceY+30*Math.cos(DiceX/30));
        //         ctx.lineTo(DiceX+30*Math.cos(DiceX/30), DiceY+30*Math.sin(DiceX/30));
        //         ctx.fill();
        //     },20*i,DiceX,DiceY)   
        // }
    }
    //? Рерол по умолчанию
    function enemyReroll(){
        lowest = 7
        lowestI = 0
        for (i in enemyScore){
            if (enemyScore[i]<lowest){
                lowest = enemyScore[i]
                lowestI = i
            }
        }
        enemyScore[lowestI]=getRandomInt(6)+1
        ctx.fillStyle="rgb(110,140,50)"
        ctx.fillRect(DiceCell2X + DiceCellmargin*-lowestI + DiceCellSize*-lowestI,DiceCell2Y,DiceCellSize,DiceCellSize)
        ctx.fillStyle="rgb(200,100,50)"
        ctx.fillText(enemyScore[lowestI],DiceCell2X-(DiceCellSize+DiceCellmargin)*lowestI+25,DiceCell2Y+80)
    }
    //подсчет раунда
    function summer(){
        sum=0
        for (i in playerScore){
            sum += playerScore[i]
        }
        for (i in enemyScore){
            sum -= enemyScore[i]
        }
        return sum
    }
    //подсчет игры
    function gameOverScore(){
        sum=0
        for (i in roundsRes){
            sum += roundsRes[i]
        }
        return sum
    }
    //? Различные игровые сценарии для разных NPС
      //! Сцены В ИГРЕ -----------------------------------------------------------------------------------------
    if (game==1){
        drawDiceGame()
        enemyDiceCell = 1
        CanDrink=0
        
        round=0
        //? Функция любого клика, в первую очередь нужна для написания диалогов НПС во всемя игры в кости
        function click(x,y){
            
            if (collision(x,y,235,210,810,300)){
                //трогаем стол

                if (round==0){
                    CurrentDialog = [{txt:"Сына, хочу научить тебя играть"},{txt:"Просто стукни по столу"}]
                    InGameDialog()
                }else if(round==1){
                    rollDice()
                }else if(round==2){
                    CurrentDialog = [{txt:"Сна, напои меня"},{txt:"да"}]
                    InGameDialog()
                    CanDrink=1
                }else if(round==3){
                    CurrentDialog = [{txt:"че стоишь"},{txt:"тыкай в пойло"}]
                    InGameDialog()
                    round-=1
                }else if(round==4){
                    CanDrink=0
                    BattleRound+=1
                    if (summer()>0)
                        CurrentDialog = [{txt:"Ммм"},{txt:"поражение"}]
                    else
                        CurrentDialog = [{txt:"Ммм..."},{txt:"Ничья"}]
                    InGameDialog()
                }else if(round==5){
                    drawScene(currentScene)
                }
                round+=1
                roundsRes[BattleRound] = Ranger(summer(),-1,1)
                
            }
        }  
    } else if (game == 2){
        InGameDialog()
        // drawDiceGame()
        enemyDiceCell = 1
        CanDrink=1
        round=0
        rerolls=0
        BattleRound=0
        //? Все противники имеют уникальный рерол костей
        function enemyReroll(){
            //джо не перебрасывает
        }
        function click(x,y){
            //? REROLL
            if (collision(x,y,DiceCell1X,DiceCell1Y,(DiceCellSize+DiceCellmargin)*5,DiceCellSize)){
                ClickCell=Math.floor((x-DiceCell1X)/(DiceCellSize+DiceCellmargin))
                
                console.log("Cell: "+ClickCell+"/"+PlayerDiceCell)
                if (ClickCell>=PlayerDiceCell||rerolls<1){
                    return
                }
                
                playerScore[ClickCell] = getRandomInt(6)+1
                
                DrawRoundIndicator()
                ctx.fillStyle="rgb(110,110,40)"
                ctx.fillRect(DiceCell1X + DiceCellmargin*ClickCell + DiceCellSize*ClickCell,DiceCell1Y,DiceCellSize,DiceCellSize)
                ctx.fillStyle="rgb(200,200,0)"
                ctx.fillText(playerScore[ClickCell],DiceCell1X+(DiceCellSize+DiceCellmargin)*ClickCell+25,DiceCell1Y+80)
                rerolls-=1
            }
            if (collision(x,y,235,210,810,300)){
                //тестовый бой вообще без диалогов бест оф три
                rerolls=1
                if (round == 0){
                    //предбоевые действия
                    roundsRes = [0,0,0]
                    CurrentDialog = [{txt:"Джо, а вот расскажите, как вы в кости играете?", name:"Герой (главный)"},
                    {txt:"С *ИК* радостью!", name:"Пьяный Джо"},
                    {txt:"Этот стиль пь*ИК*яного мастера, передал моему отцу дед, а мой о*ИК*тец - мне.", name:"Пьяный Джо"},
                    {txt:"Пьяный Джо, изрядно пошатываясь, встал и попытался взять кубик. Правда он у него в глазах изрядно двоился, отчего для того что бы найти настоящий, ему потребовалось несколько попыток.", name:"Рассказчик"},
                    {txt:"Но всё же сграбастав кубик, пьяный мастер Джо на него хорошенько подышал, и одним грациозно-пьяным движением бросил его на стол…", name:"Рассказчик"},]                    
                    isDialog=true
                    setTimeout(InGameDialog, 10);
                    rerolls=0
                }
                else if (round == 1){
                    BattleRound=0
                    rollDice()
                    
                    //бросок кубов 1
                }
                else if (round == 2){
                    BattleRound=1
                    rollDice()
                    CurrentDialog = [{txt:"Джо, чего-то не работает ваш стиль пьяного мастера.", name:"Герой (главный)"},
                    {txt:"Как *ИК* нет? Всё же работа*ИК*ет, вот же кубик на столе.", name:"Пьяный Джо"},
                    {txt:"Ну а разве так можно выиграть?", name:"Герой (главный)"},
                    {txt:"Конечно! У меня вот иногда *ИК* получается.", name:"Пьяный Джо"},
                    {txt:"А как всегда выигрывать?", name:"Герой (главный)"},
                    {txt:"Ну, уж чего не знаю того *ИК* не знаю. Отец мне передал только стиль, а вот как всегда выигрывать - не рассказывал. Но главное не дай себе засохнуть! Хе-хе...", name:"Пьяный Джо"},]             
                    isDialog=true
                    setTimeout(InGameDialog, 1000);
                    
                    //бросок кубов 2 если оба раунда за гг или за противником то игра завершается
                }
                else if (round == 3){
                    BattleRound=2
                    rollDice()
                    
                    //бросок кубов 3 
                }else if (round == 4){
                    //подсчёт результатов
                    if (gameOverScore()>=0){
                        CurrentDialog = [{txt:"Проследив за исчезающими в ваших руках монетами, Пьяный Джо лишь горько вздохнул, потянулся за недопитым пивом, да так и уснул.", name:"Рассказчик"},]

                    }else{
                        CurrentDialog = [{txt:"Пьяный Джо сграбастал выигранные деньги, на удивление, очень быстро.", name:"Рассказчик"},
                        {txt:"Ну, это мне на *ИК* поддержку моего стиля.", name:"Пьяный Джо"},
                        {txt:"Ток ты это *ИК*, возвращайся. Ещё чему научу!", name:"Пьяный Джо"},
                        {txt:"И радостно захрапел", name:"Рассказчик"}]
                    }
                    isDialog=true
                    setTimeout(InGameDialog, 100);
                    setTimeout(drawScene, 90,currentScene);
                }
                DrawRoundIndicator()
                round+=1
                
            }
        }

    }else if (game == 3){ //! ИГРА 3
        InGameDialog()//диалог пред боем, текст задаётся так же перед боем
        // drawDiceGame()
        enemyDiceCell = 2
        CanDrink=1
        round=0
        rerolls=0
        BattleRound=0
        //? Все противники имеют уникальный рерол костей
        function enemyReroll(){
            let RI = getRandomInt(2)
            enemyScore[RI]=getRandomInt(6)+1
            ctx.fillStyle="rgb(110,140,50)"
            ctx.fillRect(DiceCell2X + DiceCellmargin*-RI + DiceCellSize*-RI,DiceCell2Y,DiceCellSize,DiceCellSize)
            ctx.fillStyle="rgb(200,100,50)"
            ctx.fillText(enemyScore[RI],DiceCell2X-(DiceCellSize+DiceCellmargin)*RI+25,DiceCell2Y+80)
        }
        function click(x,y){
            //? REROLL
            if (collision(x,y,DiceCell1X,DiceCell1Y,(DiceCellSize+DiceCellmargin)*5,DiceCellSize)){
                ClickCell=Math.floor((x-DiceCell1X)/(DiceCellSize+DiceCellmargin))
                
                console.log("Cell: "+ClickCell+"/"+PlayerDiceCell)
                if (ClickCell>=PlayerDiceCell||rerolls<1){
                    return
                }
                
                playerScore[ClickCell] = getRandomInt(6)+1
                
                DrawRoundIndicator()
                ctx.fillStyle="rgb(110,110,40)"
                ctx.fillRect(DiceCell1X + DiceCellmargin*ClickCell + DiceCellSize*ClickCell,DiceCell1Y,DiceCellSize,DiceCellSize)
                ctx.fillStyle="rgb(255,255,40)"
                ctx.fillText(playerScore[ClickCell],DiceCell1X+DiceCellmargin*ClickCell+DiceCellSize*ClickCell+DiceCellmargin,DiceCell1Y+80)
                rerolls-=1
            }
            if (collision(x,y,235,210,810,300)){
                //тестовый бой вообще без диалогов бест оф три
                rerolls=1
                if (round == 0){
                    //предбоевые действия
                    roundsRes = [0,0,0]
                    CurrentDialog = [{txt:"Дядь Фил.", name:"Герой (главный)"},
                    {txt:"Просто Фил", name:"Фил"},
                    {txt:"Хорошо, Просто Фил.", name:"Герой (главный)"},
                    {txt:"А-ха-ха-ха-ха! Пусть будет Просто Фил.", name:"Просто Фил"},
                    {txt:"Я спрашивал тут у люда всякого, говорят вы игрок то - не промах. В чём ваш секрет?", name:"Герой (главный)"},
                    {txt:"Хах, хитёр! Мы с тобой даже не доиграли, а ты уже все мои секреты выведать хочешь? Вот выиграешь -  расскажу!", name:"Просто Фил"}]
                    isDialog=true
                    setTimeout(InGameDialog, 10);   
                    rerolls=0
                }
                if (round == 1){
                    BattleRound=0
                    rollDice()
                    
                    //бросок кубов 1
                }
                if (round == 2){
                    BattleRound=1  
                    rollDice()

                    //бросок кубов 2 если оба раунда за гг или за противником то игра завершается
                }
                if (round == 3){
                    BattleRound=2
                    rollDice()
                    if (summer()<0){
                        CurrentDialog = [{txt:"Я победил!", name:"Герой (главный)"},
                        {txt:"Не спорю, всё честно.", name:"Просто Фил"},
                        {txt:"Так в чём же ваш секрет?", name:"Герой (главный)"},
                        {txt:"А-ха-ха! Ну хорошо, я тебе его открою, но сначала мне вот что. Чего это ты вдруг ищешь с кем силами померяться?", name:"Просто Фил"},
                        {txt:"Легла на лицо нашего героя тёмная-тёмная тень сомнений. Застыдился наш герой рассказывать свою историю. Но стоило только ему взглянуть на сиящего уверенностью Фила, как тут же передумал.", name:"Рассказчик"},
                        {txt:"Ох, набедокурил я как самое малое дитя. Выручил деньги за пшеницу, которую мы с батей так бережно растили, да и, как дурак последний, попался в лапы одной обольстительнице и всё проиграл: деньги, телегу, коня. Ещё и с чертом по пьяни поспорил, что Короля в кости обыграю.", name:"Герой (главный)"},
                        {txt:"У Фила после его слов лишь челюсть отвисла.", name:"Рассказчик"},
                        {txt:"Да уж, парень. Твои слова да сказителю какому на перо. Я б такую небылицу точно почитал…", name:"Просто Фил"},
                        {txt:"Но, даже так! Не всё потеряно и не время унывать!", name:"Просто Фил"},
                        {txt:"Так я то вроде и не это…", name:"Герой (главный)"},
                        {txt:"Поэтому вот, слушай мой секрет.", name:"Просто Фил"},
                        {txt:"Я обожаю играть в кости и поэтому так хорош! Играю в любую свободную минутку, с кем угодно, где угодно! Либо кузня, либо таверна. Смотреть на падающие кости люблю даже больше, чем на огонь в горниле.", name:"Просто Фил"},
                        {txt:"И именно в этом весь мой секрет, в том что никакого секрета нет! Мне нравится моё дело. А урок то тебе вот в чём - коли и вправду хочешь исправиться и всё вернуть, то не сворачивай со своего пути, как бы тяжело не было.", name:"Просто Фил"},
                        {txt:"Терпение и труд всё перетрут!", name:"Просто Фил"},
                        {txt:"У нашего героя, от столь хороших слов, аж потеплело на душе.", name:"Рассказчик"},
                        {txt:"Спасибо большое, Просто Фил! Во век вашу науку не забуду!", name:"Герой (главный)"}]
                        coins*=2
                        if (coins>20)
                        currentScene=11
                        

                    }else{
                        CurrentDialog = [{txt:"Ну ничего, парень, бывает. Ты главное не унывай и играй не на последние деньги.", name:"Просто Фил"}]
                        coins=Match.floor(coins/2)
                    }
                    
                    InGameDialog()
                    drawScene(currentScene)
                    //бросок кубов 3 
                }
                updateInv()
                DrawRoundIndicator()
                round+=1
                
            }
        }
    }
    //? В этом месте обновляются onclick обработчики событий чтобы обновить в них функцию click на новую
    MainCanvas.onclick = function(e) { // обрабатываем клики мышью
        if (isDialog){
            if (NovelTimer>0){
                return
            }
            currentTextPart+=1
            InGameDialog()
            return
        }
        var x = (e.pageX - MainCanvas.offsetLeft) | 0;
        var y = (e.pageY - MainCanvas.offsetTop)  | 0;
        console.log([x, y]); // выхов функции действия
        click(x,y)
    };
    InvCanvas.onclick = function(e) { // обрабатываем клики мышью
        var x = (e.pageX - InvCanvas.offsetLeft) | 0;
        var y = (e.pageY - InvCanvas.offsetTop)  | 0;
        console.log([x, y]); // выхов функции действия
        InvClick(x,y)//Х здесь по факту не нужен но он к счастью и не мешает, пусть будет
    };
    //* /Dice Game/ * ------------------------------------------------
}
//? Функция рисует сцену, ферма, Бар, замок и т.д. Это все тут
function drawScene(scene){
    let dream = new Image(width,height)
    let farm = new Image(width,height)
    let house = new Image(width,height)
    let grad = new Image(width,height)
    let tavern = new Image(width,height)

    dream.src = "img/scene/dream.png"
    farm.src = "img/scene/farm.png"
    house.src = "img/scene/house.png"
    grad.src = "img/scene/grad.png"
    tavern.src = "img/scene/tavern.png"
    ctx.drawImage(farm,0,0)

    let dadNPC = new Image(width,height)
    let generalNPC = new Image(width,height)
    let kingNPC = new Image(width,height)
    let s1NPC = new Image(width,height)
    let s2NPC = new Image(width,height)
    dadNPC.src = "img/npc/батя гг.png"
    generalNPC.src = "img/npc/генерал.png"
    kingNPC.src = "img/npc/король.png"
    s1NPC.src = "img/npc/стражник 1.png"
    s2NPC.src = "img/npc/стражник 2.png"

    //! Сцены -----------------------------------------------------------------------------------------
    if (scene == 1){
        
        //? У каждой сцены свои обработчики на клик
        function click(x,y){
            ctx.drawImage(farm,0,0)
            //у нас тут вступление/повествование
            if (currentScene==2){
                drawScene(2)
                return
            }
            CurrentDialog = [{txt:"Недалеко от славного города Костянск расположилась непримечательная деревушка, в которой самым громким событием за последние 10 лет был лишь побег петуха. Чуть в сторонке от неё, совсем рядышком, около того самого озера, живет обычная крестьянская семья.", name:"Рассказчик"},
            {txt:"Они, как и другие жители деревни, вовсю готовятся к предстоящей зиме, ведь скоро наступят холода. Однако нашего героя особо то и не заботят какие-то там холода. Ему бы сейчас чем-нибудь набить брюхо, да думать о мелочах житейских.", name:"Рассказчик"},
            {txt:"Матушка, когда кушать уж будем? Я скоро с голоду помру, а тут еще и батьку надо будет помочь со сбором урожая.", name:"Герой (главный)"},
            {txt:"Сейчас-сейчас, сынок. Только-только пришла с дойки. Ох, столько работы накопилось, к зиме бы успеть все дела наши переделать.", name:"Мама"},
            {txt:"Стоило только кому-то заикнуться о еде, как глава семейства уже тут как тут.", name:"Рассказчик"},
            {txt:"Давай, жена, накрывай стол. Сытный обед нам точно не поешает. Поедим и пахать пойдем с сыном, а то он небось так и будет бока отлёживать.", name:"Отец"},
            {txt:"Ну всё, всё.  Садитесь-ка уже к столу, обедать будем.", name:"Мама"},
            {txt:"Отец и сын жадно кушали сваренную на печи кашу, закусывая её свежеиспеченным хлебом. Набив животы, они сразу вышли из дома и направились к пшеничному полю, которое простиралось чуть ли не до самого горизонта.", name:"Рассказчик"},] 
            dialog()
            currentScene=2
            
        }
        
    }   
    // [{txt:"",name:""}]
    //* ----------------------------------------------------------------
    else if (scene == 2){
        ctx.drawImage(house,0,0)
        function click(x,y){
            if (!have("Серп"))
                    add("Серп")
                else{
                    currentScene =3
                    wheatMiniGame()
                    return
                }
                    
                CurrentDialog = [{txt:"Ну что, сынок, до самого вечера пахать будем. Эдак и немудрено будет всю жатву проморгать, коль буду я тебя, шалопая, постоянно стеречь. Берись, давай, за серп и не ленись. Как батька твой работай!", name:"Отец"},
                {txt:"Да я уж понял, что время поджимает. И так маманя с утра все уши прожужжала про эту подготовку к зиме.", name:"Герой (главный)"},
                {txt:"Ты на мать то не серчай, беспокоится она. Вот скоро закончим убирать урожай и время на забавы появится.", name:"Отец"},
                {txt:"Солнце палило нещадно, но это никого не останавливало от работы. Наоборот. Во всю стремился наш герой порадовать отца и нещадно жал серпом золотистые колосья.", name:"Рассказчик"},
                {txt:"Изрядно потрудившись, отец решил немного перевести дух.", name:"Рассказчик"},
                {txt:"Фух, славно мы потрудились. Отдохнем немного, а то уж денёк сегодня на редкость жаркий. Садись сюда, в тенёчке прохладней.", name:"Отец"},
                {txt:"Сидят отец с сыном в прохладной тени, отдуваются, всё стирая пот со лба, да радуются видом проделанной работы.", name:"Рассказчик"},
                {txt:"Ох молодец ты! Вот фиг тебя загонишь на поле, но стоит только споймать как работаешь за четверых. Не отлынивал бы ещё… Но, молодец! Горжусь тобой!", name:"Отец"},
                {txt:"А как гордился то собой наш герой!", name:"Рассказчик"},
                {txt:"Спасибо, бать.", name:"Герой (главный)"},
                {txt:"Но не был бы этот парень героем нашего рассказа, если б изменил себе.", name:"Рассказчик"},
                {txt:"А давай, если я больше тебя пшеницы соберу, то монетки получу и завтра на поле работать не буду, по рукам?", name:"Герой (главный)"},
                {txt:"Да как звонко рассмеялся! Ох, видели бы вы этот возмущённый отцовский взгляд! Но то всё напускное. Не был бы он папкой этого парня, если б не знал как совладать с ним.", name:"Рассказчик"},
                {txt:"Ты так родичей своих скоро в могилу сведешь! Ну ладно, так уж и быть. Хоть дитятко мое позабавится.", name:"Отец"},]
                dialog()
                
                
        }    
         
    }
    else if (scene == 3){
        if (coins>10){
        CurrentDialog = [{txt:"Ха, вот я и выиграл, больше тебя собрал! Теперь жду свои монетки, как ты и обещал!", name:"Герой (главный)"},
        {txt:"Заслужил, хорошо поработал, спору нет, но вот оказия эдакая. Как ты знаешь, уж недели две мы без денег. Так что как раз завтра пойдешь в город, ответственно продавать собранный урожай, понял? Уговор был лишь на работу в поле.", name:"Отец"},
        {txt:"Вот ты хитрый, пап! Ладно, пойду в город. Да и монетки как раз сгодятся на забавы городские…", name:"Герой (главный)"}, ]	
        }else{
            CurrentDialog = [{txt:"Вот черт, совсем мало пшеницы собрал...", name:"Герой (главный)"},
        {txt:"Эх. Как ты знаешь, уж недели две мы без денег. Так что как раз завтра пойдешь в город, ответственно продавать собранный урожай, понял?", name:"Отец"},
        {txt:"Что поделать.", name:"Герой (главный)"}, ]	
        }
        currentScene =4
        dialog()
        
    }else if (scene==4){
        ctx.drawImage(grad,0,0)
        CurrentDialog = [{txt:"Входит наш герой в город, всё разговаривая сам с собой", name:"Рассказчик"},
        {txt:"Славный город Костянск - столица нашего не менее славного королевства N. На его улицах так много пивнух, игорных домов и таверн, что кажется, будто мы здесь живём лишь затем, чтобы напиться, выйграть в кости ещё больше пива, затем завалиться в таверну, пировать до утра и дрыхнуть весь божий день... ", name:"Герой (главный)"},
        {txt:"На деле то так и есть, но именно сегодня у меня есть ответственное задание - продать батину пшеницу и вернуть все деньги в целости и сохранности. Нельзя отвлекаться на всякие праздные мысли!", name:"Герой (главный)"},
        {txt:"В эти дни Костянск выглядел ещё краше прежнего. Стражники поскидывали свои душные доспехи и вместе с рабочими натягивали раскрашенные полотна на неприметные стены домов. Туда сюда сновали бабы с кузовками, полными еды, да пробегали мальцы, неся длиннющие гирлянды в очередной дом. От чего, правда, когда над нашим героем пролетали гирлянды, лошадь шугалась и вставала на дыбы.", name:"Рассказчик"},
        {txt:"Долго ли коротко ли, но наш герой всё же добрался до рынка, пусть и засматриваясь на каждую юбку, да облизываясь на ларьки с кружками пенного.", name:"Рассказчик"},
        {txt:"Здрасть, дядь Гуго.", name:"Герой (главный)"},
        {txt:"О, привет… э-э-э… Привет!", name:"Дядя Гуго"},
        {txt:"Да, тоже давно не виделись.", name:"Дядя Гуго"},
        {txt:"Из тёмных недр лавки, выбирается внушительного вида дед, с огромными ручищами, уважаемой белой бородой и доброй улыбкой. Этими ручищами он как раз выудил пару незаполненных мешков с пшеницей.", name:"Рассказчик"},
        {txt:"Эх, чёрт, забыл как зовут тебя.", name:"Дядя Гуго"},
        {txt:"Бегемот!", name:"Чёрт"},
        {txt:"Проорал кто-то из-за спины, мерзким голосом.", name:"Рассказчик"},
        {txt:"Где!?", name:"Дядя Гуго"},
        {txt:"Дурак старый…", name:"Чёрт"},
        {txt:"Кто сказал!?", name:"Дядя Гуго"},
        {txt:"За углом лавки мелькнул демонический хвост.", name:"Рассказчик"},
        {txt:"Да чёрт его знает, дядь Гуго. Дети шалят. Я тута вон - доброй батиной пшениц привёз. Целую телегу!", name:"Герой (главный)"},
        {txt:"О, вот это хорошее дело. А то с праздником этим все запасы разобрали. Как ты её довёз только…", name:"Дядя Гуго"},
        {txt:"Грузно выйдя из-за прилавка, торговец направился к теле. Стоило только ему увидеть мешки с пшеницей, как тут же он стал серьёзен до нельзя. Запустив ручищи глубоко в пшеницу, дядя Гуго хорошенько её потрепал, пошерудил, присмотрелся к парочке зерён, не менее экспертно лизнул и глубоко вдохнул, да ка-а-ак чихнул, от чего вся пыль вылетела из мешка. Не зря его зовут пшеничным мастером!", name:"Рассказчик"},
        {txt:"Уф-ф-ф, хорошая. Беру! По 20 монет за мешок.", name:"Отображаемое имя"},
        {txt:"Дядь Гуго, ну вы чего. Праздник же на носу, а тут такая добротная батюшкина пшеница! 25 монет!", name:"Герой (главный)"},
        {txt:"Ишь чё удумал, хитрец. А давай-ка по старой костянской традиции - выйграешь в кости и будет тебе по 25. А?", name:"Дядя Гуго"},
        {txt:"Неймется уже нашему герою - жуть как хочется поиграть в кости… но держится стойко!", name:"Рассказчик"},
        {txt:"Не могу, Дядь Гуго. Батюшке пообещал ответственно выполнить задание. 23 монеты, а?", name:"Герой (главный)"},
        {txt:"Эх-х-х, только за совесть твою чистую. Давай.", name:"Дядя Гуго"},
        {txt:"Вот так наш ответственный герой и продал пшеницу. Теперь ему оставалось только довести вырученные деньги в целости и сохранности домой…", name:"Рассказчик"},]
        currentScene = 5
        dialog()
    } else if (scene ==5){
        ctx.drawImage(grad,0,0)
        CurrentDialog = [{txt:"Ох, какой я молодец. И пшеницу свозил, и дорого продал, и деньги обратно везу… Давно не было так хорошо! Хотя, не накаркать бы… А то опять грабителей каких встречу.", name:"Герой (главный)"},
        {txt:"Очень рад был наш герой, что ответственно выполнил важное поручение. Представлял себе уже, как мамка с батей его хвалят. Как они на эти деньги мяса купят впервые за полгода. Как он потом, на свою долю, будет в кости играть… И как отыграет денег ещё больше, чем выручил за пшеницу…", name:"Рассказчик"},
        {txt:"А хотя, чего ждать-то? Я ведь молодец! Вот как раз и награжу себя, хмельного чего выпью, и в кости поиграю. Но на свою долю! Остальные деньги - домой.", name:"Герой (главный)"},
        {txt:"Вот такие благие мысли и занесли молодца в таверну “Кость в горле”. Поставив лошадь в стойло и запрятав телегу за таверной, направился герой твёрдой, уверенной походкой ко входу…", name:"Рассказчик"},
        {txt:"И, не церемонясь, с размаху распахнул дверь, чуть не прибив какого-то нищего, и прогарланил на всю таверну…", name:"Рассказчик"},]
        currentScene = 6
        dialog()
    } else if (scene ==6){
        ctx.drawImage(tavern,0,0)
        CurrentDialog = [{txt:"Ну, люди, кто в деньгах не стеснён, айда к моему столу! Будем в кости играть!", name:"Герой (главный)"},
        {txt:"Навёл смуты. С недоверием отнеслись посетители таверны, к столь уверенному в себе гостю. Начали они переглядываться да думать то ли обхитрить он их хочет, то ли азартных дел мастер, то ли словцо красное любит.", name:"Рассказчик"},
        {txt:"Однако парня всякие перешёптывания и пристальные взгляды от посетителей нисколечко не смутили, и тот смело направился к напримеченному столику.", name:"Рассказчик"},
        {txt:"Стоило ему сесть на крепенький табурет, как к столику подошёл тот самый нищий, которого наш герой чуть дверью не зашиб.", name:"Рассказчик"},
        {txt:"По виду и не скажешь, что хоть одна монетка в кармане твоём найдётся.", name:"Герой (главный)"},
        {txt:"На кости то всегда монетка найдётся, уважаемый. Дай только найду…", name:"Нищий"},
        {txt:"Пока нищий пытался найти монетку в своих лохмотьях, к столу уже успела подсесть рыжая бестия, с озорным блеском в глазах. Какой азарт, какие формы! Огонь-баба!", name:"Рассказчик"},
        {txt:"Ну что же, парнишка. Давай-ка поиграем…", name:"Рыжая Бестия"},
        {txt:"Чем ниже взгляд, тем жарче становилось.", name:"Рассказчик"},
        {txt:"Обнажённые плечики. Кожа гладкая и белоснежная, словно сошла с полотен великих мастеров. Пышная грудь, которой так тесно в этой… кхм, одежде. Она словно желала вырваться на свободу. И всё на таком преступно широком вырезе. Вот же чертовка! Стоит ли мне говорить насколько это грязный приём? У такого молодого парня не было ни шанса отвертеться.", name:"Рассказчик"},
        {txt:"Ох, девушка…", name:"Герой (главный)"},
        {txt:"Недобро поглядывал на эту девку лишь нищий. Однако решил, будь что будет и оставил их наедине. Мошенница, сразу видно. Заметил бы это ещё и наш герой, а не только её грудь... Пропал дурак!", name:"Рассказчик"},
        {txt:"Я, конечно, парень видный, воспитанный, но уж извините если вам сегодня придётся уйти без своих… кхм-кхм, денег.", name:"Герой (главный)"},
        {txt:"Думаю что если ты мне, м-м-м, понравишься… сумеешь впечатлить меня, то может я никуда и не уйду этим вечером…", name:"Рыжая Бестия"},
        {txt:"Вечер и вправду оказался незабываемым… для неё. Знала шельма своё дело! Раззадорить в ком-то азарт - было для неё плёвым делом.", name:"Рассказчик"},
        {txt:"Выйграла нашего героя пару раз, поддалась немного, да большего было и не нужно - потерял тот голову и хотел лишь отыграться. И пошли хмельные напитки один за другим. Пиво, ром, эль, медовуха… Что только не смешалось в ту ночь. Перешла ей вся доля парня, с проданной пшеницы. А затем и все остальные деньги… и телега… и лошадь. Ох и жалко же дурака! Утром проснётся жуть что будет…", name:"Рассказчик"},]
        currentScene = 7
        dialog()
    }else if (scene == 7){
        ctx.drawImage(dream,0,0)
        CurrentDialog = [{txt:"Наступило утро. Столь радостную весть в десятый раз прокукарекали петухи и вскочил с постели наш герой, бодрый как огурчик. О похмелье даже слыхивать не слыхивал.", name:"Рассказчик"},
        {txt:"Ох, маменька, папенька… Ждите меня, с деньгами!", name:"Герой (главный)"},
        {txt:"Собрав свои пожитки, радостный герой мигом вылетел с таверны… и опешил.", name:"Рассказчик"},
        {txt:"Да ну, не верю. Я сплю?", name:"Герой (главный)"},
        {txt:"Прямо на выходе из таверны мирно ел траву шоколадный заяц. Вот прямо заяц из шоколада. Не вру!", name:"Рассказчик"},
        {txt:"Вот как поймаю…", name:"Герой (главный)"},
        {txt:"Ишь, размечтался!", name:"Рассказчик"},
        {txt:"Знатная зверюга! Шоколадный мех! Шоколадное мясо! Шоколадных шкварок нажарю...", name:"Герой (главный)"},
        {txt:"Хотя не, лучше снесу-ка его на рынок. Там-то дураков много, а зайцев, по-ди,  мало…", name:"Герой (главный)"},
        {txt:"Схватил зайца. Прибегает на рынок, сбивая по пути сонных прохожих, да давай во всю широку душу…", name:"Рассказчик"},
        {txt:"А вот зайца шоколадного кому?! Кому заяц?!! Свежепойманный!!!", name:"Герой (главный)"},
        {txt:"Люди лишь перешёптывались да смеялись над парнишкой. Видать, не оценили сей необычный товар!", name:"Рассказчик"},
        {txt:"Тьфу ты, чёрт с вами! Пойду и продам его не на каком-то рынке… а в замке! Дворянам!", name:"Герой (главный)"},
        {txt:"Всё так же с зайцем за пазухой помчался наш герой к замковым воротам, прямо ко двору Короля, и всё мечтал…", name:"Рассказчик"},
        {txt:"Ежели я весь из себя такой купец, то на что мне эти недотёпы? Продать шоколадного зайца на королевском дворе… Будут ещё локти кусать на этом рынке, при виде меня! Ответственный и умный сын у таких ответственных и умных маменьки с папенькой! Ох гордится будут…", name:"Герой (главный)"},
        {txt:"Завидела только стража парня с шоколадным зайцем за пазухой, тут же все двери перед ним раскрылись.", name:"Рассказчик"},
        {txt:"И прибегает наш герой не то что ко двору, а прямо в святая святых - богато отделанные залы королевского замка.", name:"Рассказчик"},
        {txt:"Надёжна! Добротно! Хорошо!", name:"Герой (главный)"},
        {txt:"Берёт с золотого подноса золотое яблоко…", name:"Рассказчик"},
        {txt:"Ох вкуснющее!", name:"Герой (главный)"},
        {txt:"Вдруг заходит в залы королевский лакей и генерал вместе с дядей Гюго, неся здоровые пшеничные мешки. Ставят их перед парнишей и видит он там чистое золото. Тот же яблоко откидывает и давай оценивать.", name:"Рассказчик"},
        {txt:"Хошь как хошь, а маловато! Маловато будет!", name:"Герой (главный)"},
        {txt:"Ну, делать нечего. Пожали Генерал с дядюшкой Гюго плечами, посмотрели друг на друга, да ка-а-ак свистнули.", name:"Рассказчик"},
        {txt:"Тут же отворяются ещё одни двери в зал, и входит Король с вечерней обольстительницей.", name:"Рассказчик"}, 
        {txt:"Подходят к нашему герою, кланяются в ноги, да протягивает Король ему свою корону, а обольстительница сама в объятья падает.", name:"Рассказчик"},
        {txt:"О, вот это мой размерчик.", name:"Герой (главный)"},
        {txt:"Натягивая на голову корону да жамкая что под руку попало, важно проговорил наш герой.", name:"Рассказчик"},
        {txt:"Но, я парень воспитанный, ответственный, честь имею! Не приму всё это, пока не выйграю по старой доброй костянской традиции!", name:"Герой (главный)"},
        {txt:"И вырос из пола золотой стол да золотые стулья. Уселись король с нашим героем в кости играть, а Лакей их судить.", name:"Рассказчик"},
        {txt:"Ох игра то была! Собрался весь костянск смотреть на игру Короля и нашего героя! Какие споры, какие ставки! Галдёж, наверно, на всё королевство был слышен…", name:"Рассказчик"},
        {txt:"Легко!", name:"Герой (главный)"},
        {txt:"Но даже правитель Костянска - сам Костик III, не смог победить нашего мудрого и ответственного героя, в игре в кости.", name:"Рассказчик"},
        {txt:"Как полагается победителю, по старой доброй костянской традиции, царство и жену впридачу!", name:"Рассказчик"},
        {txt:"И прямо перед всеми появляется прелестная Королева. Посмотрел наш герой на рыжую бестию…", name:"Рассказчик"},
        {txt:"Маловато…", name:"Герой (главный)"},
        {txt:"Вприпрыжку побежал к Королове, да-а-а…", name:"Рассказчик"},]
        
        currentScene = 8
        dialog()
    }else if(scene ==8){
        ctx.drawImage(tavern,0,0)
        coins = 0
        CurrentDialog = [{txt:"…ка-а-ак клюнул носом вонючий пропитый стол.", name:"Рассказчик"},
        {txt:"Ох, ты-ж…", name:"Главный герой (теперь точно)"},
        {txt:"Жуткое похмелье, боль в носу, затёкшая спина ещё и жажда лютая. Доброе утро…", name:"Рассказчик"},
        {txt:"Собрался чуть с мыслями наш герой, героически дополз до стойки, выпросил ковш воды и давай мысли ловить, вспоминать что было.", name:"Рассказчик"},
        {txt:"Неужто сон? Ох я бы сейчас с той Королевой… Хотя да, далеко мне до неё. Но хотя бы с той рыжей, горячей…", name:"Главный герой"},
        {txt:"И вспомнил он разом как проиграл все деньги, телегу и лошадь обольстительнице.", name:"Рассказчик"},
        {txt:"Ох ну как я так то, а? Ой зло эти бабы… Ой дурак… И как я теперь бате то в глаза посмотрю? А маме? Ох, чёрт, чёрт, чёрт…", name:"Главный герой"},
        {txt:"Чё звал?", name:"Чертилла"},
        {txt:"Только было начал парень жаловаться на свою горькую судьбу, как напротив него, за столом оказался чёрт.", name:"Рассказчик"},
        {txt:"Что? Ты кто?", name:"Главный герой"},
        {txt:"Бегемот.", name:"Бегемот"},
        {txt:"Где!?", name:"Тупой герой"},
        {txt:"Не поверил своим глазами наш герой и давай испуганно озираться.", name:"Наш Рассказчик"},
        {txt:"Я тебе щас! Откуда ты вообще знаешь кто это, деревенщина необразованная?", name:"Черт"},
        {txt:"Я когда ребятёнком был, мне мама читала чудную книжку, по наследству доставшуюся, про дальние страны. Так там было такое жуткое животное - бе-ге-мот. Во век не забуду. Зубищи, как мама читала, с локоть размером. Здоровый - как телега… да не, даже как две. И при этом бегает чуть помедленнее лошади. Ух-х-х, страшилище наверное...", name:"деревенщина образованная"},
        {txt:"Сам ты страшилище. Бегемот не чудище, а гордое животное. Поэтому его и назвали в честь меня!", name:"Черт (Бегемот)"},
        {txt:"Да какой ты бегемот… так, чёрт обыкновенный…", name:"Обыкновенный герой"},
        {txt:"И ловко увернулся от оплеухи, правда встретил затылком другой столик и распластался на полу. Тем не менее, это не помешало нашему герою продолжить свой рассказ.", name:"Рассказчик"},
        {txt:"А ещё я помню, всё из той же книжки, рассказ про араба, который обхитрил султана и забрал у него полцарства…", name:"Главный герой"},
        {txt:"Всё, пошли пьяные истории…", name:"Черт"},
        {txt:"Так это к чему. Точно знаю, что как только опохмелюсь, то по старой доброй костянской традиции, верну себе и телегу, и лошадь, и деньги. А потом, чего уж там, и у Короля полцарства отыграю, как тот ар…", name:"Главный герой"},
        {txt:"А-ХА-ХА-ХА!!! ТЫ!? А-ХА-ХА-ХА-ХА-ХА!!! ДЕРЕВЕНЩИНА, ДА ПО КОСТЯНСКОЙ ТРАДИЦИИ И ПОЛЦАРСТВА!? ДА НЕ-ВЕ-РЮ!!!", name:"Черт"},
        {txt:"Вся таверна тут же обернулась в сторону нашего героя, но хитрый чёрт успел исчезнуть. Спустя пару секунд, все потеряли к незадачливому игроку и пьянице весь интерес. В этот же момент чёрт снова сел за столик.", name:"Рассказчик"},
        {txt:"А вот спорим, на мою неиссякаемую кружку пива, что ты не сможешь по костянской традиции, получить полцарства?", name:"Черт"},
        {txt:"Как неиссякаемую?", name:"Главный герой"},
        {txt:"А вот так!", name:"Черт"},
        {txt:"Буквально из ниоткуда, у черта в руке образовалась кружка с пивом. Тот её перевернул и полилось оно водопадом прямо на пол…", name:"Рассказчик"},
        {txt:"Да куда!? Стой, дурак!!!", name:"Главный герой"},
        {txt:"Попытался было наш герой потянуться к этому Иуде...", name:"Рассказчик"},
        {txt:"Вот выйграешь в споре, тогда и будешь делать с этой кружкой и её пивом - что хочешь.", name:"Черт"},
        {txt:"И исчезла кружечка.", name:"Рассказчик"},
        {txt:"Ну что, спорим?", name:"Черт"},
        {txt:"Спорим!", name:"Главный герой"},
        {txt:"И скрепил с чертом спор крепким мужским рукопожатием.", name:"Рассказчик"},
        {txt:"Вот именно так и оказался наш герой в таверне “Кость в горле” без денег, с ноющим затылком, на вонючем полу, но с твёрдым желанием измениться и выйграть спор у черта.", name:"Рассказчик"},]
        
        currentScene = 9
        dialog()
    } else if (scene==9){
        ctx.drawImage(tavern,0,0)
        ctx.drawImage(dadNPC,200,165)
        function click(x,y){
            if (collision(x,y,100,85,130,200)){
                Label()
            }
            if (collision(x,y,800,140,400,300)){
                ShopOpen(0)
            }
            if (collision(x,y,240,165,300,400)){
                
                if (coins>=1&&coins<=10){
                    CurrentDialog = 	[{txt:"Окинул взглядом, наш герой, полупустую таверну, заприметил столик с одиноким мужичком, и решает подсесть к нему, поспрашивать, будет ли тот играть с ним.", name:"Рассказчик"},
                    {txt:"Доброго денёчка!.", name:"Герой (главный)"},
                    {txt:"*хр-р-р* А, а? ", name:"Пьяный мужчина"},
                    {txt:"Мужичок встрепенулся", name:"Рассказчик"},
                    {txt:"*ИК* Я й*ИК*що буду.", name:"Пьяный мужчина"},
                    {txt:"После чего разговор мужичку резко наскучил и он громко захрапел", name:"Рассказчик"},
                    {txt:"Точно. Вот ты то и будешь моим первым соперником.", name:"Герой (главный)"},
                    {txt:"Вдруг сзади к нашему герою подходит Пит", name:"Рассказчик"},
                    {txt:"Ты его то не буди особо. Это Пьяный Джо, завсегдатай наш. Больно не любит когда ему мешают, но вообще доброй души человек. Ты главное лишний раз при нём не упоминай про кости, а не то…", name:"Рассказчик"},
                    {txt:"А, а? Я *ИК* буду играть! Тащи сюда! ", name:"Пьяный Джо"},
                    {txt:"Вот так вот наш герой и нашёл своего первого, равного ему, оппонента.", name:"Рассказчик"},]
                    
                    DiceGame(2)
                }else if(coins<1){
                    coins += 1
                    updateInv()
                    CurrentDialog=[
                        {txt:"Привет, я Джо",name:"Джо"},
                        {txt:"Вижу тебя совсем жизнь потрепала, держи монетку",name:"Джо"},]
                    dialog()
                }else{
                    CurrentDialog=[
                        {txt:"Привет, вижу ты обогатился",name:"Джо"},
                        {txt:"Удачного дня",name:"Джо"},]
                    dialog()
                }
            }
            console.log("T x:"+x+" y:"+y)
        }
        // ShopOpen(0)
    }else if (scene ==10){
        //после игры с джо
        ctx.drawImage(tavern,0,0)
        ctx.drawImage(dadNPC,200,165)
        ctx.drawImage(generalNPC,500,300)
        function click(x,y){
            if (collision(x,y,100,85,130,200)){
                Label()
            }
            if (collision(x,y,800,140,400,300)){
                ShopOpen(0)
            }
            if (collision(x,y,240,165,300,230)){
                
                if (coins>=1&&coins<=10){
                    CurrentDialog = 	[{txt:"Наш герой подходит к Пьяному Джо, чтобы поговорить, но тот лишь громко храпит. Видимо, чтобы разбудить его, придётся доставать кости.", name:"Рассказчик"},]
                    
                    DiceGame(2)
                }else if(coins<1){
                    coins += 1
                    updateInv()
                    CurrentDialog=[
                        {txt:"Привет, я Джо",name:"Джо"},
                        {txt:"Вижу тебя совсем жизнь потрепала, держи монетку",name:"Джо"},]
                    dialog()
                }else{
                    CurrentDialog=[
                        {txt:"Привет, вижу ты обогатился",name:"Джо"},
                        {txt:"Удачного дня, с богатыми не играю",name:"Джо"},]
                    dialog()
                }
            }
            if (collision(x,y,550,300,400,340)){
                CurrentDialog = [{txt:"Не мог наш герой не заметить этого дружелюбного богатыря.", name:"Рассказчик"},
                {txt:"Эй, народ честной! Праздник на носу! Тащи хмельное, доставай кости! Будем отмечать!", name:"Богатырь"},
                {txt:"Так не наступил же ещё. Рано ты!", name:"Голос из зала"},
                {txt:"Так готовиться будем!", name:"Богатырь"},
                {txt:"Начал подтягиваться народ к столу его, да герой наш был самым первым.", name:"Рассказчик"},
                {txt:"Здравствуйте.", name:"Герой (главный)"},
                {txt:"И тебе не хворать. Ну-ка, давай, присаживайся… Пиво то где? Несурьёзно это.", name:"Богатырь"},
                {txt:"Так я узнать у вас хотел. Всё вот Фила ищу, хочу с ним силами померяться, по старой доброй костянской традиции.", name:"Герой (главный)"},
                {txt:"Богатырь взорвался смехом", name:"Рассказчик"},
                {txt:"Ха-ха, так это же я! Ну, коль есть на что играть и настроен будешь серьёзней, то давай. Испытаем тебя. Сейчас только с одним другом сыграю...", name:"Фил"},]
                
                DiceGame(3)
            }
            console.log("T x:"+x+" y:"+y)
        }
    }else if (scene==11){
        
    }
    //? Записываем клик в обработчик события
    MainCanvas.onclick = function(e) { // обрабатываем клики мышью
        if (isDialog){
            if (NovelTimer>0){
                return
            }
            currentTextPart+=1
            dialog()
            return
        }
        var x = (e.pageX - MainCanvas.offsetLeft) | 0;
        var y = (e.pageY - MainCanvas.offsetTop)  | 0;
        console.log([x, y]); // выхов функции действия
        click(x,y)
    };
    InvCanvas.onclick = function(e) { // обрабатываем клики мышью
        var x = (e.pageX - InvCanvas.offsetLeft) | 0;
        var y = (e.pageY - InvCanvas.offsetTop)  | 0;
        console.log([x, y]); // выхов функции действия
        InvClick(x,y)
    };
}

//? Вспомогательные тех функции для диалогов
function closeDialog(){    
    isDialog = false
    Block.innerHTML = ""
    currentTextPart=0
    drawScene(currentScene)
}
function openDialog(){
    ctx.font = "25px serif";
    isDialog = true
    currentTextPart=0
    NovelTimer=0
    sayDialog("")//для пустой рамки
    
}
function sayDialog(text,name){
    //рамка
    ctx.fillStyle = "rgb(255,255,255)"
    ctx.fillRect(80,500,width-160,200)
    ctx.fillStyle = "rgb(0,0,0)"
    ctx.strokeRect(80, 500, width-160, 200)
    //текст
    Block = document.getElementById("dialogText")
    Block.innerHTML = text
    //имя
    ctx.font = "30px serif";
    ctx.fillText(name, 83, 530,width-162);
}
//? Функция запуска диалога, необходимо предварительное редактирование CurrentDialog
function dialog(){
    if (!isDialog)
        openDialog()
    if (currentTextPart>=CurrentDialog.length)
        closeDialog()
    if (isDialog)
        novellPrint(CurrentDialog[currentTextPart])

}

//? Обновляет инвентарь на наличие новых предметов
function updateInv(){
    inv.fillStyle = "rgb(25,25,55)"
    inv.fillRect(0,0,invWidth,invHeight)
    inv.fillStyle = "rgb(255,205,55)"
    inv.font = "20px serif";
    inv.fillText(coins,5,25,invWidth-12)
    inv.fillStyle = "rgb(245,245,235)"
    inv.fillRect(0,40,invWidth,invHeight-40)
    for (i in inventory){
        inv.fillStyle = "rgb(235,235,225)"
        inv.fillRect(0,i*30+i*2+45,invWidth,30)
        inv.fillStyle = "rgb(45,45,35)"
        console.log(inventory[i])
        inv.fillText(inventory[i],5,i*30+i*2+65,invWidth-12)
    }
}
updateInv()
//? Добавляет предмет в инвентарь
function add(item){
    inventory.push(item)
    updateInv()
}
//? Удаляет предмет из инвентаря в еденичном экземпляре
function delItem(item){
    for (i in inventory){
        if (inventory[i] == item){
            inventory.splice(i, 1);
            updateInv()
            return
        }
    }
}
//? Возвращает true если предмет есть в инвентаре
function have(item){
    updateInv()
    for (i in inventory){
        if (inventory[i] == item){
            return true
        }
    }
    return false
}

//? Миниигра про пшеницу
function wheatMiniGame(){
    //*-------------------------------
    let grid_rows = 9
    let grid_columns = 16
    let pole = [[]]
    let row = [[]]
    let bold = 2
    function FirstDrawGrid(){
        for (i=0;i<=grid_columns;i+=1){
            ctx.fillRect(width/grid_columns*i,0,bold,height)
            row[i]=0
        }
        for (i=0;i<=grid_rows;i+=1){
            ctx.fillRect(0,height/grid_rows*i,width+bold,bold)
            pole[i]=[]
            for (j in row){
                pole[i][j]=row[j]
            }
        }
    }
    function drawGrid(){
        for (i=0;i<=grid_columns;i+=1){
            ctx.fillRect(width/grid_columns*i,0,bold,height)
        }
        for (i=0;i<=grid_rows;i+=1){
            ctx.fillRect(0,height/grid_rows*i,width+bold,bold)
        }
    }

    function drawGridRect(x1,y1,x2,y2,text){
        for (i=x1;i<x2;i++){
            for(j=y1;j<y2;j++){
                pole[i][j]=text
            }
        }
    }
    FirstDrawGrid()
    drawGridRect(0,0,6,6,1)
    pole[1][1]=2
    function Wheatclick(x,y){// функция производит необходимые действие при клике(касанию)
        // console.log(pole)
        if (y>grid_rows||x>grid_columns){
            return
        }
        if (pole[y][x]==0){
            coins+=1
            updateInv()
        }
        console.log("клик на "+x+":"+y)
        player=find(2)
        pole[player.row][player.col]=getRandomInt(2)+1
        player=find(2)
        pole[player.row][player.col]=getRandomInt(2)+1
        pole[y][x]=2
        draw()
        // drawGrid()
    }
    MainCanvas.onclick = function(e) { // обрабатываем клики мышью
        var x = (e.pageX - MainCanvas.offsetLeft) / (width/grid_columns) | 0;//находит КЛЕТКУ!
        var y = (e.pageY - MainCanvas.offsetTop)  / (height/grid_rows) | 0;
        Wheatclick(x, y); // выхов функции действия
    };

    function find(text){
        for (i in pole){
            for (j in pole[i]){
                if (pole[i][j] == text){
                    return {row:i,col:j}
                }
            }
        }
        return{row:0,col:0}
    }

    function draw(){
        i=0
        j=0
        while (j<grid_rows){
            while (i<grid_columns){
                let img = new Image();
                if (pole[j][i]==0){
                    ctx.drawImage(dirtImg,i*(width/grid_columns),j*(height/grid_rows))
                }else if (pole[j][i]==1){
                    ctx.drawImage(field1Img,i*(width/grid_columns),j*(height/grid_rows))
                }else if (pole[j][i]==2){
                    ctx.drawImage(field2Img,i*(width/grid_columns),j*(height/grid_rows))
                }
                //ctx.fillRect(i*(width/grid_columns)+bold,j*(height/grid_rows)+bold,width/grid_columns,height/grid_rows)
                
                i+=1
            }
            i=0
            j+=1
        }
    }
    
    draw()
    alert("Собери как можно больше пшеницы на время!")
    setTimeout(()=>{
        alert("Все!")
        drawScene(3)
        currentScene = 3
        return
    },10000)
    //* ------------------------------------
}

//? Подгружает картинки перед игрой в пшеницу
let dirtImg = new Image();
let field1Img = new Image();
let field2Img = new Image();
dirtImg.src = 'img/wheat/field 1.3.png';
ctx.drawImage(dirtImg,height-5,width-3)
field1Img.src = 'img/wheat/field 1.png';
ctx.drawImage(field1Img,height-5,width-2)
field2Img.src = 'img/wheat/field 2.png';
ctx.drawImage(field2Img,height-5,width-1)

coins=1
updateInv()
currentScene = 10
drawScene(10)
add("Медовуха")
add("Ром")
add("Эль")
// PlayerDiceCell=2
// DiceGame(2)
