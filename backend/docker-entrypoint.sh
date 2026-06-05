#!/bin/sh
set -e

# Create .env from .env.example if it doesn't exist
if [ ! -f /var/www/.env ]; then
    if [ -f /var/www/.env.example ]; then
        cp /var/www/.env.example /var/www/.env
        echo "Created .env from .env.example"
    fi
fi

# Override/add environment variables passed by Railway
# This preserves any existing .env file but updates keys from the environment
if [ -f /var/www/.env ]; then
    # Export all current env vars so they are available
    # For each env var set by Railway (non-empty), update the .env file
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

# Generate app key if not set
php artisan key:generate --force

# Cache Laravel config, routes, and views
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Update nginx port to the PORT env var (Railway sets this)
sed -i "s/listen 8000/listen ${PORT:-8000}/g" /etc/nginx/sites-available/default

# Start supervisord
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
