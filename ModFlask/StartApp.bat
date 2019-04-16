nodemon --watch *.py --watch static/index.html --exec "python" ./main.py

::nodemon --watch modbus.py -e js,css,html --watch static --exec "python" ./modbus.py