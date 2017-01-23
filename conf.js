
SCREEN_WIDTH = 384
SCREEN_HEIGHT = 576
DIRECTIONS = [ [0, -1], [1, 0], [0, 1], [-1, 0] ];  // 上下左右
DIRECTION_U = 0;
DIRECTION_D = 2;
DIRECTION_L = 3;
DIRECTION_R = 1;


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
		"img": "assets/mytank.gif",
		"rect": [32, 32],
		"speed": 1,
		"maxhealth": 100,
		"bullet": "NormalBullet",
		"died_name": "tankexplod",
	},
	"AiTank": {
		"img": "assets/aitank.gif",
		"rect": [30, 29],
		"speed": 2,
    	"shot_rate": 0.015,
    	"turn_rate": 0.01,
    	"bullet": "AiBullet",
	    "maxhealth": 10,
	    "died_name": "tankexplod",
	},
	"IceTank": {
		"img": "assets/ai_icetank.gif",
		"rect": [30, 30],
		"speed": 1,
    	"shot_rate": 0.02,
    	"turn_rate": 0.01,
    	"bullet": "NormalBullet",
    	"maxhealth": 120,
    	"died_name": "tankexplod",
	},
	"Bossspider": {
		"img": "assets/bossspider.gif",
		"rect": [60, 60],
		"speed": 1,
    	"shot_rate": 0.05,
    	"turn_rate": 0.01,
		"hp": 3000,
       	"bullet": "Terrorsmallspider",
    	"maxhealth": 1200,
		"died_name": "bulletexplod",
	},
	"Terrorsmallspider": {
		"img": "assets/terrorsmallspider.gif",
		"rect": [20, 20],
		"speed": [3, 4, 5, 6],
    	"shot_rate": 0,
    	"turn_rate": 0.1,
    	"maxhealth": 10,
		"died_name": "bulletexplod",
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
	},
	"Bossspider_both_Animation": {
		"img": "assets/bossspider.gif",
		"rect": [60, 60],
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
                    "Terrorsmallspider":[0, 10, 10],
                    'Bossspider': [1, 1000, 0],
                    'AiTank' : [1, 0, 0]
                },
    "NormalBullet" : 
                {
                    "AiTank" : [0, 50, 50],
                    "Terrorsmallspider": [0, 50, 50],
                    "Bossspider": [0, 50, 50],
                    
                },  
                
    "AiBullet" : 
                {
                    "MyTank" : [0, 60, 60]
                    
                },
                
    "AiTank" :
                {
                    "NormalBullet" : [0, 10, 50],
                    
                },
    
    "ai_icetank" :
                {
                    "ai_normaltank" : [0, 0, 0],
                    "mytank" : [1, 20, 20, 1],
                    "mytank:skill_fireshield" : [1, 10, 10],
                    "mytank:normalBullet" : [0, 10, 10],
                    "ai_tankfactory":[1, 0, 0],
                    'ai_pillbox': [1, 0, 0],
                    'ai_icetank' : [0, 0, 0]
                    
                  },
  

    "ai_normaltank:normalBullet" :
                {
                    "mytank" : [1, 10, 10],
                    "mytank:skill_fireshield" : [1, 10, 10],
                    "mytank_normalBullet" : [1, 10, 10],
                    "ai_tankfactory":[1, 0, 0],
                    'ai_pillbox': [1, 0, 0],
                },
        
    "ai_icetank:iceBullet" :
                {
                    "mytank" : [1, 10, 10, 1],
                    "mytank:skill_fireshield" : [1, 10, 5],
                    "mytank_normalBullet" : [0, 10, 10],
                    "ai_tankfactory":[1, 0, 0],
                    'ai_pillbox': [1, 0, 0]
                    
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

    "ai_bossbouncer":
            {
                "ai_normaltank" : [0, 0, 0],
                "mytank" : [1, 2, 2],
                "mytank:skill_fireshield" : [1, 10, 10],
                "mytank:normalBullet" : [0, 10, 10],
                "ai_tankfactory":[1, 0, 0],
                'ai_pillbox': [1, 0, 0],
                'ai_icetank' : [0, 0, 0],
                "ai_bossbouncer:bounceBullet": [0, 0, 0]
                
            },

    "ai_bossbouncer:bounceBullet":
            {
                "mytank" : [0, 20, 20, 1],
                "mytank:skill_fireshield" : [1, 10, 20],
                "mytank_normalBullet" : [0, 10, 10],
                "ai_tankfactory":[1, 0, 0],
                'ai_pillbox': [1, 0, 0],
                "ai_bossbouncer:bounceBullet": [0, 0, 0],
                "ai_bossbouncer":[0, 0, 0]
            },

 
    "ai_tankfactory":
            {},
    'ai_pillbox':
            {},
    
 
    "explod" : {}
}
