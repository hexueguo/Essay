/**
 * @param url
 * @returns
 */
export const getUrlParams = (url: string): Object => {
  if (!url) {
    return {};
  }
  const keys = url.split('&');
  const obj: Object = {};
  keys.forEach((it) => {
    const val = it.split('=');
    if (val[0]) {
      obj[val[0]] = val[1];
    }
  });
  return obj;
};

/**
 * @param name
 * @param url
 * @returns
 */
export const getUrlParamByName = (name: string, url: string) => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r = url.match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
};

export const getCurrentScript = () => {
  if (document.currentScript) {
    return document.currentScript;
  }

  var currentScript = 'currentScript';
  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function () {
        // IE 8-10 support script readyState
        // IE 11+ support stack trace
        try {
          throw new Error();
        } catch (err) {
          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i = 0,
            stackDetails = /.*at [^(]*\((.*):(.+):(.+)\)$/gi.exec(err.stack),
            scriptLocation = (stackDetails && stackDetails[1]) || false,
            line: any = (stackDetails && stackDetails[2]) || false,
            currentLocation = document.location.href.replace(
              document.location.hash,
              ''
            ),
            pageSource,
            inlineScriptSourceRegExp,
            inlineScriptSource,
            scripts = document.getElementsByTagName('script'); // Live NodeList collection

          if (scriptLocation === currentLocation) {
            pageSource = document.documentElement.outerHTML;
            inlineScriptSourceRegExp = new RegExp(
              '(?:[^\\n]+?\\n){0,' +
                (line - 2) +
                '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*',
              'i'
            );
            inlineScriptSource = pageSource
              .replace(inlineScriptSourceRegExp, '$1')
              .trim();
          }

          for (; i < scripts.length; i++) {
            // If ready state is interactive, return the script tag
            if (scripts[i]['readyState'] === 'interactive') {
              return scripts[i];
            }

            // If src matches, return the script tag
            if (scripts[i].src === scriptLocation) {
              return scripts[i];
            }

            // If inline source matches, return the script tag
            if (
              scriptLocation === currentLocation &&
              scripts[i].innerHTML &&
              scripts[i].innerHTML.trim() === inlineScriptSource
            ) {
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      },
    });
  }
};

/**
 * @param scriptId <script>标签id
 * @param way
 * @returns Object | null
 */
export const getScriptParams = (): Object => {
  const dom_: any = getCurrentScript();
  if (!!dom_) {
    const attrs = dom_.attributes;
    const domAttrs: Object = {};
    Object.keys(attrs).map((it: string) => {
      domAttrs[attrs[it].name] = attrs[it].value;
    });
    // return domAttrs;
    let urlParams: Object = {};
    if (dom_['src']) {
      const url: string = dom_['src'];
      urlParams = getUrlParams(url.split('?')[1]);
    }

    return {
      ...domAttrs,
      ...urlParams,
    };
  }
  return {};
};
