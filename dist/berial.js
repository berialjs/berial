(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.berial = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function error(trigger, msg) {
        if (typeof trigger === 'string')
            msg = trigger;
        if (!trigger)
            return;
        throw new Error(`[Berial: Error]: ${msg}`);
    }
    function request(url, option) {
        if (!window.fetch) {
            error("It looks like that your browser doesn't support fetch. Polyfill is needed before you use it.");
        }
<<<<<<< HEAD
        return fetch(url, Object.assign({ mode: 'cors' }, option)).then((res) => res.text());
=======
        return fetch(url, Object.assign({ mode: 'cors' }, option))
            .then((res) => res.text())
            .then((data) => data);
>>>>>>> 663fd3712822f0516f12306713f5aa622810bbf9
    }
    function lifecycleCheck(lifecycle) {
        const definedLifecycles = new Map();
        for (const item in lifecycle) {
            definedLifecycles.set(item, true);
        }
        if (!definedLifecycles.has('bootstrap')) {
            error(true, `It looks like that you didn't export the lifecycle hook [bootstrap], which would cause a mistake.`);
        }
        if (!definedLifecycles.has('mount')) {
            error(true, `It looks like that you didn't export the lifecycle hook [mount], which would cause a big mistake.`);
        }
        if (!definedLifecycles.has('unmount')) {
            error(true, `It looks like that you didn't export the lifecycle hook [unmount], which would cause a mistake.`);
        }
    }

    function loadSandbox(host) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawWindow = window;
            const shadowRoot = patchShadowDOM(host.shadowRoot);
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const iframe = (yield loadIframe());
                const proxy = new Proxy(iframe.contentWindow, {
                    get(target, key) {
                        switch (key) {
                            case 'document':
                                return shadowRoot;
                            case 'globalStore':
                                return getGlobalStore();
                            default:
                                return target[key] || rawWindow[key];
                        }
                    },
                    set(target, key, val) {
                        target[key] = val;
                        return true;
                    }
                });
                resolve(proxy);
            }));
        });
    }
    function loadIframe() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const iframe = document.createElement('iframe');
                iframe.style.cssText =
                    'position: absolute; top: -20000px; width: 1px; height: 1px;';
                document.body.append(iframe);
                iframe.onload = () => resolve(iframe);
            });
        });
    }
<<<<<<< HEAD
    function patchShadowDOM(shadowRoot) {
        return new Proxy(shadowRoot, {
=======
    function patchShadowDOM(host) {
        return new Proxy(host.shadowRoot, {
>>>>>>> 663fd3712822f0516f12306713f5aa622810bbf9
            get(target, key) {
                return target[key] || document[key];
            },
            set(target, key, val) {
                target[key] = val;
                return true;
            }
        });
    }

<<<<<<< HEAD
    const MATCH_ANY_OR_NO_PROPERTY = /["'=\w\s/]*/;
    const SCRIPT_URL_RE = new RegExp('<\\s*script' +
        MATCH_ANY_OR_NO_PROPERTY.source +
        '(?:src="(.+?)")' +
        MATCH_ANY_OR_NO_PROPERTY.source +
        '(?:\\/>|>[\\s]*<\\s*/script>)?', 'g');
    const SCRIPT_CONTENT_RE = new RegExp('<\\s*script' +
        MATCH_ANY_OR_NO_PROPERTY.source +
        '>([\\w\\W]+?)<\\s*/script>', 'g');
    const MATCH_NONE_QUOTE_MARK = /[^"]/;
    const CSS_URL_RE = new RegExp('<\\s*link[^>]*' +
        'href="(' +
        MATCH_NONE_QUOTE_MARK.source +
        '+.css' +
        MATCH_NONE_QUOTE_MARK.source +
        '*)"' +
        MATCH_ANY_OR_NO_PROPERTY.source +
        '>(?:\\s*<\\s*\\/link>)?', 'g');
    const STYLE_RE = /<\s*style\s*>([^<]*)<\s*\/style>/g;
    const BODY_CONTENT_RE = /<\s*body[^>]*>([\w\W]*)<\s*\/body>/;
    const SCRIPT_ANY_RE = /<\s*script[^>]*>[\s\S]*?(<\s*\/script[^>]*>)/g;
    const TEST_URL = /^(?:https?):\/\/[-a-zA-Z0-9.]+/;
    const REPLACED_BY_BERIAL = 'Script replaced by Berial.';
=======
    const ANY_OR_NO_PROPERTY = /["'=\w\s]*/;
    const SCRIPT_URL_RE = new RegExp('<script' +
        ANY_OR_NO_PROPERTY.source +
        '(?:src="(.+?)")' +
        ANY_OR_NO_PROPERTY.source +
        '(?:\\/>|>[\\s]*<\\/script>)?', 'g');
    const SCRIPT_CONTENT_RE = new RegExp('<script' + ANY_OR_NO_PROPERTY.source + '>([\\w\\W]+?)</script>', 'g');
    // const REPLACED_BY_BERIAL = 'Script replaced by Berial.'
    // const SCRIPT_ANY_RE = /<script[^>]*>[\s\S]*?(<\s*\/script[^>]*>)/g
>>>>>>> 663fd3712822f0516f12306713f5aa622810bbf9
    function importHtml(app) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield request(app.entry);
            const proxy = (yield loadSandbox(app.host));
<<<<<<< HEAD
            const lifecycle = yield loadScript(template, proxy, app.name);
            const styleNodes = yield loadCSS(template);
            const bodyNode = loadBody(template);
            return { lifecycle, styleNodes, bodyNode };
=======
            return yield loadScript(template, proxy, app.name);
>>>>>>> 663fd3712822f0516f12306713f5aa622810bbf9
        });
    }
    function loadScript(template, global, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const { scriptURLs, scripts } = parseScript(template);
            const fetchedScripts = yield Promise.all(scriptURLs.map((url) => request(url)));
            const scriptsToLoad = fetchedScripts.concat(scripts);
            let bootstrap = [];
            let unmount = [];
            let mount = [];
            let update = [];
            scriptsToLoad.forEach((script) => {
                const lifecycles = runScript(script, global, name);
                bootstrap = [...bootstrap, lifecycles.bootstrap];
                mount = [...mount, lifecycles.mount];
                unmount = [...unmount, lifecycles.unmount];
                update = [...update, lifecycles.update];
            });
            return { bootstrap, unmount, mount, update };
        });
    }
    function parseScript(template) {
        const scriptURLs = [];
        const scripts = [];
        let match;
        while ((match = SCRIPT_URL_RE.exec(template))) {
<<<<<<< HEAD
            let captured = match[1].trim();
            if (!captured)
                continue;
            if (!TEST_URL.test(captured)) {
                captured = window.location.origin + captured;
            }
=======
            const captured = match[1].trim();
            if (!captured)
                continue;
>>>>>>> 663fd3712822f0516f12306713f5aa622810bbf9
            scriptURLs.push(captured);
        }
        while ((match = SCRIPT_CONTENT_RE.exec(template))) {
            const captured = match[1].trim();
            if (!captured)
                continue;
            scripts.push(captured);
        }
        return {
            scriptURLs,
            scripts
        };
    }
    function runScript(script, global, umdName) {
        let bootstrap, mount, unmount, update;
        eval(`(function(window) { 
    ${script};
    bootstrap = window[${umdName}].bootstrap;
    mount = window[${umdName}].mount;
    unmount = window[${umdName}].unmount;
    update = window[${umdName}].update;
  }).bind(global)(global)`);
        // @ts-ignore
        return { bootstrap, mount, unmount, update };
    }
<<<<<<< HEAD
    function loadCSS(template) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cssURLs, styles } = parseCSS(template);
            const fetchedStyles = yield Promise.all(cssURLs.map((url) => request(url)));
            return toStyleNodes(fetchedStyles.concat(styles));
            function toStyleNodes(styles) {
                return styles.map((style) => {
                    const styleNode = document.createElement('style');
                    styleNode.appendChild(document.createTextNode(style));
                    return styleNode;
                });
            }
        });
    }
    function parseCSS(template) {
        const cssURLs = [];
        const styles = [];
        let match;
        while ((match = CSS_URL_RE.exec(template))) {
            let captured = match[1].trim();
            if (!captured)
                continue;
            if (!TEST_URL.test(captured)) {
                captured = window.location.origin + captured;
            }
            cssURLs.push(captured);
        }
        while ((match = STYLE_RE.exec(template))) {
            const captured = match[1].trim();
            if (!captured)
                continue;
            styles.push(captured);
        }
        return {
            cssURLs,
            styles
        };
    }
    function loadBody(template) {
        var _a, _b;
        let bodyContent = (_b = (_a = template.match(BODY_CONTENT_RE)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '';
        bodyContent = bodyContent.replace(SCRIPT_ANY_RE, scriptReplacer);
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(bodyContent));
        return div;
        function scriptReplacer(substring) {
            const matchedURL = SCRIPT_URL_RE.exec(substring);
            if (matchedURL) {
                return `<!-- ${REPLACED_BY_BERIAL} Original script url: ${matchedURL[1]} -->`;
            }
            return `<!-- ${REPLACED_BY_BERIAL} Original script: inline script -->`;
        }
    }
=======
>>>>>>> 663fd3712822f0516f12306713f5aa622810bbf9

    let isUpdating = false;
    function reactiveStore(store) {
        return new Proxy(store, {
            get(target, key) {
                return Reflect.get(target, key);
            },
            set(target, key, value) {
                Reflect.set(target, key, value);
                isUpdating = true;
                batchUpdate(reactiveStore);
                return true;
            }
        });
    }
    function batchUpdate(store) {
        if (isUpdating)
            return;
        const apps = getApps();
        Promise.resolve().then(() => {
            isUpdating = false;
<<<<<<< HEAD
            apps.forEach((app) => __awaiter(this, void 0, void 0, function* () {
                app.status = Status.UPDATING;
                yield app.update(store, apps);
                app.status = Status.UPDATED;
            }));
=======
            apps.forEach((app) => {
                app.status = Status.UPDATING;
                app.update(store, apps);
                app.status = Status.UPDATED;
            });
>>>>>>> 663fd3712822f0516f12306713f5aa622810bbf9
        });
    }

    var Status;
    (function (Status) {
        Status["NOT_LOADED"] = "NOT_LOADED";
        Status["LOADING"] = "LOADING";
        Status["NOT_BOOTSTRAPPED"] = "NOT_BOOTSTRAPPED";
        Status["BOOTSTRAPPING"] = "BOOTSTRAPPING";
        Status["NOT_MOUNTED"] = "NOT_MOUNTED";
        Status["MOUNTING"] = "MOUNTING";
        Status["MOUNTED"] = "MOUNTED";
        Status["UPDATING"] = "UPDATING";
        Status["UPDATED"] = "UPDATED";
        Status["UNMOUNTING"] = "UNMOUNTING";
    })(Status || (Status = {}));
    let started = false;
    const apps = [];
    const globalStore = reactiveStore({});
    const getApps = () => apps;
    const getGlobalStore = () => globalStore;
    function register(name, entry, match, props) {
        apps.push({
            name,
            entry,
            match,
            props,
            status: Status.NOT_LOADED
        });
    }
    function start() {
        started = true;
        reroute();
    }
    function reroute() {
        const { loads, mounts, unmounts } = getAppChanges();
        if (started) {
            return perform();
        }
        else {
            return init();
        }
        function init() {
            return __awaiter(this, void 0, void 0, function* () {
                yield Promise.all(loads.map(runLoad));
            });
        }
        function perform() {
            return __awaiter(this, void 0, void 0, function* () {
                unmounts.map(runUnmount);
                loads.map((app) => __awaiter(this, void 0, void 0, function* () {
                    app = yield runLoad(app);
                    app = yield runBootstrap(app);
                    return runMount(app);
                }));
                mounts.map((app) => __awaiter(this, void 0, void 0, function* () {
                    app = yield runBootstrap(app);
                    return runMount(app);
                }));
            });
        }
    }
    function getAppChanges() {
        const unmounts = [];
        const loads = [];
        const mounts = [];
        apps.forEach((app) => {
            const isActive = app.match(window.location);
            switch (app.status) {
                case Status.NOT_LOADED:
                case Status.LOADING:
                    isActive && loads.push(app);
                    break;
                case Status.NOT_BOOTSTRAPPED:
                case Status.BOOTSTRAPPING:
                case Status.NOT_MOUNTED:
                    isActive && mounts.push(app);
                    break;
                case Status.MOUNTED:
                    !isActive && unmounts.push(app);
            }
        });
        return { unmounts, loads, mounts };
    }
    function compose(fns) {
        fns = Array.isArray(fns) ? fns : [fns];
        return (props) => fns.reduce((p, fn) => p.then(() => fn(props)), Promise.resolve());
    }
    function runLoad(app) {
        return __awaiter(this, void 0, void 0, function* () {
            if (app.loaded) {
                return app.loaded;
            }
            app.loaded = Promise.resolve().then(() => __awaiter(this, void 0, void 0, function* () {
                app.status = Status.LOADING;
                let lifecycle;
<<<<<<< HEAD
                let bodyNode;
                let styleNodes;
                if (typeof app.entry === 'string') {
                    const exports = yield importHtml(app);
                    lifecycleCheck(exports.lifecycle);
                    lifecycle = exports.lifecycle;
                    bodyNode = exports.bodyNode;
                    styleNodes = exports.styleNodes;
                }
                else {
                    // TODO: 增加 bodyNode, styleNodes, loadScript
                    lifecycle = (yield app.entry(app.props));
                    lifecycleCheck(lifecycle);
                }
                let host = yield loadShadowDOM(app, bodyNode, styleNodes);
=======
                if (typeof app.entry === 'string') {
                    lifecycle = yield importHtml(app);
                    lifecycleCheck(lifecycle);
                }
                else {
                    const exportedLifecycles = yield app.entry(app.props);
                    lifecycleCheck(exportedLifecycles);
                    const { bootstrap, mount, unmount, update } = exportedLifecycles;
                    lifecycle = {};
                    lifecycle.bootstrap = bootstrap ? [bootstrap] : [];
                    lifecycle.mount = mount ? [mount] : [];
                    lifecycle.unmount = unmount ? [unmount] : [];
                    lifecycle.update = update ? [update] : [];
                }
                let host = yield loadShadow(app);
>>>>>>> 663fd3712822f0516f12306713f5aa622810bbf9
                app.status = Status.NOT_BOOTSTRAPPED;
                app.bootstrap = compose(lifecycle.bootstrap);
                app.mount = compose(lifecycle.mount);
                app.unmount = compose(lifecycle.unmount);
                app.update = compose(lifecycle.update);
                app.host = host;
                delete app.loaded;
                return app;
            }));
            return app.loaded;
        });
    }
<<<<<<< HEAD
    function loadShadowDOM(app, body, styles) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                class Berial extends HTMLElement {
                    static get componentName() {
                        return app.name;
                    }
                    connectedCallback() {
                        var _a;
                        for (const k of styles) {
                            (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(k);
                        }
                        resolve(this);
                    }
                    constructor() {
                        var _a;
                        super();
                        this.attachShadow({ mode: 'open' });
                        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(body);
                    }
                }
                const hasDef = window.customElements.get(app.name);
                if (!hasDef) {
                    customElements.define(app.name, Berial);
=======
    function loadShadow(app) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    class Berial extends HTMLElement {
                        static get componentName() {
                            return app.name;
                        }
                        connectedCallback() {
                            this.attachShadow({ mode: 'open' });
                            resolve(this);
                        }
                        constructor() {
                            super();
                        }
                    }
                    const hasDef = window.customElements.get(app.name);
                    if (!hasDef) {
                        customElements.define(app.name, Berial);
                    }
                }
                catch (e) {
                    reject(e);
>>>>>>> 663fd3712822f0516f12306713f5aa622810bbf9
                }
            });
        });
    }
    function runUnmount(app) {
        return __awaiter(this, void 0, void 0, function* () {
            if (app.status != Status.MOUNTED) {
                return app;
            }
            app.status = Status.UNMOUNTING;
            yield app.unmount(app.props);
            app.status = Status.NOT_MOUNTED;
            return app;
        });
    }
    function runBootstrap(app) {
        return __awaiter(this, void 0, void 0, function* () {
            if (app.status !== Status.NOT_BOOTSTRAPPED) {
                return app;
            }
            app.status = Status.BOOTSTRAPPING;
            yield app.bootstrap(app.props);
            app.status = Status.NOT_MOUNTED;
            return app;
        });
    }
    function runMount(app) {
        return __awaiter(this, void 0, void 0, function* () {
            if (app.status !== Status.NOT_MOUNTED) {
                return app;
            }
            app.status = Status.MOUNTING;
            yield app.mount(app.props);
            app.status = Status.MOUNTED;
            return app;
        });
    }
    const routingEventsListeningTo = ['hashchange', 'popstate'];
    function urlReroute() {
        reroute();
    }
<<<<<<< HEAD
    const capturedEvents = {
=======
    const capturedEventListeners = {
>>>>>>> 663fd3712822f0516f12306713f5aa622810bbf9
        hashchange: [],
        popstate: []
    };
    window.addEventListener('hashchange', urlReroute);
    window.addEventListener('popstate', urlReroute);
    const originalAddEventListener = window.addEventListener;
    const originalRemoveEventListener = window.removeEventListener;
    window.addEventListener = function (name, fn, ...args) {
        if (routingEventsListeningTo.indexOf(name) >= 0 &&
<<<<<<< HEAD
            !capturedEvents[name].some((l) => l == fn)) {
            capturedEvents[name].push(fn);
=======
            !capturedEventListeners[name].some((l) => l == fn)) {
            capturedEventListeners[name].push(fn);
>>>>>>> 663fd3712822f0516f12306713f5aa622810bbf9
            return;
        }
        // @ts-ignore
        return originalAddEventListener.apply(this, args);
    };
    window.removeEventListener = function (name, fn, ...args) {
        if (routingEventsListeningTo.indexOf(name) >= 0) {
<<<<<<< HEAD
            capturedEvents[name] = capturedEvents[name].filter((l) => l !== fn);
=======
            capturedEventListeners[name] = capturedEventListeners[name].filter((l) => l !== fn);
>>>>>>> 663fd3712822f0516f12306713f5aa622810bbf9
            return;
        }
        //@ts-ignore
        return originalRemoveEventListener.apply(this, args);
    };
    function patchedUpdateState(updateState, ...args) {
        return function () {
            const urlBefore = window.location.href;
            // @ts-ignore
            updateState.apply(this, args);
            const urlAfter = window.location.href;
            if (urlBefore !== urlAfter) {
                // @ts-ignore
                urlReroute(new PopStateEvent('popstate'));
            }
        };
    }
    window.history.pushState = patchedUpdateState(window.history.pushState);
    window.history.replaceState = patchedUpdateState(window.history.replaceState);

    exports.importHtml = importHtml;
    exports.loadSandbox = loadSandbox;
    exports.loadScript = loadScript;
    exports.register = register;
    exports.start = start;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=berial.js.map
