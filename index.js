const middlewares = require('./middlewares');
const xeauth = require('./xeauth');
const xeroutes = require('./xeroutes');
const xeroutes_auth = require('./xeroutes_auth');

module.exports = {
  ...middlewares,
  ...xeauth,
  ...xeroutes,
  ...xeroutes_auth
}
