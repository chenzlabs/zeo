const MODEL_SRC = 'https://cdn.rawgit.com/modulesio/zeo-data/29412380b29e98b18c746a373bdb73aeff59e27a/models/cloud/cloud.json';

class Physics {
  constructor(archae) {
    this._archae = archae;
  }

  mount() {
    const {_archae: archae} = this;

    let live = true;
    this._cleanup = () => {
      live = false;
    };

    return archae.requestPlugins([
      '/core/engines/zeo',
    ]).then(([
      zeo,
    ]) => {
      if (live) {
        const {THREE, scene, camera} = zeo;
        const world = zeo.getCurrentWorld();
        const {physics} = world;

        const _requestModelData = () => fetch(MODEL_SRC)
          .then(res => res.json()
            .then(modelJson => new Promise((accept, reject) => {
              const loader = new THREE.ObjectLoader();

              const url = MODEL_SRC;
              const texturePath = url.substring(0, url.lastIndexOf('/') + 1);
              loader.setTexturePath(texturePath);
              loader.parse(modelJson, model => {
                accept({
                  modelJson,
                  model,
                });
              });
            }))
          )

        return _requestModelData().then(({
          modelJson,
          model,
        }) => {
          if (live) {
            const _getModelPoints = modelJson => {
              const {geometries, object} = modelJson;

              const geometryMap = _makeUuidMap(geometries);

              const _getUnindexedPoints = (attributes, index) => {
                const numPoints = index.length;
                const result = new Float32Array(numPoints * 3);

                for (let i = 0; i < numPoints; i++) {
                  const indexEntry = index[i];
                  const baseSrc = indexEntry * 3;
                  const baseDst = i * 3;

                  result[baseDst + 0] = attributes[baseSrc + 0];
                  result[baseDst + 1] = attributes[baseSrc + 1];
                  result[baseDst + 2] = attributes[baseSrc + 2];
                }

                return result;
              };
              const _getLocalGeometry = (geometryData, matrixWorld) => {
                const {data: {attributes: {position}, index}} = geometryData;

                const result = new THREE.BufferGeometry();
                result.addAttribute('position', new THREE.BufferAttribute(_getUnindexedPoints(position.array, index.array), 3));
                result.applyMatrix(matrixWorld);

                return result;
              };
              const worldGeometries = (() => {
                const result = [];

                const _recurse = (o, parentMatrix = new THREE.Matrix4()) => {
                  const {type, matrix, children} = o;

                  const localMatrix = matrix ? parentMatrix.clone().multiply(new THREE.Matrix4().fromArray(matrix)) : parentMatrix;

                  if (type === 'Mesh') {
                    const {geometry: geometryUuid} = o;
                    const geometryData = geometryMap[geometryUuid];
                    const geometry = _getLocalGeometry(geometryData, localMatrix);
                    result.push(geometry);
                  }

                  if (children) {
                    for (let i = 0; i < children.length; i++) {
                      const child = children[i];
                      _recurse(child, localMatrix);
                    }
                  }
                };
                _recurse(object);

                return result;
              })();
              const points = (() => {
                let result = [];

                for (let i = 0; i < worldGeometries.length; i++) {
                  const geometry = worldGeometries[i];

                  result = result.concat(Array.from(geometry.getAttribute('position').array));
                }

                return result;
              })();

              return points;
            };

            const modelPosition = new THREE.Vector3(-1, 0, -1);
            const modelRotation = new THREE.Quaternion();
            const modelScale = new THREE.Vector3(1, 1, 1);

            model.position.copy(modelPosition);
            model.quaternion.copy(modelRotation);
            model.scale.copy(modelScale);
            scene.add(model);

            const modelPhysicsBody = new physics.TriangleMesh({
              position: modelPosition.toArray(),
              rotation: modelRotation.toArray(),
              scale: modelScale.toArray(),
              points: _getModelPoints(modelJson),
              mass: 0,
            });
            physics.add(modelPhysicsBody);

            const boxMeshSize = 0.1;
            const boxPositionOffset = modelPosition;
            const zeroVector = new THREE.Vector3();
            const zeroQuaternion = new THREE.Quaternion();
            const numBoxMeshes = 20;

            const _getRandomOffset = () => -0.5 + Math.random() * 1;
            const _getRandomPosition = () => modelPosition.clone().add(new THREE.Vector3(_getRandomOffset(), 2, _getRandomOffset()));

            const boxMeshes = (() => {
              const result = [];

              const geometry = new THREE.BoxBufferGeometry(boxMeshSize, boxMeshSize, boxMeshSize);
              const material = new THREE.MeshPhongMaterial({
                color: 0x333333,
                // shininess: 10,
                // shading: THREE.FlatShading,
              });

              for (let i = 0; i < numBoxMeshes; i++) {
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.copy(_getRandomPosition());
                mesh.castShadow = true;

                result.push(mesh);
              }

              return result;
            })();
            boxMeshes.forEach(boxMesh => {
              scene.add(boxMesh);
            });

            const floorPhysicsBody = new physics.Plane({
              position: [0, 0, 0],
              dimensions: [0, 1, 0],
              mass: 0,
            });
            physics.add(floorPhysicsBody);

            const boxPhysicsBodies = boxMeshes.map(boxMesh => {
              const physicsBody = physics.makeBody(boxMesh);
              physicsBody.setObject(boxMesh);
              return physicsBody;
            });
            boxPhysicsBodies.forEach(physicsBody => {
              physics.add(physicsBody);
            });

            const _getClosestBoxMeshIndex = position => boxMeshes.map((boxMesh, index) => {
              const distance = position.distanceTo(boxMesh.position);
              return {
                index,
                distance,
              };
            }).sort((a, b) => a.distance - b.distance)[0].index;

            const gripdown = e => {
              const {side} = e;
              const {gamepads} = zeo.getStatus();
              const gamepad = gamepads[side];

              if (gamepad) {
                const {position: controllerPosition} = gamepad;
                const boxMeshIndex = _getClosestBoxMeshIndex(controllerPosition);
                const boxMesh = boxMeshes[boxMeshIndex];

                if (zeo.canGrab(side, boxMesh, {radius: 0.1})) {
                  const boxPhysicsBody = boxPhysicsBodies[boxMeshIndex];

                  console.log('gripping', {boxMesh, boxPhysicsBody}); // XXX use hands.grab();
                } else {
                  console.log('not gripping');
                }
              } else {
                console.log('not gripping');
              }
            };
            zeo.on('gripdown', gripdown);
            const gripup = e => {
              const {side} = e;

              // XXX use hands.release(side);
            };
            zeo.on('gripup', gripup);
            const keydown = e => {
              if (e.keyCode === 86) { // V
                boxPhysicsBodies.forEach(physicsBody => {
                  physicsBody.setPosition(_getRandomPosition().toArray());
                  physicsBody.setRotation(zeroQuaternion.toArray());
                  physicsBody.setLinearVelocity(zeroVector.toArray());
                  physicsBody.setAngularVelocity(zeroVector.toArray());
                  physicsBody.activate();
                });

                e.stopImmediatePropagation();
              }
            };
            zeo.on('keydown', keydown);

            this._cleanup = () => {
              scene.remove(model);

              boxMeshes.forEach(boxMesh => {
                scene.remove(boxMesh);
              });
              physics.remove(floorPhysicsBody);
              boxPhysicsBodies.forEach(physicsBody => {
                physics.remove(physicsBody);
              });

              zeo.removeListener('gripdown', gripdown);
              zeo.removeListener('gripup', gripup);
              zeo.removeListener('keydown', keydown);
            };
          }
        });
      }
    });
  }

  unmount() {
    this._cleanup();
  }
}

const _makeUuidMap = a => {
  const result = {};

  for (let i = 0; i < a.length; i++) {
    const e = a[i];
    result[e.uuid] = e;
  }

  return result;
};

module.exports = Physics;
