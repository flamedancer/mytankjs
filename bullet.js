
function Bulletstate_move(bullet) {
    State.call();
    this.name = "move";
    this.mold = bullet;

    this.do_actions = function() {
        x = this.mold.x + this.mold.direct[0] * this.mold.now_speed;
        y = this.mold.y + this.mold.direct[1] * this.mold.now_speed;
        this.mold.x = this.mold.x + this.mold.direct[0] * this.mold.now_speed;
        this.mold.y = this.mold.y + this.mold.direct[1] * this.mold.now_speed;
        return "move";
    };
    this.check_conditions = function() {
        x = this.mold.x + this.mold.direct[0] * this.mold.now_speed;
        y = this.mold.y + this.mold.direct[1] * this.mold.now_speed;
        map_status = bgmap.map_passive(x, y, this.mold.w, this.mold.h);
        if ( map_status == 1)
            this.mold.destroy();
        else if ( map_status == 2)
            return "died";
        return "move";

    };
}

function Bulletstate_died(bullet) {
    State.call();
    this.name = "died";
    this.mold = bullet;
    this.do_actions = function() {this.mold.died()};
    this.check_conditions = function() {};
}


function Bulletstate_bounce_move(bullet) {
    State.call();
    this.name = "move";
    this.mold = bullet;

    this.do_actions = function() {
        x = this.mold.x + this.mold.direct[0] * this.mold.now_speed;
        y = this.mold.y + this.mold.direct[1] * this.mold.now_speed;
        this.mold.x = this.mold.x + this.mold.direct[0] * this.mold.now_speed;
        this.mold.y = this.mold.y + this.mold.direct[1] * this.mold.now_speed;
        return "move";
    };
    this.check_conditions = function() {
        x = this.mold.x + this.mold.direct[0] * this.mold.now_speed;
        y = this.mold.y + this.mold.direct[1] * this.mold.now_speed;
        map_status = bgmap.map_passive(x, y, this.mold.w, this.mold.h);
        if ( map_status == 1 || map_status == 2) {
        	this.mold.bounce_cnt = this.mold.bounce_cnt - 1;
        	if (this.mold.bounce_cnt <= 0)
            	this.mold.destroy();
            else {
            	var all_directs = [ [-this.mold.direct[0], this.mold.direct[1]], [this.mold.direct[0], -this.mold.direct[1]], [-this.mold.direct[0], -this.mold.direct[1]] ];
            	for (var direct_index in all_directs) {
            		var direct = all_directs[direct_index];
            		var x = this.mold.x + direct[0] * this.mold.now_speed;
            		var y = this.mold.y + direct[1] * this.mold.now_speed;
            		var map_status = bgmap.map_passive(x, y, this.mold.w, this.mold.h);
            		if ( map_status == 0) {
            			this.mold.direct = direct;
            			return "move";
            		}
            	}
            	// 没有合适的方向
            	this.mold.destroy();
            }
    	}
        return "move";

    };
}

function Bullet(name, owner) {
    var conf = CONF[name];
    var picture = conf["icon"];
    var name = name;
    var rect = conf["rect"];
    var speed = Array.isArray(conf["speed"]) ? range_choice(conf["speed"]): conf["speed"];
    var now_speed = speed;
    if (!(name in ENTITYS)) {
        var obj = {};
        obj[name] = [0,0,rect[0],rect[1]];
        // Crafty.sprite(picture, {name:[0,0,rect[0],rect[1]]});
        ENTITYS[name] = Crafty.sprite(picture, obj);
    }
    // Crafty.sprite(picture, {bullet :[0,0,rect[0],rect[1]]});

    var bullet = Crafty.e("2D, DOM, Collision");
    bullet.addComponent("bullet");
    bullet.addComponent(name);
    var postion = [owner.x + 0.5*((1+owner.direct[0])*owner.rect[0] + (owner.direct[0]-1)*rect[0]), owner.y + 0.5*((1+owner.direct[1])*owner.rect[1] + (owner.direct[1]-1)*rect[1])];
    bullet.attr(conf);
    bullet.origin("center");
    bullet.attr({
        x: postion[0],
        y: postion[1],
        speed: speed,
        direct : owner.direct,
        rotation: owner.rotation,
        name: name,
        now_speed: now_speed,
        owner: owner,
        wounded: function(value) {
            this.died();
        },
        died: function() {
            Explod(this.died_name, this);
            this.destroy();
        }
    })
    

    bullet.bind('EnterFrame', function(){
        bullet.brain.think();        
       });
    set_collision(bullet);
    return bullet;
}


function set_default_brain(bullet) {
    bullet.brain = new StateMachine();
    bullet.brain.add_state(new Bulletstate_move(bullet));
    bullet.brain.add_state(new Bulletstate_died(bullet));
    bullet.brain.set_state("move");
}

function NormalBullet(owner) {
    var bullet = Bullet(owner.bullet, owner);
    set_default_brain(bullet);
    return bullet;
}

function AiBullet(owner) {
    var bullet = Bullet(owner.bullet, owner);
    set_default_brain(bullet);
    return bullet;
}

function IceBullet(owner) {
    var bullet = Bullet(owner.bullet, owner);
    set_default_brain(bullet);
    bullet.died = function() {
         this.destroy();
    }
    return bullet;
}

function BounceBullet(owner) {
	var bullet = Bullet(owner.bullet, owner);
	bullet.brain = new StateMachine();
    bullet.brain.add_state(new Bulletstate_bounce_move(bullet));
    bullet.brain.add_state(new Bulletstate_died(bullet));
    bullet.brain.set_state("move");
    return bullet;
}