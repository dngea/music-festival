document.addEventListener('DOMContentLoaded', function(){
    navegacionFija()
    crearGaleria()
    resaltarEnlace()
    scrollNav()
})

function navegacionFija() {
    const header = document.querySelector('.header') // mejor coger la clase, que headers hay varios en este proyecto
    const sobreFestival = document.querySelector('.sobre-festival')

    window.addEventListener('scroll', function() {
        if (sobreFestival.getBoundingClientRect().bottom < 1) {
            header.classList.add('fixed')
        } else {
            header.classList.remove('fixed')
        }
    })
}

function crearGaleria(){
    const numeroImagenes = 16
    const galeria = document.querySelector('.galeria-imagenes')

    for(let i = 1; i <= numeroImagenes; i++){
        const imagen = document.createElement('IMG') // Uppercase convención para crear elementos
        imagen.loading = 'lazy'
        imagen.width = '300'
        imagen.height = '200'
        imagen.src = `src/img/gallery/full/${i}.jpg`
        imagen.alt = "Imagen de Galería"
        
        // añadele un EVENT HANDLER a cada una
        imagen.onclick = function(){
            mostrarImagen(i)
        }
        
        // despliega cada imagen en la galeria
        galeria.appendChild(imagen)
    }
}

function mostrarImagen(i){
    // crear imagen en grande
    const imagen = document.createElement('IMG') 
    imagen.src = `src/img/gallery/full/${i}.jpg`
    imagen.alt = "Imagen de Galería"

    // creat botón de cierre
    const button = document.createElement('BUTTON')
    button.classList.add('btn-modal')
    button.textContent = 'x'
    button.onclick = cerrarModal

    // crear modal
    const modal = document.createElement('DIV') // creamos etiqueta html
    modal.classList.add('modal') // le damos una clase, para que tenga estilos scss
    modal.onclick = cerrarModal // event handler on click ejecutará la función cerrarModal
    
    // incluir imagen y botón dentro del modal 
    modal.appendChild(imagen)
    modal.appendChild(button)

    // Integramos el codigo HTML creado en nuestro index, en el body, en este caso
    const body = document.querySelector('body')
    body.classList.add('overflow-hidden')
    body.appendChild(modal)

    
}

function cerrarModal(){
    const modal = document.querySelector('.modal') // busca el elemento html con clase .modal
    modal.classList.add('fade-out')

    const body = document.querySelector('body')
    body.classList.remove('overflow-hidden')
    
    setTimeout(() => {
        modal?.remove() // si lo encuentra, lo elimina
    }, 500); // 0.5s
    
}

function resaltarEnlace() {
    document.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section')
        const navLinks = document.querySelectorAll('.navegacion-principal a')
        
        let actual = ''
        sections.forEach( section => {
            const sectionTop = section.offsetTop
            const sectionHeight = section.clientHeight
            
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                actual = section.id   
            }
        })

        navLinks.forEach( link => {
            link.classList.remove('active')
            if (link.getAttribute('href') == '#' + actual) {
                link.classList.add('active')
            }
        })

    })
}

function scrollNav() {
    const navLinks = document.querySelectorAll('.navegacion-principal a')

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault()

            const linkHref = link.getAttribute('href')
            const section = document.querySelector(linkHref)

            section.scrollIntoView({behavior: 'smooth'})

        })
    })
}