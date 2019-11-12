# VK Connect test Direct Games

Приложение доступно по ссылке https://m.vk.com/app7170524. Поддерживается на платформах: Mobile, Android, IOS. Подробную информацию о том, что нужно сделать для запуска игры на платформе Direct Games читайте в документации https://vk.com/dev/games_vk_connect. 

### Структура проекта:

- src/methods.json - конфиг всех доступных методов vk-connect и список поддерживаемых параметров по каждому из них.
- src/vkDirectGameApp.js - модуль содержит в себе функционал для выбора необходимого метода vk-connect и отправки запроса к vk-connect.
- src/methodRequestHelper.js - модуль работает с формой для редактирования запроса для конкретного метода vk-connect. 
Подготавливает параметры для отправки запроса к vk-connect, выводит параметры запроса и отображает ответ.
- src/notify.js - модуль для показа всплывающих нотификаций.
- src/getHelperForMethod.js - модуль, который создает объект methodRequestHelper для конкретного метода vk-connect.
- src/renderMethods.js - модуль, который отвечает за вывод списка методов vk-connect на экран.
- src/UrlParser.js - модуль, который может доставать значения GET-параметров из адресной строки

### Как работает:
 
Запрос к vk-connect отправляется в методе **vkDirectGameApp.send**. 
- Сначала проверяем, что метод vk-connect поддерживается на текущей платформе с помощью **connect.supports(methodName)**
- Затем созается instance модуля **methodRequestHelper** для текущего метода vk-connect.
- **methodRequestHelper** находит нужный метод vk-connect в общем конфиге **methods.json** 
и смотрит, какие параметры он поддерижвает. 
- В методе **methodRequestHelper.fetchParams** достаем параметры из формы для этого запроса, 
приводим их к необходимому типу (**methodRequestHelper.castValue**) и собираем из них json-объект. 
Передаем этот json-объект вместе с названием метода vk-connect в функцию для отправки запроса к vk-connect (**connect.sendPromise**).
- Выводим ответ от vk-connect **methodRequestHelper.showRequest**


### Настройка покупки игровых предметов

Для покупки игровых предметов используется метод vk-connect **VKWebAppShowOrderBox**. Для работы этого метода в приложении необходимо настроить обработку колбек-запросов: 
- Для этого необходимо на странице настроек вашего приложения (https://vk.com/editapp?id={YOUR_APP_ID}&section=payments) в поле **"Адрес обратного вызова"** указать ссылку на скрипт, который будет обрабатывать колбек-запросы. 
- Документация: https://vk.com/dev/payments_callbacks. 
- Пример скрипта: https://vk.com/dev/payments_example

### Шаблонизатор

В приложение используется шаблонизатор **PUG**. Подключается через webpack в несколько шагов:
1. Подключаем модули к нашему проекту **yarn add pug pug-loader**
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

Если вы не знакомы c этим шаблонизатором, документацию можно посмотреть здесь https://pugjs.org/api/getting-started.html.
Туториал на русском https://gist.github.com/neretin-trike/53aff5afb76153f050c958b82abd9228
