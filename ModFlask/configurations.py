import os 
import time
import json
import re
from flask import Flask, request

# Configurations BEGIN
#############################################################
MODBUS_LIBRARY_ID = 0

WEB_CLIENT_HOST = "localhost"
WEB_CLIENT_PORT = 8001

MODBUS_SERVER= "127.0.0.1"
MODBUS_SERVER_PORT = 502
UNIT_IDENTIFIER = 0
ASSETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), './static')


app = Flask(__name__)
app = Flask(__name__, template_folder=ASSETS_DIR, static_folder=ASSETS_DIR)

if MODBUS_LIBRARY_ID == 0: from pyModbusTCP.client import ModbusClient
if MODBUS_LIBRARY_ID == 1: from pymodbus.client.sync import ModbusTcpClient as ModbusClient



if MODBUS_LIBRARY_ID == 0: modbusClient = ModbusClient(MODBUS_SERVER,MODBUS_SERVER_PORT,UNIT_IDENTIFIER,auto_open=None)
if MODBUS_LIBRARY_ID == 1: modbusClient = ModbusClient(MODBUS_SERVER, port=MODBUS_SERVER_PORT)

#############################################################
# Configurations END
