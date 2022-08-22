import itertools
import json
import os
from pathlib import Path
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, FileResponse
from django.shortcuts import render, redirect
from illustrator.settings import BASE_DIR
import yaml
from . import illustration


# Rendering the editor's page
@login_required
def index(request):
    request_dict = request.GET.dict()
    if request.method == "GET" and 'file_name' in request_dict and 'type' in request_dict:
        return render(request, 'svg_editor/index.html', {'file_name': json.dumps(request_dict['file_name']),
                                                         'type': json.dumps(request_dict['type'])})
    else:
        return redirect('account')


@login_required
def start(request):
    return render(request, 'svg_editor/start.html')


# Script for viewing the list of svg and project files
@login_required
def files_view(request):
    if request.method == 'GET':
        path = Path(os.path.join(BASE_DIR, f'svg_editor/media/svg_editor/{str(request.user)}/svg'))
        svgs_lists = list(filter(lambda x: len(x) > 0 and x[0] != '.', os.listdir(path)))
        response = {
            'svgs': svgs_lists
        }
        return JsonResponse(response, status=200)
    return JsonResponse({'errors': 'Bad request'}, status=400)


@login_required
def files_collision_validation(request):
        request_dict = request.GET.dict()
        if request.method == "GET" and 'file_name' in request_dict:
            path = Path(os.path.join(BASE_DIR, f'svg_editor/media/svg_editor/{str(request.user)}/svg'))
            path_to_file = path / Path(request_dict['file_name'])
            response = {
                'exists': path_to_file.exists()
            }
            return JsonResponse(response, status=200)
        return JsonResponse({'errors': 'Bad request'}, status=400)


# Script for saving svg and project files
@login_required
def files_save(request):
    request_dict = request.POST.dict()
    if request.method == "POST" and 'svg' in request_dict and 'file_name' in request_dict and \
            'save_as' in request_dict and 'type' in request_dict:
        svg = request_dict['svg']
        path_to_file = Path(os.path.join(BASE_DIR,
                                         'svg_editor/media/svg_editor/'
                                         f'{str(request.user)}/svg/{request_dict["file_name"]}'
                                         f'.{request_dict["type"]}'))
        if len(request_dict["file_name"]) > 0:
            save_as = eval(request_dict['save_as'].capitalize())
            if not (save_as and path_to_file.exists()):
                stream = open(path_to_file, 'w')
                if path_to_file.suffix == '.svg':
                    stream.write(svg)
                else:
                    yaml.dump({'type': 'illustration'}, stream=stream)
                    illustration.dump(svg, stream=stream)
                return JsonResponse({'file_name': path_to_file.name}, status=200)
    return JsonResponse({'errors': 'Bad file name'}, status=400)


# Script for getting svg and project files
@login_required
def files_get(request):
    request_dict = request.GET.dict()
    if request.method == 'GET' and 'file_name' in request_dict:
        path_to_file = Path(os.path.join(BASE_DIR,
                                         'svg_editor/media/svg_editor/'
                                         f'{str(request.user)}/svg/{request_dict["file_name"]}'))
        if path_to_file.exists():
            with open(path_to_file, 'r') as file:
                if Path(request_dict['file_name']).suffix == '.svg':
                    response = {
                        'svg': ''.join(file.readlines())
                    }
                else:
                    response = {
                        'yml': illustration.load(file)
                    }
                    del response['yml']['type']
            response['file_name'] = path_to_file.name
            return JsonResponse(response, status=200)
    return JsonResponse({'errors': 'File not found'}, status=400)


# Script for downloading svg and project files
@login_required
def files_download(request):
    request_dict = request.GET.dict()
    if request.method == 'GET' and 'file_name' in request_dict:
        file_name = request_dict['file_name']
        path = Path(
            os.path.join(BASE_DIR, f'svg_editor/media/svg_editor/{str(request.user)}/svg/{file_name}'))
        if path.exists():
            file = open(path, 'rb')
            response = FileResponse(file)
            response['Content-Type'] = 'application/octet-stream'
            response['Content-Disposition'] = 'attachment;filename="{}"' \
                .format(file_name.encode('utf-8').decode('ISO-8859-1'))
            return response
    return JsonResponse({'errors': 'File not found'}, status=400)


# Script for uploading svg
@login_required
def files_upload(request):
    if request.user.is_authenticated:
        if request.method == 'POST' and 'file' in request.FILES:
            file = request.FILES['file']
            path = Path(
                os.path.join(BASE_DIR, f'svg_editor/media/svg_editor/{str(request.user)}/svg/{str(file)}'))
            if str(path.suffix) in ('.svg', '.yml'):
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
    return JsonResponse({'errors': 'Permission denied'}, status=403)


# Script for deleting svg and project files
@login_required
def files_delete(request):
    request_dict = request.POST.dict()
    if request.method == 'POST' and 'file_name' in request_dict and 'all' in request_dict:
        path = Path(os.path.join(BASE_DIR, f'svg_editor/media/svg_editor/{str(request.user)}/svg'))
        path_to_file = path / Path(request_dict['file_name'])
        count = 0
        if eval(request_dict['all'].capitalize()):
            files_list = list(filter(lambda x: len(x) > 0 and x[0] != '.', os.listdir(path)))
            for file in files_list:
                count += 1
                (path / Path(str(file))).unlink()
            return JsonResponse({'num_of_del': count}, status=200)
        elif path_to_file.exists():
            count += 1
            path_to_file.unlink()
            return JsonResponse({'num_of_del': count}, status=200)
    return JsonResponse({'errors': 'File not found'}, status=400)
