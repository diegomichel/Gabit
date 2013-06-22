# Create your views here.
from django.contrib.auth import authenticate
from django.http import HttpResponse
from website.models import User
from django.template import Context, loader
from django.shortcuts import render


def index(request):
    latest_user_list = User.objects.all()
    context ={'latest_user_list': latest_user_list}
    return render(request, 'users/index.html', context)

def login(request):
    if request.user.is_authenticated():
        return render(request, 'users/login.html',context)

    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        #succefull
    else:
        #not success brah!

   #context = {'login': 0}
   #return render(request, 'users/login.html',context)