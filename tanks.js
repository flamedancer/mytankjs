
function Tank(name, postion) {
	var conf = CONF[name];
	var picture = conf["img"];
	var name = name;
	var rect = conf["rect"];
	var speed = conf["speed"];
	var now_speed = speed;
	
	if (!(name in ENTITYS)) {
		var obj = {};
		obj[name] = [0,0,rect[0],rect[1]];
		// Crafty.sprite(picture, {name:[0,0,rect[0],rect[1]]});
		ENTITYS[name] = Crafty.sprite(picture, obj);
	}
	var tank = Crafty.e("2D, DOM, Collision");
	tank.addComponent("tank");
	tank.addComponent(name);
	tank.origin("center");
	tank.attr(conf);
	tank.attr({
		x: postion[0],
		y: postion[1],
		direct : [1, 0],
		now_speed: now_speed,
		name: name,
		shot: function() {
			if (!(this.bullet))
				return;
			var bullet = eval(this.bullet)(this);
			return bullet;
		},
		died: function() {
			Explod(this.died_name, this);
			destroy(this);
		},
		stop: function() {
			this.now_speed = 0;
		},
		turn: function(direct) {
			if (direct[0] == -1 && direct[1] == 0)
				this.rotation = -90;
			else if (direct[0] == 1 && direct[1] == 0)
				this.rotation = 90;
			else if (direct[0] == 0 && direct[1] == -1)
				this.rotation = 0;
			else if (direct[0] == 0 && direct[1] == 1)
				this.rotation = 180;
			this.direct = direct;
			this.now_speed = this.speed;
		}
	})
	if (tank["ai"] != false)
		tank.addComponent("ai");
	return tank;
}


function MyTank(postion) {
	
	var tank = Tank("MyTank", postion);
	tank.now_speed = 0;
	tank.directs = [];
	tank.direct = [0, -1];
	tank.direct_id = DIRECTION_U;
	tank.check_stop = function() {
	    if (this.directs.length <= 0) {
	   		stop(this);
   		}
   		else {
   			this.direct_id = this.directs[this.directs.length - 1];
   			turn(this, DIRECTIONS[this.direct_id]);
   		}

	}
	tank.bind('KeyDown', function(e) {
	    if(e.key == Crafty.keys.A) {
	      	var direct = [-1, 0];
	      	this.drect_id = DIRECTION_L;
	      	this.directs.push(this.drect_id);
	      	turn(this, direct);
	      	
	    } else if (e.key == Crafty.keys.D) {
	      	var direct = [1, 0];
	      	this.drect_id = DIRECTION_R;
	      	this.directs.push(this.drect_id);
	      	turn(this, direct);

	    } else if (e.key == Crafty.keys.W) {
	      	var direct = [0, -1];
	      	this.drect_id = DIRECTION_U;
	      	this.directs.push(this.drect_id);
	      	turn(this, direct);

	    } else if (e.key == Crafty.keys.S) {
	      	var direct = [0, 1];
	      	this.drect_id = DIRECTION_D;
	      	this.directs.push(this.drect_id);
	      	turn(this, direct);
	    } else if (e.key == Crafty.keys.J) {
			shot(this);
	    }
    }).bind('KeyUp', function(e) {
	    if(e.key == Crafty.keys.A) {
	      	this.directs.splice(this.directs.indexOf(DIRECTION_L), 1);  
	        this.check_stop();    	
	    } else if (e.key == Crafty.keys.D) {
	      	this.directs.splice(this.directs.indexOf(DIRECTION_R), 1);
	        this.check_stop();
	    } else if (e.key == Crafty.keys.W) {
	      	this.directs.splice(this.directs.indexOf(DIRECTION_U), 1);
	        this.check_stop();
	    } else if (e.key == Crafty.keys.S) {
	      	this.directs.splice(this.directs.indexOf(DIRECTION_D), 1);
	        this.check_stop();
	    }

    });
	tank.bind('EnterFrame', function(){
		if (this.y <= 340 && this.direct[1] < 0 && this.now_speed > 0) {
			bgmap.move_by_player(tank);
		}
    	x = this.x + this.direct[0] * this.now_speed;
    	y = this.y + this.direct[1] * this.now_speed;
    	if (bgmap.map_passive(x, y, this.w, this.h) == 0) {
    		this.x = x;
    		this.y = y;
    	}

   	});
   return tank;
}

function Tankstate_both(tank) {
	State.call();
	this.name = "both";
	this.mold = tank;
	this.do_actions = function() {this.mold.direct =  [0, -1]};
	this.check_conditions = function() {return "move"};
}

function Tankstate_move(tank) {
	State.call();
	this.name = "move";
	this.mold = tank;
	this.do_actions = function() {
		if (Math.random() <= this.mold.shot_rate)
			shot(this.mold);
	};
	this.check_conditions = function() {
    	if (bgmap.map_passive(this.mold.x, this.mold.y, this.mold.w, this.mold.h) > 0)
    		return this.mold.died();
    	x = this.mold.x + this.mold.direct[0] * this.mold.now_speed;
    	y = this.mold.y + this.mold.direct[1] * this.mold.now_speed;
    	if (bgmap.map_passive(x, y, this.mold.w, this.mold.h) > 0)
    		return "thinkdirect";
		if (Math.random() <= this.mold.turn_rate)
			return "thinkdirect";
    	this.mold.x = this.mold.x + this.mold.direct[0] * this.mold.now_speed;
    	this.mold.y = this.mold.y + this.mold.direct[1] * this.mold.now_speed;
		return "move";
	};
}

function Tankstate_thinkdirect(tank) {
	State.call();
	this.name = "thinkdirect";
	this.mold = tank;
	this.do_actions = function() {
		var random_direct_id = [DIRECTION_U, DIRECTION_D, DIRECTION_L, DIRECTION_R][Math.ceil(Math.random()*4) - 1];
		turn(this.mold, DIRECTIONS[random_direct_id]);
	};
	this.check_conditions = function() {return "move"};
}

function Tankstate_thinkdirect_bytarget(tank) {
	State.call();
	this.name = "thinkdirect";
	this.mold = tank;
	this.do_actions = function() {
        var target_pos = [this.mold.target.x, this.mold.target.y];
        var self_pos = [this.mold.x, this.mold.y];
        var path = [target_pos[0] - self_pos[0], target_pos[1] - self_pos[1]];
        if (Math.abs(path[0]) > Math.abs(path[1])) {
            var direct1 = [path[0] > 0 ? 1 : -1, 0];
            var direct2 = [0, path[1] > 0  ? 1 : -1];
        }
        else {
            var direct2 = [path[0] > 0 ? 1 : -1, 0];
            var direct1 = [0, path[1] > 0  ? 1 : -1];
        }
        var directs = [direct1, direct2];
        var first_chose = Math.random() > 0.5 ? 0 : 1;
    	x = this.mold.x + direct1[0] * this.mold.now_speed;
    	y = this.mold.y + direct1[1] * this.mold.now_speed;
    	if (bgmap.map_passive(x, y, this.mold.w, this.mold.h) > 0)
    		var direct = directs[first_chose];
    	else
        	var direct = directs[1 - first_chose];
        turn(this.model, direct);
	};
	this.check_conditions = function() {
		return "move"
	};
}

// function Tankstate_turn(tank, norotate) { 
// 	State.call();
// 	this.name = "turn";
// 	this.mold = tank;
// 	this.do_actions = function() {
// 		if (!(norotate)) {

// 		}
// 	};
// 	this.check_conditions = function() {return "move"};
// }

function Tankstate_died(tank) {
	State.call();
	this.name = "died";
	this.mold = tank;
	this.do_actions = function() {};
	this.check_conditions = function() {return "died"};
}

function AiTank(postion) {
	var tank = Tank("AiTank", postion);
	tank.shoting = 0;
	tank.brain = new StateMachine();
	tank.brain.add_state(new Tankstate_both(tank));
	tank.brain.add_state(new Tankstate_move(tank));
	// tank.brain.add_state(new Tankstate_turn(tank));
	tank.brain.add_state(new Tankstate_thinkdirect(tank));
	tank.brain.add_state(new Tankstate_died(tank));
	tank.both = null;
    tank.brain.set_state("both");
    tank.bind('EnterFrame', function(){
		tank.brain.think();
		
   	});
   	return tank;
}


function Bossspider(postion) {
	var tank = Tank("Bossspider", postion);
	tank.shoting = 0;
	tank.brain = new StateMachine();
	tank.brain.add_state(new Tankstate_both(tank));
	tank.brain.add_state(new Tankstate_move(tank));
	tank.brain.add_state(new Tankstate_turn(tank, true));
	tank.brain.add_state(new Tankstate_thinkdirect(tank));
	tank.brain.add_state(new Tankstate_died(tank));
	tank.both = null;
    tank.brain.set_state("both");
    tank.shot = function() {
        var pos = [this.x + Math.floor(this.w/2), this.y];
        Terrorsmallspider(pos);
    }
    tank.bind('EnterFrame', function(){
		tank.brain.think();
   	});
   	return tank;
}


function Terrorsmallspider(postion) {
	var tank = Tank("Terrorsmallspider", postion);
	tank.target = Crafty("mytank").get(0);
	tank.shoting = 0;
	tank.brain = new StateMachine();
	tank.brain.add_state(new Tankstate_both(tank));
	tank.brain.add_state(new Tankstate_move(tank));
	// tank.brain.add_state(new Tankstate_turn(tank));
	tank.brain.add_state(new Tankstate_thinkdirect_bytarget(tank));
	tank.brain.add_state(new Tankstate_died(tank));
	tank.both = null;
    tank.brain.set_state("both");
    tank.bind('EnterFrame', function(){
		tank.brain.think();		
   	});
   	return tank;
}