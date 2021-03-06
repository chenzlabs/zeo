const PORTAL_SIZE = 1;
const PORTAL_BORDER_SIZE = PORTAL_SIZE * 0.01;

const PORTAL_SHADER = {
  uniforms: {
    textureMap: {
      type: 't',
      value: null,
    }
  },
  vertexShader: `\
    varying vec4 texCoord;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      vec4 position = projectionMatrix * mvPosition;
      texCoord = position;
      texCoord.xy = 0.5*texCoord.xy + 0.5*texCoord.w;
      gl_Position = position;
    }
  `,
  fragmentShader: `\
    uniform sampler2D textureMap;
    varying vec4 texCoord;
    void main() {
      gl_FragColor = texture2DProj(textureMap, texCoord);
    }
  `,
};

class Portal {
  constructor(archae) {
    this._archae = archae;
  }

  mount() {
    const {_archae: archae} = this;

    let live = true;
    this._cleanup = () => {
      live = false;
    };

    return archae.requestPlugins([ // XXX get rid of this dependency
      '/core/engines/cyborg',
    ]).then(([
      cyborg,
    ]) => {
      if (live) {
        const {three: {THREE, scene, camera, renderer}, elements, render, pose, utils: {geometry: geometryUtils}} = zeo;

        const _decomposeObjectMatrixWorld = object => _decomposeMatrix(object.matrixWorld);
        const _decomposeMatrix = matrix => {
          const position = new THREE.Vector3();
          const quaternion = new THREE.Quaternion();
          const scale = new THREE.Vector3();
          matrix.decompose(position, quaternion, scale);
          return {position, quaternion, scale};
        };

        const updates = [];
        const _update = () => {
          for (let i = 0; i < updates.length; i++) {
            const update = updates[i];
            update(camera);
          }
        };

        const updateEyes = [];
        const _updateEye = camera => {
          for (let i = 0; i < updateEyes.length; i++) {
            const updateEye = updateEyes[i];
            updateEye(camera);
          }
        };

        const portalEntity = {
          attributes: {
            position1: {
              type: 'matrix',
              value: [
                0, 1, 1,
                0, 1, 0, 6.123233995736766e-17,
                1, 1, 1,
              ],
            },
            color1: {
              type: 'color',
              value: '#FDA232',
            },
            position2: {
              type: 'matrix',
              value: [
                1, 1.5, -1,
                0, -0.3826834323650898, 0, 0.9238795325112867,
                1, 1, 1,
              ],
            },
            color2: {
              type: 'color',
              value: '#188EFA',
            }
          },
          entityAddedCallback(entityElement) {
            const entityApi = entityElement.getEntityApi();
            const entityObject = entityElement.getObject();

            const mesh = (() => {
              const result = new THREE.Object3D();

              const _makePortalRenderTarget = ({width, height}) => {
                return new THREE.WebGLRenderTarget(width, height, {
                  minFilter: THREE.NearestFilter,
                  magFilter: THREE.NearestFilter,
                  // format: THREE.RGBFormat,
                  format: THREE.RGBAFormat,
                });
              };
              const _makePortalMesh = spec => {
                const {width, height, border, position, rotation, texture, portalColor} = spec;

                const object = new THREE.Object3D();
                object.width = width;
                object.height = height;

                const inner = (() => {
                  const geometry = new THREE.PlaneBufferGeometry(width, height);
                  const material = (() => {
                    const shaderUniforms = THREE.UniformsUtils.clone(PORTAL_SHADER.uniforms);
                    const shaderMaterial = new THREE.ShaderMaterial({
                      uniforms: shaderUniforms,
                      vertexShader: PORTAL_SHADER.vertexShader,
                      fragmentShader: PORTAL_SHADER.fragmentShader,
                    });
                    shaderMaterial.uniforms.textureMap.value = texture;
                    shaderMaterial.polygonOffset = true;
                    shaderMaterial.polygonOffsetFactor = -1;
                    return shaderMaterial;
                  })();
                  const mesh = new THREE.Mesh(geometry, material);
                  return mesh;
                })();
                object.add(inner);
                object.inner = inner;

                const outer = (() => {
                  if (border > 0) {
                    const geometry = (() => {
                      const leftGeometry = new THREE.BoxBufferGeometry(border, height, border);
                      leftGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(-(width / 2) - (border / 2), 0, -(border / 2)));

                      const rightGeometry = new THREE.BoxBufferGeometry(border, height, border);
                      rightGeometry.applyMatrix(new THREE.Matrix4().makeTranslation((width / 2) + (border / 2), 0, -(border / 2)));

                      const topGeometry = new THREE.BoxBufferGeometry(width + (border * 2), border, border);
                      topGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, (height / 2) + (border / 2), -(border / 2)));

                      const bottomGeometry = new THREE.BoxBufferGeometry(width + (border * 2), border, border);
                      bottomGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -(height / 2) - (border / 2), -(border / 2)));

                      const bufferGeometry = geometryUtils.concatBufferGeometry([
                        leftGeometry,
                        rightGeometry,
                        topGeometry,
                        bottomGeometry,
                      ]);
                      return bufferGeometry;
                    })();
                    const material = new THREE.MeshLambertMaterial({
                      color: portalColor,
                    });

                    const mesh = new THREE.Mesh(geometry, material);
                    return mesh;
                  } else {
                    const mesh = new THREE.Object3D();
                    return mesh;
                  }
                })();
                object.add(outer);
                object.outer = outer;

                const back = (() => {
                  const geometry = (() => {
                    const {geometry: innerGeometry} = inner;
                    const bufferGeometry = innerGeometry.clone();
                    bufferGeometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
                    bufferGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -(border / 2)));
                    return bufferGeometry;
                  })();
                  const material = new THREE.MeshLambertMaterial({
                    color: portalColor,
                    side: THREE.DoubleSide,
                  });
                  const mesh = new THREE.Mesh(geometry, material);
                  return mesh;
                })();
                object.add(back);
                object.back = back;

                object.position.set(position.x, position.y, position.z);
                object.rotation.set(rotation.x, rotation.y, rotation.z, rotation.order);

                return object;
              };

              const rendererSize = renderer.getSize();
              const rendererPixelRatio = renderer.getPixelRatio();
              const resolutionWidth = rendererSize.width * rendererPixelRatio;
              const resolutionHeight = rendererSize.height * rendererPixelRatio;
              const renderTargets = {
                red: _makePortalRenderTarget({
                  width: resolutionWidth,
                  height: resolutionHeight,
                }),
                blue: _makePortalRenderTarget({
                  width: resolutionWidth,
                  height: resolutionHeight,
                }),
              };
              result.renderTargets = renderTargets;

              const meshes = {
                red: _makePortalMesh({
                  width: PORTAL_SIZE / 2,
                  height: PORTAL_SIZE / 4,
                  border: PORTAL_BORDER_SIZE,
                  position: new THREE.Vector3(0, 1, 1),
                  rotation: new THREE.Euler(0, Math.PI, 0, camera.rotation.order),
                  texture: renderTargets.red.texture,
                  portalColor: 0xFDA232,
                }),
                blue: _makePortalMesh({
                  width: PORTAL_SIZE,
                  height: PORTAL_SIZE,
                  border: PORTAL_BORDER_SIZE,
                  position: new THREE.Vector3(1, 1.5, -1),
                  rotation: new THREE.Euler(0, -(Math.PI / 2) + (Math.PI / 4), 0, camera.rotation.order),
                  texture: renderTargets.blue.texture,
                  portalColor: 0x188EFA,
                }),
              };
              result.add(meshes.red);
              result.add(meshes.blue);
              result.meshes = meshes;

              return result;
            })();
            entityObject.add(mesh);
            entityApi.mesh = mesh;

            const sourcePortalCamera = (() => {
              const result = new THREE.PerspectiveCamera();
              result.rotation.order = camera.rotation.order;
              return result;
            })();
            scene.add(sourcePortalCamera);

            let {position: lastCameraPosition} = _decomposeObjectMatrixWorld(camera);

            const _getSourcePortalCameraPosition = (camera, sourcePortalMesh, targetPortalMesh) => {
              const {position: cameraPosition, quaternion: cameraQuaternion} = _decomposeObjectMatrixWorld(camera);

              const vectorToTarget = targetPortalMesh.position.clone().sub(cameraPosition);
              const targetRotation = targetPortalMesh.rotation.toVector3();
              const flippedSourceRotation = (() => {
                const result = sourcePortalMesh.rotation.toVector3();
                result.y += Math.PI;
                result.x *= -1;
                return result;
              })();
              const rotationDelta = targetRotation.sub(flippedSourceRotation);
              const rotatedVectorToTarget = vectorToTarget.clone()
                .applyEuler(new THREE.Euler(
                  -rotationDelta.x,
                  -rotationDelta.y,
                  -rotationDelta.z,
                  camera.rotation.order
                ));
              const cameraEuler = new THREE.Euler().setFromQuaternion(cameraQuaternion, camera.rotation.order);

              const position = sourcePortalMesh.position.clone().sub(rotatedVectorToTarget);
              const rotation = new THREE.Euler(
                cameraEuler.x - rotationDelta.x,
                cameraEuler.y - rotationDelta.y,
                cameraEuler.z - rotationDelta.z,
                camera.rotation.order
              );
              return {
                position,
                rotation,
              };
            };
            const update = () => {
              const _getTeleportMatrix = (camera, sourcePortalMesh, targetPortalMesh) => {
                const {position: destinationPoint, rotation: destinationRotation} = _getSourcePortalCameraPosition(camera, sourcePortalMesh, targetPortalMesh);

                const matrix = pose.getStageMatrix();
                const {position, quaternion, scale} = _decomposeMatrix(matrix);
                position.copy(destinationPoint);
                const {position: cameraPosition, quaternion: cameraQuaternion, scale: cameraScale} = _decomposeObjectMatrixWorld(camera);
                const cameraRotation = new THREE.Euler().setFromQuaternion(cameraQuaternion, camera.rotation.order);
                quaternion.setFromEuler(new THREE.Euler(
                  destinationRotation.x - cameraRotation.x,
                  destinationRotation.y,
                  destinationRotation.z - cameraRotation.z,
                  camera.rotation.order
                ));
                matrix.compose(position, quaternion, scale);
                return matrix;
              };

              const _checkTeleport = () => {
                const {position: currentCameraPosition} = _decomposeObjectMatrixWorld(camera);
                const cameraMoveLine = new THREE.Line3(lastCameraPosition, currentCameraPosition);

                const {meshes: portalMeshes} = mesh;
                const {red: redPortalMesh, blue: bluePortalMesh} = portalMeshes;
                [ redPortalMesh, bluePortalMesh ].forEach((portalMesh, i, a) => {
                  const portalMeshNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(portalMesh.quaternion);
                  const portalMeshPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(portalMeshNormal, portalMesh.position);
                  const intersection = portalMeshPlane.intersectLine(cameraMoveLine);

                  if (intersection) {
                    const intersectionOffset = intersection.clone().sub(portalMesh.position);
                    const upDistance = intersectionOffset.clone().projectOnVector(new THREE.Vector3(0, 1, 0).applyQuaternion(portalMesh.quaternion)).length();
                    const downDistance = intersectionOffset.clone().projectOnVector(new THREE.Vector3(0, -1, 0).applyQuaternion(portalMesh.quaternion)).length();
                    const leftDistance = intersectionOffset.clone().projectOnVector(new THREE.Vector3(-1, 0, 0).applyQuaternion(portalMesh.quaternion)).length();
                    const rightDistance = intersectionOffset.clone().projectOnVector(new THREE.Vector3(1, 0, 0).applyQuaternion(portalMesh.quaternion)).length();

                    const {width, height} = portalMesh;
                    const halfWidth = width / 2;
                    const halfHeight = height / 2;
                    if (upDistance < halfHeight && downDistance < halfHeight && leftDistance < halfWidth && rightDistance < halfWidth) {
                      const distancePastPlane = portalMeshPlane.distanceToPoint(currentCameraPosition);
                      if (distancePastPlane < 0) {
                        const targetPortalMesh = portalMesh;
                        const sourcePortalMesh = a[i === 0 ? 1 : 0];

                        const matrix = _getTeleportMatrix(camera, sourcePortalMesh, targetPortalMesh);
                        pose.setStageMatrix(matrix);

                        pose.resetPose();

                        // apply the camera change this frame
                        pose.updateStatus();
                        cyborg.update();
                      }
                    }
                  }
                });

                lastCameraPosition = currentCameraPosition;
              };

              _checkTeleport();
            };
            updates.push(update);

            const updateEye = eyeCamera => {
              const _renderPortals = () => {
                const {meshes: portalMeshes, renderTargets: portalRenderTargets} = mesh;
                const {red: redPortalMesh, blue: bluePortalMesh} = portalMeshes;
                const {red: redPortalRenderTarget, blue: bluePortalRenderTarget} = portalRenderTargets;

                // prevent recursive reading from the portal texture we're writing
                const portals = [ redPortalMesh, bluePortalMesh ];
                portals.forEach(portalMesh => {
                  portalMesh.inner.visible = false;
                });

                const _renderPortal = (sourcePortalMesh, targetPortalMesh, targetRenderTarget) => {
                  // align the portal camera
                  (() => {
                    /* if (!sourcePortalCamera.parent) {
                      scene.add(sourcePortalCamera);
                    } */
                    sourcePortalCamera.projectionMatrix.copy(eyeCamera.projectionMatrix);

                    const sourcePortalCameraPosition = _getSourcePortalCameraPosition(eyeCamera, sourcePortalMesh, targetPortalMesh);

                    sourcePortalCamera.position.copy(sourcePortalCameraPosition.position);
                    sourcePortalCamera.rotation.copy(sourcePortalCameraPosition.rotation);
                  })();

                  // perform the render
                  sourcePortalMesh.visible = false;
                  renderer.render(scene, sourcePortalCamera, targetRenderTarget);
                  renderer.setRenderTarget(null);
                  sourcePortalMesh.visible = true;
                };

                _renderPortal(bluePortalMesh, redPortalMesh, redPortalRenderTarget);
                _renderPortal(redPortalMesh, bluePortalMesh, bluePortalRenderTarget);

                // undo portal mesh hide
                portals.forEach(portalMesh => {
                  portalMesh.inner.visible = true;
                });
              };

              _renderPortals();
            };
            updateEyes.push(updateEye);

            entityApi._cleanup = () => {
              entityObject.remove(mesh);

              scene.remove(sourcePortalCamera);

              updates.splice(updates.indexOf(update), 1);
              updateEyes.splice(updateEyes.indexOf(updateEye), 1);
            };
          },
          entityRemovedCallback(entityElement) {
            const entityApi = entityElement.getEntityApi();

            entityApi._cleanup();
          },
          entityAttributeValueChangedCallback(entityElement, name, oldValue, newValue) {
            const entityApi = entityElement.getEntityApi();

            switch (name) {
              case 'position1': {
                const {mesh} = entityApi;
                const {meshes} = mesh;
                const {red: redPortalMesh} = meshes;

                redPortalMesh.position.set(newValue[0], newValue[1], newValue[2]);
                redPortalMesh.quaternion.set(newValue[3], newValue[4], newValue[5], newValue[6]);
                redPortalMesh.scale.set(newValue[7], newValue[8], newValue[9]);

                break;
              }
              case 'color1': {
                const {mesh} = entityApi;
                const {meshes} = mesh;
                const {red: redPortalMesh} = meshes;
                const {outer} = redPortalMesh;
                const {material} = outer;

                material.color = new THREE.Color(newValue);

                break;
              }
              case 'position2': {
                const {mesh} = entityApi;
                const {meshes} = mesh;
                const {blue: bluePortalMesh} = meshes;

                bluePortalMesh.position.set(newValue[0], newValue[1], newValue[2]);
                bluePortalMesh.quaternion.set(newValue[3], newValue[4], newValue[5], newValue[6]);
                bluePortalMesh.scale.set(newValue[7], newValue[8], newValue[9]);

                break;
              }
              case 'color2': {
                const {mesh} = entityApi;
                const {meshes} = mesh;
                const {blue: bluePortalMesh} = meshes;
                const {outer} = bluePortalMesh;
                const {material} = outer;

                material.color = new THREE.Color(newValue);

                break;
              }
            }
          }
        };
        elements.registerEntity(this, portalEntity);

        render.on('update', _update);
        render.on('updateEye', _updateEye);

        this._cleanup = () => {
          elements.unregisterEntity(this, portalEntity);

          render.removeListener('update', _update);
          render.removeListener('updateEye', _updateEye);
        };

        return {};
      }
    });
  }

  unmount() {
    this._cleanup();
  }
}

module.exports = Portal;
