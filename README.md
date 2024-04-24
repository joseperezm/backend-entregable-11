# Mocking y Manejo de Errores

## Consigna

- Se aplicará un módulo de mocking y un manejador de errores a tu servidor actual.

## Sugerencias

- Céntrate solo en los errores más comunes.

## Aspectos a Incluir

- Generar un módulo de Mocking para el servidor, con el fin de que, al inicializarse, pueda generar y entregar 100 productos con el mismo formato que entregaría una petición de Mongo. Esto solo debe ocurrir en un endpoint determinado (`/mockingproducts`).
- Además, generar un customizador de errores y crear un diccionario para tus errores más comunes al crear un producto, agregarlo al carrito, etc.

## Documento de Testing

- Se visitará el endpoint `/mockingproducts` y deberá corroborarse una respuesta de 50 productos generados con el formato de un producto real del proyecto.
- Se intentará crear un producto con todos los datos válidos, el producto debe crearse satisfactoriamente.
- Se intentará crear un producto con todos los campos menos el título y el precio, los cuales deberían ser requeridos, por lo tanto, se debe recibir un error customizado. En consola debe aparecer una lista de las propiedades requeridas y los tipos (como visto en clase) para reconocer en qué propiedades no se enviaron los datos.

## Sobre el testing

- Esta disponible el endpoint de Mocking Products tanto en API como en Views.

`/api/mockingproducts` 100 productos.

`/mockingproducts` 100 productos, 10 por pagina.

- Se personaliza la lista de códigos de error mas comunes de una app.
- Se agrega error y mensaje de consola personalizado para campos faltantes al agregar producto.
