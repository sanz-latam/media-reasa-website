    const contenedor = document.querySelector('.diapositivas');
    const deslizador = document.querySelector('.diapositivas > div');
    const diapositivas = document.querySelectorAll('.diapositivas > div > div');
    const rango = 5;

    // function inicializarDeslizador() {
    //     const cantidadDiapositivas = diapositivas.length - 1;
    //     const espacio = window.innerWidth * 0.6;
    //     $('.diapositivas > div').css('width','calc((75vw + 6%) * '+cantidadDiapositivas+'');
    //     diapositivas.forEach((diapositiva, indice) => {
    //         if (indice === 0) return;
    //         const leftPosition = (indice * (diapositiva.offsetWidth/5 + espacio));
        
    //         diapositiva.style.left = `${leftPosition}px`;
    //     });
    // }
    function inicializarDeslizador() {
        const screenWidth = window.innerWidth;
        const cantidadDiapositivas = diapositivas.length - 1;

        let espacio, width;

        if (screenWidth <= 425) {
            espacio = screenWidth * 0.6;
            width = 'calc((75vw + 5%) * ' + cantidadDiapositivas + ')';
        } else if (screenWidth <= 768) {
            espacio = screenWidth * 0.2;
            width = 'calc((35vw + 5%) * ' + cantidadDiapositivas + ')';
        } else {
            espacio = screenWidth * 0.01;
            width = 'calc((20vw + 1%) * ' + cantidadDiapositivas + ')';
        }

        $('.diapositivas > div').css('width', width);

        diapositivas.forEach((diapositiva, indice) => {
            if (indice === 0) return;
            
            // Adjust left position based on the espacio variable
            const leftPosition = (indice * (diapositiva.offsetWidth / 5 + espacio));
            diapositiva.style.left = `${leftPosition}px`;
        });
    }

    inicializarDeslizador();
    window.addEventListener('resize', inicializarDeslizador);
    document.addEventListener('DOMContentLoaded', inicializarDeslizador);    

    const manipularPresionar = e => {
        deslizador.dataset.mouseDownAt = e.clientX.toString();
        deslizador.dataset.startX = e.clientX.toString();
        deslizador.dataset.isDragging = "false";
    };

    const manipularSoltar = e => {
        if (deslizador.dataset.isDragging === "false") {
            // $('.diapositivas').removeClass('activo');
        }
        deslizador.dataset.mouseDownAt = "0";
        deslizador.dataset.prevPercentage = deslizador.dataset.percentage;
        deslizador.dataset.isDragging = "false";
    };

    const manipularMovimiento = e => {
        if (deslizador.dataset.mouseDownAt === "0") {
            // $('.contenido').addClass('activo');
            return;
        }

        const mouseDownAt = parseFloat(deslizador.dataset.mouseDownAt);
        const mouseDelta = mouseDownAt - e.clientX;

        if (deslizador.dataset.isDragging === "false" && Math.abs(mouseDelta) > rango) {
            deslizador.dataset.isDragging = "true";
        }

        if (deslizador.dataset.isDragging === "true") {
            // $('.diapositivas > ul').removeClass('activo');
            $('.diapositivas > div > div').removeClass('activo');
            const maxDelta = window.innerWidth / 2;

            const percentage = (mouseDelta / maxDelta) * -100,
                nextPercentageUnconstrained = parseFloat(deslizador.dataset.prevPercentage) + percentage,
                nextPercentage = isNaN(nextPercentageUnconstrained) ? 0 : Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

            deslizador.dataset.percentage = nextPercentage;

            deslizador.animate({
                transform: `translate(${nextPercentage}%, -50%)`
            }, { duration: 300, fill: "forwards" });

            const imagenes = deslizador.querySelectorAll('.diapositivas > div > div > img');
            for (const imagen of imagenes) {
                imagen.animate({
                    objectPosition: `${100 + nextPercentage}% center`
                }, { duration: 300, fill: "forwards" });
            }
        }
    };
    const centrarDeslizadorEnImagen = index => {
        const totalImagenes = deslizador.querySelectorAll('.diapositivas > div > div > img').length - 1;
        const anchoImagen = (100 / totalImagenes);
        const porcentaje = -(index  * anchoImagen);

        deslizador.dataset.percentage = porcentaje;
        deslizador.animate({
            transform: `translate(${porcentaje}%, -50%)`
        }, { duration: 300, fill: "forwards" });
    };
    const alternarPantallaCompleta = e => {
        $('.diapositivas > ul').addClass('activo');
        const img = e.target;
            img.animate({
                objectPosition: `50% center`
            }, { duration: 300, fill: "forwards" });
        const contenedorImagen = img.closest('.diapositivas > div > div'); 
        const index = Array.from(deslizador.querySelectorAll('.diapositivas > div > div > img')).indexOf(img);
        contenedorImagen.classList.add('activo');
    centrarDeslizadorEnImagen(index);
    };

    const agregarInteracciones = () => {
        const imagenes = deslizador.querySelectorAll('.diapositivas > div > div > img');
        imagenes.forEach(imagen => {
            imagen.addEventListener('click', alternarPantallaCompleta);
        });
    };

    agregarInteracciones();

    // contenedor.onmouseup = e => manipularSoltar(e);
    // contenedor.onmousemove = e => manipularMovimiento(e);
    // contenedor.onmousedown = e => manipularPresionar(e);

    // contenedor.ontouchstart = e => manipularPresionar(e.touches[0]);
    // contenedor.ontouchmove = e => manipularMovimiento(e.touches[0]);
    // contenedor.ontouchend = e => manipularSoltar(e.touches[0]);
    // $('.contenido').click(function(){
    //     $(this).removeClass('activo');
    // });
    $('.diapositivas span').click(function(){
        $('.contenido').addClass('activo');
        $('.contenido').children('div').children('div').removeClass('activo');
        $('.contenido').children('div').children('div').eq($(this).parent().index()).addClass('activo');
        map.resize();
    });
    $('.cuadro > div:nth-of-type(1) > div').mouseover(function(){
        if ($(window).width() <= 425) {
            $(this).parent().removeClass('activo');
            $('.cuadro > div:nth-of-type(n+2) > div').removeClass('oculto');
        }
        $('.cuadro > div:not(:nth-of-type(1))').removeClass('activo');
        $('.cuadro').children('div').eq($(this).index() + 1).addClass('activo');
    });
    $('.marcas > div > div').on('click', function() {
        $('.diapositivas > div > div').removeClass('activo');
        $('.diapositivas > div').children('div').eq($(this).index() + 1).find('img').click();
        $('.contenido').removeClass('activo');

        // Ocultar la flecha inmediatamente
        const arrow = document.getElementById('scroll-arrow');
        if (arrow) {
            arrow.style.opacity = '0'; // Ocultar la flecha
            arrow.style.pointerEvents = 'none'; // Desactivar interacción
        }
    });
    $('header > div > img').on('click', function() {
        $('.diapositivas > ul').removeClass('activo');
        $('.diapositivas > div > div').removeClass('activo');
        $('.contenido').removeClass('activo');
        $('.diapositivas > div > div').removeClass('activo');
        $('.diapositivas > div > div:nth-of-type(1) > img').click();

        // Ocultar la flecha inmediatamente
        const arrow = document.getElementById('scroll-arrow');
        if (arrow) {
            arrow.style.opacity = '0'; // Ocultar flecha
            arrow.style.pointerEvents = 'none'; // Desactivar interacción

            // Desactivar temporalmente `handleArrowVisibility`
            window.removeEventListener('scroll', handleArrowVisibility);
            setTimeout(() => {
                // Reactivar la función después de un pequeño retraso
                window.addEventListener('scroll', handleArrowVisibility);
            }, 300);
        }
    });

    // $('.marcas  > div > div').mouseover(function(){
    //     $('.diapositivas > div > div:nth-of-type(1) > img').addClass('oculta');
    //     $('.diapositivas > div > div:nth-of-type(1) > img:nth-of-type('+($(this).index()+2)+')').removeClass('oculta');
    // });
    // $('.marcas  > div > div').mouseout(function(){
    //     $('.diapositivas > div > div:nth-of-type(1) > img').addClass('oculta');
    //     $('.diapositivas > div > div:nth-of-type(1) > img:nth-of-type(1)').removeClass('oculta');
    // });
    // $('header').click(function(){
    //     $('.diapositivas > ul').removeClass('activo');
    //     $('.diapositivas > div > div').removeClass('activo');
    //     $('.contenido').removeClass('activo');
    //     $('.contenido').children('div').removeClass('activo');
    // });

    $('.vitrina > div:nth-of-type(1) > div:nth-of-type(1) > div').mouseover(function(){
        $('.vitrina > div:nth-of-type(1) > div:nth-of-type(n+2)').removeClass('activo');
        $('.vitrina > div:nth-of-type(1) > div:nth-of-type('+($(this).index() + 2)+')').addClass('activo');
    });
    $('.cuadro > div:nth-of-type(n+2) > div > p ').click(function(){
        // $('.cuadro > div > div').removeClass('activo');
        $(this).parent('div').addClass('oculto');
        $('.cuadro > div:nth-of-type(1)').addClass('activo');
    });

    function handleArrowVisibility() {
        const arrow = document.getElementById('scroll-arrow');
        const targetContainer = document.querySelector('.contenido > div > div');

        if (!arrow || !targetContainer) {
            console.warn('Flecha o contenedor objetivo no encontrada');
            return;
        }

        // Verificar si el contenedor está visible en el viewport
        const targetBounding = targetContainer.getBoundingClientRect();
        const isInTargetContainer =
            targetBounding.top < window.innerHeight &&
            targetBounding.bottom > 0;

        // Obtener propiedades del scroll del contenedor
        const scrollTop = targetContainer.scrollTop;
        const scrollHeight = targetContainer.scrollHeight;
        const clientHeight = targetContainer.clientHeight;

        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

        if (isInTargetContainer) {
            if (isAtBottom) {
                // Cambiar orientación de la flecha hacia arriba
                arrow.querySelector('svg').style.transform = 'rotate(180deg)';
                arrow.dataset.direction = 'up'; // Cambiar la dirección
            } else {
                // Restablecer orientación de la flecha hacia abajo
                arrow.querySelector('svg').style.transform = 'rotate(0deg)';
                arrow.dataset.direction = 'down'; // Cambiar la dirección
            }

            // Mostrar la flecha
            arrow.style.opacity = '1';
            arrow.style.pointerEvents = 'auto';
        } else {
            // Ocultar flecha si no estamos en el contenedor objetivo
            arrow.style.opacity = '0';
            arrow.style.pointerEvents = 'none';
        }
    }

    // Agregar funcionalidad de clic a la flecha
    document.getElementById('scroll-arrow').addEventListener('click', () => {
        const arrow = document.getElementById('scroll-arrow');
        const targetContainer = document.querySelector('.contenido > div > div');

        if (!arrow || !targetContainer) return;

        if (arrow.dataset.direction === 'up') {
            // Si la flecha apunta hacia arriba, llevar al inicio del contenedor
            targetContainer.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Si la flecha apunta hacia abajo, llevar al final del contenedor
            targetContainer.scrollTo({ top: targetContainer.scrollHeight, behavior: 'smooth' });
        }
    });

    // Detectar scroll global y en el contenedor
    window.addEventListener('scroll', handleArrowVisibility);
    document.querySelector('.contenido > div > div').addEventListener('scroll', handleArrowVisibility);

    // Chequeo inicial para ajustar visibilidad al cargar la página
    // document.addEventListener('DOMContentLoaded', () => {
    //     const arrow = document.getElementById('scroll-arrow');
    //     arrow.style.opacity = '1'; // Siempre visible inicialmente
    //     arrow.querySelector('svg').style.transform = 'rotate(0deg)'; // Orientación inicial hacia abajo
    //     arrow.dataset.direction = 'down'; // Dirección inicial hacia abajo
    //     handleArrowVisibility();
    // });
    document.addEventListener('DOMContentLoaded', () => {
        const arrow = document.getElementById('scroll-arrow');
        arrow.style.opacity = '0'; // Asegurar que no aparezca inicialmente
        arrow.style.pointerEvents = 'none'; // Desactivar clics inicialmente

        // Forzar chequeo inicial
        handleArrowVisibility(); // Evaluar visibilidad inmediatamente al cargar la página
    });
    // Observador para detectar cambios en las clases del contenedor `.contenido`
    const observer = new MutationObserver(() => {
        handleArrowVisibility(); // Reevaluar la visibilidad cuando cambian las clases
    });

    // Configuración del observador
    const contenido = document.querySelector('.contenido');
    if (contenido) {
        const observer = new MutationObserver(() => {
            // Verificar si `.contenido` tiene la clase `activo`
            if (contenido.classList.contains('activo')) {
                handleArrowVisibility(); // Evaluar visibilidad de la flecha
            } else {
                // Asegurar que la flecha esté oculta si `.contenido` pierde la clase `activo`
                const arrow = document.getElementById('scroll-arrow');
                if (arrow) {
                    arrow.style.opacity = '0';
                    arrow.style.pointerEvents = 'none';
                }
            }
        });
    
        // Configuración del observador para detectar solo cambios en atributos
        observer.observe(contenido, {
            attributes: true, // Observar solo cambios en atributos
        });
    }
    