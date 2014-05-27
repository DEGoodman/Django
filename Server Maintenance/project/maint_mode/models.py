from django.db import models

import pyodbc

from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# svr_maint -> __init__.py
from project import monitor_engine 

"""sqalchemy boilerplate"""
Base = declarative_base()
Base.metadata.bind = monitor_engine

"""import SQL tables"""
#dbo.Servers
class WindowsHost(Base):
	__tablename__ = 'Servers'
	__table_args__ = ({'autoload':False, 'schema': 'dbo'})
	
	server_id = Column('Server_ID', Integer, primary_key=True)
	host_name = Column('ServerName', String(12))
	maint_mode = Column('MaintenanceMode', Boolean)
	start_time = Column('StartTime', DateTime)
	end_time = Column('EndTime', DateTime)
	platform = 'windows'


#dbo.LinuxHosts
class LinuxHost(Base):
	__tablename__ = 'LinuxHosts'
	__table_args__ = ({'autoload':False, 'schema': 'dbo'})
	
	server_id = Column('Host_ID', Integer, primary_key=True)
	host_name = Column('HostName', String(12))
	maint_mode = Column('MaintenanceMode', Boolean)
	start_time = Column('StartTime', DateTime)
	end_time = Column('EndTime', DateTime)
	platform = 'linux'