const {
  WIDTH,
  HEIGHT,
} = require('../constants/servers');

const upImg = require('../img/up');
const downImg = require('../img/down');

const NUM_SERVERS_PER_PAGE = 8;

const makeRenderer = ({creatureUtils}) => {

const getServersPageSrc = ({remoteServers, page, loading}) => {
  const localRemoteServers = remoteServers.slice(page * NUM_SERVERS_PER_PAGE, (page + 1) * NUM_SERVERS_PER_PAGE);

  const leftSrc = `<div style="display: flex; padding: 30px; font-size: 36px; line-height: 1.4; flex-grow: 1; flex-direction: column;">
    ${loading ? `<div style="padding: 0 30px; font-size: 30px;">Loading...</div>` : ''}
    ${!loading ? getServersSrc(localRemoteServers) : ''}
  </div>`
  const rightSrc = (() => {
    const showUp = page !== 0;
    const showDown = (() => {
      const numPages = Math.ceil(remoteServers.length / localRemoteServers);
      return page < (numPages - 1);
    })();

    return `\
      <div style="display: flex; width: 250px; min-height: ${HEIGHT}px; padding: 30px 0; flex-direction: column; box-sizing: border-box;">
        <a style="position: relative; display: flex; margin: 0 30px; margin-bottom: auto; border: 2px solid; border-radius: 5px; text-decoration: none; justify-content: center; align-items: center; ${showUp ? '' : 'visibility: hidden;'}" onclick="servers:up">
          ${upImg}
        </a>
        <a style="position: relative; display: flex; margin: 0 30px; border: 2px solid; border-radius: 5px; text-decoration: none; justify-content: center; align-items: center; ${showDown ? '' : 'visibility: hidden;'}" onclick="servers:down">
          ${downImg}
        </a>
      </div>
    `;
  })();

  return `\
    <div style="display: flex; min-height: ${HEIGHT}px;">
      ${leftSrc}
      ${rightSrc}
    </div>
  `;
};

const getServerSrc = (server, index) => {
  const {worldname, url, users} = server;

  return `\
    <a style="display: flex; padding: 10px 0; border-bottom: 1px solid #EEE; text-decoration: none;" onclick="servers:${index}">
      <img src="${creatureUtils.makeStaticCreature('server:' + worldname)}" width="50" height="50" style="display: flex; width: 80px; height: 80px; margin-right: 10px; image-rendering: -moz-crisp-edges; image-rendering: pixelated;" />
      <div style="display: flex; margin-right: auto; padding: 5px; flex-direction: column;">
        <div style="font-size: 20px; font-weight: 600;">${worldname}</div>
        <div style="font-size: 13px; font-weight: 400;">
          ${url ?
            `<i>${url}</i>`
          :
            ''
          }
        </div>
      </div>
      <div style="width: 300px; padding: 5px; font-size: 20px; box-sizing: border-box;">
        ${users.length > 0 ?
          users.map(user =>
            `<div style="display: inline-block; margin-right: 5px; padding: 2px 10px; background-color: #F7F7F7; font-size: 13px; font-weight: 400;">${user}</div>`
          ).join('')
        :
          'no users'
        }
      </div>
    </a>
  `;
};

const getServersSrc = servers => {
  if (servers.length > 0) {
    return `<div style="display: flex; width: ${WIDTH - 250}px; height: ${HEIGHT - 100}px; padding: 0 30px; flex-direction: column; box-sizing: border-box;">
      ${servers.map((server, index) => getServerSrc(server, index)).join('')}
    </div>`;
  } else {
    return `<div style="padding: 0 30px; font-size: 30px;">No servers</div>`;
  }
};

return {
  getServersPageSrc,
};

};

module.exports = {
  makeRenderer,
};
