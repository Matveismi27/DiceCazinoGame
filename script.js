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
currentScene = 1
PlayerDiceCell=1
NovelTimer=0
isDialog = false
ctx.font = "20px serif";
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
function collision(x,y,xo,yo,width,height){
    if (x>xo && x<xo+width && y>yo && y<yo+height){
        return true
    }else{
        return false
    }
}

function novellPrint(txt){
    if(NovelTimer>txt.length){
        NovelTimer=0;
        return
    }
    sayDialog(txt.slice(0, NovelTimer))
    NovelTimer++
    setTimeout(novellPrint,4,txt)
}

function DiceGame(game){
    //* ------------- Dice Game -------------
    round = 0
    playerScore = []
    enemyScore = []
    Animation = false
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
    }
    
    function InGameNovellPrint(txt){
        if(NovelTimer>txt.length){
            console.log("@:end")
            console.log(txt.length+"/"+NovelTimer)
            NovelTimer=0;
            return
        }
        console.log("@:"+txt)
        sayDialog(txt.slice(0, NovelTimer))
        NovelTimer+=1
        setTimeout(InGameNovellPrint,5,txt)
    }
    function InGameDialog(){
        if (!isDialog)
            openDialog()
        if (currentTextPart>=CurrentDialog.length){
            isDialog = false
            currentTextPart=0
            drawDiceGame()
        }
        if (isDialog){
            console.log(currentTextPart)
            console.log(NovelTimer)
            NovelTimer=0
            console.log(NovelTimer)
            
            InGameNovellPrint(CurrentDialog[currentTextPart])
        }
    }
    
    if (game==1){
        drawDiceGame()
        enemyDiceCell = 1
        CanDrink=0
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
                    round=4
                    delItem("Эль")
                }
            }
        }
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
                console.log(";"+playerScore[i])
            }
            //значение на кубике
            enemyScore = []
            for (i=0;i<enemyDiceCell;i++){
                enemyScore[i]=getRandomInt(5)+1
                console.log(":"+enemyScore[i])
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
        function click(x,y){
            if (collision(x,y,235,210,810,300)){
                //трогаем стол

                if (round==0){
                    CurrentDialog = ["Сына, хочу научить тебя играть","Просто стукни по столу"]
                    InGameDialog()
                }else if(round==1){
                    rollDice()
                }else if(round==2){
                    CurrentDialog = ["Отлично, мы бросили кости","А теперь напои меня"]
                    InGameDialog()
                    CanDrink=1
                }else if(round==3){
                    CurrentDialog = ["Что ты так смотришь?","Просто кликни на Эль в инвентаре"]
                    InGameDialog()
                    round-=1
                }else if(round==4){
                    CanDrink=0
                    sum=0
                    for (i in playerScore){
                        sum += playerScore[i]
                    }
                    for (i in enemyScore){
                        sum -= enemyScore[i]
                    }
                    if (sum>0)
                        CurrentDialog = ["Охх... хорошо","кто там побеждает?","Да и пофиг... играем все равно на интерес..."]
                    else
                        CurrentDialog = ["Охх... хорошо","Смотрим кубики","О, ничья, забавно..."]
                    InGameDialog()
                }else if(round==5){
                    drawScene(currentScene)
                }
                round+=1
                
            }
        }  
    }
     
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
        InvClick(x,y)
    };
    //* /Dice Game/ * ------------------------------------------------
}
function drawScene(scene){
    let fon = new Image(width,height)
    if (scene == 1){
        fon.src = "img/l1.png"
        
        function click(x,y){
            if (collision(x,y,900,200,300,300)){
                if (have("Пивас")){
                    CurrentDialog = ["О пивас!","Я дверь открыл, держи серп, наруби больше пшеницы!"]
                    if (!have("Серп"))
                        add("Серп")
                    delItem("Пивас")
                    dialog()
                }else{
                    CurrentDialog = ["Привет сын","готов пахать поле?"]
                    dialog()
                }
                
            }
            if (collision(x,y,90,200,250,400)){
                CurrentDialog = ["Сыночек, держи Пивас","отдай его бате чтобы он тебе серп отдал"]
                dialog()
                if (!have("Пивас"))
                    add("Пивас")
            }
        
            if (collision(x,y,400,100,250,400)){
                if (!have("Серп")){
                    CurrentDialog = ["Дверь закрыта"]
                    dialog()
                    return
                }
                CurrentDialog = ["Отлично, дверь открыта"]
                wheatMiniGame()
            }
        }
        
    }   
    //* ----------------------------------------------------------------
    if (scene == 2){
        fon.src = "img/l1.png"
        
        function click(x,y){
            if (collision(x,y,900,200,300,300)){
                if (have("Эль")){
                    DiceGame(1)
                }else{
                    CurrentDialog = ["Привет сын","Неси сюда Эль, покажу приколюху"]
                    dialog()
                }
                
            }
            if (collision(x,y,90,200,250,400)){
                CurrentDialog = ["Сыночек, держи Эль","отдай его бате чтобы он с тобой сыграл"]
                dialog()
                if (!have("Эль"))
                    add("Эль")
            }
        }        
    }
    MainCanvas.onclick = function(e) { // обрабатываем клики мышью
        if (isDialog){
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
    ctx.drawImage(fon,0,0)
}

function closeDialog(){    ctx.font = "25px serif";
    isDialog = false
    currentTextPart=0
    drawScene(currentScene)
}
function openDialog(){
    isDialog = true
    currentTextPart=0
    NovelTimer=0
    sayDialog("")//для пустой рамки
    
}
function sayDialog(text){
    //рамка
    ctx.fillStyle = "rgb(255,255,255)"
    ctx.fillRect(80,500,width-160,200)
    ctx.fillStyle = "rgb(0,0,0)"
    ctx.strokeRect(80, 500, width-160, 200)
    //текст
    ctx.font = "25px serif";
    ctx.fillText(text, 82, 532,width-162);
}
function dialog(){
    if (!isDialog)
        openDialog()
    if (currentTextPart>=CurrentDialog.length)
        closeDialog()
    if (isDialog)
        novellPrint(CurrentDialog[currentTextPart])

}

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
function add(item){
    inventory.push(item)
    updateInv()
}
function delItem(item){
    for (i in inventory){
        if (inventory[i] == item){
            inventory.splice(i, 1);
            updateInv()
            return
        }
    }
}
function have(item){
    updateInv()
    for (i in inventory){
        if (inventory[i] == item){
            return true
        }
    }
    return false
}

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
        currentScene = 2
        return
    },10000)
    //* ------------------------------------
}
let img = new Image();
img.src = 'img/wheat/field 2.3.png';
ctx.drawImage(img,height-5,width-3)
img.src = 'img/wheat/field 1.1.png';
ctx.drawImage(img,height-5,width-2)
img.src = 'img/wheat/field 1.2.png';
ctx.drawImage(img,height-5,width-1)

drawScene(1)
add("Эль")
DiceGame(1)
