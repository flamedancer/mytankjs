# -*- coding: utf-8 -*-

import json
import os
import geventwebsocket

all_players = []

rooms = {}  # room_id: [p1, p2]

def add_room_member(players, player):
	origin_player = players[0]
	players.append(player)
	origin_player.partner = player
	player.partner = origin_player
	player.room_id = origin_player.room_id

def get_game_model(player, room_id):
	if room_id and room_id in rooms and len(rooms[room_id]) == 1:
		add_room_member(rooms[room_id], player)
		return 3
	for room_id, players in rooms.items():
		if len(players) == 1:
			add_room_member(players, player)
			return 3
	else:
		new_room_id = player.core_id
		player.room_id = new_room_id
		rooms[new_room_id] = [player]
		return 2


class Player(object):
	def __init__(self, wc, core_id):
		self.wc = wc
		self.core_id = core_id
		self.room_id = ''
		self.partner = None

	def send_self(self, info):
		msg = json.dumps(info) if not isinstance(info, (str)) else info
		self.wc.send(msg)

	def send_partner(self, info):
		msg = json.dumps(info) if not isinstance(info, (str)) else info
		if self.partner:
			self.partner.wc.send(msg)

	def broad(self, info ):
		msg = json.dumps(info)
		self.send_self(msg)
		self.send_partner(msg)

	def handler(self, msg):
		info = json.loads(msg)
		if info['c'] == 's':
			# info['uuid'] = self.core_id
			game_model = get_game_model(self, info.get('room_id'))
			info['game_model'] = game_model
			self.send_self(info)
		elif info['c'] == 'req_init':
			self.send_partner(info)
		elif info['c'] == 'rsp_init':
			self.send_partner(info)
		else:
			self.broad(info)


def app(environ, start_response):
    ws = environ.get("wsgi.websocket")
    core_id = 11 #str(environ['HTTP_SEC_WEBSOCKET_KEY'])
    player = Player(ws, core_id)
    all_players.append(player)
    print "connect: ", player.core_id
    try:
        while True:
	        msg = ws.receive()
	        player.handler(msg)
    # except geventwebsocket.WebSocketError, ex:
    #     print "player left: ", player.core_id
    except:
        disconnect_player(player)


def disconnect_player(player):
    rooms[player.room_id].remove(player)
    if not rooms[player.room_id]:
        del rooms[player.room_id]
	all_players.remove(player)
	print "disconnect: ", player.core_id



path = os.path.dirname(geventwebsocket.__file__)
agent = "gevent-websocket/%s" % (geventwebsocket.get_version())


print "Running %s from %s" % (agent, path)
geventwebsocket.WebSocketServer(("0.0.0.0", 9091), app, debug=False).serve_forever()
