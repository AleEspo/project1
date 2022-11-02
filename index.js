/* import platform from "./img/platform.pn"
console.log(platform) */

const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

// Implement create image function

// import platform from "./img/platform.png"

// function createImage(imageSrc){
//     const image = new Image()
//     image.src = platform
//     return image
// }

const platformImg = document.getElementById("platformImg")
platformImg.setAttribute("src", "./img/platform.png")

const backgroundImg = document.getElementById("backgroundImg")
backgroundImg.setAttribute("src", "./img/background.png")

const hillsImg = document.getElementById("hillsImg")
hillsImg.setAttribute("src", "./img/hills.png")




// define canvas width / height 
canvas.width = 1024;
canvas.height = 576 ;
//canvas.setAttribute("border" , "1px solid red")



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

        // define bottom Max ground constraint
        if(this.position.y + this.height + this.velocity.y <= canvas.height){
            this.velocity.y += gravity
        }
    }
}

// define initializing function
//function init(){}


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

// define win condition variable
let scrollOffset = 0


// DEFINE SCENARIO DINAMICS 


// create new class Platform
class Platform {
    constructor ({ x, y, image }){
        this.position = {
            x, // = x: x,
            y, // = y: y,
        }

        this.image = image ;

        this.width = image.naturalWidth
        this.height = image.naturalHeight
    }

    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

// create platform array
const platforms = [
    new Platform({
    x: -1, 
    y: 480,
    image: platformImg,
}),
new Platform({
    x: platformImg.naturalWidth - 3 , 
    y: 480, 
    image: platformImg,
}),
new Platform({
    x: platformImg.naturalWidth * 2 + 100 , 
    y: 480, 
    image: platformImg,
})
]

// define GenericObject class (no platform collision funnction)
class GenericObject {
    constructor ({ x, y, image }){
        this.position = {
            x, // = x: x,
            y, // = y: y,
        }

        this.image = image ;

        this.width = image.naturalWidth
        this.height = image.naturalHeight
    }

    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

// create background from GenericObject
const genericObjects = [
    new GenericObject({
        x: -1,
        y: -1,
        image: backgroundImg
    }), 
    new GenericObject({
        x: 0,
        y: 0,
        image: hillsImg
    })
]

// define animate
function animate(){
    requestAnimationFrame(animate)
    c.fillStyle = "white"
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })

    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()


    // player moving l/r && player hasn't passed points x/y of moving background
    if (keys.right.pressed && player.position.x < 400){
        player.velocity.x = 5
    } else if (keys.left.pressed && player.position.x > 100){
        player.velocity.x = -5
    // else stop moving & move backgroud if key pressed
    } else {player.velocity.x = 0
    
    if (keys.right.pressed){
    // move platform to left when player is moving to the right
    scrollOffset += 5;
    platforms.forEach(platform => {
        platform.position.x -= 5
    })
    genericObjects.forEach(genericObject => {
        genericObject.position.x -= 3
    })
    } else if (keys.left.pressed){
        scrollOffset -= 5
        platforms.forEach(platform => {
            platform.position.x += 5
        })
        genericObjects.forEach(genericObject => {
            genericObject.position.x += 3
        })
    }
    // win condition
    if (scrollOffset > 2000){
        console.log("You win!")
    }
    
    // lose condition
    if (player.position.y > canvas.height) {
        console.log("You lose!")
        init()
    }
}

    // player/platform collision:
    // when not only player is above platform but && player is going down and collides with upper platform surface && player is above the platform (x axys)
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width){
            player.velocity.y = 0
        }
    })
}


// invoke animate
animate()


// Event listener keydown
window.addEventListener("keydown", ({ keyCode }) => {
    switch(keyCode){
        case 65:
            // console.log("left")
            keys.left.pressed = true
            break;
        case 87:
            // console.log("up")
            // define jump -> position -20 + 1.5 di gravity ... position + 0 ... position - gravity till velocity = 0
            player.velocity.y -= 20;
            break;
        case 68:
            // console.log("right")
            keys.right.pressed = true
            break;
        case 83:
            // console.log("down")
            break;
    }
})

// event listener keyup
window.addEventListener("keyup", ({ keyCode }) => {
    switch(keyCode){
        case 65:
            // console.log("left")
            keys.left.pressed = false
            break;
        case 87:
            // console.log("up")
            break;
        case 68:
            // console.log("right")
            keys.right.pressed = false
            break;
        case 83:
            // console.log("down")
            break;
    }
})
