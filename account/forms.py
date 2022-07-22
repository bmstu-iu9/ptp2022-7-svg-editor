from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


# Custom signup form
class SignupForm(UserCreationForm):
    first_name = forms.CharField(max_length=150, help_text='Your real first name.')
    last_name = forms.CharField(max_length=150, help_text='Your real last name')
    email = forms.EmailField(max_length=200, help_text='Required field. Enter your email')

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError("Email exists")
        return email
