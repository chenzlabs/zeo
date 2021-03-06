const {
  HEIGHT,
  WIDTH,
  ASPECT_RATIO,
  OPEN_WIDTH,
  OPEN_HEIGHT,
  DETAILS_WIDTH,
  DETAILS_HEIGHT,
  CREDIT_ASSET_NAME,
} = require('../constants/tags');

const vectorPolygonImg = require('../img/vector-polygon');
const vectorPolygonImgSrc = 'data:image/svg+xml;base64,' + btoa(vectorPolygonImg);
const closeBoxOutline = require('../img/close-box-outline');
const closeBoxOutlineSrc = 'data:image/svg+xml;base64,' + btoa(closeBoxOutline);
const closeOutline = require('../img/close-outline');
const closeOutlineSrc = 'data:image/svg+xml;base64,' + btoa(closeOutline);
const packageVariant = require('../img/package-variant');
const packageVariantSrc = 'data:image/svg+xml;base64,' + btoa(packageVariant);
const packageVariantClosed = require('../img/package-variant-closed');
const packageVariantClosedSrc = 'data:image/svg+xml;base64,' + btoa(packageVariantClosed);
const autorenewImg = require('../img/autorenew');
const autorenewImgSrc = 'data:image/svg+xml;base64,' + btoa(autorenewImg);
const closeBoxImg = require('../img/close-box');
const closeBoxImgSrc = 'data:image/svg+xml;base64,' + btoa(closeBoxImg);
const linkImg = require('../img/link');
const linkImgSrc = 'data:image/svg+xml;base64,' + btoa(linkImg);
const upImg = require('../img/up');
const downImg = require('../img/down');

const AXES = ['x', 'y', 'z'];

const makeRenderer = ({typeUtils, creatureUtils}) => {
  const getModuleSrc = ({item, inputText, inputValue}) => {
    const {id, name, displayName, description, instancing, metadata: {isStatic, exists}} = item;
    const tagName = isStatic ? 'a' : 'div';
    const linkTagName = isStatic ? 'div' : 'a';
    const staticExists = isStatic && exists;
    const imgSrc = (() => {
      if (isStatic) {
        if (exists) {
          return packageVariantSrc;
        } else {
          return packageVariantClosedSrc;
        }
      } else {
        return vectorPolygonImgSrc;
      }
    })();

    const headerSrc = `\
      <div style="position: relative; display: flex; width: ${WIDTH}px; height: ${HEIGHT}px; background-color: #EEE; padding-left: 30px; text-decoration: none; overflow: hidden; box-sizing: border-box; ${(instancing || staticExists) ? 'filter: brightness(75%);' : ''}">
        <div style="display: flex; position: absolute; top: 60px; left: -60px; width: ${HEIGHT}px; height: 30px; background-color: #4CAF50; font-weight: 300; justify-content: center; align-items: center; box-sizing: border-box; transform: rotate(-90deg);">Module</div>
        <${linkTagName} style="display: flex; margin-left: -30px; padding-left: 30px; flex-grow: 1; text-decoration: none; box-sizing: border-box;" onclick="module:main:${id}" onmousedown="module:main:${id}">
          <img src="${creatureUtils.makeStaticCreature('module:' + name)}" width="80" height="80" style="width: 80px; height: 80px; margin: 10px; image-rendering: -moz-crisp-edges; image-rendering: pixelated;" />
          <div style="margin-right: 10px; flex-grow: 1;">
            <div style="display: flex; height: 150px; flex-direction: column;">
              <h1 style="margin: 0; margin-top: 10px; font-size: 28px; font-weight: 400; line-height: 1.4;">${displayName}</h1>
              <p style="margin: 0; font-size: 16px; line-height: 1.4; flex-grow: 1;">${description}</p>
            </div>
          </div>
        </${linkTagName}>
        ${!isStatic ? `<div style="display: flex;">
          <a style="display: flex; margin-bottom: auto; padding: 15px; text-decoration: none; justify-content: center; align-items: center;" onclick="tag:remove:${id}">
            <img src="${closeOutlineSrc}" width="30" height="30">
          </a>
        </div>` : ''}
      </div>
    `;

    return `\
      <${tagName} style="display: block; text-decoration: none;" onclick="module:main:${id}">
        ${headerSrc}
      </${tagName}>
    `;
  };

  const getModuleDetailsSrc = ({item, focusVersionSpec}) => {
    const {id, name, displayName, version, versions, description, readme, page, metadata: {exists}} = item;
    const focus = focusVersionSpec ? (id === focusVersionSpec.tagId) : false;
    const imgSrc = (() => {
      if (exists) {
        return vectorPolygonImgSrc;
      } else {
        return packageVariantClosedSrc;
      }
    })();

    const headerSrc = `\
      <div style="display: flex; height: 100px; justify-content: center; align-items: center;">
        <img src="${creatureUtils.makeStaticCreature('module:' + name)}" width="80" height="80" style="width: 80px; height: 80px; margin: 10px; image-rendering: -moz-crisp-edges; image-rendering: pixelated;" />
        <div style="display: flex; margin-right: auto; flex-direction: column; justify-content: center;">
          <div style="display: flex; margin-bottom: 10px; align-items: flex-end; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            <div style="margin-right: 15px; font-size: 28px; font-weight: 400;">${displayName}</div>
            <div style="font-size: 16px; font-weight: 400;">${description}</div>
          </div>
          ${!focus ?
            `<a style="display: flex; height: 30px; margin-right: auto; padding: 0 10px; border: 2px solid #333; font-size: 16px; font-weight: 400; text-decoration: none; align-items: center; box-sizing: border-box;" onclick="module:focusVersion:${id}">
              <div style="text-overflow: ellipsis; margin-right: 10px; overflow: hidden;">${version}</div>
              <div style="display: flex; font-size: 13px; justify-content: center;">▼</div>
            </a>`
          :
            `<div style="position: relative; height: 30px; margin-right: auto; z-index: 1;">
              <div style="display: flex; flex-direction: column; background-color: #FFF;">
                ${versions.map((versionOption, i, a) => {
                  const style = (() => {
                    let result = '';
                    if (i !== 0) {
                      result += 'padding-top: 2px; border-top: 0;';
                    }
                    if (i !== (a.length - 1)) {
                      result += 'padding-bottom: 2px; border-bottom: 0;';
                    }
                    if (versionOption === version) {
                      result += 'background-color: #EEE;';
                    }
                    return result;
                  })();
                  return `<a style="display: flex; height: 30px; padding: 0 10px; border: 2px solid #333; ${style}; font-size: 16px; text-decoration: none; align-items: center; text-overflow: ellipsis; overflow: hidden; box-sizing: border-box;" onclick="module:setVersion:${id}:${versionOption}">
                    ${versionOption}
                  </a>`;
                }).join('\n')}
              </div>
            </div>`
          }
        </div>
        <a style="display: flex; width: 80px; justify-content: center; align-items: center;" onclick="module:reinstall:${id}">
          <img src="${autorenewImgSrc}" width="40" height="40">
        </a>
        <a style="display: flex; width: 80px; justify-content: center; align-items: center;" onclick="module:link:${id}" onmousedown="module:link:${id}">
          <img src="${imgSrc}" width="40" height="40">
        </a>
        <a style="display: flex; width: 80px; justify-content: center; align-items: center;" onclick="module:close:${id}">
          <img src="${closeBoxOutlineSrc}" width="40" height="40">
        </a>
      </div>
    `;
    const bodySrc = (() => {
      const leftSrc = `\
        <div style="position: relative; width: ${DETAILS_WIDTH - 250}px; top: ${-page * (DETAILS_HEIGHT - 100)}px; padding: 0 30px; box-sizing: border-box;">
          ${readme ?
            readme
          :
            `<div style="padding: 15px; background-color: #EEE; border-radius: 5px; font-weight: 400;">No readme</div>`
          }
        </div>
      `;
      const rightSrc = (() => {
        const showUp = page !== 0;
        const showDown = Boolean(readme);

        return `\
          <div style="display: flex; width: 250px; padding-top: 20px; flex-direction: column; box-sizing: border-box;">
            <a style="position: relative; display: flex; margin: 0 30px; margin-bottom: auto; border: 1px solid; border-radius: 5px; text-decoration: none; justify-content: center; align-items: center; ${showUp ? '' : 'visibility: hidden;'}" onclick="module:up:${id}">
              ${upImg}
            </a>
            <a style="position: relative; display: flex; margin: 0 30px; margin-bottom: 20px; border: 1px solid; border-radius: 5px; text-decoration: none; justify-content: center; align-items: center; ${showDown ? '' : 'visibility: hidden;'}" onclick="module:down:${id}">
              ${downImg}
            </a>
          </div>
        `;
      })();

      return `\
        <div style="display: flex; height: ${DETAILS_HEIGHT - 100}px; overflow: hidden;">
          ${leftSrc}
          ${rightSrc}
        </div>
      `;
    })();

    return `\
      <div style="display: block; width: ${DETAILS_WIDTH}px; height: ${DETAILS_HEIGHT}px; background-color: #FFF; text-decoration: none;">
        ${headerSrc}
        ${bodySrc}
      </div>
    `;
  };

  const getEntitySrc = ({item}) => {
    const {id, name, displayName, instancing, metadata: {isStatic}} = item;
    const tagName = isStatic ? 'a' : 'div';

    const headerSrc = `\
      <div style="position: relative; display: flex; width: ${WIDTH}px; height: ${HEIGHT}px; background-color: #EEE; padding-left: 30px; text-decoration: none; overflow: hidden; box-sizing: border-box;">
        <div style="display: flex; position: absolute; top: 60px; left: -60px; width: ${HEIGHT}px; height: 30px; background-color: #03A9F4; justify-content: center; align-items: center; box-sizing: border-box; transform: rotate(-90deg);">Entity</div>
        <div style="display: flex; flex-grow: 1; flex-direction: column;">
          <div style="display: flex; flex-grow: 1;">
            <img src="${creatureUtils.makeStaticCreature('entity:' + name)}" width="80" height="80" style="width: 80px; height: 80px; margin: 10px; image-rendering: -moz-crisp-edges; image-rendering: pixelated;" />
            <h1 style="display: flex; max-width: ${WIDTH - (30) - (80 + (10 * 2) - (30 + (15 * 2)))}px; flex-grow: 1; margin: 10px 0; font-size: 28px; font-weight: 400; line-height: 1.4; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${displayName}</h1>
          </div>
          ${!isStatic ? `<a style="display: inline-flex; margin-left: 20px; margin-right: auto; margin-bottom: 10px; padding: 10px 30px; border: 2px solid; font-weight: 400; text-decoration: none;" onclick="entity:addAttribute:${id}">Add Link</a>` : ''}
        </div>
        ${!isStatic ? `<a style="display: flex; margin-bottom: auto; padding: 15px; text-decoration: none; justify-content: center; align-items: center;" onclick="tag:remove:${id}">
          <img src="${closeOutlineSrc}" width="30" height="30" />
        </a>` : ''}
      </div>
    `;

    return `\
      <${tagName} style="display: block; text-decoration: none;" onclick="entity:main:${id}">
        ${headerSrc}
      </${tagName}>
    `;
  };

  const getAttributeSrc = ({item, attribute, inputText, inputValue, focus, transform}) => {
    const {id} = item;
    const {name, type, value, min, max, step, options} = attribute;

    const headerSrc = `\
      <div style="display: flex; font-size: 28px; line-height: 2;">
        <div style="margin-left: 20px; margin-right: auto; font-weight: 400;">${name}</div>
        <a style="display: flex; padding: 0 15px; text-decoration: none; justify-content: center; align-items: center;" onclick="attribute:remove:${id}:${name}">
          <img src="${closeOutlineSrc}" width="30" height="30" />
        </a>
      </div>
    `;
    const bodySrc = `\
      ${getAttributeInputSrc(id, name, type, value, min, max, step, options, inputText, inputValue, focus, transform)}
    `;

    return `\
      <div style="width: ${WIDTH}px; height: ${HEIGHT}px; background-color: #EEE; border-left: 5px solid; box-sizing: border-box;">
        <div style="position: relative; display: flex; width: inherit; height: inherit; border-bottom: 2px solid #CCC; text-decoration: none; flex-direction: column; box-sizing: border-box;">
          ${headerSrc}
          ${bodySrc}
        </div>
      </div>
    `;
  };

  const getAttributeInputSrc = (id, name, type, value, min, max, step, options, inputText, inputValue, focus, transform) => {
    const focusValue = !focus ? value : typeUtils.castValueStringToValue(inputText, type, min, max, step, options);

    switch (type) {
      case 'matrix': {
        return '';
      }
      case 'vector': {
        if (min === undefined) {
          min = 0;
        }
        if (max === undefined) {
          max = 10;
        }

        let result = '';

        AXES.forEach((axis, index) => {
          const axisValue = value[index];
          const factor = (axisValue - min) / (max - min);

          result += `\
            <div style="display: flex; height: 30px; margin: 2px 20px;">
              <a style="display: flex; position: relative; height: inherit; width: ${WIDTH - (20 * 2) - 50}px;" onclick="attribute:${id}:${name}:${axis}:tweak" onmousedown="attribute:${id}:${name}:${axis}:tweak">
                <div style="position: absolute; top: 14px; left: 0; right: 0; height: 2px; background-color: #CCC;">
                  <div style="position: absolute; top: -9px; bottom: -9px; left: ${factor * 100}%; margin-left: -1px; width: 2px; background-color: #F00;"></div>
                </div>
              </a>
              <div style="display: flex; width: 50px; height: inherit; color: #000; font-size: 20px; justify-content: center; align-items: center;">${axisValue}</div>
            </div>
          `;
        });

        return result;
      }
      case 'text': {
        return `\
          <a style="display: flex; position: relative; margin: 20px; border: 2px solid #333; font-size: 24px; text-decoration: none; align-items: center; overflow: hidden; box-sizing: border-box;" onclick="attribute:${id}:${name}:focus" onmousedown="attribute:${id}:${name}:focus">
            ${focus ? `<div style="position: absolute; width: 2px; top: 0; bottom: 0; left: ${inputValue}px; background-color: #333;"></div>` : ''}
            <div>${focusValue}</div>
          </a>
        `;
      }
      case 'number': {
        if (min === undefined) {
          min = 0;
        }
        if (max === undefined) {
          max = 10;
        }

        const factor = focusValue !== null ? ((focusValue - min) / (max - min)) : min;
        const string = focusValue !== null ? String(focusValue) : inputText;

        return `\
          <a style="display: flex; position: relative; margin: 5px 20px; height: 40px;" onclick="attribute:${id}:${name}:tweak" onmousedown="attribute:${id}:${name}:tweak">
            <div style="position: absolute; top: 19px; left: 0; right: 0; height: 2px; background-color: #CCC;">
              <div style="position: absolute; top: -14px; bottom: -14px; left: ${factor * 100}%; margin-left: -1px; width: 2px; background-color: #F00;"></div>
            </div>
          </a>
          <div style="display: flex; justify-content: center; text-align: center;">
            <a style="display: flex; position: relative; width: 100px; height: 40px; border: 2px solid; font-size: 24px; font-weight: 400; text-decoration: none; overflow: hidden; box-sizing: border-box;" onclick="attribute:${id}:${name}:focus" onmousedown="attribute:${id}:${name}:focus">
              ${focus ? `<div style="position: absolute; width: 2px; top: 0; bottom: 0; left: ${inputValue}px; background-color: #333;"></div>` : ''}
              <div>${string}</div>
            </a>
          </div>
        `;
      }
      case 'select': {
        if (options === undefined) {
          options = [''];
        }

        if (!focus) {
          return `\
            <a style="display: flex; height: 40px; margin: 20px; padding: 5px; border: 2px solid #333; font-size: 20px; text-decoration: none; align-items: center; box-sizing: border-box;" onclick="attribute:${id}:${name}:focus" onmousedown="attribute:${id}:${name}:focus">
              <div style="text-overflow: ellipsis; flex-grow: 1; overflow: hidden;">${focusValue}</div>
              <div style="display: flex; padding: 0 10px; font-size: 16px; justify-content: center;">▼</div>
            </a>
          `;
        } else {
          return `\
            <div style="position: relative; height: 40px; margin: 20px; z-index: 1;">
              <div style="display: flex; flex-direction: column; background-color: #FFF;">
                ${options.map((option, i, a) => {
                  const style = (() => {
                    let result = '';
                    if (i !== 0) {
                      result += 'padding-top: 2px; border-top: 0;';
                    }
                    if (i !== (a.length - 1)) {
                      result += 'padding-bottom: 2px; border-bottom: 0;';
                    }
                    if (option === focusValue) {
                      result += 'background-color: #EEE;';
                    }
                    return result;
                  })();
                  return `<a style="display: flex; height: 40px; padding: 5px; border: 2px solid #333; ${style}; font-size: 20px; text-decoration: none; align-items: center; text-overflow: ellipsis; overflow: hidden; box-sizing: border-box;" onclick="attribute:${id}:${name}:set:${option}" onmousedown="attribute:${id}:${name}:set:${option}">
                    ${option}
                  </a>`;
                }).join('\n')}
              </div>
            </div>
          `;
        }
      }
      case 'color': {
        const color = focusValue !== null ? focusValue : '#CCC';
        const string = focusValue !== null ? focusValue : inputText;

        return `\
          <div style="display: flex; padding: 20px; justify-content: center; align-items: center;">
            <a style="display: block; width: 40px; height: 40px; margin-right: 10px; background-color: ${color};" onclick="attribute:${id}:${name}:pick"></a>
            <a style="display: flex; position: relative; height: 40px; border: 2px solid #333; font-size: 24px; text-decoration: none; flex-grow: 1; align-items: center; overflow: hidden; box-sizing: border-box;" onclick="attribute:${id}:${name}:focus" onmousedown="attribute:${id}:${name}:focus">
              ${focus ? `<div style="position: absolute; width: 2px; top: 0; bottom: 10px; left: ${inputValue}px; background-color: #333;"></div>` : ''}
              <div>${string}</div>
            </a>
          </div>
        `;
      }
      case 'checkbox': {
        return `\
          <div style="display: flex; justify-content: center; align-items: center;">
            ${focusValue ?
              `<a style="display: flex; width: 80px; height: 80px; justify-content: center; align-items: center;" onclick="attribute:${id}:${name}:toggle" onmousedown="attribute:${id}:${name}:toggle">
                <div style="display: flex; width: ${(40 * 2) - (3 * 2)}px; height: 40px; padding: 2px; border: 4px solid #333; justify-content: flex-end; align-items: center; box-sizing: border-box;">
                  <div style="width: ${40 - ((4 * 2) + (2 * 2))}px; height: ${40 - ((4 * 2) + (2 * 2))}px; background-color: #333;"></div>
                </div>
              </a>`
            :
              `<a style="display: flex; width: 80px; height: 80px; justify-content: center; align-items: center;" onclick="attribute:${id}:${name}:toggle" onmousedown="attribute:${id}:${name}:toggle">
                <div style="display: flex; width: ${(40 * 2) - (3 * 2)}px; height: 40px; padding: 2px; border: 4px solid #CCC; justify-content: flex-start; align-items: center; box-sizing: border-box;">
                  <div style="width: ${40 - ((4 * 2) + (2 * 2))}px; height: ${40 - ((4 * 2) + (2 * 2))}px; background-color: #CCC;"></div>
                </div>
              </a>`
            }
          </div>
        `;
      }
      case 'file': {
        return `\
          <div style="display: flex; width: ${WIDTH}px;">
            <div style="display: flex; position: relative; margin: 20px; font-size: 24px; align-items: center; flex-grow: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${focusValue}</div>
            <a style="display: flex; width: 80px; justify-content: center; align-items: center;" onmousedown="attribute:${id}:${name}:link">
              <img src="${linkImgSrc}" width="50" height="50" style="margin: 10px; image-rendering: pixelated;" />
            </a>
          </div>
        `;
      }
      case 'json': {
        return '';
      }
      default: {
        return '';
      }
    }
  };

  const getFileSrc = ({item, mode, open}) => {
    const {id, name, displayName, mimeType, instancing, paused, value} = item;

    const headerSrc = `\
      <div style="position: relative; display: flex; width: ${WIDTH}px; height: ${HEIGHT}px; background-color: #EEE; padding-left: 30px; text-decoration: none; overflow: hidden; box-sizing: border-box; ${instancing ? 'filter: brightness(75%);' : ''}">
        <div style="display: flex; position: absolute; top: 60px; left: -60px; width: ${HEIGHT}px; height: 30px; background-color: #E91E63; justify-content: center; align-items: center; box-sizing: border-box; transform: rotate(-90deg);">File</div>
        <div style="display: flex; flex-grow: 1; flex-direction: column;">
          <div style="display: flex; flex-grow: 1;">
            <img src="${creatureUtils.makeStaticCreature('file:' + displayName)}" width="80" height="80" style="margin: 10px; image-rendering: -moz-crisp-edges; image-rendering: pixelated;" />
            <div style="display: flex; max-width: ${WIDTH - (30) - (80 + (10 * 2)) - (30 + (15 * 2))}px; flex-grow: 1; flex-direction: column; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">
              <h1 style="margin: 0; margin-top: 10px; font-size: 28px; font-weight: 400; line-height: 1.4;">${name}</h1>
              <p style="margin: 0; margin-bottom: 10px; font-size: 15px; line-height: 1.4;">${mimeType}</p>
            </div>
          </div>
          <div style="display: flex; margin-bottom: 10px;">
            ${!open ?
              `<a style="display: flex; margin-left: 20px; margin-right: 20px; padding: 10px 30px; border: 2px solid; font-weight: 400; text-decoration: none;" onclick="tag:open:${id}">Preview</a>`
            :
              `<a style="display: flex; margin-left: 20px; margin-right: 20px; padding: 10px 30px; border: 2px solid transparent; background-color: #000; color: #FFF; font-weight: 400; text-decoration: none;" onclick="tag:close:${id}">Preview</a>`
            }
            <a style="display: flex; margin-right: auto; padding: 10px 30px; border: 2px solid; font-weight: 400; text-decoration: none;" onclick="tag:download:${id}">Download</a>
          </div>
        </div>
        <div style="display: flex;">
          <a style="display: flex; margin-bottom: auto; padding: 15px; text-decoration: none; justify-content: center; align-items: center;" onclick="tag:remove:${id}">
            <img src="${closeOutlineSrc}" width="30" height="30" />
          </a>
        </div>
      </div>
    `;
    const bodySrc = (() => {
      const _getFramePreviewSrc = (text = '') => `\
        <div style="position: relative; display: flex; width: ${OPEN_WIDTH}px; height: ${OPEN_HEIGHT - HEIGHT}px; padding: 20px; background-color: #EEE; font-size: 28px; font-weight: 400; justify-content: center; align-items: center; overflow: hidden; box-sizing: border-box;">${text}</div>
      `;

      if (open) {
        if (mode === 'image') {
          return _getFramePreviewSrc();
        } else if (mode === 'audio' || mode === 'video') {
          const mainSrc = (() => {
            if (mode === 'audio') {
              if (paused) {
                return `\
                  <a style="display: flex; background-color: #FFF; flex-grow: 1; justify-content: center; align-items: center;" onclick="media:play:${id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 79.374997 79.374985">
                      <path d="M21.167 79.375l39.687-39.687L21.167 0v79.375"/>
                    </svg>
                  </a>
                `;
              } else {
                return `\
                  <a style="display: flex;  background-color: #FFF; flex-grow: 1; justify-content: center; align-items: center;" onclick="media:pause:${id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 79.374997 79.374985">
                      <path d="M13.23 0v79.375h18.52V0H13.23M47.625 0v79.375h18.52V0z"/>
                    </svg>
                  </a>
                `;
              }
            } else if (mode === 'video') {
              if (paused) {
                return `\
                  <a style="display: flex; flex-grow: 1; justify-content: center; align-items: center;" onclick="media:play:${id}">
                    <div></div>
                  </a>
                `;
              } else  {
                return `\
                  <a style="display: flex; flex-grow: 1; justify-content: center; align-items: center;" onclick="media:pause:${id}">
                    <div></div>
                  </a>
                `;
              }
            } else {
              return '';
            }
          })();
          const barSrc = `\
            <a style="display: flex; width: ${WIDTH}px; height: 100px; background-color: #FFF;" onclick="media:seek:${id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="1" height="16" viewBox="0 0 0.26458333 4.2333333" style="position: absolute; height: 100px; width: ${100 * (1 / 16)}px; margin-left: ${-(100 * (1 / 16) / 2)}px; left: ${value * 100}%;">
                <path d="M0 0v4.233h.265V0H0" fill="#f44336"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 8.4666666 8.4666666" preserveAspectRatio="none" style="width: ${OPEN_WIDTH}px; height: 100px;">
                <path d="M0 3.97v.528h8.467v-.53H0" fill="#ccc"/>
              </svg>
            </div>
          `;

          return `\
            <div style="display: flex; height: ${OPEN_HEIGHT - HEIGHT}px; flex-direction: column;">
              ${mainSrc}
              ${barSrc}
            </div>
          `;
        } else if (mode === 'model') {
          return _getFramePreviewSrc();
        } else {
          return _getFramePreviewSrc('Unknown file type');
        }
      } else {
        return '';
      }
    })();

    return `\
      <div>
        ${headerSrc}
        ${bodySrc}
      </div>
    `;
  };
  const _normalizeAssetName = name => name === 'BTC' ? CREDIT_ASSET_NAME : name;
  const _commaize = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const _commaizeAssetQuantity = (asset, quantity) => {
    if (asset === 'BTC') {
      return quantity.toFixed(8).replace(/(\..*?)0+$/, '$1').replace(/\.$/, '');
    } else {
      return _commaize(quantity);
    }
  };
  const getAssetSrc = ({item}) => {
    const {id, name, displayName, quantity, metadata: {isStatic, isSub}} = item;
    const quantityString = _commaizeAssetQuantity(name, quantity);
    const tagName = isStatic ? 'a' : 'div';
    const linkTagName = isStatic ? 'div' : 'a';
    const onclick = (() => {
      if (!isSub) {
        return `asset:main:${id}`;
      } else {
        return `asset:bill:${id}:${quantity}`;
      }
    })();

    return `\
      <${tagName} style="position: relative; display: flex; width: ${WIDTH}px; height: ${HEIGHT}px; background-color: #EEE; padding-left: 30px; padding-right: 80px; text-decoration: none; overflow: hidden; box-sizing: border-box;" onclick="${onclick}">
        <div style="display: flex; position: absolute; top: 60px; left: -60px; width: ${HEIGHT}px; height: 30px; background-color: #FFC107; justify-content: center; align-items: center; box-sizing: border-box; transform: rotate(-90deg);">Asset</div>
        <div style="display: flex; margin-left: -30px; margin-right: -80px; padding-left: 30px; padding-right: 80px; flex-grow: 1; flex-direction: column; box-sizing: border-box;">
          <div style="display: flex; flex-grow: 1;">
            <img src="${creatureUtils.makeStaticCreature('asset:' + displayName)}" width="80" height="80" style="margin: 10px; image-rendering: -moz-crisp-edges; image-rendering: pixelated;" />
            <div style="display: flex; max-width: ${WIDTH - (30) - (80 + (10 * 2)) - (80)}px; flex-grow: 1; flex-direction: column; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">
              <h1 style="margin: 0; margin-top: 10px; font-size: 28px; font-weight: 400; line-height: 1.4; text-overflow: ellipsis; overflow: hidden;">${_normalizeAssetName(name)}</h1>
              <div style="display: flex; flex-grow: 1; align-items: center;">
                <div style="padding: 5px 10px; border: 2px solid; font-size: 28px; font-weight: 400;">&#164; ${quantityString}</div>
              </div>
            </div>
          </div>
        </div>
        <${linkTagName} style="display: flex; position: absolute; top: 35px; right: -35px; width: ${HEIGHT}px; height: 80px; background-color: #EEE; border-top: 2px solid; font-size: 22px; font-weight: 400; justify-content: center; align-items: center; box-sizing: border-box; transform: rotate(-90deg);" onclick="asset:claim:${id}">Claim</${linkTagName}>
      </${tagName}>
    `;
  };
  const getAssetDetailsSrc = ({item}) => {
    const {id, name, displayName, quantity} = item;
    const quantityString = _commaizeAssetQuantity(name, quantity);

    return `\
      <div style="display: block; width: ${DETAILS_WIDTH}px; height: ${DETAILS_HEIGHT}px; background-color: #FFF; text-decoration: none;">
        <div style="display: flex; height: 100px; justify-content: center; align-items: center;">
          <img src="${creatureUtils.makeStaticCreature('asset:' + name)}" width="80" height="80" style="width: 80px; height: 80px; margin: 10px; image-rendering: -moz-crisp-edges; image-rendering: pixelated;" />
          <div style="display: flex; height: 80px; margin-bottom: 10px; margin-right: auto; font-size: 24px; font-weight: 400; justify-content: center; align-items: center;">
            <div style="margin-right: 15px;">${_normalizeAssetName(name)}</div>
            <div style="display: flex; justify-content: center; align-items: center;">
              <div style="padding: 5px 10px; border: 2px solid; font-size: 22px;">&#164; ${quantityString}</div>
            </div>
          </div>
          <a style="display: flex; width: 80px; justify-content: center; align-items: center;" onclick="asset:close:${id}">
            <img src="${closeBoxOutlineSrc}" width="40" height="40">
          </a>
        </div>
      </div>
    `;
  };

  return {
    getModuleSrc,
    getModuleDetailsSrc,
    getEntitySrc,
    getAttributeSrc,
    getAttributeInputSrc,
    getFileSrc,
    getAssetSrc,
    getAssetDetailsSrc,
  };
};

module.exports = {
  makeRenderer,
};
