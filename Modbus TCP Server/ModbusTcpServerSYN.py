from pymodbus.server.sync import StartTcpServer
from pymodbus.device import ModbusDeviceIdentification
from pymodbus.datastore import ModbusSequentialDataBlock, ModbusSparseDataBlock
from pymodbus.datastore import ModbusSlaveContext, ModbusServerContext
from pymodbus.transaction import ModbusRtuFramer, ModbusBinaryFramer
import logging

HOST="localhost"
PORT=502

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
        di=ModbusSequentialDataBlock(0, [17]*100),
        co=ModbusSequentialDataBlock(0, [17]*100),
        hr=ModbusSequentialDataBlock(0, [17]*100),
        ir=ModbusSequentialDataBlock(0, [17]*100))

    context = ModbusServerContext(slaves=store, single=True)
    identity = ModbusDeviceIdentification()
    identity.VendorName = 'Pymodbus'
    identity.ProductCode = 'PM'
    # identity.VendorUrl = 'http://github.com/riptideio/pymodbus/'
    identity.ProductName = 'Pymodbus Server'
    identity.ModelName = 'Pymodbus Server'
    identity.MajorMinorRevision = '1.5'

    StartTcpServer(context, identity=identity, address=(HOST, PORT))

    
if __name__ == "__main__":
    try:
        run_server()
    except Exception as exception:
        print("!!!!!!!!!!!!!!!!!!!!!!!"+str(exception))