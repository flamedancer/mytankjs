cur_stage = null;

function Stage_nothing(stage) {
	State.call();
	this.name = "nothing";
	this.stage = stage;
	this.do_actions = function() {};
	this.check_conditions = function() {
		return "move";
	};
}

function Stage_begin(stage) {
	State.call();
	this.name = "begin";	
	this.stage = stage;
	this.keeptime = 1;
    Crafty.background(this.stage.start_image);
	this.do_actions = function() { this.keeptime -= 1};
	this.check_conditions = function() {
        if (this.keeptime >= 0)
            return;
        else {
            this.stage.begin();
            return "servant";
        }
	};
}

function Stage_servant(stage) {
	State.call();
	this.name = "servant";	
	this.stage = stage;
	this.do_actions = function() { this.stage.servant()}
	this.check_conditions = function() {
        if (this.stage.servant_over)
            return "startboss";
        else if (this.stage.is_fail())
            return "fail";
	}
}

function Stage_startboss(stage) {
	State.call();
	this.name = "startboss";
	this.stage = stage;	
	this.do_actions = function() { this.stage.startboss()}
	this.check_conditions = function() {
		if (this.stage.startboss_over())
        	return "boss";
	}
}

function Stage_boss(stage) {
	State.call();
	this.name = "boss";
	this.stage = stage;	
	this.do_actions = function() { this.stage.boss()};
	this.check_conditions = function() {
        if (this.stage.is_fail())
            return "fail";
        else if (this.stage.is_win()) {
            return "win";
        }
        // if (this.stage.servant_over)
         //   return "startboss";
        // else if (this.stage.player == 'died')
        //     return "fail";
        return;
	};
}

function Stage_win(stage) {
	State.call();
	this.name = "win";
	this.stage = stage;	
    this.time_cnt = 400;
	this.do_actions = function() { this.time_cnt--; }
	this.check_conditions = function() {
        if (this.time_cnt <=0) {
            enter_stage("1");
        }
	};
}

function Stage_fail(stage) {
	State.call();
	this.name = "fail";
	this.stage = stage;	
    this.time_cnt = 400;
	this.do_actions = function() { this.time_cnt--; }
	this.check_conditions = function() {
        if (this.time_cnt <=0) {
            enter_stage("1");
        }
	}
}

function Stage() {
	var stage = Crafty.e();
	stage.mytank = null;
	stage.start_image = null;
	stage.stage_begin = false;
	stage.statu = null;
	stage.servant_over = false;
    stage.boss_img = "";
    stage.boss_both = false;
    stage.boss_animation_over = false;
	stage.brain = new StateMachine();
	stage.brain.add_state(new Stage_begin(stage));
	stage.brain.add_state(new Stage_servant(stage));
	stage.brain.add_state(new Stage_startboss(stage));
	stage.brain.add_state(new Stage_boss(stage));
	stage.brain.add_state(new Stage_win(stage));
	stage.brain.add_state(new Stage_fail(stage));
	stage.brain.set_state("begin");
	stage.attr({
		begin : function() {stage.stage_begin = true;},
		servant : function() {},
		process: function() {
			this.brain.think();
		    return this.statu;
		},
        is_fail: function() {
            if (Crafty("MyTank").length == 0)
                return true;
            return false;
        },
        is_win: function() {
            if (Crafty(this.boss_img).length == 0)
                return true;
            return false;
        },
	});
	stage.bind('EnterFrame', function(){
    	this.process();
    	// if (this.mytank != null)
    	// 	bgmap.move_by_player(this.mytank);
   	});
   	stage.brain.set_state("begin");
	return stage;

}

function Stage1() {
	var stage = Stage();
	stage.start_image = "assets/ai_icetank.gif";
    stage.boss_img = "Bossspider";
	stage.attr({
		begin : function() {
			if (this.stage_begin)
				return
			this.stage_begin = true;
			bgmap.reset('111');
			if (CONTROL)
			    both("MyTank", [88, 384]);
 		},
 		servant : function() {
 			this.servant_over = (bgmap.map_over && Crafty("ai").length == 0);
 		},
 		startboss: function() {
 			if (typeof(this.animation_bothof_boss) == "undefined" && 
 				!this.boss_both){
	        	// 出场动画
	        	this.animation_bothof_boss = Bossspider_both_Animation(160, -80);
	        	this.boss_animation_over = true;
	        }
   		},
   		boss: function() {
   			if (!(this.boss_both)) {
	   			this.boss_both = true;
	   			if (CONTROL)
	   				both(this.boss_img, [160, 30]);
			}
   		},
   		startboss_over: function() {
   			if (this.animation_bothof_boss.is_over)
 				return true;
 			return false;
   		}
	});
	return stage;
}


Crafty.defineScene("stage1", function(attributes) {
	cur_stage = Stage1();
	cur_stage.brain.set_state("begin");
    cur_stage.begin();
});

function enter_stage(stage_num) {
    BOTHS = {};
    player = null;
    if (cur_stage) 
        cur_stage.destroy();
    cur_stage = null;
	Crafty.enterScene("stage1");
}	
