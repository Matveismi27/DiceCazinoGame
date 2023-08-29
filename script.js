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
            drawDiceGame()
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
        }
    }
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
        ctx.fillRect(720,620,300,80)

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
    //? Клик по инвентарю, с обработкой нажатия на различные предметы
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
                ctx.fillRect(DiceCell2X + DiceCellmargin*-lowestI + DiceCellSize*-lowestI,DiceCell2Y,DiceCellSize,DiceCellSize)
                ctx.fillStyle="rgb(200,10,10)"
                ctx.fillText(enemyScore[lowestI],DiceCell2X-(DiceCellSize+DiceCellmargin)*lowestI+25,DiceCell2Y+80)
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
        
        //анимация
        while ((DiceDX+DiceDY)>0.8){
            i+=1
            
            DiceX   += DiceDX
            DiceY   += DiceDY
            DiceDX  *= 0.97
            DiceDY  *= 0.97
            DiceSize = 50
            x[i] = setTimeout((DiceX,DiceY)=>{
                drawDiceGame()
                ctx.fillStyle="rgb(250,250,250)"
                ctx.beginPath();
                ctx.lineTo(DiceX+30*Math.sin(DiceX/30), DiceY-30*Math.cos(DiceX/30));
                ctx.lineTo(DiceX-30*Math.cos(DiceX/30), DiceY-30*Math.sin(DiceX/30));
                ctx.lineTo(DiceX-30*Math.sin(DiceX/30), DiceY+30*Math.cos(DiceX/30));
                ctx.lineTo(DiceX+30*Math.cos(DiceX/30), DiceY+30*Math.sin(DiceX/30));
                ctx.fill();
            },20*i,DiceX,DiceY)   
        }
    }
    //? Рерол по умолчанию
    function enemyReroll(){

    }
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
    //? Различные игровые сценарии для разных NPС
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
        drawDiceGame()
        enemyDiceCell = 2
        CanDrink=1
        round=0
        rerolls=0
        BattleRound=0
        //? Все противники имеют уникальный рерол костей
        function enemyReroll(){
            
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
                    CurrentDialog = [{txt:"Готов сразиться с пьяным Джо?",name:"Пьяный джо"},{txt:"Просто стукни по столу",name:"Пьяный джо"}]
                    InGameDialog()
                    rerolls=0
                }
                if (round == 1){
                    rollDice()
                    //бросок кубов 1
                }
                if (round == 2){
                    rollDice()
                    BattleRound+=1
                    //бросок кубов 2 если оба раунда за гг или за противником то игра завершается
                }
                if (round == 3){
                    rollDice()
                    BattleRound+=1

                    //бросок кубов 3 
                }
                DrawRoundIndicator()
                round+=1
                
            }
        }
    }     
    //? В этом месте обновляются onclick обработчики событий чтобы обновить в них функцию click на новую
    MainCanvas.onclick = function(e) { // обрабатываем клики мышью
        if (isDialog){
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
    let farm = new Image(width,height)
    let house = new Image(width,height)
    farm.src = "img/scene/farm.png"
    house.src = "img/scene/house.png"
    ctx.drawImage(farm,0,0)

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
    if (scene == 2){
        ctx.drawImage(house,0,0)
        function click(x,y){
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
                if (!have("Серп"))
                    add("Серп")
                else
                    wheatMiniGame()
        }    
         
    }
    else if (scene == 3){

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
                    ctx.fillStyle = "#997733"
                    img.src = 'img/wheat/field 1.3.png';
                }else if (pole[j][i]==1){
                    ctx.fillStyle = "#fff"
                    img.src = 'img/wheat/field 1.png';//(Math.floor(Math.random() * 3)+1)
                    
                }else if (pole[j][i]==2){
                    img.src = 'img/wheat/field 2.png';//(Math.floor(Math.random() * 3)+1)
                }
                //ctx.fillRect(i*(width/grid_columns)+bold,j*(height/grid_rows)+bold,width/grid_columns,height/grid_rows)
                ctx.drawImage(img,i*(width/grid_columns),j*(height/grid_rows))
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
        drawScene(2)
        currentScene = 3
        return
    },10000)
    //* ------------------------------------
}

//? Подгружает картинки перед игрой в пшеницу
let img = new Image();
img.src = 'img/wheat/field 2.3.png';
ctx.drawImage(img,height-5,width-3)
img.src = 'img/wheat/field 1.1.png';
ctx.drawImage(img,height-5,width-2)
img.src = 'img/wheat/field 1.2.png';
ctx.drawImage(img,height-5,width-1)

drawScene(1)
// add("Эль")
// PlayerDiceCell=2
// DiceGame(2)
