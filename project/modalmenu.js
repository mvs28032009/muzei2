// Функция для открытия модального окна
function openModal(imageSrc, title) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    modalImage.src = imageSrc;
    modalTitle.textContent = title;
    
    // Устанавливаем описание в зависимости от заголовка
    if (title === 'Ломтев Михаил Юрьевич') {
        modalDescription.innerHTML = `
            <strong>Михаил Юрьевич Ломтев</strong><br><br>
            Родился 14 сентября 1977 года в г. Котласе. Окончил 11 классов в школе № 18, после чего поступил в Котласское речное училище. По его окончании получил высшее образование заочно. Трудовую деятельность начал как индивидуальный предприниматель. Последние 25 лет работал в системе РЖД. Был составителем поездов на станции Котлас-Южный.<br><br>
            Михаил любил свой город и свою страну. Отправиться на СВО хотел с первых дней, но останавливали жена, дети, работа. После событий в Курской области решение было принято окончательно.<br><br>
            2 октября 2024 года Михаил уехал в Санкт-Петербург, чтобы стать бойцом войск РЖД. После учебки в Ленинградской области получил специальность наводчика в артиллерийской группе. Далее поступил в распоряжение войсковой части, расположенной в Белгородской области. Задача таких групп – уничтожать воздушные цели противника. Спустя две недели в часть пришёл запрос на добровольцев в зону проведения боевых операций на территории Украины. Михаил выступил добровольцем и уехал в город Волчанск.<br><br>
            5 декабря 2024 года Михаил погиб при исполнении боевого задания. По нему прицельно отработал вражеский дрон «Баба-яга», снаряд повредил ноги, от большой кровопотери Михаил скончался.<br><br>
            Посмертно Михаил получил звание «Почётный железнодорожник» и Орден Мужества.
        `;
    } else {
        // Для других фото устанавливаем заголовок как описание
        modalDescription.textContent = title;
    }
    
    // Предотвращаем прокрутку фоновой страницы
    document.body.style.overflow = 'hidden';
    modal.style.display = 'block';
}

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('imageModal');
    
    // Восстанавливаем прокрутку фоновой страницы
    document.body.style.overflow = 'auto';
    modal.style.display = 'none';
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Обработка клавиши ESC для закрытия модального окна
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Предотвращаем прокрутку фона при прокрутке модального окна
document.addEventListener('wheel', function(event) {
    const modal = document.getElementById('imageModal');
    if (modal.style.display === 'block') {
        // Если модальное окно открыто, предотвращаем прокрутку фона
        if (!event.target.closest('.modal-text') && !event.target.closest('.modal-content')) {
            event.preventDefault();
        }
    }
}, { passive: false });