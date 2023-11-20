# Northcoders News API

To get started, create two .env files - .env.development .env.test

Add 'PGDATABASE = <your_database>' to .env.development and 'PGDATABASE = <your_database_test>' to .env.test. These database names will then need to be changed in the setup.sql file, located ./db/setup.sql

Finally, run the script npm setup-dbs to create the databases and use npm run seed to seed the databases.