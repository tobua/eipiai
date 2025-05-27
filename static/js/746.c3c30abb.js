(self["webpackChunkdemo"] = self["webpackChunkdemo"] || []).push([["746"], {
296: (function (module) {
function debounce(function_, wait = 100, options = {}) {
	if (typeof function_ !== 'function') {
		throw new TypeError(`Expected the first parameter to be a function, got \`${typeof function_}\`.`);
	}

	if (wait < 0) {
		throw new RangeError('`wait` must not be negative.');
	}

	// TODO: Deprecate the boolean parameter at some point.
	const {immediate} = typeof options === 'boolean' ? {immediate: options} : options;

	let storedContext;
	let storedArguments;
	let timeoutId;
	let timestamp;
	let result;

	function run() {
		const callContext = storedContext;
		const callArguments = storedArguments;
		storedContext = undefined;
		storedArguments = undefined;
		result = function_.apply(callContext, callArguments);
		return result;
	}

	function later() {
		const last = Date.now() - timestamp;

		if (last < wait && last >= 0) {
			timeoutId = setTimeout(later, wait - last);
		} else {
			timeoutId = undefined;

			if (!immediate) {
				result = run();
			}
		}
	}

	const debounced = function (...arguments_) {
		if (
			storedContext
			&& this !== storedContext
			&& Object.getPrototypeOf(this) === Object.getPrototypeOf(storedContext)
		) {
			throw new Error('Debounced method called with different contexts of the same prototype.');
		}

		storedContext = this; // eslint-disable-line unicorn/no-this-assignment
		storedArguments = arguments_;
		timestamp = Date.now();

		const callNow = immediate && !timeoutId;

		if (!timeoutId) {
			timeoutId = setTimeout(later, wait);
		}

		if (callNow) {
			result = run();
		}

		return result;
	};

	Object.defineProperty(debounced, 'isPending', {
		get() {
			return timeoutId !== undefined;
		},
	});

	debounced.clear = () => {
		if (!timeoutId) {
			return;
		}

		clearTimeout(timeoutId);
		timeoutId = undefined;
	};

	debounced.flush = () => {
		if (!timeoutId) {
			return;
		}

		debounced.trigger();
	};

	debounced.trigger = () => {
		result = run();

		debounced.clear();
	};

	return debounced;
}

// Adds compatibility for ES modules
module.exports.debounce = debounce;

module.exports = debounce;


}),
653: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Th: () => (/* binding */ Renderer),
  Lt: () => (/* binding */ getRoots),
  sY: () => (/* binding */ epic_jsx_render)
});

// UNUSED EXPORTS: useCallback, useMemo, useState, jsxs, useEffect, default, jsx, unmount, jsxDEV, unmountAll, createElement, Fragment, cloneElement, useRef, debounce, getRoot

// EXTERNAL MODULE: ./node_modules/logua/dist/index.js
var dist = __webpack_require__(224);
;// CONCATENATED MODULE: ./node_modules/epic-jsx/helper.ts

const log = (0,dist/* create */.U)('epic-jsx', 'blue');
function shallowArrayEqual(first, second) {
    if (first.length !== second.length) {
        return false;
    }
    for(let index = 0; index < first.length; index += 1){
        if (first[index] !== second[index]) {
            return false;
        }
    }
    return true;
}
// NOTE unused.
function getAllFiberSiblings(node) {
    let result = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    if (node === null || node === void 0 ? void 0 : node.sibling) {
        result.push(node.sibling);
        return getAllFiberSiblings(node.sibling);
    }
    return result;
}
function getComponentRefsFromTree(node, result, flat) {
    let root = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : true;
    if (node.type === 'TEXT_ELEMENT' || !root && typeof node.type === 'function') {
        return result;
    }
    if (node.native) {
        result.push(node.native);
    }
    if (node.child) {
        const nested = getComponentRefsFromTree(node.child, flat ? result : [], flat, false);
        if (!flat && nested.length > 0) {
            if (result.length > 0) {
                result.push(nested);
            } else {
                result.push(...nested);
            }
        }
    }
    // !root to ignore siblings of the component itself.
    if (!root && node.sibling) {
        getComponentRefsFromTree(node.sibling, result, flat, false);
    }
    return result;
}
function getComponentRefsFromTreeByTag(node, result, tagName) {
    let root = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : true;
    if (node.type === 'TEXT_ELEMENT' || !root && typeof node.type === 'function') {
        return result;
    }
    if (node.native && node.native.tagName && node.native.tagName.toLowerCase() === tagName.toLowerCase()) {
        result.push(node.native);
    }
    // !root to ignore siblings of the component itself.
    if (!root && node.sibling) {
        getComponentRefsFromTreeByTag(node.sibling, result, tagName, false);
    }
    if (node.child) {
        getComponentRefsFromTreeByTag(node.child, result, tagName, false);
    }
    return result;
}
function schedule(callback) {
    if (window.requestIdleCallback) {
        return window.requestIdleCallback(callback);
    }
    // requestIdleCallback polyfill (not supported in Safari)
    // https://github.com/pladaria/requestidlecallback-polyfill
    // See react scheduler for better implementation.
    window.requestIdleCallback = window.requestIdleCallback || function idleCallbackPolyfill(innerCallback, _options) {
        const start = Date.now();
        setTimeout(()=>{
            innerCallback({
                didTimeout: false,
                timeRemaining () {
                    return Math.max(0, 50 - (Date.now() - start));
                }
            });
        }, 1);
        return 0;
    };
    window.cancelIdleCallback = window.cancelIdleCallback || function cancelIdleCallbackPolyfill(id) {
        clearTimeout(id);
    };
    return schedule(callback);
}
function multipleInstancesWarning() {
    if (true) {
        return;
    }
    // Ensure plugin is only loaded once from a single source (will not work properly otherwise).
    if (typeof __webpack_require__.g.__epicJsx !== 'undefined') {
        log('Multiple instances of epic-jsx have been loaded, plugin might not work as expected', 'warning');
    } else {
        __webpack_require__.g.__epicJsx = true;
    }
}
function createRef() {
    const refs = new Map();
    const refObjects = [];
    const handler = {
        get (target, prop) {
            if (prop in target) {
                return target[prop];
            }
            if (refs.has(prop)) {
                return refs.get(prop);
            }
            if (prop === 'size') {
                return refObjects.length;
            }
            log(`Attempted to access unregistered ref with id="${prop}"`, 'warning');
            // Return mock to avoid access errors.
            return {
                tag: 'div',
                native: document.createElement('div')
            };
        }
    };
    return new Proxy({
        byTag: (tag)=>refObjects.filter((ref)=>ref.tag === tag),
        addRef: (id, ref)=>{
            refs.set(id, ref);
            refObjects.push(ref);
        },
        clear: ()=>{
            refs.clear();
            refObjects.length = 0;
        },
        hasRef: (id)=>{
            return refs.has(id);
        }
    }, handler);
}
function debounce(method, wait) {
    let timeout// Avoid using NodeJS.Timeout to avoid clash with Bun types.
    ;
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        clearTimeout(timeout);
        timeout = setTimeout(()=>method.apply(this, args), wait);
    };
}
function camelCaseToDashCase(camelCase) {
    return camelCase.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
// Browser requires dash-case to render, react allows camelCase.
function convertSvgPropsToDashCase(props) {
    for(const prop in props){
        if (svgProperties.includes(prop)) {
            props[camelCaseToDashCase(prop)] = props[prop];
            delete props[prop];
        }
    }
    return props;
}
const svgProperties = [
    'accentHeight',
    'alignmentBaseline',
    'arabicForm',
    'baselineShift',
    'clipPath',
    'clipRule',
    'colorInterpolation',
    'colorInterpolationFilters',
    'colorProfile',
    'colorRendering',
    'dominantBaseline',
    'enableBackground',
    'fillOpacity',
    'fillRule',
    'floodColor',
    'floodOpacity',
    'fontFamily',
    'fontSize',
    'fontSizeAdjust',
    'fontStretch',
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'glyphOrientationHorizontal',
    'glyphOrientationVertical',
    'imageRendering',
    'letterSpacing',
    'lightingColor',
    'markerEnd',
    'markerMid',
    'markerStart',
    'paintOrder',
    'pointerEvents',
    'shapeRendering',
    'stopColor',
    'stopOpacity',
    'strokeDasharray',
    'strokeDashoffset',
    'strokeLinecap',
    'strokeLinejoin',
    'strokeMiterlimit',
    'strokeOpacity',
    'strokeWidth',
    'textAnchor',
    'textDecoration',
    'textRendering',
    'unicodeBidi',
    'wordSpacing',
    'writingMode'
];
const sizeStyleProperties = [
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
    'border',
    'margin',
    'padding',
    'top',
    'right',
    'bottom',
    'left',
    'gap',
    'rowGap',
    'columnGap'
];

;// CONCATENATED MODULE: ./node_modules/epic-jsx/types.ts
var types_Change = /*#__PURE__*/ function(Change) {
    Change[Change["Update"] = 0] = "Update";
    Change[Change["Add"] = 1] = "Add";
    Change[Change["Delete"] = 2] = "Delete";
    return Change;
}({});

;// CONCATENATED MODULE: ./node_modules/epic-jsx/browser.ts


function startsWithSizeProperty(propertyName) {
    return sizeStyleProperties.some((prop)=>propertyName.startsWith(prop));
}
function convertStylesToPixels(styleObject) {
    const convertedStyles = {};
    for(const key in styleObject){
        if (Object.hasOwn(styleObject, key)) {
            const value = styleObject[key];
            if (typeof value === 'number' && startsWithSizeProperty(key)) {
                convertedStyles[key] = `${value}px`;
            } else {
                convertedStyles[key] = value;
            }
        }
    }
    return convertedStyles;
}
const isEvent = (key)=>key.startsWith('on');
const isProperty = (key)=>key !== 'children' && !isEvent(key);
const isNew = (prev, next)=>(key)=>prev[key] !== next[key];
const isGone = (_, next)=>(key)=>!(key in next);
// Listeners on new props might not have reference equality, so they need to be stored on assignment.
const eventListeners = new Map();
function updateNativeElement(element) {
    let previousProps = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, nextProps = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    // Remove old or changed event listeners
    // biome-ignore lint/complexity/noForEach: Chained expression.
    Object.keys(previousProps).filter(isEvent).filter((key)=>!(key in nextProps) || isNew(previousProps, nextProps)(key)).forEach((name)=>{
        var _eventListeners_get;
        const eventType = name.toLowerCase().substring(2) // Remove the "on" from onClick.
        ;
        const previousHandler = (_eventListeners_get = eventListeners.get(element)) === null || _eventListeners_get === void 0 ? void 0 : _eventListeners_get.get(eventType);
        if (previousHandler) {
            element.removeEventListener(eventType, previousHandler);
        }
    });
    // Remove old properties
    // biome-ignore lint/complexity/noForEach: Chained expression.
    Object.keys(previousProps).filter(isProperty).filter(isGone(previousProps, nextProps)).forEach((name)=>{
        // @ts-ignore Filtered for valid properties, maybe more checks necessary.
        element[name] = '';
    });
    // Set new or changed properties
    // biome-ignore lint/complexity/noForEach: Chained expression.
    Object.keys(nextProps).filter(isProperty).filter(isNew(previousProps, nextProps)).forEach((name)=>{
        if (name === 'ref' && typeof nextProps[name] === 'object') {
            nextProps[name].current = element;
            return;
        }
        if (name === 'ref' && typeof nextProps[name] === 'string') {
            return;
        }
        if (name === 'value') {
            ;
            element.value = nextProps[name];
            return;
        }
        if (typeof element.setAttribute === 'function') {
            if (name === 'style') {
                Object.assign(element.style, convertStylesToPixels(nextProps[name]));
            } else {
                ;
                element.setAttribute(name, nextProps[name]);
            }
        } else {
            // @ts-ignore Filtered for valid properties, maybe more checks necessary.
            element[name] = nextProps[name];
        }
    });
    // Add event listeners
    // biome-ignore lint/complexity/noForEach: Chained expression.
    Object.keys(nextProps).filter(isEvent).filter(isNew(previousProps, nextProps)).forEach((name)=>{
        var _eventListeners_get;
        const eventType = name.toLowerCase().substring(2);
        element.addEventListener(eventType, nextProps[name]);
        if (!eventListeners.has(element)) {
            eventListeners.set(element, new Map());
        }
        (_eventListeners_get = eventListeners.get(element)) === null || _eventListeners_get === void 0 ? void 0 : _eventListeners_get.set(eventType, nextProps[name]);
    });
}
function mapLegacyProps(fiber) {
    if (Object.hasOwn(fiber.props, 'className')) {
        if (Object.hasOwn(fiber.props, 'class')) {
            fiber.props.class = `${fiber.props.class} ${fiber.props.className}`;
        } else {
            fiber.props.class = fiber.props.className;
        }
        fiber.props.className = undefined;
    }
}
function addRefs(fiber, component) {
    var _fiber_props, _fiber_props1;
    // Add refs to component.
    if (((_fiber_props = fiber.props) === null || _fiber_props === void 0 ? void 0 : _fiber_props.id) && fiber.native && component) {
        component.ref.addRef(fiber.props.id, {
            tag: fiber.native.tagName.toLowerCase(),
            native: fiber.native
        });
    }
    if (((_fiber_props1 = fiber.props) === null || _fiber_props1 === void 0 ? void 0 : _fiber_props1.ref) && fiber.native && component) {
        component.ref.addRef(fiber.props.ref, {
            tag: fiber.native.tagName.toLowerCase(),
            native: fiber.native
        });
    }
}
function findNativeParent(fiber) {
    let parent = fiber.parent;
    let maxTries = 500;
    while(!(parent === null || parent === void 0 ? void 0 : parent.native) && (parent === null || parent === void 0 ? void 0 : parent.parent) && maxTries > 0){
        maxTries -= 1;
        parent = parent.parent;
    }
    if (maxTries === 0) {
        log('Ran out of tries finding native parent.', 'warning');
    }
    return parent;
}
function createNativeElement(fiber) {
    if (!fiber.type) {
        return undefined // Ignore fragments.
        ;
    }
    mapLegacyProps(fiber);
    let element;
    if (fiber.type === 'TEXT_ELEMENT') {
        element = document.createTextNode('');
    } else if (fiber.svg) {
        convertSvgPropsToDashCase(fiber.props);
        // Necessary to properly render SVG elements, createElement will not work.
        element = document.createElementNS('http://www.w3.org/2000/svg', fiber.type);
    } else {
        element = document.createElement(fiber.type);
    }
    updateNativeElement(element, {}, fiber.props);
    return element;
}
function commitDeletion(fiber, nativeParent) {
    if (fiber.native) {
        try {
            if (nativeParent.isConnected && fiber.native.isConnected) {
                nativeParent.removeChild(fiber.native);
            } else if (fiber.native.isConnected) {
                log("Trying to remove a node from a parent that's no longer in the DOM", 'warning');
            } else {
                log("Trying to remove a node that's no longer in the DOM", 'warning');
            }
        } catch (_error) {
            // NOTE indicates a plugin error, should not happen.
            log('Failed to remove node from the DOM', 'warning');
        }
        fiber.change = undefined;
    } else if (fiber.child) {
        // Avoid another delete when visiting though siblings.
        fiber.change = undefined;
        fiber.child.change = types_Change.Delete;
        commitDeletion(fiber.child, nativeParent);
    }
}
function commitFiber(fiber, currentComponent) {
    var _fiber_component;
    if (!fiber) {
        return;
    }
    if ((_fiber_component = fiber.component) === null || _fiber_component === void 0 ? void 0 : _fiber_component.root) {
        var _fiber_component1;
        // biome-ignore lint/style/noParameterAssign: Much easier in this case.
        currentComponent = (_fiber_component1 = fiber.component) === null || _fiber_component1 === void 0 ? void 0 : _fiber_component1.root.component;
    }
    const parent = findNativeParent(fiber);
    if (fiber.change === types_Change.Add && fiber.native) {
        var _parent_native;
        parent === null || parent === void 0 ? void 0 : (_parent_native = parent.native) === null || _parent_native === void 0 ? void 0 : _parent_native.appendChild(fiber.native);
    } else if (fiber.change === types_Change.Update && fiber.native) {
        var _fiber_previous;
        updateNativeElement(fiber.native, (_fiber_previous = fiber.previous) === null || _fiber_previous === void 0 ? void 0 : _fiber_previous.props, fiber.props);
    } else if (fiber.change === types_Change.Delete && parent) {
        if (fiber.native && eventListeners.has(fiber.native)) {
            eventListeners.delete(fiber.native) // Clean up event listener tracking.
            ;
        }
        if (parent.native) {
            commitDeletion(fiber, parent.native);
        }
    }
    addRefs(fiber, currentComponent);
    if (fiber.child) {
        commitFiber(fiber.child, currentComponent);
    }
    if (fiber.sibling) {
        commitFiber(fiber.sibling, currentComponent);
    }
}

;// CONCATENATED MODULE: ./node_modules/epic-jsx/render.ts




function commit(context, fiber) {
    for (const fiber of context.deletions){
        commitFiber(fiber);
    }
    context.deletions.length = 0;
    if (fiber.child) {
        commitFiber(fiber.child);
    }
    // TODO check if dependencies changed.
    if (Renderer.effects.length > 0) {
        for (const effect of Renderer.effects){
            effect();
        }
        Renderer.effects.length = 0;
    }
}
function deleteAllFiberSiblings(context, node) {
    if (!node) {
        return;
    }
    node.change = types_Change.Delete;
    context.deletions.push(node);
    if (node === null || node === void 0 ? void 0 : node.sibling) {
        deleteAllFiberSiblings(context, node.sibling);
    }
}
// Loops flat through all the siblings of the previous child of the node passed.
function reconcileChildren(context, current) {
    let children = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    var _current_previous;
    let index = 0;
    let previous = (_current_previous = current.previous) === null || _current_previous === void 0 ? void 0 : _current_previous.child;
    let previousSibling;
    let maxTries = 500;
    // TODO compare children.length to previous element length.
    while((index < children.length || previous) && maxTries > 0){
        maxTries -= 1;
        const element = children[index];
        let newFiber;
        // TODO also compare props.
        const fragment = element === null || previous === null;
        const isSameType = !fragment && (element === null || element === void 0 ? void 0 : element.type) === (previous === null || previous === void 0 ? void 0 : previous.type);
        if (previous && !isSameType) {
            // Delete the old node and its children when types don't match
            deleteChildren(context, previous);
        }
        if (isSameType && previous) {
            newFiber = createUpdatedFiber(current, previous, element);
        } else if (element) {
            // Create new fiber for different types or new elements
            newFiber = createNewFiber(current, element, previous);
        }
        const item = previous;
        if (previous) {
            previous = previous.sibling;
        }
        if (index === 0) {
            current.child = newFiber;
        } else if (element && previousSibling) {
            previousSibling.sibling = newFiber;
        }
        previousSibling = newFiber;
        index += 1;
        // NOTE added to prevent endless loop after state update to component.
        if (index > children.length) {
            // Remove additional nodes no longer present in tree.
            deleteAllFiberSiblings(context, previous ?? item);
            previous = undefined;
        }
    }
    if (maxTries === 0) {
        log('Ran out of tries at reconcileChildren.', 'warning');
    }
}
const createUpdatedFiber = (current, previous, element)=>({
        type: previous.type,
        props: element === null || element === void 0 ? void 0 : element.props,
        native: previous.native,
        parent: current,
        previous,
        hooks: previous.hooks,
        svg: previous.svg || previous.type === 'svg',
        change: types_Change.Update
    });
const createNewFiber = (current, element, previous)=>({
        type: element.type,
        props: element.props,
        native: undefined,
        parent: current,
        previous: undefined,
        hooks: typeof element.type === 'function' ? previous ? previous.hooks : [] : undefined,
        svg: current.svg || element.type === 'svg',
        change: types_Change.Add
    });
function deleteChildren(context, fiber) {
    if (fiber.change === types_Change.Delete) {
        return;
    }
    fiber.change = types_Change.Delete;
    context.deletions.push(fiber);
    if (fiber.child) {
        deleteChildren(context, fiber.child);
    }
    if (fiber.sibling) {
        deleteChildren(context, fiber.sibling);
    }
}
function rerender(context, fiber) {
    fiber.sibling = undefined;
    fiber.previous = fiber;
    context.pending.push(fiber);
}
function updateFunctionComponent(context, fiber) {
    if (typeof fiber.type !== 'function') {
        return;
    }
    if (typeof fiber.hooks === 'undefined') {
        fiber.hooks = [];
    }
    const isFirstRender = !fiber.id;
    let pluginResult;
    fiber.hooks.length = 0;
    Renderer.context = context;
    // TODO id in fiber shouldn't be optional, assign during creation.
    if (!fiber.id) {
        var _fiber_previous;
        fiber.id = ((_fiber_previous = fiber.previous) === null || _fiber_previous === void 0 ? void 0 : _fiber_previous.id) ?? Math.floor(Math.random() * 1000000);
    }
    fiber.component = {
        id: fiber.id,
        root: fiber,
        context,
        rerender: ()=>rerender(context, fiber),
        // TODO implement and test ref clearing on rerenders.
        ref: createRef(),
        each (callback) {
            context.afterListeners.push(()=>callback.call(fiber.component));
        },
        once (callback) {
            if (isFirstRender) {
                context.afterListeners.push(()=>callback.call(fiber.component));
            }
        },
        after (callback) {
            log('this.after() lifecycle is deprecated, use this.once() or this.each()', 'warning');
            if (isFirstRender) {
                context.afterListeners.push(()=>callback.call(fiber.component));
            }
        },
        plugin (plugins) {
            for (const plugin of plugins){
                if (plugin) {
                    pluginResult = plugin;
                    throw new Error('plugin') // early-return approach.
                    ;
                }
            }
        },
        state: undefined
    };
    Renderer.current = fiber;
    if (Array.isArray(fiber.props.children) && fiber.props.children.length === 0) {
        // biome-ignore lint/performance/noDelete: Clean up meaningless props.
        delete fiber.props.children;
    }
    let children = [];
    try {
        children = [
            fiber.type.call(fiber.component, fiber.props)
        ];
    } catch (error) {
        if (error.message === 'plugin' && pluginResult) {
            children = [
                pluginResult
            ];
        }
    }
    Renderer.current = undefined;
    Renderer.context = undefined;
    reconcileChildren(context, fiber, children.flat());
}
function updateHostComponent(context, fiber) {
    var _fiber_props;
    if (!fiber.native) {
        fiber.native = createNativeElement(fiber);
    }
    // Flattening children to make arrays work.
    reconcileChildren(context, fiber, (_fiber_props = fiber.props) === null || _fiber_props === void 0 ? void 0 : _fiber_props.children.flat());
}
function render(context, fiber) {
    const isFunctionComponent = fiber.type instanceof Function;
    if (isFunctionComponent) {
        updateFunctionComponent(context, fiber);
    } else {
        updateHostComponent(context, fiber);
    }
    if (fiber.child) {
        return fiber.child;
    }
    let nextFiber = fiber;
    let maxTries = 500;
    while(nextFiber && maxTries > 0){
        maxTries -= 1;
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
    if (maxTries === 0) {
        log('Ran out of tries at render.', 'warning');
    }
    return undefined;
}
function process(deadline, context) {
    if (!context.current && context.pending.length === 0) {
        log('Trying to process an empty queue');
        return;
    }
    if (!context.current) {
        context.current = context.pending.shift();
        if (context.current) {
            context.rendered.push(context.current) // Rendered state only final when current empty.
            ;
        }
    }
    context.afterListeners = [];
    let shouldYield = false;
    let maxTries = 5000 // Prevent infinite loop, long lists can take a lot of tries.
    ;
    while(context.current && !shouldYield && maxTries > 0){
        maxTries -= 1;
        // Render current fiber.
        context.current = render(context, context.current);
        // Add next fiber if previous tree finished.
        if (!context.current && context.pending.length > 0) {
            context.current = context.pending.shift();
            if (context.current) {
                context.rendered.push(context.current);
            }
        }
        // Yield current rendering cycle if out of time.
        shouldYield = deadline.timeRemaining() < 1;
    }
    if (maxTries === 0) {
        log('Ran out of tries at process.', 'warning');
    }
    // Yielded if context.current not empty.
    if (!context.current && context.rendered.length > 0) {
        for (const fiber of context.rendered){
            commit(context, fiber);
        }
        if (context.afterListeners) {
            for (const callback of context.afterListeners){
                callback.call(null);
            }
            context.afterListeners = [];
        }
        context.rendered.length = 0;
    }
    if (context.current || context.pending.length > 0) {
        schedule((nextDeadline)=>process(nextDeadline, context));
    }
}
const processNow = (context)=>process({
        timeRemaining: ()=>99999,
        didTimeout: false
    }, context);

;// CONCATENATED MODULE: ./node_modules/epic-jsx/index.ts


// biome-ignore lint/style/noNamespaceImport: React compatibility.



const Renderer = {
    context: undefined,
    effects: [],
    current: undefined
};

// biome-ignore lint/style/noDefaultExport: React compatibility.
/* ESM default export */ const epic_jsx = ((/* unused pure expression or super */ null && (React)));
const roots = new Map();
// Imported by regular React runtime, implementation is guess.
// @ts-ignore
const Fragment = (/* unused pure expression or super */ null && (undefined)) // Symbol.for('react.fragment')
;
const getRoot = function() {
    let container = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document.body;
    if (!roots.has(container)) {
        return;
    }
    const context = roots.get(container);
    // Ensure all work has passed.
    if (context && (context.pending.length > 0 || context.rendered.length > 0)) {
        processNow(context);
    }
    return context;
};
const getRoots = ()=>{
    const contexts = [
        ...roots.values()
    ];
    // Ensure all work has passed.
    for (const context of contexts){
        if (context.pending.length > 0 || context.rendered.length > 0) {
            processNow(context);
        }
    }
    return contexts;
};
const unmount = (container)=>{
    if (!container) {
        log('Trying to unmount empty container', 'warning');
        return;
    }
    container.innerHTML = '';
    const context = getRoot(container);
    if (!context) {
        return;
    }
    roots.delete(container);
};
const unmountAll = ()=>roots.forEach((_, container)=>unmount(container));
function epic_jsx_render(element, container) {
    if (!container) {
        // biome-ignore lint/style/noParameterAssign: Why wouldn't a method default work?
        container = document.body // Default assignment in args wouldn't override null.
        ;
    }
    if (roots.has(container)) {
        unmount(container);
    } else {
        container.innerHTML = '' // Always clearing the container first.
        ;
    }
    const root = {
        native: container,
        props: {
            children: [
                element
            ]
        },
        previous: undefined,
        unmount: ()=>unmount(container)
    };
    const context = {
        root,
        deletions: [],
        current: undefined,
        dependencies: new Map(),
        pending: [
            root
        ],
        rendered: [],
        afterListeners: []
    };
    roots.set(container, context);
    context.deletions = [];
    schedule((deadline)=>process(deadline, context));
    return context;
}
multipleInstancesWarning();


}),
314: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  BX: () => (jsxs),
  tZ: () => (jsx)
});
function createTextElement(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: typeof text === 'boolean' ? '' : text,
            children: []
        }
    };
}
// Official signature (not working yet).
// createElement<P>(type: React.ElementType<P>, props: P & { children?: React.ReactNode }, ...children: React.ReactNode[]): React.ReactElement<P> | null;
function createElement(type, props) {
    for(var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        children[_key - 2] = arguments[_key];
    }
    let mappedChildren = children;
    // NOTE needed for browser JSX runtime
    if (props === null || props === void 0 ? void 0 : props.children) {
        mappedChildren = Array.isArray(props.children) ? props.children : [
            props.children
        ];
        props.children = undefined;
    }
    // Required for successful rendering with markdown-to-jsx.
    if (Array.isArray(children[0]) && children[0].length === 1 && typeof children[0][0] === 'string') {
        mappedChildren = children[0];
    } else if (Array.isArray(children[0]) && children[0].length > 1) {
        mappedChildren = children[0];
    }
    return {
        type,
        props: {
            ...props,
            children: mappedChildren// Clear out falsy values.
            .filter(// @ts-ignore
            (item)=>item !== undefined && item !== null && item !== false && item !== '')// Add text elements.
            .map((child)=>typeof child === 'object' ? child : createTextElement(child))
        }
    };
}
// JSX environment specific runtime aliases.
// biome-ignore lint/style/useNamingConvention: React default for compatibility.
const jsxDEV = (/* unused pure expression or super */ null && (createElement));
const jsx = createElement;
const jsxs = createElement;
// Should be compatible with React.cloneElement.
function cloneElement(element, props) {
    for(var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        children[_key - 2] = arguments[_key];
    }
    const newProps = {
        ...element.props,
        ...props,
        children: children.length > 0 ? children : element.props.children
    };
    return {
        ...element,
        props: newProps
    };
}


}),
514: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  $N: () => (canProxy),
  Be: () => (isLeaf),
  J1: () => (listGetters),
  Kb: () => (createBaseObject),
  Kn: () => (isObject),
  Ph: () => (updateProxyValues),
  cM: () => (log),
  d7: () => (needsRegister),
  fm: () => (newProxy),
  n4: () => (isSetter),
  u0: () => (canPolyfill)
});
/* ESM import */var logua__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(224);

const log = (0,logua__WEBPACK_IMPORTED_MODULE_0__/* .create */.U)('epic-state', 'red');
const isObject = (x)=>typeof x === 'object' && x !== null;
const listGetters = (input)=>{
    const descriptors = Object.getOwnPropertyDescriptors(input);
    const getters = {};
    for (const [key, { get }] of Object.entries(descriptors)){
        if (typeof get === 'function') {
            getters[key] = get;
        }
    }
    return getters;
};
// TODO probably not needed.
const isGetter = (input, property)=>{
    const descriptor = Object.getOwnPropertyDescriptor(input, property);
    return !!descriptor && typeof descriptor.get === 'function';
};
const isSetter = (input, property)=>{
    const descriptor = Object.getOwnPropertyDescriptor(input, property);
    return !!descriptor && typeof descriptor.set === 'function';
};
const reevaluateGetter = (target, property)=>{
    const temporaryValue = target[property];
    delete target[property];
    target[property] = temporaryValue;
    return target[property];
};
const newProxy = (target, handler)=>new Proxy(target, handler);
const canProxy = (x, refSet)=>isObject(x) && !refSet.has(x) && (Array.isArray(x) || !(Symbol.iterator in x)) && !(x instanceof WeakMap) && !(x instanceof WeakSet) && !(x instanceof Error) && !(x instanceof Number) && !(x instanceof Date) && !(x instanceof String) && !(x instanceof RegExp) && !(x instanceof ArrayBuffer);
const canPolyfill = (x)=>x instanceof Map || x instanceof Set;
const defaultHandlePromise = (promise)=>{
    switch(promise.status){
        case 'fulfilled':
            return promise.value;
        case 'rejected':
            throw promise.reason;
        default:
            throw promise;
    }
};
const isLeaf = (value)=>typeof value !== 'object' || value && Object.hasOwn(value, '_leaf');
const needsRegister = (value)=>typeof value === 'object' && value && Object.hasOwn(value, '_leaf') && Object.hasOwn(value, '_register');
// NOTE copy is required for proper function.
const createBaseObject = (initialObject)=>{
    if (Array.isArray(initialObject)) {
        return [];
    }
    return Object.create(Object.getPrototypeOf(initialObject));
};
const snapCache = new WeakMap();
function updateProxyValues(existingObject, newObject) {
    // Add or update properties from newObject to existingObject
    for (const key of Reflect.ownKeys(newObject)){
        // @ts-ignore
        existingObject[key] = newObject[key];
    }
    // Remove properties from existingObject that are not in newObject
    for (const key of Reflect.ownKeys(existingObject)){
        if (!(key in newObject)) {
            delete existingObject[key];
        }
    }
}
function set(parent, property) {
    return (value)=>{
        parent[property] = value;
    };
}
function setTo(parent, property, value) {
    return ()=>{
        parent[property] = value;
    };
}
function setValue(parent, property, cast) {
    return (event)=>{
        parent[property] = cast ? cast(event.target.value) : event.target.value;
    };
}
function toggle(parent, property) {
    let propagate = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    return (event)=>{
        if (event && !propagate) {
            event.stopPropagation();
        }
        parent[property] = !parent[property];
    };
}
function multipleInstancesWarning() {
    if (true) {
        return;
    }
    // Ensure plugin is only loaded once from a single source (will not work properly otherwise).
    if (typeof __webpack_require__.g.__epicState !== 'undefined') {
        log('Multiple instances of epic-state have been loaded, plugin might not work as expected', 'warning');
    } else {
        __webpack_require__.g.__epicState = true;
    }
}


}),
622: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  SB: () => (/* binding */ epic_state_state)
});

// UNUSED EXPORTS: setValue, observe, list, setTo, ref, run, batch, remove, removeAllPlugins, set, plugin, load, toggle

// EXTERNAL MODULE: ./node_modules/epic-jsx/index.ts + 4 modules
var epic_jsx = __webpack_require__(653);
// EXTERNAL MODULE: ./node_modules/epic-state/helper.ts
var helper = __webpack_require__(514);
// EXTERNAL MODULE: ./node_modules/epic-state/plugin.ts
var epic_state_plugin = __webpack_require__(499);
;// CONCATENATED MODULE: ./node_modules/epic-state/batching.ts


const batching = {
    updates: [],
    scheduler: undefined
};
const scheduleUpdate = (update)=>{
    batching.updates.unshift(update) // Most recent update will be processed first, to allow filtering already applied changes.
    ;
    if (batching.scheduler === undefined) {
        batching.scheduler = schedule(process);
    }
};
// Process all batched updates.
const noDeadline = {
    didTimeout: false,
    timeRemaining () {
        return 99999;
    }
};
const batch = ()=>process(noDeadline);
function schedule(callback) {
    // NOTE if window isn't present and batching isn't explicitly enabled there will be no batching.
    if (typeof window === 'undefined' && globalThis.stateDisableBatching !== false || globalThis.stateDisableBatching === true) {
        callback(noDeadline);
        return;
    }
    if (window.requestIdleCallback) {
        return window.requestIdleCallback(callback);
    }
    // requestIdleCallback polyfill (not supported in Safari)
    // https://github.com/pladaria/requestidlecallback-polyfill
    // See react scheduler for better implementation.
    window.requestIdleCallback = window.requestIdleCallback || function idleCallbackPolyfill(innerCallback, _options) {
        const start = Date.now();
        setTimeout(()=>{
            innerCallback({
                didTimeout: false,
                timeRemaining () {
                    return Math.max(0, 50 - (Date.now() - start));
                }
            });
        }, 1);
        return 0;
    };
    window.cancelIdleCallback = window.cancelIdleCallback || function cancelIdleCallbackPolyfill(id) {
        clearTimeout(id);
    };
    return schedule(callback);
}
function process(deadline) {
    if (batching.updates.length === 0) {
        (0,helper/* log */.cM)('Trying to batch empty updates');
        return;
    }
    let shouldYield = false;
    let maxTries = 500;
    while(batching.updates.length > 0 && !shouldYield && maxTries > 0){
        maxTries -= 1;
        const update = batching.updates.shift();
        if (update) {
            (0,epic_state_plugin/* callPlugins */.xv)(update);
            // Filter out already applied updates.
            batching.updates = batching.updates.filter((potentialUpdate)=>potentialUpdate.property !== update.property || potentialUpdate.parent !== update.parent);
        }
        // Yield current rendering cycle if out of time.
        shouldYield = deadline.timeRemaining() < 1;
    }
    if (maxTries === 0) {
        (0,helper/* log */.cM)('Ran out of tries at process.', 'warning');
    }
    // Continuing to process in next iteration.
    if (batching.updates.length > 0) {
        schedule(process);
    }
    batching.scheduler = undefined;
}

;// CONCATENATED MODULE: ./node_modules/epic-state/data/polyfill.ts
function objectMap(state, entries, parent, root) {
    // Separate object referenced in methods, as type inference with this didn't work properly.
    const polyfill = {
        data: Array.from(entries || []),
        has (key) {
            return polyfill.data.some((p)=>p[0] === key);
        },
        set (key, value) {
            // TODO transform value to state polyfill.
            const record = polyfill.data.find((p)=>p[0] === key);
            if (record) {
                record[1] = value;
            } else {
                polyfill.data.push([
                    key,
                    value
                ]);
            }
            return polyfill;
        },
        get (key) {
            var _polyfill_data_find;
            return (_polyfill_data_find = polyfill.data.find((p)=>p[0] === key)) === null || _polyfill_data_find === void 0 ? void 0 : _polyfill_data_find[1];
        },
        delete (key) {
            const index = polyfill.data.findIndex((p)=>p[0] === key);
            if (index === -1) {
                return false;
            }
            polyfill.data.splice(index, 1);
            return true;
        },
        clear () {
            polyfill.data.splice(0);
        },
        get size () {
            return polyfill.data.length;
        },
        // biome-ignore lint/style/useNamingConvention: This is the JavaScript standard.
        toJSON () {
            return new Map(polyfill.data);
        },
        forEach (callback) {
            for (const p of polyfill.data){
                callback(p[1], p[0], polyfill);
            }
        },
        keys () {
            return polyfill.data.map((p)=>p[0]).values();
        },
        values () {
            return polyfill.data.map((p)=>p[1]).values();
        },
        entries () {
            return new Map(polyfill.data).entries();
        },
        get [Symbol.toStringTag] () {
            return 'Map';
        },
        [Symbol.iterator] () {
            return polyfill.entries();
        }
    };
    const map = state(polyfill, parent, root);
    Object.defineProperties(map, {
        data: {
            enumerable: false
        },
        size: {
            enumerable: false
        },
        // biome-ignore lint/style/useNamingConvention: This is the JavaScript standard.
        toJSON: {
            enumerable: false
        }
    });
    Object.seal(map);
    return map;
}
function objectSet(state, initialValues, parent, root) {
    const polyfill = {
        data: Array.from(new Set(initialValues)),
        has (value) {
            return polyfill.data.indexOf(value) !== -1;
        },
        add (value) {
            let hasProxy = false;
            if (typeof value === 'object' && value !== null) {
                // TODO why is it calling state to check if it has a proxy?
                hasProxy = polyfill.data.indexOf(state(value, polyfill)) !== -1;
            }
            if (polyfill.data.indexOf(value) === -1 && !hasProxy) {
                polyfill.data.push(value);
            }
            return polyfill;
        },
        delete (value) {
            const index = polyfill.data.indexOf(value);
            if (index === -1) {
                return false;
            }
            polyfill.data.splice(index, 1);
            return true;
        },
        clear () {
            polyfill.data.splice(0);
        },
        get size () {
            return polyfill.data.length;
        },
        forEach (callback) {
            for (const value of polyfill.data){
                callback(value, polyfill);
            }
        },
        get [Symbol.toStringTag] () {
            return 'Set';
        },
        // biome-ignore lint/style/useNamingConvention: This is the JavaScript standard.
        toJSON () {
            // TODO is a regular Set valid JSON?
            return new Set(polyfill.data);
        },
        [Symbol.iterator] () {
            return polyfill.data[Symbol.iterator]();
        },
        values () {
            return polyfill.data.values();
        },
        keys () {
            // for Set.keys is an alias for Set.values()
            return polyfill.data.values();
        },
        entries () {
            // array.entries returns [index, value] while Set [value, value]
            return new Set(polyfill.data).entries();
        }
    };
    const set = state(polyfill, parent, root);
    Object.defineProperties(set, {
        data: {
            enumerable: false
        },
        size: {
            enumerable: false
        },
        // biome-ignore lint/style/useNamingConvention: This is the JavaScript standard.
        toJSON: {
            enumerable: false
        }
    });
    Object.seal(set);
    return set;
}

;// CONCATENATED MODULE: ./node_modules/epic-state/derive.ts

const cache = new Map();
var derive_DependenciesState = /*#__PURE__*/ (/* unused pure expression or super */ null && (function(DependenciesState) {
    DependenciesState[DependenciesState["New"] = 0] = "New";
    DependenciesState[DependenciesState["Clean"] = 1] = "Clean";
    DependenciesState[DependenciesState["Dirty"] = 2] = "Dirty";
    return DependenciesState;
}(derive_DependenciesState || {})));
// TODO use tuple map from plugins.
// References properties on properties that were accessed during the tracking state
// and therefore need to be updated.
// TODO is there a way to clean these up later when dependencies are no longer tracked?
// parent -> property -> derived[]
const dependencies = new Map();
let tracking;
const isTracking = ()=>tracking !== undefined;
const track = (parent, property)=>{
    if (!isTracking()) {
        return;
    }
    if (!dependencies.has(parent)) {
        dependencies.set(parent, new Map());
    }
    const properties = dependencies.get(parent);
    if (properties.has(property)) {
        const derivations = properties.get(property);
        derivations.add(tracking);
    } else {
        properties.set(property, new Set([
            tracking
        ]));
    }
};
// TODO weird naming, used to set the state to dirty.
const isTracked = (parent, property)=>{
    if (!dependencies.has(parent)) {
        return;
    }
    const properties = dependencies.get(parent);
    if (!(properties === null || properties === void 0 ? void 0 : properties.has(property))) {
        return;
    }
    const derivations = properties.get(property);
    for (const derivation of derivations){
        derivation.state = 2;
    }
};
function derive(proxy) {
    const getters = (0,helper/* listGetters */.J1)(proxy);
    if (Object.keys(getters).length === 0) {
        return proxy;
    }
    for (const [key, getter] of Object.entries(getters)){
        function derived() {
            // Result has been cached already and dependencies are clean.
            if (derived.state === 1 && cache.has(derived)) {
                return cache.get(derived);
            }
            // Call getter for result while tracking dependencies accessed.
            tracking = derived;
            const result = getter();
            tracking = undefined;
            derived.state = 1;
            cache.set(derived, result);
            return result;
        }
        derived.state = 0;
        // Replace getter with wrapper method intercepting access.
        Object.defineProperty(proxy, key, {
            get: derived,
            enumerable: true,
            configurable: true
        });
    }
    return proxy;
}

// EXTERNAL MODULE: ./node_modules/epic-state/types.ts + 1 modules
var types = __webpack_require__(341);
;// CONCATENATED MODULE: ./node_modules/epic-state/index.ts
 // TODO import should be optional and not required, pass along with connect.











// Shared State, Map with links to all states created.
const proxyStateMap = new Map();
const refSet = new WeakSet();
const renderStateMap = new Map();
// proxy function renamed to state (proxy as hidden implementation detail).
// @ts-ignore TODO figure out if object will work as expected
function epic_state_state() {
    let initialObject = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, parent = arguments.length > 1 ? arguments[1] : void 0, root = arguments.length > 2 ? arguments[2] : void 0;
    var _Renderer_current, _Renderer_current1;
    if (((_Renderer_current = epic_jsx/* Renderer,current */.Th.current) === null || _Renderer_current === void 0 ? void 0 : _Renderer_current.id) && renderStateMap.has(epic_jsx/* Renderer,current,id */.Th.current.id)) {
        return renderStateMap.get(epic_jsx/* Renderer,current,id */.Th.current.id);
    }
    let initialization = true;
    if (typeof initialObject === 'function') {
        // biome-ignore lint/style/noParameterAssign: Much easier in this case.
        initialObject = initialObject();
    }
    if (!(0,helper/* isObject */.Kn)(initialObject)) {
        (0,helper/* log */.cM)('Only objects can be made observable with state()', 'error');
    }
    if (!parent && Object.hasOwn(initialObject, 'parent')) {
        (0,helper/* log */.cM)('"parent" property is reserved on state objects to reference the parent', 'warning');
    }
    if (!root && Object.hasOwn(initialObject, 'root')) {
        (0,helper/* log */.cM)('"root" property is reserved on state objects to reference the root', 'warning');
    }
    derive(initialObject);
    let plugins = [];
    const baseObject = (0,helper/* createBaseObject */.Kb)(initialObject);
    const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) // Unique identifier for proxy objects.
    ;
    const handler = {
        get (target, property, receiver) {
            if (property === 'parent') {
                return parent // Parent access untracked.
                ;
            }
            if (property === 'root') {
                return root // Root access untracked.
                ;
            }
            if (property === 'plugin') {
                return undefined // Plugin cannot be accessed or tracked.
                ;
            }
            if (property === '_plugin') {
                return plugins // Internal plugin access.
                ;
            }
            if (property === '_id') {
                return id;
            }
            if (property === 'addPlugin') {
                return (newPlugin)=>plugins.push(typeof newPlugin === 'function' ? newPlugin('initialize', proxyObject) : newPlugin) // Add plugins after initialization.
                ;
            }
            const value = Reflect.get(target, property, receiver);
            if (!initialization && typeof value !== 'function') {
                (0,epic_state_plugin/* callPlugins */.xv)({
                    type: types/* PluginAction,Get */.c.Get,
                    target: receiver,
                    initial: true,
                    property,
                    parent: receiver ?? root,
                    leaf: (0,helper/* isLeaf */.Be)(value),
                    value
                });
                track(root ?? receiver, property);
            }
            // Register receiver and property on custom data structures.
            // TODO should only be done on first access.
            if ((0,helper/* needsRegister */.d7)(value)) {
                ;
                value._register(receiver ?? root, property);
            }
            return value;
        },
        // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Difficult to fix, central part of the application.
        set (target, property, value, receiver) {
            if (property === 'parent' || property === 'root' || !initialization && property === 'plugin') {
                (0,helper/* log */.cM)(`"${property}" is reserved an cannot be changed`, 'warning');
                return false;
            }
            const previousValue = Reflect.get(target, property, receiver) // Reflect skips other traps.
            ;
            if (value === previousValue) {
                // Skip unchanged values.
                return true;
            }
            let nextValue = value;
            if (value instanceof Promise) {
                value.then((result)=>{
                    // @ts-ignore NOTE custom but common pattern
                    value.status = 'fulfilled';
                    // @ts-ignore
                    value.value = result;
                // TODO schedule update PluginAction.Resolve property, result
                }).catch((error)=>{
                    // @ts-ignore
                    value.status = 'rejected';
                    // @ts-ignore
                    value.reason = error;
                // TODO schedule update PluginAction.Reject property, error
                });
            } else {
                if (initialization && typeof value === 'function' && value.requiresInitialization) {
                    // Custom data structures.
                    const { data, after } = value(epic_state_state);
                    nextValue = data;
                    if (typeof after === 'function') {
                        after(nextValue);
                    }
                } else if (!proxyStateMap.has(value) && (0,helper/* canProxy */.$N)(value, refSet)) {
                    nextValue = epic_state_state(value, receiver, root ?? receiver);
                } else if ((0,helper/* canPolyfill */.u0)(value)) {
                    // TODO Necessary that Map or Set cannot be root?
                    if (value instanceof Map) {
                        nextValue = objectMap(epic_state_state, value, parent, root ?? receiver);
                    } else {
                        nextValue = objectSet(epic_state_state, value, parent, root ?? receiver);
                    }
                }
                const childProxyState = !refSet.has(nextValue) && proxyStateMap.get(nextValue);
                if (childProxyState) {
                // TODO what's child proxy state???
                }
            }
            // Call setters and getters on existing proxy.
            if (!initialization && typeof value === 'object' && typeof previousValue === 'object' && !Array.isArray(value)) {
                (0,helper/* updateProxyValues */.Ph)(previousValue, value);
                return true;
            }
            if (previousValue === undefined && !(0,helper/* isSetter */.n4)(target, property)) {
                Object.defineProperty(target, property, {
                    value: nextValue,
                    writable: true,
                    configurable: true
                });
            } else {
                Reflect.set(target, property, nextValue, receiver);
            }
            if (!initialization) {
                isTracked(root ?? receiver, property) // Mark changed values as "dirty" before plugins (rerenders).
                ;
                scheduleUpdate({
                    type: types/* PluginAction,Set */.c.Set,
                    target: receiver,
                    initial: true,
                    property,
                    parent: receiver ?? root,
                    value,
                    previousValue,
                    leaf: (0,helper/* isLeaf */.Be)(value)
                });
            }
            return true;
        },
        deleteProperty (target, property) {
            const previousValue = Reflect.get(target, property);
            const deleted = Reflect.deleteProperty(target, property);
            if (deleted) {
                // TODO no receiver, no parent access?
                scheduleUpdate({
                    type: types/* PluginAction,Delete */.c.Delete,
                    target: target,
                    initial: true,
                    property,
                    parent: proxyObject ?? root,
                    previousValue,
                    leaf: typeof previousValue !== 'object'
                });
            }
            return deleted;
        }
    };
    const proxyObject = (0,helper/* newProxy */.fm)(baseObject, handler);
    const proxyState = [
        baseObject
    ];
    proxyStateMap.set(proxyObject, proxyState);
    if ((_Renderer_current1 = epic_jsx/* Renderer,current */.Th.current) === null || _Renderer_current1 === void 0 ? void 0 : _Renderer_current1.id) {
        renderStateMap.set(epic_jsx/* Renderer,current,id */.Th.current.id, proxyObject);
    }
    for (const key of Reflect.ownKeys(initialObject)){
        const desc = Object.getOwnPropertyDescriptor(initialObject, key);
        if ('value' in desc) {
            proxyObject[key] = initialObject[key];
            // We need to delete desc.value because we already set it,
            // and delete desc.writable because we want to write it again.
            delete desc.value;
            delete desc.writable;
        }
        // This will recursively call the setter trap for any nested properties on the initialObject.
        Object.defineProperty(baseObject, key, desc);
    }
    // @ts-ignore
    plugins = (0,epic_state_plugin/* initializePlugins */.bP)(proxyObject, initialObject.plugin);
    initialization = false;
    return proxyObject;
}
function ref(obj) {
    refSet.add(obj);
    return obj;
}
function remove(proxyObject) {
    if (proxyStateMap.has(proxyObject)) {
        proxyStateMap.delete(proxyObject);
        return true;
    }
    return false;
}


}),
499: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  BA: () => (plugin),
  bP: () => (initializePlugins),
  xv: () => (callPlugins)
});
/* ESM import */var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(341);

const globalPlugins = [];
function initializePlugins(state, plugin) {
    if (!plugin) {
        return [] // Can also add plugins later using state.addPlugin(plugin)
        ;
    }
    const plugins = Array.isArray(plugin) ? plugin : [
        plugin
    ];
    return plugins.map((item)=>item('initialize', state));
}
// NOTE accessing values in here can also lead to recursive calls.
function callPlugins(param) {
    let { type, target, initial = false, ...options } = param;
    // Current plugin.
    if (target._plugin) {
        for (const item of target._plugin){
            const plugin = item[type];
            if (plugin && (item.all || options.leaf || type === _types__WEBPACK_IMPORTED_MODULE_0__/* .PluginAction.Delete */.c.Delete)) {
                // @ts-ignore Apply can also be used on arrow functions to override the this.
                plugin.call(item, options);
            }
        }
    }
    // TODO make plugin inheritance configurable.
    // Recursively invoke plugins found on parents (which are inherited).
    if (target.parent) {
        callPlugins({
            type,
            target: target.parent,
            ...options
        });
    }
    if (!initial) {
        return;
    }
    // Global plugins.
    for (const item of globalPlugins){
        const plugin = item[type];
        if (plugin && (item.all || options.leaf || type === _types__WEBPACK_IMPORTED_MODULE_0__/* .PluginAction.Delete */.c.Delete)) {
            // @ts-ignore
            plugin.call(item, options);
        }
    }
}
// Register global plugin.
function plugin(plugin) {
    const initializedPlugin = typeof plugin === 'function' ? plugin('initialize') : plugin;
    globalPlugins.push(initializedPlugin);
    return function removePlugin() {
        const remainingGlobalPlugins = globalPlugins.filter((currentPlugin)=>initializedPlugin !== currentPlugin);
        globalPlugins.splice(0, globalPlugins.length, ...remainingGlobalPlugins);
    };
}
function removeAllPlugins() {
    globalPlugins.length = 0;
} // TODO destroy an existing state object and it's associated plugins.


}),
983: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  $: () => (connect)
});
/* ESM import */var epic_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(653);
/* ESM import */var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(514);
/* ESM import */var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(341);



const connections = [];
function debug() {
    const lines = [];
    for (const [index, observedProperties] of connections.entries()){
        const keys = observedProperties.list();
        let line = '';
        line += `connect() ${index} - `;
        for (const key of keys){
            line += `State #${key[0]}: `;
            const properties = [
                ...key[1].entries()
            ];
            for (const property of properties){
                line += `"${String(property[0])}"`;
                const components = property[1];
                for (const component of components){
                    line += ` ${component.id} `;
                }
            }
        }
        lines.push(line);
    }
    return lines.join('\n');
}
const connect = (initialize)=>{
    if (initialize !== 'initialize') {
        (0,_helper__WEBPACK_IMPORTED_MODULE_0__/* .log */.cM)('connect plugin cannot be configured', 'warning');
    }
    const observedProperties = new _types__WEBPACK_IMPORTED_MODULE_1__/* .TupleArrayMap */.i();
    connections.push(observedProperties);
    return {
        set: (param)=>{
            let { property, parent: { _id: id }, value, previousValue } = param;
            if (value === previousValue) {
                return;
            }
            const components = observedProperties.get(id, property);
            // Remove, as get will be tracked again during render.
            if (observedProperties.has(id, property)) {
                observedProperties.delete(id, property);
            }
            // Trigger rerender on components.
            const renderedComponents = new Set();
            if (components) {
                for (const component of components){
                    // Check if already rendered
                    if (!renderedComponents.has(component.id)) {
                        component.rerender();
                        renderedComponents.add(component.id) // Mark as rendered
                        ;
                    }
                }
            }
            // TODO This will trigger a rerender, probably better to add an interface specific to this.
            (0,epic_jsx__WEBPACK_IMPORTED_MODULE_2__/* .getRoots */.Lt)();
        },
        get: (param)=>{
            let { property, parent: { _id: id } } = param;
            if (!epic_jsx__WEBPACK_IMPORTED_MODULE_2__/* .Renderer.current */.Th.current) {
                return; // Accessed outside a component.
            }
            const { component } = epic_jsx__WEBPACK_IMPORTED_MODULE_2__/* .Renderer.current */.Th.current;
            if (!(component === null || component === void 0 ? void 0 : component.rerender)) {
                (0,_helper__WEBPACK_IMPORTED_MODULE_0__/* .log */.cM)('Cannot rerender epic-jsx component', 'warning');
                return;
            }
            // Register rerender on current component.
            if (observedProperties.has(id, property)) {
                const components = observedProperties.get(id, property);
                const alreadyRegistered = components === null || components === void 0 ? void 0 : components.some((value)=>value.id === component.id);
                if (!alreadyRegistered) {
                    components === null || components === void 0 ? void 0 : components.push(component);
                }
            } else {
                observedProperties.add(id, property, component);
            }
        },
        delete: ()=>{
        // TODO remove observation and trigger rerender
        }
    };
};


}),
341: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  i: () => (/* binding */ TupleArrayMap),
  c: () => (/* binding */ types_PluginAction)
});

;// CONCATENATED MODULE: ./node_modules/@swc/helpers/esm/_define_property.js
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else obj[key] = value;

    return obj;
}


;// CONCATENATED MODULE: ./node_modules/epic-state/types.ts

var types_PluginAction = /*#__PURE__*/ function(PluginAction) {
    PluginAction["Get"] = "get";
    PluginAction["Set"] = "set";
    PluginAction["Delete"] = "delete";
    return PluginAction;
}({});
class TupleArrayMap {
    has(firstKey, secondKey) {
        var _this_observedProperties_get;
        return !!(this.observedProperties.has(firstKey) && ((_this_observedProperties_get = this.observedProperties.get(firstKey)) === null || _this_observedProperties_get === void 0 ? void 0 : _this_observedProperties_get.has(secondKey)));
    }
    get(firstKey, secondKey) {
        var _this_observedProperties_get;
        return this.has(firstKey, secondKey) ? (_this_observedProperties_get = this.observedProperties.get(firstKey)) === null || _this_observedProperties_get === void 0 ? void 0 : _this_observedProperties_get.get(secondKey) : undefined;
    }
    add(firstKey, secondKey, value) {
        var _this_observedProperties_get, _this_observedProperties_get_get, _this_observedProperties_get1;
        if (!this.observedProperties.has(firstKey)) {
            this.observedProperties.set(firstKey, new Map());
        }
        if (!((_this_observedProperties_get = this.observedProperties.get(firstKey)) === null || _this_observedProperties_get === void 0 ? void 0 : _this_observedProperties_get.has(secondKey))) {
            var _this_observedProperties_get2;
            (_this_observedProperties_get2 = this.observedProperties.get(firstKey)) === null || _this_observedProperties_get2 === void 0 ? void 0 : _this_observedProperties_get2.set(secondKey, []);
        }
        (_this_observedProperties_get1 = this.observedProperties.get(firstKey)) === null || _this_observedProperties_get1 === void 0 ? void 0 : (_this_observedProperties_get_get = _this_observedProperties_get1.get(secondKey)) === null || _this_observedProperties_get_get === void 0 ? void 0 : _this_observedProperties_get_get.push(value);
    }
    delete(firstKey, secondKey) {
        if (this.observedProperties.has(firstKey)) {
            const properties = this.observedProperties.get(firstKey);
            if (properties === null || properties === void 0 ? void 0 : properties.has(secondKey)) {
                properties.delete(secondKey);
            }
        }
    }
    clear() {
        this.observedProperties.clear();
    }
    list() {
        return [
            ...this.observedProperties.entries()
        ];
    }
    constructor(){
        _define_property(this, "observedProperties", new Map());
    }
}


}),
224: (function (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  U: () => (create)
});
/* ESM import */var debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(296);
// index.ts


// ansi.ts
var textColors = {
  black: "\x1B[30m",
  red: "\x1B[31m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  blue: "\x1B[34m",
  magenta: "\x1B[35m",
  cyan: "\x1B[36m",
  white: "\x1B[37m",
  gray: "\x1B[90m",
  grey: "\x1B[90m",
  redBright: "\x1B[91m",
  greenBright: "\x1B[92m",
  yellowBright: "\x1B[93m",
  blueBright: "\x1B[94m",
  magentaBright: "\x1B[95m",
  cyanBright: "\x1B[96m",
  whiteBright: "\x1B[97m",
  // Custom
  darkOrange: "\x1B[38;5;208m",
  orange: "\x1B[38;5;214m"
};
var bold = (text) => `\x1B[1m${text}\x1B[0m`;
var textColor = (color, text) => `${textColors[color]}${text}\x1B[0m`;

// index.ts
var log = (message, options) => {
  const namespace = textColor(options.color, bold(options.name));
  const last = typeof message === "string" ? message.slice(-1) : ".";
  const end = [".", "!", "?", "\n"].includes(last) ? "" : ".";
  const newLine = options.newLine ? "\n" : "";
  if (options.type === "error") {
    console.error(`${namespace} ${textColor("red", bold("Error"))} ${message}${end}${newLine}`);
    if (typeof process !== "undefined") {
      process.exit(0);
    } else {
      throw new Error(message);
    }
    return;
  }
  if (options.type === "warning") {
    console.warn(`${namespace} ${textColor("darkOrange", "Warning")} ${message}${end}${newLine}`);
    return;
  }
  console.log(`${namespace} ${message}${end}${newLine}`);
};
var Groups = /* @__PURE__ */ new Map();
var groupLog = (singleMessage, options) => {
  const { count } = Groups.get(options.group);
  let message = options.groupMessage;
  if (count < 2) {
    message = singleMessage;
  }
  if (count > 1 && typeof message === "function") {
    message = message(count);
  }
  Groups.delete(options.group);
  log(message, options);
};
var create = (name, color = "gray", newLine = false) => {
  if (!name) {
    console.error(
      `${textColor("gray", bold("logua"))} ${textColor(
        "red",
        bold("Error")
      )} No name provided to create(name, color = 'gray', newLine = false).`
    );
  }
  return function logMessage(message, options) {
    const defaultOptions = {
      name,
      color,
      type: !options || typeof options === "string" ? options : options.type,
      newLine
    };
    if (typeof options === "object") {
      Object.assign(defaultOptions, options);
    }
    if (typeof options === "object" && options.group) {
      if (!Groups.has(options.group)) {
        Groups.set(options.group, {
          handler: debounce__WEBPACK_IMPORTED_MODULE_0__(groupLog, options.timeout || 50),
          count: 1
        });
      } else {
        Groups.get(options.group).count += 1;
      }
      Groups.get(options.group).handler(message, defaultOptions);
      return;
    }
    log(message, defaultOptions);
  };
};

//# sourceMappingURL=index.js.map


}),
806: (function () {
"use strict";

// UNUSED EXPORTS: lazy, ZodReadonly, ZodUnion, quotelessJson, ZodTransformer, isValid, Schema, onumber, getParsedType, ZodFunction, optional, symbol, void, nullable, ZodPipeline, map, ZodEffects, never, undefined, z, ZodRecord, ZodError, ZodTuple, ZodNullable, pipeline, record, nativeEnum, setErrorMap, union, object, ZodNever, DIRTY, EMPTY_PATH, ZodArray, ZodSymbol, ZodEnum, ZodString, ZodNumber, objectUtil, preprocess, ZodObject, tuple, ZodUndefined, ZodCatch, coerce, defaultErrorMap, ZodSchema, boolean, literal, ZodMap, datetimeRegex, INVALID, intersection, oboolean, NEVER, any, ZodIssueCode, ZodNativeEnum, ZodNaN, ZodDate, ZodBigInt, ZodNull, custom, effect, instanceof, late, ZodFirstPartyTypeKind, util, set, ZodVoid, date, number, getErrorMap, addIssueToContext, null, strictObject, string, ZodLazy, ZodLiteral, isAsync, ZodBranded, promise, BRAND, ParseStatus, ZodSet, bigint, transformer, ZodDefault, OK, default, discriminatedUnion, ZodIntersection, ZodPromise, ZodParsedType, ZodUnknown, function, ZodBoolean, ZodAny, isAborted, isDirty, nan, ostring, unknown, array, ZodDiscriminatedUnion, makeIssue, ZodOptional, ZodType, enum

;// CONCATENATED MODULE: ../node_modules/zod/dist/esm/v3/helpers/util.js
var util_util;
(function (util) {
    util.assertEqual = (_) => { };
    function assertIs(_arg) { }
    util.assertIs = assertIs;
    function assertNever(_x) {
        throw new Error();
    }
    util.assertNever = assertNever;
    util.arrayToEnum = (items) => {
        const obj = {};
        for (const item of items) {
            obj[item] = item;
        }
        return obj;
    };
    util.getValidEnumValues = (obj) => {
        const validKeys = util.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
        const filtered = {};
        for (const k of validKeys) {
            filtered[k] = obj[k];
        }
        return util.objectValues(filtered);
    };
    util.objectValues = (obj) => {
        return util.objectKeys(obj).map(function (e) {
            return obj[e];
        });
    };
    util.objectKeys = typeof Object.keys === "function" // eslint-disable-line ban/ban
        ? (obj) => Object.keys(obj) // eslint-disable-line ban/ban
        : (object) => {
            const keys = [];
            for (const key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                    keys.push(key);
                }
            }
            return keys;
        };
    util.find = (arr, checker) => {
        for (const item of arr) {
            if (checker(item))
                return item;
        }
        return undefined;
    };
    util.isInteger = typeof Number.isInteger === "function"
        ? (val) => Number.isInteger(val) // eslint-disable-line ban/ban
        : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
    function joinValues(array, separator = " | ") {
        return array.map((val) => (typeof val === "string" ? `'${val}'` : val)).join(separator);
    }
    util.joinValues = joinValues;
    util.jsonStringifyReplacer = (_, value) => {
        if (typeof value === "bigint") {
            return value.toString();
        }
        return value;
    };
})(util_util || (util_util = {}));
var util_objectUtil;
(function (objectUtil) {
    objectUtil.mergeShapes = (first, second) => {
        return {
            ...first,
            ...second, // second overwrites first
        };
    };
})(util_objectUtil || (util_objectUtil = {}));
const ZodParsedType = util_util.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set",
]);
const getParsedType = (data) => {
    const t = typeof data;
    switch (t) {
        case "undefined":
            return ZodParsedType.undefined;
        case "string":
            return ZodParsedType.string;
        case "number":
            return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
        case "boolean":
            return ZodParsedType.boolean;
        case "function":
            return ZodParsedType.function;
        case "bigint":
            return ZodParsedType.bigint;
        case "symbol":
            return ZodParsedType.symbol;
        case "object":
            if (Array.isArray(data)) {
                return ZodParsedType.array;
            }
            if (data === null) {
                return ZodParsedType.null;
            }
            if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
                return ZodParsedType.promise;
            }
            if (typeof Map !== "undefined" && data instanceof Map) {
                return ZodParsedType.map;
            }
            if (typeof Set !== "undefined" && data instanceof Set) {
                return ZodParsedType.set;
            }
            if (typeof Date !== "undefined" && data instanceof Date) {
                return ZodParsedType.date;
            }
            return ZodParsedType.object;
        default:
            return ZodParsedType.unknown;
    }
};

;// CONCATENATED MODULE: ../node_modules/zod/dist/esm/v3/ZodError.js

const ZodIssueCode = util_util.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
    "not_finite",
]);
const quotelessJson = (obj) => {
    const json = JSON.stringify(obj, null, 2);
    return json.replace(/"([^"]+)":/g, "$1:");
};
class ZodError extends Error {
    get errors() {
        return this.issues;
    }
    constructor(issues) {
        super();
        this.issues = [];
        this.addIssue = (sub) => {
            this.issues = [...this.issues, sub];
        };
        this.addIssues = (subs = []) => {
            this.issues = [...this.issues, ...subs];
        };
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            // eslint-disable-next-line ban/ban
            Object.setPrototypeOf(this, actualProto);
        }
        else {
            this.__proto__ = actualProto;
        }
        this.name = "ZodError";
        this.issues = issues;
    }
    format(_mapper) {
        const mapper = _mapper ||
            function (issue) {
                return issue.message;
            };
        const fieldErrors = { _errors: [] };
        const processError = (error) => {
            for (const issue of error.issues) {
                if (issue.code === "invalid_union") {
                    issue.unionErrors.map(processError);
                }
                else if (issue.code === "invalid_return_type") {
                    processError(issue.returnTypeError);
                }
                else if (issue.code === "invalid_arguments") {
                    processError(issue.argumentsError);
                }
                else if (issue.path.length === 0) {
                    fieldErrors._errors.push(mapper(issue));
                }
                else {
                    let curr = fieldErrors;
                    let i = 0;
                    while (i < issue.path.length) {
                        const el = issue.path[i];
                        const terminal = i === issue.path.length - 1;
                        if (!terminal) {
                            curr[el] = curr[el] || { _errors: [] };
                            // if (typeof el === "string") {
                            //   curr[el] = curr[el] || { _errors: [] };
                            // } else if (typeof el === "number") {
                            //   const errorArray: any = [];
                            //   errorArray._errors = [];
                            //   curr[el] = curr[el] || errorArray;
                            // }
                        }
                        else {
                            curr[el] = curr[el] || { _errors: [] };
                            curr[el]._errors.push(mapper(issue));
                        }
                        curr = curr[el];
                        i++;
                    }
                }
            }
        };
        processError(this);
        return fieldErrors;
    }
    static assert(value) {
        if (!(value instanceof ZodError)) {
            throw new Error(`Not a ZodError: ${value}`);
        }
    }
    toString() {
        return this.message;
    }
    get message() {
        return JSON.stringify(this.issues, util_util.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
        return this.issues.length === 0;
    }
    flatten(mapper = (issue) => issue.message) {
        const fieldErrors = {};
        const formErrors = [];
        for (const sub of this.issues) {
            if (sub.path.length > 0) {
                fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
                fieldErrors[sub.path[0]].push(mapper(sub));
            }
            else {
                formErrors.push(mapper(sub));
            }
        }
        return { formErrors, fieldErrors };
    }
    get formErrors() {
        return this.flatten();
    }
}
ZodError.create = (issues) => {
    const error = new ZodError(issues);
    return error;
};

;// CONCATENATED MODULE: ../node_modules/zod/dist/esm/v3/locales/en.js


const en_errorMap = (issue, _ctx) => {
    let message;
    switch (issue.code) {
        case ZodIssueCode.invalid_type:
            if (issue.received === ZodParsedType.undefined) {
                message = "Required";
            }
            else {
                message = `Expected ${issue.expected}, received ${issue.received}`;
            }
            break;
        case ZodIssueCode.invalid_literal:
            message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util_util.jsonStringifyReplacer)}`;
            break;
        case ZodIssueCode.unrecognized_keys:
            message = `Unrecognized key(s) in object: ${util_util.joinValues(issue.keys, ", ")}`;
            break;
        case ZodIssueCode.invalid_union:
            message = `Invalid input`;
            break;
        case ZodIssueCode.invalid_union_discriminator:
            message = `Invalid discriminator value. Expected ${util_util.joinValues(issue.options)}`;
            break;
        case ZodIssueCode.invalid_enum_value:
            message = `Invalid enum value. Expected ${util_util.joinValues(issue.options)}, received '${issue.received}'`;
            break;
        case ZodIssueCode.invalid_arguments:
            message = `Invalid function arguments`;
            break;
        case ZodIssueCode.invalid_return_type:
            message = `Invalid function return type`;
            break;
        case ZodIssueCode.invalid_date:
            message = `Invalid date`;
            break;
        case ZodIssueCode.invalid_string:
            if (typeof issue.validation === "object") {
                if ("includes" in issue.validation) {
                    message = `Invalid input: must include "${issue.validation.includes}"`;
                    if (typeof issue.validation.position === "number") {
                        message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
                    }
                }
                else if ("startsWith" in issue.validation) {
                    message = `Invalid input: must start with "${issue.validation.startsWith}"`;
                }
                else if ("endsWith" in issue.validation) {
                    message = `Invalid input: must end with "${issue.validation.endsWith}"`;
                }
                else {
                    util_util.assertNever(issue.validation);
                }
            }
            else if (issue.validation !== "regex") {
                message = `Invalid ${issue.validation}`;
            }
            else {
                message = "Invalid";
            }
            break;
        case ZodIssueCode.too_small:
            if (issue.type === "array")
                message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
            else if (issue.type === "string")
                message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
            else if (issue.type === "number")
                message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
            else if (issue.type === "date")
                message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
            else
                message = "Invalid input";
            break;
        case ZodIssueCode.too_big:
            if (issue.type === "array")
                message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
            else if (issue.type === "string")
                message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
            else if (issue.type === "number")
                message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
            else if (issue.type === "bigint")
                message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
            else if (issue.type === "date")
                message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
            else
                message = "Invalid input";
            break;
        case ZodIssueCode.custom:
            message = `Invalid input`;
            break;
        case ZodIssueCode.invalid_intersection_types:
            message = `Intersection results could not be merged`;
            break;
        case ZodIssueCode.not_multiple_of:
            message = `Number must be a multiple of ${issue.multipleOf}`;
            break;
        case ZodIssueCode.not_finite:
            message = "Number must be finite";
            break;
        default:
            message = _ctx.defaultError;
            util_util.assertNever(issue);
    }
    return { message };
};
/* ESM default export */ const en = (en_errorMap);

;// CONCATENATED MODULE: ../node_modules/zod/dist/esm/v3/errors.js

let overrideErrorMap = en;

function setErrorMap(map) {
    overrideErrorMap = map;
}
function getErrorMap() {
    return overrideErrorMap;
}

;// CONCATENATED MODULE: ../node_modules/zod/dist/esm/v3/helpers/parseUtil.js


const makeIssue = (params) => {
    const { data, path, errorMaps, issueData } = params;
    const fullPath = [...path, ...(issueData.path || [])];
    const fullIssue = {
        ...issueData,
        path: fullPath,
    };
    if (issueData.message !== undefined) {
        return {
            ...issueData,
            path: fullPath,
            message: issueData.message,
        };
    }
    let errorMessage = "";
    const maps = errorMaps
        .filter((m) => !!m)
        .slice()
        .reverse();
    for (const map of maps) {
        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
    }
    return {
        ...issueData,
        path: fullPath,
        message: errorMessage,
    };
};
const EMPTY_PATH = (/* unused pure expression or super */ null && ([]));
function addIssueToContext(ctx, issueData) {
    const overrideMap = getErrorMap();
    const issue = makeIssue({
        issueData: issueData,
        data: ctx.data,
        path: ctx.path,
        errorMaps: [
            ctx.common.contextualErrorMap, // contextual error map is first priority
            ctx.schemaErrorMap, // then schema-bound map if available
            overrideMap, // then global override map
            overrideMap === en ? undefined : en, // then global default map
        ].filter((x) => !!x),
    });
    ctx.common.issues.push(issue);
}
class ParseStatus {
    constructor() {
        this.value = "valid";
    }
    dirty() {
        if (this.value === "valid")
            this.value = "dirty";
    }
    abort() {
        if (this.value !== "aborted")
            this.value = "aborted";
    }
    static mergeArray(status, results) {
        const arrayValue = [];
        for (const s of results) {
            if (s.status === "aborted")
                return parseUtil_INVALID;
            if (s.status === "dirty")
                status.dirty();
            arrayValue.push(s.value);
        }
        return { status: status.value, value: arrayValue };
    }
    static async mergeObjectAsync(status, pairs) {
        const syncPairs = [];
        for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            syncPairs.push({
                key,
                value,
            });
        }
        return ParseStatus.mergeObjectSync(status, syncPairs);
    }
    static mergeObjectSync(status, pairs) {
        const finalObject = {};
        for (const pair of pairs) {
            const { key, value } = pair;
            if (key.status === "aborted")
                return parseUtil_INVALID;
            if (value.status === "aborted")
                return parseUtil_INVALID;
            if (key.status === "dirty")
                status.dirty();
            if (value.status === "dirty")
                status.dirty();
            if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
                finalObject[key.value] = value.value;
            }
        }
        return { status: status.value, value: finalObject };
    }
}
const parseUtil_INVALID = Object.freeze({
    status: "aborted",
});
const DIRTY = (value) => ({ status: "dirty", value });
const OK = (value) => ({ status: "valid", value });
const isAborted = (x) => x.status === "aborted";
const isDirty = (x) => x.status === "dirty";
const isValid = (x) => x.status === "valid";
const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

;// CONCATENATED MODULE: ../node_modules/zod/dist/esm/v3/helpers/errorUtil.js
var errorUtil_errorUtil;
(function (errorUtil) {
    errorUtil.errToObj = (message) => typeof message === "string" ? { message } : message || {};
    // biome-ignore lint:
    errorUtil.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil_errorUtil || (errorUtil_errorUtil = {}));

;// CONCATENATED MODULE: ../node_modules/zod/dist/esm/v3/types.js
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ZodEnum_cache, _ZodNativeEnum_cache;





class ParseInputLazyPath {
    constructor(parent, value, path, key) {
        this._cachedPath = [];
        this.parent = parent;
        this.data = value;
        this._path = path;
        this._key = key;
    }
    get path() {
        if (!this._cachedPath.length) {
            if (Array.isArray(this._key)) {
                this._cachedPath.push(...this._path, ...this._key);
            }
            else {
                this._cachedPath.push(...this._path, this._key);
            }
        }
        return this._cachedPath;
    }
}
const handleResult = (ctx, result) => {
    if (isValid(result)) {
        return { success: true, data: result.value };
    }
    else {
        if (!ctx.common.issues.length) {
            throw new Error("Validation failed but no issues detected.");
        }
        return {
            success: false,
            get error() {
                if (this._error)
                    return this._error;
                const error = new ZodError(ctx.common.issues);
                this._error = error;
                return this._error;
            },
        };
    }
};
function processCreateParams(params) {
    if (!params)
        return {};
    const { errorMap, invalid_type_error, required_error, description } = params;
    if (errorMap && (invalid_type_error || required_error)) {
        throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    }
    if (errorMap)
        return { errorMap: errorMap, description };
    const customMap = (iss, ctx) => {
        const { message } = params;
        if (iss.code === "invalid_enum_value") {
            return { message: message ?? ctx.defaultError };
        }
        if (typeof ctx.data === "undefined") {
            return { message: message ?? required_error ?? ctx.defaultError };
        }
        if (iss.code !== "invalid_type")
            return { message: ctx.defaultError };
        return { message: message ?? invalid_type_error ?? ctx.defaultError };
    };
    return { errorMap: customMap, description };
}
class ZodType {
    get description() {
        return this._def.description;
    }
    _getType(input) {
        return getParsedType(input.data);
    }
    _getOrReturnCtx(input, ctx) {
        return (ctx || {
            common: input.parent.common,
            data: input.data,
            parsedType: getParsedType(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent,
        });
    }
    _processInputParams(input) {
        return {
            status: new ParseStatus(),
            ctx: {
                common: input.parent.common,
                data: input.data,
                parsedType: getParsedType(input.data),
                schemaErrorMap: this._def.errorMap,
                path: input.path,
                parent: input.parent,
            },
        };
    }
    _parseSync(input) {
        const result = this._parse(input);
        if (isAsync(result)) {
            throw new Error("Synchronous parse encountered promise.");
        }
        return result;
    }
    _parseAsync(input) {
        const result = this._parse(input);
        return Promise.resolve(result);
    }
    parse(data, params) {
        const result = this.safeParse(data, params);
        if (result.success)
            return result.data;
        throw result.error;
    }
    safeParse(data, params) {
        const ctx = {
            common: {
                issues: [],
                async: params?.async ?? false,
                contextualErrorMap: params?.errorMap,
            },
            path: params?.path || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: getParsedType(data),
        };
        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
        return handleResult(ctx, result);
    }
    "~validate"(data) {
        const ctx = {
            common: {
                issues: [],
                async: !!this["~standard"].async,
            },
            path: [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: getParsedType(data),
        };
        if (!this["~standard"].async) {
            try {
                const result = this._parseSync({ data, path: [], parent: ctx });
                return isValid(result)
                    ? {
                        value: result.value,
                    }
                    : {
                        issues: ctx.common.issues,
                    };
            }
            catch (err) {
                if (err?.message?.toLowerCase()?.includes("encountered")) {
                    this["~standard"].async = true;
                }
                ctx.common = {
                    issues: [],
                    async: true,
                };
            }
        }
        return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result)
            ? {
                value: result.value,
            }
            : {
                issues: ctx.common.issues,
            });
    }
    async parseAsync(data, params) {
        const result = await this.safeParseAsync(data, params);
        if (result.success)
            return result.data;
        throw result.error;
    }
    async safeParseAsync(data, params) {
        const ctx = {
            common: {
                issues: [],
                contextualErrorMap: params?.errorMap,
                async: true,
            },
            path: params?.path || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: getParsedType(data),
        };
        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
        const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
        return handleResult(ctx, result);
    }
    refine(check, message) {
        const getIssueProperties = (val) => {
            if (typeof message === "string" || typeof message === "undefined") {
                return { message };
            }
            else if (typeof message === "function") {
                return message(val);
            }
            else {
                return message;
            }
        };
        return this._refinement((val, ctx) => {
            const result = check(val);
            const setError = () => ctx.addIssue({
                code: ZodIssueCode.custom,
                ...getIssueProperties(val),
            });
            if (typeof Promise !== "undefined" && result instanceof Promise) {
                return result.then((data) => {
                    if (!data) {
                        setError();
                        return false;
                    }
                    else {
                        return true;
                    }
                });
            }
            if (!result) {
                setError();
                return false;
            }
            else {
                return true;
            }
        });
    }
    refinement(check, refinementData) {
        return this._refinement((val, ctx) => {
            if (!check(val)) {
                ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
                return false;
            }
            else {
                return true;
            }
        });
    }
    _refinement(refinement) {
        return new ZodEffects({
            schema: this,
            typeName: types_ZodFirstPartyTypeKind.ZodEffects,
            effect: { type: "refinement", refinement },
        });
    }
    superRefine(refinement) {
        return this._refinement(refinement);
    }
    constructor(def) {
        /** Alias of safeParseAsync */
        this.spa = this.safeParseAsync;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.brand = this.brand.bind(this);
        this.default = this.default.bind(this);
        this.catch = this.catch.bind(this);
        this.describe = this.describe.bind(this);
        this.pipe = this.pipe.bind(this);
        this.readonly = this.readonly.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
        this["~standard"] = {
            version: 1,
            vendor: "zod",
            validate: (data) => this["~validate"](data),
        };
    }
    optional() {
        return ZodOptional.create(this, this._def);
    }
    nullable() {
        return ZodNullable.create(this, this._def);
    }
    nullish() {
        return this.nullable().optional();
    }
    array() {
        return ZodArray.create(this);
    }
    promise() {
        return ZodPromise.create(this, this._def);
    }
    or(option) {
        return ZodUnion.create([this, option], this._def);
    }
    and(incoming) {
        return ZodIntersection.create(this, incoming, this._def);
    }
    transform(transform) {
        return new ZodEffects({
            ...processCreateParams(this._def),
            schema: this,
            typeName: types_ZodFirstPartyTypeKind.ZodEffects,
            effect: { type: "transform", transform },
        });
    }
    default(def) {
        const defaultValueFunc = typeof def === "function" ? def : () => def;
        return new ZodDefault({
            ...processCreateParams(this._def),
            innerType: this,
            defaultValue: defaultValueFunc,
            typeName: types_ZodFirstPartyTypeKind.ZodDefault,
        });
    }
    brand() {
        return new ZodBranded({
            typeName: types_ZodFirstPartyTypeKind.ZodBranded,
            type: this,
            ...processCreateParams(this._def),
        });
    }
    catch(def) {
        const catchValueFunc = typeof def === "function" ? def : () => def;
        return new ZodCatch({
            ...processCreateParams(this._def),
            innerType: this,
            catchValue: catchValueFunc,
            typeName: types_ZodFirstPartyTypeKind.ZodCatch,
        });
    }
    describe(description) {
        const This = this.constructor;
        return new This({
            ...this._def,
            description,
        });
    }
    pipe(target) {
        return ZodPipeline.create(this, target);
    }
    readonly() {
        return ZodReadonly.create(this);
    }
    isOptional() {
        return this.safeParse(undefined).success;
    }
    isNullable() {
        return this.safeParse(null).success;
    }
}
const cuidRegex = /^c[^\s-]{8,}$/i;
const cuid2Regex = /^[0-9a-z]+$/;
const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
// const uuidRegex =
//   /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
const nanoidRegex = /^[a-z0-9_-]{21}$/i;
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
const durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
// from https://stackoverflow.com/a/46181/1550155
// old version: too slow, didn't support unicode
// const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
//old email regex
// const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((?!-)([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{1,})[^-<>()[\].,;:\s@"]$/i;
// eslint-disable-next-line
// const emailRegex =
//   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/;
// const emailRegex =
//   /^[a-zA-Z0-9\.\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// const emailRegex =
//   /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
// const emailRegex =
//   /^[a-z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9\-]+)*$/i;
// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
let emojiRegex;
// faster, simpler, safer
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
// const ipv6Regex =
// /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
const ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
// https://base64.guru/standards/base64url
const base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
// simple
// const dateRegexSource = `\\d{4}-\\d{2}-\\d{2}`;
// no leap year validation
// const dateRegexSource = `\\d{4}-((0[13578]|10|12)-31|(0[13-9]|1[0-2])-30|(0[1-9]|1[0-2])-(0[1-9]|1\\d|2\\d))`;
// with leap year validation
const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
    let secondsRegexSource = `[0-5]\\d`;
    if (args.precision) {
        secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
    }
    else if (args.precision == null) {
        secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
    }
    const secondsQuantifier = args.precision ? "+" : "?"; // require seconds if precision is nonzero
    return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
    return new RegExp(`^${timeRegexSource(args)}$`);
}
// Adapted from https://stackoverflow.com/a/3143231
function datetimeRegex(args) {
    let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
    const opts = [];
    opts.push(args.local ? `Z?` : `Z`);
    if (args.offset)
        opts.push(`([+-]\\d{2}:?\\d{2})`);
    regex = `${regex}(${opts.join("|")})`;
    return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
    if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
        return true;
    }
    if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
        return true;
    }
    return false;
}
function isValidJWT(jwt, alg) {
    if (!jwtRegex.test(jwt))
        return false;
    try {
        const [header] = jwt.split(".");
        // Convert base64url to base64
        const base64 = header
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .padEnd(header.length + ((4 - (header.length % 4)) % 4), "=");
        const decoded = JSON.parse(atob(base64));
        if (typeof decoded !== "object" || decoded === null)
            return false;
        if ("typ" in decoded && decoded?.typ !== "JWT")
            return false;
        if (!decoded.alg)
            return false;
        if (alg && decoded.alg !== alg)
            return false;
        return true;
    }
    catch {
        return false;
    }
}
function isValidCidr(ip, version) {
    if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
        return true;
    }
    if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
        return true;
    }
    return false;
}
class ZodString extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = String(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.string) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.string,
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        const status = new ParseStatus();
        let ctx = undefined;
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                if (input.data.length < check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        minimum: check.value,
                        type: "string",
                        inclusive: true,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                if (input.data.length > check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        maximum: check.value,
                        type: "string",
                        inclusive: true,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "length") {
                const tooBig = input.data.length > check.value;
                const tooSmall = input.data.length < check.value;
                if (tooBig || tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    if (tooBig) {
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_big,
                            maximum: check.value,
                            type: "string",
                            inclusive: true,
                            exact: true,
                            message: check.message,
                        });
                    }
                    else if (tooSmall) {
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_small,
                            minimum: check.value,
                            type: "string",
                            inclusive: true,
                            exact: true,
                            message: check.message,
                        });
                    }
                    status.dirty();
                }
            }
            else if (check.kind === "email") {
                if (!emailRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "email",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "emoji") {
                if (!emojiRegex) {
                    emojiRegex = new RegExp(_emojiRegex, "u");
                }
                if (!emojiRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "emoji",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "uuid") {
                if (!uuidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "uuid",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "nanoid") {
                if (!nanoidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "nanoid",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "cuid") {
                if (!cuidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "cuid",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "cuid2") {
                if (!cuid2Regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "cuid2",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "ulid") {
                if (!ulidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "ulid",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "url") {
                try {
                    new URL(input.data);
                }
                catch {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "url",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "regex") {
                check.regex.lastIndex = 0;
                const testResult = check.regex.test(input.data);
                if (!testResult) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "regex",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "trim") {
                input.data = input.data.trim();
            }
            else if (check.kind === "includes") {
                if (!input.data.includes(check.value, check.position)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: { includes: check.value, position: check.position },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "toLowerCase") {
                input.data = input.data.toLowerCase();
            }
            else if (check.kind === "toUpperCase") {
                input.data = input.data.toUpperCase();
            }
            else if (check.kind === "startsWith") {
                if (!input.data.startsWith(check.value)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: { startsWith: check.value },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "endsWith") {
                if (!input.data.endsWith(check.value)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: { endsWith: check.value },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "datetime") {
                const regex = datetimeRegex(check);
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: "datetime",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "date") {
                const regex = dateRegex;
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: "date",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "time") {
                const regex = timeRegex(check);
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: "time",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "duration") {
                if (!durationRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "duration",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "ip") {
                if (!isValidIP(input.data, check.version)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "ip",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "jwt") {
                if (!isValidJWT(input.data, check.alg)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "jwt",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "cidr") {
                if (!isValidCidr(input.data, check.version)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "cidr",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "base64") {
                if (!base64Regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "base64",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "base64url") {
                if (!base64urlRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "base64url",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util_util.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    _regex(regex, validation, message) {
        return this.refinement((data) => regex.test(data), {
            validation,
            code: ZodIssueCode.invalid_string,
            ...errorUtil_errorUtil.errToObj(message),
        });
    }
    _addCheck(check) {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    email(message) {
        return this._addCheck({ kind: "email", ...errorUtil_errorUtil.errToObj(message) });
    }
    url(message) {
        return this._addCheck({ kind: "url", ...errorUtil_errorUtil.errToObj(message) });
    }
    emoji(message) {
        return this._addCheck({ kind: "emoji", ...errorUtil_errorUtil.errToObj(message) });
    }
    uuid(message) {
        return this._addCheck({ kind: "uuid", ...errorUtil_errorUtil.errToObj(message) });
    }
    nanoid(message) {
        return this._addCheck({ kind: "nanoid", ...errorUtil_errorUtil.errToObj(message) });
    }
    cuid(message) {
        return this._addCheck({ kind: "cuid", ...errorUtil_errorUtil.errToObj(message) });
    }
    cuid2(message) {
        return this._addCheck({ kind: "cuid2", ...errorUtil_errorUtil.errToObj(message) });
    }
    ulid(message) {
        return this._addCheck({ kind: "ulid", ...errorUtil_errorUtil.errToObj(message) });
    }
    base64(message) {
        return this._addCheck({ kind: "base64", ...errorUtil_errorUtil.errToObj(message) });
    }
    base64url(message) {
        // base64url encoding is a modification of base64 that can safely be used in URLs and filenames
        return this._addCheck({
            kind: "base64url",
            ...errorUtil_errorUtil.errToObj(message),
        });
    }
    jwt(options) {
        return this._addCheck({ kind: "jwt", ...errorUtil_errorUtil.errToObj(options) });
    }
    ip(options) {
        return this._addCheck({ kind: "ip", ...errorUtil_errorUtil.errToObj(options) });
    }
    cidr(options) {
        return this._addCheck({ kind: "cidr", ...errorUtil_errorUtil.errToObj(options) });
    }
    datetime(options) {
        if (typeof options === "string") {
            return this._addCheck({
                kind: "datetime",
                precision: null,
                offset: false,
                local: false,
                message: options,
            });
        }
        return this._addCheck({
            kind: "datetime",
            precision: typeof options?.precision === "undefined" ? null : options?.precision,
            offset: options?.offset ?? false,
            local: options?.local ?? false,
            ...errorUtil_errorUtil.errToObj(options?.message),
        });
    }
    date(message) {
        return this._addCheck({ kind: "date", message });
    }
    time(options) {
        if (typeof options === "string") {
            return this._addCheck({
                kind: "time",
                precision: null,
                message: options,
            });
        }
        return this._addCheck({
            kind: "time",
            precision: typeof options?.precision === "undefined" ? null : options?.precision,
            ...errorUtil_errorUtil.errToObj(options?.message),
        });
    }
    duration(message) {
        return this._addCheck({ kind: "duration", ...errorUtil_errorUtil.errToObj(message) });
    }
    regex(regex, message) {
        return this._addCheck({
            kind: "regex",
            regex: regex,
            ...errorUtil_errorUtil.errToObj(message),
        });
    }
    includes(value, options) {
        return this._addCheck({
            kind: "includes",
            value: value,
            position: options?.position,
            ...errorUtil_errorUtil.errToObj(options?.message),
        });
    }
    startsWith(value, message) {
        return this._addCheck({
            kind: "startsWith",
            value: value,
            ...errorUtil_errorUtil.errToObj(message),
        });
    }
    endsWith(value, message) {
        return this._addCheck({
            kind: "endsWith",
            value: value,
            ...errorUtil_errorUtil.errToObj(message),
        });
    }
    min(minLength, message) {
        return this._addCheck({
            kind: "min",
            value: minLength,
            ...errorUtil_errorUtil.errToObj(message),
        });
    }
    max(maxLength, message) {
        return this._addCheck({
            kind: "max",
            value: maxLength,
            ...errorUtil_errorUtil.errToObj(message),
        });
    }
    length(len, message) {
        return this._addCheck({
            kind: "length",
            value: len,
            ...errorUtil_errorUtil.errToObj(message),
        });
    }
    /**
     * Equivalent to `.min(1)`
     */
    nonempty(message) {
        return this.min(1, errorUtil_errorUtil.errToObj(message));
    }
    trim() {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "trim" }],
        });
    }
    toLowerCase() {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "toLowerCase" }],
        });
    }
    toUpperCase() {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "toUpperCase" }],
        });
    }
    get isDatetime() {
        return !!this._def.checks.find((ch) => ch.kind === "datetime");
    }
    get isDate() {
        return !!this._def.checks.find((ch) => ch.kind === "date");
    }
    get isTime() {
        return !!this._def.checks.find((ch) => ch.kind === "time");
    }
    get isDuration() {
        return !!this._def.checks.find((ch) => ch.kind === "duration");
    }
    get isEmail() {
        return !!this._def.checks.find((ch) => ch.kind === "email");
    }
    get isURL() {
        return !!this._def.checks.find((ch) => ch.kind === "url");
    }
    get isEmoji() {
        return !!this._def.checks.find((ch) => ch.kind === "emoji");
    }
    get isUUID() {
        return !!this._def.checks.find((ch) => ch.kind === "uuid");
    }
    get isNANOID() {
        return !!this._def.checks.find((ch) => ch.kind === "nanoid");
    }
    get isCUID() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid");
    }
    get isCUID2() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid2");
    }
    get isULID() {
        return !!this._def.checks.find((ch) => ch.kind === "ulid");
    }
    get isIP() {
        return !!this._def.checks.find((ch) => ch.kind === "ip");
    }
    get isCIDR() {
        return !!this._def.checks.find((ch) => ch.kind === "cidr");
    }
    get isBase64() {
        return !!this._def.checks.find((ch) => ch.kind === "base64");
    }
    get isBase64url() {
        // base64url encoding is a modification of base64 that can safely be used in URLs and filenames
        return !!this._def.checks.find((ch) => ch.kind === "base64url");
    }
    get minLength() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxLength() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
}
ZodString.create = (params) => {
    return new ZodString({
        checks: [],
        typeName: types_ZodFirstPartyTypeKind.ZodString,
        coerce: params?.coerce ?? false,
        ...processCreateParams(params),
    });
};
// https://stackoverflow.com/questions/3966484/why-does-modulus-operator-return-fractional-number-in-javascript/31711034#31711034
function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
    return (valInt % stepInt) / 10 ** decCount;
}
class ZodNumber extends ZodType {
    constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
        this.step = this.multipleOf;
    }
    _parse(input) {
        if (this._def.coerce) {
            input.data = Number(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.number) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.number,
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        let ctx = undefined;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
            if (check.kind === "int") {
                if (!util_util.isInteger(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: "integer",
                        received: "float",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "min") {
                const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
                if (tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        minimum: check.value,
                        type: "number",
                        inclusive: check.inclusive,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
                if (tooBig) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        maximum: check.value,
                        type: "number",
                        inclusive: check.inclusive,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "multipleOf") {
                if (floatSafeRemainder(input.data, check.value) !== 0) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.not_multiple_of,
                        multipleOf: check.value,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "finite") {
                if (!Number.isFinite(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.not_finite,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util_util.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    gte(value, message) {
        return this.setLimit("min", value, true, errorUtil_errorUtil.toString(message));
    }
    gt(value, message) {
        return this.setLimit("min", value, false, errorUtil_errorUtil.toString(message));
    }
    lte(value, message) {
        return this.setLimit("max", value, true, errorUtil_errorUtil.toString(message));
    }
    lt(value, message) {
        return this.setLimit("max", value, false, errorUtil_errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
        return new ZodNumber({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind,
                    value,
                    inclusive,
                    message: errorUtil_errorUtil.toString(message),
                },
            ],
        });
    }
    _addCheck(check) {
        return new ZodNumber({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    int(message) {
        return this._addCheck({
            kind: "int",
            message: errorUtil_errorUtil.toString(message),
        });
    }
    positive(message) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: false,
            message: errorUtil_errorUtil.toString(message),
        });
    }
    negative(message) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: false,
            message: errorUtil_errorUtil.toString(message),
        });
    }
    nonpositive(message) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: true,
            message: errorUtil_errorUtil.toString(message),
        });
    }
    nonnegative(message) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: true,
            message: errorUtil_errorUtil.toString(message),
        });
    }
    multipleOf(value, message) {
        return this._addCheck({
            kind: "multipleOf",
            value: value,
            message: errorUtil_errorUtil.toString(message),
        });
    }
    finite(message) {
        return this._addCheck({
            kind: "finite",
            message: errorUtil_errorUtil.toString(message),
        });
    }
    safe(message) {
        return this._addCheck({
            kind: "min",
            inclusive: true,
            value: Number.MIN_SAFE_INTEGER,
            message: errorUtil_errorUtil.toString(message),
        })._addCheck({
            kind: "max",
            inclusive: true,
            value: Number.MAX_SAFE_INTEGER,
            message: errorUtil_errorUtil.toString(message),
        });
    }
    get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
    get isInt() {
        return !!this._def.checks.find((ch) => ch.kind === "int" || (ch.kind === "multipleOf" && util_util.isInteger(ch.value)));
    }
    get isFinite() {
        let max = null;
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
                return true;
            }
            else if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
            else if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return Number.isFinite(min) && Number.isFinite(max);
    }
}
ZodNumber.create = (params) => {
    return new ZodNumber({
        checks: [],
        typeName: types_ZodFirstPartyTypeKind.ZodNumber,
        coerce: params?.coerce || false,
        ...processCreateParams(params),
    });
};
class ZodBigInt extends ZodType {
    constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
    }
    _parse(input) {
        if (this._def.coerce) {
            try {
                input.data = BigInt(input.data);
            }
            catch {
                return this._getInvalidInput(input);
            }
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.bigint) {
            return this._getInvalidInput(input);
        }
        let ctx = undefined;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
                if (tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        type: "bigint",
                        minimum: check.value,
                        inclusive: check.inclusive,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
                if (tooBig) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        type: "bigint",
                        maximum: check.value,
                        inclusive: check.inclusive,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "multipleOf") {
                if (input.data % check.value !== BigInt(0)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.not_multiple_of,
                        multipleOf: check.value,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util_util.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    _getInvalidInput(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.bigint,
            received: ctx.parsedType,
        });
        return parseUtil_INVALID;
    }
    gte(value, message) {
        return this.setLimit("min", value, true, errorUtil_errorUtil.toString(message));
    }
    gt(value, message) {
        return this.setLimit("min", value, false, errorUtil_errorUtil.toString(message));
    }
    lte(value, message) {
        return this.setLimit("max", value, true, errorUtil_errorUtil.toString(message));
    }
    lt(value, message) {
        return this.setLimit("max", value, false, errorUtil_errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
        return new ZodBigInt({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind,
                    value,
                    inclusive,
                    message: errorUtil_errorUtil.toString(message),
                },
            ],
        });
    }
    _addCheck(check) {
        return new ZodBigInt({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    positive(message) {
        return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: false,
            message: errorUtil_errorUtil.toString(message),
        });
    }
    negative(message) {
        return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: false,
            message: errorUtil_errorUtil.toString(message),
        });
    }
    nonpositive(message) {
        return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: true,
            message: errorUtil_errorUtil.toString(message),
        });
    }
    nonnegative(message) {
        return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: true,
            message: errorUtil_errorUtil.toString(message),
        });
    }
    multipleOf(value, message) {
        return this._addCheck({
            kind: "multipleOf",
            value,
            message: errorUtil_errorUtil.toString(message),
        });
    }
    get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
}
ZodBigInt.create = (params) => {
    return new ZodBigInt({
        checks: [],
        typeName: types_ZodFirstPartyTypeKind.ZodBigInt,
        coerce: params?.coerce ?? false,
        ...processCreateParams(params),
    });
};
class ZodBoolean extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = Boolean(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.boolean) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.boolean,
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        return OK(input.data);
    }
}
ZodBoolean.create = (params) => {
    return new ZodBoolean({
        typeName: types_ZodFirstPartyTypeKind.ZodBoolean,
        coerce: params?.coerce || false,
        ...processCreateParams(params),
    });
};
class ZodDate extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = new Date(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.date) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.date,
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        if (Number.isNaN(input.data.getTime())) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_date,
            });
            return parseUtil_INVALID;
        }
        const status = new ParseStatus();
        let ctx = undefined;
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                if (input.data.getTime() < check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        message: check.message,
                        inclusive: true,
                        exact: false,
                        minimum: check.value,
                        type: "date",
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                if (input.data.getTime() > check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        message: check.message,
                        inclusive: true,
                        exact: false,
                        maximum: check.value,
                        type: "date",
                    });
                    status.dirty();
                }
            }
            else {
                util_util.assertNever(check);
            }
        }
        return {
            status: status.value,
            value: new Date(input.data.getTime()),
        };
    }
    _addCheck(check) {
        return new ZodDate({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    min(minDate, message) {
        return this._addCheck({
            kind: "min",
            value: minDate.getTime(),
            message: errorUtil_errorUtil.toString(message),
        });
    }
    max(maxDate, message) {
        return this._addCheck({
            kind: "max",
            value: maxDate.getTime(),
            message: errorUtil_errorUtil.toString(message),
        });
    }
    get minDate() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min != null ? new Date(min) : null;
    }
    get maxDate() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max != null ? new Date(max) : null;
    }
}
ZodDate.create = (params) => {
    return new ZodDate({
        checks: [],
        coerce: params?.coerce || false,
        typeName: types_ZodFirstPartyTypeKind.ZodDate,
        ...processCreateParams(params),
    });
};
class ZodSymbol extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.symbol) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.symbol,
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        return OK(input.data);
    }
}
ZodSymbol.create = (params) => {
    return new ZodSymbol({
        typeName: types_ZodFirstPartyTypeKind.ZodSymbol,
        ...processCreateParams(params),
    });
};
class ZodUndefined extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.undefined,
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        return OK(input.data);
    }
}
ZodUndefined.create = (params) => {
    return new ZodUndefined({
        typeName: types_ZodFirstPartyTypeKind.ZodUndefined,
        ...processCreateParams(params),
    });
};
class ZodNull extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType["null"]) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType["null"],
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        return OK(input.data);
    }
}
ZodNull.create = (params) => {
    return new ZodNull({
        typeName: types_ZodFirstPartyTypeKind.ZodNull,
        ...processCreateParams(params),
    });
};
class ZodAny extends ZodType {
    constructor() {
        super(...arguments);
        // to prevent instances of other classes from extending ZodAny. this causes issues with catchall in ZodObject.
        this._any = true;
    }
    _parse(input) {
        return OK(input.data);
    }
}
ZodAny.create = (params) => {
    return new ZodAny({
        typeName: types_ZodFirstPartyTypeKind.ZodAny,
        ...processCreateParams(params),
    });
};
class ZodUnknown extends ZodType {
    constructor() {
        super(...arguments);
        // required
        this._unknown = true;
    }
    _parse(input) {
        return OK(input.data);
    }
}
ZodUnknown.create = (params) => {
    return new ZodUnknown({
        typeName: types_ZodFirstPartyTypeKind.ZodUnknown,
        ...processCreateParams(params),
    });
};
class ZodNever extends ZodType {
    _parse(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.never,
            received: ctx.parsedType,
        });
        return parseUtil_INVALID;
    }
}
ZodNever.create = (params) => {
    return new ZodNever({
        typeName: types_ZodFirstPartyTypeKind.ZodNever,
        ...processCreateParams(params),
    });
};
class ZodVoid extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType["void"],
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        return OK(input.data);
    }
}
ZodVoid.create = (params) => {
    return new ZodVoid({
        typeName: types_ZodFirstPartyTypeKind.ZodVoid,
        ...processCreateParams(params),
    });
};
class ZodArray extends ZodType {
    _parse(input) {
        const { ctx, status } = this._processInputParams(input);
        const def = this._def;
        if (ctx.parsedType !== ZodParsedType.array) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.array,
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        if (def.exactLength !== null) {
            const tooBig = ctx.data.length > def.exactLength.value;
            const tooSmall = ctx.data.length < def.exactLength.value;
            if (tooBig || tooSmall) {
                addIssueToContext(ctx, {
                    code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
                    minimum: (tooSmall ? def.exactLength.value : undefined),
                    maximum: (tooBig ? def.exactLength.value : undefined),
                    type: "array",
                    inclusive: true,
                    exact: true,
                    message: def.exactLength.message,
                });
                status.dirty();
            }
        }
        if (def.minLength !== null) {
            if (ctx.data.length < def.minLength.value) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_small,
                    minimum: def.minLength.value,
                    type: "array",
                    inclusive: true,
                    exact: false,
                    message: def.minLength.message,
                });
                status.dirty();
            }
        }
        if (def.maxLength !== null) {
            if (ctx.data.length > def.maxLength.value) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_big,
                    maximum: def.maxLength.value,
                    type: "array",
                    inclusive: true,
                    exact: false,
                    message: def.maxLength.message,
                });
                status.dirty();
            }
        }
        if (ctx.common.async) {
            return Promise.all([...ctx.data].map((item, i) => {
                return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
            })).then((result) => {
                return ParseStatus.mergeArray(status, result);
            });
        }
        const result = [...ctx.data].map((item, i) => {
            return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        });
        return ParseStatus.mergeArray(status, result);
    }
    get element() {
        return this._def.type;
    }
    min(minLength, message) {
        return new ZodArray({
            ...this._def,
            minLength: { value: minLength, message: errorUtil_errorUtil.toString(message) },
        });
    }
    max(maxLength, message) {
        return new ZodArray({
            ...this._def,
            maxLength: { value: maxLength, message: errorUtil_errorUtil.toString(message) },
        });
    }
    length(len, message) {
        return new ZodArray({
            ...this._def,
            exactLength: { value: len, message: errorUtil_errorUtil.toString(message) },
        });
    }
    nonempty(message) {
        return this.min(1, message);
    }
}
ZodArray.create = (schema, params) => {
    return new ZodArray({
        type: schema,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: types_ZodFirstPartyTypeKind.ZodArray,
        ...processCreateParams(params),
    });
};
function deepPartialify(schema) {
    if (schema instanceof ZodObject) {
        const newShape = {};
        for (const key in schema.shape) {
            const fieldSchema = schema.shape[key];
            newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
        }
        return new ZodObject({
            ...schema._def,
            shape: () => newShape,
        });
    }
    else if (schema instanceof ZodArray) {
        return new ZodArray({
            ...schema._def,
            type: deepPartialify(schema.element),
        });
    }
    else if (schema instanceof ZodOptional) {
        return ZodOptional.create(deepPartialify(schema.unwrap()));
    }
    else if (schema instanceof ZodNullable) {
        return ZodNullable.create(deepPartialify(schema.unwrap()));
    }
    else if (schema instanceof ZodTuple) {
        return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
    }
    else {
        return schema;
    }
}
class ZodObject extends ZodType {
    constructor() {
        super(...arguments);
        this._cached = null;
        /**
         * @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
         * If you want to pass through unknown properties, use `.passthrough()` instead.
         */
        this.nonstrict = this.passthrough;
        // extend<
        //   Augmentation extends ZodRawShape,
        //   NewOutput extends util.flatten<{
        //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
        //       ? Augmentation[k]["_output"]
        //       : k extends keyof Output
        //       ? Output[k]
        //       : never;
        //   }>,
        //   NewInput extends util.flatten<{
        //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
        //       ? Augmentation[k]["_input"]
        //       : k extends keyof Input
        //       ? Input[k]
        //       : never;
        //   }>
        // >(
        //   augmentation: Augmentation
        // ): ZodObject<
        //   extendShape<T, Augmentation>,
        //   UnknownKeys,
        //   Catchall,
        //   NewOutput,
        //   NewInput
        // > {
        //   return new ZodObject({
        //     ...this._def,
        //     shape: () => ({
        //       ...this._def.shape(),
        //       ...augmentation,
        //     }),
        //   }) as any;
        // }
        /**
         * @deprecated Use `.extend` instead
         *  */
        this.augment = this.extend;
    }
    _getCached() {
        if (this._cached !== null)
            return this._cached;
        const shape = this._def.shape();
        const keys = util_util.objectKeys(shape);
        this._cached = { shape, keys };
        return this._cached;
    }
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.object) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.object,
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        const { status, ctx } = this._processInputParams(input);
        const { shape, keys: shapeKeys } = this._getCached();
        const extraKeys = [];
        if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
            for (const key in ctx.data) {
                if (!shapeKeys.includes(key)) {
                    extraKeys.push(key);
                }
            }
        }
        const pairs = [];
        for (const key of shapeKeys) {
            const keyValidator = shape[key];
            const value = ctx.data[key];
            pairs.push({
                key: { status: "valid", value: key },
                value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
                alwaysSet: key in ctx.data,
            });
        }
        if (this._def.catchall instanceof ZodNever) {
            const unknownKeys = this._def.unknownKeys;
            if (unknownKeys === "passthrough") {
                for (const key of extraKeys) {
                    pairs.push({
                        key: { status: "valid", value: key },
                        value: { status: "valid", value: ctx.data[key] },
                    });
                }
            }
            else if (unknownKeys === "strict") {
                if (extraKeys.length > 0) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.unrecognized_keys,
                        keys: extraKeys,
                    });
                    status.dirty();
                }
            }
            else if (unknownKeys === "strip") {
            }
            else {
                throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
            }
        }
        else {
            // run catchall validation
            const catchall = this._def.catchall;
            for (const key of extraKeys) {
                const value = ctx.data[key];
                pairs.push({
                    key: { status: "valid", value: key },
                    value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key) //, ctx.child(key), value, getParsedType(value)
                    ),
                    alwaysSet: key in ctx.data,
                });
            }
        }
        if (ctx.common.async) {
            return Promise.resolve()
                .then(async () => {
                const syncPairs = [];
                for (const pair of pairs) {
                    const key = await pair.key;
                    const value = await pair.value;
                    syncPairs.push({
                        key,
                        value,
                        alwaysSet: pair.alwaysSet,
                    });
                }
                return syncPairs;
            })
                .then((syncPairs) => {
                return ParseStatus.mergeObjectSync(status, syncPairs);
            });
        }
        else {
            return ParseStatus.mergeObjectSync(status, pairs);
        }
    }
    get shape() {
        return this._def.shape();
    }
    strict(message) {
        errorUtil_errorUtil.errToObj;
        return new ZodObject({
            ...this._def,
            unknownKeys: "strict",
            ...(message !== undefined
                ? {
                    errorMap: (issue, ctx) => {
                        const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
                        if (issue.code === "unrecognized_keys")
                            return {
                                message: errorUtil_errorUtil.errToObj(message).message ?? defaultError,
                            };
                        return {
                            message: defaultError,
                        };
                    },
                }
                : {}),
        });
    }
    strip() {
        return new ZodObject({
            ...this._def,
            unknownKeys: "strip",
        });
    }
    passthrough() {
        return new ZodObject({
            ...this._def,
            unknownKeys: "passthrough",
        });
    }
    // const AugmentFactory =
    //   <Def extends ZodObjectDef>(def: Def) =>
    //   <Augmentation extends ZodRawShape>(
    //     augmentation: Augmentation
    //   ): ZodObject<
    //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
    //     Def["unknownKeys"],
    //     Def["catchall"]
    //   > => {
    //     return new ZodObject({
    //       ...def,
    //       shape: () => ({
    //         ...def.shape(),
    //         ...augmentation,
    //       }),
    //     }) as any;
    //   };
    extend(augmentation) {
        return new ZodObject({
            ...this._def,
            shape: () => ({
                ...this._def.shape(),
                ...augmentation,
            }),
        });
    }
    /**
     * Prior to zod@1.0.12 there was a bug in the
     * inferred type of merged objects. Please
     * upgrade if you are experiencing issues.
     */
    merge(merging) {
        const merged = new ZodObject({
            unknownKeys: merging._def.unknownKeys,
            catchall: merging._def.catchall,
            shape: () => ({
                ...this._def.shape(),
                ...merging._def.shape(),
            }),
            typeName: types_ZodFirstPartyTypeKind.ZodObject,
        });
        return merged;
    }
    // merge<
    //   Incoming extends AnyZodObject,
    //   Augmentation extends Incoming["shape"],
    //   NewOutput extends {
    //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
    //       ? Augmentation[k]["_output"]
    //       : k extends keyof Output
    //       ? Output[k]
    //       : never;
    //   },
    //   NewInput extends {
    //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
    //       ? Augmentation[k]["_input"]
    //       : k extends keyof Input
    //       ? Input[k]
    //       : never;
    //   }
    // >(
    //   merging: Incoming
    // ): ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"],
    //   NewOutput,
    //   NewInput
    // > {
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    setKey(key, schema) {
        return this.augment({ [key]: schema });
    }
    // merge<Incoming extends AnyZodObject>(
    //   merging: Incoming
    // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
    // ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"]
    // > {
    //   // const mergedShape = objectUtil.mergeShapes(
    //   //   this._def.shape(),
    //   //   merging._def.shape()
    //   // );
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    catchall(index) {
        return new ZodObject({
            ...this._def,
            catchall: index,
        });
    }
    pick(mask) {
        const shape = {};
        for (const key of util_util.objectKeys(mask)) {
            if (mask[key] && this.shape[key]) {
                shape[key] = this.shape[key];
            }
        }
        return new ZodObject({
            ...this._def,
            shape: () => shape,
        });
    }
    omit(mask) {
        const shape = {};
        for (const key of util_util.objectKeys(this.shape)) {
            if (!mask[key]) {
                shape[key] = this.shape[key];
            }
        }
        return new ZodObject({
            ...this._def,
            shape: () => shape,
        });
    }
    /**
     * @deprecated
     */
    deepPartial() {
        return deepPartialify(this);
    }
    partial(mask) {
        const newShape = {};
        for (const key of util_util.objectKeys(this.shape)) {
            const fieldSchema = this.shape[key];
            if (mask && !mask[key]) {
                newShape[key] = fieldSchema;
            }
            else {
                newShape[key] = fieldSchema.optional();
            }
        }
        return new ZodObject({
            ...this._def,
            shape: () => newShape,
        });
    }
    required(mask) {
        const newShape = {};
        for (const key of util_util.objectKeys(this.shape)) {
            if (mask && !mask[key]) {
                newShape[key] = this.shape[key];
            }
            else {
                const fieldSchema = this.shape[key];
                let newField = fieldSchema;
                while (newField instanceof ZodOptional) {
                    newField = newField._def.innerType;
                }
                newShape[key] = newField;
            }
        }
        return new ZodObject({
            ...this._def,
            shape: () => newShape,
        });
    }
    keyof() {
        return createZodEnum(util_util.objectKeys(this.shape));
    }
}
ZodObject.create = (shape, params) => {
    return new ZodObject({
        shape: () => shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: types_ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
ZodObject.strictCreate = (shape, params) => {
    return new ZodObject({
        shape: () => shape,
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: types_ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
ZodObject.lazycreate = (shape, params) => {
    return new ZodObject({
        shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: types_ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
class ZodUnion extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const options = this._def.options;
        function handleResults(results) {
            // return first issue-free validation if it exists
            for (const result of results) {
                if (result.result.status === "valid") {
                    return result.result;
                }
            }
            for (const result of results) {
                if (result.result.status === "dirty") {
                    // add issues from dirty option
                    ctx.common.issues.push(...result.ctx.common.issues);
                    return result.result;
                }
            }
            // return invalid
            const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_union,
                unionErrors,
            });
            return parseUtil_INVALID;
        }
        if (ctx.common.async) {
            return Promise.all(options.map(async (option) => {
                const childCtx = {
                    ...ctx,
                    common: {
                        ...ctx.common,
                        issues: [],
                    },
                    parent: null,
                };
                return {
                    result: await option._parseAsync({
                        data: ctx.data,
                        path: ctx.path,
                        parent: childCtx,
                    }),
                    ctx: childCtx,
                };
            })).then(handleResults);
        }
        else {
            let dirty = undefined;
            const issues = [];
            for (const option of options) {
                const childCtx = {
                    ...ctx,
                    common: {
                        ...ctx.common,
                        issues: [],
                    },
                    parent: null,
                };
                const result = option._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: childCtx,
                });
                if (result.status === "valid") {
                    return result;
                }
                else if (result.status === "dirty" && !dirty) {
                    dirty = { result, ctx: childCtx };
                }
                if (childCtx.common.issues.length) {
                    issues.push(childCtx.common.issues);
                }
            }
            if (dirty) {
                ctx.common.issues.push(...dirty.ctx.common.issues);
                return dirty.result;
            }
            const unionErrors = issues.map((issues) => new ZodError(issues));
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_union,
                unionErrors,
            });
            return parseUtil_INVALID;
        }
    }
    get options() {
        return this._def.options;
    }
}
ZodUnion.create = (types, params) => {
    return new ZodUnion({
        options: types,
        typeName: types_ZodFirstPartyTypeKind.ZodUnion,
        ...processCreateParams(params),
    });
};
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
//////////                                 //////////
//////////      ZodDiscriminatedUnion      //////////
//////////                                 //////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
const getDiscriminator = (type) => {
    if (type instanceof ZodLazy) {
        return getDiscriminator(type.schema);
    }
    else if (type instanceof ZodEffects) {
        return getDiscriminator(type.innerType());
    }
    else if (type instanceof ZodLiteral) {
        return [type.value];
    }
    else if (type instanceof ZodEnum) {
        return type.options;
    }
    else if (type instanceof ZodNativeEnum) {
        // eslint-disable-next-line ban/ban
        return util_util.objectValues(type.enum);
    }
    else if (type instanceof ZodDefault) {
        return getDiscriminator(type._def.innerType);
    }
    else if (type instanceof ZodUndefined) {
        return [undefined];
    }
    else if (type instanceof ZodNull) {
        return [null];
    }
    else if (type instanceof ZodOptional) {
        return [undefined, ...getDiscriminator(type.unwrap())];
    }
    else if (type instanceof ZodNullable) {
        return [null, ...getDiscriminator(type.unwrap())];
    }
    else if (type instanceof ZodBranded) {
        return getDiscriminator(type.unwrap());
    }
    else if (type instanceof ZodReadonly) {
        return getDiscriminator(type.unwrap());
    }
    else if (type instanceof ZodCatch) {
        return getDiscriminator(type._def.innerType);
    }
    else {
        return [];
    }
};
class ZodDiscriminatedUnion extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.object,
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        const discriminator = this.discriminator;
        const discriminatorValue = ctx.data[discriminator];
        const option = this.optionsMap.get(discriminatorValue);
        if (!option) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_union_discriminator,
                options: Array.from(this.optionsMap.keys()),
                path: [discriminator],
            });
            return parseUtil_INVALID;
        }
        if (ctx.common.async) {
            return option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
        }
        else {
            return option._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
        }
    }
    get discriminator() {
        return this._def.discriminator;
    }
    get options() {
        return this._def.options;
    }
    get optionsMap() {
        return this._def.optionsMap;
    }
    /**
     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
     * have a different value for each object in the union.
     * @param discriminator the name of the discriminator property
     * @param types an array of object schemas
     * @param params
     */
    static create(discriminator, options, params) {
        // Get all the valid discriminator values
        const optionsMap = new Map();
        // try {
        for (const type of options) {
            const discriminatorValues = getDiscriminator(type.shape[discriminator]);
            if (!discriminatorValues.length) {
                throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
            }
            for (const value of discriminatorValues) {
                if (optionsMap.has(value)) {
                    throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
                }
                optionsMap.set(value, type);
            }
        }
        return new ZodDiscriminatedUnion({
            typeName: types_ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
            discriminator,
            options,
            optionsMap,
            ...processCreateParams(params),
        });
    }
}
function mergeValues(a, b) {
    const aType = getParsedType(a);
    const bType = getParsedType(b);
    if (a === b) {
        return { valid: true, data: a };
    }
    else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
        const bKeys = util_util.objectKeys(b);
        const sharedKeys = util_util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
        const newObj = { ...a, ...b };
        for (const key of sharedKeys) {
            const sharedValue = mergeValues(a[key], b[key]);
            if (!sharedValue.valid) {
                return { valid: false };
            }
            newObj[key] = sharedValue.data;
        }
        return { valid: true, data: newObj };
    }
    else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
        if (a.length !== b.length) {
            return { valid: false };
        }
        const newArray = [];
        for (let index = 0; index < a.length; index++) {
            const itemA = a[index];
            const itemB = b[index];
            const sharedValue = mergeValues(itemA, itemB);
            if (!sharedValue.valid) {
                return { valid: false };
            }
            newArray.push(sharedValue.data);
        }
        return { valid: true, data: newArray };
    }
    else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
        return { valid: true, data: a };
    }
    else {
        return { valid: false };
    }
}
class ZodIntersection extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const handleParsed = (parsedLeft, parsedRight) => {
            if (isAborted(parsedLeft) || isAborted(parsedRight)) {
                return parseUtil_INVALID;
            }
            const merged = mergeValues(parsedLeft.value, parsedRight.value);
            if (!merged.valid) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_intersection_types,
                });
                return parseUtil_INVALID;
            }
            if (isDirty(parsedLeft) || isDirty(parsedRight)) {
                status.dirty();
            }
            return { status: status.value, value: merged.data };
        };
        if (ctx.common.async) {
            return Promise.all([
                this._def.left._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                }),
                this._def.right._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                }),
            ]).then(([left, right]) => handleParsed(left, right));
        }
        else {
            return handleParsed(this._def.left._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            }), this._def.right._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            }));
        }
    }
}
ZodIntersection.create = (left, right, params) => {
    return new ZodIntersection({
        left: left,
        right: right,
        typeName: types_ZodFirstPartyTypeKind.ZodIntersection,
        ...processCreateParams(params),
    });
};
// type ZodTupleItems = [ZodTypeAny, ...ZodTypeAny[]];
class ZodTuple extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.array) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.array,
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        if (ctx.data.length < this._def.items.length) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: this._def.items.length,
                inclusive: true,
                exact: false,
                type: "array",
            });
            return parseUtil_INVALID;
        }
        const rest = this._def.rest;
        if (!rest && ctx.data.length > this._def.items.length) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: this._def.items.length,
                inclusive: true,
                exact: false,
                type: "array",
            });
            status.dirty();
        }
        const items = [...ctx.data]
            .map((item, itemIndex) => {
            const schema = this._def.items[itemIndex] || this._def.rest;
            if (!schema)
                return null;
            return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
        })
            .filter((x) => !!x); // filter nulls
        if (ctx.common.async) {
            return Promise.all(items).then((results) => {
                return ParseStatus.mergeArray(status, results);
            });
        }
        else {
            return ParseStatus.mergeArray(status, items);
        }
    }
    get items() {
        return this._def.items;
    }
    rest(rest) {
        return new ZodTuple({
            ...this._def,
            rest,
        });
    }
}
ZodTuple.create = (schemas, params) => {
    if (!Array.isArray(schemas)) {
        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    }
    return new ZodTuple({
        items: schemas,
        typeName: types_ZodFirstPartyTypeKind.ZodTuple,
        rest: null,
        ...processCreateParams(params),
    });
};
class ZodRecord extends ZodType {
    get keySchema() {
        return this._def.keyType;
    }
    get valueSchema() {
        return this._def.valueType;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.object,
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        const pairs = [];
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        for (const key in ctx.data) {
            pairs.push({
                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
                value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
                alwaysSet: key in ctx.data,
            });
        }
        if (ctx.common.async) {
            return ParseStatus.mergeObjectAsync(status, pairs);
        }
        else {
            return ParseStatus.mergeObjectSync(status, pairs);
        }
    }
    get element() {
        return this._def.valueType;
    }
    static create(first, second, third) {
        if (second instanceof ZodType) {
            return new ZodRecord({
                keyType: first,
                valueType: second,
                typeName: types_ZodFirstPartyTypeKind.ZodRecord,
                ...processCreateParams(third),
            });
        }
        return new ZodRecord({
            keyType: ZodString.create(),
            valueType: first,
            typeName: types_ZodFirstPartyTypeKind.ZodRecord,
            ...processCreateParams(second),
        });
    }
}
class ZodMap extends ZodType {
    get keySchema() {
        return this._def.keyType;
    }
    get valueSchema() {
        return this._def.valueType;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.map) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.map,
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
            return {
                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
                value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"])),
            };
        });
        if (ctx.common.async) {
            const finalMap = new Map();
            return Promise.resolve().then(async () => {
                for (const pair of pairs) {
                    const key = await pair.key;
                    const value = await pair.value;
                    if (key.status === "aborted" || value.status === "aborted") {
                        return parseUtil_INVALID;
                    }
                    if (key.status === "dirty" || value.status === "dirty") {
                        status.dirty();
                    }
                    finalMap.set(key.value, value.value);
                }
                return { status: status.value, value: finalMap };
            });
        }
        else {
            const finalMap = new Map();
            for (const pair of pairs) {
                const key = pair.key;
                const value = pair.value;
                if (key.status === "aborted" || value.status === "aborted") {
                    return parseUtil_INVALID;
                }
                if (key.status === "dirty" || value.status === "dirty") {
                    status.dirty();
                }
                finalMap.set(key.value, value.value);
            }
            return { status: status.value, value: finalMap };
        }
    }
}
ZodMap.create = (keyType, valueType, params) => {
    return new ZodMap({
        valueType,
        keyType,
        typeName: types_ZodFirstPartyTypeKind.ZodMap,
        ...processCreateParams(params),
    });
};
class ZodSet extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.set) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.set,
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        const def = this._def;
        if (def.minSize !== null) {
            if (ctx.data.size < def.minSize.value) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_small,
                    minimum: def.minSize.value,
                    type: "set",
                    inclusive: true,
                    exact: false,
                    message: def.minSize.message,
                });
                status.dirty();
            }
        }
        if (def.maxSize !== null) {
            if (ctx.data.size > def.maxSize.value) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_big,
                    maximum: def.maxSize.value,
                    type: "set",
                    inclusive: true,
                    exact: false,
                    message: def.maxSize.message,
                });
                status.dirty();
            }
        }
        const valueType = this._def.valueType;
        function finalizeSet(elements) {
            const parsedSet = new Set();
            for (const element of elements) {
                if (element.status === "aborted")
                    return parseUtil_INVALID;
                if (element.status === "dirty")
                    status.dirty();
                parsedSet.add(element.value);
            }
            return { status: status.value, value: parsedSet };
        }
        const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
        if (ctx.common.async) {
            return Promise.all(elements).then((elements) => finalizeSet(elements));
        }
        else {
            return finalizeSet(elements);
        }
    }
    min(minSize, message) {
        return new ZodSet({
            ...this._def,
            minSize: { value: minSize, message: errorUtil_errorUtil.toString(message) },
        });
    }
    max(maxSize, message) {
        return new ZodSet({
            ...this._def,
            maxSize: { value: maxSize, message: errorUtil_errorUtil.toString(message) },
        });
    }
    size(size, message) {
        return this.min(size, message).max(size, message);
    }
    nonempty(message) {
        return this.min(1, message);
    }
}
ZodSet.create = (valueType, params) => {
    return new ZodSet({
        valueType,
        minSize: null,
        maxSize: null,
        typeName: types_ZodFirstPartyTypeKind.ZodSet,
        ...processCreateParams(params),
    });
};
class ZodFunction extends ZodType {
    constructor() {
        super(...arguments);
        this.validate = this.implement;
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType["function"]) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType["function"],
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        function makeArgsIssue(args, error) {
            return makeIssue({
                data: args,
                path: ctx.path,
                errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en].filter((x) => !!x),
                issueData: {
                    code: ZodIssueCode.invalid_arguments,
                    argumentsError: error,
                },
            });
        }
        function makeReturnsIssue(returns, error) {
            return makeIssue({
                data: returns,
                path: ctx.path,
                errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en].filter((x) => !!x),
                issueData: {
                    code: ZodIssueCode.invalid_return_type,
                    returnTypeError: error,
                },
            });
        }
        const params = { errorMap: ctx.common.contextualErrorMap };
        const fn = ctx.data;
        if (this._def.returns instanceof ZodPromise) {
            // Would love a way to avoid disabling this rule, but we need
            // an alias (using an arrow function was what caused 2651).
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const me = this;
            return OK(async function (...args) {
                const error = new ZodError([]);
                const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
                    error.addIssue(makeArgsIssue(args, e));
                    throw error;
                });
                const result = await Reflect.apply(fn, this, parsedArgs);
                const parsedReturns = await me._def.returns._def.type
                    .parseAsync(result, params)
                    .catch((e) => {
                    error.addIssue(makeReturnsIssue(result, e));
                    throw error;
                });
                return parsedReturns;
            });
        }
        else {
            // Would love a way to avoid disabling this rule, but we need
            // an alias (using an arrow function was what caused 2651).
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const me = this;
            return OK(function (...args) {
                const parsedArgs = me._def.args.safeParse(args, params);
                if (!parsedArgs.success) {
                    throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
                }
                const result = Reflect.apply(fn, this, parsedArgs.data);
                const parsedReturns = me._def.returns.safeParse(result, params);
                if (!parsedReturns.success) {
                    throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
                }
                return parsedReturns.data;
            });
        }
    }
    parameters() {
        return this._def.args;
    }
    returnType() {
        return this._def.returns;
    }
    args(...items) {
        return new ZodFunction({
            ...this._def,
            args: ZodTuple.create(items).rest(ZodUnknown.create()),
        });
    }
    returns(returnType) {
        return new ZodFunction({
            ...this._def,
            returns: returnType,
        });
    }
    implement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
    }
    strictImplement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
    }
    static create(args, returns, params) {
        return new ZodFunction({
            args: (args ? args : ZodTuple.create([]).rest(ZodUnknown.create())),
            returns: returns || ZodUnknown.create(),
            typeName: types_ZodFirstPartyTypeKind.ZodFunction,
            ...processCreateParams(params),
        });
    }
}
class ZodLazy extends ZodType {
    get schema() {
        return this._def.getter();
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const lazySchema = this._def.getter();
        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
    }
}
ZodLazy.create = (getter, params) => {
    return new ZodLazy({
        getter: getter,
        typeName: types_ZodFirstPartyTypeKind.ZodLazy,
        ...processCreateParams(params),
    });
};
class ZodLiteral extends ZodType {
    _parse(input) {
        if (input.data !== this._def.value) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                received: ctx.data,
                code: ZodIssueCode.invalid_literal,
                expected: this._def.value,
            });
            return parseUtil_INVALID;
        }
        return { status: "valid", value: input.data };
    }
    get value() {
        return this._def.value;
    }
}
ZodLiteral.create = (value, params) => {
    return new ZodLiteral({
        value: value,
        typeName: types_ZodFirstPartyTypeKind.ZodLiteral,
        ...processCreateParams(params),
    });
};
function createZodEnum(values, params) {
    return new ZodEnum({
        values,
        typeName: types_ZodFirstPartyTypeKind.ZodEnum,
        ...processCreateParams(params),
    });
}
class ZodEnum extends ZodType {
    constructor() {
        super(...arguments);
        _ZodEnum_cache.set(this, void 0);
    }
    _parse(input) {
        if (typeof input.data !== "string") {
            const ctx = this._getOrReturnCtx(input);
            const expectedValues = this._def.values;
            addIssueToContext(ctx, {
                expected: util_util.joinValues(expectedValues),
                received: ctx.parsedType,
                code: ZodIssueCode.invalid_type,
            });
            return parseUtil_INVALID;
        }
        if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f")) {
            __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values), "f");
        }
        if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data)) {
            const ctx = this._getOrReturnCtx(input);
            const expectedValues = this._def.values;
            addIssueToContext(ctx, {
                received: ctx.data,
                code: ZodIssueCode.invalid_enum_value,
                options: expectedValues,
            });
            return parseUtil_INVALID;
        }
        return OK(input.data);
    }
    get options() {
        return this._def.values;
    }
    get enum() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    get Values() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    get Enum() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    extract(values, newDef = this._def) {
        return ZodEnum.create(values, {
            ...this._def,
            ...newDef,
        });
    }
    exclude(values, newDef = this._def) {
        return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
            ...this._def,
            ...newDef,
        });
    }
}
_ZodEnum_cache = new WeakMap();
ZodEnum.create = createZodEnum;
class ZodNativeEnum extends ZodType {
    constructor() {
        super(...arguments);
        _ZodNativeEnum_cache.set(this, void 0);
    }
    _parse(input) {
        const nativeEnumValues = util_util.getValidEnumValues(this._def.values);
        const ctx = this._getOrReturnCtx(input);
        if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
            const expectedValues = util_util.objectValues(nativeEnumValues);
            addIssueToContext(ctx, {
                expected: util_util.joinValues(expectedValues),
                received: ctx.parsedType,
                code: ZodIssueCode.invalid_type,
            });
            return parseUtil_INVALID;
        }
        if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f")) {
            __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util_util.getValidEnumValues(this._def.values)), "f");
        }
        if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(input.data)) {
            const expectedValues = util_util.objectValues(nativeEnumValues);
            addIssueToContext(ctx, {
                received: ctx.data,
                code: ZodIssueCode.invalid_enum_value,
                options: expectedValues,
            });
            return parseUtil_INVALID;
        }
        return OK(input.data);
    }
    get enum() {
        return this._def.values;
    }
}
_ZodNativeEnum_cache = new WeakMap();
ZodNativeEnum.create = (values, params) => {
    return new ZodNativeEnum({
        values: values,
        typeName: types_ZodFirstPartyTypeKind.ZodNativeEnum,
        ...processCreateParams(params),
    });
};
class ZodPromise extends ZodType {
    unwrap() {
        return this._def.type;
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.promise,
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
        return OK(promisified.then((data) => {
            return this._def.type.parseAsync(data, {
                path: ctx.path,
                errorMap: ctx.common.contextualErrorMap,
            });
        }));
    }
}
ZodPromise.create = (schema, params) => {
    return new ZodPromise({
        type: schema,
        typeName: types_ZodFirstPartyTypeKind.ZodPromise,
        ...processCreateParams(params),
    });
};
class ZodEffects extends ZodType {
    innerType() {
        return this._def.schema;
    }
    sourceType() {
        return this._def.schema._def.typeName === types_ZodFirstPartyTypeKind.ZodEffects
            ? this._def.schema.sourceType()
            : this._def.schema;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const effect = this._def.effect || null;
        const checkCtx = {
            addIssue: (arg) => {
                addIssueToContext(ctx, arg);
                if (arg.fatal) {
                    status.abort();
                }
                else {
                    status.dirty();
                }
            },
            get path() {
                return ctx.path;
            },
        };
        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
        if (effect.type === "preprocess") {
            const processed = effect.transform(ctx.data, checkCtx);
            if (ctx.common.async) {
                return Promise.resolve(processed).then(async (processed) => {
                    if (status.value === "aborted")
                        return parseUtil_INVALID;
                    const result = await this._def.schema._parseAsync({
                        data: processed,
                        path: ctx.path,
                        parent: ctx,
                    });
                    if (result.status === "aborted")
                        return parseUtil_INVALID;
                    if (result.status === "dirty")
                        return DIRTY(result.value);
                    if (status.value === "dirty")
                        return DIRTY(result.value);
                    return result;
                });
            }
            else {
                if (status.value === "aborted")
                    return parseUtil_INVALID;
                const result = this._def.schema._parseSync({
                    data: processed,
                    path: ctx.path,
                    parent: ctx,
                });
                if (result.status === "aborted")
                    return parseUtil_INVALID;
                if (result.status === "dirty")
                    return DIRTY(result.value);
                if (status.value === "dirty")
                    return DIRTY(result.value);
                return result;
            }
        }
        if (effect.type === "refinement") {
            const executeRefinement = (acc) => {
                const result = effect.refinement(acc, checkCtx);
                if (ctx.common.async) {
                    return Promise.resolve(result);
                }
                if (result instanceof Promise) {
                    throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
                }
                return acc;
            };
            if (ctx.common.async === false) {
                const inner = this._def.schema._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (inner.status === "aborted")
                    return parseUtil_INVALID;
                if (inner.status === "dirty")
                    status.dirty();
                // return value is ignored
                executeRefinement(inner.value);
                return { status: status.value, value: inner.value };
            }
            else {
                return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
                    if (inner.status === "aborted")
                        return parseUtil_INVALID;
                    if (inner.status === "dirty")
                        status.dirty();
                    return executeRefinement(inner.value).then(() => {
                        return { status: status.value, value: inner.value };
                    });
                });
            }
        }
        if (effect.type === "transform") {
            if (ctx.common.async === false) {
                const base = this._def.schema._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (!isValid(base))
                    return base;
                const result = effect.transform(base.value, checkCtx);
                if (result instanceof Promise) {
                    throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
                }
                return { status: status.value, value: result };
            }
            else {
                return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
                    if (!isValid(base))
                        return base;
                    return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
                        status: status.value,
                        value: result,
                    }));
                });
            }
        }
        util_util.assertNever(effect);
    }
}
ZodEffects.create = (schema, effect, params) => {
    return new ZodEffects({
        schema,
        typeName: types_ZodFirstPartyTypeKind.ZodEffects,
        effect,
        ...processCreateParams(params),
    });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
    return new ZodEffects({
        schema,
        effect: { type: "preprocess", transform: preprocess },
        typeName: types_ZodFirstPartyTypeKind.ZodEffects,
        ...processCreateParams(params),
    });
};

class ZodOptional extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.undefined) {
            return OK(undefined);
        }
        return this._def.innerType._parse(input);
    }
    unwrap() {
        return this._def.innerType;
    }
}
ZodOptional.create = (type, params) => {
    return new ZodOptional({
        innerType: type,
        typeName: types_ZodFirstPartyTypeKind.ZodOptional,
        ...processCreateParams(params),
    });
};
class ZodNullable extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType["null"]) {
            return OK(null);
        }
        return this._def.innerType._parse(input);
    }
    unwrap() {
        return this._def.innerType;
    }
}
ZodNullable.create = (type, params) => {
    return new ZodNullable({
        innerType: type,
        typeName: types_ZodFirstPartyTypeKind.ZodNullable,
        ...processCreateParams(params),
    });
};
class ZodDefault extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        let data = ctx.data;
        if (ctx.parsedType === ZodParsedType.undefined) {
            data = this._def.defaultValue();
        }
        return this._def.innerType._parse({
            data,
            path: ctx.path,
            parent: ctx,
        });
    }
    removeDefault() {
        return this._def.innerType;
    }
}
ZodDefault.create = (type, params) => {
    return new ZodDefault({
        innerType: type,
        typeName: types_ZodFirstPartyTypeKind.ZodDefault,
        defaultValue: typeof params.default === "function" ? params.default : () => params.default,
        ...processCreateParams(params),
    });
};
class ZodCatch extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        // newCtx is used to not collect issues from inner types in ctx
        const newCtx = {
            ...ctx,
            common: {
                ...ctx.common,
                issues: [],
            },
        };
        const result = this._def.innerType._parse({
            data: newCtx.data,
            path: newCtx.path,
            parent: {
                ...newCtx,
            },
        });
        if (isAsync(result)) {
            return result.then((result) => {
                return {
                    status: "valid",
                    value: result.status === "valid"
                        ? result.value
                        : this._def.catchValue({
                            get error() {
                                return new ZodError(newCtx.common.issues);
                            },
                            input: newCtx.data,
                        }),
                };
            });
        }
        else {
            return {
                status: "valid",
                value: result.status === "valid"
                    ? result.value
                    : this._def.catchValue({
                        get error() {
                            return new ZodError(newCtx.common.issues);
                        },
                        input: newCtx.data,
                    }),
            };
        }
    }
    removeCatch() {
        return this._def.innerType;
    }
}
ZodCatch.create = (type, params) => {
    return new ZodCatch({
        innerType: type,
        typeName: types_ZodFirstPartyTypeKind.ZodCatch,
        catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
        ...processCreateParams(params),
    });
};
class ZodNaN extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.nan) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.nan,
                received: ctx.parsedType,
            });
            return parseUtil_INVALID;
        }
        return { status: "valid", value: input.data };
    }
}
ZodNaN.create = (params) => {
    return new ZodNaN({
        typeName: types_ZodFirstPartyTypeKind.ZodNaN,
        ...processCreateParams(params),
    });
};
const BRAND = Symbol("zod_brand");
class ZodBranded extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const data = ctx.data;
        return this._def.type._parse({
            data,
            path: ctx.path,
            parent: ctx,
        });
    }
    unwrap() {
        return this._def.type;
    }
}
class ZodPipeline extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.common.async) {
            const handleAsync = async () => {
                const inResult = await this._def.in._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (inResult.status === "aborted")
                    return parseUtil_INVALID;
                if (inResult.status === "dirty") {
                    status.dirty();
                    return DIRTY(inResult.value);
                }
                else {
                    return this._def.out._parseAsync({
                        data: inResult.value,
                        path: ctx.path,
                        parent: ctx,
                    });
                }
            };
            return handleAsync();
        }
        else {
            const inResult = this._def.in._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
            if (inResult.status === "aborted")
                return parseUtil_INVALID;
            if (inResult.status === "dirty") {
                status.dirty();
                return {
                    status: "dirty",
                    value: inResult.value,
                };
            }
            else {
                return this._def.out._parseSync({
                    data: inResult.value,
                    path: ctx.path,
                    parent: ctx,
                });
            }
        }
    }
    static create(a, b) {
        return new ZodPipeline({
            in: a,
            out: b,
            typeName: types_ZodFirstPartyTypeKind.ZodPipeline,
        });
    }
}
class ZodReadonly extends ZodType {
    _parse(input) {
        const result = this._def.innerType._parse(input);
        const freeze = (data) => {
            if (isValid(data)) {
                data.value = Object.freeze(data.value);
            }
            return data;
        };
        return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
    }
    unwrap() {
        return this._def.innerType;
    }
}
ZodReadonly.create = (type, params) => {
    return new ZodReadonly({
        innerType: type,
        typeName: types_ZodFirstPartyTypeKind.ZodReadonly,
        ...processCreateParams(params),
    });
};
////////////////////////////////////////
////////////////////////////////////////
//////////                    //////////
//////////      z.custom      //////////
//////////                    //////////
////////////////////////////////////////
////////////////////////////////////////
function cleanParams(params, data) {
    const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
    const p2 = typeof p === "string" ? { message: p } : p;
    return p2;
}
function custom(check, _params = {}, 
/**
 * @deprecated
 *
 * Pass `fatal` into the params object instead:
 *
 * ```ts
 * z.string().custom((val) => val.length > 5, { fatal: false })
 * ```
 *
 */
fatal) {
    if (check)
        return ZodAny.create().superRefine((data, ctx) => {
            const r = check(data);
            if (r instanceof Promise) {
                return r.then((r) => {
                    if (!r) {
                        const params = cleanParams(_params, data);
                        const _fatal = params.fatal ?? fatal ?? true;
                        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
                    }
                });
            }
            if (!r) {
                const params = cleanParams(_params, data);
                const _fatal = params.fatal ?? fatal ?? true;
                ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
            }
            return;
        });
    return ZodAny.create();
}

const late = {
    object: ZodObject.lazycreate,
};
var types_ZodFirstPartyTypeKind;
(function (ZodFirstPartyTypeKind) {
    ZodFirstPartyTypeKind["ZodString"] = "ZodString";
    ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
    ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
    ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
    ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
    ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
    ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
    ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
    ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
    ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
    ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
    ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
    ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
    ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
    ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
    ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
    ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
    ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
    ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
    ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
    ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
    ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
    ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
    ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
    ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
    ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
    ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
    ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
    ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
    ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
    ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
    ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
    ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
    ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
    ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
    ZodFirstPartyTypeKind["ZodReadonly"] = "ZodReadonly";
})(types_ZodFirstPartyTypeKind || (types_ZodFirstPartyTypeKind = {}));
// requires TS 4.4+
class Class {
    constructor(..._) { }
}
const instanceOfType = (
// const instanceOfType = <T extends new (...args: any[]) => any>(
cls, params = {
    message: `Input not instance of ${cls.name}`,
}) => custom((data) => data instanceof cls, params);
const stringType = ZodString.create;
const numberType = ZodNumber.create;
const nanType = ZodNaN.create;
const bigIntType = ZodBigInt.create;
const booleanType = ZodBoolean.create;
const dateType = ZodDate.create;
const symbolType = ZodSymbol.create;
const undefinedType = ZodUndefined.create;
const nullType = ZodNull.create;
const anyType = ZodAny.create;
const unknownType = ZodUnknown.create;
const neverType = ZodNever.create;
const voidType = ZodVoid.create;
const arrayType = ZodArray.create;
const objectType = ZodObject.create;
const strictObjectType = ZodObject.strictCreate;
const unionType = ZodUnion.create;
const discriminatedUnionType = ZodDiscriminatedUnion.create;
const intersectionType = ZodIntersection.create;
const tupleType = ZodTuple.create;
const recordType = ZodRecord.create;
const mapType = ZodMap.create;
const setType = ZodSet.create;
const functionType = ZodFunction.create;
const lazyType = ZodLazy.create;
const literalType = ZodLiteral.create;
const enumType = ZodEnum.create;
const nativeEnumType = ZodNativeEnum.create;
const promiseType = ZodPromise.create;
const effectsType = ZodEffects.create;
const optionalType = ZodOptional.create;
const nullableType = ZodNullable.create;
const preprocessType = ZodEffects.createWithPreprocess;
const pipelineType = ZodPipeline.create;
const ostring = () => stringType().optional();
const onumber = () => numberType().optional();
const oboolean = () => booleanType().optional();
const coerce = (/* unused pure expression or super */ null && ({
    string: ((arg) => ZodString.create({ ...arg, coerce: true })),
    number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
    boolean: ((arg) => ZodBoolean.create({
        ...arg,
        coerce: true,
    })),
    bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
    date: ((arg) => ZodDate.create({ ...arg, coerce: true })),
}));

const NEVER = (/* unused pure expression or super */ null && (INVALID));

;// CONCATENATED MODULE: ../node_modules/zod/dist/esm/v3/external.js







;// CONCATENATED MODULE: ../node_modules/zod/dist/esm/v3/index.js



/* ESM default export */ const v3 = ((/* unused pure expression or super */ null && (z)));

;// CONCATENATED MODULE: ../node_modules/zod/dist/esm/index.js


/* ESM default export */ const esm = ((/* unused pure expression or super */ null && (z3)));


}),

}]);