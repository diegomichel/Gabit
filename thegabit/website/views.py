# Create your views here.
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from website.models import UserProfile,Task
from django.template import Context, loader
from django.shortcuts import render
import string
import json
from django.core import serializers
from django.template.loader import render_to_string


def index(request):
    latest_user_list = UserProfile.objects.all()
    context ={'latest_user_list': latest_user_list}
    return render(request, 'users/index.html', context)

def getTasks(request):
    type = request.GET['type']
    tasks = Task.objects.filter(user__pk=request.user.pk,type=type).order_by('order', '-id')
    context ={'tasks': tasks, 'all': True, 'type': type}
    return render(request, 'tasks/task.html', context)

def addHabit(request):
    title = request.GET['title']
    type = request.GET['type']
    User = request.user;
    task = User.task_set.create(title = title, type = type)
    tasks = [task]
    context ={'tasks': tasks, 'all': False}
    rendered = render_to_string('tasks/task.html', context)
    rendered = rendered.strip()
    return HttpResponse(rendered)

def saveHabitsOrder(request):
    order = request.GET['order']
    ids = string.split(order,",")
    User = request.user;
    order = 0;
    for id in ids:
        task = User.task_set.filter(pk=id)#.objects.get(pk=id)
        order+=1
        task.update(order = order)
        print task, order

    return render(request, 'users/blank.html', {'value':1})

def loginUser(request):
    context = {'value': request.user.is_authenticated()}
    if request.user.is_authenticated():
        return render(request, 'users/blank.html', context)

    try:
        username = request.POST['username']
        password = request.POST['password']
    except NameError:
        return render(request, 'users/blank.html',context)

    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        context = {'value':  request.user.is_authenticated() }
        return render(request, 'users/blank.html',context)
    else:
        return render(request, 'users/blank.html',context)

def logoutUser(request):
    context = {'value': True}
    if request.user.is_authenticated():
        logout(request)
        return render(request, 'users/blank.html', context)