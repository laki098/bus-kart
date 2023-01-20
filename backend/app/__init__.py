from flask import Flask

from blueprints.employee_blueprint import employee_services
from blueprints.user_blueprint import user_services
from initialization import init

app = Flask(__name__, static_url_path="")

app.config['MAX_CONTENT_LENGTH'] = 50 * 1000 * 1000
app.secret_key = "busSub*"

app.register_blueprint(user_services, url_prefix="/users")
app.register_blueprint(employee_services, url_prefix="/employees")
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