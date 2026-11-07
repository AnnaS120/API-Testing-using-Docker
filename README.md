# API Testing using Docker (completed)

## Usage

- Run `git clone <repo-link>`
- Run `cd server`
- Run `npm install

### Setup the database

- Create a `.env` file within `server` & add the following:
  
    ```sh
    PORT=<pick a port>
    ## use Supabase for DB_URL
    DB_URL=<link-db>
    ```
    
- Run `npm run seed-db` to setup the datasbase

### Run the server

- Run `npm run dev` to start the API & the app should run on `3000` (if that's the port you've set in the `.env` file)

### Setup testing environment

- Make sure to have Docker Desktop open
- Run `docker compose up -d` (outside of the `server` folder) to set up the testing database
- Add the following to the `.env` file

  ```sh
  DB_TEST_URL=postgres://testing:jkljkl@localhost:5433/testing
  ```

### Run the tests & display test coverage

- Run `npm run test` to run the tests
- Run `npm run coverage` to display the test coverage
