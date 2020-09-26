from flask import Flask

app = Flask(__name__)



@app.route('/')
def Index():
    return "PaginaDeInicioOscar"


@app.route('/recolectorManos')
def HandsRecollector():
    return "PaginaDeManos"

@app.route('/protocolo')
def protocol():
    return "PaginaDeBrayan"

if __name__ == '__main__':
    app.run(port=3000, debug=True)

