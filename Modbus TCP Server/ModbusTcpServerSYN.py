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
    # print("debug started\n\n")

    
    # print(dir(store))
    store.setValues(3,53,[30000])
    store.setValues(3,32,[14373])
    store.setValues(3,33,[28911])
    store.setValues(3,61,[59626])
    store.setValues(3,26,[22288])
    store.setValues(3,89,[59530])
    store.setValues(3,90,[22198])
    store.setValues(3,2,[27306])
    store.setValues(3,10,[24285])
    store.setValues(3,52,[9160])
    store.setValues(3,32,[8707])
    store.setValues(3,74,[41718])
    store.setValues(3,78,[40553])
    store.setValues(3,93,[44444])
    store.setValues(3,65,[45136])
    store.setValues(3,24,[39191])

    store.setValues(2,1,[1])
    store.setValues(2,12,[1])
    store.setValues(2,101,[1])
    store.setValues(2,8,[1])
    store.setValues(2,94,[1])
    store.setValues(2,23,[1])
    store.setValues(2,34,[1])
    store.setValues(2,65,[1])
    store.setValues(2,66,[1])
    store.setValues(2,67,[1])
    store.setValues(2,97,[1])
    store.setValues(2,99,[1])
    store.setValues(2,14,[1])
    store.setValues(2,76,[1])


    store.setValues(1,1,[1])
    store.setValues(1,11,[1])
    store.setValues(1,21,[1])
    store.setValues(1,31,[1])
    store.setValues(1,41,[1])
    store.setValues(1,42,[1])
    store.setValues(1,101,[1])
    store.setValues(1,129,[1])
    store.setValues(1,259,[1])
    store.setValues(1,111,[1])
    store.setValues(1,192,[1])


    store.setValues(4,0,[22])
    store.setValues(4,19,[69])
    store.setValues(4,40,[99])
    store.setValues(4,51,[14])
    store.setValues(4,17,[35])
    store.setValues(4,28,[24])
    store.setValues(4,54,[31])
    store.setValues(4,7,[84])
    store.setValues(4,12,[31])
    store.setValues(4,43,[7])
    store.setValues(4,53,[54])
    store.setValues(4,2,[69])
    store.setValues(4,35,[38])
    store.setValues(4,53,[50])
    store.setValues(4,17,[99])






    # print("\n\ndebug finished")
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
