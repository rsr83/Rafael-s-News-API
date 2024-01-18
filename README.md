# Rafael's News API

Welcome to my first coding project!!!

The hosted version can acessed by the following URL: https://rafaels-nc-news.onrender.com/api/

This project is an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

The database will be PSQL, and the interaction with it uses node-postgres.

Find below instructions of how to:

    1. clone the repository using this URL: https://github.com/rsr83/Rafael-s-News-API.git

    2. install the following dependencies (this version or a newer ones preferably):

        "jest": "^27.5.1",
        "jest-extended": "^2.0.0",
        "jest-sorted": "^1.0.14"
        "pg-format": "^1.0.4",
        "dotenv": "^16.3.1",
        "express": "^4.18.2",
        "pg": "^8.7.3",
        "supertest": "^6.3.4"

    3. use the following command to create the database:

        "psql -f ./db/setup.sql",

    then this other one to seed the dev-database:

        "node ./db/seeds/run-seed.js"

    4. run tests using the command npm test

We have two databases in this project: one for real-looking dev data, and another for simpler test data.

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names).

Double check that these .env files are .gitignored since you don't want to make your database public.

You will need at least Node.js 18 and Postgres 8 to run this project.
