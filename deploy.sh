#!/bin/bash

# ============================================
# NeuraCV - Script de Deploy Automatizado
# ============================================
# Uso: bash deploy.sh
# Requisitos: Git, Railway CLI, Vercel CLI
# ============================================

set 

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

TOTAL_STEPS=6

# Verificar herramientas
echo "Verificando herramientas necesarias..."
check_command git
check_command node
check_command npm

# Verificar Railway CLI (opcional)
if command -v railway &> /dev/null; then
    RAILWAY_INSTALLED=true
    echo -e "${GREEN}✓ Railway CLI detectado${NC}"
else
    RAILWAY_INSTALLED=false
    echo -e "${YELLOW}⚠ Railway CLI no detectado. Puedes instalarlo con: npm install -g @railway/cli${NC}"
fi

# Verificar Vercel CLI (opcional)
if command -v vercel &> /dev/null; then
    VERCEL_INSTALLED=true
    echo -e "${GREEN}✓ Vercel CLI detectado${NC}"
else
    VERCEL_INSTALLED=false
    echo -e "${YELLOW}⚠ Vercel CLI no detectado. Puedes instalarlo con: npm install -g vercel${NC}"
fi

echo ""

# ============================================
# PASO 1: Verificar estado de Git
# ============================================
print_step 1 "Verificando estado de Git..."

if [ -z "$(git status --porcelain)" ]; then
    print_success "Working directory clean"
else
    echo -e "${YELLOW}⚠ Hay cambios sin commitear. ¿Quieres continuar? (s/n)${NC}"
    read -r response
    if [[ "$response" != "s" ]]; then
        echo "Deploy cancelado."
        exit 0
    fi
fi

# ============================================
# PASO 2: Build del Frontend
# ============================================
print_step 2 "Construyendo Frontend (Next.js)..."

cd frontend

# Instalar dependencias
echo "Instalando dependencias..."
npm install --silent

# Build
echo "Ejecutando build..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Frontend compilado exitosamente"
else
    print_error "Error en la compilación del frontend"
fi

cd ..

# ============================================
# PASO 3: Verificar Backend
# ============================================
print_step 3 "Verificando Backend (Laravel)..."

cd backend

# Verificar composer
if [ -f "vendor/autoload.php" ]; then
    print_success "Dependencias de Composer instaladas"
else
    echo "Instalando dependencias de Composer..."
    composer install --no-interaction --optimize-autoloader --no-dev
fi

# Verificar .env
if [ ! -f ".env" ]; then
    echo "Creando .env desde .env.example..."
    cp .env.example .env
    php artisan key:generate
    print_success ".env creado y APP_KEY generada"
fi

cd ..

# ============================================
# PASO 4: Deploy Backend a Railway
# ============================================
print_step 4 "Desplegando Backend a Railway..."

if [ "$RAILWAY_INSTALLED" = true ]; then
    echo "¿Quieres desplegar el backend a Railway ahora? (s/n)"
    read -r response
    if [[ "$response" == "s" ]]; then
        railway up --service neuracy-api
        print_success "Backend desplegado en Railway"
    else
        echo "Omitiendo deploy de backend."
    fi
else
    echo -e "${YELLOW}Para desplegar manualmente en Railway:${NC}"
    echo "  1. Conecta tu repositorio en https://railway.app"
    echo "  2. Crea un nuevo proyecto desde el repositorio"
    echo "  3. Railway detectará automáticamente el Dockerfile"
    echo "  4. Añade una base de datos PostgreSQL"
    echo "  5. Configura las variables de entorno:"
    echo "     - APP_KEY (generar con: php artisan key:generate --show)"
    echo "     - DEEPSEEK_API_KEY"
    echo "     - FRONTEND_URL=https://neuracy.vercel.app"
    echo ""
fi

# ============================================
# PASO 5: Deploy Frontend a Vercel
# ============================================
print_step 5 "Desplegando Frontend a Vercel..."

if [ "$VERCEL_INSTALLED" = true ]; then
    echo "¿Quieres desplegar el frontend a Vercel ahora? (s/n)"
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
    echo "  1. Conecta tu repositorio en https://vercel.com"
    echo "  2. Importa el proyecto (directorio: frontend/)"
    echo "  3. Vercel detectará Next.js automáticamente"
    echo "  4. Configura variable de entorno:"
    echo "     - NEXT_PUBLIC_API_URL=https://neuracy-api.up.railway.app/api"
    echo ""
fi

# ============================================
# PASO 6: Resumen
# ============================================
print_step 6 "Generando resumen del deploy..."

echo ""
echo "============================================"
echo "  📋 RESUMEN DEL DEPLOY"
echo "============================================"
echo ""
echo "  Frontend:  https://neuracy.vercel.app"
echo "  Backend:   https://neuracy-api.up.railway.app"
echo "  API Docs:  https://neuracy-api.up.railway.app/api"
echo ""
echo "  Variables de entorno requeridas:"
echo "  ┌─────────────────────────────┬──────────────────────────────────────┐"
echo "  │ Variable                    │ Dónde configurarla                   │"
echo "  ├─────────────────────────────┼──────────────────────────────────────┤"
echo "  │ APP_KEY                     │ Railway (generar con artisan)        │"
echo "  │ DEEPSEEK_API_KEY            │ Railway                              │"
echo "  │ FRONTEND_URL                │ Railway                              │"
echo "  │ NEXT_PUBLIC_API_URL         │ Vercel                               │"
echo "  └─────────────────────────────┴──────────────────────────────────────┘"
echo ""
echo "  Próximos pasos:"
echo "  1. Configurar dominio personalizado (opcional)"
echo "  2. Ejecutar migraciones: php artisan migrate"
echo "  3. Ejecutar seeders: php artisan db:seed"
echo "  4. Verificar que CORS funciona correctamente"
echo ""
echo "============================================"
echo -e "${GREEN}  ✅ Deploy preparado exitosamente${NC}"
echo "============================================"
