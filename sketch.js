//Create variables here
var dog, dogImg, happyDogImg
var database, foodS, foodStock
var feed, addFood
var fedTime, lastFed
var foodObj
var washroom, bedroom, garden
var readState, gameState

function preload()
{
	//load images here
  dogImg = loadImage("images/dogImg.png")
  happyDogImg = loadImage("images/dogImg1.png")
  washroom = loadImage("images10/Wash Room.png")
  bedroom = loadImage("images10/Bed Room.png")
  garden = loadImage("images10/Garden.png")
}

function setup() {
	createCanvas(1000, 500);

  database = firebase.database()

  foodStock = database.ref("Food")
  foodStock.on("value", readStock)
  foodStock.set(20)
  
 
  
  dog = createSprite(820,200,10,60)
  dog.addImage(dogImg)
  dog.scale = 0.2

  foodObj = new Food()

  feed = createButton("Feed the Dog")
  feed.position(700, 105)
  feed.mousePressed(feedDog)

  addFood = createButton("Add Food")
  addFood.position(800, 105)
  addFood.mousePressed(addFoods)
  
}


function draw() {
  background("green")
  
  
  fedTime = database.ref("FeedTime")
  fedTime.on("value", function(data){
    lastFed = data.val()
  })

  readState = database.ref('gameState')
  readState.on("value", function(data){
    gameState = data.val()
  })
  
  textSize(20)
  fill("white")
  if(lastFed >= 12){
    text("Last Feed : "+ lastFed%12 + "PM", 360, 30 )
  }else if(lastFed === 0){

    text("Last Feed : 12 AM", 360, 30)
  } else{
    text("Last Feed : "+ lastFed + "AM", 360, 30)
  }


  var currentTime = hour() 
  if(currentTime === (lastFed + 1)){
    update("Playing")
    foodObj.garden()
  } else if(currentTime === (lastFed+2)){
    update("Sleeping")
    foodObj.bedroom()
  }else if(currentTime > (lastFed+2) && currentTime <= (lastFed+4)){
     update("Bathing")
     foodObj.washroom()
  }else{
    update("Hungry")
    foodObj.display()
  }

  if(gameState !== "Hungry"){

    feed.hide()
    addFood.hide()
    dog.remove()
    
  }else{
    
    feed.show()
    addFood.show()
    dog.addImage(dogImg)
     
  }

   

  drawSprites();
}


function readStock(data){
  foodS = data.val()
  foodObj.updateFoodStock(foodS)
}

function feedDog(){

  dog.addImage(happyDogImg)

  foodObj.updateFoodStock(foodObj.getFoodStock()-1)

  database.ref("/").update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods(){

  foodS ++
  database.ref("/").update({

    Food : foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState : state
  })
}
