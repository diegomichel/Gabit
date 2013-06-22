# Create your views here.
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from website.models import UserProfile,Task
from django.template import Context, loader
from django.shortcuts import render
import string

def index(request):
    latest_user_list = UserProfile.objects.all()
    context ={'latest_user_list': latest_user_list}
    return render(request, 'users/index.html', context)

def getHabits(request):
    latest_user_list = UserProfile.objects.all()
    tasks = Task.objects.filter(user__pk=request.user.pk).order_by('order')
    context ={'tasks': tasks, 'value':tasks}
    return render(request, 'tasks/habits.html', context)

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