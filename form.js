// Slider 

const slides = document.querySelectorAll('.offer__slide');
const prevBtn = document.querySelector('.offer__slider-prev');
const nextBtn = document.querySelector('.offer__slider-next'),
total = document.querySelector('#total'),
current = document.querySelector('#current');

let slideIndex = 1;
showSlides(slideIndex);

if(slides.length <10){
    total.textContent = `0${slides.length}`;
}
else{
    total.textContent = slides.length;
}

function showSlides(n) {
    if (n > slides.length) {
        slideIndex = 1;
    }

    if (n < 1) {
        slideIndex = slides.length;
    }

    slides.forEach(item => item.style.display = 'none');
    slides[slideIndex - 1].style.display = 'block';

    if(slides.length <10){
        current.textContent = `0${slideIndex}`;
    }
    else{
        total.textContent = slideIndex;
    }


}


function plusSLides(n){
    showSlides(slideIndex +=n);
}

prevBtn.addEventListener('click', () =>{
    plusSLides(-1);
})


nextBtn.addEventListener('click', () =>{
    plusSLides(1);
})














// Class

class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.descr = descr;
        this.price = price;
        this.classes = classes;
        this.parent = document.querySelector(parentSelector);
        this.transfer = 27;
        this.changeToKZT();
    }

    changeToKZT() {
        this.price = this.price * this.transfer;
    }

    render() {
        const element = document.createElement('div');
        if (this.classes.length === 0) {
            this.element = 'menu__item';
            element.classList.add(this.element)
        } else {
            this.classes.forEach(className => element.classList.add(className));
        }
        element.innerHTML = `
        <img src=${this.src} alt=${this.alt}>
        <h3 class="menu__item-subtitle">${this.title}"</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>`;

        this.parent.append(element);
    }
}

const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
}

// await нужно писать перед фугкцие или действием нужно для того чтобы дать польностью завершитьсе функцие 

getResource('http://localhost:3000/menu')
    .then(data => {
        data.forEach(({ img, altimg, title, descr, price }) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
        })
    })

// getResource('http://localhost:3000/menu')
// .then(data => createCard(data))

// function createCard(data) {
//     data.forEach(({img, altimg, title, descr, price}) => {
//         const element = document.createElement('div');
//         element.classList.add('menu__item');
//         element.innerHTML =`
//         <img src=${img} alt=${altimg}>
//         <h3 class="menu__item-subtitle">${title}"</h3>
//         <div class="menu__item-descr">${descr}</div>
//         <div class="menu__item-divider"></div>
//         <div class="menu__item-price">
//                 <div class="menu__item-cost">Цена:</div>
//                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
//             </div>;
//         `;
//         document.querySelector('.menu .container').append(element);
//     });
// }



// Modal 
const modalTrigger = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal');


modalTrigger.forEach(btn => {
    btn.addEventListener('click', () => {
        openModal();
    });
});

function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}


function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
}


modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == '') {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === "Escape" && modal.classList.contains('show')) {
        closeModal();
    }
})

const modalTimerId = setTimeout(openModal, 5000);

function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
        openModal();
        window.removeEventListener('scroll', showModalByScroll);
    }
}

window.addEventListener('scroll', showModalByScroll);





// Form



const forms = document.querySelectorAll('form');
const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что то пошло не так'
};

forms.forEach(item => {
    bindPostData(item);
});


function bindPostData(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const statusMessage = document.createElement('img');
        statusMessage.src = message.loading;
        statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
        `;
        form.insertAdjacentElement('afterend', statusMessage);

        const formData = new FormData(form);

        const json = JSON.stringify(Object.fromEntries(formData.entries()));

        getResource('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModel(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModel(message.failure);
            }).finally(() => {
                form.reset();
            })


    });
}

function showThanksModel(message) {
    const prevModalDialog = document.querySelector('.modal__dialog')
    prevModalDialog.classList.add('hide');
    openModal();
    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
    <div class="modal__content">
        <div class="modal__close" data-close>×</div>
        <div class="modal__title">${message}</div>
    </div>
    `;

    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
        thanksModal.remove();
        prevModalDialog.classList.add('show');
        prevModalDialog.classList.remove('hide');
        closeModal();
    }, 4000);

}