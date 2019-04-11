import os
import json
import re
from flask import Flask
from flask import request
from time import sleep


# Configurations BEGIN
#############################################################
MODBUS_LIBRARY_ID = 0

WEB_CLIENT_HOST = "127.0.0.1"
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
if MODBUS_LIBRARY_ID == 1:  modbusClient = ModbusClient(MODBUS_SERVER, port=MODBUS_SERVER_PORT)

#############################################################
# Configurations END




# HelperFunctions BEGIN
#############################################################

# Function checkClientStatus BEGIN
def checkClientStatus():
  if MODBUS_LIBRARY_ID == 0: return modbusClient.is_open()
  if MODBUS_LIBRARY_ID == 1: return modbusClient.is_socket_open()
# Function checkClientStatus END

#############################################################
# HelperFunctions END





# Controllers BEGIN
#############################################################

def homeController():
  return app.send_static_file("index.html")

def clientStatusController(request_data=False):
  # sleep(1)
  global MODBUS_SERVER
  global MODBUS_SERVER_PORT
  global modbusClient

  if not request_data:
    return json.dumps(checkClientStatus())

  open_client = json.loads(request_data)["open_client"]

  if(open_client and checkClientStatus()):
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Already Opened"}
    return json.dumps(responseObject)

  if(not open_client and not checkClientStatus()):
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Already Closed"}
    return json.dumps(responseObject)

  if(not open_client and checkClientStatus()):
    modbusClient.close()
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Client Closed"}
    return json.dumps(responseObject)
  
  if(open_client and not checkClientStatus()):
    ip_address = json.loads(request_data)["ip_address"]
    port = json.loads(request_data)["port"]

    if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$",ip_address) is None:
      return "Bad IP Address Format"

    if not str.isdigit(str(port)): return "Bad Port Format"
    if int(port) < 0 or int(port) > 65535: return "Bad Port"
    
    if(ip_address==MODBUS_SERVER and port==MODBUS_SERVER_PORT):

      if MODBUS_LIBRARY_ID == 0: 
        responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Client Opened"}
        if not modbusClient.open(): responseObject["message"]="Connection Cannot Be Initiated"
        return json.dumps(responseObject)

      if MODBUS_LIBRARY_ID == 1:
        if not modbusClient.connect(): return "Connection Cannot Be Initiated"
        return "Client Opened"
    
    if(ip_address!=MODBUS_SERVER or port!=MODBUS_SERVER_PORT):
      MODBUS_SERVER = ip_address
      MODBUS_SERVER_PORT = port

      if MODBUS_LIBRARY_ID == 0: modbusClient = ModbusClient(MODBUS_SERVER,MODBUS_SERVER_PORT,UNIT_IDENTIFIER,auto_open=None)
      if MODBUS_LIBRARY_ID == 1: modbusClient = ModbusClient(MODBUS_SERVER, port=MODBUS_SERVER_PORT)
      if MODBUS_LIBRARY_ID == 0: 
        if not modbusClient.open(): return "Connection Cannot Be Initiated"
        responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Client Opened"}
        return json.dumps(responseObject)
      if MODBUS_LIBRARY_ID == 1:
        if not modbusClient.connect(): return "Connection Cannot Be Initiated"
        return "Client Opened"
      return "Unpredictable Situation"
      
      
#############################################################
# Controllers END









# Route Operations BEGIN
#############################################################

# Route home BEGIN
@app.route("/",methods=["GET"])
def home():	
  return homeController()
# Route home END


# Route clientStatus BEGIN
@app.route("/api/clientstatus",methods=["GET","POST"])
def client():
  if request.method	== "POST":
    return clientStatusController(request.data)
  else:
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":clientStatusController()}
    return json.dumps(responseObject)
# Route clientStatus END







#############################################################
# Route Operations END







# Run App BEGIN
if __name__ == "__main__":
	app.run(host=WEB_CLIENT_HOST, port=WEB_CLIENT_PORT,debug=True)
# Run App END









# # writeCoilsFunc
# def writeCoilsFunc():
#  try:
#   client.open()
#   for i in range(100):
#    rq = client.write_single_coil(i,random.randint(0,1))
#   client.close()
#   return "{'res':'Successfull Operation'}"
#  except Exception as exception:
#   return str(exception)
# # writeCoilsFunc END



# # readInputsFunc
# def readInputsFunc(request_data):
#  try:
#   data = json.loads(request_data)

#   client.open()
#   rq = client.read_discrete_inputs(int(data["inputAddress"]),int(data["inputQuantity"]))
#   client.close()

#   print(rq)
#   res = {"text": "Successful Operation","bits":rq}
#   return json.dumps(res)



#  except Exception as exception:
#   return str("Error => "+str(exception))
# # readInputsFunc END


# # readHRegistersFunc
# def readHRegistersFunc(request_data):
#  try:
#   data = json.loads(request_data)

#   client.open()
#   rq = client.read_holding_registers(int(data["inputAddress"]),int(data["inputQuantity"]))
#   print(rq)
#   client.close()

#   print(rq)
#   res = {"text": "Successful Operation","bits":rq}
#   return json.dumps(res)



#  except Exception as exception:
#   return str("Error => "+str(exception))
# # readHRegistersFunc END


# # readCoilsFunc
# def readCoilsFunc(request_data):
#  try:
#   data = json.loads(request_data)

#   client.open()
#   rq = client.read_coils(int(data["coilAddress"]),int(data["coilQuantity"]))
#   client.close()
#   client.write_single_register

#   print(rq)
#   res = {"text": "Successful Operation","bits":rq}
#   return json.dumps(res)



#  except Exception as exception:
#   return str("Error => "+str(exception))
# # readCoilsFunc END


# # homeFunc
# def homeFunc():
#  return app.send_static_file("index.html")
# # homeFunc END


# # Route /api/readInputs
# @app.route("/api/readHRegisters",methods=["POST"])
# def readHRegisters():
#   return readHRegistersFunc(request.data) 
# # Route /api/readInputs END


# # Route /api/readInputs
# @app.route("/api/readInputs",methods=["POST"])
# def readInputs():
#   return readInputsFunc(request.data) 
# # Route /api/readInputs END

# # Route Operations
# #############################################################

# # Route /api/readCoils
# @app.route("/api/readCoils",methods=["POST"])
# def readCoils(): 
#  if request.data:
#   return readCoilsFunc(request.data)
#  else:
#   return readCoilsFunc(-1)
# # Route /api/readCoils END

# # Route /api/writeCoils
# @app.route("/api/writeCoils",methods=["POST"])
# def writeCoils(): return writeCoilsFunc()
# # Route /api/writeCoils END




# <pyModbusTCP.client.ModbusClient object at 0x0347E0D0>
# ['_ModbusClient__auto_close', '_ModbusClient__auto_open', '_ModbusClient__debug', '_ModbusClient__debug_msg', 
# '_ModbusClient__hd_tr_id', '_ModbusClient__hostname', '_ModbusClient__last_error', '_ModbusClient__last_except', 
# '_ModbusClient__mode', '_ModbusClient__port', '_ModbusClient__sock', '_ModbusClient__timeout', '_ModbusClient__unit_id', 
# '_ModbusClient__version', '__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', 
# '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__',
#  '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', '_add_crc', '_can_read', '_crc_is_ok', 
#  '_mbus_frame', '_pretty_dump', '_recv', '_recv_all', '_recv_mbus', '_send', '_send_mbus', 'auto_close', 'auto_open', 'close', 'debug', 'host', 
#  'is_open', 'last_error', 'last_except', 'mode', 'open', 'port', 'read_coils', 'read_discrete_inputs', 'read_holding_registers', 'read_input_registers', 
#  'timeout', 'unit_id', 'version', 'write_multiple_coils', 'write_multiple_registers', 'write_single_coil', 'write_single_register']

