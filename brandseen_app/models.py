from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin
from django import forms

from tagging.fields import TagField

import datetime
import os

class Base(models.Model):
    created_at  = models.DateTimeField(auto_now=True)
    modified_at = models.DateTimeField(auto_now=True, auto_now_add=True)

    class Meta:
        abstract = True

class Record(Base):
    score = models.FloatField(blank=True, null=True)
    guess = models.CharField(blank=True, null=True, max_length=7)
    correct_hue = models.CharField(blank=True, null=True, max_length=7)
    game = models.CharField(blank=True, null=True, max_length=255)
    level = models.CharField(blank=True, null=True, max_length=255)

    def __unicode__(self):
        return u'%s vs %s [%s] %s - %s' % (self.guess, self.correct_hue, self.game, self.level, self.score)
