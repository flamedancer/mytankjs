 // s start   b both   t turn   sh shot   d destroy   st stop
 // req_init  要求返回当前所有entity信息,并暂停游戏 partner_ready 同伴准备好了继续游戏
 // control 获得控制权
id_seq = 1000;
BOTHS = {};
s = null;
D = new Date();

init_s();
setInterval(s_ping, 5000);
function get_id() {
	id_seq += 1;
	return id_seq * SID_FLAG;
}

function start(room_id) {
    if (!s || s.readyState != 1) {
        init_s();
    } 
    send_start(room_id);  // begin  command
}
// var s = new WebSocket("ws://192.168.1.110:9091/");



function init_s() {
    //s = new WebSocket("ws://127.0.0.1:9091/");
    s = new WebSocket("ws://flamedancer.online:9091/");
    s.onopen = function() {
       s_ping(); 
    };
    s.onclose = function() {
        send_leave_room();
    };
    
    s.onmessage = function(e) {
        if (e.data == "pong") {
            var now_D = new Date();
            var ping_value = now_D.getTime() - D.getTime()
            report_ping(ping_value);
            show_self_ping(ping_value);
            return;
        }
    
        var obj = eval("(" + e.data + ")");
        var cmd = obj.c;
        switch (cmd) {
            case "set_rooms":
                add_rooms(obj["room_infs"]);
                break;
            case "reset_room":
                reset_room(obj["room_index"], obj["type"], obj["value"]);
                break;
        	case "s":
        		recv_start(obj["is_control"], obj["room_index"]);
        		break;
    	    case "b":
    	    	recv_tank_both(obj["name"], obj["pos"], obj["rotation"], obj["sid"]);
    	    	break;
    	    case "t":
    	    	recv_turn(obj["sid"], obj["direct"], obj["info"]);
    	    	break;
    	    case "sh":
    	    	recv_shot(obj["m_sid"], obj["sid"]);
    	    	break;
    	    case "d":
    	    	recv_died(obj["sid"]);
    	    	break;
    	    case "st":
    	    	recv_stop(obj["sid"], obj["map_distance"], obj["info"]);
    	    	break;
    	    case "req_init":
    	    	send_init();
                player.directs = [];
                player.stop();
    	    	Crafty.pause();
    	    	break;
    	    case "partner_ready":
    	    	recv_partner_ready();
        		Crafty.pause();
    	    	break;
    	    case "rsp_init":
    	    	rsp_init(obj['stage_num'], obj['stage_info'], obj['map_distance'], obj['entities'], obj['player_pos'], obj['partner_id_flag']);
    	    	Crafty.pause();
    	    	send_partner_ready();
    	    	break;
            case "control":
                get_control();
                break;
    	}	
    }
}



function get_entity_info(model) {
    var info = {
    	x: model.x,
    	y: model.y,
    	d: model.direct,
    	r:  model.rotation,
    }
    return info;
}

function set_entity_info(model, info) {
	model.attr(
		{
			x: info["x"],
			y: info["y"],
			direct: info["d"],
			rotation: info["r"],
		}
	)
	// model.x = info["x"];
	// model.y = info["y"];
	// model.direct = info["d"];
	// model.rotation = info["r"];
}


function send(obj) {
	var msg = JSON.stringify(obj);
   if (s && s.readyState == 1) {
	    s.send(msg); 
    }
}

function s_ping() {
    D = new Date();
   if (s && s.readyState == 1) {
        s.send("ping");
    }
}

function report_ping(ping_value) {
    var json = {
        c: 'ping',
        ping: ping_value,
    }
    send(json);
}

function send_leave_room() {
	var json = {
		c: 'end',
	}
	send(json);
}

function send_start(room_id) {
	var json = {
		c: 's',
        room_id: room_id,
	}
	send(json);
}

function recv_start(is_control, room_index) {
    CONTROL = is_control;
    ROOM_INDEX = room_index;
    show_self_room(room_index);
	if (CONTROL) {
        enter_stage("1");
    }
	else {
        req_init();	
    }
}

function req_init() {
	var json = {
		c: 'req_init',
	}
	send(json);
}

function send_init() {
	var entities = {};
	var type = '';
	for (var entity_mid in BOTHS) {
		var entity = BOTHS[entity_mid];
		if (entity.has('tank'))
			type = 'tank';
		else if (entity.has('bullet'))
			type = 'bullet';
		entities[entity_mid] = {
			pos: [entity.x, entity.y],
			direct: entity.direct,
			name: entity.name,
			type: type,
			rotation: entity.rotation,
		}
		if (type == 'bullet')
			entities[entity_mid]['m_sid'] = entity.owner.sid;
	}
	var stage_info = {

	}
	var json = {
		c: 'rsp_init',
		entities: entities,
		map_distance: bgmap.map_distance,
		stage_num: '1',
		stage_info: stage_info,
		player_pos: [player.x, player.y],
        partner_id_flag: SID_FLAG * -1,
	}
	send(json);
}

function rsp_init(stage_num, stage_info, map_distance, entities, player_pos, id_flag) {
	enter_stage(stage_num);
	// cur_stage.attr(stage_info);
	bgmap.map_distance = map_distance;
	bgmap.fresh_bg();

	for(var entity_mid in entities) {
		var info = entities[entity_mid];
		if (info['type'] == 'tank') {
			recv_tank_both(info['name'], info['pos'], info['rotation'], entity_mid);
		}
	}

	for(var entity_mid in entities) {
		var info = entities[entity_mid];
		if (info['type'] == 'bullet') {
			recv_shot(info['m_sid'], info['sid']);
			BOTHS[info['sid']].attr(
				{
					x: info['pos'][0],
					y: info['pos'][1],
					direct: info['direct'],
					rotation: info['rotation'],
				}
			);
		}
	}
    SID_FLAG = id_flag;
	both("MyTank", player_pos);
}


function send_partner_ready() {
	var json = {
		c: 'partner_ready',
	}
	send(json);
}

function recv_partner_ready() {

}



function send_tank_both(tank_name, pos, rotation) {
	var rotation = rotation || 0;
	var json = {
		c: 'b',
		type: 't',
		name: tank_name,
		pos: pos,
		sid: get_id(),
		rotation: rotation,
	}
	send(json);
}

function recv_tank_both(tank_name, pos, rotation, sid) {
    if (sid in BOTHS)
        return
	var tank = eval(tank_name)(pos);
	tank.rotation = rotation;
	BOTHS[sid] = tank;
	tank.sid = sid;
}

function send_turn(tank, direct) {
    tank.turn(direct);
	var json = {
		c: 't',
		info: get_entity_info(tank),
		sid: tank.sid,
		direct: direct,
	}
	send(json);
}

function recv_turn(sid, direct, info) {
	if (!(sid in BOTHS))
		return
    var model = BOTHS[sid];
    if (model) {
    	set_entity_info(model, info);
    	model.turn(direct);
    }
}

function send_shot(tank) {
	var json = {
		c: 'sh',
		m_sid: tank.sid,
		sid: get_id(),
	}
	send(json);
}

function recv_shot(m_sid, sid) {
	if (!(m_sid in BOTHS))
		return
	var owner = BOTHS[m_sid];
	if (!(owner.bullet))
		return;
	var bullet = owner.shot();
	bullet.sid = sid;
	BOTHS[sid] = bullet;
}


function send_died(tank) {
	var json = {
		c: 'd',
		sid: tank.sid,
	}
	send(json);
}

function recv_died(sid) {
	if (!(sid in BOTHS))
		return
	var model = BOTHS[sid];
	model.died();
	delete BOTHS[sid];
}


function send_stop(tank) {
	var json = {
		c: 'st',
		sid: tank.sid,
		map_distance: bgmap.map_distance,
		info: get_entity_info(tank),
	}
	send(json);
    tank.stop();
}

function recv_stop(sid, map_distance, info) {
	 if (bgmap.map_distance != map_distance) {
	 	
	 	// 补偿y洲偏移
	 	Crafty.pause();
	 	// Crafty.e("2D, DOM, Collision").each(function(index) {
	 	// 	this.y += (bgmap.map_distance - map_distance);
	 	// });
        for (var this_sid in BOTHS) {
            BOTHS[this_sid].y += (bgmap.map_distance - map_distance);
        }
	 	bgmap.map_distance = map_distance;
	 	bgmap.fresh_bg();
	 	Crafty.pause();
	}
	if (!(sid in BOTHS))
		return
	var tank = BOTHS[sid];
	set_entity_info(tank, info);
	tank.stop();
}


function get_control() {
    // Crafty.e("MyTank").each(function(index) {
    //     if (this != player)
    //         this.destroy() ;
    // });
    for (var sid in BOTHS) {
        if ((BOTHS[sid].name == "MyTank") && BOTHS[sid] != player) {
            BOTHS[sid].died();
            delete BOTHS[sid];
        }
    }
    CONTROL = true;
}




