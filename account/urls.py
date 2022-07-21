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
    path('password-reset/', views.PasswordResetView.as_view(), name='password_reset'),
    path('password-reset/done/', views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/confirm/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(),
         name='password_reset_confirm'),
    path('reset/complete/', views.PasswordResetCompleteView.as_view(),
         name='password_reset_complete'),

]
