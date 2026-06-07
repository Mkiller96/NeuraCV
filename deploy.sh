#!/bin/bash

# ============================================
# NeuraCV - Script de Deploy Automatizado
# ============================================
# Uso: bash deploy.sh
# Requisitos: Git, Vercel CLI (opcional)
# ============================================

set -e

echo "============================================"
echo "  NeuraCV - Deploy Automatizado"
echo "============================================"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funciones
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}Error: $1 no está instalado.${NC}"
        echo "Instálalo primero antes de continuar."
        exit 1
    fi
}

print_step() {
    echo -e "${YELLOW}[$1/$TOTAL_STEPS]${NC} $2"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

TOTAL_STEPS=8

# Verificar herramientas
echo "Verificando herramientas necesarias..."
check_command git
check_command node
check_command npm

# Verificar Vercel CLI (opcional)
if command -v vercel &> /dev/null; then
    VERCEL_INSTALLED=true
    print_success "Vercel CLI detectado"
else
    VERCEL_INSTALLED=false
    print_warning "Vercel CLI no detectado. Puedes instalarlo con: npm install -g vercel"
fi

# Verificar Railway CLI (opcional)
if command -v railway &> /dev/null; then
    RAILWAY_INSTALLED=true
    print_success "Railway CLI detectado"
else
    RAILWAY_INSTALLED=false
    print_warning "Railway CLI no detectado. Instálalo con: npm install -g @railway/cli"
fi

echo ""

# ============================================
# PASO 1: Verificar estado de Git y pushear
# ============================================
print_step 1 "Verificando estado de Git..."

if [ -z "$(git status --porcelain)" ]; then
    print_success "Working directory clean"
else
    echo -e "${YELLOW}⚠ Hay cambios sin commitear. ¿Quieres commitear y pushear? (s/n)${NC}"
    read -r response
    if [[ "$response" == "s" ]]; then
        git add .
        echo "Mensaje del commit:"
        read -r commit_msg
        git commit -m "$commit_msg"
        git push origin main
        print_success "Cambios subidos a GitHub"
    else
        echo "Deploy cancelado."
        exit 0
    fi
fi

# ============================================
# PASO 2: Verificar .env y variables de entorno
# ============================================
print_step 2 "Verificando .env del Backend..."

cd backend

# Verificar que existe .env
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "Creando .env desde .env.example..."
        cp .env.example .env
        php artisan key:generate
        print_success ".env creado y APP_KEY generada"
    else
        print_error "No se encontró .env ni .env.example en backend/"
    fi
fi

# Cargar variables del .env
source .env 2>/dev/null || true

echo ""
echo "  Variables configuradas en .env:"
echo "  ┌─────────────────────────────┬──────────────────────────────────────┐"
echo "  │ APP_URL                     │ ${APP_URL:-<no configurado>}         │"
echo "  │ DB_CONNECTION               │ ${DB_CONNECTION:-<no configurado>}   │"
echo "  │ DB_HOST                     │ ${DB_HOST:-<no configurado>}         │"
echo "  │ DB_DATABASE                 │ ${DB_DATABASE:-<no configurado>}     │"
echo "  │ DEEPSEEK_API_KEY            │ ${DEEPSEEK_API_KEY:+****configurado****}${DEEPSEEK_API_KEY:-<no configurado>} │"
echo "  │ FRONTEND_URL                │ ${FRONTEND_URL:-<no configurado>}    │"
echo "  └─────────────────────────────┴──────────────────────────────────────┘"
echo ""

# ============================================
# PASO 3: Verificar conexión a PostgreSQL (Supabase)
# ============================================
print_step 3 "Verificando conexión a la base de datos (PostgreSQL - Supabase)..."

DB_HOST="${DB_HOST:-db.gnfdxtadtcorogklhwbs.supabase.co}"
DB_PORT="${DB_PORT:-5432}"
DB_DATABASE="${DB_DATABASE:-postgres}"
DB_USERNAME="${DB_USERNAME:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-NeuroCV2026}"

if command -v psql &> /dev/null; then
    echo "  Probando conexión a PostgreSQL en $DB_HOST:$DB_PORT..."
    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_DATABASE" -c "SELECT 1" -t 2>/dev/null | grep -q 1; then
        print_success "Conexión a PostgreSQL exitosa"
    else
        print_warning "No se pudo conectar a PostgreSQL. Verifica credenciales o conectividad."
        echo "  Recuerda: Supabase requiere SSL y allowlisting de IPs en producción."
    fi
else
    print_warning "psql no instalado. No se pudo verificar conexión a PostgreSQL."
    echo "  Para instalar: apt-get install postgresql-client (Linux) o brew install libpq (Mac)"
fi

# ============================================
# PASO 4: Verificar Redis (opcional - no disponible en Railway free)
# ============================================
print_step 4 "Verificando Redis..."

REDIS_HOST="${REDIS_HOST:-127.0.0.1}"
REDIS_PORT="${REDIS_PORT:-6379}"

if command -v redis-cli &> /dev/null; then
    if redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" ping 2>/dev/null | grep -q "PONG"; then
        print_success "Conexión a Redis exitosa"
    else
        print_warning "Redis no está disponible en $REDIS_HOST:$REDIS_PORT"
        echo "  La app usará sesiones en BD y cache en archivos como fallback."
        echo "  Railway free tier no incluye Redis. Si lo necesitas, agrega Redis en Railway Dashboard."
    fi
else
    print_warning "redis-cli no instalado. No se pudo verificar Redis."
    echo "  La app usará sesiones en BD y cache en archivos como fallback."
fi

# ============================================
# PASO 5: Build del Frontend
# ============================================
print_step 5 "Construyendo Frontend (Next.js)..."

cd ../frontend

echo "Instalando dependencias..."
npm install --silent

echo "Ejecutando build..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Frontend compilado exitosamente"
else
    print_error "Error en la compilación del frontend"
fi

cd ..

# ============================================
# PASO 6: Verificar Backend (Laravel)
# ============================================
print_step 6 "Verificando Backend (Laravel)..."

cd backend

if [ -f "vendor/autoload.php" ]; then
    print_success "Dependencias de Composer instaladas"
else
    echo "Instalando dependencias de Composer..."
    composer install --no-interaction --optimize-autoloader --no-dev
fi

# Generar APP_KEY si no existe
if grep -q "APP_KEY=$" .env || ! grep -q "APP_KEY=" .env; then
    echo "Generando APP_KEY..."
    php artisan key:generate
    print_success "APP_KEY generada"
fi

cd ..

# ============================================
# PASO 7: Deploy Backend a Railway
# ============================================
print_step 7 "Desplegando Backend a Railway..."

echo ""
echo "  ╔══════════════════════════════════════════════════════════════╗"
echo "  ║              DEPLOY A RAILWAY                                ║"
echo "  ╠══════════════════════════════════════════════════════════════╣"
echo "  ║  railway.json (raíz) → builder: DOCKERFILE                   ║"
echo "  ║  → dockerfilePath: backend/Dockerfile                        ║"
echo "  ║  → healthcheck: /api/health                                  ║"
echo "  ╠══════════════════════════════════════════════════════════════╣"
echo "  ║  Opción 1: Dashboard (recomendado)                           ║"
echo "  ║  1. Ve a https://railway.app → New Project                   ║"
echo "  ║  2. Deploy from GitHub repo → Mkiller96/NeuraCV              ║"
echo "  ║  3. Add PostgreSQL (o configura Supabase manualmente)        ║"
echo "  ║  4. Agrega variables de entorno en el Dashboard              ║"
echo "  ╠══════════════════════════════════════════════════════════════╣"
echo "  ║  Opción 2: Railway CLI (si lo tienes)                        ║"
echo "  ║  railway login                                               ║"
echo "  ║  railway link                                                ║"
echo "  ║  railway up --detach                                         ║"
echo "  ╠══════════════════════════════════════════════════════════════╣"
echo "  ║  Opción 3: Git push (auto-deploy)                            ║"
echo "  ║  git push origin main                                        ║"
echo "  ╚══════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${YELLOW}¿Quieres abrir el Dashboard de Railway ahora? (s/n)${NC}"
read -r open_railway
if [[ "$open_railway" == "s" ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "https://railway.app"
    elif command -v open &> /dev/null; then
        open "https://railway.app"
    else
        echo "Abre manualmente: https://railway.app"
    fi
fi

echo ""

# ============================================
# PASO 7.5: Configurar variables en Railway
# ============================================
echo "  Variables de entorno para Railway Dashboard:"
echo "  ┌─────────────────────────────┬──────────────────────────────────────┐"
echo "  │ Variable                    │ Valor                                │"
echo "  ├─────────────────────────────┼──────────────────────────────────────┤"
echo "  │ APP_KEY                     │ $(grep APP_KEY backend/.env | cut -d= -f2) │"
echo "  │ APP_URL                     │ https://api.neurocv.net              │"
echo "  │ DB_CONNECTION               │ pgsql                                │"
echo "  │ DB_HOST                     │ ${DB_HOST}                  │"
echo "  │ DB_PORT                     │ ${DB_PORT}                           │"
echo "  │ DB_DATABASE                 │ ${DB_DATABASE}                       │"
echo "  │ DB_USERNAME                 │ ${DB_USERNAME}                       │"
echo "  │ DB_PASSWORD                 │ **** (configurada en .env)           │"
echo "  │ DEEPSEEK_API_KEY            │ **** (configurada en .env)           │"
echo "  │ FRONTEND_URL                │ https://neurocv.net                  │"
echo "  │ SANCTUM_STATEFUL_DOMAINS    │ neurocv.net,www.neurocv.net          │"
echo "  │ REDIS_HOST                  │ (opcional, Railway Redis addon)      │"
echo "  │ REDIS_PORT                  │ (opcional, Railway Redis addon)      │"
echo "  │ REDIS_PASSWORD              │ (opcional, Railway Redis addon)      │"
echo "  └─────────────────────────────┴──────────────────────────────────────┘"
echo ""

# ============================================
# PASO 8: Deploy Frontend a Vercel
# ============================================
print_step 8 "Desplegando Frontend a Vercel..."

if [ "$VERCEL_INSTALLED" = true ]; then
    echo -e "${YELLOW}¿Quieres desplegar el frontend a Vercel ahora? (s/n)${NC}"
    read -r response
    if [[ "$response" == "s" ]]; then
        cd frontend
        vercel --prod
        cd ..
        print_success "Frontend desplegado en Vercel"
    else
        echo "Omitiendo deploy de frontend."
    fi
else
    echo -e "${YELLOW}Para desplegar manualmente en Vercel:${NC}"
    echo "  1. Ve a https://vercel.com/import"
    echo "  2. Importa el repositorio Mkiller96/NeuraCV"
    echo "  3. Configura: Root Directory = frontend/"
    echo "  4. Framework = Next.js (automático)"
    echo "  5. Environment Variable:"
    echo "     - NEXT_PUBLIC_API_URL = https://api.neurocv.net/api"
    echo "  6. Deploy"
    echo ""
fi

# ============================================
# RESUMEN FINAL
# ============================================
echo ""
echo "============================================"
echo "  📋 RESUMEN DEL DEPLOY"
echo "============================================"
echo ""
  echo "  Frontend:         https://neurocv.net"
  echo "  Backend:          https://api.neurocv.net"
  echo "  API Base:         https://api.neurocv.net/api"
  echo "  Health Check:     https://api.neurocv.net/api/health"
echo ""
echo "  Base de datos:"
  echo "  ─────────────────────────────────────────"
  echo "  Motor:        PostgreSQL (Supabase)"
  echo "  Host:         $DB_HOST"
  echo "  Puerto:       $DB_PORT"
  echo "  Base:         $DB_DATABASE"
echo ""
echo "  Cache/Sesión:"
  echo "  ─────────────────────────────────────────"
  echo "  Redis:        ${REDIS_HOST:-No disponible (fallback a BD/archivos)}"
echo ""
echo "  ☁️  Cloudflare DNS:"
echo "  ─────────────────────────────────────────"
echo "  CNAME @        → neurocv.net   (Vercel)"
echo "  CNAME api      → [railway-url].up.railway.app"
echo ""
echo "  🚀 Post-deploy:"
echo "  ─────────────────────────────────────────"
echo "  1. Migraciones: railway run php artisan migrate"
echo "  2. Storage link: railway run php artisan storage:link"
echo "  3. Verificar:   curl https://api.neurocv.net/api/health"
echo "  4. CORS test:   curl -I https://api.neurocv.net/api -H 'Origin: https://neurocv.net'"
echo ""
echo "  ⚠  Notas importantes:"
echo "  - Railway asigna $PORT automáticamente (nginx se adapta)"
echo "  - El entrypoint genera APP_KEY automáticamente si no existe"
echo "  - Si no hay Redis, Laravel usará sesiones en BD y cache en disco"
echo "  - Para agregar Redis: Railway Dashboard → Add Plugin → Redis"
echo ""
echo "============================================"
echo -e "${GREEN}  ✅ Deploy preparado exitosamente${NC}"
echo "============================================"
