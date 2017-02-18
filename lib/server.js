const listen = a => new Promise((accept, reject) => {
  const {metadata: {server: {url: serverUrl}, current: {url: currentServerUrl}}} = a;

  const _filterIsServerHostname = (req, res, next) => {
    if (req.get('Host') === serverUrl) {
      next();
    } else {
      next('route');
    }
  };
  const _cors = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Allow-Credentials', 'true');
  };

  a.app.get('/', _filterIsServerHostname, (req, res, next) => {
    req.url = '/vr.html';

    a.app(req, res, next);
  });
  a.app.get('/server/server.json', _filterIsServerHostname, (req, res, next) => {
    _cors(req, res);

    res.json({
      url: currentServerUrl,
    });
  });

  accept();
});

module.exports = {
  listen,
};