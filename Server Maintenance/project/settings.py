import os
import sys

try:
    from libfso.core.settings import *
except ImportError:
    pass

APP_ID = 16 # required for my local environment

MEDIA_ROOT = '' # local media root dir

TEMPLATE_DIRS = TEMPLATE_DIRS + [""] # local template dir

INSTALLED_APPS = INSTALLED_APPS + [
	'project.maint_mode',
	 'raven.contrib.django.raven_compat', # added raven for debugging
]

STATIC_ROOT = '' # local static root dir

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
LOCAL_STATIC_URL = '%smaint_mode/' % STATIC_URL

# Set your DSN value
RAVEN_CONFIG = {
    'dsn': '', # raven server address for debugging
}

#to handle login and logout until a more graceful solution presents itself
LOGIN_URL = '%smaint_mode/accounts/login/'
LOGOUT_URL = '%smaint_mode/accounts/logout/'

DEBUG = False

try:
	from local_settings import *
except ImportError:
	pass