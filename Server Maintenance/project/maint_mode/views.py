import datetime
import json

from django.core import serializers
from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.generic import View

# import models
from project.maint_mode.models import WindowsHost, LinuxHost

# sqlalchemy stuff
from project import Session

# header stuff
from django.views.generic import TemplateView
from django.core.urlresolvers import reverse

from libfso.core.views import DefaultMixin
from libfso.core.utils import list_to_breadcrumbs


def getWindowsServers():
	session = Session()

	win_svr_list = session.query(WindowsHost).all()
	session.close()

	return win_svr_list


def getLinuxServers():
 	session = Session()

 	lin_svr_list= session.query(LinuxHost).all()
 	session.close()

 	return lin_svr_list


class ServerUpdate(View):

	def get(self, request, *args, **kwargs):
		response = {'status': 'success'}

		return HttpResponse(json.dumps(response))


	def post(self, request, *args, **kwargs):
		c = {}
		c.update(csrf(request))
		formJSON = request.POST['formJSON']
		formData = json.loads(formJSON)
		session = Session()
		time = datetime.datetime.now()

		for selected in formData['server_table']:
			try:
				""" Windows servers"""
				if selected['platform']=="windows":
					server = session.query(WindowsHost).filter_by(host_name=selected['serverName']).first()
				"""linux servers"""
				if selected['platform']=="linux":
					server = session.query(LinuxHost).filter_by(host_name=selected['serverName']).first()

				"""if time is set to '0', pull out of maintenance mode"""
				if formData['duration']=="0":
					server.start_time = None
					server.end_time = None
					server.maint_mode = 0

				"""else put into maintenance mode"""
				if formData['duration'] > "0":
					server.start_time = datetime.datetime.now()
					server.end_time = server.start_time + datetime.timedelta(minutes = int(formData['duration']))
					server.maint_mode = 1

			except:
				raise
			"""commit each record"""
			session.commit()
		
		session.close()

		response = {'status': 'success'}
		session.close()

		return HttpResponse(json.dumps(response))

"""standard view elements"""
class ServerMaintenanceView(DefaultMixin, TemplateView):
	title = 'Server Maintenance'		
	application_title = 'Server Maintenance'
	application_subtitle = 'Maintenance Mode'
	template_name = 'maint_mode\index.html'

	def get_context_data(self, *args, **kwargs):
		context = super(ServerMaintenanceView, self).get_context_data(*args, **kwargs)

		breadcrumbs = list_to_breadcrumbs([
			('Titan', context['site_url']),
			('Server Maintenance', reverse('index'))
		])

		'''navigational breadcrumbs'''
		context['breadcrumbs'] = breadcrumbs
		

		'''Create list of all servers'''
		windows = getWindowsServers()
		linux = getLinuxServers()
		
		servers = windows + linux
		listed =sorted(servers, key=lambda server: server.host_name  )
		
		context['servers'] = listed

		return context