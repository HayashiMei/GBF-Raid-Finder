from __future__ import absolute_import, print_function
from config import read_config
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream

import json
import threading
from websocket_server import WebsocketServer

consumer_key = read_config.consumer_key
consumer_secret = read_config.consumer_secret
access_token = read_config.access_token
access_token_secret = read_config.access_token_secret
threads = []


def new_client(client, server):
    print("New client connected and was given id %d" % client['id'])
    try:
        if len(threads) == 0:
            t = threading.Thread(target=filter, args=())
            t.start()
            threads.append(t)
    except:
        print("Error: unable to start thread")


def client_left(client, server):
    print("Client(%d) disconnected" % client['id'])


def message_received(client, server, message):
    print("New message received:\n")
    print(message)


class StdOutListener(StreamListener):
    def on_data(self, data):
        server.send_message_to_all(data)
        return True

    def on_error(self, status):
        print(status)


def filter():
    l = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)

    stream = Stream(auth, l)
    stream.filter(track=["参加者募集！", ":参戦ID", "I need backup!", ":Battle ID"])


server = WebsocketServer(8181, "0.0.0.0")
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()