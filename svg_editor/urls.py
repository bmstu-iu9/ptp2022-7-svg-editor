from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('files_views', views.files_view, name='files_view'),
    path('files_save', views.files_save, name='files_save')
]
