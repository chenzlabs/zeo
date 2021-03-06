const {
  NUM_CELLS,
} = require('./lib/constants/constants');
const protocolUtils = require('./lib/utils/protocol-utils');

const NUM_POSITIONS_CHUNK = 100 * 1024;

class Heightfield {
  constructor(archae) {
    this._archae = archae;
  }

  mount() {
    const {_archae: archae} = this;
    const {three, render, pose, world, teleport, /*physics,*/ stck, utils: {random: {chnkr}}} = zeo;
    const {THREE, scene} = three;

    const mapChunkMaterial = new THREE.MeshPhongMaterial({
      // color: 0xFFFFFF,
      shininess: 0,
      shading: THREE.FlatShading,
      vertexColors: THREE.VertexColors,
      // side: THREE.DoubleSide,
    });

    const worker = new Worker('archae/plugins/_plugins_heightfield/build/worker.js');
    const queue = [];
    worker.requestOriginHeight = () => new Promise((accept, reject) => {
      worker.postMessage({
        method: 'getOriginHeight',
      });
      queue.push(originHeight => {
        accept(originHeight);
      });
    });
    worker.requestGenerate = (x, y) => new Promise((accept, reject) => {
      const buffer = new ArrayBuffer(NUM_POSITIONS_CHUNK * 3);
      worker.postMessage({
        method: 'generate',
        args: {
          x,
          y,
          buffer,
        },
      }, [buffer]);
      queue.push(buffer => {
        accept(buffer);
      });
    });
    worker.onmessage = e => {
      const {data: buffer} = e;
      const cb = queue.shift();
      cb(buffer);
    };

    const _bootstrap = () => worker.requestOriginHeight()
      .then(originHeight => {
        world.setSpawnMatrix(new THREE.Matrix4().makeTranslation(0, originHeight, 0));
      });

    const _requestGenerate = (x, y) => worker.requestGenerate(x, y)
      .then(mapChunkBuffer => protocolUtils.parseMapChunk(mapChunkBuffer));

    const _makeMapChunkMesh = (mapChunkData, x, z) => {
      const {position, positions, normals, colors, heightfield, heightRange} = mapChunkData;

      const geometry = (() => {
        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
        geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
        const [minY, maxY] = heightRange;
        geometry.boundingSphere = new THREE.Sphere(
          new THREE.Vector3(
            (x * NUM_CELLS) + (NUM_CELLS / 2),
            (minY + maxY) / 2,
            (z * NUM_CELLS) + (NUM_CELLS / 2)
          ),
          Math.max(Math.sqrt((NUM_CELLS / 2) * (NUM_CELLS / 2) * 3), (maxY - minY) / 2)
        );
        return geometry;
      })();
      const material = mapChunkMaterial;

      const mesh = new THREE.Mesh(geometry, material);
      // mesh.frustumCulled = false;

      mesh.heightfield = heightfield
      mesh.destroy = () => {
        geometry.dispose();
      };

      return mesh;
    };

    const chunker = chnkr.makeChunker({
      resolution: 32,
      range: 4,
    });

    const _requestRefreshMapChunks = () => {
      const {hmd} = pose.getStatus();
      const {worldPosition: hmdPosition} = hmd;
      const {added, removed, relodded} = chunker.update(hmdPosition.x, hmdPosition.z);
      let retargeted = false;

      const _addTarget = (mapChunkMesh, x, z) => {
        teleport.addTarget(mapChunkMesh, {
          flat: true,
        });

        /* const physicsBody = physics.makeBody(mapChunkMesh, 'heightfield:' + x + ':' + z, {
          mass: 0,
          position: [
            (NUM_CELLS / 2) + (x * NUM_CELLS),
            0,
            (NUM_CELLS / 2) + (z * NUM_CELLS)
          ],
          linearFactor: [0, 0, 0],
          angularFactor: [0, 0, 0],
          bindObject: false,
          bindConnection: false,
        });
        mapChunkMesh.physicsBody = physicsBody; */
        const {heightfield} = mapChunkMesh;
        const stckBody = stck.makeStaticHeightfieldBody(
          [
            x * NUM_CELLS,
            0,
            z * NUM_CELLS,
          ],
          NUM_CELLS,
          NUM_CELLS,
          heightfield
        );
        mapChunkMesh.stckBody = stckBody;

        mapChunkMesh.targeted = true;
      };
      const _removeTarget = mapChunkMesh => {
        teleport.removeTarget(mapChunkMesh);

        /* const {physicsBody} = mapChunkMesh;
        physics.destroyBody(physicsBody); */
        const {stckBody} = mapChunkMesh;
        stck.destroyBody(stckBody);

        mapChunkMesh.targeted = false;
      };

      const addedPromises = added.map(chunk => {
        const {x, z} = chunk;

        return _requestGenerate(x, z)
          .then(mapChunkData => {
            const mapChunkMesh = _makeMapChunkMesh(mapChunkData, x, z);
            scene.add(mapChunkMesh);

            const {lod} = chunk;
            if (lod === 1 && !mapChunkMesh.targeted) {
              _addTarget(mapChunkMesh, x, z);

              retargeted = true;
            }

            chunk.data = mapChunkMesh;
          });
      });
      return Promise.all(addedPromises)
        .then(() => {
          removed.forEach(chunk => {
            const {data: mapChunkMesh} = chunk;
            scene.remove(mapChunkMesh);
            mapChunkMesh.destroy();

            const {lod} = chunk;
            if (lod !== 1 && mapChunkMesh.targeted) {
              _removeTarget(mapChunkMesh);

              retargeted = true;
            }
          });
          relodded.forEach(chunk => {
            const {x, z, lod, data: mapChunkMesh} = chunk;

            if (lod === 1 && !mapChunkMesh.targeted) {
              _addTarget(mapChunkMesh, x, z);

              retargeted = true;
            } else if (lod !== 1 && mapChunkMesh.targeted) {
              _removeTarget(mapChunkMesh);

              retargeted = true;
            }
          });
        })
        .then(() => {
          if (retargeted) {
            teleport.reindex();
          }
        });
    };

    return _bootstrap()
      .then(() => {
        let updating = false;
        let updateQueued = false;
        const tryMapChunkUpdate = () => {
          if (!updating) {
            updating = true;

            const done = () => {
              updating = false;

              if (updateQueued) {
                updateQueued = false;

                tryMapChunkUpdate();
              }
            };

            _requestRefreshMapChunks()
              .then(done)
              .catch(err => {
                console.warn(err);

                done();
              });
          } else {
            updateQueued = true;
          }
        };

        const _update = () => {
          tryMapChunkUpdate();
        };
        render.on('update', _update);

        this._cleanup = () => {
          // XXX remove chunks from the scene here

          render.removeListener('update', _update);
        };
      });
  }

  unmount() {
    this._cleanup();
  }
}

module.exports = Heightfield;
