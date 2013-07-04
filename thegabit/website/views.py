# Create your views here.
import string
import json
import random

from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.core import serializers
from django.template.loader import render_to_string
from django.utils import timezone
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

from website.models import Task


def index(request):
    return render(request, 'users/index.html', {})


def loginUser(request):
    if request.user.is_authenticated():
        request.user.log_set.create(record="User Authenticated");
        return HttpResponse(serializers.serialize("json", [request.user.get_profile()]))

    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            if request.user.is_authenticated():
                request.user.log_set.create(record="User Authenticated");
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
        else:
            form = AuthenticationForm(data=request.POST)
    else:
        form = AuthenticationForm()

    return render(request, "registration/login.html", {
        'form': form,
    })
    # if request.user.is_authenticated():
    #     request.user.log_set.create(record="User Authenticated");
    #     return HttpResponse(serializers.serialize("json", [request.user.get_profile()]))
    #
    # try:
    #     username = request.POST['username']
    #     password = request.POST['password']
    # except NameError:
    #     return HttpResponse(serializers.serialize("json", [request.user.get_profile()]))
    #
    # user = authenticate(username=username, password=password)
    # if user is not None:
    #     login(request, user)
    #     return HttpResponse(serializers.serialize("json", [request.user.get_profile()]))
    # else:
    #     return HttpResponse("False")


def logoutUser(request):
    context = {'value': True}
    if request.user.is_authenticated():
        logout(request)
        return render(request, 'users/blank.html', context)
    return render(request, 'users/blank.html', context)


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            new_user = form.save()
            username = request.POST['username']
            password = request.POST['password1']
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
            return HttpResponse("yes")
    else:
        form = UserCreationForm()
    return render(request, "registration/register.html", {
        'form': form,
    })


def getLogs(request):
    logs = request.user.log_set.all().order_by('date')
    context = {'logs': logs}
    return render(request, 'users/logs.html', context)


def deleteTask(request):
    id = request.GET['id']
    task = request.user.task_set.filter(pk=id)
    request.user.log_set.create(record="Deleted task: " + task.get().title);
    task.delete();
    return HttpResponse("")


def deleteReward(request):
    id = request.GET['id']
    reward = request.user.reward_set.filter(pk=id)
    request.user.log_set.create(record="Deleted reward: " + reward.get().title);
    reward.delete();
    return HttpResponse("")


def getTasks(request):
    type = request.GET['type']

    if int(type) == Task.todo:
        tasks = request.user.task_set.all().filter(type=type, completed_at=None).order_by('order', '-id')
    else:
        tasks = request.user.task_set.all().filter(type=type).order_by('order', '-id')

    context = {'tasks': tasks, 'all': True, 'type': type}
    return render(request, 'tasks/task.html', context)


def getRewards(request):
    rewards = request.user.reward_set.all().order_by('order', '-id')
    context = {'tasks': rewards, 'all': True, 'type': 4}
    return render(request, 'tasks/task.html', context)


def addTask(request):
    title = request.GET['title']
    type = request.GET['type']
    gain = request.GET['gain']
    User = request.user;
    task = User.task_set.create(title=title, type=type, value=gain)
    request.user.log_set.create(record="Added task:" + task.title + " With pay: " + task.value);
    tasks = [task]
    context = {'tasks': tasks, 'all': False}
    rendered = render_to_string('tasks/task.html', context)
    rendered = rendered.strip()
    return HttpResponse(rendered)


def addReward(request):
    title = request.GET['title']
    cost = request.GET['gain']
    User = request.user;
    reward = User.reward_set.create(title=title, cost=cost)
    request.user.log_set.create(record="Added reward: " + reward.title + " With pay: " + reward.cost);
    rewards = [reward]
    context = {'tasks': rewards, 'all': False}
    rendered = render_to_string('tasks/task.html', context)
    rendered = rendered.strip()
    return HttpResponse(rendered)


def saveTasksOrder(request):
    order = request.GET['order']
    ids = string.split(order, ",")
    User = request.user;
    order = 0;
    for id in ids:
        task = User.task_set.filter(pk=id)#.objects.get(pk=id)
        order += 1
        task.update(order=order)

    return render(request, 'users/blank.html', {'value': 1})


def saveRewardsOrder(request):
    order = request.GET['order']
    ids = string.split(order, ",")
    User = request.user;
    order = 0;
    for id in ids:
        reward = User.reward_set.filter(pk=id)#.objects.get(pk=id)
        order += 1
        reward.update(order=order)

    return render(request, 'users/blank.html', {'value': 1})


def completeTask(request):
    id = request.GET['id']

    task = request.user.task_set.filter(pk=id)

    task.update(completed_at=timezone.now())
    task.update(uses=task.get().uses + 1)

    request.user.log_set.create(record="Task done: " + task.get().title + " Won: " + str(task.get().value));

    profile = request.user.get_profile();

    extra_credits = 0;
    if random.randint(1, 8) == 1:
        extra_credits = random.randint(1, 10)

    if extra_credits > 0:
        request.user.log_set.create(record="Won " + str(extra_credits) + " extra credits!!!");

    profile.credits += task.get().value + extra_credits;
    profile.save()

    values = {'hp': request.user.get_profile().hp, 'credits': profile.credits, 'extra_credits': extra_credits}

    return HttpResponse(json.dumps(values))


def buyReward(request):
    id = request.GET['id']

    reward = request.user.reward_set.filter(pk=id)
    reward.update(uses=reward.get().uses + 1)

    profile = request.user.get_profile()
    profile.credits -= reward.get().cost

    request.user.log_set.create(record="Bought reward: " + reward.get().title + " cost: " + str(reward.get().cost));

    if id == 1:
        profile.hp += 10

    profile.save()

    values = {'hp': request.user.get_profile().hp, 'credits': profile.credits}

    return HttpResponse(json.dumps(values))