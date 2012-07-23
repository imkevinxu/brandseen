from brandseen_app.models import *
from django.contrib import admin

class RecordAdmin(admin.ModelAdmin):
    list_display = ('score', 'created_at')
    list_filter = ('created_at',)
    ordering = ['-created_at']

admin.site.register(Record, RecordAdmin)