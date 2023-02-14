from flask import (Blueprint, jsonify, flash, redirect,
                   url_for, request, render_template, Response)
from db.DB import DB
from upload import upload_file
from util.check_data import default_values
import os
from models.linije import Linije
from util.check_data import check_parameters, default_values, if_exists

linije_services = Blueprint("linije_services", __name__)


@linije_services.route("/linijeNov", methods=['GET', 'POST'])
def linijeNov():

    mydb = DB.connect()
    cursor = mydb.cursor(prepared=True)
    data = request.json

    mestoPolaska = data["mestoPolaska"]
    mestoDolaska = data["mestoDolaska"]
    vremePolaska = data["vremePolaska"]
    vremeDolaska = data["vremeDolaska"]
    prevoznik = data["prevoznik"]
    datumPolaska = data["datumPolaska"]
    datumDolaska = data["datumDolaska"]

    form_linija = [mestoPolaska, mestoDolaska, vremePolaska,
                   vremeDolaska, prevoznik, datumPolaska, datumDolaska]

    photoUrl = upload_file()

    if photoUrl == False:
        return render_template(file_error="Invalid type of file!", mestoPolaska=form_linija[0], mestoDolaska=form_linija[1], vremePolaska=form_linija[2], vremeDolaska=form_linija[3], prevoznik=form_linija[4], datumPolaska=form_linija[5], datumDolaska=form_linija[6])

    cursor = mydb.cursor(prepared=True)
    q = "INSERT INTO linije VALUES(null,%s, %s, %s, %s, %s, %s, %s)"
    all_keys = ["mestoPolaska", "mestoDolaska", "vremePolaska",
                "vremeDolaska", "prevoznik", "datumPolaska", "datumDolaska"]
    data = default_values(data, all_keys)
    parameters = (

        data["mestoPolaska"],
        data["mestoDolaska"],
        data["vremePolaska"],
        data["vremeDolaska"],
        data["prevoznik"],
        data["datumPolaska"],
        data["datumDolaska"]
    )
    cursor.execute(q, parameters)
    mydb.commit()

    return Response(status=200)


@linije_services.route("/linija", methods=["GET"])
def linije():
    mydb = DB.connect()
    cursor = mydb.cursor(prepared=True)
    cursor.execute("SELECT * FROM bus.linije")
    row = cursor.fetchall()

    def toHrs(seconds):
        seconds = seconds % (24 * 3600)
        hour = seconds // 3600
        seconds %= 3600
        minutes = seconds // 60
        seconds %= 60
        return "%d:%02d:%02d" % (hour, minutes, seconds)
    list_linije = []
    for linija in row:
        list_linije.append({
            'id': linija[0],
            'mestoPolaska': linija[1],
            'mestoDolaska': linija[2],
            'vremePolaska': toHrs(linija[3].seconds),
            'vremeDolaska': toHrs(linija[4].seconds),
            'prevoznik': linija[5],
            'datumPolaska': str(linija[6].year) + '-' + str(linija[6].month) + '-' + str(linija[6].day),
            'datumDolaska': str(linija[7].year) + '-' + str(linija[7].month) + '- ' + str(linija[7].day)
        })

    return jsonify(list_linije)


@linije_services.route("/filterLinija", methods=["POST"])
def filterLinije():
    mestoPolaska = request.json['mestoPolaska']
    mestoDolaska = request.json['mestoDolaska']
    datumPolaska = request.json['datumPolaska']
    mydb = DB.connect()
    cursor = mydb.cursor(prepared=True)
    cursor.execute("SELECT * FROM bus.linije WHERE mestoPolaska=%s AND mestoDolaska=%s AND datumPolaska=%s ",
                   (mestoPolaska, mestoDolaska, datumPolaska))
    row = cursor.fetchall()

    def toHrs(seconds):
        seconds = seconds % (24 * 3600)
        hour = seconds // 3600
        seconds %= 3600
        minutes = seconds // 60
        seconds %= 60
        return "%d:%02d:%02d" % (hour, minutes, seconds)

    list_linije = []
    for linija in row:
        list_linije.append({
            'id': linija[0],
            'mestoPolaska': linija[1],
            'mestoDolaska': linija[2],
            'vremePolaska': toHrs(linija[3].seconds),
            'vremeDolaska': toHrs(linija[4].seconds),
            'prevoznik': linija[5],
            'datumPolaska': str(linija[6].year) + ', ' + str(linija[6].month) + ', ' + str(linija[6].day),
            'datumDolaska': str(linija[7].year) + ', ' + str(linija[7].month) + ', ' + str(linija[7].day)
        })

    return jsonify(list_linije)


@linije_services.route('/delete/<idlinije>', methods=['POST'])
def delete_linija(idlinije):
    table = "linije"
    condition = "idlinije"
    data = idlinije
    DB.delete_query(table_name=table, condition=condition, data=data)
    flash('Linije Removed Successfully')
    return Response(status=200)


@linije_services.route("/update/<idlinije>", methods=["GET"])
def upd(idlinije):
    mydb = DB.connect()
    cursor = mydb.cursor(prepared=True)
    cursor.execute("SELECT * FROM linije WHERE idlinije=%s", (idlinije,))
    row = cursor.fetchone()

    if row == None:
        return redirect(url_for("employee_services.index"))

    row = clear_bytearray(row)
    idlinije = row[0]
    mestoPolaska = row[1]
    mestoDolaska = row[2]
    vremePolaska = row[3]
    vremeDolaska = row[4]
    prevoznik = row[5]
    datumPolaska = row[6]
    datumDolaska = row[7]

    linija = Linije(idlinije, mestoPolaska, mestoDolaska, vremePolaska,
                        vremeDolaska, prevoznik, datumPolaska, datumDolaska)

    return render_template("update.html", linija=linija)


@linije_services.route("/update/<id>", methods=["POST"])
def update(idlinije):
    data = request.form
    mydb = DB.connect()
    cursor = mydb.cursor(prepared=True)
        
    photoUrl = upload_file()
    if photoUrl == False:
        idlinije = idlinije
        mestoPolaska = data['mestoPolaska']
        mestoDolaska = data['mestoDolaska']
        vremePolaska = data['vremePolaska']
        vremeDolaska = data['vremeDolaska']
        prevoznik = data['prevoznik']
        datumPolaska = data['datumPolaska']
        datumDolaska = data['datumDolaska']
        cursor.execute("SELECT * FROM linije WHERE idlinije=%s", (idlinije,))
        row = cursor.fetchone()
        row = clear_bytearray(row)
        current_photoUrl = row[7]
        linije = Linije(idlinije=idlinije, mestoPolaska=mestoPolaska, mestoDolaska=mestoDolaska, vremePolaska=vremePolaska,
                            vremeDolaska=vremeDolaska, prevoznik=prevoznik, datumPolaska=datumPolaska, datumDolaska=datumDolaska, photoUrl=current_photoUrl)
        return render_template("update.html", linije=linije, file_error="Invalid type of file!")

    cursor.execute("SELECT * FROM linije WHERE idlinije=%s", (idlinije,))
    row = cursor.fetchone()
    row = clear_bytearray(row)
    q = """UPDATE linije SET `mestoPolaska`=%s, `mestoDolaska`=%s, `vremePolaska`=%s, `vremeDolaska`=%s, `prevoznik`=%s, `datumPolaska`=%s, `datumDolaska`=%s, `photo_url`=%s WHERE `idlinije`=%s"""
    photo = row[7]

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

    keys = ["mestoPolaska", "mestoDolaska", "vremePolaska",
            "vremeDolaska", "prevoznik", "datumPolaska", "datumDolaska"]
    data = if_exists(data, row, keys)
    parameters = (
        data["mestoPolaska"],
        data["mestoDolaska"],
        data["vremePolaska"],
        data["vremeDolaska"],
        data["prevoznik"],
        data["datumPolaska"],
        data["datumDolaska"],
        photoUrl,
        id)
    DB.update_query(q, parameters)
    return redirect(url_for("employee_services.index"))

def clear_bytearray(rows):
    rows = list(rows)
    n = len(rows)
    for i in range(n):
        if isinstance(rows[i], bytearray):
            rows[i] = rows[i].decode()

    return rows