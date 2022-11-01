const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")


// define canvas width / height 
canvas.width = window.innerWidth ;
canvas.height = window.innerHeight ;



// DEFINE PLAYER DINAMICS


// define gravity const
const gravity = 1.5


// create Player class
class Player {
    constructor (){
        this.position = {
            x: 100,
            y: 100,
        }

        // function of movement
        this.velocity = {
            x: 0,
            y: 1,
        }

        this.width = 30
        this.height = 30
    }

    draw() {
        c.fillStyle = "red"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        // define bottom Max
        if(this.position.y + this.height + this.velocity.y <= canvas.height){
            this.velocity.y += gravity}
        else {
            this.velocity.y = 0   
        }
    }
}


// create new player
const player = new Player()
player.update()


// constant movement +20 px, not velcicty ++20px
const keys = {
    right: {
        pressed: false
    },
    left : {
        pressed: false
    }
}


// define animate
function animate(){
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()

    if (keys.right.pressed){
        player.velocity.x = 5
    } else if (keys.left.pressed){
        player.velocity.x = -5
    } else {player.velocity.x = 0}
}


// invoke animate
animate()


// Event listener keydown
window.addEventListener("keydown", ({ keyCode }) => {
    switch(keyCode){
        case 65:
            console.log("left")
            keys.left.pressed = true
            break;
        case 87:
            console.log("up")
            // define jump -> position -20 + 1.5 di gravity ... position + 0 ... position - gravity till velocity = 0
            player.velocity.y -= 20;
            break;
        case 68:
            console.log("right")
            keys.right.pressed = true
            break;
        case 83:
            console.log("down")
            break;
    }
})

// event listener keyup
window.addEventListener("keyup", ({ keyCode }) => {
    switch(keyCode){
        case 65:
            console.log("left")
            keys.left.pressed = false
            break;
        case 87:
            console.log("up")
            break;
        case 68:
            console.log("right")
            keys.right.pressed = false
            break;
        case 83:
            console.log("down")
            break;
    }
})


// DEFINE SCENARIO DINAMICS 

class Platform {
    constructor (){
        this.position = {
            x: 0,
            y: 0,
        }

        this.width = 200
        this.height = 20
    }

    draw()
    // 36.50
}