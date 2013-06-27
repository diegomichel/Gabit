import datetime
import django.contrib.auth
from django.db import models
from django.utils import timezone
from django.db.models.signals import post_save
from django.contrib.auth.models import User



#create your models here
class UserProfile(models.Model):
    user = models.OneToOneField(User)
    alias = models.CharField(max_length=1000)
    hp = models.IntegerField(default=100)
    credits = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now())
    def __unicode__(self):
        return "%s's profile" %self.user
    def was_create_recently(self):
        return self.created_at >= timezone.now() - datetime.timedelta(days=1)

def create_user_profile(sender, instance, created, **kwargs):
    if created:
       profile, created = UserProfile.objects.get_or_create(user=instance)

post_save.connect(create_user_profile, sender=User)


class Tag(models.Model):
    user = models.ForeignKey(User)
    title = models.CharField(max_length=30)
    def __unicode__(self):
        return self.title

class Task(models.Model):
    user = models.ForeignKey(User)
    tags = models.ManyToManyField(Tag)
    title = models.CharField(max_length=117)
    value = models.IntegerField(default=10)
    type = models.IntegerField(default=0)
    order = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    completed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now())
    repeat_rate = models.IntegerField(default=0)

    todo = 0
    habit = 1
    daily = 2


    def __unicode__(self):
        return self.title

    def completed_today(self):
        return self.completed_at >= timezone.now() - datetime.timedelta(days=1)


class Reward(models.Model):
    user = models.ForeignKey(User)
    title = models.CharField(max_length=117)
    cost = models.IntegerField(default=10)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now())
    expire_at = models.DateTimeField(default=timezone.now(),blank=True)
    def __unicode__(self):
        return self.title
