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
i=0
inventory = []
CurrentDialog = []
isDialog = false
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

function drawScene(src){
    let fon = new Image(width,height)
    fon.src = src
    ctx.drawImage(fon,0,0)
}

function closeDialog(){
    isDialog = false
    currentTextPart=0
    drawScene("img/l1.png")
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
    inv.fillRect(0,0,invWidth,invHeight)
}

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
    let grid_rows = 7
    let grid_columns = 13
    let pole = [[]]
    let row = [[]]
    let bold = 2
    tictac = "x"
    function FirstDrawGrid(){
        for (i=0;i<=grid_columns;i+=1){
            ctx.fillRect(width/grid_columns*i,0              ,bold,height)
            row[i]=0
        }
        for (i=0;i<=grid_rows;i+=1){
            ctx.fillRect(0                   ,height/grid_rows*i,width+bold,bold)
            pole[i]=[]
            for (j in row){
                pole[i][j]=row[j]
            }
        }
    }
    function drawGrid(){
        for (i=0;i<=grid_columns;i+=1){
            ctx.fillRect(width/grid_columns*i,0              ,bold,height)
        }
        for (i=0;i<=grid_rows;i+=1){
            ctx.fillRect(0                   ,height/grid_rows*i,width+bold,bold)
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
    function click(x,y){// функция производит необходимые действие при клике(касанию)
        console.log(pole)
        if (y>grid_rows||x>grid_columns||pole[y][x]==0){
            return
        }
        console.log("клик на "+x+":"+y)
        player=find(2)
        pole[player.row][player.col]=1
        pole[y][x]=2
        draw()
        drawGrid()
    }
    canvas.onclick = function(e) { // обрабатываем клики мышью
        var x = (e.pageX - canvas.offsetLeft) / (width/grid_columns) | 0;//находит КЛЕТКУ!
        var y = (e.pageY - canvas.offsetTop)  / (height/grid_rows) | 0;
        click(x, y); // выхов функции действия
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
                if (pole[j][i]==0){
                    ctx.fillStyle = "#000"
                }else if (pole[j][i]==1){
                    ctx.fillStyle = "#fff"
                }else if (pole[j][i]==2){
                    ctx.fillStyle = "#999"
                }
                ctx.fillRect(i*(width/grid_columns)+bold,j*(height/grid_rows)+bold,width/grid_columns,height/grid_rows)
                i+=1
            }
            i=0
            j+=1
        }
    }
    draw()
    drawGrid()
}
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

