#!/usr/bin/python
from flask import Flask, render_template, request
import sqlite3
import json
import MySQLdb
import decimal

app = Flask(__name__)

config = {
  'user': 'anirudh',
  'passwd': 'i_anirudh',
  'db': 'db_mito',
}

@app.route("/")
def index():
   return render_template("index.html")

@app.route('/getTables', methods=['POST','GET'])
def getTables():
	con = MySQLdb.connect(**config)
	cur = con.cursor()

	cur.execute("show tables")
	showtables = cur.fetchall()
	tables = {}
	tables['tables'] = [x[0] for x in showtables]

	return json.dumps(tables)

@app.route('/renderAttributeNames/<tableName>', methods=['POST','GET'])
def getTableAttributes(tableName):
	attributes = {}
	attributes["columns"] = getAttributes(tableName)
        return json.dumps(attributes)

@app.route('/renderTableContents/<tableName>', methods=['POST','GET'])
def getTableContents(tableName):
        jsonTable = {}
	jsonTable['columns'] = createColumnList(tableName)

	filters = json.loads(request.get_data(), object_hook=_decode_dict)["filters"]
	jsonTable['content'] = geTableContents(tableName, filters)
	
	#print(jsonTable)
	return json.dumps(jsonTable)

def geTableContents(tableName, filters):
        con = MySQLdb.connect(**config)
        cur = con.cursor()

	filterList = []
	if filters is not None:
		for fil in filters:
			f = filters[fil]
			if(f is not None and f["operator"] is not None and f["attr"] is not None and f["condition"] is not None):
				filterList.append(f)

	filterStatement = ''
	if len(filterList) > 0:
		i = 0
		filterStatement += ' where '
		if(filterList[i]["text"] is None):
			filterList[i]["text"] = "null"
		filterStatement += filterList[i]["attr"]+" "+filterList[i]["condition"]+" "+filterList[i]["text"]
		i += 1
		while i < len(filterList):
			if(filterList[i]["text"] is None):
                        	filterList[i]["text"] = "null"
			filterStatement += filterList[i]["operator"]+" "+filterList[i]["attr"]+" "+filterList[i]["condition"]+" "+filterList[i]["text"]
			i += 1
		
	selectQuery = "Select * from "+tableName+filterStatement

	print(selectQuery)
	
        cur.execute(selectQuery)
        rawTableContents = cur.fetchall()

	attributes = getAttributes(tableName)

        tableContents=[]
        for row in rawTableContents:
                eachLine={}
                for i in range(len(row)):
			if type(row[i]) is decimal.Decimal:
				eachLine[attributes[i]] = float(row[i])
			elif type(row[i]) is long:
				eachLine[attributes[i]] = int(row[i])
			else:
                        	eachLine[attributes[i]] = row[i]
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
        con = MySQLdb.connect(**config)
        cur = con.cursor()
        cur.execute("Desc "+tableName)
        attributeNames=cur.fetchall()
        con.commit()
        con.close()
	return [attribute[0].encode('ascii','ignore') for attribute in attributeNames]

# source: https://stackoverflow.com/questions/956867/how-to-get-string-objects-instead-of-unicode-from-json#6633651
def _decode_dict(data):
    rv = {}
    for key, value in data.iteritems():
        if isinstance(key, unicode):
            key = key.encode('utf-8')
        if isinstance(value, unicode):
            value = value.encode('utf-8')
        elif isinstance(value, list):
            value = _decode_list(value)
        elif isinstance(value, dict):
            value = _decode_dict(value)
        rv[key] = value
    return rv

if __name__ == '__main__':
        app.run('0.0.0.0',5000)
