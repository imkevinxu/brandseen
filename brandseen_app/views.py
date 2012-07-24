from django import forms
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core import serializers
from django.core.context_processors import csrf
from django.core.mail import send_mail
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404, render, \
    redirect
from django.template import loader, RequestContext
from django.views.decorators.csrf import csrf_exempt

from brandseen_app.models import *
from brandseen_app.model_forms import *
from brandseen_app.forms import *

def index(request):
    image = "cocacola"
    return render(request, "index.html", locals())

def success(request):
    if "score" in request.GET and "game" in request.GET and "level" in request.GET :
        score = Record.objects.create(score=request.GET["score"],
                                    game=request.GET["game"],
                                    level=request.GET["level"])
        score.save()

def highscore(request):
    return render(request, "highscore.html", locals())
