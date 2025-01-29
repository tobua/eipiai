(self['webpackChunkdemo'] = self['webpackChunkdemo'] || []).push([["663"], {
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
545: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Th: () => (/* binding */ Renderer),
  Lt: () => (/* binding */ getRoots),
  sY: () => (/* binding */ epic_jsx_render)
});

// UNUSED EXPORTS: createElement, unmountAll, useEffect, debounce, useMemo, useCallback, jsxs, jsx, unmount, jsxDEV, useState, cloneElement, default, useRef, Fragment, getRoot

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
const svgAndRegularTags = [
    'a',
    'canvas',
    'audio',
    'iframe',
    'video'
];
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

;// CONCATENATED MODULE: ./node_modules/svg-tag-names/index.js
/**
 * List of known SVG tag names.
 *
 * @type {Array<string>}
 */
const svgTagNames = [
  'a',
  'altGlyph',
  'altGlyphDef',
  'altGlyphItem',
  'animate',
  'animateColor',
  'animateMotion',
  'animateTransform',
  'animation',
  'audio',
  'canvas',
  'circle',
  'clipPath',
  'color-profile',
  'cursor',
  'defs',
  'desc',
  'discard',
  'ellipse',
  'feBlend',
  'feColorMatrix',
  'feComponentTransfer',
  'feComposite',
  'feConvolveMatrix',
  'feDiffuseLighting',
  'feDisplacementMap',
  'feDistantLight',
  'feDropShadow',
  'feFlood',
  'feFuncA',
  'feFuncB',
  'feFuncG',
  'feFuncR',
  'feGaussianBlur',
  'feImage',
  'feMerge',
  'feMergeNode',
  'feMorphology',
  'feOffset',
  'fePointLight',
  'feSpecularLighting',
  'feSpotLight',
  'feTile',
  'feTurbulence',
  'filter',
  'font',
  'font-face',
  'font-face-format',
  'font-face-name',
  'font-face-src',
  'font-face-uri',
  'foreignObject',
  'g',
  'glyph',
  'glyphRef',
  'handler',
  'hkern',
  'iframe',
  'image',
  'line',
  'linearGradient',
  'listener',
  'marker',
  'mask',
  'metadata',
  'missing-glyph',
  'mpath',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'prefetch',
  'radialGradient',
  'rect',
  'script',
  'set',
  'solidColor',
  'stop',
  'style',
  'svg',
  'switch',
  'symbol',
  'tbreak',
  'text',
  'textArea',
  'textPath',
  'title',
  'tref',
  'tspan',
  'unknown',
  'use',
  'video',
  'view',
  'vkern'
]

;// CONCATENATED MODULE: ./node_modules/epic-jsx/types.ts
var types_Change = /*#__PURE__*/ function(Change) {
    Change[Change["Update"] = 0] = "Update";
    Change[Change["Add"] = 1] = "Add";
    Change[Change["Delete"] = 2] = "Delete";
    return Change;
}({});

;// CONCATENATED MODULE: ./node_modules/epic-jsx/browser.ts



// TODO this is a workaround, better to pass SVG context down the fiber tree as soon as an SVG tag is encountered.
const isSvgTag = (tag)=>{
    if (!svgTagNames.includes(tag)) {
        return false;
    }
    if (svgAndRegularTags.includes(tag)) {
        return false;
    }
    return true;
};
const sizeStyleProperties = [
    'width',
    'height',
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
function updateNativeElement(element) {
    let prevProps = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, nextProps = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    // Remove old or changed event listeners
    // biome-ignore lint/complexity/noForEach: Chained expression.
    Object.keys(prevProps).filter(isEvent).filter((key)=>!(key in nextProps) || isNew(prevProps, nextProps)(key)).forEach((name)=>{
        const eventType = name.toLowerCase().substring(2);
        element.removeEventListener(eventType, prevProps[name]);
    });
    // Remove old properties
    // biome-ignore lint/complexity/noForEach: Chained expression.
    Object.keys(prevProps).filter(isProperty).filter(isGone(prevProps, nextProps)).forEach((name)=>{
        // @ts-ignore Filtered for valid properties, maybe more checks necessary.
        element[name] = '';
    });
    // Set new or changed properties
    // biome-ignore lint/complexity/noForEach: Chained expression.
    Object.keys(nextProps).filter(isProperty).filter(isNew(prevProps, nextProps)).forEach((name)=>{
        if (name === 'ref') {
            nextProps[name].current = element;
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
    Object.keys(nextProps).filter(isEvent).filter(isNew(prevProps, nextProps)).forEach((name)=>{
        const eventType = name.toLowerCase().substring(2);
        element.addEventListener(eventType, nextProps[name]);
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
function createNativeElement(fiber) {
    if (!fiber.type) {
        return undefined // Ignore fragments.
        ;
    }
    mapLegacyProps(fiber);
    let element;
    if (fiber.type === 'TEXT_ELEMENT') {
        element = document.createTextNode('');
    } else if (isSvgTag(fiber.type)) {
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
            nativeParent.removeChild(fiber.native);
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
function commitFiber(fiber) {
    if (!fiber) {
        return;
    }
    let { parent } = fiber;
    let maxTries = 500;
    while(!(parent === null || parent === void 0 ? void 0 : parent.native) && (parent === null || parent === void 0 ? void 0 : parent.parent) && maxTries > 0){
        maxTries -= 1;
        parent = parent.parent;
    }
    if (maxTries === 0) {
        log('Ran out of tries at commitFiber.', 'warning');
    }
    if (fiber.change === types_Change.Add && fiber.native) {
        var _parent_native;
        parent === null || parent === void 0 ? void 0 : (_parent_native = parent.native) === null || _parent_native === void 0 ? void 0 : _parent_native.appendChild(fiber.native);
    } else if (fiber.change === types_Change.Update && fiber.native) {
        var _fiber_previous;
        updateNativeElement(fiber.native, (_fiber_previous = fiber.previous) === null || _fiber_previous === void 0 ? void 0 : _fiber_previous.props, fiber.props);
    } else if (fiber.change === types_Change.Delete && parent) {
        if (parent.native) {
            commitDeletion(fiber, parent.native);
        }
    }
    if (fiber.afterListeners) {
        for (const callback of fiber.afterListeners){
            callback.call(fiber.component);
        }
        fiber.afterListeners = [];
    }
    if (fiber.child) {
        commitFiber(fiber.child);
    }
    if (fiber.sibling) {
        commitFiber(fiber.sibling);
    }
}

;// CONCATENATED MODULE: ./node_modules/epic-jsx/render.ts




function commit(context, fiber) {
    context.deletions.forEach(commitFiber);
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
    let prevSibling;
    let maxTries = 500;
    // TODO compare children.length to previous element length.
    while((index < children.length || previous) && maxTries > 0){
        maxTries -= 1;
        const element = children[index];
        let newFiber;
        // TODO also compare props.
        const fragment = element === null || previous === null;
        const isSameType = !fragment && (element === null || element === void 0 ? void 0 : element.type) === (previous === null || previous === void 0 ? void 0 : previous.type);
        if (isSameType && previous) {
            newFiber = createUpdatedFiber(current, previous, element);
        }
        if (element && isSameType && !previous) {
            newFiber = createNewFiber(current, element, previous);
        }
        // Newly added (possibly unnecessary).
        if (element && !isSameType) {
            newFiber = createNewFiber(current, element, previous);
        }
        if (previous && !isSameType) {
            deleteChildren(context, previous);
        }
        const item = previous;
        if (previous) {
            previous = previous.sibling;
        }
        if (index === 0) {
            current.child = newFiber;
        } else if (element && prevSibling) {
            prevSibling.sibling = newFiber;
        }
        prevSibling = newFiber;
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
        props: (element === null || element === void 0 ? void 0 : element.props) ?? (previous === null || previous === void 0 ? void 0 : previous.props),
        native: previous.native,
        parent: current,
        previous,
        hooks: previous.hooks,
        change: types_Change.Update
    });
const createNewFiber = (current, element, previous)=>({
        type: element.type,
        props: element.props,
        native: undefined,
        parent: current,
        previous: undefined,
        hooks: typeof element.type === 'function' ? previous ? previous.hooks : [] : undefined,
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
    context.pending.push({
        native: fiber.native,
        props: fiber.props,
        type: fiber.type,
        previous: fiber,
        parent: fiber.parent
    });
}
function updateFunctionComponent(context, fiber) {
    if (typeof fiber.type !== 'function') {
        return;
    }
    if (typeof fiber.hooks === 'undefined') {
        fiber.hooks = [];
    }
    fiber.hooks.length = 0;
    Renderer.context = context;
    fiber.afterListeners = [];
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
        // TODO memoize.
        get refs () {
            return getComponentRefsFromTree(fiber, [], true);
        },
        get refsNested () {
            return getComponentRefsFromTree(fiber, [], false);
        },
        refsByTag (tag) {
            return getComponentRefsFromTreeByTag(fiber, [], tag);
        },
        after (callback) {
            var _fiber_afterListeners;
            (_fiber_afterListeners = fiber.afterListeners) === null || _fiber_afterListeners === void 0 ? void 0 : _fiber_afterListeners.push(callback);
        }
    };
    Renderer.current = fiber;
    const children = [
        fiber.type.call(fiber.component, fiber.props)
    ];
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
    let shouldYield = false;
    let maxTries = 500;
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
const getRoot = (container)=>{
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
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
    const context = getRoot(container);
    if (!context) {
        return;
    }
    context.root = undefined;
    context.deletions = [];
    context.current = undefined;
    context.dependencies = new Map();
    context.pending = [];
    context.rendered = [];
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
        rendered: []
    };
    roots.set(container, context);
    context.deletions = [];
    schedule((deadline)=>process(deadline, context));
    return context;
}
multipleInstancesWarning();


}),
129: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
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
function createElement(type, props) {
    for(var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        children[_key - 2] = arguments[_key];
    }
    // NOTE needed for browser JSX runtime
    if (props === null || props === void 0 ? void 0 : props.children) {
        // biome-ignore lint/style/noParameterAssign: Much easier in this case.
        children = Array.isArray(props.children) ? props.children : [
            props.children
        ];
        props.children = undefined;
    }
    return {
        type,
        props: {
            ...props,
            children: children// Clear out falsy values.
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
164: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  $N: () => (canProxy),
  J1: () => (listGetters),
  Kb: () => (createBaseObject),
  Kn: () => (isObject),
  Ph: () => (updateProxyValues),
  cM: () => (log),
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
function toggle(parent, property) {
    return ()=>{
        parent[property] = !parent[property];
    };
}


}),
220: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  SB: () => (/* binding */ epic_state_state)
});

// UNUSED EXPORTS: removeAllPlugins, list, ref, run, batch, observe, remove, set, plugin, load, toggle

// EXTERNAL MODULE: ./node_modules/epic-jsx/index.ts + 5 modules
var epic_jsx = __webpack_require__(545);
// EXTERNAL MODULE: ./node_modules/epic-state/helper.ts
var helper = __webpack_require__(164);
// EXTERNAL MODULE: ./node_modules/epic-state/plugin.ts
var epic_state_plugin = __webpack_require__(93);
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
var types = __webpack_require__(266);
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
                    leaf: typeof value !== 'object',
                    value
                });
                track(root ?? receiver, property);
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
                    leaf: typeof value !== 'object'
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
93: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  BA: () => (plugin),
  bP: () => (initializePlugins),
  xv: () => (callPlugins)
});
/* ESM import */var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(266);

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
841: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  $: () => (connect)
});
/* ESM import */var epic_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(545);
/* ESM import */var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(164);
/* ESM import */var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(266);



const connect = (initialize)=>{
    if (initialize !== 'initialize') {
        (0,_helper__WEBPACK_IMPORTED_MODULE_0__/* .log */.cM)('connect plugin cannot be configured', 'warning');
    }
    const observedProperties = new _types__WEBPACK_IMPORTED_MODULE_1__/* .TupleArrayMap */.i();
    return {
        set: (param)=>{
            let { property, parent, value, previousValue } = param;
            if (value === previousValue) {
                return;
            }
            const components = observedProperties.get(parent, property);
            // Remove, as get will be tracked again during render.
            if (observedProperties.has(parent, property)) {
                observedProperties.delete(parent, property);
            }
            // Trigger rerender on components.
            const renderedComponents = new Set();
            if (components) {
                for (const component of components){
                    // Check if already rendered
                    if (!renderedComponents.has(component.type)) {
                        component.rerender();
                        renderedComponents.add(component.type) // Mark as rendered
                        ;
                    }
                }
            }
            // TODO This will trigger a rerender, probably better to add an interface specific to this.
            (0,epic_jsx__WEBPACK_IMPORTED_MODULE_2__/* .getRoots */.Lt)();
        },
        get: (param)=>{
            let { property, parent } = param;
            if (!epic_jsx__WEBPACK_IMPORTED_MODULE_2__/* .Renderer.current */.Th.current) {
                return; // Accessed outside a component.
            }
            const { component, type } = epic_jsx__WEBPACK_IMPORTED_MODULE_2__/* .Renderer.current */.Th.current;
            if (!(component === null || component === void 0 ? void 0 : component.rerender)) {
                (0,_helper__WEBPACK_IMPORTED_MODULE_0__/* .log */.cM)('Cannot rerender epic-jsx component', 'warning');
                return;
            }
            // Register rerender on current component.
            if (observedProperties.has(parent, property)) {
                const components = observedProperties.get(parent, property);
                const alreadyRegistered = components === null || components === void 0 ? void 0 : components.some((value)=>value.type === type);
                if (!alreadyRegistered) {
                    components === null || components === void 0 ? void 0 : components.push({
                        rerender: component.rerender,
                        type
                    });
                }
            } else if (!observedProperties.has(parent, property)) {
                observedProperties.add(parent, property, {
                    rerender: component.rerender,
                    type
                });
            }
        },
        delete: ()=>{
        // TODO remove observation and trigger rerender
        }
    };
};


}),
266: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
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

}]);