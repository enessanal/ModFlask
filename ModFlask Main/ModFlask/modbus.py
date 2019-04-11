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
        try:
          if not modbusClient.open(): responseObject["message"]="Connection Cannot Be Initiated"
        except Exception as exception:
          print(str(exception))
          responseObject["message"]=str(exception)
          
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
      

def writeSingleCoilController(request_data=False):
  responseObject=json.loads(request_data)
  print(modbusClient.write_single_coil(responseObject["coilAddress"],responseObject["bit"]))
  return "ok"




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



# Route writeSingleCoil BEGIN
@app.route("/api/writeSingleCoil",methods=["POST"])
def writeSingleCoil():
  return writeSingleCoilController(request.data)
# Route writeSingleCoil END




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