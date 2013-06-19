from django.db import models

#create your models here
class User(models.Model):
    name = models.CharField(max_length=25)
    email = models.CharField(max_length=255)
    created_at = models.DateTimeField()

class Task(models.Model):
    user = models.ForeignKey(User)
    title = models.CharField(max_length=117)
    value = models.IntegerField()
    priority = models.IntegerField()
    completed_at = models.DateTimeField('completed at')
    created_at = models.DateTimeField('date created')
    expire_at = models.DateTimeField('expiration date')

class Reward(models.Model):
    user = models.ForeignKey(User)
    title = models.CharField(max_length=117)
    cost = models.IntegerField()
    created_at = models.DateTimeField()
    expire_at = models.DateTimeField()
