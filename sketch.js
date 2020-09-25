var PLAY=0;
var END=1;
var gameState=PLAY;
var monkey , monkey_running, monkey_collided;
var banana ,bananaImage, obstacle, obstacleImage
var FoodGroup, obstacleGroup
var score
var ground;
var checkPointSound, gameOverSound, jumpSound;
var restart, restartImg;
var gameOver, gameOverImg;

function preload(){
  
  
  monkey_running =            loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png")
  
  monkey_collided=loadImage("sprite_7.png")
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  checkPointSound=loadSound("checkpoint.mp3");
  gameOverSound=loadSound("gameover.mp3");
  jumpSound=loadSound("jump.mp3");
  restartImg=loadImage("restart.png");
  gameOverImg=loadImage("gameOverpic.png");
  
  
}



function setup() {
  createCanvas(600,200)
  
  //creating monkey
  monkey=createSprite(60,160,20,20);
  monkey.addAnimation("running",monkey_running);
  monkey.addAnimation("collided", monkey_collided);
  monkey.scale=0.08

  //creating ground
  ground=createSprite(400,195,1200,20); 
  ground.shapeColor="green"
  obstacleGroup = createGroup();
  FoodGroup = createGroup();
  monkey.debug=false;
  
  restart=createSprite(300,120,20,20);
  restart.addImage(restartImg);
  
  gameOver=createSprite(300,70,20,20);
  gameOver.addImage(gameOverImg);

  
  score=0
}


function draw() {
  background("DeepSkyBlue")
  fill("black")
  text("Score: "+ score, 500,50);
  
   if (gameState===PLAY){
     gameOver.visible=false;
     restart.visible=false;
    //making the monkey jump if space is pressed 
     if (keyDown("space") && monkey.y>=160) {
        monkey.velocityY = -14;
        jumpSound.play();
     }
     score = score+ Math.round(frameRate()/60);
     ground.velocityX=-(5 + 3* score/100)
     spawnObstacles();
     spawnBananas();
     
     //making the ground continuous scrolling ground
     if (ground.x<0){
       ground.x=ground.width/2
     }
     if (monkey.isTouching(obstacleGroup)){
       gameState=END
       gameOverSound.play();
     }
     if (monkey.isTouching(FoodGroup)){
       FoodGroup.destroyEach();
       checkPointSound.play();
     }
     
     
   }

  else if (gameState===END){
    gameOver.visible=true;
    restart.visible=true;
    ground.velocityX=0
    monkey.changeAnimation("collided" , monkey_collided)
    obstacleGroup.setVelocityXEach(0)
    obstacleGroup.setLifetimeEach(-1)
    FoodGroup.setVelocityXEach(0);
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  //creating gravity
  monkey.velocityY = monkey.velocityY + 0.8
  
  // monkey collides with ground so that it doesnt fall off 
  monkey.collide(ground)
  
  
  
  drawSprites();
}

function spawnObstacles(){
  if (frameCount % 200 === 0) {
    obstacle = createSprite(600, 170, 10, 30);
    obstacle.velocityX = -(5 + 3* score/100);
    obstacle.addImage(obstacleImage)
    obstacle.scale=0.1
    obstacle.debug=false
    obstacle.lifetime=150
    
    obstacleGroup.add(obstacle);
  }
}

function spawnBananas(){
  if (frameCount%90===0){
    banana=createSprite(600,170,10,30);
    banana.velocityX=-(5 + 3*score/100);
    banana.addImage(bananaImage);
    banana.scale=0.1
    
    banana.y=Math.round(random(20,50));
    FoodGroup.add(banana);
                   
  }
}

function reset(){
 
  gameState=PLAY;
  score=0
 FoodGroup.destroyEach();
 obstacleGroup.destroyEach();
  monkey.changeAnimation("running" , monkey_running);

}

