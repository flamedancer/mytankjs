GAME_MODEL = 2;   // 0 单机 1双人 2 联网
player = null;
CONTROL = true; // 控制权
SID_FLAG = 1;  // sid 符号位
ROOM_INDEX = null;

start_time = 0;

function both(tank_name, pos) {
	switch (GAME_MODEL) {
		case 0:
		case 1:
			var tank = eval(tank_name);
			tank(pos);
			break;
		case 2:
		case 3:
			send_tank_both(tank_name, pos);
			break;
	}
}

function turn(tank, direct) {
	switch (GAME_MODEL) {
		case 0:
		case 1:
			tank.turn(direct);
			break;
		case 2:
			send_turn(tank, direct);
			break;
	}
}

function shot(tank) {
	switch (GAME_MODEL) {
		case 0:
		case 1:
			tank.shot();
			break;
		case 2:
			send_shot(tank);
			break;
	}
}


function died(tank) {
	switch (GAME_MODEL) {
		case 0:
		case 1:
			tank.died();
			break;
		case 2:
			send_died(tank);
			break;
	}
}

function stop(tank) {
	switch (GAME_MODEL) {
		case 0:
		case 1:
			tank.stop();
			break;
		case 2:
			send_stop(tank);
			break;
	}
}

function start_game(game_model, room_id) {
    var now = (new Date()).getTime(); // 毫秒
    if ((now -start_time) <= 3000)
        return
    GAME_MODEL = game_model;
	if (GAME_MODEL <= 1) {
        if (ROOM_INDEX != null) {
            send_leave_room();
        }
        ROOM_INDEX = null;
        CONTROL = true;
		enter_stage(1);
        show_self_room();
    }
    else
        start(room_id);
    start_time = now;
}
