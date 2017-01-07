
SCREEN_WIDTH = 384
SCREEN_HEIGHT = 608
DIRECTIONS = [ [0, -1], [1, 0], [0, 1], [-1, 0] ];  // 上下左右
DIRECTION_U = 0;
DIRECTION_D = 2;
DIRECTION_L = 3;
DIRECTION_R = 1;

CONF = {
	"mytank": {
		"img": "assets/mytank.gif",
		"rect": [32, 32],
		"speed": 1,
		"bullet": "NormalBullet",
		"died_name": "tankexplod",
	},
	"aitank": {
		"img": "assets/aitank.gif",
		"rect": [30, 30],
		"speed": 2,
    	"shot_rate": 0.015,
    	"turn_rate": 0.01,
    	"bullet": "AiBullet",
	    "maxhealth": 10,
	    "died_name": "tankexplod",
	},
	"icetank": {
		"img": "assets/ai_icetank.gif",
		"rect": [30, 30],
		"speed": 1,
    	"shot_rate": 0.02,
    	"turn_rate": 0.01,
    	"bullet": "NormalBullet",
    	"maxhealth": 120,
    	"died_name": "tankexplod",
	},
	"NormalBullet": {
		"img": "assets/shot.gif",
		"rect": [6, 18],
		"speed": 5,
		"died_name": "bulletexplod",
	},
	"AiBullet": {
		"img": "assets/shot1.gif",
		"rect": [6, 18],
		"speed": 5,
		"died_name": "bulletexplod",
	},
	"tankexplod": {
		"imgs": ["assets/bomb_1.gif", "assets/bomb_2.gif", "assets/bomb_3.gif"],
		"rects": [[80, 80]],
	},
	"bulletexplod": {
		"imgs": ["assets/shotdied.gif"],
		"rects": [[30, 30]],
	}

}

