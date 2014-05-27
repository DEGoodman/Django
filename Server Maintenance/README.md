# Server Maintenance

This application puts servers into Maintenance Mode.

This application was built for my SysAdmins. I have sanitized the static DB information, and the program is available for public use.

This program was built as an introduction and learning experience to the Django framework, and is designed to put servers into (or out of) Maintenance Mode. It is specifically configured for a table of servers managed by an MSSQL database, and must be run on a Windows computer due to driver compatibilty problems with some OS X versions. Any questions relating to this application can be directed to myself.


Application is currently on V1.2.2

Changelog:
	1.2.2:
		updated SQL pointers

	1.2.x:
	allservers displayed in single table, alphabetically.
	total GUI overhaul
	can put servers in MM by datetime or slider
	servers can be removed from MM by Updating with slider set to 0