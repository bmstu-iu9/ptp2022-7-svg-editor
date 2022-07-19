import os
from shutil import rmtree
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
from illustrator.settings import BASE_DIR


# Deleting a user path
@receiver(pre_delete,  sender=User)
def user_post_delete_handler(sender, instance, **kwargs):
    path = os.path.join(BASE_DIR, f'svg_editor/media/svg_editor/{str(instance)}')
    rmtree(path)
