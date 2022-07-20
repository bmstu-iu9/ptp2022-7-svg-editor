import os
from django.shortcuts import render, redirect, reverse
from illustrator.settings import BASE_DIR
from .forms import SignupForm


# Registration of a new user
def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            path = f'{BASE_DIR}/svg_editor/media/svg_editor/{str(user)}/svg'
            os.makedirs(path)
            return redirect(reverse('login'))
    else:
        form = SignupForm()
    return render(request, 'registration/signup.html', {'form': form})
