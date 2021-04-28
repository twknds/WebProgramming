(function(){
    var startGame=0;
    var Game = {
    //값 초기화
        init: function(){
            this.c = document.getElementById("game");
            this.c.width = this.c.width;
            this.c.height = this.c.height;
            this.ctx = this.c.getContext("2d");
            this.color = "rgba(10,10,10,.7)";
            this.bullets = [];
            this.enemyBullets = [];
            this.enemies = [];
            this.particles = [];
            this.bulletIndex = 0;
            this.enemyBulletIndex = 0;
            this.enemyIndex = 0;
            this.particleIndex = 0;
            this.maxParticles = 10;
            this.maxEnemies = 6;
            this.enemiesAlive = 0;
            this.currentFrame = 0;
            this.maxLives = 3;
            this.life = 0;
            this.binding();
            this.player = new Player();
            this.score = 0;
            this.paused = false;
            this.shooting = false;
            this.oneShot = false;
            this.isGameOver = false;
            this.bomb=3;
            this.bombNow=0;
            this.bombcount=0;
            if(startGame==0)this.gameStart();
         this.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;         
            for(var i = 0; i<this.maxEnemies; i++){
                new Enemy();
                this.enemiesAlive++;
            }
            this.invincibleMode(2000);
    
            this.loop();
        },
    //키 이벤트 등록
        binding: function(){
            window.addEventListener("keydown", this.buttonDown);
            window.addEventListener("keyup", this.buttonUp);
            window.addEventListener("keypress", this.keyPressed);
            this.c.addEventListener("click", this.clicked);
        },
    //마우스 클릭시
        clicked: function(){
            if(!Game.paused) {
                Game.pause();
            } else {
                if(Game.isGameOver){
                    Game.init();
                } else {
                    Game.unPause();
                    Game.loop();
                    Game.invincibleMode(1000);
                }
            }
        },
    //눌린상태
        keyPressed: function(e){
            
            if(e.keyCode === 32){
                if(!Game.player.invincible  && !Game.oneShot){
                    Game.player.shoot();
                    Game.oneShot = true;
                }
                if(Game.isGameOver){
                    Game.init();
                }
          e.preventDefault();
            }
        },
        //뗏다
        buttonUp: function(e){
            if(e.keyCode === 32){
                Game.shooting = false;
                Game.oneShot = false;
            e.preventDefault();
            }
            if(e.keyCode === 37 || e.keyCode === 65){
                Game.player.movingLeft = false;
            }
            if(e.keyCode === 38 || e.keyCode === 87){
                Game.player.movingUp = false;
            }
            if(e.keyCode === 39 || e.keyCode === 68){
                Game.player.movingRight = false;
            }
            if(e.keyCode === 40 || e.keyCode === 83){
                Game.player.movingDown = false;
            }

        },
        //눌렀다
        buttonDown: function(e){
            if(e.keyCode === 32){
                Game.shooting = true;
            }
            //폭탄키 x
            if(e.keyCode === 16 && Game.bomb>0){
                Game.bomb--;
                Game.bombNow=1;
                Game.bombcount=Game.enemiesAlive;
                Game.invincibleMode(2500);
                e.preventDefault();
            }
            //좌, a
            if(e.keyCode === 37 || e.keyCode === 65){
                Game.player.movingLeft = true;
            }
            //위, w
            if(e.keyCode === 38 || e.keyCode === 87){
                Game.player.movingUp = true;
            }
            //우, d
            if(e.keyCode === 39 || e.keyCode === 68){
                Game.player.movingRight = true;
            }
            //아래, s
            if(e.keyCode === 40 || e.keyCode === 83){
                Game.player.movingDown = true;
            }
        },
    
        random: function(min, max){
        return Math.floor(Math.random() * (max - min) + min);
      },
    //무적판정
      invincibleMode: function(s){
          this.player.invincible = true;
          setTimeout(function(){
              Game.player.invincible = false;
          }, s);
      },
      //충돌
      collision: function(a, b){
            return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
            )
        },
        //화면 정리
      clear: function(){
          this.ctx.fillStyle = Game.color;
          this.ctx.fillRect(0, 0, this.c.width, this.c.height);
      },
       //정지, 정지해제
      pause: function(){
            this.paused = true;
      },
    
      unPause: function(){
            this.paused = false;
      },
      //시작전 뜨는 화면
      gameStart: function(){
          startGame++;
        this.isGameOver = true;
        this.clear();
        var message = "Shooting Game";
        var message2 = "Click or press Spacebar to Play";
        this.pause();
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 30px Lato, sans-serif";
        this.ctx.fillText(message, this.c.width/2 - this.ctx.measureText(message).width/2, this.c.height/2 - 50);
        this.ctx.fillText(message2, this.c.width/2 - this.ctx.measureText(message2).width/2, this.c.height/2 - 5);
        },
    //종료시 뜨는 화면
      gameOver: function(){
          this.isGameOver = true;
          this.clear();
          var message = "Game Over";
          var message2 = "Score: " + Game.score;
          var message3 = "Click or press Spacebar to Play Again";
          this.pause();
          this.ctx.fillStyle = "white";
          this.ctx.font = "bold 30px Lato, sans-serif";
          this.ctx.fillText(message, this.c.width/2 - this.ctx.measureText(message).width/2, this.c.height/2 - 50);
          this.ctx.fillText(message2, this.c.width/2 - this.ctx.measureText(message2).width/2, this.c.height/2 - 5);
          this.ctx.font = "bold 16px Lato, sans-serif";
          this.ctx.fillText(message3, this.c.width/2 - this.ctx.measureText(message3).width/2, this.c.height/2 + 30);
      },
    //점수 갱신
      updateScore: function(){
          this.ctx.fillStyle = "white";
          this.ctx.font = "16px Lato, sans-serif";
          this.ctx.fillText("Score: " + this.score, 8, 20);
          this.ctx.fillText("Lives: " + (this.maxLives - this.life), 8, 40);
          this.ctx.fillText("Bomb: " + this.bomb, 8, 60);
      },
      
        loop: function(){
            if(!Game.paused){
                Game.clear();
                for(var i in Game.enemies){
                    var currentEnemy = Game.enemies[i];
                    currentEnemy.draw();
                    currentEnemy.update();
                    if(Game.currentFrame % currentEnemy.shootingSpeed === 0){
                        currentEnemy.shoot();
                    }
                }
                for(var x in Game.enemyBullets){
                    Game.enemyBullets[x].draw();
                    Game.enemyBullets[x].update();
                }
                for(var z in Game.bullets){
                    Game.bullets[z].draw();
                    Game.bullets[z].update();
                }
                if(Game.player.invincible){
                    if(Game.currentFrame % 20 === 0){
                        Game.player.draw();
                    }
                } else {
                    Game.player.draw();
                }
    
            for(var i in Game.particles){
              Game.particles[i].draw();
            }
                Game.player.update();
                Game.updateScore();
                Game.currentFrame = Game.requestAnimationFrame.call(window, Game.loop);
            }
        }
    
    };
    
    
    
    
    
    //플레이어값 설정
    var Player = function(){
        this.width = 30;
        this.height = 30;
        this.x = Game.c.width/2 - this.width/2;
        this.y = Game.c.height - this.height;
        this.movingLeft = false;
        this.movingRight = false;
        this.movingUp = false;
        this.movingDown = false;
        this.speed = 4;
        this.invincible = false;
        this.color = "white";
    };
    
    
    Player.prototype.die = function(){
        if(Game.life < Game.maxLives){
            Game.invincibleMode(2000);  
             Game.life++;
        } else {
            Game.pause();
            Game.gameOver();
        }
    };
    
    //캐릭터 그림 생성
    Player.prototype.draw = function(){
        var img=new Image();
        img.src="plane.png";
        Game.ctx.drawImage(img,this.x, this.y, this.width, this.height);
    };
    
    
    Player.prototype.update = function(){
        if(this.movingLeft && this.x > 0){
            this.x -= this.speed;
        }
        if(this.movingRight && this.x + this.width < Game.c.width){
            this.x += this.speed;
        }
        if(this.movingUp && this.y > 0){
            this.y -= this.speed;
        }
        if(this.movingDown && this.y + this.height < Game.c.height){
            this.y += this.speed;
        }       
        if(Game.shooting && Game.currentFrame % 10 === 0){
            this.shoot();
        }
        for(var i in Game.enemyBullets){
            var currentBullet = Game.enemyBullets[i];
            if(Game.collision(currentBullet, this) && !Game.player.invincible){
                this.die();
                delete Game.enemyBullets[i];
            }
        }
    };
    
    
    Player.prototype.shoot = function(){
        //Game.bullets[Game.bulletIndex] = new Bullet(this.x + this.width/2);
        Game.bullets[Game.bulletIndex] = new Bullet(this.x + this.width/2,this.y+this.height/2);
        Game.bulletIndex++;
    };
    
    
    
    
    
    
    var Bullet = function(x,y){  
        this.width = 3;
        this.height = 10;
        this.x = x;
        //this.y = Game.c.height - 10;
        this.y = y;
        this.vy = 4;
        this.index = Game.bulletIndex;
        this.active = true;
        this.color = "white";
        
    };
    
    
    Bullet.prototype.draw = function(){
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    
    
    Bullet.prototype.update = function(){
        this.y -= this.vy;
        if(this.y < 0){
            delete Game.bullets[this.index];
        }
    };
    
    
    
    
    
    //적 생성
    var Enemy = function(){
        this.width = 30;
        this.height = 30;
        this.x = Game.random(0, (Game.c.width - this.width));
        this.y = Game.random(10, 40);
        this.vy = Game.random(1, 6) * .1;
        this.index = Game.enemyIndex;
        Game.enemies[Game.enemyIndex] = this;
        Game.enemyIndex++;
        this.speed = Game.random(1, 3);
        this.shootingSpeed = Game.random(50, 80);
        this.movingLeft = Math.random() < 0.5 ? true : false;
        this.color = "hsl("+ Game.random(0, 360) +", 60%, 50%)";
        
    };
    
    
    Enemy.prototype.draw = function(){
        var img=new Image();
        img.src="enemy.png";
        Game.ctx.drawImage(img,this.x, this.y, this.width, this.height);
        //Game.ctx.fillStyle = this.color;
        //Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    
    
    Enemy.prototype.update = function(){
        if(this.movingLeft){
            if(this.x > 0){
                this.x -= this.speed;
                this.y += this.vy;
            } else {
                this.movingLeft = false;
            }
        } else {
            if(this.x + this.width < Game.c.width){
                this.x += this.speed;
                this.y += this.vy;
            } else {
                this.movingLeft = true;
            }
        }
        if(Game.bombNow==1)this.die();
        for(var i in Game.bullets){
            var currentBullet = Game.bullets[i];
            if(Game.collision(currentBullet, this)){
                this.die();
                delete Game.bullets[i];
            }
        } 
    };
    
    Enemy.prototype.die = function(){
      this.explode();
      delete Game.enemies[this.index];
      Game.score += 15;
      Game.enemiesAlive = Game.enemiesAlive > 1 ? Game.enemiesAlive - 1 : 0;
      if(Game.bombNow==1){
          if(Game.enemiesAlive==0){
              Game.bombNow=0;
              for(var i = 0; i<Game.maxEnemies; i++){
              setTimeout(function(){
                 new Enemy();
             }, 2000);
             Game.enemiesAlive++;            
            }    
         }                 
        }
        if(Game.bombNow==0){
            if(Game.enemiesAlive < Game.maxEnemies){
                Game.enemiesAlive++;
                setTimeout(function(){
                    new Enemy();
                }, 2000);
            }
        }
      
    };
    
    Enemy.prototype.explode = function(){
        for(var i=0; i<Game.maxParticles; i++){
        new Particle(this.x + this.width/2, this.y, this.color);
      }
    };
    
    Enemy.prototype.shoot = function(){
        new EnemyBullet(this.x + this.width/2, this.y, this.color);
    };
    
    var EnemyBullet = function(x, y, color){
        this.width = 3;
        this.height = 8;
        this.x = x;
        this.y = y;
        this.vy = 2;
        this.color = color;
        this.index = Game.enemyBulletIndex;
        Game.enemyBullets[Game.enemyBulletIndex] = this;
        Game.enemyBulletIndex++;
    };
    
    EnemyBullet.prototype.draw = function(){
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    
    EnemyBullet.prototype.update = function(){
        this.y += this.vy;
        if(this.y > Game.c.height){
            delete Game.enemyBullets[this.index];
        }
    };
    
    
    
    //터지는 모션
    var Particle = function(x, y, color){
        this.x = x;
        this.y = y;
        this.vx = Game.random(-5, 5);
        this.vy = Game.random(-5, 5);
        this.color = color || "orange";
        Game.particles[Game.particleIndex] = this;
        this.id = Game.particleIndex;
        Game.particleIndex++;
        this.life = 0;
        this.gravity = .05;
        this.size = 40;
        this.maxlife = 100;
      }
    
      Particle.prototype.draw = function(){
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.size *= .89;
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.x, this.y, this.size, this.size);
        this.life++;
        if(this.life >= this.maxlife){
          delete Game.particles[this.id];
        }
      };
    
    Game.init();
    
    
    }(window));