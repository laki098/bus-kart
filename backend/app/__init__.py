from flask import Flask

from blueprints.employee_blueprint import employee_services
from blueprints.korisnik_blueprint import korisnik_services
from blueprints.linije_blueprint import linije_services
from blueprints.autobusi_blueprint import autobusi_services
from initialization import init

app = Flask(__name__, static_url_path="")

app.config['MAX_CONTENT_LENGTH'] = 50 * 1000 * 1000
app.secret_key = "busSub*"

app.register_blueprint(korisnik_services, url_prefix="/korisnik")
app.register_blueprint(linije_services, url_prefix="/linije")
app.register_blueprint(employee_services, url_prefix="/employees")
app.register_blueprint(autobusi_services, url_prefix="/autobusi")
init()


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


@app.route("/")
def redirection():
    return "Hello"


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
