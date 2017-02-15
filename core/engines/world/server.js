const path = require('path');
const fs = require('fs');

const mkdirp = require('mkdirp');
const bodyParser = require('body-parser');
const bodyParserJson = bodyParser.json();

const DEFAULT_TAGS = {
  elements: [],
  free: [],
};
const DEFAULT_FILES = {
  files: [],
};
const DEFAULT_EQUIPMENT = {
  equipment: [],
};

class World {
  constructor(archae) {
    this._archae = archae;
  }

  mount() {
    const {_archae: archae} = this;
    const {app, dirname, dataDirectory} = archae.getCore();

    let live = true;
    this._cleanup = () => {
      live = false;
    };

    const worldPath = path.join(dirname, dataDirectory, 'world');
    const worldTagsJsonPath = path.join(worldPath, 'tags.json');
    const worldFilesJsonPath = path.join(worldPath, 'files.json');
    const worldEquipmentJsonPath = path.join(worldPath, 'equipment.json');

    const _requestFile = (p, defaultValue) => new Promise((accept, reject) => {
      fs.readFile(p, 'utf8', (err, s) => {
        if (!err) {
          const j = JSON.parse(s);
          accept(j);
        } else if (err.code === 'ENOENT') {
          const j = defaultValue;
          accept(j);
        } else {
          reject(err);
        }
      });
    });
    const _requestTagsJson = () => _requestFile(worldTagsJsonPath, DEFAULT_TAGS);
    const _requestFilesJson = () => _requestFile(worldFilesJsonPath, DEFAULT_FILES);
    const _requestEquipmentJson = () => _requestFile(worldEquipmentJsonPath, DEFAULT_EQUIPMENT);
    const _ensureWorldPath = () => new Promise((accept, reject) => {
      const worldPath = path.join(dirname, dataDirectory, 'world');

      mkdirp(worldPath, err => {
        if (!err) {
          accept();
        } else {
          reject(err);
        }
      });
    });

    return Promise.all([
      _requestTagsJson(),
      _requestFilesJson(),
      _requestEquipmentJson(),
      _ensureWorldPath(),
    ])
      .then(([
        tagsJson,
        filesJson,
        equipmentJson,
        ensureWorldPathResult,
      ]) => {
        if (live) {
          const _saveFile = (p, j) => new Promise((accept, reject) => {
            fs.writeFile(p, JSON.stringify(j, null, 2), 'utf8', err => {
              if (!err) {
                accept();
              } else {
                reject(err);
              }
            });
          });

          function serveTagsGet(req, res, next) {
            res.json(tagsJson);
          }
          app.get('/archae/world/tags.json', serveTagsGet);
          function serveTagsSet(req, res, next) {
            bodyParserJson(req, res, () => {
              const {body: data} = req;

              const _respondInvalid = () => {
                res.status(400);
                res.send();
              };

              if (
                typeof data === 'object' && data !== null &&
                data.elements && Array.isArray(data.elements) &&
                data.free && Array.isArray(data.free)
              ) {
                tagsJson = {
                  elements: data.elements,
                  free: data.free,
                };

                _saveFile(worldTagsJsonPath, tagsJson)
                  .then(() => {
                    res.send();
                  })
                  .catch(err => {
                    res.status(500);
                    res.send(err.stack);
                  });
              } else {
                _respondInvalid();
              }
            });
          }
          app.put('/archae/world/tags.json', serveTagsSet);
          function serveFilesGet(req, res, next) {
            res.json(filesJson);
          }
          app.get('/archae/world/files.json', serveFilesGet);
          function serveFilesSet(req, res, next) {
            bodyParserJson(req, res, () => {
              const {body: data} = req;

              const _respondInvalid = () => {
                res.status(400);
                res.send();
              };

              if (
                typeof data === 'object' && data !== null &&
                data.files && Array.isArray(data.files)
              ) {
                filesJson = {
                  files: data.files,
                };

                _saveFile(worldFilesJsonPath, filesJson)
                  .then(() => {
                    res.send();
                  })
                  .catch(err => {
                    res.status(500);
                    res.send(err.stack);
                  });
              } else {
                _respondInvalid();
              }
            });
          }
          app.put('/archae/world/files.json', serveFilesSet);
          function serveEquipmentGet(req, res, next) {
            res.json(equipmentJson);
          }
          app.get('/archae/world/equipment.json', serveEquipmentGet);
          function serveEquipmentSet(req, res, next) {
            bodyParserJson(req, res, () => {
              const {body: data} = req;

              const _respondInvalid = () => {
                res.status(400);
                res.send();
              };

              if (
                typeof data === 'object' && data !== null &&
                data.equipment && Array.isArray(data.equipment)
              ) {
                tagsJson = {
                  equipment: data.equipment,
                };

                _saveFile(worldEquipmentJsonPath, equipmentJson)
                  .then(() => {
                    res.send();
                  })
                  .catch(err => {
                    res.status(500);
                    res.send(err.stack);
                  });
              } else {
                _respondInvalid();
              }
            });
          }
          app.put('/archae/world/equipment.json', serveEquipmentSet);

          const startTime = Date.now();
          function serveStartTime(req, res, next) {
            res.json({
              startTime,
            });
          }
          app.get('/archae/world/start-time.json', serveStartTime);

          this._cleanup = () => {
            function removeMiddlewares(route, i, routes) {
              if (
                route.handle.name === 'serveTagsGet' ||
                route.handle.name === 'serveTagsSet' ||
                route.handle.name === 'serveFilesGet' ||
                route.handle.name === 'serveFilesSet' ||
                route.handle.name === 'serveEquipmentGet' ||
                route.handle.name === 'serveEquipmentSet' ||
                route.handle.name === 'serveStartTime'
              ) {
                routes.splice(i, 1);
              }
              if (route.route) {
                route.route.stack.forEach(removeMiddlewares);
              }
            }
            app._router.stack.forEach(removeMiddlewares);
          };


        }
      });
  }

  unmount() {
    this._cleanup();
  }
}

module.exports = World;
