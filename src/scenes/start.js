export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        //is.load.image('character', 'assets/char.png');
        this.load.image("player", "assets/character_assets/character_roundRed.png");
        this.load.image("landscape", "assets/platformer_tiles/Spritesheet/spritesheet_default.png");
            this.load.tilemapTiledJSON('tilemap', 'assets/platformer_tiles/drawn_tobattle_map..tmj');

        this.load.image("sword", "assets/characteritems/item_sword.png");

    }

    makeTilemap(x,y)
    {
        var background = undefined;
        x = x*45*64;
        y = y*15*64;
        
        background = this.add.tilemap('tilemap', 64, 64, 45, 15);
       
        var tileset = background.addTilesetImage("scribble_kingdom", "landscape");
        var bg = background.createLayer("Background", tileset, x, y);
        bg.setDepth(0);
        var layer = background.createLayer("Obstacle", tileset, x, y);
        layer.setCollisionBetween(1,1767);
        //this.physics.add.collider(layer, this.player);
        var paths = background.createLayer("Path", tileset, x, y);
        
        this.paths.add(paths);
        paths.setCollisionBetween(1,1767);
        this.physics.add.collider(paths, this.player);
        //this.physics.add.existing(paths);
        background.createLayer("Decoration", tileset, x, y);

        let objects = background.getObjectLayer("Collectibles");
        /*if (objects)
        {
            for (var obj of objects.objects)
            {
                if (obj.properties)
                {
                    if (obj.properties[0].name == "powerup")
                    {
                        let powerup = this.physics.add.staticSprite(x + obj.x + 16, y+obj.y-16, obj.properties[0].value);
                        powerup.powerup_type = obj.properties[0].value;
                        powerup.setDepth(10);
                        powerup.setScale(2);
                        this.powerups.add(powerup);
                    }
                }
            }
        }*/
    }

    create() {
        this.player = this.add.sprite(50, 740, 'player');
        this.player.setScale(0.65);
        this.player.setDepth(2);
        this.physics.add.existing(this.player);
        this.tilemaps = {};
        this.paths = this.add.group("paths");
        this.makeTilemap(0,0);
        this.powerups = this.add.group("powerup");


        //stats
        //this.player.hp = 100;
        //this.last_time = 0;

        //movement
        this.jump = this.input.keyboard.addKey("SPACE", false, true);
        this.left = this.input.keyboard.addKey("A", false, true);
        this.right = this.input.keyboard.addKey("D", false, true);
        this.dash = this.input.keyboard.addKey("K",false, true);


        //camera
        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setDeadzone(400, 200);

        //music

        
    }

    /*getTarget(name)
    {
        if (name == "player")
        {
            return this.player;
        }
        if (name == "random")
        {
            return {x: this.player.x + Math.random()*this.game.canvas.width, y: this.player.y + Math.random()*this.game.canvas.height - this.game.canvas.height/2};
        }
        if (name == "center")
        {
            return {x: this.player.x + this.game.canvas.width/4, y: this.player.y};
        }
    } */

    update(time) {
        let dt = (time - this.last_time)/1000;
        this.last_time = time;
        let attack = false;
        if (this.left.isDown){
            this.player.body.velocity.x = -200;     
        }else if(this.right.isDown){
            this.player.body.velocity.x = 200;
        }else{
            this.player.body.velocity.x = 0;
        }

        //jump

        if(this.jump.isDown && this.player.body.onFloor()){
            this.player.body.velocity.y = -200;
        }
        if(this.dash.isDown){
            if(this.left.isDown){
                this.player.body.velocity.x = -960;
                this.time.delayedCall(200, () => {
                    this.player.body.velocity.x = 0;
                });
            }else if(this.right.isDown){
                this.player.body.velocity.x = 960;
                this.time.delayedCall(200, () => {
                    this.player.body.velocity.x = 0;
                });
            }
        }

       /* if (this.player.last_attack + this.player.attack_speed < time)
        {
            this.player.last_attack = time;

            for (let i = 0; i < 4; i++)
            {
                let bullet = new Bullet(this, this.player.x, this.player.y, this.player.attack_angle + i*90, this.player.bullet_speed);
                this.player_bullets.add(bullet);
            }
            this.player.attack_angle += 45;
        }*/
       this.physics.world.overlap(this.player, this.powerups, (p,pu) => { 
                    pu.body.enable = false;
                    this.tweens.add({
                        targets: pu, 
                        scale: 0.2, 
                        duration: 300, 
                        onComplete: () => {
                                pu.destroy(true);}
                    });
                    this.applyPowerup(pu.powerup_type);});
    }

    /*/playerTakeDamage(bullet)
    {
        this.player.hp -= bullet.damage; 
        this.player.tint = 0xff0000;
        this.time.delayedCall(500, () => { this.player.tint = 0xffffff; }); 
        bullet.destroy(true); 
        this.checkEndGame();
    }

    checkEndGame()
    {
        if (this.player.hp <= 0)
        {
            this.scene.stop("Start");
            this.scene.start('GameOver');
        }
    }*/
   applyPowerup(type)
    {
        if (type == "heal")
        {
            this.player.hp = Math.min(this.player.hp + 10, 100);
        }
        if (type == "speed")
        {
            this.player.bonus_speed = 100;
            // extend duration
            this.player.bonus_speed_stacks++;
            this.time.delayedCall(10000, () => { 
                            this.player.bonus_speed_stacks--;
                            if (this.player.bonus_speed_stacks == 0)
                                 this.player.bonus_speed = 0;
                            });
        }
        if (type == "shield")
        {
            // extend duration + stack amount
            this.player.shield += 50;
            this.player.shield_stacks++;
            this.time.delayedCall(15000, () => {
                             this.player.shield_stacks--;
                             if (this.player.shield_stacks == 0)
                                 this.player.shield = 0;
                            });
        }
        if (type == "attackspeed")
        {
            // stack intensity
            this.player.attack_speed_bonus *= 0.25;
            this.time.delayedCall(5000, () => {this.player.attack_speed_bonus *= 4;});
        }

    }
}