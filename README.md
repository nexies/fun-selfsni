# Fun Sites как SelfSNI для Reality

Эта конфигурация адаптирована под схему SelfSNI:

```text
Интернет :443
    ↓
Reality / Xray / 3x-ui
    ↓  PROXY protocol, xver=1
127.0.0.1:9000
    ↓
Nginx в Docker с сертификатом Certbot
    ↓
выбранный сайт
```

Порт `9000` не публикуется наружу: Docker привязывает его только к
`127.0.0.1`.

## 1. Подготовка

Посмотрите имя сертификата:

```bash
sudo certbot certificates
```

Создайте `.env`:

```bash
cp .env.example .env
nano .env
```

Пример:

```dotenv
CERT_NAME=example.com
SERVER_NAME=example.com
CERTBOT_DIR=/etc/letsencrypt
SELFSNI_PORT=9000

DOCKER_SUBNET=172.31.250.0/24
DOCKER_GATEWAY=172.31.250.1
TRUSTED_PROXY_CIDR=172.31.250.0/24
```

`CERT_NAME` — имя каталога после `/etc/letsencrypt/live/`, а не обязательно
сам домен. Например, Certbot может создать каталог `example.com-0001`.

В контейнер монтируется весь `/etc/letsencrypt`, поскольку файлы из `live`
обычно являются символическими ссылками на `archive`.

## 2. Запуск сайта

Матрица:

```bash
docker compose --profile matrix up -d
```

Терминал:

```bash
docker compose --profile terminal up -d
```

Частицы:

```bash
docker compose --profile particles up -d
```

Cyberpunk:

```bash
docker compose --profile cyberpunk up -d
```

Fluid:

```bash
docker compose --profile fluid up -d
```

Одновременно запускайте только один профиль.

Проверка контейнеров:

```bash
docker compose ps
docker compose logs -f
```

Проверка, что SelfSNI слушает только localhost:

```bash
sudo ss -lntp | grep ':9000'
```

Ожидаемая привязка:

```text
127.0.0.1:9000
```

## 3. Настройки Reality / 3x-ui / Marzban

Укажите:

```text
DEST / Target: 127.0.0.1:9000
SNI / Server name: example.com
xver: 1
```

Домен указывается без `https://` и без порта.

`xver=1` обязателен: Nginx слушает с параметром `proxy_protocol` и ожидает
PROXY protocol перед TLS-соединением.

Обычный запрос напрямую к `https://example.com:9000` не является корректной
проверкой: браузер не отправляет PROXY header. Проверять сайт следует через
публичный Reality-вход на порту 443.

Если установлен curl с поддержкой HAProxy protocol, локальную цепочку можно
проверить так:

```bash
curl -vk \
  --haproxy-protocol \
  --resolve example.com:9000:127.0.0.1 \
  https://example.com:9000/
```

Замените `example.com` своим доменом.

## 4. Переключение сайта

```bash
docker compose down
docker compose --profile fluid up -d
```

## 5. Обновление сертификата

После обновления сертификата перезагрузите Nginx:

```bash
./reload-https.sh
```

Deploy hook:

```bash
sudo certbot renew \
  --deploy-hook /полный/путь/fun-sites-selfsni/reload-https.sh
```

Порт 80 и способ автоматического продления сертификата остаются на стороне
хостовой конфигурации Certbot/Nginx. Этот Compose публикует только локальный
SelfSNI-порт.

## 6. Если Docker-подсеть конфликтует

Выберите другую приватную подсеть и измените сразу три значения:

```dotenv
DOCKER_SUBNET=172.30.250.0/24
DOCKER_GATEWAY=172.30.250.1
TRUSTED_PROXY_CIDR=172.30.250.0/24
```

После изменения сети:

```bash
docker compose down
docker compose --profile matrix up -d
```
