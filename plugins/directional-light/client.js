const geometryutils = require('geometryutils');

const SHADOW_MAP_SIZE = 2048;

class DirectionalLight {
  mount() {
    const {three: {THREE}, elements} = zeo;

    const geometryUtils = geometryutils({THREE});

    const directionalLightComponent = {
      selector: 'directional-light[position][lookat][color][intensity][shadow]',
      attributes: {
        position: {
          type: 'matrix',
          value: [
            4, 3, 3,
            0, 0, 0, 1,
            1, 1, 1,
          ],
        },
        lookat: {
          type: 'matrix',
          value: [
            0, 0, 0,
            0, 0, 0, 1,
            1, 1, 1,
          ],
        },
        color: {
          type: 'color',
          value: '#FFFFFF',
        },
        intensity: {
          type: 'number',
          value: 2,
          min: 0,
          max: 2,
          step: 0.1,
        },
        shadow: {
          type: 'checkbox',
          value: false,
        },
      },
      entityAddedCallback(entityElement) {
        const entityApi = entityElement.getComponentApi();
        const entityObject = entityElement.getObject();

        const mesh = (() => {
          const geometry = (() => {
            const coreSize = 0.1;
            const arrowSize = 0.05;
            const offsetSize = coreSize + (arrowSize / 2);
            const coreGeometry = new THREE.SphereBufferGeometry(coreSize, 0);
            const arrowGeometry = new THREE.CylinderBufferGeometry(0, sq(arrowSize / 2), arrowSize, 4, 1)
              .applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI * (3 / 12)))
              .applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2))
              .applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, offsetSize));

            return geometryUtils.concatBufferGeometry([coreGeometry, arrowGeometry]);
          })();
          const material = new THREE.MeshPhongMaterial({
            color: 0xFFEB3B,
            shininess: 10,
            shading: THREE.FlatShading,
          });

          return new THREE.Mesh(geometry, material);
        })();
        entityObject.add(mesh);
        entityApi.mesh = mesh;

        const light = (() => {
          const light = new THREE.DirectionalLight(0xFFFFFF, 2);
          light.shadow.mapSize.width = SHADOW_MAP_SIZE;
          light.shadow.mapSize.height = SHADOW_MAP_SIZE;
          // light.castShadow = true;
          return light;
        })();
        entityObject.add(light);
        entityApi.light = light;

        entityApi._cleanup = () => {
          entityObject.remove(mesh);
          entityObject.remove(light);
        };
      },
      entityRemovedCallback(entityElement) {
        const entityApi = entityElement.getComponentApi();

        entityApi._cleanup();
      },
      entityAttributeValueChangedCallback(entityElement, name, oldValue, newValue) {
        const entityApi = entityElement.getComponentApi();

        switch (name) {
          case 'position': {
            const {mesh, light} = entityApi;

            mesh.position.set(newValue[0], newValue[1], newValue[2]);
            light.position.copy(mesh.position);

            break;
          }
          case 'lookat': {
            const {mesh, light} = entityApi;

            const lookAtVector = new THREE.Vector3(newValue[0], newValue[1], newValue[2]);
            mesh.lookAt(lookAtVector);
            light.lookAt(lookAtVector);

            break;
          }
          case 'color': {
            const {light} = entityApi;

            light.color.setStyle(newValue);

            break;
          }
          case 'intensity': {
            const {light} = entityApi;

            light.intensity = newValue;

            break;
          }
          case 'shadow': {
            const {light} = entityApi;

            light.castShadow = newValue;

            break;
          }
        }
      }
    }
    elements.registerComponent(this, directionalLightComponent);

    this._cleanup = () => {
      elements.unregisterComponent(this, directionalLightComponent);
    };
  }

  unount() {
    this._cleanup();
  }
}

const sq = n => Math.sqrt((n * n) + (n * n));

module.exports = DirectionalLight;