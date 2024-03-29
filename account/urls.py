"""account URL Configuration
The `urlpatterns` list routes URLs to views
"""
from django.urls import path
from django.contrib.auth import views
from .views import signup, activate, account, validate_username, validate_email, validate_passwords,\
    HtmlPasswordResetView

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('signup/', signup, name='signup'),
    path('activate/<uidb64>/<token>/',
         activate, name='activate'),
    path('password-reset/', HtmlPasswordResetView.as_view(), name='password_reset'),
    path('password-reset/done/', views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/confirm/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(),
         name='password_reset_confirm'),
    path('reset/complete/', views.PasswordResetCompleteView.as_view(),
         name='password_reset_complete'),
    path('password-change/', views.PasswordChangeView.as_view(), name='password_change'),
    path('password-change/done/', views.PasswordChangeDoneView.as_view(), name='password_change_done'),
    path('', account, name='account'),
    path('validate_username/', validate_username, name='validate_username'),
    path('validate_email/', validate_email, name='validate_email'),
    path('validate_passwords/', validate_passwords, name='validate_passwords'),
]
