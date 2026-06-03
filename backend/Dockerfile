FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip libpq-dev nginx supervisor \
    && docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy composer files first for dependency caching
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev \
    && ls -la vendor/autoload.php || (echo "vendor/autoload.php not found!" && exit 1)

# Copy the rest of the application
COPY . .

# Copy config files from docker/ subdirectory
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/zz-docker.conf
COPY docker/nginx.conf /etc/nginx/sites-available/default
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Nginx logs to stdout/stderr
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 8000

# Dynamically set nginx port from $PORT env var (Render sets this)
# and start services
CMD php artisan key:generate --force && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    sed -i "s/listen 8000/listen ${PORT:-8000}/g" /etc/nginx/sites-available/default && \
    /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
