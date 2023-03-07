let productMessage = document.querySelector('#mensajeDeActualizacion');
let divActualizador = document.getElementById('actualizador')
let socket = io.connect();

socket.on('editProduct', async (products) => {
    console.log('Esto andaaaa!!!', products, products[0].title);
    await divActualizador.innerHTML = ''
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
    productMessage.innerHTML = `<p> Se ha editado la lista de productos </p>`
})