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
isDialog = false
Animation = false
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
    if(i>txt.length){
        i=0;
        return
    }
    sayDialog(txt.slice(0, i))
    i++
    setTimeout(novellPrint,4,txt)
}

function DiceGame(game){
    function drawDiceGame(){
        // fon
        ctx.fillStyle="rgb(254,250,230)"
        ctx.fillRect(0,0,width,height)
        

        // dice cells
        DiceCellSize = 100
        DiceSellmargin = 10
        DiceSell1X = 20
        DiceSell1Y = 600
        DiceSell2X = 1165
        DiceSell2Y = 25
        ctx.fillStyle="rgb(250,240,220)"
        ctx.fillRect(DiceSell1X-DiceSellmargin,DiceSell1Y-DiceSellmargin,(DiceSellmargin+DiceCellSize)*5+DiceSellmargin,DiceCellSize+DiceSellmargin*2)
        ctx.fillRect(DiceSell2X-(DiceSellmargin+DiceCellSize)*4-DiceSellmargin,DiceSell2Y-DiceSellmargin,(DiceSellmargin+DiceCellSize)*5+DiceSellmargin,DiceCellSize+DiceSellmargin*2)

        ctx.fillStyle="rgb(220,200,200)"
        for (i=0;i<5;i++){
            ctx.fillRect(DiceSell1X + DiceSellmargin*i + DiceCellSize*i,DiceSell1Y,DiceCellSize,DiceCellSize)

            ctx.fillRect(DiceSell2X + DiceSellmargin*-i + DiceCellSize*-i,DiceSell2Y,DiceCellSize,DiceCellSize)
        }

        //иконки
        ctx.fillStyle="rgb(100,170,170)"
        ctx.fillRect(10,10,200,200)
        ctx.fillRect(1070,510,200,200)

        //поле
        ctx.fillStyle="rgb(100,100,100)"
        ctx.fillRect(235,210,810,300)
    }
    
    if (game==1){
        drawDiceGame()
        
        function rollDice(){
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
            console.log("кинул кубик")
            i=0
            //значение на кубике

            while ((DiceDX+DiceDY)>0.7){
                i+=1
                
                DiceX+=DiceDX
                DiceY+=DiceDY
                DiceDX*=0.984
                DiceDY*=0.984
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
    }
    function click(x,y){
        if (collision(x,y,235,210,810,300)){
            rollDice()
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
        var x = (e.pageX - MainCanvas.offsetLeft) | 0;
        var y = (e.pageY - MainCanvas.offsetTop)  | 0;
        console.log([x, y]); // выхов функции действия
        click(x,y)
    };
    //* /Dice Game/ *
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
                    dialog()
                }else{
                    CurrentDialog = ["Привет сын","готов пахать поле?"]
                    dialog()
                }
                
            }
            if (collision(x,y,90,200,250,400)){
                CurrentDialog = ["Сыночек, держи пивас","отдай его бате чтобы он тебе серп отдал"]
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
                if (have("Пивас")){
                    DiceGame(1)
                }else{
                    CurrentDialog = ["Привет сын","Че те надо?"]
                    dialog()
                }
                
            }
            if (collision(x,y,90,200,250,400)){
                CurrentDialog = ["Сыночек, держи пивас","отдай его бате чтобы он с тобой сыграл"]
                dialog()
                if (!have("Пивас"))
                    add("Пивас")
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
        var x = (e.pageX - MainCanvas.offsetLeft) | 0;
        var y = (e.pageY - MainCanvas.offsetTop)  | 0;
        console.log([x, y]); // выхов функции действия
        click(x,y)
    };
    ctx.drawImage(fon,0,0)
}

function closeDialog(){
    isDialog = false
    currentTextPart=0
    drawScene(currentScene)
}
function openDialog(){
    isDialog = true
    currentTextPart=0
    sayDialog("")//для пустой рамки
    
}
function sayDialog(text){
    //рамка
    ctx.fillStyle = "rgb(255,255,255)"
    ctx.fillRect(80,500,width-160,200)
    ctx.fillStyle = "rgb(0,0,0)"
    ctx.strokeRect(80, 500, width-160, 200)
    //текст
    ctx.font = "20px serif";
    ctx.fillText(text, 82, 522,width-162);
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
function have(item){
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
    drawGridRect(1,1,6,6,1)
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
        pole[player.row][player.col]=2
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
    }

    function draw(){
        i=0
        j=0
        while (j<grid_rows){
            while (i<grid_columns){
                let img = new Image();
                if (pole[j][i]==0){
                    ctx.fillStyle = "#997733"
                    img.src = 'img/wheat/field 2.3f.png';
                }else if (pole[j][i]==1){
                    ctx.fillStyle = "#fff"
                    img.src = 'img/wheat/field 1.1.png';//(Math.floor(Math.random() * 3)+1)
                    
                }else if (pole[j][i]==2){
                    img.src = 'img/wheat/field 1.2.png';//(Math.floor(Math.random() * 3)+1)
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
DiceGame(1)
