from django.shortcuts import render


def index(request):
    return render(request, 'svg_editor/index.html')
