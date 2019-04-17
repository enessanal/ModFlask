from helpers import *

# Controllers BEGIN
#############################################################


# homeController BEGIN
def homeController():
  # return app.send_static_file("index.html")
  title="ModFlask - Flask Web Client for Modbus"
  header="Modbus Web Client"
  parameters={"title":title,"header":header}

  return render_template("index.html",parameters=parameters)
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
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Single Coil Write: Client must be opened."}
    return json.dumps(responseObject)

  requestObject={}
  try:
    requestObject = json.loads(request_data)
    if requestObject["coilAddress"] < 0 or (requestObject["bit"]!=0 and requestObject["bit"]!=1 ):
      responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Single Coil Write: Bad Parameter"}
      return json.dumps(responseObject)

  except Exception as exception:
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Single Coil Write: Bad Parameter"}
    return json.dumps(responseObject)

  modbusRequest = modbusClient.write_single_coil(requestObject["coilAddress"],requestObject["bit"])

  if not modbusRequest: 
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Single Coil Write: Fail"}
    return json.dumps(responseObject)

  responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Single Coil Write: Successfull"}
  return json.dumps(responseObject)
# writeSingleCoilController END


# writeMultipleCoilsController BEGIN
def writeMultipleCoilsController(request_data=False):
  if not modbusClient.is_open():
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Multiple Coils Write: Client must be opened."}
    return json.dumps(responseObject)

  requestObject={}
  try:
    requestObject = json.loads(request_data)
    if requestObject["coilStartAddress"] < 0 or requestObject["quantityCoils"] != len(requestObject["coilsArray"]):
      responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Multiple Coils Write: Bad Parameter"}
      return json.dumps(responseObject)

    for bit in requestObject["coilsArray"]:
      if bit != 0 and bit != 1:
        responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Multiple Coils Write: Bad Parameter"}
        return json.dumps(responseObject)

  except Exception as exception:
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Multiple Coils Write: Bad Parameter"}
    return json.dumps(responseObject)
  
  for i in range(0,len(requestObject["coilsArray"])):
    if requestObject["coilsArray"][i] == 1: requestObject["coilsArray"][i]=True
    elif requestObject["coilsArray"][i] == 0: requestObject["coilsArray"][i]=False

  modbusRequest = modbusClient.write_multiple_coils(requestObject["coilStartAddress"],requestObject["coilsArray"])

  if not modbusRequest: 
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Multiple Coils Write: Fail"}
    return json.dumps(responseObject)

  responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Multiple Coils Write: Successfull"}
  return json.dumps(responseObject)
# writeMultipleCoilsController END


# readCoilsController BEGIN
def readCoilsController(request_data=False):
  if not modbusClient.is_open():
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Read Coils: Client must be opened."}
    return json.dumps(responseObject)

  requestObject={}
  try:
    requestObject = json.loads(request_data)
    if requestObject["coilAddress"] < 0 or requestObject["quantity"] < 1:
      responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Read Coils: Bad Parameter"}
      return json.dumps(responseObject)
      
  except Exception as exception:
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Read Coils: Bad Parameter"}
    return json.dumps(responseObject)
  
  modbusRequest = modbusClient.read_coils(requestObject["coilAddress"],requestObject["quantity"])

  for i in range(0,len(modbusRequest)):
    if modbusRequest[i]: modbusRequest[i]=1
    elif not modbusRequest[i]: modbusRequest[i]=0

  responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Read Coils: Successfull","response":modbusRequest}

  return json.dumps(responseObject)
# readCoilsController END


# writeRegisterController BEGIN
def writeRegisterController(request_data=False):
  if not modbusClient.is_open():
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Single Register Write: Client must be opened."}
    return json.dumps(responseObject)

  requestObject={}
  try:
    requestObject = json.loads(request_data)
    if requestObject["registerAddress"] < 0:
      responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Single Register Write: Bad Parameter"}
      return json.dumps(responseObject)

  except Exception as exception:
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Single Register Write: Bad Parameter"}
    return json.dumps(responseObject)

  modbusRequest = modbusClient.write_single_register(requestObject["registerAddress"],requestObject["registerValue"])

  if not modbusRequest: 
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Single Register Write: Fail"}
    return json.dumps(responseObject)

  responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Single Register Write: Successfull"}
  return json.dumps(responseObject)
# writeRegisterController END


# writeMultipleRegistersController BEGIN
def writeMultipleRegistersController(request_data=False):
  if not modbusClient.is_open():
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Multiple Coils Write: Client must be opened."}
    return json.dumps(responseObject)

  requestObject={}
  try:
    requestObject = json.loads(request_data)
    if requestObject["registerStartAddress"] < 0 or requestObject["quantityRegisters"] != len(requestObject["registersArray"]):
      responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Multiple Coils Write: Bad Parameter"}
      return json.dumps(responseObject)

  except Exception as exception:
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Multiple Coils Write: Bad Parameter"}
    return json.dumps(responseObject)

  modbusRequest = modbusClient.write_multiple_registers(requestObject["registerStartAddress"],requestObject["registersArray"])

  if not modbusRequest: 
    responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Multiple Coils Write: Fail"}
    return json.dumps(responseObject)

  responseObject={"host":modbusClient.host(),"port":modbusClient.port(),"message":"Multiple Coils Write: Successfull"}
  return json.dumps(responseObject)
# writeMultipleRegistersController END




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


# readCoilsRoute BEGIN
@app.route("/api/readCoils",methods=["POST"])
def readCoilsRoute():
  return readCoilsController(request.data)
# readCoilsRoute END


# writeRegisterRoute BEGIN
@app.route("/api/writeRegister",methods=["POST"])
def writeRegisterRoute():
  return writeRegisterController(request.data)
# writeRegisterRoute END


# writeMultipleRegistersRoute BEGIN
@app.route("/api/writeMultipleRegisters",methods=["POST"])
def writeMultipleRegistersRoute():
  return writeMultipleRegistersController(request.data)
# writeMultipleRegistersRoute END




#############################################################
# Route Operations END


