import itertools
import os
from pathlib import Path
from django.http import JsonResponse, FileResponse
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
        return JsonResponse(response, status=200)
    return JsonResponse({'errors': 'Bad request'}, status=400)


# Script for saving svg
def files_save(request):
    request_dict = dict(request.POST)
    if request.method == "POST" and 'svg' in request_dict and 'file_name' in request_dict:
        svg = request_dict['svg'][0]
        path_to_file = f'{BASE_DIR}/svg_editor/media/svg_editor/svg/{request_dict["file_name"][0]}'
        if len(request_dict["file_name"][0]) > 0:
            if os.path.exists(path_to_file + '.svg'):
                path_to_file += '({}).svg'
                num = 1
                while os.path.exists(path_to_file.format(num)):
                    num += 1
                path_to_file = path_to_file.format(num)
            else:
                path_to_file += '.svg'
            open(path_to_file, 'w').write(svg)
            return JsonResponse({'file_name': path_to_file[path_to_file.rfind('/') + 1:]}, status=200)
    return JsonResponse({'errors': 'Bad file name'}, status=400)


# Script for getting svg
def files_get(request):
    request_dict = dict(request.GET)
    if request.method == 'GET' and 'file_name' in request_dict:
        path = os.path.join(BASE_DIR, 'svg_editor/media/svg_editor/svg')
        svgs_lists = list(filter(lambda x: len(x) > 0 and x[0] != '.', os.listdir(path)))
        file_name = request_dict['file_name'][0]+'.svg'
        if file_name in svgs_lists:
            with open(path+'/'+file_name) as file:
                response = {
                    'svg': file.readline()
                }
            return JsonResponse(response, status=200)
    return JsonResponse({'errors': 'File not found'}, status=400)


# Script for downloading svg
def files_download(request):
    request_dict = dict(request.GET)
    if request.method == 'GET' and 'file_name' in request_dict:
        file_name = '{}.svg'.format(request_dict['file_name'][0])
        path = Path(os.path.join(BASE_DIR, 'svg_editor/media/svg_editor/svg'+'/'+file_name))
        if path.exists():
            file = open(path, 'rb')
            response = FileResponse(file)
            response['Content-Type'] = 'application/octet-stream'
            response['Content-Disposition'] = 'attachment;filename="{}"'\
                .format(file_name.encode('utf-8').decode('ISO-8859-1'))
            return response
    return JsonResponse({'errors': 'File not found'}, status=400)


# Script for uploading svg
def files_upload(request):
    if request.method == 'POST' and 'file' in request.FILES:
        file = request.FILES['file']
        path = Path(os.path.join(BASE_DIR, 'svg_editor/media/svg_editor/svg'+'/'+str(file)))
        if str(path.suffix) == '.svg':
            if path.exists():
                for num in itertools.count(1):
                    new_path = path.parent / (path.stem + f'({num})' + path.suffix)
                    if not new_path.exists():
                        path = new_path
                        break
            with open(path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)
            return JsonResponse({'file_name': path.name}, status=200)
    return JsonResponse({'errors': 'Not svg'}, status=400)
