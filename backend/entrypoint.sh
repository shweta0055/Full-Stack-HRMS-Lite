#!/bin/sh

# Set up MariaDB directory
mkdir -p /run/mysqld
chown -R mysql:mysql /run/mysqld
chown -R mysql:mysql /var/lib/mysql

# Initialize MySQL data directory if empty
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "Initializing MySQL database..."
    mysql_install_db --user=mysql --datadir=/var/lib/mysql > /dev/null
fi

# Start MySQL in background
echo "Starting MySQL..."
mysqld_safe --user=mysql --datadir=/var/lib/mysql &

# Wait for MySQL to be ready
echo "Waiting for MySQL to start..."
while ! mysqladmin ping -h"localhost" --silent; do
    sleep 1
done

# Create database and user if they don't exist
DB_NAME=${DB_NAME:-hrms_lite}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD:-root}

echo "Configuring Database..."
mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;"
# Note: In MariaDB/MySQL internal container, we often just use root for simplicity if it's all-in-one
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
mysql -e "FLUSH PRIVILEGES;"

# Run Django migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start Gunicorn
echo "Starting Gunicorn..."
exec gunicorn --bind 0.0.0.0:8000 hrms_backend.wsgi:application
