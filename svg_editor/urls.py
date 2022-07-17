"""svg_editor URL Configuration
The `urlpatterns` list routes URLs to views
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('files_view', views.files_view, name='files_view'),
    path('files_save', views.files_save, name='files_save'),
    path('files_get', views.files_get, name='files_get'),
]
