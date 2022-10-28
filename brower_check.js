import { getScriptParams } from './common';

(function () {
  function check() {
    // 移动端不检测兼容性
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return;
    }

    // 获取传参
    const scriptParams = getScriptParams();

    var OLDEST_CHROME_VERSION = scriptParams['chrome_version'] || 85; // 支持的chrome的最低版本
    var OLDEST_IE_VERSION = scriptParams['ie_version'] || 11; // 支持的IE的最低版本
    var REGULAR_TIME_MS = 3600 * 24 * 1 * 1000; // 定期检查提示的时长, 1天(ms)
    var BROWSER_DOWNLOAD_URL =
      scriptParams['download_url'] || 'https://www.google.cn/chrome/';
    var zhText =
      scriptParams['message'] ||
      `抱歉，目前本系统不支持该浏览器，请使用 Google Chrome ${OLDEST_CHROME_VERSION}版本以上的浏览器登录。`;
    var enText =
      scriptParams['message'] ||
      `Sorry, this browser is currently not supported by this system. Please log in with a browser version of Google Chrome ${OLDEST_CHROME_VERSION} or higher.`;

    var WIN_OS = 'Windows';
    var Mac_OS = 'MacOS';
    var UNIX_OS = 'UNIX';
    var Linux_OS = 'Linux';

    /**
     * 弹窗方法
     * @param {*} message
     * @param {*} isZh
     * @returns
     */
    function modal(message, isZh) {
      var texts = isZh
        ? {
            okText: '好的',
            downloadText: '下载地址',
            dayText: '一天后再提醒',
            weekText: '一周后再提醒',
            neverText: '不再提醒',
          }
        : {
            okText: 'Ok',
            downloadText: 'Download',
            dayText: 'Remind one day later',
            weekText: 'Remind in a week',
            neverText: 'No more reminders',
          };

      // element
      var originEl;

      var rootStyle = {
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
        'z-index': 10000,
      };

      var coverStyle = {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
        'z-index': 1,
        'background-color': 'rgba(0, 0, 0, 0.45)',
      };

      var modalContentStyle = {
        position: 'relative',
        top: '50%',
        left: '50%',
        'z-index': 10,
        'background-color': '#fff',
        transform: 'translate(-50%, -50%)',
        width: '520px',
        'max-width': '50%',
        'max-height': '50%',
        'border-radius': '4px',
      };

      var modalContentBodyStyle = {
        padding: '24px',
        'font-size': '14px',
        'line-height': 1.5,
        'word-wrap': 'break-word',
      };

      var modalFooterButtonsStyle = {
        // display: "flex",
        // "align-items": "center",
        // "justify-content": "center",
        position: 'relative',
        left: '30%',
        padding: '8px 0',
      };

      var modalFooterButtonStyle = {
        padding: '4px 16px',
        'line-height': 1.5,
        border: 0,
        'border-radius': '4px',
        cursor: 'pointer',
      };

      var modalTemplate = `<div class="modal_content">
        <div class="modal_content_body">
          <span>${message}</span>
          <a href='${BROWSER_DOWNLOAD_URL}' target="_blank">${texts.downloadText}</a>
        </div>
        <div class="modal_footer_buttons">
          <select id='modal_footer_select' style="border: 1px solid #c9c9c9;border-radius: 2px;background: #ffff;height: 27px;margin-right: 8px;font-size: 14px;padding: 0 4px;">
          <option value='day'>${texts.dayText}</option>
          <option value='week'>${texts.weekText}</option>
          <option value='never'>${texts.neverText}</option>
          </select>
          <button id="modal_footer_buttons_ok" class="modal_footer_button">
          ${texts.okText}
          </button>
        </div>
      </div>`;

      function styleToString(style) {
        var styleNames = Object.keys(style);
        return styleNames
          .map((name) => {
            return `${name}:${style[name]};`;
          })
          .join('');
      }

      function close() {
        document.body.removeChild(originEl);
      }

      var interval = 'day'; // 默认为一天

      function onClickOk(e) {
        e.preventDefault();
        close();
        var time = new Date().getTime();
        if (interval === 'day') {
          REGULAR_TIME_MS = 3600 * 24 * 1 * 1000;
          time += REGULAR_TIME_MS;
        } else if (interval === 'week') {
          REGULAR_TIME_MS = 3600 * 24 * 7 * 1000;
          time += REGULAR_TIME_MS;
        } else if (interval === 'never') {
          time = interval;
        }
        setCheckedTimestamp(time);
      }

      function onSelect(e) {
        e.preventDefault();
        interval = e.target.value;
      }

      function open() {
        originEl = document.createElement('div');
        originEl.setAttribute('style', styleToString(rootStyle));
        originEl.setAttribute('class', 'modal_root');
        originEl.setAttribute('id', 'browser_modal_root');
        originEl.innerHTML = modalTemplate;

        var coverDivEl = document.createElement('div');
        coverDivEl.setAttribute('class', 'modal_cover_content');
        coverDivEl.setAttribute('style', styleToString(coverStyle));
        originEl.appendChild(coverDivEl);

        document.body.appendChild(originEl);

        // add css
        document
          .getElementById('browser_modal_root')
          .getElementsByClassName('modal_content')[0]
          .setAttribute('style', styleToString(modalContentStyle));
        document
          .getElementById('browser_modal_root')
          .getElementsByClassName('modal_content_body')[0]
          .setAttribute('style', styleToString(modalContentBodyStyle));
        document
          .getElementById('browser_modal_root')
          .getElementsByClassName('modal_footer_buttons')[0]
          .setAttribute('style', styleToString(modalFooterButtonsStyle));
        document
          .getElementById('modal_footer_buttons_ok')
          .setAttribute('style', styleToString(modalFooterButtonStyle));
        document
          .getElementById('modal_footer_buttons_ok')
          .addEventListener('click', onClickOk);
        document
          .getElementById('modal_footer_select')
          .addEventListener('change', onSelect);
      }

      if (document.body) {
        open();
      }

      return {
        open,
        close,
      };
    }

    /**
     * 浏览器版本检测, 返回浏览器的名称和版本
     * @returns {Object}
     *  {
     *     name: ["IE" | "Chrome" | "Opera" | "Firefox" | "Edge(Chromium)"]
     *     version: {String} // "84"
     *  }
     */
    function getBrowser() {
      var ua = navigator.userAgent,
        tem,
        M =
          ua.match(
            /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
          ) || [];
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: tem[1] || '' };
      }
      if (M[1] === 'Chrome') {
        tem = ua.match(/\bEdg\/(\d+)/);
        if (tem != null) {
          return { name: 'Edge(Chromium)', version: tem[1] };
        }
        tem = ua.match(/\bOPR\/(\d+)/);
        if (tem != null) {
          return { name: 'Opera', version: tem[1] };
        }
      }
      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
      if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
      }
      return {
        name: M[0],
        version: M[1],
      };
    }

    /**
     * 获取操作系统的类型
     * @returns {String} OSName
     */
    function getOperatingSystem() {
      var OSName = 'Unknown OS';
      if (navigator.appVersion.indexOf('Win') != -1) OSName = WIN_OS;
      if (navigator.appVersion.indexOf('Mac') != -1) OSName = Mac_OS;
      if (navigator.appVersion.indexOf('X11') != -1) OSName = UNIX_OS;
      if (navigator.appVersion.indexOf('Linux') != -1) OSName = Linux_OS;
      return OSName;
    }

    /**
     * 获取语言类型, 中文则返回 true, 否则返回 false（默认中文）
     * @returns {boolean} isZh
     */
    function isZhLang() {
      let isZh = true;
      if (scriptParams['language'] === 'zh') {
        isZh = true;
      } else if (scriptParams['language'] === 'en') {
        isZh = false;
      }
      return isZh;
    }

    // 设置下一次时间
    function setCheckedTimestamp(value) {
      localStorage.setItem('next_time_of_browser_version_notice', value);
    }

    /**
     * 检查Chrome的版本, 对于不支持的浏览器, 进行提示
     * @param {String} OSName 操作系统类型
     * @param {String} browserName 浏览器类型
     * @param {String} browserVersion 浏览器版本
     */
    function checkBrowserRegularly(OSName, browserName, browserVersion) {
      // 必须等body初始化完成后，再进行兼容性检查，从而保证能够展示modal
      if (!document.body) {
        return;
      }
      // 语言
      var isZh = isZhLang();

      // 下次检查的时间
      var nextCheckDate = localStorage.getItem(
        'next_time_of_browser_version_notice'
      );
      // 判断是否需要检查
      if (
        nextCheckDate === 'never' || // 永远不再检查
        (nextCheckDate && nextCheckDate - new Date().getTime() > 0)
      ) {
        return;
      }

      var message = isZh ? zhText : enText;

      if (OSName === WIN_OS) {
        // windows系统下可跳转到下载chrome的地址
        switch (browserName) {
          case 'chrome':
            if (browserVersion < OLDEST_CHROME_VERSION) {
              modal(message, isZh);
            }
            break;

          case 'ie':
          case 'msie':
            if (browserVersion <= OLDEST_IE_VERSION) {
              modal(message, isZh);
            }
            break;

          default:
            modal(message, isZh);
        }
      } else {
        // 其他操作系统下只提示用户使用或升级chrome
        switch (browserName) {
          case 'chrome':
            if (browserVersion < OLDEST_CHROME_VERSION) {
              modal(message, isZh);
            }
            break;

          default:
            modal(message, isZh);
        }
      }

      // 设置一下次检查的时间戳(ms)
      setCheckedTimestamp(new Date().getTime() + REGULAR_TIME_MS);
    }

    // ************************************************************** //

    var browserVersionInfo = getBrowser();
    var browserVersion = Number(browserVersionInfo.version);
    var browserName = browserVersionInfo.name.toLowerCase();
    var OSName = getOperatingSystem();
    checkBrowserRegularly(OSName, browserName, browserVersion);
  }
  try {
    check();
  } catch (error) {
    console.log(error);
    alert(
      '抱歉，目前本系统不支持该浏览器，请使用 Google Chrome 85版本以上的浏览器登录 \n Sorry, this browser is currently not supported by this system. Please log in with a browser version of Google Chrome 85 or higher'
    );
  }
})();
