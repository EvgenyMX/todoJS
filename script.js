window.addEventListener('DOMContentLoaded', function() {

    // Tabs
    
	let tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function hideTabContent() {
        
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
	}

	function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }
    
    hideTabContent();
    showTabContent();

	tabsParent.addEventListener('click', function(event) {
		const target = event.target;
		if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
		}
    });
    







    // Timer

    const deadline = '2020-05-11';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor( (t/(1000*60*60*24)) ),
            seconds = Math.floor( (t/1000) % 60 ),
            minutes = Math.floor( (t/1000/60) % 60 ),
            hours = Math.floor( (t/(1000*60*60) % 24) );

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num){
        if (num >= 0 && num < 10) { 
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {

        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
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
        if (e.target === modal || e.target.getAttribute('data-close') == "") {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) { 
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 300000);
    // ?????????????? ????????????????, ?????????? ???? ??????????????????

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    // ???????????????????? ???????????? ?????? ???????????????? ???????????????? ????????

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
            this.changeToUAH(); 
        }

        changeToUAH() {
            this.price = this.price * this.transfer; 
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">????????:</div>
                    <div class="menu__item-total"><span>${this.price}</span> ??????/????????</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
            });
        });

    // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));

    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         const element = document.createElement('div');

    //         element.classList.add("menu__item");

    //         element.innerHTML = `
    //             <img src=${img} alt=${altimg}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">????????:</div>
    //                 <div class="menu__item-total"><span>${price}</span> ??????/????????</div>
    //             </div>
    //         `;
    //         document.querySelector(".menu .container").append(element);
    //     });
    // }

    // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: '??????????????! ?????????? ???? ?? ???????? ????????????????',
        failure: '??????-???? ?????????? ???? ??????...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
    
        return await res.json();
    };

    async function getResource(url) {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
        
            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>??</div>
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



    function sliderMenu() { 
        const arrowPrev = document.querySelector('.offer__slider-prev'),
                arrowNext = document.querySelector('.offer__slider-next'),
                slideItem = document.querySelectorAll('.offer__slide'),
                wrapperSlides = document.querySelector('.offer__slider-wrapper'),
                slideTotal = document.querySelector('#total'),
                slideCurrent = document.querySelector('#current');
        let sliderIndex = 1;
            

            // ?????????????? ?????????? ???????????????????? ??????????????
            slideTotal.innerHTM = slideItem.length < 10 ? slideTotal.innerHTML = '0' + slideItem.length : slideTotal.innerHTML = slideItem.length;

            // ?????????????? ?????????????? ?????????? ????????????????
            

            const showSlide = ( n ) => {
                if  ( n > slideItem.length) {
                    sliderIndex = 1;
                }
                if  ( n < 1) {
                    sliderIndex = slideItem.length;
                }
                // ???????????????? ?????????? ?????? ?????????????? i
                slideItem.forEach(item => item.style.display = 'none');
                slideItem[sliderIndex - 1].style.display = 'block';

                // ?????????????? ?????????? ???????????????? ?????? ??????????????????????????
                slideCurrent.innerHTM = slideItem.length < 10 ? slideCurrent.innerHTML = '0' + sliderIndex  : slideCurrent.innerHTML = '0' + sliderIndex;
            };
            showSlide(sliderIndex);

            const plusNumSlide = ( n ) => {
                showSlide( sliderIndex += n );
            };
            arrowNext.addEventListener('click', e => {
                plusNumSlide(1);

            });
            arrowPrev.addEventListener('click', e => {
                plusNumSlide(-1);
            });
           
    }
    sliderMenu();










    // Calc

    const calcResult = document.querySelector(".calculating__result span");
    let sex = "female", height, weight, age, ratio = 1.375;


    if ( localStorage.getItem("sex") ) {
        sex = localStorage.getItem("sex");
    } else {
        sex = "female";
        localStorage.getItem("sex", "female");
    }
    if ( localStorage.getItem("ratio") ) {
        sex = localStorage.getItem("ratio");
    } else {
        sex = 1.375;
        localStorage.getItem("ratio", 1.375);
    }



    function calcTotal() {
        if ( !sex || !height || !weight || !age || !ratio ) {
            calcResult.textContent = "____";
            return;
        }

        if (sex === 'female') {
            calcResult.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            calcResult.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }
    calcTotal();

    function getStaticInformation(parentSelector, activeClass  ) {
        
        const elements = document.querySelectorAll(`${parentSelector} div`);
        elements.forEach( elem => {
            
            elem.addEventListener("click", e => {
                if ( elem.getAttribute("data-radio") ) {
                    ratio = +e.target.getAttribute("data-radio");
                    localStorage.setItem("ratio", +e.target.getAttribute("data-radio"))
                } else {
                    sex = elem.getAttribute("id");
                    localStorage.setItem("sex", elem.getAttribute("id"))
                }
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass);
                calcTotal();
            });
        });
    }



    getStaticInformation("#gender", "calculating__choose-item_active");
    getStaticInformation(".calculating__choose_big", "calculating__choose-item_active");

    function getDynamicInformation() {
        const inputs = document.querySelectorAll(".calculating__choose_medium input");
        inputs.forEach( input => {
            
            input.addEventListener("input", e => {

                if ( input.value.match(/\D/g)) {
                    input.style.border = "1px solid red";
                } else {
                    input.style.border = "none";
                }


                switch (e.target.getAttribute("id")) {
                    case "height":
                        height = e.target.value;
                        break;
                    case "weight":
                        weight = e.target.value;
                        break;
                    case "age":
                        age = e.target.value;
                        break;
                }
                calcTotal();
            });

        });
    }
    getDynamicInformation();
    

});