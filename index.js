const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

// Implement create image function

// import platform from "./img/platform.png"

// function createImage(imageSrc){
//     const image = new Image()
//     image.src = platform
//     return image
// }

// define initializing function

const platformImg = new Image
platformImg.setAttribute("src", "./img/platform.png")

const backgroundImg = new Image
backgroundImg.setAttribute("src", "./img/background.png")

const hillsImg = new Image
hillsImg.setAttribute("src", "./img/hills.png")

const platformSmallTallImg = new Image
platformSmallTallImg.setAttribute("src", "./img/platformSmallTall.png")

const spriteRunLeftImg = new Image
spriteRunLeftImg.setAttribute("src", "./img/spriteRunLeft.png")

const spriteRunRightImg = new Image
spriteRunRightImg.setAttribute("src", "./img/spriteRunRight.png")

const spriteStandLeftImg = new Image
spriteStandLeftImg.setAttribute("src", "./img/spriteStandLeft.png")

const spriteStandRightImg = new Image
spriteStandRightImg.setAttribute("src", "./img/spriteStandRight.png")




// define canvas width / height 
canvas.width = 1024 ;
canvas.height = 576 ;
//canvas.setAttribute("border" , "1px solid red")


// DEFINE INIT FUNCTION
// function initi(){   ...   }


// DEFINE PLAYER DINAMICS


// define gravity const
const gravity = 1.5
const speed = 6


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

        this.width = 66
        this.height = 150
        this.speed = 10
        this.image = spriteStandRightImg
        this.frames = 0 
        // define sprites objects for each action
        this.sprites = {
            stand: {
                left: spriteStandLeftImg,
                right: spriteStandRightImg,
                cropWidth: 177,
                width: 66
            },
            run: {
                left: spriteRunLeftImg,
                right: spriteRunRightImg,
                cropWidth: 341,
                width: 127.875
            }
        }
        // define variables for each actions
        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = this.sprites.stand.cropWidth
    }
    
    // draw sprites
    draw(){
        c.drawImage(
          this.currentSprite,
          this.currentCropWidth * this.frames,
          0,
          this.currentCropWidth,
          400,
          this.position.x,
          this.position.y,
          this.width,
          this.height
        );
    }

    update(){
        this.frames++

        if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)){
            this.frames = 0
        } else if (this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)){
            this.frames = 0
        }

        this.draw()
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        // define bottom Max ground constraint
        if(this.position.y + this.height + this.velocity.y <= canvas.height){
            this.velocity.y += gravity
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
    x: platformImg.naturalWidth * 5 + 298 - platformSmallTallImg.naturalWidth, 
    y: 270, 
    image: platformSmallTallImg,
}),
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
}),
new Platform({
    x: platformImg.naturalWidth * 3 + 300 , 
    y: 480, 
    image: platformImg,
}),
new Platform({
    x: platformImg.naturalWidth * 4 + 300 - 2 , 
    y: 480, 
    image: platformImg,
}),
new Platform({
    x: platformImg.naturalWidth * 5 + 650 - 2 , 
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
        player.velocity.x = player.speed
    } else if ((keys.left.pressed && player.position.x > 100) || keys.left.pressed && scrollOffset === 0 && player.position.x > 0){
        player.velocity.x = -player.speed
    // else stop moving & move backgroud if key pressed
    } else {player.velocity.x = 0
    
    if (keys.right.pressed){
    // move platform to left when player is moving to the right
    scrollOffset += player.speed;
    platforms.forEach(platform => {
        platform.position.x -= player.speed
    })
    genericObjects.forEach(genericObject => {
        genericObject.position.x -= player.speed * 0.66
    }) // if player goes left from initial position, don't scroll
    } else if (keys.left.pressed && scrollOffset > 0){
        scrollOffset -= player.speed
        platforms.forEach(platform => {
            platform.position.x += player.speed
        })
        genericObjects.forEach(genericObject => {
            genericObject.position.x += player.speed * 0.66
        })
    }

    // win condition
    if (scrollOffset > platformImg.naturalWidth * 5 + 250 - 2){
        alert("You win!")
    }
    
    // lose condition
    if (player.position.y > canvas.height) {
        alert("You lose!")
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

let currentKey

// sprite switching conditional

if (keys.right.pressed && currentKey === "right" && player.currentSprite !== player.sprites.run.right){
    player.frames = 1
    player.currentSprite = player.sprites.run.right
    player.currentCropWidth = player.sprites.run.cropWidth
    player.width = player.sprites.run.width
} else if (keys.left.pressed && currentKey === "left" && player.currentSprite !== player.sprites.run.left){
    player.frames = 1
    player.currentSprite = player.sprites.run.left
    player.currentCropWidth = player.sprites.run.cropWidth
    player.width = player.sprites.run.width
} else if (!keys.right.pressed && currentKey === "right" && player.currentSprite !== player.sprites.stand.right){
    player.frames = 1
    player.currentSprite = player.sprites.stand.right
    player.currentCropWidth = player.sprites.stand.cropWidth
    player.width = player.sprites.stand.width
} else if (!keys.left.pressed && currentKey === "left" && player.currentSprite !== player.sprites.stand.left){
    player.frames = 1
    player.currentSprite = player.sprites.stand.left
    player.currentCropWidth = player.sprites.stand.cropWidth
    player.width = player.sprites.stand.width
}

// invoke animate
animate()

// Event listener keydown
window.addEventListener("keydown", ({ keyCode }) => {
    switch(keyCode){
        case 65:
            // console.log("left")
            keys.left.pressed = true
            // player.currentSprite = player.sprites.run.left
            // player.currentCropWidth = player.sprites.run.cropWidth
            // player.width = player.sprites.run.width
            currentKey = "left"
            break;
        case 87:
            // console.log("up")
            // define jump -> position -20 + 1.5 di gravity ... position + 0 ... position - gravity till velocity = 0
            // no double jump
            if (player.position.y > 180){
                player.velocity.y -= 25
            }
            break;
        case 68:
            // console.log("right")
            keys.right.pressed = true
            // player.currentSprite = player.sprites.run.right
            // player.currentCropWidth = player.sprites.run.cropWidth
            // player.width = player.sprites.run.width
            currentKey = "right"
            break;
        case 83:
            // console.log("down")
            break;
    }
})

// event listener keyup
window.addEventListener("keyup", ({ key }) => {
    switch(key){
        case 65:
            // console.log("left")
            keys.left.pressed = false
            // player.currentSprite = player.sprites.stand.left
            // player.currentCropWidth = player.sprites.stand.cropWidth
            // player.width = player.sprites.stand.width
            break;
        case 87:
            // console.log("up")
            break;
        case 68:
            // console.log("right")
            keys.right.pressed = false
            // player.currentSprite = player.sprites.stand.right
            // player.currentCropWidth = player.sprites.stand.cropWidth
            // player.width = player.sprites.stand.width
            break;
        case 83:
            // console.log("down")
            break;
    }
})
