const filterButtonsContainer = document.querySelector('[data-js-filter-buttons]');
const productsList = document.querySelector('[data-js-products-list]');

async function loadProductsData() {
    try {
        const response = await fetch('./data/products.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        return { 
            filters: ["Франция", "Германия", "Англия"], 
            products: [] 
        };
    }
}

function renderProducts(products) {
    productsList.innerHTML = products.map(product => `
        <li class="collection__list-item">
            <article class="product">
                <picture>
                    <source srcset="${product.imageMini}" type="image/webp" media="(max-width: 480px)">
                    <source srcset="${product.imageTablet}" type="image/webp" media="(max-width: 992px)">
                    <img width="310" height="442" src="${product.image}" alt="${product.title}" loading="lazy">
                </picture>
                <div class="product__content">
                    <span class="product__author">${product.author}</span>
                    <h3 class="h3 product__title">${product.title}</h3>
                    <span class="product__props">${product.props}</span>
                    <p class="product__price">${product.price.toLocaleString()} руб</p>
                    <button class="btn product__button">В корзину</button>
                </div>
            </article>
        </li>
    `).join('');
    
    // Активируем анимацию появления
    setTimeout(() => {
        const items = productsList.querySelectorAll('.collection__list-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 100);
        });
    }, 50);
}

function filterProducts(products, country) {
    return products.filter(p => p.country === country);
}

async function init() {
    const productsData = await loadProductsData();
    
    if (!productsData.products.length) {
        productsList.innerHTML = '<div class="no-results">Данные не загружены</div>';
        return;
    }
    
    // Устанавливаем активную кнопку "Франция" по умолчанию
    const franceButton = filterButtonsContainer.querySelector('button:first-child');
    if (franceButton) {
        franceButton.classList.add('active');
    }
    
    // Показываем французские картины при загрузке
    const frenchProducts = filterProducts(productsData.products, 'Франция');
    renderProducts(frenchProducts);
    
    // Обработчики для кнопок фильтрации
    filterButtonsContainer.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function() {
            const country = this.textContent;
            
            // Анимация исчезновения
            productsList.classList.add('fade-out');
            
            // Обновляем активную кнопку
            filterButtonsContainer.querySelectorAll('button').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Задержка для плавного перехода
            setTimeout(() => {
                const filteredProducts = filterProducts(productsData.products, country);
                
                if (filteredProducts.length === 0) {
                    productsList.innerHTML = '<div class="no-results">По вашему запросу ничего не найдено</div>';
                    productsList.classList.remove('fade-out');
                } else {
                    renderProducts(filteredProducts);
                }
            }, 300);
        });
    });
}

init();