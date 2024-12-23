# hibridApiExpress  
REST API and MVC for my webPage  

You can read this documentation in Spanish:  
[Documentación en español.](/README.md)  

## Table of Contents:  

- [Express Server](#express-server)  
  - [General Description](#initialize-the-app)  
  - [Routes:](/data/routes.md)  
- [Multipage Application](#genericcontroller-class)  
- [React Application](#react-and-vite)  

## Express Server:  

[Back to Index:](#table-of-contents)  

The purpose of developing this app was to consolidate and apply the knowledge and concepts I have acquired so far. I could have built it using other technologies or following different patterns, but I believe I can approach those methods more effectively in the future.  

This application was built using:  

- express.js; morgan; helmet; cors; dotenv; sequelize; postgres; pug; express-session; express-validator; bcrypt; jsonwebtoken; multer; firebase; node-cache; jest; supertest; babel; concurrently; nodemon.  

### Initialize the App:  

[Back to Index:](#table-of-contents)  

After downloading this app, you will find a `.env.example` file containing the information required for environment variables. You need to create and populate the following files based on `.env.example`:  
- `.env`  
- `.env.development`  
- `.env.production`.  

To initialize the project, after cloning or downloading it, open the console (command line) in the root directory (where `package.json` is located) and run:  

```bash  
-->> npm install  
```  

Then execute the following commands:  

- For production:  
```bash  
-->> npm start  
```  
- For development:  
```bash  
-->> npm run dev  
```  

The application includes unit tests and an integration test. It is important to dedicate one database version for development and another exclusively for testing. When running any of the tests, Jest initializes and cleans all tables in the database to ensure testing in a clean environment.  

Mock functions are not used to simulate the database; a real Postgres database instance is utilized for this purpose.  

The commands to execute the tests are:  
- For unit tests:  
```bash  
-->> npm run unit-test  
```  
This command runs all tests. To run a specific test, simply provide its number, for example:  

```bash  
-->> npm run unit-test 01  
```  

In this case, it will specifically test the correctness of environment variables and the functionality of the testing database.  

- For integration tests:  

```bash  
-->> npm run test  
```  



## React and Vite  

[Back to Index:](#table-of-contents)  

This template provides a minimal implementation for running React with HMR and some ESLint rules.  

Currently, two official plugins are available:  
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md): Uses [Babel](https://babeljs.io/) for fast refresh.  
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc): Uses [SWC](https://swc.rs/) for fast refresh.  

In this app, we use the plugin based on `Babel` to maintain consistency with the `Jest` library.  

- React application:  
  - Vite  
  - Bootstrap  
  - React-Bootstrap  
  - Axios  
  - Redux  
  - React-Router-Dom  
  - React-Redux  
  - Redux-Thunk  
  - Toastify  


