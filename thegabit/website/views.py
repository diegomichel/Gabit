# Create your views here.
from django.http import HttpResponse
from website.models import User
from django.template import Context, loader
from django.shortcuts import render


def index(request):
    latest_user_list = User.objects.all()
    context ={'latest_user_list': latest_user_list}
    return render(request, 'users/index.html', context)