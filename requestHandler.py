#!/usr/bin/python
from flask import Flask, render_template
import sqlite3
import json
"""                        tableNames: ['patient_nucleobase','pathogenic_prob'],
                        attributes:['seq', 'patient_id'],
                        operatorAndOr: ['And', 'Or'],
                        condition: ['=','like','!=','<=','>=','<','>'],
                        data: '[{"seq":"ATP6","patient_id":"8527"},{"seq":"ATP8","patient_id":"8366"},{"seq":"ZTP12" , "patient_id":"2334"} , {"seq":"Bdfd","patient_id":"1000000"}]',"""
app = Flask(__name__)
#takes patient_nuclebase, pathogenic_prob as url arguments.
@app.route("/")
def index():
   return render_template("index.html")

@app.route('/renderAttributeNames/<tableName>', methods=['POST','GET'])
def getTableAttributes(tableName):
	attributes = {}
	attributes["columns"] = getAttributes(tableName)
        return json.dumps(attributes)

@app.route('/renderTableContents/<tableName>', methods=['POST','GET'])
def getTableContents(tableName):
        jsonTable = {}
	jsonTable['columns'] = createColumnList(tableName)
	jsonTable['content'] = geTableContents(tableName)

	return json.dumps(jsonTable)

def geTableContents(tableName):
        con = sqlite3.connect("mito.db")
        cur = con.cursor()

        cur.execute("Select * from "+tableName)
        rawTableContents = cur.fetchall()

	attributes = getAttributes(tableName)

        tableContents=[]
        for r in rawTableContents:
                eachLine={}
                for i in range(len(r)):
                        eachLine[attributes[i]] = r[i].encode('ascii','ignore')
                tableContents.append(eachLine)
        return tableContents
	

def createColumnList(tableName):

        attributes = getAttributes(tableName)

        colJsonList = []

        for attr in attributes:
                col = {}
                col['Header'] = attr.capitalize()
                col['accessor'] = attr
                colJsonList.append(col)

	return colJsonList


def getAttributes(tableName):
        con = sqlite3.connect("mito.db")
        cur = con.cursor()
        cur.execute("PRAGMA table_info("+tableName+")")
        attributeNames=cur.fetchall()
        con.commit()
        con.close()
	return [attribute[1].encode('ascii','ignore') for attribute in attributeNames]

if __name__ == '__main__':
        app.run('0.0.0.0',5000)
