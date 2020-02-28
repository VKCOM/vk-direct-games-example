# VK bridge test Direct Games

Приложение доступно по ссылке https://m.vk.com/app7170524. Поддерживается на платформах: m.vk.com, Android, iOS. 
Гайд по быстрой интеграции https://vk.com/dev/games_vk_connect. 

### Структура проекта:

- src/methods.json - конфиг всех доступных методов VK Bridge и список поддерживаемых параметров по каждому из них.
- src/vkDirectGameApp.js - модуль для выбора метода и отправки запроса через VK Bridge.
- src/methodRequestHelper.js - модуль для редактирования параметров запроса.
- src/notify.js - модуль для показа всплывающих нотификаций.
- src/getHelperForMethod.js - модуль для создания methodRequestHelper для методов VK Bridge.
- src/renderMethods.js - модуль для отображения списка методов VK Bridge.
- src/UrlParser.js - достает GET-параметры из адресной строки

### Как работает:
 
Запрос к VK Bridge отправляется в методе **vkDirectGameApp.send**. 
- Проверяем доступность метода на текущей платформе с помощью **bridge.supports(methodName)**
- Создаем **methodRequestHelper** для метода.
- **methodRequestHelper** находит метод в конфиге **methods.json**
- Достаем параметры из формы  с помощью **methodRequestHelper.fetchParams**, приводим их к нужному типу (**methodRequestHelper.castValue**), собираем json-объект. 
- Отправляем запрос через (**bridge.sendPromise**).
- Выводим ответ методом **methodRequestHelper.showRequest**


### Внутриигровые покупки

Для покупки игровых предметов используется метод **VKWebAppShowOrderBox**. Для работы необходимо настроить обработку колбек-запросов: 
- На странице настроек вашего приложения (https://vk.com/editapp?id={YOUR_APP_ID}&section=payments) в поле **"Адрес обратного вызова"** указать ссылку на скрипт, который обрабатывает колбек-запросы. 
- Документация: https://vk.com/dev/payments_callbacks
- Пример скрипта: https://vk.com/dev/payments_example

### Шаблонизатор

В приложение используется шаблонизатор **PUG**. Подключается через webpack в несколько шагов:
1. Подключаем модули к проекту **yarn add pug pug-loader**
2. Добавляем в секцию **module** в файле **webpack.config.js** pug-loader:
```text
 {
    test: ,/\.pug$/,
    loader: 'pug-loader',
    options: {
      pretty: true
    }
}
```
3. В секцию plugins добавляем код, который при сборке проекта будет генерировать html страницу на основе шаблонов
```js
new HtmlWebpackPlugin({
      template: path.resolve('src/pages/index.pug'),
      filename: "../index.html"
    })
```

Документация по шаблонизатору https://pugjs.org/api/getting-started.html.
Туториал на русском https://gist.github.com/neretin-trike/53aff5afb76153f050c958b82abd9228
