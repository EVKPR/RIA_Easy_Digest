// Создание в памяти понятного заголовка для будушего файла
var pageHref = document.location.href;
var pageTitle = 'Выполнен экспорт новостей РИА Новости по ссылке: ' + pageHref;
console.log('Создан заголовок для файла дайджеста: ' + '"' + pageTitle + '"');

// Создание в памяти стандартного хедера для файла с закладками и папки для новостей
var bookmarkMeta = "<!DOCTYPE NETSCAPE-Bookmark-file-1>" +
"<!-- This is an automatically generated file." +
"     It will be read and overwritten." +
"     DO NOT EDIT! -->" +
"<META HTTP-EQUIV='Content-Type' CONTENT='text/html; charset=UTF-8'>" +
"<TITLE>Дайджест новостей</TITLE>" +
"<H1>Дайджест новостей</H1>" +
"" +
"<DL><p>" +
'    <DT><H3 ADD_DATE="0" LAST_MODIFIED="0">' + pageTitle + '</H3>' + // Создание в памяти папки с закладками для браузера с заданным ранее названием
'    <DL><p>';

 // Создание массива, куда запишутся все полученные новости
var vseNovosti = [];

// Создание в памяти кнопки удаления новости из дайджеста
var deleteIconLink = browser.runtime.getURL("/images/delete_icon.png"); // Получить из папки расширения ссылку на иконку удаления новостей, чтобы вставить её в кнопку
var deleteButton = document.createElement('a');
	deleteButton.setAttribute('href', '#');
	deleteButton.setAttribute('class', 'deleteButton');
	deleteButton.setAttribute('style', 'display: inline-block; margin-top: 1%; font-size: 12px;');
	deleteButton.setAttribute('onclick', 'event.preventDefault()');
	deleteButton.innerHTML = '<img src="' + deleteIconLink + '"' + 'style="width: 25px; height: 25px;">' + '<span style="position: relative; top: 12%; padding-left: 5px;"> Удалить из дайджеста<s/span>';

// Объявление функции вставки кнопки удаления новостей
function deleteButtonInsert() {
	var EnemiesInject = document.querySelectorAll('.list-item__title'); // Выделение всех новостей на странице
	// Объявление функции удаления новостей кликом по кнопке
	function deleter() {
		var deleterNotification = this.previousSibling.innerHTML;
		console.log('Удаление новости ' + '"' + deleterNotification + '".');
		this.closest('.list-item').remove();
	};
	// Начало цикла перебора новостей для вставки в каждую кнопки удаления из дайджеста
	for (var enemyInject of EnemiesInject) {
		var deleteButtonCopy = deleteButton.cloneNode(true); // Клонирование кнопки удаления, т.к. один узел не может быть в 20+ местах одновременно
		enemyInject.after(deleteButtonCopy); // Вставка кнопки удаления новостей
		// Вставка функции удаления в каждую копию кнопки удаления новостей
		deleteButtonCopy.addEventListener('click', deleter);
	};
};

// Запуск функции вставки кнопки удаления новостей
deleteButtonInsert();

// Объявление функции стирания кнопок удаления новостей (нужно для работы подгрузки новостей)
function deleteButtonDestroyer() {
	var deleteButtonsSelector = document.querySelectorAll('.deleteButton'); // Выделение всех кнопок удаления новостей на странице
	// Цикл стирания всех существующих кнопок удаления
	for (var dB of deleteButtonsSelector) {
		dB.remove();
	};
};

// Объявление функции парсинга (перебора всех новостей на странице)
function startParsing() {
	var News = document.querySelectorAll('.list-item__title'); // Выделение всех новостей на странице
	// Начало цикла перебора новостей
	for (var newsletter of News) {
		var zag = newsletter.innerHTML;
		var ssyl = newsletter.getAttribute('href');
			var newsDay = ssyl.slice(21,23); // Получение из ссылки дня выхода новости
			var newsMonth = ssyl.slice(19,21); // Получение из ссылки месяца выхода новости
			var newsYear = ssyl.slice(15,19); // Получение из ссылки года выхода новости
			var newsDate = newsDay + "." + newsMonth + "." + newsYear; // Получение даты выхода новости в правильном формате
		    var zakladka = '        <DT><A HREF="' + ssyl + '"' + ' ADD_DATE="0" LAST_MODIFIED="0">' + zag + ' - РИА Новости, ' + newsDate + '</A>'; // Формирование кода закладки
			vseNovosti.push(zakladka); // Запись всех полученных новостей в массив
			console.log('Выполнено сохранение новости: ' + zag + '(ссылка на новость: ' + ssyl + ').');
			console.log('Создана закладка со следующим кодом: ' + zakladka);
	};
};

// Объявление функции формирования страницы дайджеста взамен оригинальной (т.е. стирание исходной страницы -> запись результата на новую страницу)
function newPage() {
	vseNovosti.length = 0; // Очистка массива новостей на всякий случай
	startParsing(); // Старт функции парсинга (перебора всех новостей на странице)
	document.doctype.remove(); // Удаляет DOCTYPE
	document.head.remove(); // Удаляет тег <head>
	document.body.remove(); // Удаляет тег <body>
	document.getElementsByTagName("html")[0].innerHTML = ""; // Удаляет оставшийся код насколько это возможно*/
	document.body.insertAdjacentHTML('beforebegin', bookmarkMeta);
	document.body.insertAdjacentHTML('afterbegin', vseNovosti);
};

// Создание в памяти функции прокрутки страницы вниз для получения дополнительных новостей
function scrollDown() {
	var moreNewsButton = document.querySelector(".list-more");
	moreNewsButton.scrollIntoView(top);
	document.querySelector('.list-more').click(); // Автоматическое нажатие на первую кнопку подгрузки на странице (дальше она нажимается сама)
	deleteButtonDestroyer() // Удаление кнопок удаления (если/где они были вставлены), чтобы вставить их заново с учётом дополнительных новостей
	setTimeout(deleteButtonInsert, 1000); // Повторный запуск (с намеренной задержкой) вставки кнопок удаления, чтобы охватить и нижние новости
	console.clear(); // Очистка уведомлений консоли о прошлом парсинге новостей, т.к. его результаты стираются
	console.log('Пользователь выбрал добавление дополнительных новостей.');
	vseNovosti.length = 0; // Очистка массива новостей при нажатии на скролл, т.к. нужно заново записать массив с учётом дополнительных новостей
	startParsing(); // Повторный запуск парсинга, чтобы включить в очищенный массив верхние и нижние новости
};

// Создание в памяти кнопки для добавления дайджеста в архивах новостей по датам
var iconlink = browser.runtime.getURL("/images/bookmark_icon.png"); // Получить ссылку на иконку закладки из папки
var bookm = document.createElement('div');
	bookm.setAttribute("style", "border-radius: 39px 39px 0px 0px; height: 35px; text-align: center; background-color: #010f40; cursor: pointer;");
	bookm.innerHTML = '<span style="display: inline-block; padding-top: 5px;"><img src="' + iconlink + '"' + 'style="width: 25px; height: 25px;' + '">' + 'Создать дайджест</span>';
	bookm.addEventListener("click", newPage);
	
// Создание в памяти кнопки прокрутки страницы вниз для получения дополнительных новостей
var scrollButton = document.createElement('div');
	scrollButton.setAttribute("style", "border-radius: 0px 0px 39px 39px; height: 35px; text-align: center; background-color: #ff331c; cursor: pointer; margin-top: 2px;");
	scrollButton.innerHTML = '<span style="display: inline-block; padding-top: 5px;">↓ Добавить ещё новости ↓<span>';
	scrollButton.addEventListener("click", scrollDown);

// Создание в памяти контейнера для позиционирования обеих кнопок
var buttonContainer = document.createElement('div');
	buttonContainer.setAttribute("style", "width: 300px; height: 100px; text-align: center; position: fixed; top: 25%; right: 24%; z-index: 1000; font-family: NotoSans, Arial, sans-serif; font-size: 16px; color: #ffffff;");
	buttonContainer.setAttribute("class", "buttonContainer");

// Выбор правильной кнопки в зависимости от типа ссылки (архив по дате или тег)
if (pageHref.indexOf('https://ria.ru/202') !== -1) {
		var vstavka = document.querySelector(".rubric-title"); // Выбирается основной заголовок на странице архива
		vstavka.after(buttonContainer); // Вставка после заголовка страницы контейнера для позиционирования обеих кнопок
		var containerAppear = document.querySelector(".buttonContainer"); // Выбирается контейнер кнопок, чтобы вставить в него обе кнопки
		containerAppear.prepend(bookm); // Вставка кнопки создания дайджеста
		containerAppear.append(scrollButton); // Вставка кнопки пролистывания страницы и добавления новостей
	} else {
		var vstavka2 = document.querySelector(".tag-input__tags");  // Выбирается основной заголовок на странице тега
		vstavka2.after(buttonContainer); // Вставка после заголовка страницы контейнера для позиционирования обеих кнопок
		var containerAppear = document.querySelector(".buttonContainer"); // Выбирается контейнер кнопок, чтобы вставить в него обе кнопки
		containerAppear.prepend(bookm); // Вставка кнопки создания дайджеста
		containerAppear.append(scrollButton); // Вставка кнопки пролистывания страницы и добавления новостей
}