const DEFAULT_MATRIX = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const NUM_INVENTORY_ITEMS = 4;

class Hub {
  constructor(archae) {
    this._archae = archae;
  }

  mount() {
    const {_archae: archae} = this;
    const {metadata: {hub: {url: hubUrl, enabled: hubEnabled}, server: {url: serverUrl, enabled: serverEnabled}}} = archae;

    let live = true;
    this._cleanup = () => {
      live = false;
    };

    const hostUrl = serverEnabled ? serverUrl : hubUrl;
    const _requestServers = hostUrl => fetch('https://' + hostUrl + '/servers/servers.json')
      .then(res => res.json());
    const _requestServer = hostUrl => fetch('https://' + hostUrl + '/servers/server.json')
      .then(res => res.json());

    return Promise.all([
      _requestServers(hostUrl),
      _requestServer(hostUrl),
    ])
      .then(([
        serversJson,
        serverJson,
      ]) => {
        if (live) {
          const _getServers = () => serversJson.servers;
          const _getCurrentServer = () => serverJson;
          const _changeServer = serverUrl => {
            if (serverUrl !== null) {
              return _requestServer(serverUrl)
                .then(serverJsonData => {
                  serverJson = serverJsonData;
                });
            } else {
              serverJson = {
                type: 'hub',
                url: null,
              };

              return Promise.resolve();
            }
          };
          const _requestLogin = ({token = null} = {}) => fetch('https://' + serverUrl + '/server/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({token}),
            credentials: 'same-origin',
          })
            .then(res => {
              if (res.status >= 200 && res.status < 300) {
                return res.json();
              } else {
                return null;
              }
            });
          const _requestLogout = () => fetch('https://' + serverUrl + '/server/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
          })
            .then(res => {
              if (res.status >= 200 && res.status < 300) {
                return res.json();
              } else {
                return null;
              }
            });
          const hubEnabled = false;
          const worldName = (() => {
            if (hubEnabled) {
              const {hostname} = window.location;
              const match = hostname.match(/^([^.]+)\./);
              return match && match[1];
            } else {
              return null;
            }
          })();
          const userState = {
            username: null,
            world: null,
            matrix: DEFAULT_MATRIX,
            inventory: (() => {
              const result = Array(NUM_INVENTORY_ITEMS);
              for (let i = 0; i < NUM_INVENTORY_ITEMS; i++) {
                result[i] = null;
              }
              return result;
            })(),
          };

          const _isEnabled = () => hubEnabled;
          const _getUserState = () => userState;
          const _getUserStateJson = () => {
            const {world, matrix} = userState;
            return {
              token: null,
              state: {
                world,
                matrix,
                inventory,
              },
            };
          };
          const _setUserStateMatrix = matrix => {
            userState.matrix = matrix;
          };
          const _getUserStateInventoryItem = index => {
            return userState.inventory[index] || null;
          };
          const _setUserStateInventoryItem = (index, item) => {
            userState.inventory[index] = item;
          };
          const _saveUserState = () => {
            const {username} = userState;

            if (hubEnabled && username) {
              return fetch(hubUrl + '/hub/userState', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(_getUserStateJson()),
              });
            } else {
              return Promise.resolve();
            }
          };
          const _saveUserStateAsync = () => {
            const {username} = userState;
            if (hubEnabled && username) {
              navigator.sendBeacon(hubUrl + '/hub/userState', new Blob([JSON.stringify(_getUserStateJson())], {
                type: 'application/json',
              }));
            }
          };

          return {
            isEnabled: _isEnabled,
            getServers: _getServers,
            getCurrentServer: _getCurrentServer,
            changeServer: _changeServer,
            requestLogin: _requestLogin,
            requestLogout: _requestLogout,
            getUserState: _getUserState,
            setUserStateMatrix: _setUserStateMatrix,
            getUserStateInventoryItem: _getUserStateInventoryItem,
            setUserStateInventoryItem: _setUserStateInventoryItem,
            saveUserState: _saveUserState,
            saveUserStateAsync: _saveUserStateAsync,
          };
        }
      });
  }

  unmount() {
    this._cleanup();
  }
}

const getQueryParameterByName = name => {
  name = name.replace(/[\[\]]/g, "\\$&");

  const url = window.location.href;
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const _parseJson = s => {
  let err = null;
  let result;
  try {
    j = JSON.parse(s);
  } catch (e) {
    err = e;
  }
  if (!err) {
    return j;
  } else {
    return null;
  }
};

module.exports = Hub;
