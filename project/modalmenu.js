// Переменные для управления zoom и перемещением
let isDragging = false;
let startX, startY;
let translateX = 0, translateY = 0;
let currentScale = 1;

// Функция для открытия модального окна
function openModal(imageSrc, title) {
    console.log('Opening modal with image:', imageSrc, 'title:', title);
    
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    if (!modal || !modalImage || !modalTitle || !modalDescription) {
        console.error('Modal elements not found');
        return;
    }
    
    // Устанавливаем изображение и заголовок
    modalImage.src = imageSrc;
    modalTitle.textContent = title;
    
    // Сбрасываем состояние zoom и позицию
    resetZoom();
    
    // Устанавливаем описание в зависимости от заголовка
    if (title === 'Ломтев Михаил Юрьевич') {
        modalDescription.innerHTML = `
            <strong>Михаил Юрьевич Ломтев</strong><br><br>
            Родился 14 сентября 1977 года в г. Котласе. Окончил 11 классов в школе № 18, после чего поступил в Котласское речное училище. По его окончании получил высшее образование заочно. Трудовую деятельность начал как индивидуальный предприниматель. Последние 25 лет работал в системе РЖД. Был составителем поездов на станции Котлас-Южный.<br><br>
            Михаил любил свой город и свою страну. Отправиться на СВО хотел с первых дней, но останавлявали жена, дети, работа. После событий в Курской области решение было принято окончательно.<br><br>
            2 октября 2024 года Михаил уехал в Санкт-Петербург, чтобы стать бойцом войск РЖД. После учебки в Ленинградской области получил специальность наводчика в артиллерийской группе. Далее поступил в распоряжение войсковой части, расположенной в Белгородской области. Задача таких групп – уничтожать воздушные цели противника. Спустя две недели в часть пришёл запрос на добровольцев в зону проведения боевых операций на территории Украины. Михаил выступил добровольцем и уехал в город Волчанск.<br><br>
            5 декабря 2024 года Михаил погиб при исполнении боевого задания. По нему прицельно отработал вражеский дрон «Баба-яга», снаряд повредил ноги, от большой кровопотери Михаил скончался.<br><br>
            Посмертно Михаил получил звание «Почётный железнодорожник» и Орден Мужества.
        `;
    } else if (title === 'Василюк Павел Сергеевич') {
        modalDescription.innerHTML = `
            <strong>Павел Сергеевич Василюк</strong><br><br>
            Погиб в ходе СВО 3 июля 2024 года.<br><br>
        `;
    } else if (title === 'Виноградов Лев Александрович') {
        modalDescription.innerHTML = `
            <strong>Лев Александрович Виноградов</strong><br><br>
            Воевал за свободу и независимость Луганской Народной Республики.<br><br>
            Пал смертью храбрых на поле боя, проявив мужество и отвагу.<br><br>
            Глава Луганской Народной Республики Л.И.Пасечник
        `;
    } else {
        // Для других фото устанавливаем заголовок как описание
        modalDescription.textContent = title;
    }
    
    // Добавляем кнопки управления zoom
    addZoomControls(modalImage);
    
    // Показываем модальное окно
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    console.log('Modal opened successfully');
}

// Функция добавления кнопок управления zoom
function addZoomControls(imageElement) {
    const container = imageElement.parentElement;
    if (!container) return;
    
    // Удаляем старые элементы управления, если есть
    const oldControls = container.querySelector('.zoom-controls');
    const oldIndicator = container.querySelector('.zoom-indicator');
    const oldResetBtn = container.querySelector('.reset-zoom-btn');
    if (oldControls) oldControls.remove();
    if (oldIndicator) oldIndicator.remove();
    if (oldResetBtn) oldResetBtn.remove();
    
    // Создаем кнопки управления
    const zoomControls = document.createElement('div');
    zoomControls.className = 'zoom-controls';
    zoomControls.innerHTML = `
        <button class="zoom-btn" onclick="zoomOut()">-</button>
        <button class="zoom-btn" onclick="zoomIn()">+</button>
    `;
    
    // Создаем индикатор zoom
    const zoomIndicator = document.createElement('div');
    zoomIndicator.className = 'zoom-indicator';
    zoomIndicator.textContent = '100%';
    zoomIndicator.style.display = 'none';
    
    // Создаем кнопку сброса
    const resetBtn = document.createElement('button');
    resetBtn.className = 'reset-zoom-btn';
    resetBtn.innerHTML = '↺';
    resetBtn.title = 'Сбросить масштаб и позицию';
    resetBtn.onclick = resetZoom;
    
    container.appendChild(zoomControls);
    container.appendChild(zoomIndicator);
    container.appendChild(resetBtn);
    
    // Добавляем обработчики событий
    imageElement.addEventListener('dblclick', toggleZoom);
    imageElement.addEventListener('wheel', handleWheelZoom);
    imageElement.addEventListener('mousedown', startDrag);
    imageElement.addEventListener('touchstart', startDragTouch);
}

// Функция сброса zoom и позиции
function resetZoom() {
    const modalImage = document.getElementById('modalImage');
    if (!modalImage) return;
    
    const zoomIndicator = modalImage.parentElement?.querySelector('.zoom-indicator');
    
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    
    updateImageTransform();
    modalImage.classList.remove('zoomed');
    
    if (zoomIndicator) {
        zoomIndicator.textContent = '100%';
        zoomIndicator.style.display = 'block';
        setTimeout(() => {
            zoomIndicator.style.display = 'none';
        }, 2000);
    }
}

// Функция обновления трансформации изображения
function updateImageTransform() {
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
    }
}

// Функция приближения
function zoomIn() {
    const modalImage = document.getElementById('modalImage');
    if (!modalImage) return;
    
    const zoomIndicator = modalImage.parentElement?.querySelector('.zoom-indicator');
    
    currentScale = Math.min(currentScale + 0.5, 3);
    modalImage.classList.toggle('zoomed', currentScale > 1);
    updateImageTransform();
    
    if (zoomIndicator) {
        zoomIndicator.textContent = Math.round(currentScale * 100) + '%';
        zoomIndicator.style.display = 'block';
        setTimeout(() => {
            zoomIndicator.style.display = 'none';
        }, 2000);
    }
}

// Функция отдаления
function zoomOut() {
    const modalImage = document.getElementById('modalImage');
    if (!modalImage) return;
    
    const zoomIndicator = modalImage.parentElement?.querySelector('.zoom-indicator');
    
    currentScale = Math.max(currentScale - 0.5, 1);
    modalImage.classList.toggle('zoomed', currentScale > 1);
    
    if (currentScale === 1) {
        translateX = 0;
        translateY = 0;
    }
    
    updateImageTransform();
    
    if (zoomIndicator) {
        zoomIndicator.textContent = Math.round(currentScale * 100) + '%';
        zoomIndicator.style.display = 'block';
        setTimeout(() => {
            zoomIndicator.style.display = 'none';
        }, 2000);
    }
}

// Функция переключения zoom по двойному клику
function toggleZoom(event) {
    event.preventDefault();
    const modalImage = document.getElementById('modalImage');
    if (!modalImage) return;
    
    const zoomIndicator = modalImage.parentElement?.querySelector('.zoom-indicator');
    
    if (currentScale > 1) {
        resetZoom();
    } else {
        currentScale = 1.5;
        modalImage.classList.add('zoomed');
        updateImageTransform();
        
        if (zoomIndicator) {
            zoomIndicator.textContent = '150%';
            zoomIndicator.style.display = 'block';
            setTimeout(() => {
                zoomIndicator.style.display = 'none';
            }, 2000);
        }
    }
}

// Функция zoom колесиком мыши
function handleWheelZoom(event) {
    event.preventDefault();
    const modalImage = document.getElementById('modalImage');
    if (!modalImage) return;
    
    const zoomIndicator = modalImage.parentElement?.querySelector('.zoom-indicator');
    
    let delta = event.deltaY > 0 ? -0.1 : 0.1;
    currentScale = Math.max(1, Math.min(currentScale + delta, 3));
    
    modalImage.classList.toggle('zoomed', currentScale > 1);
    updateImageTransform();
    
    if (zoomIndicator) {
        zoomIndicator.textContent = Math.round(currentScale * 100) + '%';
        zoomIndicator.style.display = 'block';
        setTimeout(() => {
            zoomIndicator.style.display = 'none';
        }, 2000);
    }
}

// Функции для перемещения изображения
function startDrag(e) {
    if (currentScale <= 1) return;
    
    e.preventDefault();
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.classList.add('dragging');
    }
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function startDragTouch(e) {
    if (currentScale <= 1) return;
    
    e.preventDefault();
    isDragging = true;
    const touch = e.touches[0];
    startX = touch.clientX - translateX;
    startY = touch.clientY - translateY;
    
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.classList.add('dragging');
    }
    
    document.addEventListener('touchmove', dragTouch);
    document.addEventListener('touchend', stopDrag);
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    
    const maxMove = 100 * (currentScale - 1);
    translateX = Math.max(-maxMove, Math.min(translateX, maxMove));
    translateY = Math.max(-maxMove, Math.min(translateY, maxMove));
    
    updateImageTransform();
}

function dragTouch(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    translateX = touch.clientX - startX;
    translateY = touch.clientY - startY;
    
    const maxMove = 100 * (currentScale - 1);
    translateX = Math.max(-maxMove, Math.min(translateX, maxMove));
    translateY = Math.max(-maxMove, Math.min(translateY, maxMove));
    
    updateImageTransform();
}

function stopDrag() {
    isDragging = false;
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.classList.remove('dragging');
    }
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', dragTouch);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
}

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetZoom();
    }
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
    if (modal && modal.style.display === 'block') {
        if (!event.target.closest('.modal-text') && !event.target.closest('.modal-content')) {
            event.preventDefault();
        }
    }
}, { passive: false });

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Modal menu script loaded');
});