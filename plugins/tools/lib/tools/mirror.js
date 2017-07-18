// const THREEMirrorLib = require('../three-extra/Mirror');

const PORTAL_SIZE = 1;
const PORTAL_BORDER_SIZE = PORTAL_SIZE * 0.01;

const dataSymbol = Symbol();

const mirror = ({archae}) => {
  const {three, elements, pose, input, render, teleport, items, utils: {geometry: geometryUtils}} = zeo;
  const {THREE, scene, camera, renderer} = three;

window.renderer = renderer;
window.camera = camera;

  // const THREEMirror = THREEMirrorLib(THREE);
  /* const PORTAL_SHADER = {
    uniforms: {
      textureMap: {
        type: 't',
        value: null,
      },
      textureMatrix: {
        type: 'm4',
        value: new THREE.Matrix4(),
      },
    },
    vertexShader: `\
      uniform mat4 textureMatrix;
      varying vec4 texCoord;
      void main() {
        texCoord = textureMatrix * modelMatrix * vec4( position, 1.0 );
        // texCoord.xy = texCoord.xy / texCoord.w / 2.0 + 0.5;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: `\
      uniform sampler2D textureMap;
      varying vec4 texCoord;
      void main() {
        gl_FragColor = texture2DProj(textureMap, texCoord);
      }
    `,
  }; */
  const PORTAL_SHADER = {
    uniforms: {
			// mirrorColor: { value: new THREE.Color( 0x7F7F7F ) },
			mirrorSampler: { value: null },
			textureMatrix: { value: new THREE.Matrix4() }
		},

		vertexShader: [
			'uniform mat4 textureMatrix;',
			'varying vec4 mirrorCoord;',

			'void main() {',

			'	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
			'	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );',
			'	mirrorCoord = textureMatrix * worldPosition;',

			'	gl_Position = projectionMatrix * mvPosition;',

			'}'
		].join( '\n' ),

		fragmentShader: [
			// 'uniform vec3 mirrorColor;',
			'uniform sampler2D mirrorSampler;',
			'varying vec4 mirrorCoord;',

			'float blendOverlay(float base, float blend) {',
			'	return( base < 0.5 ? ( 2.0 * base * blend ) : (1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );',
			'}',
			'vec3 mirrorColor = vec3(0.5, 0.5, 0.5);',

			'void main() {',
			'	vec4 color = texture2DProj(mirrorSampler, mirrorCoord);',
			'	color = vec4(blendOverlay(mirrorColor.r, color.r), blendOverlay(mirrorColor.g, color.g), blendOverlay(mirrorColor.b, color.b), 1.0);',
			'	gl_FragColor = color;',
			'}'
		].join( '\n' ),
  };

  return () => {
    const borderMaterial = new THREE.MeshPhongMaterial({
      color: 0x795548,
      side: THREE.DoubleSide,
    });

console.log('register mirror api');

    const mirrorApi = {
      asset: 'ITEM.MIRROR',
      itemAddedCallback(grabbable) {
console.log('mirror item added');
        const mirrorMesh = (() => {
          const object = new THREE.Object3D();
          object.visible = false;

          const width = PORTAL_SIZE / 2;
          const height = PORTAL_SIZE;
          const border = PORTAL_BORDER_SIZE;
          const color = 0x808080;
          const rendererSize = renderer.getSize();
          const rendererPixelRatio = renderer.getPixelRatio();
          const resolutionWidth = rendererSize.width * rendererPixelRatio;
          const resolutionHeight = rendererSize.height * rendererPixelRatio;

          const inner = (() => {
            const geometry = new THREE.PlaneBufferGeometry(width, height);
            // const size = renderer.getSize();
            const texture = new THREE.WebGLRenderTarget(512, 512, {
              minFilter: THREE.NearestFilter,
              magFilter: THREE.NearestFilter,
              format: THREE.RGBFormat,
              // format: THREE.RGBAFormat,
              stencilBuffer: false,
            });

            const material = (() => {
              const shaderUniforms = THREE.UniformsUtils.clone(PORTAL_SHADER.uniforms);
              const shaderMaterial = new THREE.ShaderMaterial({
                uniforms: shaderUniforms,
                vertexShader: PORTAL_SHADER.vertexShader,
                fragmentShader: PORTAL_SHADER.fragmentShader,
              });
              shaderMaterial.uniforms.mirrorSampler.value = texture.texture;
              // shaderMaterial.polygonOffset = true;
              // shaderMaterial.polygonOffsetFactor = -1;
              return shaderMaterial;
            })();
            const mesh = new THREE.Mesh(geometry, material);

            const mirrorCamera = new THREE.PerspectiveCamera();
            var normal = new THREE.Vector3();
            var mirrorWorldPosition = new THREE.Vector3();
            var cameraWorldPosition = new THREE.Vector3();
            var rotationMatrix = new THREE.Matrix4();
            var lookAtPosition = new THREE.Vector3();

            // mesh.onBeforeRender = (_renderer, scene, camera) => {
            mesh.render = (scene, camera, renderer) => {
              if (object.visible) {
                object.visible = false;

                let vrCamera = renderer.vr.getCamera(camera);
                if (vrCamera.cameras) {
                  vrCamera = vrCamera.cameras[0];
                }

                mirrorCamera.fov = vrCamera.fov;
                mirrorCamera.aspect = vrCamera.aspect;
                mirrorCamera.near = vrCamera.near;
                mirrorCamera.far = vrCamera.far;

                mirrorWorldPosition.setFromMatrixPosition( object.matrixWorld );
                cameraWorldPosition.setFromMatrixPosition( vrCamera.matrixWorld );

                rotationMatrix.extractRotation( object.matrixWorld );

                normal.set( 0, 0, 1 );
                normal.applyMatrix4( rotationMatrix );

                var view = mirrorWorldPosition.clone().sub( cameraWorldPosition );
                view.reflect( normal ).negate();
                view.add( mirrorWorldPosition );

                rotationMatrix.extractRotation( vrCamera.matrixWorld );

                lookAtPosition.set( 0, 0, - 1 );
                lookAtPosition.applyMatrix4( rotationMatrix );
                lookAtPosition.add( cameraWorldPosition );

                var target = mirrorWorldPosition.clone().sub( lookAtPosition );
                target.reflect( normal ).negate();
                target.add( mirrorWorldPosition );

                mirrorCamera.position.copy( view );
                mirrorCamera.up.set( 0, - 1, 0 );
                mirrorCamera.up.applyMatrix4( rotationMatrix );
                mirrorCamera.up.reflect( normal ).negate();
                mirrorCamera.lookAt( target );

                mirrorCamera.updateProjectionMatrix();
                mirrorCamera.updateMatrixWorld();
                mirrorCamera.matrixWorldInverse.getInverse( mirrorCamera.matrixWorld );

                const {value: textureMatrix} = material.uniforms.textureMatrix;
                textureMatrix.set(
                  0.5, 0.0, 0.0, 0.5,
                  0.0, 0.5, 0.0, 0.5,
                  0.0, 0.0, 0.5, 0.5,
                  0.0, 0.0, 0.0, 1.0
                );
                textureMatrix.multiply( mirrorCamera.projectionMatrix );
                textureMatrix.multiply( mirrorCamera.matrixWorldInverse );

                renderer.render(scene, mirrorCamera, texture, true);
                renderer.setRenderTarget(null);

                object.visible = true;
              }
            };
            mesh.destroy = () => {
              geometry.dispose();
              material.dispose();
              texture.dispose();
            };

            return mesh;
          })();
          object.add(inner);
          object.inner = inner;

          const outer = (() => {
            const geometry = (() => {
              const leftGeometry = new THREE.BoxBufferGeometry(border, height, border);
              leftGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(-(width / 2) - (border / 2), 0, -(border / 2)));

              const rightGeometry = new THREE.BoxBufferGeometry(border, height, border);
              rightGeometry.applyMatrix(new THREE.Matrix4().makeTranslation((width / 2) + (border / 2), 0, -(border / 2)));

              const topGeometry = new THREE.BoxBufferGeometry(width + (border * 2), border, border);
              topGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, (height / 2) + (border / 2), -(border / 2)));

              const bottomGeometry = new THREE.BoxBufferGeometry(width + (border * 2), border, border);
              bottomGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -(height / 2) - (border / 2), -(border / 2)));

              const backGeometry = inner.geometry.clone();
              backGeometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
              backGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -(border / 2)));

              return geometryUtils.concatBufferGeometry([
                leftGeometry,
                rightGeometry,
                topGeometry,
                bottomGeometry,
                backGeometry,
              ]);
            })();
            const material = borderMaterial;

            const mesh = new THREE.Mesh(geometry, material);

            mesh.destroy = () => {
              geometry.dispose();
            };

            return mesh;
          })();
          object.add(outer);
          object.outer = outer;

          object.destroy = () => {
            inner.destroy();
            outer.destroy();
          };

          return object;
        })();
        scene.add(mirrorMesh);

        let grabbed = false;
        const _grab = () => {
          grabbed = true;
console.log('grabbed');

          grabbable.hide();
          mirrorMesh.visible = true;
        };
        grabbable.on('grab', _grab);
        const _release = () => {
          grabbed = false;

          grabbable.show();
          // mirrorMesh.visible = false;
        };
        grabbable.on('release', _release);
        const _grabbableUpdate = ({position, rotation, scale}) => {
          if (grabbed) {
            mirrorMesh.position.fromArray(position);
            mirrorMesh.quaternion.fromArray(rotation);
            mirrorMesh.scale.fromArray(scale);
            mirrorMesh.updateMatrixWorld();
          }
        };
        grabbable.on('update', _grabbableUpdate);

        const _update = () => {
          mirrorMesh.inner.render(scene, camera, renderer);
        };
        render.on('update', _update);

        grabbable[dataSymbol] = {
          cleanup: () => {
            scene.remove(mirrorMesh);
            mirrorMesh.destroy();

            grabbable.removeListener('grab', _grab);
            grabbable.removeListener('release', _release);
            grabbable.removeListener('update', _grabbableUpdate);

            render.removeListener('update', _update);
          },
        };
      },
      itemRemovedCallback(grabbable) {
        const {[dataSymbol]: {cleanup}} = grabbable;
        cleanup();
      },
    };
    items.registerItem(this, mirrorApi);

    return () => {
      borderMaterial.dispose();

      items.unregisterItem(this, mirrorApi);
    };
  };
}

module.exports = mirror;
