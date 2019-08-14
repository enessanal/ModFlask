import sys
import importlib

if sys.version_info.major is not 3:
 print("! Only Python3 !")
 exit()

moduleNames=[]
moduleNames.append("pymodbus")
moduleNames.append("logging")
moduleNames.append("argparse")

#for moduleName in moduleNames:
# if(importlib.util.find_spec(moduleName) is None):
#  print('\nPlease install the "{}" module first.'.format(moduleName),end=" => ")
#  print('pip3 install {}'.format(moduleName))
#  exit()

try:
	import importlib
	for moduleName in moduleNames:
	 if(importlib.util.find_spec(moduleName) is None):
	  print('\nPlease install the "{}" module first.'.format(moduleName),end=" => ")
	  print('pip3 install {}'.format(moduleName))
	  exit()

except Exception as exception:
	from importlib import util
	for moduleName in moduleNames:
	 if(util.find_spec(moduleName) is None):
	  print('\nPlease install the "{}" module first.'.format(moduleName),end=" => ")
	  print('pip3 install {}'.format(moduleName))
	  exit()	


from pymodbus.server.sync import StartTcpServer
from pymodbus.device import ModbusDeviceIdentification
from pymodbus.datastore import ModbusSequentialDataBlock, ModbusSparseDataBlock
from pymodbus.datastore import ModbusSlaveContext, ModbusServerContext
from pymodbus.transaction import ModbusRtuFramer, ModbusBinaryFramer
import logging
import argparse


argumentParser=argparse.ArgumentParser(description='Modbus TCP Server')
argumentParser.add_argument("--host",help="Host",default="127.0.0.1")
argumentParser.add_argument("--port",help="Port",type=int,default=502)
arguments=argumentParser.parse_args()




HOST=arguments.host
PORT=arguments.port

# Log Configuration
##########################################
LOG_FILE_NAME="ModbusServer.log"
LOG_FILE_MODE="a"
LOG_LEVEL=logging.DEBUG
LOG_FORMAT = ('%(asctime)-15s %(threadName)-15s' ' %(levelname)-8s %(module)-15s:%(lineno)-8s %(message)s')
LOG_FORMATTER=logging.Formatter(LOG_FORMAT)
fileHandler = logging.FileHandler(LOG_FILE_NAME,LOG_FILE_MODE)
fileHandler.setFormatter(LOG_FORMATTER)
logging.basicConfig(format=LOG_FORMAT)
log = logging.getLogger()
log.setLevel(LOG_LEVEL)
log.addHandler(fileHandler)
##########################################
# Log Configuration END


def run_server():
    store = ModbusSlaveContext(
        di=ModbusSequentialDataBlock(0, [0]*10000),
        co=ModbusSequentialDataBlock(0, [0]*10000),
        hr=ModbusSequentialDataBlock(0, [0]*10000),
        ir=ModbusSequentialDataBlock(0, [0]*10000))

    context = ModbusServerContext(slaves=store, single=True)
    identity = ModbusDeviceIdentification()
    identity.VendorName = 'Pymodbus'
    identity.ProductCode = 'PM'
    # identity.VendorUrl = 'http://github.com/riptideio/pymodbus/'
    identity.ProductName = 'Pymodbus Server'
    identity.ModelName = 'Pymodbus Server'
    identity.MajorMinorRevision = '1.5'
    #-----------------------------------------------------
    print("debug started\n\n")

    
    print(dir(store))
    store.setValues(3,53,[30000])






    print("\n\ndebug finished")
    #-----------------------------------------------------
    print("Listening on {}:{}".format(HOST,PORT))
    StartTcpServer(context, identity=identity, address=(HOST, PORT))

    
if __name__ == "__main__":
    try:
        run_server()
    except KeyboardInterrupt:
        print("! Keyboard Interrupt")
    except Exception as exception:
        print("! "+str(exception))
