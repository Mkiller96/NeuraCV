#!/bin/sh
set -e

echo "=== NeuraCV Docker Entrypoint ==="

# Render does not preserve the container filesystem between deployments. Fail
# before starting a half-configured API instead of generating ephemeral secrets
# or waiting for migrations to time out against localhost.
if [ "${RENDER:-false}" = "true" ]; then
    if [ -z "${APP_KEY:-}" ]; then
        echo "ERROR: APP_KEY is required in the Render environment." >&2
        exit 1
    fi

    if [ "${DB_CONNECTION:-}" != "pgsql" ]; then
        echo "ERROR: DB_CONNECTION must be pgsql on Render; use a persistent PostgreSQL database." >&2
        exit 1
    fi

    if [ -z "${DB_URL:-}" ]; then
        for variable in DB_HOST DB_PORT DB_DATABASE DB_USERNAME DB_PASSWORD; do
            case "$variable" in
                DB_HOST) value="${DB_HOST:-}" ;;
                DB_PORT) value="${DB_PORT:-}" ;;
                DB_DATABASE) value="${DB_DATABASE:-}" ;;
                DB_USERNAME) value="${DB_USERNAME:-}" ;;
                DB_PASSWORD) value="${DB_PASSWORD:-}" ;;
            esac
            if [ -z "$value" ]; then
                echo "ERROR: $variable is required when DB_URL is not set." >&2
                exit 1
            fi
        done

        case "$DB_HOST" in
            localhost|127.0.0.1)
                echo "ERROR: DB_HOST points to this container. Configure a reachable PostgreSQL service." >&2
                exit 1
                ;;
        esac
    fi
fi

# Ensure .env exists
if [ ! -f /var/www/.env ]; then
    if [ -f /var/www/.env.example ]; then
        cp /var/www/.env.example /var/www/.env
        echo "Created .env from .env.example"
    else
        # Create a minimal .env if no .env.example exists
        echo "APP_KEY=" > /var/www/.env
        echo "APP_ENV=production" >> /var/www/.env
        echo "Created minimal .env"
    fi
fi

# Generate a local development key only. Production must receive a stable
# APP_KEY through the hosting provider's secret environment variables.
if [ -z "${APP_KEY:-}" ]; then
    echo "=== Generating local app key ==="
    php artisan key:generate --force
fi

# Cache Laravel config, routes, and views
echo "=== Caching config ==="
php artisan config:cache || echo "Config cache failed (might be expected)"
php artisan route:cache || echo "Route cache failed (might be expected)"
php artisan view:cache || echo "View cache failed (might be expected)"

# Run database migrations (creates tables if they don't exist)
echo "=== Running migrations ==="
php artisan migrate --force

# Keep the public catalog available after every deploy. This seeder is
# idempotent and does not create demo users or overwrite user data.
echo "=== Seeding CV templates ==="
php artisan db:seed --class=TemplateSeeder --force

# Update nginx port to the PORT env var (Railway sets this)
sed -i "s/listen 8000/listen ${PORT:-8000}/g" /etc/nginx/sites-available/default

echo "=== Starting supervisord ==="
# Start supervisord
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
