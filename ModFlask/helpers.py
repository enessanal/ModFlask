from configurations import *

# HelperFunctions BEGIN
#############################################################

# Function checkClientStatus BEGIN
def checkClientStatus(modbusClient):
 if MODBUS_LIBRARY_ID == 0: return modbusClient.is_open()
 if MODBUS_LIBRARY_ID == 1: return modbusClient.is_socket_open()
# Function checkClientStatus END

#############################################################
# HelperFunctions END
