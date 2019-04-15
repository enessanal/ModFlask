from helpers import *


# Controllers BEGIN
#############################################################


# homeController BEGIN
def homeController():
  return app.send_static_file("index.html")
# homeController END

# clientStatusController BEGIN
def clientStatusController(request_data=False):
  # time.sleep(1)
  global MODBUS_SERVER
  global MODBUS_SERVER_PORT
  global UNIT_IDENTIFIER
  global MODBUS_LIBRARY_ID
  global modbusClient

  if not request_data:
    return json.dumps(checkClientStatus(modbusClient))

  open_client=False

  try:
    open_client = json.loads(request_data)["open_client"]
  except Exception as exception:
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Bad Parameter"}
    return json.dumps(responseObject)




  if(open_client and checkClientStatus(modbusClient)):
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Already Opened"}
    return json.dumps(responseObject)

  if(not open_client and not checkClientStatus(modbusClient)):
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Already Closed"}
    return json.dumps(responseObject)

  if(not open_client and checkClientStatus(modbusClient)):
    modbusClient.close()
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Client Closed"}
    return json.dumps(responseObject)
  
  if(open_client and not checkClientStatus(modbusClient)):
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
# clientStatusController END  

# writeSingleCoilController BEGIN
def writeSingleCoilController(request_data=False):
  if not modbusClient.is_open():
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Client must be opened."}

  responseObject={}
  try:
    responseObject = json.loads(request_data)
    if responseObject["coilAddress"] < 0 or (responseObject["bit"]!=0 and responseObject["bit"]!=1 ):
      responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Bad Parameter"}
      return json.dumps(responseObject)

  except Exception as exception:
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Bad Parameter"}
    return json.dumps(responseObject)

  rq = modbusClient.write_single_coil(responseObject["coilAddress"],responseObject["bit"])
  if not rq : return "fail"
  return "successfull"
# writeSingleCoilController END


# writeSingleCoilController BEGIN
def writeMultipleCoilsController(request_data=False):
  if not modbusClient.is_open():
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Client must be opened."}

  responseObject={}
  try:
    responseObject = json.loads(request_data)
   
    if(responseObject["coilStartAddress"] < 0 or responseObject["quantityCoils"] < 1 or len(responseObject["coilsArray"]) != responseObject["quantityCoils"] ):
      responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Bad Parameter"}
      return json.dumps(responseObject)

  except Exception as exception:
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Bad Parameter"}
    return json.dumps(responseObject)

  rq = modbusClient.write_multiple_coils(responseObject["coilStartAddress"],responseObject["coilsArray"])

  if not rq : return "fail"
  return "successfull"
# writeSingleCo











#############################################################
# Controllers END










# Route Operations BEGIN
#############################################################

# Route home BEGIN
@app.route("/",methods=["GET"])
def homeRoute():	
  return homeController()
# Route home END


# Route clientStatus BEGIN
@app.route("/api/clientstatus",methods=["GET","POST"])
def clientRoute():
  if request.method	== "POST":
    return clientStatusController(request.data)
  else:
    return json.dumps({"host":modbusClient.host(),"port":modbusClient.port(),"message":clientStatusController()})
# Route clientStatus END


# writeSingleCoilRoute BEGIN
@app.route("/api/writeSingleCoil",methods=["POST"])
def writeSingleCoilRoute():
  return writeSingleCoilController(request.data)
# writeSingleCoilRoute END


# writeSingleCoilRoute BEGIN
@app.route("/api/writeMultipleCoils",methods=["POST"])
def writeMultipleCoilsRoute():
  return writeMultipleCoilsController(request.data)
# writeSingleCoilRoute END









#############################################################
# Route Operations END


