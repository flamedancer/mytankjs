# -*- coding: utf-8 -*-

import json
import time
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
        # info = {
        #     'c': 'reset_room',
        #     'room_index': room_index,
        #     'type': inf_type,
        #     'value': value,
        # }
        # msg = json.dumps(info)
        # for player in all_players:
        #     player.send_self(msg)
        for player in all_players:
            send_room_infs(player)

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
        self._send_info(room_index, inf_type, value)

ROOMINDEX = RoomIndex()


def add_room_member(players, player):
    origin_player = players[0]
    players.append(player)
    origin_player.partner = player
    player.partner = origin_player
    player.room_id = origin_player.room_id
    player.room_index = origin_player.room_index
    ROOMINDEX.reset_room_info(player.room_index, 'num', 2)
    return player.room_index

def get_is_control(player, room_id):
    # 判断是否切换房间，需要将其从原来房间释放
    if player.room_id:
        leave_room(player)
    if room_id:
        if room_id in rooms and len(rooms[room_id]) == 1:
            room_index = add_room_member(rooms[room_id], player)
            return False, room_index 
        for room_id, players in rooms.items():
            if len(players) == 1:
                room_index = add_room_member(players, player)
                return False, room_index
    new_room_id = player.core_id + str(time.time())
    player.room_id = new_room_id
    rooms[new_room_id] = [player]
    room_index = ROOMINDEX.add_room_id(new_room_id)
    player.room_index = room_index;
    return True, room_index


class Player(object):
    def __init__(self, wc, core_id):
        self.wc = wc
        self.core_id = core_id
        self.room_id = ''
        self.room_index = None 
        self.partner = None

        self.start_time = 0    # 这局开始时间 避免频繁开始

    def send_self(self, info):
        msg = json.dumps(info) if not isinstance(info, (str)) else info
        try:
            self.wc.send(msg)
        except:
            print("partner close")
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
            if self.room_index == None:
                return
            ROOMINDEX.reset_room_info(self.room_index, 'ping', ping_value)
            return
        elif info['c'] == 's':
            # info['uuid'] = self.core_id
            now = time.time()
            if now - self.start_time <= 3:
                return
            if self.room_id and 'room_id' in info and self.room_id == info['room_id']:
                return
            is_control, room_index = get_is_control(self, info.get('room_id'))
            info['is_control'], info['room_index'] = is_control, room_index
            self.send_self(info)
            self.start_time = now
        elif info['c'] in ['t', 'req_init', 'rsp_init', 'st']:
            self.send_partner(info)
        elif info['c'] == 'end':
            leave_room(self)
        else:
            self.broad(info)
        print(self.core_id, "  :", msg)

def app(environ, start_response):
    ws = environ.get("wsgi.websocket")
    core_id = str(environ['HTTP_SEC_WEBSOCKET_KEY'])
    player = Player(ws, core_id)
    all_players.append(player)
    print("connect: ", player.core_id)
    send_room_infs(player)
    try:
        while True:
            msg = ws.receive()
            player.handler(msg)
    except geventwebsocket.WebSocketError as ex:
        print("websocet closse!")
    finally:
        disconnect_player(player)


def send_room_infs(player):
    player.send_self(
        {
            'c': 'set_rooms', 
            'room_infs': ROOMINDEX.room_indexs,
        }
    )

def leave_room(player):
    if player.room_id in rooms and player in rooms[player.room_id]:
        rooms[player.room_id].remove(player)
        if not rooms[player.room_id]:
            del rooms[player.room_id]
            ROOMINDEX.del_room_index(player.room_index)
        else:
            ROOMINDEX.reset_room_info(player.room_index, 'num', 1)
    if player.partner and player.partner in all_players:
        player.send_partner(GET_CONTROL_MSG)
        player.partner.partner = None
    player.room_id = ''
    player.room_index = None

def disconnect_player(player):
    leave_room(player)
    if player in all_players:
        all_players.remove(player)
    print("disconnect: ", player.core_id)



path = os.path.dirname(geventwebsocket.__file__)
agent = "gevent-websocket/%s" % (geventwebsocket.get_version())

cert_dir = os.path.dirname(os.getcwd()) + '/mydocker/nginx/config/cert/flame.cn/'

def start_server():
    print("Running %s from %s" % (agent, path))
    geventwebsocket.WebSocketServer(
        ("0.0.0.0", 9091),
        app,
        debug=True,
        keyfile=cert_dir + 'www.key',
        certfile=cert_dir + 'www.crt'
    ).serve_forever()


def show_cert():
    import subprocess

    print(cert_dir)
    output = subprocess.check_output('ls ' + cert_dir, shell=True)
    print(output)


if __name__ == '__main__':
    # show_cert()
    start_server()
