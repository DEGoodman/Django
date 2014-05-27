import os, sys

#activate virtual environment
activate_this = '' # local project run file
execfile(activate_this, dict(__file__=activate_this))

#in order, the paths we need for this to work
project_pathing = [''] #local project path

for path in project_pathing:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'project.settings'

from django.core.handlers.wsgi import WSGIHandler

application = WSGIHandler()