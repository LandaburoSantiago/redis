from crypt import methods
from flask import Flask, jsonify, render_template, request
from redis import Redis
import json
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

def connect_db():
    conexion = Redis('redis', port=6379, decode_responses=True)
    if(conexion.ping()):
        print("Conectado al servidor de redis")
    else:
        print("error")
    return conexion

@app.route("/")
def index():
    return "apiflask"

@app.route("/list")
def list():
    conexion = connect_db()
    
    # conexion.flushdb()
    # conexion.select(0)
    # conexion.set("The Mandalorian","1")
    # conexion.set("The Child","2")
    # conexion.set("The Sin","3")
    # conexion.set("Sanctuary","4")
    # conexion.set("The Gunslinger","5")
    # conexion.set("The Prisoner","6")
    # conexion.set("The Reckoning","7" )
    # conexion.set( "Redemption","8")
    keys = conexion.keys("*")
    values = {}

    for i in keys:
        values[str(i)]=conexion.get(i) 
    return json.dumps(values)

@app.route("/listAvailability")
def listAvailability():
    conexion = connect_db()
    conexion.select(1)
    keys = conexion.keys("*")
    values = {}
    chapters = ["1","2","3","4","5","6","7","8"]
    chapters_difference =[]
    for element in chapters:
        if element not in keys:
            conexion.set(element,"disponible")
    for i in keys:
        if str(i) in chapters:
            values[str(i)]=conexion.get(i) 
        else:
            print(i)
            conexion.set(i, "disponible")
            values[str(i)]=conexion.get(i)

    return json.dumps(values)

@app.route("/rent", methods=["POST"])
def rent():
    if request.method == "POST":
        print(request.args["chapter"])
        conexion = connect_db()
        conexion.select(1)
        conexion.setex(request.args["chapter"], 240, "reservado")
    return "ok"

@app.route("/confirmPay", methods=["POST"])
def confirmPay():
    if request.method == "POST":
        print(request.args["chapter"])
        conexion = connect_db()
        conexion.select(1)
        conexion.setex(request.args["chapter"], 86400, "alquilado")
    return "ok"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000", debug=True)