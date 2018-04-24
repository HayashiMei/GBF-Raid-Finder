import os
import configparser

cur_path = os.path.dirname(os.path.realpath(__file__))

config_path = os.path.join(cur_path, 'config.ini')

conf = configparser.ConfigParser()
conf.read(config_path)

consumer_key = conf.get('auth', 'consumer_key')
consumer_secret = conf.get('auth', 'consumer_secret')
access_token = conf.get('auth', 'access_token')
access_token_secret = conf.get('auth', 'access_token_secret')