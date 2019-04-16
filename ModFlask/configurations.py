import sys
import importlib

if sys.version_info.major is not 3:
 print("! Only Python3 !")
 exit()

moduleNames=[]

moduleNames.append("argparse")
moduleNames.append("flask")
moduleNames.append("pymodbus")
moduleNames.append("pyModbusTCP")

for moduleName in moduleNames:
 if(importlib.util.find_spec(moduleName) is None):
  print('\nPlease install the "{}" module first.'.format(moduleName),end=" => ")
  print('pip3 install {}'.format(moduleName))
  exit()


import os 
import time
import json
import re
import argparse
from flask import Flask, request, render_template

argumentParser=argparse.ArgumentParser(description='ModFlask - Flask Web Client for Modbus')
argumentParser.add_argument("--host",help="IP Address for Web Client",default="127.0.0.1")
argumentParser.add_argument("--port",help="Port Number for Web Client",type=int,default=8001)
arguments=argumentParser.parse_args()


# Configurations BEGIN
#############################################################
MODBUS_LIBRARY_ID = 0

WEB_CLIENT_HOST = arguments.host
WEB_CLIENT_PORT = arguments.port

MODBUS_SERVER= "127.0.0.1"
MODBUS_SERVER_PORT = 502
UNIT_IDENTIFIER = 0
ASSETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), './static')


app = Flask(__name__)
app = Flask(__name__, template_folder=ASSETS_DIR, static_folder=ASSETS_DIR)

if MODBUS_LIBRARY_ID == 0: from pyModbusTCP.client import ModbusClient
if MODBUS_LIBRARY_ID == 1: from pymodbus.client.sync import ModbusTcpClient as ModbusClient

try:
  if MODBUS_LIBRARY_ID == 0: modbusClient = ModbusClient(MODBUS_SERVER,MODBUS_SERVER_PORT,UNIT_IDENTIFIER,auto_open=None)
  if MODBUS_LIBRARY_ID == 1: modbusClient = ModbusClient(MODBUS_SERVER, port=MODBUS_SERVER_PORT)
except Exception as exception:
  print(str(exception))
  exit()

#############################################################
# Configurations END
