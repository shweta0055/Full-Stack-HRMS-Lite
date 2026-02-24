#!/bin/sh

# Wait for database to be ready (optional but recommended)
# You can add a wait-for-it script here if needed

# Run migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start Gunicorn
exec gunicorn --bind 0.0.0.0:8000 hrms_backend.wsgi:application
