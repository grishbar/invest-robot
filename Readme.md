# Установка и запуск проекта
1. Для установки используйте node v18.2.0 и npm 8.9.0
2. В корне приложения создайие .env файл и положите туда ваш [API токен](https://tinkoff.github.io/investAPI/token/) в переменную TOKEN
3. В корне приложения запустите 
```sh
npm install
```
4. Далее доустановите sdk
```sh
npm run postinstall
```
5. Установите frontend проекта
```sh
cd client
npm install
```
6. Из корня проекта запустите dev сервер
```sh
npm run dev
```
7. Откройте [http://localhost:3000/](http://localhost:3000/) и трогайте/разрабатывайте проект

# Описание торговой стратегии и конфигурации