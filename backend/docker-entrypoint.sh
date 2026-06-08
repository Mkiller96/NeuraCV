#!/bin/sh
set -e

echo "=== NeuraCV Docker Entrypoint ==="

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

# Override/add environment variables passed by Railway
if [ -f /var/www/.env ]; then
    env | while IFS='=' read -r key value; do
        # Skip shell-specific variables
        case "$key" in
            HOME|PATH|PWD|SHLVL|_|HOSTNAME|TERM|LS_COLORS|LC_ALL|LANG|DEBIAN_FRONTEND|PHP_INI_DIR|PHP_CFLAGS|PHP_LDFLAGS|PHP_EXTRA_BUILD_DEPS|PHP_EXTRA_CONFIGURE_ARGS|PHPIZE_DEPS|GPG_KEYS|PHP_VERSION|PHP_ASC_URL|PHP_SHA256|PHP_URL|PHP_SELF_DIR|PHP_SELF|COMPOSER_ALLOW_SUPERUSER|COMPOSER_HOME|COMPOSER_MAX_PARALLEL_HTTP|COMPOSER_MEMORY_LIMIT|PHP_LDFLAGS|PHP_CFLAGS|PHP_CPPFLAGS)
                continue
                ;;
        esac
        # Skip empty values
        if [ -n "$value" ]; then
            # Escape the value for sed replacement
            escaped_value=$(echo "$value" | sed 's/[\/&]/\\&/g')
            # If key exists in .env, replace it; otherwise append it
            if grep -q "^${key}=" /var/www/.env; then
                sed -i "s|^${key}=.*|${key}=${escaped_value}|" /var/www/.env
            else
                echo "${key}=${value}" >> /var/www/.env
            fi
        fi
    done
fi

# Add production-safe fallback for services that don't require DB
echo "Setting safe defaults for production..."
sed -i "s/^SESSION_DRIVER=.*/SESSION_DRIVER=file/" /var/www/.env
sed -i "s/^CACHE_STORE=.*/CACHE_STORE=file/" /var/www/.env
sed -i "s/^QUEUE_CONNECTION=.*/QUEUE_CONNECTION=sync/" /var/www/.env
echo "Session/Cache set to file-based for reliability"

# Set SSL mode for PostgreSQL connection
echo "Setting PostgreSQL SSL mode..."
export PGSSLMODE=require

echo "=== .env content ==="
cat /var/www/.env | grep -v PASSWORD | grep -v KEY | grep -v SECRET || true

# Generate app key if not set
echo "=== Generating app key ==="
php artisan key:generate --force

# Cache Laravel config, routes, and views
echo "=== Caching config ==="
php artisan config:cache || echo "Config cache failed (might be expected)"
php artisan route:cache || echo "Route cache failed (might be expected)"
php artisan view:cache || echo "View cache failed (might be expected)"

# Update nginx port to the PORT env var (Railway sets this)
sed -i "s/listen 8000/listen ${PORT:-8000}/g" /etc/nginx/sites-available/default

echo "=== Starting supervisord ==="
# Start supervisord
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
