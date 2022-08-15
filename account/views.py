import os
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.http import JsonResponse
from django.shortcuts import render
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from illustrator.settings import BASE_DIR
from .forms import SignupForm
from .tokens import account_activation_token


# Personal page rendering
@login_required
def account(request):
    return render(request, 'registration/account.html')


# Registration of a new user
def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False
            user.save()
            path = f'{BASE_DIR}/svg_editor/media/svg_editor/{str(user)}/svg'
            os.makedirs(path)
            current_site = get_current_site(request)
            mail_subject = render_to_string('registration/active_email_subject.txt')
            message = render_to_string('registration/active_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
            })
            to_email = form.cleaned_data.get('email')
            email = EmailMessage(
                mail_subject, message, to=[to_email]
            )
            email.send()
            return render(request, 'registration/active_email_done.html')
    else:
        form = SignupForm()
    return render(request, 'registration/signup.html', {'form': form})


# Email activation
def activate(request, uidb64, token):
    user_model = get_user_model()
    try:
        uid = urlsafe_base64_decode(uidb64)
        user = user_model.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, user_model.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return render(request, 'registration/active_email_complete.html')
    else:
        return render(request, 'registration/active_email_incomplete.html')


# Username validate script
def validate_username(request):
    if request.method == 'GET':
        username = request.GET.get('username', None)
        response = {
            'exists': User.objects.filter(username__iexact=username).exists() or username == ''
        }
        return JsonResponse(response, status=200)
    return JsonResponse({'errors': 'Bad request'}, status=400)


# Email validate script
def validate_email(request):
    if request.method == 'GET':
        email = request.GET.get('email', None)
        response = {
            'exists': User.objects.filter(email=email).exists() or email == ''
        }
        return JsonResponse(response, status=200)
    return JsonResponse({'errors': 'Bad request'}, status=400)


# Passwords missmatch check script
def validate_passwords(request):
    if request.method == 'GET':
        password1 = request.GET.get('password1', None)
        password2 = request.GET.get('password2', None)
        response = {
            'missmatch': password1 != password2 or not (password1 and password2)
        }
        return JsonResponse(response, status=200)
    return JsonResponse({'errors': 'Bad request'}, status=400)
