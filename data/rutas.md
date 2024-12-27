# Rutas app express

[Volver a LEEME](./LEEME.md)

## Indice:

- [Info general:](#información-general:)
- [Rutas MVC](#rutas-mvc)
- [Rutas Rest:](#rutas-rest)
  - [Rutas User:](#rutas-user)
  - [Rutas Product e item:](#rutas-product-e-item)
- [Aplicación Multipage](#clase-genericcontroller)


## Información General:

Esta aplicación cuenta con dos tipos de rutas: MVC que responde con `html` (basadas en la ruta raíz `/`) y las rutas REST que responden en formato `json` (basadas en `/api/v1`).


## Rutas MVC:

[Indice:](#indice)

Las rutas MVC son rutas por las que la api sirve los html de la app, estas son exclusivamente `GET` aunque en algunas como `contacto` puedan ofrecer al visitante algún formulario. 


| Ruta Mvc `/` | Metodo http: | 
|:-------------|:-------------|
| `/`           | `GET`  | 
|`/detalles`     | `GET`   |
| `/detalle/:id`   | `GET`  | 
| `/detalle/item/:id`   | `GET`   | 
| `/contacto`   | `GET`   | 
| `/acerca`      | `GET`   | 
| `/form`        | `GET`   | 


---


## Rutas REST:

Estas rutas requieren validacion:
[Indice:](#indice)

Las rutas REST al día de la fecha (25/12/2024) se dividen en varios grupos: `user`, `product e item`, `landing`, `uploadImage` para la subida de imagenes, `sendEmail` para el envío de emails.

## Rutas user
[Indice:](#indice)

||Ruta REST `/api/v1/user`| Metodo http: | 
|:-|:-------------|:-------------|
|01| `/api/v1/user/create`     | `POST`  |
|02| `/api/v1/user/login`      | `POST`  |
|03| `/api/v1/user`            | `GET`  | 
|04| `/api/v1/user/:id`        | `GET`  | 
|05| `/api/v1/user/:id`        | `PUT`   | 
|06| `/api/v1/user/:id`        | `DELETE`| 

## Rutas `/api/v1/user`
> Id: tipo UUID

[Indice:](#indice)

### Creación de Usuario (requiere permisos)
El usuario debe ser creado por el administrador ya que esta no es un página que busque interacción con el usuario.
> 01
- Método: `POST`
- Ruta: `/user/create`
- Descripción: Crea un usuario nuevo.
- Parámetros:
  - `email` (string): Correo electrónico del usuario.

### Inicio de Sesión de Usuario
> 02
- Método: `POST`
- Ruta: `/api/v1/user/login`
- Descripción: Inicia sesión para obtener un token de acceso.
- Parámetros:
  - `email` (string): Correo electrónico del usuario.
  - `password` (string): Contraseña del usuario.

### Obtener Todos los Usuarios (necesita permiso de moderator o admin)
> 03
- Método: `GET`
- Ruta: `/api/v1/user`
- Descripción: Obtiene la lista de todos los usuarios.

### Obtener un usuario(necesita permiso de moderator o admin)
> 04
- Método: `GET`
- Ruta: `/api/v1/user/:id`
- Descripción: Obtiene un usuario.

### Actualización de Usuario 

> 05
- Método: `PUT`
- Ruta: `/api/v1/user/:id`
- Descripción: Actualiza la información del usuario.
- Parámetros:
  - `email` (string): Correo electrónico del usuario.
  - `password` (string): Contraseña del usuario.
  - `username` (string): Nombre del usuario.
  - `usersurname` (string): Apellido del usuario.
  - `image` (string): Url de la imagen.
  - `enable` (boolean): Habilita o bloquea un usuario.

  ### Eliminar Usuario (Borrado lógico).
> 06
- Método: `DELETE`
- Ruta: `/api/v1/user/:id`

<hr>

## Rutas: product e item

[Indice:](#indice)

||Ruta REST `/api/v1/product`| Metodo http: | 
|:-|:-------------|:-------------|
|01| `/api/v1/product/create`     | `POST`  |
|02| `/api/v1/product`            | `GET`  | 
|03| `/api/v1/product/:id`        | `GET`  | 
|04| `/api/v1/product/:id`        | `PUT`   | 
|05| `/api/v1/product/:id`        | `DELETE`| 

||Ruta REST `/item`      | Metodo http: |
|:-|:--------------------- |:------------ |
|06 |`/api/v1/item/create`        | `POST`  | 
|07 |`/api/v1/item/:id`           | `GET`   | 
|08 |`/api/v1/item/:id`           | `PUT`   |
|09 |`/api/v1/item/:id`           | `DELETE`| 

## Rutas `/api/v1/product`:
> Id tipo número entero (Integer)

El elemento item pertenece a una tabla que está relacionada con relación de uno a muchos con product; un producto puede tener muchos items pero los items solo pertenecen a un producto, por lo tanto, no tienen un metodo `GET` para tomarlos a todos, sino solo por id, el cual está contenido en el producto al cual pertenecen, el primer item (como minimo) de cada producto se crea en la misma creación del producto. Luego, cada item en particular se crea desde el producto, llevando en si mismo implicita una referencia al mismo (campo id).

### Creación de producto:
> 01:
- Método: `POST`
- Ruta: `/api/v1/product/create`
- Descripción: Crea un nuevo producto.
- Parámetros:
  - `title` (string): Titulo del producto.
  - `logo` (string): Url. Imagen del logo del producto.
  - `landing` (string): Url. Imagen principal del producto.
  - `info_header` (string): Informacion de metadata SEO.
  - `info_body` (string): Informacion principal del producto.
  - `url` (string): Url. Link al sitio web.

  Estos parametros pertenecen a los items y pueden ser varios
  - `img` (string): Url. Imagen del item.
  - `text` (string): Texto explicativo.

### Obtener productos:
Esta rutas son exclusivamente get, una de ellas es con Id el cual es un tipo `Integer`.
> 02, 03.

### Actualizar producto:

> 04

- Método: `PUT`
- Ruta: `/api/v1/product/:id` 
- Descripción: Actualiza total o parcialmente un producto.
- Parámetros:
  - `title` (string): Titulo del producto.
  - `logo` (string): Url. Imagen del logo del producto.
  - `landing` (string): Url. Imagen principal del producto.
  - `info_header` (string): Informacion de metadata SEO.
  - `info_body` (string): Informacion principal del producto.
  - `url` (string): Url. Link al sitio web.
  - `enable` (boolean): Habilita o bloquea la vista del producto.

### Eliminar producto.
> 05

- Método: `DELETE`
- Ruta: `/api/v1/product/:id` 
- Descripción: Elimina un producto con todos sus items asociados.

<hr>

### Rutas `/api/v1/item`:

> Id tipo número entero (Integer)


### Creación de item:
> 06:
- Método: `POST`
- Ruta: `/api/v1/item/create`
- Descripción: Crea un nuevo item a partir de un producto dado.
- Parámetros:
  - `id` (string): Id del producto.
  - `img` (string): Url. Imagen del item.
  - `text` (string o text): Url. Descripción del item.


### Obtener un item:

> 07 Id tipo Integer


### Actualizar item:

> 08

- Método: `PUT`
- Ruta: `/api/v1/item/:id` 
- Descripción: Actualiza total o parcialmente un item.
- Parámetros:
  - `id` (string): Id del item.
  - `img` (string): Url. Imagen del item.
  - `text` (string o text): Url. Descripción del item.
  - `enable` (boolean): Habilita o bloquea la vista de un item

### Eliminar item.
> 05

- Método: `DELETE`
- Ruta: `/api/v1/item/:id` 
- Descripción: Elimina un item (no afecta a los otros items ni al producto).

<hr>

