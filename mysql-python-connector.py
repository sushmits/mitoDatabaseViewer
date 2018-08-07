#!/usr/bin/python

import MySQLdb

print("Content-type: text/html\n\n")

config = {
  'user': 'anirudh',
  'passwd': 'i_anirudh',
  'db': 'db_mito',
}


db = MySQLdb.connect(**config)

cur = db.cursor()

cur.execute("SELECT * FROM t_pat_var")


for row in cur.fetchall():
    print(row)

db.close()


#try:
#	cnx = mysql.connector.connect(**config)
#except mysql.connector.Error as err:
#	if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
#		print("Something is wrong with your user name or password")
#	elif err.errno == errorcode.ER_BAD_DB_ERROR:
#		print("Database does not exist")
#	else:
#		print(err)
#else:
#	cnx.close()

