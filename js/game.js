(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';


var BootState = require('./states/boot');
var MenuState = require('./states/menu');
var PlayState = require('./states/play');
var PreloadState = require('./states/preload');



var game = new Phaser.Game(800, 505, Phaser.CANVAS, 'flappy-bird-reborn');


// Game States
game.state.add('boot', BootState);
game.state.add('menu', MenuState);
game.state.add('play', PlayState);
game.state.add('preload', PreloadState);

game.state.start('boot');


},{"./states/boot":7,"./states/menu":8,"./states/play":9,"./states/preload":10}],2:[function(require,module,exports){
'use strict';

var Bird = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'bird', frame);
  this.anchor.setTo(0.5, 0.5);
  this.animations.add('flap');
  this.animations.play('flap', 12, true);

  this.flapSound = this.game.add.audio('flap');

  this.name = 'bird';
  this.alive = false;
  this.onGround = false;


  // enable physics on the bird
  // and disable gravity on the bird
  // until the game is started
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;
  this.body.collideWorldBounds = true;


  this.events.onKilled.add(this.onKilled, this);



};

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;

Bird.prototype.update = function() {
  // check to see if our angle is less than 90
  // if it is rotate the bird towards the ground by 2.5 degrees
  if(this.angle < 90 && this.alive) {
    this.angle += 2.5;
  }

  if(!this.alive) {
    this.body.velocity.x = 0;
  }
};

Bird.prototype.flap = function() {
  if(!!this.alive) {
    this.flapSound.play();
    //cause our bird to "jump" upward
    this.body.velocity.y = -400;
    // rotate the bird to -40 degrees
    this.game.add.tween(this).to({angle: -40}, 100).start();
  }
};








Bird.prototype.revived = function() {
};

Bird.prototype.onKilled = function() {
  this.exists = true;
  this.visible = true;
  this.animations.stop();
  var duration = 90 / this.y * 300;
  this.game.add.tween(this).to({angle: 90}, duration).start();
  console.log('killed');
  console.log('alive:', this.alive);
};



module.exports = Bird;


},{}],3:[function(require,module,exports){
'use strict';

var Ground = function(game, x, y, width, height) {
  Phaser.TileSprite.call(this, game, x, y, width, height, 'ground');
  // start scrolling our ground
  this.autoScroll(-200,0);

  // enable physics on the ground sprite
  // this is needed for collision detection
  this.game.physics.arcade.enableBody(this);

  // we don't want the ground's body
  // to be affected by gravity or external forces
  this.body.allowGravity = false;
  this.body.immovable = true;


};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {

  // write your prefab's specific update code here

};

module.exports = Ground;
},{}],4:[function(require,module,exports){
'use strict';

var Pipe = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'pipe', frame);
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);

  this.body.allowGravity = false;
  this.body.immovable = true;

};

Pipe.prototype = Object.create(Phaser.Sprite.prototype);
Pipe.prototype.constructor = Pipe;

Pipe.prototype.update = function() {
  // write your prefab's specific update code here

};


/* //-----------------------------------------------------------------------------------------------//
var EnemyEnemyBird = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'enemyEnemyBird', frame);
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  
  this.body.allowGravity = false;
  this.body.immovable = true;
  this.animations.add('flapEnemy');
  this.animations.play('flapEnemy', 12, true);
  
  this.name = 'enemyEnemyBird';
  this.alive = false;
  this.onGround = false;


  // enable physics on the EnemyBird
  // and disable gravity on the EnemyBird
  // until the game is started
  this.body.collideWorldBounds = true;
  this.events.onKilled.add(this.onKilled, this);
};

EnemyBird.prototype = Object.create(Phaser.Sprite.prototype);
EnemyBird.prototype.constructor = EnemyBird;

EnemyBird.prototype.update = function() {
  // check to see if our angle is less than 90
  // if it is rotate the EnemyBird towards the ground by 2.5 degrees
};

EnemyBird.prototype.onKilled = function() {
  this.exists = true;
  this.visible = true;
  this.animations.stop();
  var duration = 90 / this.y * 300;
  this.game.add.tween(this).to({angle: 90}, duration).start();
};
//-------------------------------------------------------------------------------------------------//

var EnemyBirdGroup = function(game, parent) {

  Phaser.Group.call(this, game, parent);

  this.topPipe = new EnemyBird(this.game, 0, 0, 0);
  this.bottomPipe = new Pipe(this.game, 0, 440, 1);
  this.add(this.topBird);
  this.add(this.bottomBird);
  this.hasScored = false;
  this.setAll('body.velocity.x', -200);
};

EnemyBirdGroup.prototype = Object.create(Phaser.Group.prototype);
EnemyBirdGroup.prototype.constructor = EnemyBirdGroup;

EnemyBirdGroup.prototype.update = function() {
  this.checkWorldBounds(); 
};

EnemyBirdGroup.prototype.checkWorldBounds = function() {
  if(!this.topBird.inWorld) {
    this.exists = false;
  }
};


EnemyBirdGroup.prototype.reset = function(x, y) {
  this.topBird.reset(game.rnd.integerInRange(0, 20),game.rnd.integerInRange(20, 480));
  this.bottomPipe.reset(game.rnd.integerInRange(0, 20),game.rnd.integerInRange(20, 480));
  this.x = x;
  this.y = y;
  this.setAll('body.velocity.x', -200);
  this.exists = true;
};


EnemyBirdGroup.prototype.stop = function() {
  this.setAll('body.velocity.x', 0);
}; */

module.exports = Pipe;
},{}],5:[function(require,module,exports){
'use strict';

var Pipe = require('./pipe');

var PipeGroup = function(game, parent) {

  Phaser.Group.call(this, game, parent);

  this.topPipe = new Pipe(this.game, 0, 0, 0);
  this.bottomPipe = new Pipe(this.game, 0, 440, 1);
  this.add(this.topPipe);
  this.add(this.bottomPipe);
  this.hasScored = false;

  this.setAll('body.velocity.x', -100);
};

PipeGroup.prototype = Object.create(Phaser.Group.prototype);
PipeGroup.prototype.constructor = PipeGroup;

PipeGroup.prototype.update = function() {
  this.checkWorldBounds();
};

PipeGroup.prototype.checkWorldBounds = function() {
  if(!this.topPipe.inWorld) {
    this.exists = false;
  }
};


PipeGroup.prototype.reset = function(x, y) {
  this.topPipe.reset(0,0);
  this.bottomPipe.reset(0,440);
  this.x = x;
  this.y = y;
  this.setAll('body.velocity.x', -200);
  this.hasScored = false;
  this.exists = true;
};


PipeGroup.prototype.stop = function() {
  this.setAll('body.velocity.x', 0);
};

module.exports = PipeGroup;
},{"./pipe":4}],6:[function(require,module,exports){
'use strict';

var Scoreboard = function(game) {

  var gameover;

  Phaser.Group.call(this, game);
  gameover = this.create(this.game.width / 2, 100, 'gameover');
  gameover.anchor.setTo(0.5, 0.5);

  this.scoreboard = this.create(this.game.width / 2, 200, 'scoreboard');
  this.scoreboard.anchor.setTo(0.5, 0.5);

  this.scoreText = this.game.add.bitmapText(this.scoreboard.width+250, 180, 'flappyfont', '', 18);
  this.add(this.scoreText);

  this.bestText = this.game.add.bitmapText(this.scoreboard.width+250, 230, 'flappyfont', '', 18);
  this.add(this.bestText);

  // add our start button with a callback
  this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
  this.startButton.anchor.setTo(0.5,0.5);

  this.add(this.startButton);

  this.y = this.game.height;
  this.x = 0;

};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.show = function(score) {
  var coin, bestScore;
  this.scoreText.setText(score.toString());
  if(!!localStorage) {
    bestScore = localStorage.getItem('bestScore');
    if(!bestScore || bestScore < score) {
      bestScore = score;
      localStorage.setItem('bestScore', bestScore);
    }
  } else {
    bestScore = 'N/A';
  }

  this.bestText.setText(bestScore.toString());

  if(score >= 10 && score < 20)
  {
    coin = this.game.add.sprite(-65 , 7, 'medals', 1);
  } else if(score >= 20) {
    coin = this.game.add.sprite(-65 , 7, 'medals', 0);
  }

  this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);

  if (coin) {

    coin.anchor.setTo(0.5, 0.5);
    this.scoreboard.addChild(coin);

     // Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
    var emitter = this.game.add.emitter(coin.x, coin.y, 400);
    this.scoreboard.addChild(emitter);
    emitter.width = coin.width;
    emitter.height = coin.height;


    //  This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
    // emitter.width = 800;

    emitter.makeParticles('particle');

    // emitter.minParticleSpeed.set(0, 300);
    // emitter.maxParticleSpeed.set(0, 600);

    emitter.setRotation(-100, 100);
    emitter.setXSpeed(0,0);
    emitter.setYSpeed(0,0);
    emitter.minParticleScale = 0.25;
    emitter.maxParticleScale = 0.5;
    emitter.setAll('body.allowGravity', false);

    emitter.start(false, 1000, 1000);

  }
};

Scoreboard.prototype.startClick = function() {
  this.game.state.start('play');
};





Scoreboard.prototype.update = function() {
  // write your prefab's specific update code here
};

module.exports = Scoreboard;

},{}],7:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/loading.png');
    this.load.image('loadingBg', 'assets/bgLoading.png');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],8:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    // add the background sprite
    this.background = this.game.add.sprite(0,0,'background');

    // add the ground sprite as a tile
    // and start scrolling in the negative x direction
    this.ground = this.game.add.tileSprite(0,400, 800,112,'ground');
    this.ground.autoScroll(-200,0);

    /** STEP 1 **/
    // create a group to put the title assets in
    // so they can be manipulated as a whole
    this.titleGroup = this.game.add.group()

    /** STEP 2 **/
    // create the title sprite
    // and add it to the group
    this.title = this.add.sprite(250,0,'title');
    this.titleGroup.add(this.title);

    /** STEP 3 **/
    // create the bird sprite
    // and add it to the title group
    this.bird = this.add.sprite(510,10,'bird');
    this.titleGroup.add(this.bird);

    /** STEP 4 **/
    // add an animation to the bird
    // and begin the animation
    this.bird.animations.add('flap');
    this.bird.animations.play('flap', 12, true);

    /** STEP 5 **/
    // Set the originating location of the group
    this.titleGroup.x = 30;
    this.titleGroup.y = 100;

    /** STEP 6 **/
    //  create an oscillating animation tween for the group
    this.game.add.tween(this.titleGroup).to({y:115}, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

    // add our start button with a callback
    this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
    this.startButton.anchor.setTo(0.5,0.5);
  },
  startClick: function() {
    // start button click handler
    // start the 'play' state
    this.game.state.start('play');
  }
};

module.exports = Menu;

},{}],9:[function(require,module,exports){

'use strict';
var Bird = require('../prefabs/bird');
var Ground = require('../prefabs/ground');
var Pipe = require('../prefabs/pipe');
var PipeGroup = require('../prefabs/pipeGroup');
var Scoreboard = require('../prefabs/scoreboard');

function Play() {



}
Play.prototype = {
  create: function() {
	this.bulletTime = 0;
	this.firingTimer = 0;
	this.bulletSound = this.game.add.audio('bulletSound');
	this.boomSound = this.game.add.audio('boomSound');
	
  //  Our bullet group

	this.cursors = this.game.input.keyboard.createCursorKeys();
    this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.coba = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.D]);


    // start the phaser arcade physics engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);


    // give our world an initial gravity of 1200
    this.game.physics.arcade.gravity.y = 1200;

    // add the background sprite
    this.background = this.game.add.sprite(0,0,'background');

    // create and add a group to hold our pipeGroup prefabs
    this.pipes = this.game.add.group();

    // create and add a new Bird object
    this.bird = new Bird(this.game, 100, this.game.height/2);
    this.game.add.existing(this.bird);



    // create and add a new Ground object
    this.ground = new Ground(this.game, 0, 400, 800, 112);
    this.game.add.existing(this.ground);
	
	

    // add keyboard controls
    this.flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.tes = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.flapKey.onDown.addOnce(this.startGame, this);
    this.flapKey.onDown.add(this.bird.flap, this.bird);
	this.tes.onDown.addOnce(this.startGame, this);
    this.tes.onDown.add(this.bird.flap, this.bird);


    // add mouse/touch controls
    this.game.input.onDown.addOnce(this.startGame, this);
    this.game.input.onDown.add(this.bird.flap, this.bird);


    // keep the spacebar from propogating up to the browser
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.W]);



    this.score = 0;
    this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont',this.score.toString(), 24);

    this.instructionGroup = this.game.add.group();
    this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 100,'getReady'));
    this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 325,'instructions'));
    this.instructionGroup.setAll('anchor.x', 0.5);
    this.instructionGroup.setAll('anchor.y', 0.5);

    this.pipeGenerator = null;

    this.gameover = false;

    this.pipeHitSound = this.game.add.audio('pipeHit');
    this.groundHitSound = this.game.add.audio('groundHit');
    this.scoreSound = this.game.add.audio('score');

  },
  generateEnemy:function(){
	 if(this.bird.alive && !this.gameover) {
			  this.musuh = this.sprites.getFirstExists(false);
  	          this.musuh.body.allowGravity = false;
  	          if (this.musuh)
  	          {
  	              //  And fire it	
  	              this.musuh.reset(this.game.rnd.integerInRange(this.game.width-50, this.game.width), this.game.rnd.integerInRange(0, 350));
  	              this.musuh.body.velocity.x = this.game.rnd.integerInRange(-250, -400);
				  this.musuh.animations.add('spin', [0,1]);
				  this.musuh.play('spin', 20, true);
  	          }
	   }
  },
     fireBullet:function() {
  	      //  To avoid them being allowed to fire too fast we set a time limit
  	        if(this.bird.alive && !this.gameover) {
		  if (this.game.time.now > this.bulletTime)
  	      {
			  this.bulletSound.play();

  	          //  Grab the first bullet we can from the pool
  	          this.bullet = this.bullets.getFirstExists(false);
  	          this.bullet.body.allowGravity = false;

  	          if (this.bullet)
  	          {
  	              //  And fire it
  	              this.bullet.reset(this.bird.x+8, this.bird.y);
  	              this.bullet.body.velocity.x = +400;
  	              this.bulletTime = this.game.time.now +200;
  	          }
  	      }
	   }
  },


  update: function() {

	 if (this.fireButton.isDown || this.coba.isDown  )
        {
            this.fireBullet();
        }


    // enable collisions between the bird and the ground
    this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);
	this.game.physics.arcade.collide(this.bird, this.sprites,   this.deathHandler, null, this);
	
	
    if(!this.gameover) {
        // enable collisions between the bird and each group in the pipes group
        this.pipes.forEach(function(pipeGroup) {
			this.game.physics.arcade.collide(this.bullet, pipeGroup, this.bulletHandler, null, this);
			this.game.physics.arcade.collide(this.bullet, this.sprites, this.musuh1Handler, null, this);
            this.checkScore(pipeGroup);
            this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
            //this.game.physics.arcade.collide(this.bird, this.sprites, this.deathHandler, null, this);
        }, this);
    }
		
  },
  
shutdown: function() {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
    this.bird.destroy();
    this.pipes.destroy();
    this.scoreboard.destroy();
  },
  startGame: function() {
    if(!this.bird.alive && !this.gameover) {
        this.bird.body.allowGravity = true;
        this.bird.alive = true;
        // add a timer
		
		this.bullets = this.game.add.group();
	    this.bullets.enableBody = true;
	    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
	    this.bullets.createMultiple(30, 'bullet');
	    this.bullets.setAll('anchor.x', 0.5);
	    this.bullets.setAll('anchor.y', 1);
	    this.bullets.setAll('outOfBoundsKill', true);
	    this.bullets.setAll('checkWorldBounds', true);
		
		this.sprites = this.game.add.group();
		this.sprites.enableBody = true;
		this.sprites.createMultiple(2, 'enemyBird');
		this.sprites.physicsBodyType = Phaser.Physics.ARCADE;
		//this.sprites.create(-10,-10,'enemyBird');
		//this.sprites.add(this.groupB);
	    this.sprites.setAll('outOfBoundsKill', true);
	    this.sprites.setAll('checkWorldBounds', true);
		
		//this.musuh.body.velocity.x = -230;
	    //this.sprites.setAll('body.allowGravity', false);
		
		 this.explosions = this.game.add.group();
		this.explosions.createMultiple(30, 'kaboom');
	
	
		this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 4, this.generatePipes, this);
        this.pipeGenerator.timer.start();
		
		this.enemyGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.generateEnemy, this);
        this.enemyGenerator.timer.start();
		


        this.instructionGroup.destroy();
    }
  },
  checkScore: function(pipeGroup) {
    if(pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
        pipeGroup.hasScored = true;
        //this.score+=10;
        this.scoreText.setText(this.score.toString());
        //this.scoreSound.play();
    }
  },
  bulletHandler: function(){
	  this.bullet.kill();
  },
  musuh1Handler: function(){
	  this.musuh.kill();
	  this.bullet.kill();
	  this.explosion = this.explosions.getFirstExists(false);
		this.explosion.reset(this.musuh.body.x-50, this.musuh.body.y-50);
		this.explosion.animations.add('kaboom');
		this.explosion.play('kaboom', 30, false, true);
		this.boomSound.play();
		this.score++;
        this.scoreText.setText(this.score.toString());
        this.scoreSound.play();
  },
  deathHandler: function(bird, enemy) {
    if(enemy instanceof Ground && !this.bird.onGround) {
        this.groundHitSound.play();
        this.scoreboard = new Scoreboard(this.game);
        this.game.add.existing(this.scoreboard);
        this.scoreboard.show(this.score);
        this.bird.onGround = true;
    } else if (enemy instanceof Pipe){
        this.pipeHitSound.play();
    }

    if(!this.gameover) {
        this.gameover = true;
        this.bird.kill();
        this.pipes.callAll('stop');
        this.pipeGenerator.timer.stop();
        this.ground.stopScroll();
    }

  },
  generatePipes: function() {
    var pipeY = this.game.rnd.integerInRange(-100, 100);
    var pipeGroup = this.pipes.getFirstExists(false);
    if(!pipeGroup) {
        pipeGroup = new PipeGroup(this.game, this.pipes);
    }
    pipeGroup.reset(this.game.width, pipeY);
  }
};

module.exports = Play;

},{"../prefabs/bird":2,"../prefabs/ground":3,"../prefabs/pipe":4,"../prefabs/pipeGroup":5,"../prefabs/scoreboard":6}],10:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(0,0, 'loadingBg');
    this.asset = this.add.sprite(0,0, 'preloader');
    //this.asset.anchor.setTo(0.5, 0.5);
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('background', 'assets/bg.png');
    this.load.image('ground', 'assets/ground2.png');
    this.load.image('title', 'assets/title.png');
    this.load.spritesheet('bird', 'assets/bird.png', 34,24,3);
	this.load.spritesheet('enemyBird', 'assets/bird2.png', 34,24,3);
    this.load.spritesheet('pipe', 'assets/pipes.png', 54,320,2);
    this.load.image('startButton', 'assets/start-button.png');
	this.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);

    this.load.image('instructions', 'assets/instructions.png');
    this.load.image('getReady', 'assets/get-ready.png');

    this.load.image('scoreboard', 'assets/scoreboard.png');
    this.load.spritesheet('medals', 'assets/medals.png',44, 46, 2);
    this.load.image('gameover', 'assets/gameover.png');
    this.load.image('particle', 'assets/particle.png');

    this.load.image('bullet', 'assets/bullet.png');

    this.load.audio('flap', 'assets/flap.wav');
    this.load.audio('pipeHit', 'assets/pipe-hit.wav');
    this.load.audio('groundHit', 'assets/ground-hit.wav');
    this.load.audio('score', 'assets/score.wav');
    this.load.audio('ouch', 'assets/ouch.wav');
	this.load.audio('bulletSound', 'assets/bullet.ogg');
	this.load.audio('boomSound', 'assets/kaboom.ogg');

    this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])