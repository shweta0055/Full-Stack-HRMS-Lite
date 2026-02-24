#!/bin/sh

# Set up MariaDB directory
mkdir -p /run/mysqld
chown -R mysql:mysql /run/mysqld
chown -R mysql:mysql /var/lib/mysql

# Initialize MySQL data directory if empty
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "Initializing MySQL database..."
    mysql_install_db --user=mysql --datadir=/var/lib/mysql --skip-test-db > /dev/null
fi

# Start MySQL in background with skip-grant-tables to ensure we can always configure it
echo "Starting MySQL for configuration..."
mariadbd --user=mysql --datadir=/var/lib/mysql --skip-grant-tables --skip-networking &

# Wait for MySQL to be ready
echo "Waiting for MySQL to start..."
while ! mysqladmin ping --silent; do
    sleep 1
done

# Database credentials
DB_NAME=${DB_NAME:-hrms_lite}
DB_ROOT_PASS=${DB_PASSWORD:-root}

echo "Configuring Database inside skip-grant-tables mode..."
mysql -e "FLUSH PRIVILEGES;"
mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;"
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '${DB_ROOT_PASS}';"
mysql -e "FLUSH PRIVILEGES;"

# Stop the insecure instance
echo "Stopping temporary MySQL instance..."
mysqladmin -u root -p"${DB_ROOT_PASS}" shutdown

# Start MySQL normally
echo "Starting MySQL normally..."
mariadbd-safe --user=mysql --datadir=/var/lib/mysql &

# Wait for MySQL to be ready again
echo "Waiting for MySQL to restart..."
while ! mysqladmin -u root -p"${DB_ROOT_PASS}" ping --silent; do
    sleep 1
done

# Run Django migrations
echo "Running migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput


# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start Gunicorn
echo "Starting Gunicorn on port ${PORT:-8000}..."
exec gunicorn --bind 0.0.0.0:${PORT:-8000} hrms_backend.wsgi:application
