import os
import json

from pyModbusTCP.client import ModbusClient
from flask import Flask
from flask import request
from time import sleep


# Configurations BEGIN
#############################################################
HOST = "127.0.0.1"
PORT = 8001

MODBUS_SERVER = "127.0.0.1"
MODBUS_SERVER_PORT = 502
UNIT_IDENTIFIER = 0
ASSETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), './static')
app = Flask(__name__)
app = Flask(__name__, template_folder=ASSETS_DIR, static_folder=ASSETS_DIR)
modbusClient = ModbusClient(MODBUS_SERVER,MODBUS_SERVER_PORT,UNIT_IDENTIFIER,auto_open=None)

#############################################################
# Configurations END




# HelperFunctions BEGIN
#############################################################

# Function checkClientStatus BEGIN
def checkClientStatus():
  return modbusClient.is_open()
# Function checkClientStatus END





#############################################################
# HelperFunctions END





# Controllers BEGIN
#############################################################

def homeController():
  return app.send_static_file("index.html")

def clientStatusController(request_data=False):
  # sleep(1)
  if not request_data:
    return json.dumps(checkClientStatus())


  if json.loads(request_data):
    if checkClientStatus():
      return "Already Opened"
    else:
      modbusClient.open()
      return "Client Opened"
  else:
    if checkClientStatus():
      modbusClient.close()
      return "Client Closed"
    else:
      return "Already Closed"
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
    return clientStatusController()
# Route clientStatus END







#############################################################
# Route Operations END





if __name__ == "__main__":
	app.run(host=HOST, port=PORT,debug=True)



























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

# # Route /
# @app.route("/",methods=["GET"])
# def home():	return homeFunc()
# # Route / END


# #############################################################
# # Route Operations END







# if __name__ == "__main__":
# 	app.run(host=HOST, port=PORT,debug=False) 