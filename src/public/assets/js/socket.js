let productMessage = document.querySelector('#mensajeDeActualizacion');
let divActualizador = document.querySelector('#actualizador')
let socket = io();


socket.on('editProduct', async (product) => {
    console.log('Esto andaaaa!!!', product, product.title);

    productMessage.innerHTML+=`<br><div class='mensaje'><strong>${product.title}</strong> dice <i>${product.stock}</i></div>`
    
    /*await divActualizador.innerHTML = ''
    for (const product of products) {
        divActualizador.innerHTML += `
    <li>
    <b> ${product.title}</b>
    <br>
    Precio: ${product.price}
    <br>
    Stock: ${product.stock}
    <br>
    </li>`
    }
    productMessage.innerHTML = `<p> Se ha editado la lista de productos </p>`*/
})


/*
let nombre = prompt("ingrese su nombre");

let divMensajes = document.querySelector('#mensajes');
let textMensaje = document.querySelector('#mensaje');

textMensaje.addEventListener('keyup',(evento)=>{
    // console.log(evento.key, evento.keyCode, evento.target.value);
    if(evento.keyCode==13){
        if(evento.target.value.trim()!=''){
            socket.emit('mensaje',{
                emisor:nombre,
                mensaje:evento.target.value
            })
            textMensaje.value='';
            textMensaje.focus();
        }

    }
})

    
    socket.on('hola',(objeto)=>{
        console.log(`${objeto.emisor} dice ${objeto.mensaje}`)

        objeto.mensajes.forEach(el=>{
            divMensajes.innerHTML+=`<br><div class='mensaje'><strong>${el.emisor}</strong> dice <i>${el.mensaje}</i></div>`
        });

        socket.emit('respuestaAlSaludo',{
            emisor:nombre,
            mensaje:`Hola, desde el Frontend`
        })
    })

    socket.on('nuevoMensaje',(mensaje)=>{
        divMensajes.innerHTML+=`<br><div class='mensaje'><strong>${mensaje.emisor}</strong> dice <i>${mensaje.mensaje}</i></div>`
    
        divMensajes.scrollTop=divMensajes.scrollHeight;
    
    })

    */