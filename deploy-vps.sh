#!/bin/bash

# Ustawienia
REPO_URL="https://github.com/MajorSGJ/cleandog-website.git"
APP_DIR="/var/www/cleandog"
DOMAIN="cleandog.pl"
NODE_VERSION="18"

# Kolory
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Rozpoczynam instalację Clean Dog na VPS ===${NC}"

# 1. Aktualizacja systemu
echo -e "${GREEN}1. Aktualizacja pakietów...${NC}"
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl nginx build-essential

# 2. Instalacja Node.js (jeśli nie ma)
if ! command -v node &> /dev/null; then
    echo -e "${GREEN}2. Instalacja Node.js ${NODE_VERSION}...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo -e "${GREEN}2. Node.js jest już zainstalowany.$(node -v)${NC}"
fi

# 3. Instalacja PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${GREEN}3. Instalacja PM2...${NC}"
    sudo npm install -g pm2
else
    echo -e "${GREEN}3. PM2 jest już zainstalowany.${NC}"
fi

# 4. Pobieranie / Aktualizacja repozytorium
if [ -d "$APP_DIR" ]; then
    echo -e "${GREEN}4. Aktualizacja kodu w $APP_DIR...${NC}"
    cd $APP_DIR
    git pull
else
    echo -e "${GREEN}4. Klonowanie repozytorium do $APP_DIR...${NC}"
    sudo git clone $REPO_URL $APP_DIR
    sudo chown -R $USER:$USER $APP_DIR
    cd $APP_DIR
fi

# 5. Instalacja zależności i budowanie
echo -e "${GREEN}5. Instalacja zależności i budowanie aplikacji...${NC}"
npm install
npm run build

# 6. Konfiguracja PM2 (API Server)
echo -e "${GREEN}6. Uruchamianie API z PM2...${NC}"
pm2 stop cleandog-api || true
pm2 delete cleandog-api || true
pm2 start api-server.js --name "cleandog-api"
pm2 save
pm2 startup | tail -n 1 | bash || true

# 7. Konfiguracja Nginx
echo -e "${GREEN}7. Konfiguracja Nginx...${NC}"
sudo cp nginx.conf.example /etc/nginx/sites-available/cleandog
# Podmień domenę w konfigu jeśli inna niż w pliku example
sudo sed -i "s/server_name cleandog.pl www.cleandog.pl;/server_name $DOMAIN www.$DOMAIN;/" /etc/nginx/sites-available/cleandog

# Link sytmboliczny
if [ ! -L /etc/nginx/sites-enabled/cleandog ]; then
    sudo ln -s /etc/nginx/sites-available/cleandog /etc/nginx/sites-enabled/
fi

# Test i restart Nginx
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl restart nginx
    echo -e "${GREEN}Nginx zrestartowany pomyślnie.${NC}"
else
    echo -e "${RED}Błąd konfiguracji Nginx! Sprawdź plik /etc/nginx/sites-available/cleandog${NC}"
    exit 1
fi

echo -e "${GREEN}=== Zakończono! ===${NC}"
echo -e "Jeśli domena $DOMAIN jest skierowana na ten serwer, strona powinna działać."
echo -e "Aby włączyć HTTPS, uruchom: sudo apt install python3-certbot-nginx && sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
