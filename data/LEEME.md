# hibridApiExpress
Api REST y MVC para mi webPage

Usted puede leer esta documentacion en inglés: 
[English docs.](/README.md)

## Indice temático:

- [Servidor Express](#servidor-express)
  - [Descripción gral.](#inicializar-la-app)
  - [Rutas:](/data/rutas.md)
- [Aplicación Multipage](#clase-genericcontroller)
- [Aplicación de React](#react-y-vite)


## Servidor Express:

[Indice:](#indice-temático)

El motivo para desarrollar esta app fue poder darle forma y plasmar los conocimientos y conceptos adquiridos por mi hasta la fecha. Podia haberlo hecho quizás con otras tecnologias o siguiendo otros patrones, pero eso es algo que creo podré hacerlo mejor más adelante. 

Esta aplicación fue construida con: 

 - express.js; morgan; helmet, cors; dotenv; sequelize; postgres; pug; express-session; express-validator; bcrypt; jsonwebtoken; multer; firebase; node-cache; jest; supertest; babel; concurrently; nodemon;




### Inicializar la app:

[Indice:](#indice-temático)

Al descargar esta app encontrará un archivo `.env.example` el cual contiene la información que debe utilizarse en las variables de entorno, las variables a declarar (deberá crear los archivos y llenarlos en base a `.env.example`) son: 
- `.env`
- `.env.development`
- `.env.test`.

Para inicializar el proyecto es necesario luego de clonar o descargar el mismo, abrir la consola (linea de comandos) en directorio raíz (donde está el `package.json`) y ejecutar:

```bash
-->> npm install
```

Luego los comandos a ejecutar son: 

- En produccion: 
```bash
-->> npm start
```
- En desarrollo:

```bash
-->> npm run dev
```

La aplicación cuenta con tests unitarios y un test de integración, es importante destinar una version de base de datos para desarrollo y otra exclusiva para testing, ya que al ejecutar cualquiera de los test, jest inicializa y limpia la base de datos de toda tabla creada, a fin de realizar los tests en un entorno limpio. 

No se utilizan funciones mock para simular la base de datos, hay una instancia de base de datos postgres real para esto

Los comandos para ejecutar los test son: 
- Para tests unitarios:
```bash
-->> npm run unit:test
```
Este comando ejecutará todos los test sin excepción, para hacer correr solo uno basta escribir su numero, por ejemplo: 

```bash
-->> npm run unit:test 01
```

En este caso en particular probará que las variables de entorno estén correctas y la base de datos de pruebas funcional.

- Para tests de integración: 

```bash
-->> npm run test
```

## Rutas

[Indice:](#indice-temático)

### Swagger:

La documentación para las rutas está escrita en `Swagger`y en `markdown` (.md). Para poder acceder a la documentacion de las rutas en Swagger debe levantar el proyecto en `dev` y hacer click en el enlace que aparecerá como opción en la terminal (`/api-doc`). Se abrirá una ventana en el navegador que tenga por defecto en la cual podrá ver y probar las rutas disponibles de la api REST.

### Markdown:

Para ver las rutas disponibles haga click en el siguiente enlace:

[Rutas:](./rutas.md)

---




## React y Vite

[Indice:](#indice-temático)

Esta plantilla provee una implementación minima para hacer correr React con HMR y algunas reglas de ESlint.

Actualmente hay dos plugins oficiales que estan disponibles:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) utiliza [Babel](https://babeljs.io/) para recarga rápida
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) utiliza [SWC](https://swc.rs/) para recarga rápida.


En esta app usamos el plugin que utiliza `Babel` para mantener la consistencia con la libreria `Jest` que la utiliza.

- Aplicación react
  - vite
  - bootstrap
  - react-bootstrap
  - axios
  - redux
  - react-router-dom
  - react-redux
  - redux-thunk
  - toastify

