# 3 курс
# Захарова Валерия Алексеевна
# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание классов из базового кода:
1. Класс Api имеет следующие свойства и методы.\
Методы:
```handleResponse(response: Response): Promise<object>``` - обработчик ответа сервера.\
```get(uri: string)``` - принимает изменяющеюся часть url-адреса, возвращает ответ от сервера.\
```post(uri: string, data: object, method: ApiPostMethods = 'POST')``` - принимает изменяющеюся часть url-адреса, принимает данные в виде объекта для отправки на сервер, type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'.

2. Класс ```EventEmitter``` - брокер событий, ```implements``` от ```IEvents```. Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события. \
Класс имеет методы ```on``` ,  ```off``` ,  ```emit```  — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно. \
Дополнительно реализованы методы  ```onAll``` и  ```offAll```  — для подписки на все события и сброса всех подписчиков.\
```trigger``` - генерирует заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса ```EventEmitter```.

## Описание типов данных
#### 1. IProductItem - Этот интерфейс описывает структуру данных для товара.

```id: string ``` — уникальный  идентификатор товара.\
```description: string```— описание товара.\
```image: string```— ссылка на изображение товара.\
```title: string``` — название товара.\
```category: string``` — категория, к которой относится товар.\
```price: number | null``` — цена товара. Может быть числом или null, если цена не указана.\
```added: boolean``` - был данный товар добавлен в корзину или нет.

#### 2. IOrderForm- Этот интерфейс описывает структуру данных для формы заказа. 

```payment: string``` — способ оплаты.\
```address: string``` — адрес доставки.\
```phone: string``` — номер телефона.\
```email: string``` — электронная почта.\
```total_price: string``` | number — общая сумма заказа. Может быть строкой или числом.

#### 3. IOrder - Этот интерфейс описывает заказ, который включает в себя список товаров, способ оплаты, общую сумму заказа, адрес доставки, контактные данные (email и телефон)

```products: string[]``` - Массив строк, представляющих идентификаторы (ID) купленных товаров.\
```payment: string``` - Способ оплаты заказа.\
```total_price: number``` - Общая сумма заказа.\
```address: string``` - адрес доставки.\
```email: string``` - электронная почта.\
```phone: string``` - номер телефона.

#### 4. IOrderResult - Этот интерфейс описывает успешность оформления заказа.

```id: string``` — уникальный идентификатор заказа.\
```total_price: number``` — общая сумма заказа.

#### 5. FormErrors - Этот тип описывает объект, который содержит ошибки валидации для формы заказа.
```Partial<Record<keyof IOrder, string>>``` — это означает, что объект может содержать любое подмножество ключей из IOrderForm,, а значениями будут строки с описанием ошибок.
