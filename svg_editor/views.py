import os
from django.http import JsonResponse
from django.shortcuts import render
from illustrator.settings import BASE_DIR


# Rendering the editor's page
def index(request):
    return render(request, 'svg_editor/index.html')


# Script for viewing the list of svg
def files_view(request):
    if request.method == 'GET':
        path = os.path.join(BASE_DIR, 'svg_editor/media/svg_editor/svg')
        svgs_lists = list(filter(lambda x: len(x) > 0 and x[0] != '.', os.listdir(path)))
        response = {
            'svgs': svgs_lists
        }
        return JsonResponse(response)


# Script for saving svg
def files_save(request):
    request_dict = dict(request.POST)
    if request.method == "POST" and 'svg' in request_dict:
        svg = request_dict['svg'][0]
        path_to_file = f'{BASE_DIR}/svg_editor/media/svg_editor/svg/{request_dict["file_name"][0]}'
        if os.path.exists(path_to_file + '.svg'):
            path_to_file += '({}).svg'
            i = 1
            while os.path.exists(path_to_file.format(i)):
                i += 1
            path_to_file = path_to_file.format(i)
        else:
            path_to_file += '.svg'
        open(path_to_file, 'w').write(svg)
        return JsonResponse({'file_name': path_to_file[path_to_file.rfind('/') + 1:]}, status=200)
    return JsonResponse({}, status=400)
