#!/usr/bin/python
from flask import Flask, render_template
import sqlite3
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

@app.route('/renderAttributeNames/<tableName>')
def getTableAttributes(tableName):
        con = sqlite3.connect("mito.db")
        cur = con.cursor()
        cur.execute("PRAGMA table_info("+tableName+")")
        attributeNames=cur.fetchall()
        jsonAttributeNames = """{"attributeNames":"["""
        for i in attributeNames:
                jsonAttributeNames+="'"+i[1]+"'"+','
        con.commit()
        con.close()
        jsonAttributeNames=jsonAttributeNames[:len(jsonAttributeNames)-1]
        jsonAttributeNames+="""]"}"""
        return str(jsonAttributeNames)

@app.route('/renderTableContents/<tableName>')
def getTableContents(tableName):
        con = sqlite3.connect("mito.db")
        cur = con.cursor()

        cur.execute("PRAGMA table_info("+tableName+")")
        attributeInformation=cur.fetchall()
        attributeNamesCommaSeparated =""
        for i in attributeInformation:
                attributeNamesCommaSeparated+=i[1]+','
        attributeNamesCommaSeparated=attributeNamesCommaSeparated[:len(attributeNamesCommaSeparated)-1]
        attributeNames=attributeNamesCommaSeparated.split(",")
        #print(str(attributeNames))
        cur.execute("Select * from "+tableName)
        rawTableContents = cur.fetchall()
        #print(str(results))
        output='['
        for r in rawTableContents:
                listR = list(r)
                eachLine="{"
                #print(len(listR))
                for i in range(len(listR)):
                        eachLine+='"'+attributeNames[i]+'":"'+listR[i]+'",'
                eachLine=eachLine[:len(eachLine)-1]
                eachLine+='},'
                output+=eachLine
        output+=']'
        jsonTableContents="'"+str(output).replace(""",]""","]")+"'"
        return jsonTableContents.replace('u"','"')
        #return str(str(results[1])+'\n'+str(attributeNames))


if __name__ == '__main__':
        app.run('0.0.0.0',5000)
