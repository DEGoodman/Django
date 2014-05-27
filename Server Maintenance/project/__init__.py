from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import pyodbc

def connect():
	""" Set up remote SQL database connection """
  	return pyodbc.connect(
  		'DRIVER={%s};SERVER=%s;DATABASE=%s;UID=%s;PWD=%s' % (
  		'SQL Server', 
  		'', # server address 
  		'', # db name 
  		'', # user ID 
  		''  # password
  	))


""" sqlalchemy engine """
monitor_engine = create_engine('mssql+pyodbc://', creator=connect)
Session = sessionmaker(bind=monitor_engine)
