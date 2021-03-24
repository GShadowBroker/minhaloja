# Minha Loja / minhaloja

## About / Synopsis

A simple server rendered e-commerce for smartphones. Allows the user to create/edit their account, add items to shopping cart / favorites and checkout with [PAGSEGURO](https://pagseguro.uol.com.br/) sandbox.

Tech stack:

- NodeJS
- Express
- SASS
- PostgreSQL / Sequelize ORM
- Pug

The live version of the app can be found at: https://minhalojadecelulares.herokuapp.com/

## Installation

1.  Clone the project: `git clone https://github.com/GShadowBroker/minhaloja.git`

2.  Open the folder and install dependancies: `cd minhaloja && npm install`

3.  Make sure the envirorment variables are in a .env file in the root directory

4.  Run migrations: `npx sequelize db:migrate`

5.  Start the development server:
    `npm run dev`

![E-commerce website](https://i.imgur.com/yteDsGV.png)

## License

MIT
2020 - Todos os direitos reservados
