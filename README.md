# Implementación de logger

## Consigna

- Basado en nuestro proyecto principal, implementar un logger.

### Aspectos a incluir

- Primero, definir un sistema de niveles que tenga la siguiente prioridad (de menor a mayor):

`debug, http, info, warning, error, fatal`

- Después implementar un logger para desarrollo y un logger para producción:

  - El logger de desarrollo deberá loggear a partir del nivel debug y sólo en consola.
  - El logger del entorno productivo deberá loggear sólo a partir de nivel info.
  - El logger deberá enviar en un transporte de archivos a partir del nivel de error en un nombre “errors.log”.

- Agregar logs de valor alto en los puntos importantes de tu servidor (errores, advertencias, etc) y modificar los console.log() habituales que tenemos para que muestren todo a partir de winston.

- Crear un endpoint /loggerTest que permita probar todos los logs

## Testing

- Se revisará que la estructura del servidor en general esté implementada con el logger de winston.
- Se ejecutará el proyecto en entorno de desarrollo y entorno productivo para corroborar que se implementen los diferentes loggers según el entorno.
- Se probará un endpoint (proporcionado por el alumno). para revisar que los logs se escriban correctamente, tanto para consola (desarrollo) como para consola y archivos (productivo).
