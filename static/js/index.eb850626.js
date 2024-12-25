(() => { // webpackBootstrap
"use strict";
var __webpack_modules__ = ({
"267": (function (__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

// EXTERNAL MODULE: ./node_modules/epic-jsx/jsx.ts
var jsx = __webpack_require__("129");
// EXTERNAL MODULE: ./node_modules/epic-jsx/index.ts + 5 modules
var epic_jsx = __webpack_require__("545");
// EXTERNAL MODULE: ./node_modules/epic-state/plugin.ts
var epic_state_plugin = __webpack_require__("93");
// EXTERNAL MODULE: ./node_modules/epic-state/index.ts + 3 modules
var epic_state = __webpack_require__("220");
// EXTERNAL MODULE: ./node_modules/epic-state/plugin/epic-jsx.ts
var plugin_epic_jsx = __webpack_require__("841");
;// CONCATENATED MODULE: ../index.ts

const subscribers = (/* unused pure expression or super */ null && ({}));
function api(methods) {
    return methods;
}
function client(options) {
    return new Proxy({}, {
        get (_target, route) {
            return async function() {
                for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                    args[_key] = arguments[_key];
                }
                try {
                    const response = await fetch((options === null || options === void 0 ? void 0 : options.url) ?? 'http://localhost:3000/api', {
                        method: 'POST',
                        body: JSON.stringify({
                            method: route,
                            data: args,
                            context: typeof (options === null || options === void 0 ? void 0 : options.context) === 'function' ? options.context() : (options === null || options === void 0 ? void 0 : options.context) ?? {}
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    return await response.json();
                } catch (_error) {
                    return {
                        error: true
                    };
                }
            };
        }
    });
}
function socketClient(options) {
    return new Promise((done)=>{
        const handler = new Proxy({}, {
            get (_target, route) {
                return async function() {
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                        args[_key] = arguments[_key];
                    }
                    socket.send(JSON.stringify({
                        method: route,
                        data: args,
                        context: typeof (options === null || options === void 0 ? void 0 : options.context) === 'function' ? options.context() : (options === null || options === void 0 ? void 0 : options.context) ?? {}
                    }));
                    const isSubscription = typeof args[0] === 'function';
                    if (isSubscription) {
                        var _subscribers_route;
                        if (!subscribers[route]) {
                            subscribers[route] = [];
                        }
                        (_subscribers_route = subscribers[route]) === null || _subscribers_route === void 0 ? void 0 : _subscribers_route.push(args[0]);
                    }
                    return new Promise((innerDone)=>{
                        state.message = innerDone;
                    });
                };
            }
        });
        const socket = new WebSocket((options === null || options === void 0 ? void 0 : options.url) ?? 'ws://localhost:3000/api');
        const state = {
            message: false
        };
        function resetMessage() {
            state.message = false;
        }
        socket.onopen = ()=>{
            resetMessage();
            done({
                client: handler,
                close: ()=>socket.close()
            });
        };
        socket.onmessage = (event)=>{
            const data = JSON.parse(event.data);
            if (data.subscribed === true) {
                if (state.message) {
                    state.message({
                        error: false
                    }) // Resolve promise to confirm subscription to client.
                    ;
                    resetMessage();
                    return;
                }
            }
            if (data.subscribe && subscribers[data.route]) {
                for (const subscriber of subscribers[data.route] ?? []){
                    subscriber(data);
                }
                return;
            }
            if (state.message) {
                state.message({
                    ...data,
                    route: undefined
                });
            }
            resetMessage();
        };
        socket.onerror = ()=>{
            if (state.message) {
                state.message({
                    error: true
                });
            }
            resetMessage();
        };
    });
}
const z = (/* unused pure expression or super */ null && (zod));
function index_route() {
    for(var _len = arguments.length, inputs = new Array(_len), _key = 0; _key < _len; _key++){
        inputs[_key] = arguments[_key];
    }
    return (handler)=>{
        // @ts-ignore zod.tuple working, but types fail...
        return [
            handler,
            zod.tuple(inputs)
        ];
    };
}
function subscribe() {
    for(var _len = arguments.length, inputs = new Array(_len), _key = 0; _key < _len; _key++){
        inputs[_key] = arguments[_key];
    }
    return [
        // @ts-ignore zod.tuple working, but types fail...
        Array.isArray(inputs) ? zod.tuple(inputs) : inputs
    ];
}

;// CONCATENATED MODULE: ./index.tsx
/// <reference types="@rsbuild/core/types" />





(0,epic_state_plugin/* plugin */.BA)(plugin_epic_jsx/* connect */.$);
const index_data = client({
    url: 'http://localhost:3001/demo'
});
const store = (0,epic_state/* state */.SB)({
    loading: true,
    error: true,
    posts: []
});
async function loadData() {
    const { error, data: posts } = await index_data.listPosts();
    store.loading = false;
    store.error = !!error;
    store.posts = posts;
}
loadData();
const InlineCode = (param)=>{
    let { children } = param;
    return /*#__PURE__*/ (0,jsx/* jsx */.tZ)("span", {
        style: {
            fontFamily: 'monospace',
            backgroundColor: 'gray',
            color: 'white',
            padding: 3,
            borderRadius: 3
        },
        children: children
    });
};
function Posts() {
    if (store.loading) {
        // @ts-ignore will be fixed in epic-jsx types.
        return /*#__PURE__*/ (0,jsx/* jsx */.tZ)("p", {
            children: "Loading data..."
        });
    }
    if (store.error) {
        return /*#__PURE__*/ (0,jsx/* jsxs */.BX)("p", {
            children: [
                "Failed to load data. Checkout the repository and run ",
                /*#__PURE__*/ (0,jsx/* jsx */.tZ)(InlineCode, {
                    children: "bun server.ts"
                }),
                " inside the ",
                /*#__PURE__*/ (0,jsx/* jsx */.tZ)(InlineCode, {
                    children: "demo"
                }),
                " folder."
            ]
        });
    }
    return store.posts.map((post)=>/*#__PURE__*/ (0,jsx/* jsx */.tZ)("p", {
            children: post.text
        }, post.id));
}
(0,epic_jsx/* render */.sY)(/*#__PURE__*/ (0,jsx/* jsxs */.BX)("div", {
    style: {
        fontFamily: 'sans-serif',
        display: 'flex',
        gap: '10px',
        flexDirection: 'column'
    },
    children: [
        /*#__PURE__*/ (0,jsx/* jsx */.tZ)("h1", {
            children: "eipiai Demo"
        }),
        /*#__PURE__*/ (0,jsx/* jsx */.tZ)(Posts, {})
    ]
}));


}),

});
/************************************************************************/
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {

// Check if module is in cache
var cachedModule = __webpack_module_cache__[moduleId];
if (cachedModule !== undefined) {
return cachedModule.exports;
}
// Create a new module (and put it into the cache)
var module = (__webpack_module_cache__[moduleId] = {
exports: {}
});
// Execute the module function
__webpack_modules__[moduleId](module, module.exports, __webpack_require__);

// Return the exports of the module
return module.exports;

}

// expose the modules object (__webpack_modules__)
__webpack_require__.m = __webpack_modules__;

/************************************************************************/
// webpack/runtime/define_property_getters
(() => {
__webpack_require__.d = function(exports, definition) {
	for(var key in definition) {
        if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
    }
};
})();
// webpack/runtime/global
(() => {
__webpack_require__.g = (function () {
	if (typeof globalThis === 'object') return globalThis;
	try {
		return this || new Function('return this')();
	} catch (e) {
		if (typeof window === 'object') return window;
	}
})();

})();
// webpack/runtime/has_own_property
(() => {
__webpack_require__.o = function (obj, prop) {
	return Object.prototype.hasOwnProperty.call(obj, prop);
};

})();
// webpack/runtime/on_chunk_loaded
(() => {
var deferred = [];
__webpack_require__.O = function (result, chunkIds, fn, priority) {
	if (chunkIds) {
		priority = priority || 0;
		for (var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--)
			deferred[i] = deferred[i - 1];
		deferred[i] = [chunkIds, fn, priority];
		return;
	}
	var notFulfilled = Infinity;
	for (var i = 0; i < deferred.length; i++) {
		var chunkIds = deferred[i][0],
			fn = deferred[i][1],
			priority = deferred[i][2];
		var fulfilled = true;
		for (var j = 0; j < chunkIds.length; j++) {
			if (
				(priority & (1 === 0) || notFulfilled >= priority) &&
				Object.keys(__webpack_require__.O).every(function (key) {
					return __webpack_require__.O[key](chunkIds[j]);
				})
			) {
				chunkIds.splice(j--, 1);
			} else {
				fulfilled = false;
				if (priority < notFulfilled) notFulfilled = priority;
			}
		}
		if (fulfilled) {
			deferred.splice(i--, 1);
			var r = fn();
			if (r !== undefined) result = r;
		}
	}
	return result;
};

})();
// webpack/runtime/rspack_version
(() => {
__webpack_require__.rv = function () {
	return "1.1.8";
};

})();
// webpack/runtime/jsonp_chunk_loading
(() => {

      // object to store loaded and loading chunks
      // undefined = chunk not loaded, null = chunk preloaded/prefetched
      // [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
      var installedChunks = {"980": 0,};
      __webpack_require__.O.j = function (chunkId) {
	return installedChunks[chunkId] === 0;
};
// install a JSONP callback for chunk loading
var webpackJsonpCallback = function (parentChunkLoadingFunction, data) {
	var chunkIds = data[0];
	var moreModules = data[1];
	var runtime = data[2];
	// add "moreModules" to the modules object,
	// then flag all "chunkIds" as loaded and fire callback
	var moduleId,
		chunkId,
		i = 0;
	if (chunkIds.some(function (id) { return installedChunks[id] !== 0 })) {
		for (moduleId in moreModules) {
			if (__webpack_require__.o(moreModules, moduleId)) {
				__webpack_require__.m[moduleId] = moreModules[moduleId];
			}
		}
		if (runtime) var result = runtime(__webpack_require__);
	}
	if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
	for (; i < chunkIds.length; i++) {
		chunkId = chunkIds[i];
		if (
			__webpack_require__.o(installedChunks, chunkId) &&
			installedChunks[chunkId]
		) {
			installedChunks[chunkId][0]();
		}
		installedChunks[chunkId] = 0;
	}
	return __webpack_require__.O(result);
};

var chunkLoadingGlobal = self["webpackChunkdemo"] = self["webpackChunkdemo"] || [];
chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
chunkLoadingGlobal.push = webpackJsonpCallback.bind(
	null,
	chunkLoadingGlobal.push.bind(chunkLoadingGlobal)
);

})();
// webpack/runtime/rspack_unique_id
(() => {
__webpack_require__.ruid = "bundler=rspack@1.1.8";

})();
/************************************************************************/
// startup
// Load entry module and return exports
// This entry module depends on other loaded chunks and execution need to be delayed
var __webpack_exports__ = __webpack_require__.O(undefined, ["663"], function() { return __webpack_require__("267") });
__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
})()
;