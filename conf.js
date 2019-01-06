
SCREEN_WIDTH = 384
SCREEN_HEIGHT = 576
DIRECTIONS = [ [0, -1], [1, 0], [0, 1], [-1, 0],  [1, -1], [1, 1], [-1, 1], [-1, -1] ];  // 上左下右 上右 下右 下左 上左
DIRECTION_U = 0;
DIRECTION_R = 1;
DIRECTION_D = 2;
DIRECTION_L = 3;

DIRECTION_UR = 4;
DIRECTION_DR = 5;
DIRECTION_DL = 6;
DIRECTION_UL = 7;

function get_direct_id(direct) {
	if (direct[0] == 0) {
		if (direct[1] == 1)
			return DIRECTION_D
		else
			return DIRECTION_U
	}
	else {
		if (direct[0] == 1)
			return DIRECTION_R
		else
			return DIRECTION_L
	}
}


CONF = {
	"MyTank": {
		"ai": false,
		"icon": "assets/mytank.gif",
		"rect": [32, 32],
		"speed": 1,
		"maxhealth": 500,
		"bullet": "NormalBullet",
		"died_name": "tankexplod",
	},
	"AiTank": {
		"icon": "assets/aitank.gif",
		"rect": [30, 29],
		"speed": 2,
    	"shot_rate": 0.015,
    	"turn_rate": 0.01,
    	"bullet": "AiBullet",
	    "maxhealth": 10,
	    "died_name": "tankexplod",
	},
	"IceTank": {
		"icon": "assets/icetank.gif",
		"rect": [30, 30],
		"speed": 1,
    	"shot_rate": 0.01,
    	"turn_rate": 0.008,
    	"bullet": "IceBullet",
    	"maxhealth": 150,
    	"died_name": "tankexplod",
	},
	"Bossspider": {
		"icon": "assets/bossspider.gif",
		"rect": [60, 60],
		"speed": 1,
    	"shot_rate": 0.05,
    	"turn_rate": 0.01,
       	"bullet": "Terrorsmallspider",
    	"maxhealth": 1000,
		"died_name": "bulletexplod",
	},
	"Terrorsmallspider": {
		"icon": "assets/terrorsmallspider.gif",
		"rect": [20, 20],
		"speed": [2, 2, 4, 6],
    	"shot_rate": 0,
    	"turn_rate": 0.1,
    	"maxhealth": 5,
		"died_name": "bulletexplod",
	},
	"NormalBullet": {
		"icon": "assets/shot.gif",
		"rect": [6, 18],
		"speed": 5,
		"died_name": "bulletexplod",
	},
	"AiBullet": {
		"icon": "assets/shot1.gif",
		"rect": [6, 18],
		"speed": 5,
		"died_name": "bulletexplod",
	},
	"IceBullet": {
		"icon": "assets/icebullet.gif",
		"rect": [30, 30],
		"speed": 4,
		"died_name": "",
	},

	"tankexplod": {
		"imgs": ["assets/bomb_1.gif", "assets/bomb_2.gif", "assets/bomb_3.gif"],
		"rects": [[80, 80]],
	},
	"bulletexplod": {
		"imgs": ["assets/shotdied.gif"],
		"rects": [[30, 30]],
	},
	"Bossspider_both_Animation": {
		"icon": "assets/bossspider.gif",
		"rect": [60, 60],
	},
	"Bossbouncer_both_Animation": {
		"icon": "assets/bouncebullet.gif",
		"rect": [30, 30],
	},
	"Bossbouncer": {
		"icon": ["assets/bossbouncer1.gif", "assets/bossbouncer4.gif", "assets/bossbouncer3.gif", "assets/bossbouncer2.gif",
				"assets/bossbouncer5.gif", "assets/bossbouncer8.gif", "assets/bossbouncer7.gif", "assets/bossbouncer6.gif"],
		"rect": [32, 32],
		"speed": 1,
    	"shot_rate": 0.02,
    	"turn_rate": 0.02,
       	"bullet": "BounceBullet",
    	"maxhealth": 2000,
		"died_name": "bulletexplod",

	},
	"BounceBullet": {
		"icon": "assets/bouncebullet.gif",
		"rect": [30, 30],
		"speed": 4,
		"died_name": "",
		"bounce_cnt": 5,
	},
    "Frozen": {
		"icon": "assets/Frozen.gif",
		"rect": [60, 72],
    }

}



COllISION_CONF = {                    
    "MyTank" : {
                    "ai_beamgolem": [1, 0, 0],
                    "ai_beamgolem:beamBullet" : [0, 30, 0],
                    "ai_normaltank" : [1, 0, 0],
                    "ai_normaltank:normalBullet": [0, 10, 10],
                    "ai_terrorsmallspider": [1, 10, 10],
                    "ai_bossgoddess": [0, 0, 0],
                    "ai_pullwavegolem": [1, 1, 0],
                    "ai_pushwavegolem": [1, 0, 0],
                    'IceTank' : [1, 30, 1000],
                    "Terrorsmallspider":[0, 10, 10],
                    'Bossspider': [1, 1000, 0],
                    'AiTank' : [1, 0, 0]
                },
    "NormalBullet" : 
                {
                    "AiTank" : [0, 50, 50],
                    "Terrorsmallspider": [0, 50, 50],
                    "Bossspider": [0, 50, 50],
                    "IceTank": [0, 50, 50],
                    "Bossbounder": [0, 50, 50],
                },  
                
    "AiBullet" : 
                {
                    "MyTank" : [0, 60, 60]
                    
                },

  "IceBullet" :
                {
                    "MyTank" : [0, 30, 30, "Frozen"],
                  },

                
    "AiTank" :
                {
                    "NormalBullet" : [0, 10, 50],
                    
                },
    
    "IceTank" :
                {
                    "NormalBullet" : [0, 1000, 50],
                    "MyTank" : [0, 1000, 30, "Frozen"],
                },
  

    "ai_normaltank:normalBullet" :
                {
                    "mytank" : [1, 10, 10],
                    "mytank:skill_fireshield" : [1, 10, 10],
                    "mytank_normalBullet" : [1, 10, 10],
                    "ai_tankfactory":[1, 0, 0],
                    'ai_pillbox': [1, 0, 0],
                },
        
  
    "mytank:skill_fireshield" : 
                {
                    "ai_normaltank" : [0, 10, 10],
                    "ai_normaltank:normalBullet" : [0, 10, 10],
                    "ai_terrorsmallspider":[0, 10, 10],
                    "ai_bossspider": [0, 10, 10],
                    "ai_beamgolem": [0, 10, 10],
                    "ai_bossgoddess": [0, 10, 10],
                    "ai_pullwavegolem":[0, 10, 10],
                    "ai_pushwavegolem":[0, 10, 10],
                    'ai_pillbox': [0, 0, 0],
                    'ai_icetank' : [1, 5, 10]
                },

    "Terrorsmallspider":
                {
                    "MyTank" : [0, 10, 10],
                    "mytank:skill_fireshield" : [1, 10, 10],
                    "mytank:normalBullet" : [1, 10, 10],
                    "ai_tankfactory":[1, 0, 0],
                    'ai_pillbox': [1, 0, 0],
                },
                
    "Bossspider":
                {
                    "MyTank" : [1, 0, 1000],
                    "mytank:skill_fireshield" : [1, 10, 10],
                    "mytank:normalBullet" : [1, 10, 10],
                    "ai_tankfactory":[1, 0, 0],
                    'ai_pillbox': [1, 0, 0]
                
                },
    "ai_beamgolem":
                {
                    "ai_beamgolem": [1, 0, 0],
                    "ai_normaltank" : [1, 0, 0],
                    "mytank" : [1, 0, 0],
                    "mytank:skill_fireshield" : [1, 10, 10],
                    "mytank:normalBullet" : [0, 10, 10],
                    "ai_tankfactory":[1, 0, 0],
                    'ai_pillbox': [1, 0, 0]
                
                },
    "ai_beamgolem:beamBullet":
                {
                    "mytank" : [1, 0, 30],
                    "mytank:skill_fireshield" : [1, 10, 10],
                    "mytank_normalBullet" : [1, 10, 10],
                    "ai_tankfactory":[1, 0, 0],
                    'ai_pillbox': [1, 0, 0]
                
                },
    "ai_bossgoddess:icePicr":
                {
                    "mytank" : [1, 0, 10],
                    "mytank:skill_fireshield" : [1, 0, 10],
                    "mytank_normalBullet" : [1, 0, 10]
                
                },
    "ai_bossgoddess:meteor":
                {
                    "mytank" : [1, 0, 1],
                    "mytank:skill_fireshield" : [1, 0, 10],
                    "mytank_normalBullet" : [1, 0, 10]
                
                },
    "ai_bossgoddess:rattan":
                {
                    "mytank" : [1, 0, 5]                                
                },
    "ai_bossgoddess":
                {   
                    "mytank" : [0, 0, 10],
                    "mytank:skill_fireshield" : [1, 10, 10],
                    "mytank:normalBullet" : [1, 10, 10]
                
                
                
                },
    "ai_pullwavegolem":
                {
                    "mytank" : [1, 0, 0],
                    "mytank:skill_fireshield" : [1, 10, 10],
                    "mytank:normalBullet" : [1, 10, 10],
                    "ai_tankfactory":[1, 0, 0],
                    'ai_pillbox': [1, 0, 0]
                },
    "ai_pullwavegolem:pullwave":
                {
                    "mytank" : [0, 0, 0, 1]
                },
    
    "ai_pushwavegolem":
                {
                    "mytank" : [1, 0, 0],
                    "mytank:skill_fireshield" : [1, 10, 10],
                    "mytank:normalBullet" : [1, 10, 10],
                    "ai_tankfactory":[1, 0, 0],
                    'ai_pillbox': [1, 0, 0]
                },

    "ai_pushwavegolem:pushwave":
            {
                "mytank" : [0, 0, 1, 1]
            },
     
    'ai_pillbox:normalBullet':
            {
                    "mytank" : [1, 10, 10],
                    "mytank:skill_fireshield" : [1, 10, 10],
                    "mytank_normalBullet" : [1, 10, 10],
                    "ai_tankfactory":[1, 0, 0]
            },

    "ai_bossflowerfairy:flower":
            {
                "mytank" : [1, 10, 10],
                "mytank:skill_fireshield" : [1, 10, 10],
                "mytank_normalBullet" : [1, 0, 10]
            
            },

    "Bossbouncer":
            {
                "NormalBullet" : [1, 50, 50],
                "mytank" : [1, 2, 2],
                "mytank:skill_fireshield" : [1, 10, 10],
                "ai_tankfactory":[1, 0, 0],
                'ai_pillbox': [1, 0, 0],
                'ai_icetank' : [0, 0, 0],
                "ai_bossbouncer:bounceBullet": [0, 0, 0]
                
            },

  "BounceBullet" :
                {
                    "MyTank" : [0, 30, 30, "Frozen"],
                  },

 
    "ai_tankfactory":
            {},
    'ai_pillbox':
            {},
    
 
    "explod" : {}
}
