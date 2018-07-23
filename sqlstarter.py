#!/usr/bin/python

import sqlite3, csv

# use your column names here

def read_csv_todb(filename,tableName, cur):
	
    with open(filename,'r') as fin: # `with` statement available in 2.5+
    # csv.DictReader uses first line in file for column headings by default	
        reader = csv.DictReader(fin) # comma is default delimiter
        csv_fields = reader.fieldnames
        print(csv_fields)
        to_db = []
        for i in reader:
            list_row = []
            if tableName.lower()=="patient_nucleobase":
                list_row.append('1')
            for j in csv_fields:
                list_row.append(i[j])
            to_db.append(tuple(list_row))
        if tableName.lower()== "patient_nucleobase":     			
            cur.executemany("INSERT INTO "+tableName+" "+ "(patient_id,seq,pos,left_flank,ref_allele,right_flank,Variant,Cov_variant_minus,Cov_minus,Cov_variant_plus,Cov_plus,freq_variant_minus,freq_variant_plus)"+ " VALUES "+str(tuple(['?']*(len(csv_fields)+1))).replace("'","")+" ;", to_db)
        else:
            cur.executemany("INSERT INTO "+tableName+" "+ str(tuple(csv_fields))+ " VALUES "+str(tuple(['?']*len(csv_fields))).replace("'","")+" ;", to_db)

con = sqlite3.connect("mito.db")
cur = con.cursor()
#cur.execute("CREATE TABLE IF NOT EXISTS  patient_nucleobase "+str(tuple(cols))+";") 
#cur.execute("ALTER TABLE patient_nucleobase ADD CONSTRAINT patient_primary PRIMARY KEY (seq, pos);")
cur.execute("DROP Table IF EXISTS patient_nucleobase;")
cur.execute("CREATE TABLE IF NOT EXISTS patient_nucleobase (patient_id,seq,pos,left_flank,ref_allele,right_flank,Variant,Cov_variant_minus,Cov_minus,Cov_variant_plus,Cov_plus,freq_variant_minus,freq_variant_plus);") 
cur.execute("DROP Table IF EXISTS pathogenic_prob;")
cur.execute("CREATE TABLE IF NOT EXISTS pathogenic_prob (Variant_ID,Type,AscendingDNA_change_genomic_hg19,GERP,dbSNP_ID,number_in_normal,freq,Sources);")
#cur.execute("Select * from patient_nucleobase")
read_csv_todb('di_47_p4.filt.var.csv','patient_nucleobase' ,cur)
read_csv_todb('di_47_pe.filt.var.csv','patient_nucleobase' , cur)
read_csv_todb('di_80_hfd.filt.var.csv','patient_nucleobase' , cur)
read_csv_todb('pathogenic.csv','pathogenic_prob' , cur)
read_csv_todb('pathogenic_prob.csv','pathogenic_prob' , cur)
print(str(cur.execute("Select * from patient_nucleobase")))
con.commit()
con.close()
