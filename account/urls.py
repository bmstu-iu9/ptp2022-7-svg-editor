"""account URL Configuration
The `urlpatterns` list routes URLs to views
"""
from django.urls import path
from django.contrib.auth import views
from .views import signup, activate

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('signup/', signup, name='signup'),
    path('activate/<uidb64>/<token>/',
         activate, name='activate'),

]
