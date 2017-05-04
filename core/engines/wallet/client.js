import {
  WIDTH,
  HEIGHT,
  WORLD_WIDTH,
  WORLD_HEIGHT,
  WORLD_DEPTH,

  TAGS_WIDTH,
  TAGS_HEIGHT,
  TAGS_WORLD_WIDTH,
  TAGS_WORLD_HEIGHT,
  TAGS_WORLD_DEPTH,
} from './lib/constants/wallet';
import walletRenderer from './lib/render/wallet';
import menuUtils from './lib/utils/menu';

const TAGS_PER_ROW = 4;
const TAGS_ROWS_PER_PAGE = 6;
const TAGS_PER_PAGE = TAGS_PER_ROW * TAGS_ROWS_PER_PAGE;
const ASSET_TAG_MESH_SCALE = 1.5;
const DEFAULT_MATRIX = [
  0, 0, 0,
  0, 0, 0, 1,
  1, 1, 1,
];

const SIDES = ['left', 'right'];

class Wallet {
  constructor(archae) {
    this._archae = archae;
  }

  mount() {
    const {_archae: archae} = this;
    const {metadata: {site: {url: siteUrl}, home: {enabled: homeEnabled}, server: {enabled: serverEnabled}}} = archae;

    const cleanups = [];
    this._cleanup = () => {
      for (let i = 0; i < cleanups.length; i++) {
        const cleanup = cleanups[i];
        cleanup();
      }
    };

    let live = true;
    cleanups.push(() => {
      live = false;
    });

    return archae.requestPlugins([
      '/core/engines/three',
      '/core/engines/input',
      '/core/engines/biolumi',
      '/core/engines/rend',
      '/core/engines/keyboard',
      '/core/engines/tags',
    ]).then(([
      three,
      input,
      biolumi,
      rend,
      keyboard,
      tags,
    ]) => {
      if (live) {
        const {THREE, scene, camera} = three;

        const transparentMaterial = biolumi.getTransparentMaterial();

        const _decomposeObjectMatrixWorld = object => _decomposeMatrix(object.matrixWorld);
        const _decomposeMatrix = matrix => {
          const position = new THREE.Vector3();
          const rotation = new THREE.Quaternion();
          const scale = new THREE.Vector3();
          matrix.decompose(position, rotation, scale);
          return {position, rotation, scale};
        };

        const walletState = {
          loading: false,
          inputText: '',
          numTags: 0,
          page: 0,
        };
        const focusState = {
          keyboardFocusState: null,
        };
        const walletCacheState = {
          tagMeshes: [],
          loaded: false,
        };

        const walletMesh = (() => {
          const result = new THREE.Object3D();
          result.visible = false;

          const menuMesh = (() => {
            const object = new THREE.Object3D();

            const planeMesh = (() => {
              const worldUi = biolumi.makeUi({
                width: WIDTH,
                height: HEIGHT,
              });
              const mesh = worldUi.makePage(({
                wallet: {
                  loading,
                  inputText,
                  numTags,
                  page,
                },
                focus: {
                  keyboardFocusState,
                },
              }) => {
                const {type = '', inputValue = 0} = keyboardFocusState || {};
                const focus = type === 'wallet';

                return {
                  type: 'html',
                  src: walletRenderer.getWalletPageSrc({loading, inputText, inputValue, numTags, page, focus}),
                  x: 0,
                  y: 0,
                  w: WIDTH,
                  h: HEIGHT,
                };
              }, {
                type: 'wallet',
                state: {
                  wallet: walletState,
                  focus: focusState,
                },
                worldWidth: WORLD_WIDTH,
                worldHeight: WORLD_HEIGHT,
              });
              mesh.receiveShadow = true;

              const {page} = mesh;
              rend.addPage(page);

              cleanups.push(() => {
                rend.removePage(page);
              });

              return mesh;
            })();
            object.add(planeMesh);
            object.planeMesh = planeMesh;

            const shadowMesh = (() => {
              const geometry = new THREE.BoxBufferGeometry(WORLD_WIDTH, WORLD_HEIGHT, 0.01);
              const material = transparentMaterial;
              const mesh = new THREE.Mesh(geometry, material);
              mesh.castShadow = true;
              return mesh;
            })();
            object.add(shadowMesh);

            return object;
          })();
          result.add(menuMesh);
          result.menuMesh = menuMesh;

          const assetsMesh = (() => {
            const object = new THREE.Object3D();
            object.position.z = 0.001;
            return object;
          })();
          result.add(assetsMesh);
          result.assetsMesh = assetsMesh;

          return result;
        })();
        rend.registerMenuMesh('walletMesh', walletMesh);

        const _updatePages = () => {
          const {menuMesh} = walletMesh;
          const {planeMesh} = menuMesh;
          const {page} = planeMesh;
          page.update();
        };
        _updatePages();

        let assetTagMeshes = [];
        const walletCancels = [];
        const _updateAssetsTagMeshContainer = () => {
          // hide old
          const oldTagMeshes = assetTagMeshes;
          for (let i = 0; i < oldTagMeshes.length; i++) {
            const oldTagMesh = oldTagMeshes[i];
            oldTagMesh.visible = false;
            oldTagMesh.initialVisible = false;
          }

          // cancel old rendering
          for (let i = 0; i < walletCancels.length; i++) {
            const walletCancel = walletCancels[i];
            walletCancel();
          }
          walletCancels.length = 0;

          // show new
          const {assetsMesh} = walletMesh;
          const {page} = walletState;
          const {tagMeshes} = walletCacheState;
          const aspectRatio = 400 / 150;
          const width = TAGS_WORLD_WIDTH * ASSET_TAG_MESH_SCALE;
          const height = width / aspectRatio;
          const leftClip = ((30 / WIDTH) * WORLD_WIDTH);
          const rightClip = (((250 + 30) / WIDTH) * WORLD_WIDTH);
          const padding = (WORLD_WIDTH - (leftClip + rightClip) - (TAGS_PER_ROW * width)) / (TAGS_PER_ROW - 1);
          const newTagMeshes = [];
          const startIndex = page * TAGS_PER_PAGE;
          const endIndex = (page + 1) * TAGS_PER_PAGE;
          for (let i = startIndex; i < endIndex && i < tagMeshes.length; i++) {
            const newTagMesh = tagMeshes[i];

            const baseI = i - startIndex;
            const x = baseI % TAGS_PER_ROW;
            const y = Math.floor(baseI / TAGS_PER_ROW);
            newTagMesh.position.set(
              -(WORLD_WIDTH / 2) + (leftClip + (width / 2)) + (x * (width + padding)),
              (WORLD_HEIGHT / 2) - (height / 2) - (y * (height + padding)) - 0.23,
              0
            );
            newTagMesh.planeDetailsMesh.position.copy(
              newTagMesh.planeDetailsMesh.initialOffset.clone().sub(newTagMesh.position)
            );
            newTagMesh.visible = true;
            newTagMesh.initialVisible = true;

            const {planeMesh: newTagMeshPlaneMesh} = newTagMesh;
            const {page: newTagMeshPage} = newTagMeshPlaneMesh;
            const walletCancel = newTagMeshPage.initialUpdate();

            newTagMeshes.push(newTagMesh);
            walletCancels.push(walletCancel);
          }
          assetTagMeshes = newTagMeshes;
        };

        const _searchAssets = (q = '') => new Promise((accept, reject) => {
          const iframe = document.createElement('iframe');
          const requestId = _makeId();

          const _cleanup = () => {
            iframe.removeEventListener('error', _error);
            window.removeEventListener('message', _message);

            document.body.removeChild(iframe);
          };

          const _error = err => {
            _cleanup();

            reject(err);
          };
          iframe.addEventListener('error', _error);
          const _message = e => {
            const {data} = e;
            const {id} = data;

            if (id === requestId) {
              _cleanup();

              const {error} = data;

              if (!error) {
                const {result} = data;
                accept(result);
              } else {
                reject(error);
              }
            }
          };
          window.addEventListener('message', _message);

          iframe.src = `${siteUrl}/wallet?x=status&i=${requestId}`;
          document.body.appendChild(iframe);
        });
        const _updateWallet = menuUtils.debounce(next => {
          const {inputText} = walletState;

          _searchAssets(inputText)
            .then(itemSpecs => itemSpecs.map(itemSpec => {
              const {asset, quantity} = itemSpec;

              const assetTagMesh = tags.makeTag({
                type: 'asset',
                id: asset,
                name: asset,
                displayName: asset,
                quantity: quantity,
                matrix: DEFAULT_MATRIX,
                metadata: {
                  isStatic: true,
                },
              }, {
                initialUpdate: false,
              });
              assetTagMesh.planeMesh.scale.set(ASSET_TAG_MESH_SCALE, ASSET_TAG_MESH_SCALE, 1);

              return assetTagMesh;
            }))
            .then(tagMeshes => {
              const {tagMeshes: oldTagMeshes} = walletCacheState;

              walletState.loading = false;
              walletState.page = 0;
              walletState.numTags = tagMeshes.length;
              walletCacheState.tagMeshes = tagMeshes;

              const {assetsMesh} = walletMesh;
              for (let i = 0; i < oldTagMeshes.length; i++) {
                const oldTagMesh = oldTagMeshes[i];
                assetsMesh.remove(oldTagMesh);
                tags.destroyTag(oldTagMesh);
              }
              for (let i = 0; i < tagMeshes.length; i++) {
                const tagMesh = tagMeshes[i];
                tagMesh.visible = false;
                tagMesh.initialVisible = false;
                assetsMesh.add(tagMesh);
              }

              _updateAssetsTagMeshContainer();
              _updatePages();

              next();
            })
            .catch(err => {
              console.warn(err);

              next();
            });

          const {numTags} = walletState;
          walletState.loading = numTags === 0;

          _updatePages();
        });

        const _tabchange = tab => {
          if (tab === 'wallet') {
            keyboard.tryBlur();

            const {loaded} = walletCacheState;
            if (!loaded) {
              _updateWallet();

              walletCacheState.loaded = true;
            }
          }
        };
        rend.on('tabchange', _tabchange);

        const _trigger = e => {
          // XXX
        };
        input.on('trigger', _trigger, {
          priority: 1,
        });
        const _triggerdown = e => {
          // XXX
        };
        input.on('triggerdown', _triggerdown, {
          priority: 1,
        });

        cleanups.push(() => {
          rend.removeListener('tabchange', _tabchange);

          input.removeListener('trigger', _trigger);
          input.removeListener('triggerdown', _triggerdown);
        });

        const _getAssetTagMeshes = () => assetTagMeshes;

        return {
          getAssetTagMeshes: _getAssetTagMeshes,
        };
      }
    });
  }

  unmount() {
    this._cleanup();
  }
}

const _makeId = () => Math.random().toString(36).substring(7);

module.exports = Wallet;