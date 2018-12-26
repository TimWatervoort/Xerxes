# Xethys.js

#### A small REST library that sits on top of Express for simple route and auth implementation.

### Setting up the environment
You will need Node.js, PostgreSQL, Express.js, and Knex.js installed for this library.

Set up a basic server with the following commands:

`express --no-view`

`npm i knex && touch knex.js knexfile.js`

Set up your database and populate your knex.js and knexfile.js files. For further assistance using Knex.js, see their site [here](https://knexjs.org).

Create your seed and migration files to populate your database.

As of now, you will need to copy over the files in this repository into a __'/xethys'__ directory.

In each of your route files, you will need the following code:

`const xethys = require(../xethys);`

### Setting up single-table REST routes

#### xeconfig
You will need to set a xeconfig variable that comes before your routes in any given route file. This file will provide your table name to the Xethys routes. It is set up as follows:

```
const xeconfig = (req, res, next) => {
  req.tableName = 'yourtablename';
  next();
}
```

##### GET all

`router.get('/', xeconfig, xethys.xelist);`

##### GET one

`router.get('/:id', xeconfig, xethys.xeget);`

Xethys already implements a 'check id' function in middleware to catch errors if the item does not exist.

##### POST one

`router.post('/', xeconfig, xethys.xepost);`

Xethys has an option to ensure that a value in a column is not repeated. Simply add the following to your xeconfig:

`req.uniqueColumn = 'yourcolumnname';`

##### PATCH one

`router.patch('/:id', xeconfig, xethys.xepatch);`

xethys.xepatch does not require all fields to be provided, while xethys.xeput does.

##### PUT one

`router.put('/:id', xeconfig, xethys.xeput);`

xethys.xeput requires all fields to be provided, while xethys.xepatch does not.

##### DELETE one

`router.delete('/:id', xeconfig, xethys.xelete);`

xethys.xelete by default returns all items left in the table after the deletion, not the deleted item. If you would prefer to have the deleted item, or nothing, returned, pass the following into your xeconfig:

`req.xeleteConfig = 'returnDeleted'`

or

`req.xeleteConfig = 'returnNone'`

### Signup / Authentication

Xethys uses the bcrypt and jsonwebtoken libraries for encryption and authentication, respectively.

#### Signup

`router.post('/signup', [xeconfig], xethys.xesignup);`

The signup route returns the user identifier of the user you just created.

You are able to pass a xeconfig to these routes as well. By default, the signup and login routes will look for __'users'__ as the user table, __'username'__ as the identifier and __'password'__ as the authentication key. To change these, pass the following to your xeconfig.

```
req.tableName = 'yourusertable';
req.userIdent = 'youruseridentifier';
req.userPass = 'youruserauthkey';
```

#### Login

`router.post('/login', [xeconfig], xethys.xelogin);`

Ensure you are passing both your user identifier (default to username) and your user authentication key (default to password).

If the login is successful, the route returns a JWT (JSON Web Token), which you can put into cookies. If it is not, you will receive an error.

#### Authorized routes

Xethys also supports six authorized routes, functioning much the same as the six REST routes provided above.
However, they will only return data if the JWT provided from the login route is passed in through the __Authorization__ HTTP header.

```
router.get('/', xeconfig, xethys.xelist_auth);
router.get('/:id', xeconfig, xethys.xeget_auth);
router.post('/', xeconfig, xethys.xepost_auth);
router.patch('/:id', xeconfig, xethys.xepatch_auth);
router.put('/:id', xeconfig, xethys.xeput_auth);
router.delete('/:id', xeconfig, xethys.xelete_auth);
```

More features to come soon!
