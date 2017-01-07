function State() {
　　　　this.name = "";
		this.do_actions = function() {};
		this.check_conditions = function() {};
		this.entry_actions = function() {};
		this.exit_actions = function() {};
　　};

function StateMachine() {
	this.states = {};
	this.active_state = new State();
	this.add_state = function(state) {this.states[state.name] = state};
	this.set_state = function(new_state_name) {
		// if (this.active_state != null)
		// 	this.active_state.exit_actions();
		this.active_state = this.states[new_state_name];
        // this.active_state.entry_actions();
	}
	this.think = function() {
        if (this.active_state === null)
            return;
        this.active_state.do_actions();
        var new_state_name = this.active_state.check_conditions();
        if (new_state_name != null)
            this.set_state(new_state_name);
	}
}


// StateMachine.prototype.think = function() {
//         if (this.active_state === null)
//             return;
//         this.active_state.do_actions();
//         var new_state_name = this.active_state.check_conditions();
//         if (new_state_name != null)
//             this.set_state(new_state_name);
// 	}

// StateMachine.prototype.set_state = function(new_state_name) {
// 		if (this.active_state != null)
// 			this.active_state.exit_actions();
// 		this.active_state = this.states[new_state_name];
//         this.active_state.entry_actions();
// 	}

function Bgmap() {
    this.backpic = null;
	this.bitmap = null;
	this.map_distance = 500;
	this.bitmap_point_width = 16;
	this.bitmap_point_height = 32;
	this.now_bitmap_rowtop = 0;
	this.reset = function(mapname) {
		this.backpic = 'url(assets/maps/' + mapname +'.jpg)';
		this.bitmap = BITMAP[mapname];
		this.map_distance = this.bitmap.length * this.bitmap_point_height - SCREEN_HEIGHT;
		Crafty.background(this.backpic + '0px -' + this.map_distance.toString() + 'px');
	}
	this.move_by_player = function(player) {
		if (this.map_distance > 0) {
			this.map_distance -= player.now_speed;
			if (this.map_distance < 0 )
				this.map_distance = 0;
			Crafty("2D").each(function() {
				this.y += player.now_speed;
			});
			Crafty.background(this.backpic + '0px -' + this.map_distance.toString() + 'px');
			this.get_enemy();
		}
	}
	this.map_passive = function(x, y , w, h) {
		// 1 出地图外  2 和地图障碍碰撞 0 可通过
		var top = y;
		var left = x;
		var bottom = y + h - 1;
		var right = x + w - 1;
		if (left<0 ||top<0 || bottom>SCREEN_HEIGHT || right>SCREEN_WIDTH) {
			return 1;
		}
		point_x_range = [Math.floor(left / this.bitmap_point_width), Math.floor(right / this.bitmap_point_width)];
       	point_y_range = [Math.floor((top + this.map_distance) / this.bitmap_point_height), Math.floor((this.map_distance + bottom) / this.bitmap_point_height)];
       	for (var point_x=point_x_range[0]; point_x <= point_x_range[1]; point_x++) {
			for (var point_y=point_y_range[0]; point_y <= point_y_range[1]; point_y++) {
				if (this.bitmap[point_y][point_x] != 0)
					return 2;
			}
       	}
       	return 0;
	}

	this.get_enemy = function() {
		now_bitmap_rowtop = Math.floor(this.map_distance / this.bitmap_point_height);
		// if (now_bitmap_rowtop >= this.bitmap.length || now_bitmap_rowtop < 0)
		// 	return;
		for ( var left_bit_point=0; left_bit_point < this.bitmap[0].length; left_bit_point++)
			if (this.bitmap[now_bitmap_rowtop][left_bit_point] > 1) {
				var enemy_id = this.bitmap[now_bitmap_rowtop][left_bit_point];
				var enemy_left = left_bit_point * this.bitmap_point_width;
				this.bitmap[now_bitmap_rowtop][left_bit_point] = 0;
				 if (enemy_id == 6)
				 	AiTank([enemy_left, 0]);
			}
	}
}
bgmap = new Bgmap();

function Explod(name, model) {
	if (name == "" || typeof(name) == "undefined")
		return;
	var conf = CONF[name];
	var pictures = conf["imgs"];
	var name = name;
	var rects = conf["rects"];
	var frame_index = 0;
	var now_clock = 0;
	Crafty.sprite(pictures[0], {explod:[0,0,rects[0][0],rects[0][1]]});
	var explod = Crafty.e("2D, DOM, Image, explod");

	explod.attr({
		x: model.x - Math.floor((rects[0][0] - model.w) / 2),
		y: model.y - Math.floor((rects[0][1] - model.h) / 2),
		name: name,
		pictures: pictures,
		rects: rects,
		frame_index: frame_index,
		now_clock: 0,
	})
	// explod.attr({w: Crafty.viewport.width, h: Crafty.viewport.height})

	explod.bind('EnterFrame', function(){
		this.now_clock += 1;
		if (this.now_clock >= 15) {
			this.frame_index += 1;
			this.now_clock = 0;
			if (this.frame_index < this.pictures.length)
				this.image(this.pictures[this.frame_index]);
			else  
				this.destroy();
		}

   	});


	return explod;
}