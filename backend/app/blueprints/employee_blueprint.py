import os
from functools import wraps
from db.DB import DB
from flask import (Blueprint, flash, jsonify, redirect, render_template,
                   request, session, url_for)
from models.employee import Employee
from upload import upload_file
from util.check_data import check_parameters, default_values, if_exists

employee_services = Blueprint("employee_services", __name__)


def login_required(fnc):
    @wraps(fnc)
    def wrap(*args, **kwargs):
        if 'loggedin' in session:
            return fnc(*args, **kwargs)
        else:
            return redirect(url_for('user_services.login_page'))
    return wrap


@employee_services.route('/', methods=['GET'])
@login_required
def index():
    mydb = DB.connect()
    cursor = mydb.cursor(prepared=True)
    emp = "SELECT * FROM employee WHERE employee.order >= 1 ORDER BY employee.order ASC"
    cursor.execute(emp)
    row = cursor.fetchall()
    emp = "SELECT * FROM employee WHERE employee.order = 0 ORDER BY RAND()"
    cursor.execute(emp)
    row.extend(cursor.fetchall())
    n = len(row)

    for i in range(n):
        row[i] = clear_bytearray(row[i])
    list_employees = []
    for emp in row:
        id = emp[0]
        firstName = emp[1]
        lastName = emp[2]
        order = emp[3]
        linkedIn = emp[4]
        xing = emp[5]
        role = emp[6]
        email = emp[7]
        photoUrl = emp[8]
        employee = Employee(id, firstName, lastName, order,
                            linkedIn, xing, role, email, photoUrl)
        list_employees.append(employee)

    return render_template("index.html", list_employees=list_employees)


@employee_services.route('/get', methods=['GET'])
def get():
    mydb = DB.connect()
    cursor = mydb.cursor(prepared=True)
    emp = "SELECT * FROM employee WHERE employee.order >= 1 ORDER BY employee.order ASC"
    cursor.execute(emp)
    row = cursor.fetchall()
    emp = "SELECT * FROM employee WHERE employee.order = 0 ORDER BY RAND()"
    cursor.execute(emp)
    row.extend(cursor.fetchall())
    n = len(row)

    for i in range(n):
        row[i] = clear_bytearray(row[i])
    list_employees = []
    for emp in row:
        id = emp[0]
        firstName = emp[1]
        lastName = emp[2]
        order = emp[3]
        linkedIn = emp[4]
        xing = emp[5]
        role = emp[6]
        email = emp[7]
        photoUrl = emp[8]
        employee = Employee(id, firstName, lastName, order,
                            linkedIn, xing, role, email, photoUrl)
        list_employees.append(employee.to_dict())

    return jsonify(list_employees)


@employee_services.route('/delete/<id>', methods=['POST'])
def delete_employee(id):
    q = "SELECT * FROM employee WHERE id=%s"
    parameters = (id,)
    employee = DB.select_query(query_string=q, parameters=parameters)
    photoUrl = employee[0]['photo_url']
    if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__))[:os.path.dirname(os.path.abspath(__file__)).rindex(os.path.sep)], "static" + photoUrl)) and photoUrl != "":
        os.remove(os.path.join(os.path.dirname(os.path.abspath(__file__))[:os.path.dirname(
            os.path.abspath(__file__)).rindex(os.path.sep)], "static" + photoUrl))
    table = "employee"
    condition = "id"
    data = id
    DB.delete_query(table_name=table, condition=condition, data=data)
    flash('Employee Removed Successfully')
    return redirect(url_for('employee_services.index'))


@employee_services.route("/register", methods=["GET"])
@login_required
def register():
    return render_template("register.html")


@employee_services.route("/register", methods=["POST"])
def registration():
    mydb = DB.connect()
    cursor = mydb.cursor(prepared=True)
    data = request.form

    reqired_keys = ["firstName", "role"]
    if not check_parameters(data.keys(), reqired_keys):
        return "Invalid missing parameters"

    firstName = data["firstName"]
    lastName = data["lastName"]
    order = data["order"]
    linkedIn = data["linkedIn"]
    xing = data["xing"]
    role = data["role"]
    email = data["email"]

    form_employee = [firstName, lastName, order, linkedIn, xing, role]

    photoUrl = upload_file()

    if photoUrl == False:
        return render_template("register.html", file_error="Invalid type of file!", email=email, firstName=form_employee[0], lastName=form_employee[1], order=form_employee[2], linkedIn=form_employee[3], xing=form_employee[4], role=form_employee[5])

    cursor = mydb.cursor(prepared=True)
    q = "INSERT INTO employee VALUES(null,%s,%s,%s,%s,%s,%s,%s,%s)"
    all_keys = ["firstName", "lastName", "order",
                "linkedIn", "xing", "role", "email"]
    data = default_values(data, all_keys)

    parameters = (
        data["firstName"],
        data["lastName"],
        data["order"],
        data["linkedIn"],
        data["xing"],
        data["role"],
        data["email"],
        photoUrl,
    )
    cursor.execute(q, parameters)
    mydb.commit()
    return redirect(url_for("employee_services.index"))


@employee_services.route("/update/<id>", methods=["GET"])
@login_required
def upd(id):
    mydb = DB.connect()
    cursor = mydb.cursor(prepared=True)
    cursor.execute("SELECT * FROM employee WHERE id=%s", (id,))
    row = cursor.fetchone()

    if row == None:
        return redirect(url_for("employee_services.index"))

    row = clear_bytearray(row)
    id = row[0]
    firstName = row[1]
    lastName = row[2]
    order = row[3]
    linkedIn = row[4]
    xing = row[5]
    role = row[6]
    email = row[7]
    photoUrl = row[8]

    employee = Employee(id, firstName, lastName, order,
                        linkedIn, xing, role, email, photoUrl)

    return render_template("update.html", employee=employee)


@employee_services.route("/update/<id>", methods=["POST"])
@login_required
def update(id):
    data = request.form
    mydb = DB.connect()
    cursor = mydb.cursor(prepared=True)
        
    photoUrl = upload_file()
    if photoUrl == False:
        id = id
        firstName = data['firstName']
        lastName = data['lastName']
        order = data['order']
        linkedIn = data['linkedIn']
        xing = data['xing']
        role = data['role']
        current_email = data['email']
        cursor.execute("SELECT * FROM employee WHERE id=%s", (id,))
        row = cursor.fetchone()
        row = clear_bytearray(row)
        current_photoUrl = row[8]
        employee = Employee(id=id, firstName=firstName, lastName=lastName, order=order,
                            linkedIn=linkedIn, xing=xing, role=role, email=current_email, photoUrl=current_photoUrl)
        return render_template("update.html", employee=employee, file_error="Invalid type of file!")

    cursor.execute("SELECT * FROM employee WHERE id=%s", (id,))
    row = cursor.fetchone()
    row = clear_bytearray(row)
    q = """UPDATE employee SET `first_Name`=%s, `last_name`=%s, `order`=%s, `linked_in`=%s, `xing`=%s, `role`=%s, `email`=%s, `photo_url`=%s WHERE `id`=%s"""
    photo = row[8]

    if data['deletePhoto'] == '1' and photo != "":
        if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__))[:os.path.dirname(os.path.abspath(__file__)).rindex(os.path.sep)], "static" + photo)):
            os.remove(os.path.join(os.path.dirname(os.path.abspath(__file__))[
                      :os.path.dirname(os.path.abspath(__file__)).rindex(os.path.sep)], "static" + photo))
        photoUrl = ''
    elif data['deletePhoto'] == '1' and photoUrl != "":
        if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__))[:os.path.dirname(os.path.abspath(__file__)).rindex(os.path.sep)], "static" + photoUrl)):
            os.remove(os.path.join(os.path.dirname(os.path.abspath(__file__))[:os.path.dirname(
                os.path.abspath(__file__)).rindex(os.path.sep)], "static" + photoUrl))
        photoUrl = ''
    elif photoUrl == '' and photo != '':
        photoUrl = photo
    elif photoUrl != photo:
        if photo != '':
            if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__))[:os.path.dirname(os.path.abspath(__file__)).rindex(os.path.sep)], "static" + photo)):
                os.remove(os.path.join(os.path.dirname(os.path.abspath(__file__))[
                          :os.path.dirname(os.path.abspath(__file__)).rindex(os.path.sep)], "static" + photo))

    keys = ["firstName", "lastName", "order",
            "linkedIn", "xing", "role", "email"]
    data = if_exists(data, row, keys)
    parameters = (
        data["firstName"],
        data["lastName"],
        data["order"],
        data["linkedIn"],
        data["xing"],
        data["role"],
        data["email"],
        photoUrl,
        id)
    DB.update_query(q, parameters)
    return redirect(url_for("employee_services.index"))


@employee_services.route('/logout')
def logout():
    if 'username' in session:
        session.pop('loggedin', None)
        session.pop('username', None)
    return redirect(url_for('user_services.login_page'))


def clear_bytearray(rows):
    rows = list(rows)
    n = len(rows)
    for i in range(n):
        if isinstance(rows[i], bytearray):
            rows[i] = rows[i].decode()

    return rows
