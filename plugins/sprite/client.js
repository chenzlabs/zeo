class Sprite {
  mount() {
    const {three: {THREE}, elements, utils: {sprite: spriteUtils}} = zeo;

    const pixelMaterial = new THREE.MeshPhongMaterial({
      vertexColors: THREE.FaceColors,
      shininess: 0,
    });

    const _requestFileImage = file =>
      file.fetch({
        type: 'blob',
      })
        .then(blob => new Promise((accept, reject) => {
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.src = url;
          img.onload = () => {
            accept(img);

            URL.revokeObjectURL(url);
          };
          img.onerror = err => {
            reject(err);

            URL.revokeObjectURL(url);
          };
        }));

    const spriteEntity = {
      attributes: {
        position: {
          type: 'matrix',
          value: [
            -0.5, 1, 0,
            0, 0, 0, 1,
            1, 1, 1,
          ],
        },
        image: {
          type: 'file',
          value: 'https://cdn.rawgit.com/modulesio/zeo-data/29412380b29e98b18c746a373bdb73aeff59e27a/img/icons/katana.png',
        },
      },
      entityAddedCallback(entityElement) {
        const entityApi = entityElement.getEntityApi();
        const entityObject = entityElement.getObject();

        entityApi.position = null;
        entityApi.mesh = null;

        entityApi._cancelRequest = null;

        entityApi._updateMesh = () => {
          const {position} = entityApi;

          if (position) {
            mesh.position.set(position[0], position[1], position[2]);
            mesh.quaternion.set(position[3], position[4], position[5], position[6]);
            mesh.scale.set(position[7], position[8], position[9]);
          }
        };

        entityApi._cleanup = () => {
          const {mesh, _cancelRequest: cancelRequest} = entityApi;
          if (mesh) {
            entityObject.remove(mesh);
          }
          if (cancelRequest) {
            cancelRequest();
          }
        };
      },
      entityRemovedCallback(entityElement) {
        const entityApi = entityElement.getEntityApi();

        entityApi._cleanup();
      },
      entityAttributeValueChangedCallback(entityElement, name, oldValue, newValue) {
        const entityApi = entityElement.getEntityApi();

        switch (name) {
          case 'position': {
            entityApi.position = newValue;

            entityApi._updateMesh();

            break;
          }
          case 'image': {
            const file = newValue;

            let live = true;
            entityApi._cancelRequest = () => {
              live = false;
            };

            _requestFileImage(file)
              .then(img => {
                if (live) {
                  const {mesh: oldMesh} = entityApi;
                  if (oldMesh) {
                    entityObject.remove(oldMesh);
                  }

                  const newMesh = (() => {
                    const pixelSize = 0.01;
                    const size = pixelSize * 88;

                    const geometry = spriteUtils.makeImageGeometry(img, pixelSize);
                    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, (size / 2) - (size * 0.15), 0));
                    const material = pixelMaterial;
                    
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.castShadow = true;
                    return mesh;
                  })();

                  entityObject.add(newMesh);
                  entityApi.mesh = newMesh;

                  entityApi._updateMesh();

                  entityApi._cancelRequest = null;
                }
              })
              .catch(err => {
                console.warn(err);
              });

            break;
          }
        }
      },
    };
    elements.registerEntity(this, spriteEntity);

    this._cleanup = () => {
      elements.unregisterEntity(this, spriteEntity);
    };
  }

  unmount() {
    this._cleanup();
  }
}

module.exports = Sprite;
