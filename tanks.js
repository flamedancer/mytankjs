
function Tank(name, postion) {
	var conf = CONF[name];
	var name = name;
	var rect = conf["rect"];
	var speed = Array.isArray(conf["speed"]) ? range_choice(conf["speed"]): conf["speed"];
	var hp = conf["maxhealth"];
	var now_speed = speed;
	
    set_sprite(name);
	var tank = Crafty.e("2D, DOM, Collision, Image");
	tank.addComponent("tank");
	tank.addComponent(name);
	tank.origin("center");
	tank.attr(conf);
	tank.attr({
		x: postion[0],
		y: postion[1],
		direct : [1, 0],
		speed: speed,
		now_speed: now_speed,
		hp: hp,
		name: name,
        movable: true,
		shot: function() {
            if (!this.movable)
                return;
			if (!(this.bullet))
				return;
			var bullet = eval(this.bullet)(this);
			return bullet;
		},
		wounded: function(value) {
			this.hp -= value;
			if (this.hp <= 0)
				died(this);
		},
		died: function() {
			Explod(this.died_name, this);
			this.destroy();
		},
		stop: function() {
			this.now_speed = 0;
		},
		turn: function(direct) {
            if (!this.movable)
                return;
            // 两种转向策略；每种方向一个图片 或者转动一个图片
            // .image("myimage.png")
            if (typeof conf["icon"] === "object") {
            	var direct_index = DIRECTIONS.findIndex(function (item) {
            		return item[0] == direct[0] && item[1] == direct[1];
            	});
            	this.image(conf["icon"][direct_index]);

            }
            else {
				if (direct[0] == -1 && direct[1] == 0)
					this.rotation = -90;
				else if (direct[0] == 1 && direct[1] == 0)
					this.rotation = 90;
				else if (direct[0] == 0 && direct[1] == -1)
					this.rotation = 0;
				else if (direct[0] == 0 && direct[1] == 1)
					this.rotation = 180;
				else if (direct[0] == -1 && direct[1] == 1)
					this.rotation = -45;
				else if (direct[0] == 1 && direct[1] == 1)
					this.rotation = 45;
				else if (direct[0] == 1 && direct[1] == -1)
					this.rotation = 135;
				else if (direct[0] == -1 && direct[1] == 1)
					this.rotation = -135;
			}
			this.direct = direct;
			this.now_speed = this.speed;
		}
	})
	if (tank["ai"] != false)
		tank.addComponent("ai");
	set_collision(tank);
	return tank;
}


function MyTank(postion) {
	
	var tank = Tank("MyTank", postion);
	tank.addComponent("Mouse");
	tank.shot_interval = 12;
	tank.now_shot_interval = tank.shot_interval;
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
	if ((CONTROL && (!player)) || (!CONTROL && player)) {
		tank.bind('KeyDown', function(e) {
		    if(e.key == Crafty.keys.A) {
		      	var direct = [-1, 0];
		      	this.drect_id = DIRECTION_L;
		      	var before_index = this.directs.indexOf(this.drect_id);
		      	this.directs.push(this.drect_id);
		      	if (before_index >= 0)
	      			this.directs.splice(before_index, 1);
		      	
		      	turn(this, direct);
		      	
		    } else if (e.key == Crafty.keys.D) {
		      	var direct = [1, 0];
		      	this.drect_id = DIRECTION_R;
		      	var before_index = this.directs.indexOf(this.drect_id);
		      	this.directs.push(this.drect_id);
		      	if (before_index >= 0)
	      			this.directs.splice(before_index, 1);
		      	
		      	turn(this, direct);

		    } else if (e.key == Crafty.keys.W) {
		      	var direct = [0, -1];
		      	this.drect_id = DIRECTION_U;
		      	var before_index = this.directs.indexOf(this.drect_id);
		      	this.directs.push(this.drect_id);
		      	if (before_index >= 0)
	      			this.directs.splice(before_index, 1);
		      	
		      	turn(this, direct);

		    } else if (e.key == Crafty.keys.S) {
		      	var direct = [0, 1];
		      	this.drect_id = DIRECTION_D;
		      	var before_index = this.directs.indexOf(this.drect_id);
		      	this.directs.push(this.drect_id);
		      	if (before_index >= 0)
	      			this.directs.splice(before_index, 1);
		      	
		      	turn(this, direct);
		    } else if (e.key == Crafty.keys.J) {
		    	if (this.now_shot_interval <= 0) {
		    		shot(this);
		    		this.now_shot_interval = this.shot_interval;
		    	}

				
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
	}

	if (!(CONTROL && player))
		player = tank;
	tank.bind('EnterFrame', function(){
		if (this.y <= 340 && this.direct[1] < 0 && this.now_speed > 0) {
			bgmap.move_by_player(tank);
		}
		var old_x = this.x;
		var old_y = this.y;
    	this.x = this.x + this.direct[0] * this.now_speed;
    	this.y = this.y + this.direct[1] * this.now_speed
    	if (bgmap.map_passive(this.x, this.y, this.w, this.h)>0) {
    		this.x = old_x;
    		this.y = old_y;
    	}

    	this.now_shot_interval--;

   	});
   cur_stage.mytank_both = true;
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
		if (CONTROL) {
			if (Math.random() <= this.mold.shot_rate)
				shot(this.mold);
		}
	};
	this.check_conditions = function() {

		if (CONTROL) {
			if (bgmap.map_passive(this.mold.x, this.mold.y, this.mold.w, this.mold.h) > 0) {
	    		this.mold.died();
                return;
            }
	    	x = this.mold.x + this.mold.direct[0] * this.mold.now_speed;
	    	y = this.mold.y + this.mold.direct[1] * this.mold.now_speed;
	    	if (bgmap.map_passive(x, y, this.mold.w, this.mold.h) > 0)
	    		return "thinkdirect";
			if (Math.random() <= this.mold.turn_rate)
				return "thinkdirect";
	    	this.mold.x = this.mold.x + this.mold.direct[0] * this.mold.now_speed;
	    	this.mold.y = this.mold.y + this.mold.direct[1] * this.mold.now_speed;
			return "move";
		}
		else {
	    	x = this.mold.x + this.mold.direct[0] * this.mold.now_speed;
	    	y = this.mold.y + this.mold.direct[1] * this.mold.now_speed;
	    	if (bgmap.map_passive(x, y, this.mold.w, this.mold.h) == 0) {
		    	this.mold.x = this.mold.x + this.mold.direct[0] * this.mold.now_speed;
	    		this.mold.y = this.mold.y + this.mold.direct[1] * this.mold.now_speed;
	    	}

		}
	};
}

function Tankstate_thinkdirect(tank) {
	State.call();
	this.name = "thinkdirect";
	this.mold = tank;
	this.do_actions = function() {
		this.mold.stop();
		if (typeof this.mold.icon === "object") {
			var direct_cnt = this.mold.icon.length;
		}
		else
			var direct_cnt = 4;
		var random_direct_id = Math.floor(Math.random()*direct_cnt);
		turn(this.mold, DIRECTIONS[random_direct_id]);
	};
	this.check_conditions = function() {return "move"};
}

function Tankstate_thinkdirect_bytarget(tank) {
	State.call();
	this.name = "thinkdirect";
	this.mold = tank;
	this.do_actions = function() {
		if (CONTROL && this.mold.target) {
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
	        turn(this.mold, direct);
        }
		else {
	    	x = this.mold.x + this.mold.direct[0] * this.mold.now_speed;
	    	y = this.mold.y + this.mold.direct[1] * this.mold.now_speed;
	    //	if (bgmap.map_passive(x, y, this.mold.w, this.mold.h) == 0) {
		    	this.mold.x = this.mold.x + this.mold.direct[0] * this.mold.now_speed;
	    		this.mold.y = this.mold.y + this.mold.direct[1] * this.mold.now_speed;
//	    	}

		}
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

function AiTank(postion, tank_name) {
    tank_name = tank_name || "AiTank";
	var tank = Tank(tank_name, postion);
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
   	// set_collision(tank);
   	return tank;
}

function IceTank(postion) {
    return AiTank(postion, "IceTank");
}


function Bossspider(postion) {
	var tank = Tank("Bossspider", postion);
	tank.shoting = 0;
	tank.brain = new StateMachine();
	tank.brain.add_state(new Tankstate_both(tank));
	tank.brain.add_state(new Tankstate_move(tank));
	// tank.brain.add_state(new Tankstate_turn(tank, true));
	tank.brain.add_state(new Tankstate_thinkdirect(tank));
	tank.brain.add_state(new Tankstate_died(tank));
	tank.both = null;
    tank.brain.set_state("both");
    tank.shot = function() {
        var pos = [this.x + Math.floor(this.w/2), this.y];
        return Terrorsmallspider(pos);
    }
    tank.turn = function(direct) {
		this.direct = direct;
		this.now_speed = this.speed;
	}
    tank.bind('EnterFrame', function(){
		tank.brain.think();
   	});
    // 设置 stage 标记
    cur_stage.boss_both = true;
   	set_hpbar(tank.tp, tank.maxhealth);
    tank.wounded = function(value) {
		this.hp -= value;
		if (this.hp <= 0) {
			died(this);
			this.hp = 0;
		}
		set_hpbar(this.tp, this.maxhealth);
	}
   	return tank;
}


function Terrorsmallspider(postion) {
	var tank = Tank("Terrorsmallspider", postion);
	tank.target = Crafty("MyTank").get(0);
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


function Bossbouncer(postion) {
	var tank = Tank("Bossbouncer", postion);
	tank.shoting = 0;
	tank.brain = new StateMachine();
	tank.brain.add_state(new Tankstate_both(tank));
	tank.brain.add_state(new Tankstate_move(tank));
	// tank.brain.add_state(new Tankstate_turn(tank, true));
	tank.brain.add_state(new Tankstate_thinkdirect(tank));
	tank.brain.add_state(new Tankstate_died(tank));
	tank.both = null;
    tank.brain.set_state("both");
    // tank.shot = function() {
    //     var pos = [this.x + Math.floor(this.w/2), this.y];
    //     return Terrorsmallspider(pos);
    // }
 //    tank.turn = function(direct) {
	// 	this.direct = direct;
	// 	this.now_speed = this.speed;
	// }
    tank.bind('EnterFrame', function(){
		tank.brain.think();
   	});
    // 设置 stage 标记
    cur_stage.boss_both = true;
   	set_hpbar(tank.tp, tank.maxhealth);
    tank.wounded = function(value) {
		this.hp -= value;
		if (this.hp <= 0) {
			died(this);
			this.hp = 0;
		}
		set_hpbar(this.tp, this.maxhealth);
	}
   	return tank;
}