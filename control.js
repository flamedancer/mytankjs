GAME_MODEL = 2;   // 0 单机 1双人 2 联网主机  3 联网辅机


function both(tank_name, pos) {
	switch (GAME_MODEL) {
		case 0:
		case 1:
			var tank = eval(tank_name);
			tank(pos);
			break;
		case 2:
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


function destroy(tank) {
	switch (GAME_MODEL) {
		case 0:
		case 1:
			tank.destroy();
			break;
		case 2:
			send_destroy(tank);
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

function start_game() {
	if (GAME_MODEL <= 2)
		enter_stage("1");
}