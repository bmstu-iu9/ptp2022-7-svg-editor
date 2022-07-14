import os
from time import time
from django.http import JsonResponse
from django.shortcuts import render
from illustrator.settings import BASE_DIR


def index(request):
    return render(request, 'svg_editor/index.html')


def files_view(request):
    if request.method == 'GET':
        path = os.path.join(BASE_DIR, 'svg_editor/media/svg_editor/svg')
        svgs_lists = list(filter(lambda x: len(x) > 0 and x[0] != '.', os.listdir(path)))
        response = {
            'svgs': svgs_lists
        }
        return JsonResponse(response)


def files_save(request):
    if request.method == "POST" and 'svg' in dict(request.POST).keys():
        svg = dict(request.POST)['svg'][0]
        path = os.path.join(BASE_DIR, 'svg_editor/media/svg_editor/svg')
        name = int(time())
        with open(path+'/'+str(name)+'.svg', 'w') as file:
            file.write(svg)
    return JsonResponse({}, status=200)
