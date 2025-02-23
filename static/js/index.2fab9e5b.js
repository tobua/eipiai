(() => { // webpackBootstrap
"use strict";
var __webpack_modules__ = ({
184: (function (module, __unused_webpack___webpack_exports__, __webpack_require__) {
__webpack_require__.a(module, async function (__webpack_handle_async_dependencies__, __webpack_async_result__) { try {
/* ESM import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(129);
/* ESM import */var epic_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(905);
/* ESM import */var epic_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(93);
/* ESM import */var epic_state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(220);
/* ESM import */var epic_state_connect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(841);
/* ESM import */var _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(333);
/// <reference types="@rsbuild/core/types" />





(0,epic_state__WEBPACK_IMPORTED_MODULE_0__/* .plugin */.BA)(epic_state_connect__WEBPACK_IMPORTED_MODULE_1__/* .connect */.$);
const data = (0,_index__WEBPACK_IMPORTED_MODULE_2__/* .client */.Lp)({
    url: 'http://localhost:3001/demo'
});
const { client: socket } = await (0,_index__WEBPACK_IMPORTED_MODULE_2__/* .socketClient */.UX)({
    url: 'ws://localhost:3002/socket-demo'
});
const store = (0,epic_state__WEBPACK_IMPORTED_MODULE_3__/* .state */.SB)({
    loading: true,
    error: true,
    posts: []
});
const socketStore = (0,epic_state__WEBPACK_IMPORTED_MODULE_3__/* .state */.SB)({
    loading: true,
    error: true,
    posts: [],
    loadingTime: true,
    errorTime: false,
    time: '00:00'
});
async function loadData() {
    const { error, data: posts } = await data.listPosts();
    store.loading = false;
    store.error = !!error;
    store.posts = posts;
}
async function loadSocketData() {
    const { error, data: posts } = await socket.listPosts();
    socketStore.loading = false;
    socketStore.error = !!error;
    socketStore.posts = posts;
    const { error: errorTime } = await socket.subscribeTime((time)=>{
        socketStore.time = time;
    }, 'hey');
    socketStore.loadingTime = false;
    socketStore.errorTime = !!errorTime;
}
loadData();
loadSocketData();
const InlineCode = (param)=>{
    let { children } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__/* .jsx */.tZ)("span", {
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
function Time() {
    if (socketStore.loadingTime || socketStore.errorTime) {
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__/* .jsx */.tZ)("p", {
            children: "Loading..."
        });
    }
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__/* .jsx */.tZ)("p", {
        children: socketStore.time
    });
}
function Posts(param) {
    let { data } = param;
    if (data.loading) {
        // @ts-ignore will be fixed in epic-jsx types.
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__/* .jsx */.tZ)("p", {
            children: "Loading data..."
        });
    }
    if (data.error) {
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__/* .jsxs */.BX)("p", {
            children: [
                "Failed to load data. Checkout the repository and run ",
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__/* .jsx */.tZ)(InlineCode, {
                    children: "bun server.ts"
                }),
                " inside the ",
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__/* .jsx */.tZ)(InlineCode, {
                    children: "demo"
                }),
                " folder."
            ]
        });
    }
    return data.posts.map((post)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__/* .jsx */.tZ)("p", {
            children: post.text
        }, post.id));
}
(0,epic_jsx__WEBPACK_IMPORTED_MODULE_5__/* .render */.sY)(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__/* .jsxs */.BX)("div", {
    style: {
        fontFamily: 'sans-serif',
        display: 'flex',
        gap: '10px',
        flexDirection: 'column'
    },
    children: [
        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__/* .jsx */.tZ)("h1", {
            children: "eipiai Demo"
        }),
        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__/* .jsx */.tZ)(Posts, {
            data: store
        }),
        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__/* .jsx */.tZ)("h2", {
            children: "WebSocket Connection"
        }),
        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__/* .jsx */.tZ)(Posts, {
            data: socketStore
        }),
        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__/* .jsx */.tZ)(Time, {})
    ]
}));

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

}),
333: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Lp: () => (client),
  UX: () => (socketClient)
});

const z = (/* unused pure expression or super */ null && (zod));
const subscribers = {};
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
function checkIfSubscription(args) {
    return typeof args[0] === 'function';
}
function sendSocketMessage(socket, route, args, isSubscription, options) {
    const id = Math.floor(Math.random() * 1000000);
    socket.send(JSON.stringify({
        method: route,
        data: isSubscription ? args[1] : args,
        context: typeof (options === null || options === void 0 ? void 0 : options.context) === 'function' ? options.context() : (options === null || options === void 0 ? void 0 : options.context) ?? {},
        subscription: isSubscription,
        id
    }));
    return id;
}
function addSubscriber(route, id, callback) {
    var _subscribers_route;
    if (!subscribers[route]) {
        subscribers[route] = [];
    }
    callback.id = id;
    (_subscribers_route = subscribers[route]) === null || _subscribers_route === void 0 ? void 0 : _subscribers_route.push(callback);
}
const isSocketClosed = (socket)=>socket.readyState === socket.CLOSED || socket.readyState === socket.CLOSING;
function socketClient(options) {
    return new Promise((done)=>{
        const socket = new WebSocket((options === null || options === void 0 ? void 0 : options.url) ?? 'ws://localhost:3000/api');
        const handler = new Proxy({}, {
            get (_target, route) {
                return async function() {
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                        args[_key] = arguments[_key];
                    }
                    if (isSocketClosed(socket)) {
                        return {
                            error: true
                        };
                    }
                    const isSubscription = checkIfSubscription(args);
                    const id = sendSocketMessage(socket, route, args, isSubscription, options);
                    if (isSubscription) {
                        addSubscriber(route, id, args[0]);
                    }
                    return new Promise((innerDone)=>{
                        openHandlers.set(id, innerDone);
                    });
                };
            }
        });
        const openHandlers = new Map();
        socket.onopen = ()=>{
            openHandlers.clear();
            done({
                client: handler,
                close: ()=>socket.close(),
                error: false
            });
        };
        socket.onmessage = (event)=>{
            const data = JSON.parse(event.data) // Fails with some dependencies without cast.
            ;
            const { subscribed, subscribe, unsubscribe, route, error, data: responseData, id, validation } = data;
            if (handleSubscriptionConfirmation(id, route, subscribed)) {
                return;
            }
            if (handleSubscriptionNotification(subscribe, route, id, error, responseData, validation)) {
                return;
            }
            if (handleUnsubscribe(id, unsubscribe)) {
                return;
            }
            handleMessageResponse(data);
        };
        function handleSubscriptionConfirmation(id, route, subscribed) {
            if (subscribed && openHandlers.has(id)) {
                const handler = openHandlers.get(id);
                if (handler) {
                    handler({
                        error: false,
                        unsubscribe: ()=>{
                            socket.send(JSON.stringify({
                                id,
                                unsubscribe: true,
                                method: route,
                                context: {},
                                subscription: false
                            }));
                            return new Promise((innerDone)=>{
                                openHandlers.set(id, innerDone);
                            });
                        }
                    });
                    openHandlers.delete(id);
                }
                return true;
            }
            return false;
        }
        function handleSubscriptionNotification(subscribe, route, id, error, responseData, validation) {
            if (!subscribe) {
                return false;
            }
            // Subscriptions can't technically be erroneous, validation errors however will be shown here.
            if (error) {
                console.log(`Erroneous subscription response received for ${route}.`);
                if (validation) {
                    console.log(validation) // TODO pretty print validation messages.
                    ;
                }
                return true;
            }
            if (!error && subscribers[route]) {
                notifySubscribers(route, id, responseData);
                return true;
            }
        }
        function handleUnsubscribe(id) {
            let unsubscribe = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
            if (unsubscribe && openHandlers.has(id)) {
                const handler = openHandlers.get(id);
                if (handler) {
                    handler({
                        error: false
                    });
                    openHandlers.delete(id);
                }
                return true;
            }
            return false;
        }
        function notifySubscribers(route, id, responseData) {
            for (const subscriber of subscribers[route] ?? []){
                if (id === subscriber.id) {
                    subscriber(responseData.length === 1 ? responseData[0] : responseData);
                }
            }
        }
        function handleMessageResponse(data) {
            if (openHandlers.has(data.id)) {
                const handler = openHandlers.get(data.id);
                if (handler) {
                    handler({
                        error: data.error,
                        data: data.data
                    });
                    openHandlers.delete(data.id);
                }
            }
        }
        socket.onerror = ()=>{
            console.error('Failed to start web socket.');
            done({
                error: true,
                client: {},
                close: ()=>undefined
            });
            // Error all open handlers.
            openHandlers.forEach((handler, id)=>{
                handler({
                    error: true
                });
                openHandlers.delete(id);
            });
        };
    });
}
function route() {
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
    for(var _len = arguments.length, output = new Array(_len), _key = 0; _key < _len; _key++){
        output[_key] = arguments[_key];
    }
    // TODO can make function all internal if no filter needed.
    return (filter)=>{
        // @ts-ignore zod.tuple working, but types fail...
        return [
            filter,
            zod.tuple(output)
        ];
    };
}


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
// webpack/runtime/async_module
(() => {
var webpackQueues =
	typeof Symbol === "function"
		? Symbol("webpack queues")
		: "__webpack_queues__";
var webpackExports =
	typeof Symbol === "function"
		? Symbol("webpack exports")
		: "__webpack_exports__";
var webpackError =
	typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
var resolveQueue = (queue) => {
  if (queue && queue.d < 1) {
    queue.d = 1;
    queue.forEach((fn) => (fn.r--));
		queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
	}
}
var wrapDeps = (deps) => {
	return deps.map((dep) => {
		if (dep !== null && typeof dep === "object") {
			if (dep[webpackQueues]) return dep;
			if (dep.then) {
				var queue = [];
				queue.d = 0;
				dep.then((r) => {
					obj[webpackExports] = r;
					resolveQueue(queue);
				},(e) => {
					obj[webpackError] = e;
					resolveQueue(queue);
				});
				var obj = {};
				obj[webpackQueues] = (fn) => (fn(queue));
				return obj;
			}
		}
		var ret = {};
		ret[webpackQueues] = function() {};
		ret[webpackExports] = dep;
		return ret;
	});
};
__webpack_require__.a = (module, body, hasAwait) => {
	var queue;
	hasAwait && ((queue = []).d = -1);
	var depQueues = new Set();
	var exports = module.exports;
	var currentDeps;
	var outerResolve;
	var reject;
	var promise = new Promise((resolve, rej) => {
		reject = rej;
		outerResolve = resolve;
	});
	promise[webpackExports] = exports;
	promise[webpackQueues] = (fn) => { queue && fn(queue), depQueues.forEach(fn), promise["catch"](function() {}); };
	module.exports = promise;
	body((deps) => {
		currentDeps = wrapDeps(deps);
		var fn;
		var getResult = () => {
			return currentDeps.map((d) => {
				if (d[webpackError]) throw d[webpackError];
				return d[webpackExports];
			});
		}
		var promise = new Promise((resolve) => {
			fn = () => (resolve(getResult));
			fn.r = 0;
			var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
			currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
		});
		return fn.r ? promise : getResult();
	}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
	queue && queue.d < 0 && (queue.d = 0);
};
})();
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
	return "1.2.3";
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
__webpack_require__.ruid = "bundler=rspack@1.2.3";

})();
/************************************************************************/
// startup
// Load entry module and return exports
// This entry module depends on other loaded chunks and execution need to be delayed
var __webpack_exports__ = __webpack_require__.O(undefined, ["663"], function() { return __webpack_require__(184) });
__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
})()
;