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
mariadbd-safe --user=mysql --datadir=/var/lib/mysql &

# Wait for MySQL to be ready
echo "Waiting for MySQL to start..."
while ! mysqladmin ping -h"localhost" --silent; do
    sleep 1
done

# Database credentials
DB_NAME=${DB_NAME:-hrms_lite}
DB_ROOT_PASS=${DB_PASSWORD:-root}

echo "Configuring Database..."

# Try to connect without password first (first run), then with password (subsequent runs)
if mysql -u root -e "status" > /dev/null 2>&1; then
    echo "Configuring MySQL (Initial setup)..."
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;"
    mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '${DB_ROOT_PASS}';"
    mysql -u root -e "FLUSH PRIVILEGES;"
else
    echo "Configuring MySQL (Password already set)..."
    mysql -u root -p"${DB_ROOT_PASS}" -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;"
fi

# Run Django migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start Gunicorn
echo "Starting Gunicorn on port ${PORT:-8000}..."
exec gunicorn --bind 0.0.0.0:${PORT:-8000} hrms_backend.wsgi:application
