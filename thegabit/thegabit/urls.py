from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'website.views.index', name='index'),
    url(r'^login$',  'website.views.loginUser', name='loginUser'),
    url(r'^logout$',  'website.views.logoutUser', name='logoutUser'),
    url(r'^gettasks$', 'website.views.getTasks', name='getTasks'),
    url(r'^getRewards$', 'website.views.getRewards', name='getRewards'),
    url(r'^saveTasksOrder/$', 'website.views.saveTasksOrder', name='saveHabitsOrder'),
    url(r'^saveRewardsOrder/$', 'website.views.saveRewardsOrder', name='saveRewardsOrder'),
    url(r'^addTask/$', 'website.views.addTask', name='addTask'),
    url(r'^addReward/$', 'website.views.addReward', name='addReward'),
    url(r'^deleteTask/$', 'website.views.deleteTask', name='deleteTask'),
    url(r'^deleteReward/$', 'website.views.deleteReward', name='deleteReward'),
    url(r'^completeTask/$', 'website.views.completeTask'),
    url(r'^buyReward/$', 'website.views.buyReward'),


    (r'^accounts/login/$', 'django.contrib.auth.views.login'),

    # url(r'^thegabit/', include('thegabit.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),


)
