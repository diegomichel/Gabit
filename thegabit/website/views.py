# Create your views here.
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from website.models import UserProfile,Task, Reward
from django.template import Context, loader
from django.shortcuts import render
import string
import json
from django.core import serializers
from django.template.loader import render_to_string


def index(request):
    return render(request, 'users/index.html', {})

def deleteTask(request):
    id = request.GET['id']
    task = request.user.task_set.filter(pk=id)
    task.delete();
    return HttpResponse("")

def deleteReward(request):
    id = request.GET['id']
    reward = request.user.reward_set.filter(pk=id)
    reward.delete();
    return HttpResponse("")

def getTasks(request):
    type = request.GET['type']
    tasks = Task.objects.filter(user__pk=request.user.pk,type=type).order_by('order', '-id')
    context ={'tasks': tasks, 'all': True, 'type': type}
    return render(request, 'tasks/task.html', context)

def getRewards(request):
    rewards = Reward.objects.filter(user__pk=request.user.pk).order_by('order', '-id')
    context ={'tasks': rewards, 'all': True, 'type': 4}
    return render(request, 'tasks/task.html', context)

def addTask(request):
    title = request.GET['title']
    type = request.GET['type']
    User = request.user;
    task = User.task_set.create(title = title, type = type)
    tasks = [task]
    context ={'tasks': tasks, 'all': False}
    rendered = render_to_string('tasks/task.html', context)
    rendered = rendered.strip()
    return HttpResponse(rendered)

def addReward(request):
    title = request.GET['title']
    type = request.GET['type']
    User = request.user;
    reward = User.reward_set.create(title = title)
    rewards = [reward]
    context ={'tasks': rewards, 'all': False}
    rendered = render_to_string('tasks/task.html', context)
    rendered = rendered.strip()
    return HttpResponse(rendered)

def saveTasksOrder(request):
    order = request.GET['order']
    ids = string.split(order,",")
    User = request.user;
    order = 0;
    for id in ids:
        task = User.task_set.filter(pk=id)#.objects.get(pk=id)
        order+=1
        task.update(order = order)

    return render(request, 'users/blank.html', {'value':1})

def saveRewardsOrder(request):
    order = request.GET['order']
    ids = string.split(order,",")
    User = request.user;
    order = 0;
    for id in ids:
        reward = User.reward_set.filter(pk=id)#.objects.get(pk=id)
        order+=1
        reward.update(order = order)

    return render(request, 'users/blank.html', {'value':1})

def loginUser(request):
    if request.user.is_authenticated():
        print request.user.get_profile()
        return HttpResponse(serializers.serialize("json", [request.user.get_profile()]))

    try:
        username = request.POST['username']
        password = request.POST['password']
    except NameError:
        return HttpResponse(serializers.serialize("json", [request.user.get_profile()]))

    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponse(serializers.serialize("json", [request.user.get_profile()]))
    else:
        return HttpResponse("False")

def logoutUser(request):
    context = {'value': True}
    if request.user.is_authenticated():
        logout(request)
        return render(request, 'users/blank.html', context)
    return render(request, 'users/blank.html', context)