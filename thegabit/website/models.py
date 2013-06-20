import datetime
from django.db import models
from django.utils import timezone

#create your models here
class User(models.Model):
    name = models.CharField(max_length=32)
    password = models.CharField(max_length=500)
    alias = models.CharField(max_length=1000)
    email = models.CharField(max_length=255)
    hp = models.IntegerField(default=100)
    credits = models.IntegerField(default=0)
    created_at = models.DateTimeField()
    def __unicode__(self):
        return self.name
    def was_create_recently(self):
        return self.created_at >= timezone.now() - datetime.timedelta(days=1)

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
    damage = models.IntegerField(default=10)
    priority = models.IntegerField(default=0)
    completed_at = models.DateTimeField('completed at')
    created_at = models.DateTimeField('date created')

    todo = 0
    habit = 1
    daily = 2



    def __unicode__(self):
        return self.title


class Reward(models.Model):
    user = models.ForeignKey(User)
    title = models.CharField(max_length=117)
    cost = models.IntegerField(default=1000)
    created_at = models.DateTimeField()
    expire_at = models.DateTimeField()
    def __unicode__(self):
        return self.title
