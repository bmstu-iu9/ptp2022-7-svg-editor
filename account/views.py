from django.shortcuts import render, redirect, reverse
from illustrator.settings import BASE_DIR
from .forms import SignupForm


def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        print(request.POST)
        print(form.is_valid())
        if form.is_valid():
            user = form.save()
            f'{BASE_DIR}/svg_editor/media/svg_editor/svg/{str(user)}'
            return redirect(reverse('login'))
    else:
        form = SignupForm()
    return render(request, 'registration/signup.html', {'form': form})
