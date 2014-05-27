from django.conf.urls.defaults import patterns, url
from django.contrib.auth.decorators import login_required

from project.maint_mode import views

urlpatterns = patterns('',
        url(r'^$', login_required(views.ServerMaintenanceView.as_view()), name='index'),
		url(r'^send/$', login_required(views.ServerUpdate.as_view()), name='send'),

		url(r'^accounts/login/$', '', name = ""), # add environment login info
    	url(r'^accounts/logout/$', '', name = ""), # add environment logout info

)
