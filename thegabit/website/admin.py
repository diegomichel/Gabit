__author__ = 'diego'
from django.contrib import admin
from website.models import *

admin.site.register(UserProfile)
admin.site.register(Tag)
admin.site.register(Task)
admin.site.register(Reward)