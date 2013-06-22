from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'website.views.index', name='index'),
    url(r'^login$',  'website.views.loginUser', name='loginUser'),
    url(r'^logout$',  'website.views.logoutUser', name='logoutUser'),
    url(r'^gethabits$',  'website.views.getHabits', name='getHabits'),
    url(r'^saveHabitsOrder/$',  'website.views.saveHabitsOrder', name='saveHabitsOrder'),

    (r'^accounts/login/$', 'django.contrib.auth.views.login'),

    # url(r'^thegabit/', include('thegabit.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),


)
