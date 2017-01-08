
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
			eval(this.bullet + "(this)"); 
		},
		died: function() {
			Explod(this.died_name, this);
			this.destroy();
		}
	})
	if (tank["ai"] != false)
		tank.addComponent("ai");
	return tank;
}


function MyTank(postion) {
	
	var tank = Tank("mytank", postion);
	tank.now_speed = 0;
	tank.directs = [];
	tank.direct = [0, -1];
	tank.direct_id = DIRECTION_U;
	tank.bind('KeyDown', function(e) {
	    if(e.key == Crafty.keys.A) {
	      	this.direct = [-1, 0];
	      	this.directs.push(DIRECTION_L);
	      	this.direct_id = DIRECTION_L;
	      	this.rotation = -90;
	      	this.now_speed = this.speed;
	    } else if (e.key == Crafty.keys.D) {
	      	this.direct = [1, 0];
	      	this.directs.push(DIRECTION_R);
	      	this.direct_id = DIRECTION_R;
	      	this.rotation = 90;
	      	this.now_speed = this.speed;
	    } else if (e.key == Crafty.keys.W) {
	      	this.direct = [0, -1];
	      	this.directs.push(DIRECTION_U);
	      	this.direct_id = DIRECTION_U;
	     	this.rotation = 0;
	     	this.now_speed = this.speed;
	    } else if (e.key == Crafty.keys.S) {
	      	this.direct = [0, 1];
	      	this.directs.push(DIRECTION_D);
	      	this.direct_id = DIRECTION_D;
	      	this.rotation = 180;
	      	this.now_speed = this.speed;
	    } else if (e.key == Crafty.keys.J) {
			this.shot();
	    }
    }).bind('KeyUp', function(e) {
	    if(e.key == Crafty.keys.A) {
	      	this.directs.splice(this.directs.indexOf(DIRECTION_L), 1);      	
	    } else if (e.key == Crafty.keys.D) {
	      	this.directs.splice(this.directs.indexOf(DIRECTION_R), 1);
	    } else if (e.key == Crafty.keys.W) {
	      	this.directs.splice(this.directs.indexOf(DIRECTION_U), 1);
	    } else if (e.key == Crafty.keys.S) {
	      	this.directs.splice(this.directs.indexOf(DIRECTION_D), 1);
	    }
	    if (this.directs.length <= 0) {
	   		this.now_speed = 0;
   		}
   		else {
   			this.direct_id = this.directs[this.directs.length - 1];
   			this.direct = DIRECTIONS[this.direct_id];
   			this.rotation = 90 * this.direct_id;
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
			this.mold.shot();
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
		this.mold.direct = DIRECTIONS[random_direct_id];

	};
	this.check_conditions = function() {return "turn"};
}

function Tankstate_turn(tank, norotate) { 
	State.call();
	this.name = "turn";
	this.mold = tank;
	this.do_actions = function() {
		if (!(norotate)) {
			if (this.mold.direct[0] == -1 && this.mold.direct[1] == 0)
				this.mold.rotation = -90;
			else if (this.mold.direct[0] == 1 && this.mold.direct[1] == 0)
				this.mold.rotation = 90;
			else if (this.mold.direct[0] == 0 && this.mold.direct[1] == -1)
				this.mold.rotation = 0;
			else if (this.mold.direct[0] == 0 && this.mold.direct[1] == 1)
				this.mold.rotation = 180;
		}
	};
	this.check_conditions = function() {return "move"};
}

function Tankstate_died(tank) {
	State.call();
	this.name = "died";
	this.mold = tank;
	this.do_actions = function() {};
	this.check_conditions = function() {return "died"};
}

function AiTank(postion) {
	var tank = Tank("aitank", postion);
	tank.shoting = 0;
	tank.brain = new StateMachine();
	tank.brain.add_state(new Tankstate_both(tank));
	tank.brain.add_state(new Tankstate_move(tank));
	tank.brain.add_state(new Tankstate_turn(tank));
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
	var tank = Tank("bossspider", postion);
	tank.shoting = 0;
	tank.brain = new StateMachine();
	tank.brain.add_state(new Tankstate_both(tank));
	tank.brain.add_state(new Tankstate_move(tank));
	tank.brain.add_state(new Tankstate_turn(tank, true));
	tank.brain.add_state(new Tankstate_thinkdirect(tank));
	tank.brain.add_state(new Tankstate_died(tank));
	tank.both = null;
    tank.brain.set_state("both");
    tank.bind('EnterFrame', function(){
		tank.brain.think();

		
   	});
   	return tank;
}