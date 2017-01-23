# -*- coding: utf-8 -*-

import json
import os
import geventwebsocket

GET_CONTROL_MSG = json.dumps(
    {
        'c': 'control',
    }
)

all_players = []

rooms = {}  # room_id: [p1, p2]


class RoomIndex(object):
    def __init__(self):
        self.room_indexs = []  # [room_id, ping]
    # type: num ping del add
    def _send_info(self, room_index, inf_type, value=0):
        info = {
            'c': 'reset_room',
            'room_index': room_index,
            'type': inf_type,
            'value': value,
        }
        msg = json.dumps(info)
        for player in all_players:
            player.send_self(msg)

    def add_room_id(self, room_id):
        if None in self.room_indexs:
            room_index = self.room_indexs.index(None)
            self.room_indexs[room_index] = [room_id, 0]
        else:
            room_index = len(self.room_indexs)
            self.room_indexs.append([room_id, 0])
        self._send_info(room_index, 'add', room_id)
        return room_index

    def del_room_index(self, room_index):
        if room_index == None:
            return
        self.room_indexs[room_index] = None
        if self.room_indexs[-1] is None:
            self.room_indexs.pop()
        self._send_info(room_index, 'del', '')

    def reset_room_info(self, room_index, inf_type, value):
        if inf_type == "ping":
            if self.room_indexs[room_index][1] == 0:
                self.room_indexs[room_index][1] = value
            else:
                self.room_indexs[room_index][1] = int((value + self.room_indexs[room_index][1]) / 2)
            value = self.room_indexs[room_index][1]
        self._send_info(self, room_index, inf_type, value)

ROOMINDEX = RoomIndex()


def add_room_member(players, player):
    origin_player = players[0]
    players.append(player)
    origin_player.partner = player
    player.partner = origin_player
    player.room_id = origin_player.room_id
    player.room_index = origin_player.room_index
    ROOMINDEX.reset_room_info(player.room_index, 'num', 2)

def get_is_control(player, room_id):
    if room_id:
        if room_id in rooms and len(rooms[room_id]) == 1:
            add_room_member(rooms[room_id], player)
            return False
        for room_id, players in rooms.items():
            if len(players) == 1:
                add_room_member(players, player)
                return False
    new_room_id = player.core_id
    player.room_id = new_room_id
    rooms[new_room_id] = [player]
    room_index = ROOMINDEX.add_room_id(new_room_id)
    player.room_index = room_index;
    return True


class Player(object):
    def __init__(self, wc, core_id):
        self.wc = wc
        self.core_id = core_id
        self.room_id = ''
        self.room_index = None
        self.partner = None

    def send_self(self, info):
        msg = json.dumps(info) if not isinstance(info, (str)) else info
        try:
            self.wc.send(msg)
        except:
            print "partner close"
            disconnect_player(self)

    def send_partner(self, info):
        if self.partner:
            self.partner.send_self(info)

    def broad(self, info ):
        msg = json.dumps(info)
        self.send_self(msg)
        self.send_partner(msg)

    def handler(self, msg):
        if msg == 'ping':
            self.send_self('pong')
            return
        info = json.loads(msg)
        if info['c'] == 'ping':
            ping_value = info['ping']
            if not self.room_index:
                return
            ROOMINDEX.reset_room_info(self.room_index, 'ping', ping_value)

        if info['c'] == 's':
            # info['uuid'] = self.core_id
            is_control = get_is_control(self, info.get('room_id'))
            info['is_control'] = is_control
            self.send_self(info)
        elif info['c'] in ['t', 'req_init', 'rsp_init', 'st']:
            self.send_partner(info)
        else:
            self.broad(info)


def app(environ, start_response):
    ws = environ.get("wsgi.websocket")
    core_id = str(environ['HTTP_SEC_WEBSOCKET_KEY'])
    player = Player(ws, core_id)
    all_players.append(player)
    print "connect: ", player.core_id
    try:
        while True:
            msg = ws.receive()
            player.handler(msg)
    # except geventwebsocket.WebSocketError, ex:
    #     print "player left: ", player.core_id
    except Exception, e:
        print e, e.message
        disconnect_player(player)


def disconnect_player(player):
    rooms[player.room_id].remove(player)
    if not rooms[player.room_id]:
        del rooms[player.room_id]
        ROOMINDEX.del_room_index(player.room_index)
    else:
        ROOMINDEX.reset_room_info(player.room_index, 'num', 1)

    all_players.remove(player)
    print "disconnect: ", player.core_id
    if player.partner and player.partner in all_players:
        player.send_partner(GET_CONTROL_MSG)
        player.partner.partner = None



path = os.path.dirname(geventwebsocket.__file__)
agent = "gevent-websocket/%s" % (geventwebsocket.get_version())


print "Running %s from %s" % (agent, path)
geventwebsocket.WebSocketServer(("0.0.0.0", 9091), app, debug=False).serve_forever()
