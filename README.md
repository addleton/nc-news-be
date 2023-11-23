# Northcoders News API

Welcome to my **nc_news** server. You can view a live version of the server [here](https://nc-news-xe7y.onrender.com/api/). This app was developed using node.js and prostgres. It is a backend server that allows users to vote and comment on articles, similar to reddit.

## Setup

Get started by cloning the project

`$ git clone https://github.com/addleton/nc-news.git`  
`$ cd nc-news`

Next install dependencies

`$ npm install`

Next, create two .env files - .env.development .env.test

Add `PGDATABASE = <your_database>` to .env.development and `PGDATABASE = <your_database_test>` to .env.test. These database names will then need to be changed in the setup.sql file, located `./db/setup.sql`

Finally, run the script npm setup-dbs to create the databases and use npm run seed to seed the databases. For testing you can run the tests in the `__tests__` folder using `npm t integration.test.js`

## Requirments

Node.js v20.5.0
PostgreSQL v14.9