(self["webpackChunkdemo"] = self["webpackChunkdemo"] || []).push([["136"], {
334(module) {
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


},
71(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  a0: () => (/* binding */ createComponent),
  Mo: () => (/* binding */ updateFiber),
  Hr: () => (/* binding */ createRoot),
  qF: () => (/* binding */ addFiber)
});

// UNUSED EXPORTS: createRerenderRoot

// EXTERNAL MODULE: ./node_modules/epic-jsx/helper.ts
var helper = __webpack_require__(336);
// EXTERNAL MODULE: ./node_modules/@swc/helpers/esm/_define_property.js
var _define_property = __webpack_require__(467);
;// CONCATENATED MODULE: ./node_modules/epic-jsx/types.ts

var types_Change = /*#__PURE__*/ function(Change) {
    Change[Change["Update"] = 0] = "Update";
    Change[Change["Add"] = 1] = "Add";
    Change[Change["Delete"] = 2] = "Delete";
    return Change;
}({});
// TODO fiber should be typed as well with T to pass to Component.
class types_Fiber {
    print() {
        // `Root <${container.tagName.toLowerCase()}>`
        const type = this.type;
        if (type === 'TEXT_ELEMENT') {
            return `"${this.props.nodeValue}"`;
        }
        return `${typeof type === 'function' ? type.name : type}${this.printProps(this.props)}`;
    }
    printProps(props) {
        if (typeof props !== 'object') {
            return '';
        }
        const { children: _children, ...filtered } = props;
        if (Object.keys(filtered).length === 0) {
            return '';
        }
        return ` ${JSON.stringify(filtered)}`;
    }
    constructor(options){
        (0,_define_property._)(this, "id", void 0);
        (0,_define_property._)(this, "type", void 0);
        (0,_define_property._)(this, "child", void 0);
        (0,_define_property._)(this, "sibling", void 0);
        (0,_define_property._)(this, "parent", void 0);
        (0,_define_property._)(this, "native", void 0);
        (0,_define_property._)(this, "props", void 0);
        (0,_define_property._)(this, "hooks", void 0);
        (0,_define_property._)(this, "component", void 0);
        (0,_define_property._)(this, "previous", void 0);
        (0,_define_property._)(this, "change", void 0);
        (0,_define_property._)(this, "unmount", void 0);
        (0,_define_property._)(this, "svg", void 0);
        (0,_define_property._)(this, "endListener", void 0); // ComponentListener<T>
        Object.assign(this, options);
    }
}

;// CONCATENATED MODULE: ./node_modules/epic-jsx/component.ts


function rerender(context, fiber) {
    fiber.sibling = undefined;
    fiber.previous = fiber;
    context.pending.push(fiber);
}
function createComponent(param) {
    let { fiber, context } = param;
    const isFirstRender = !fiber.id;
    // TODO id in fiber shouldn't be optional, assign during creation.
    if (!fiber.id) {
        var _fiber_previous;
        fiber.id = ((_fiber_previous = fiber.previous) === null || _fiber_previous === void 0 ? void 0 : _fiber_previous.id) ?? Math.floor(Math.random() * 1000000);
    }
    const data = {
        component: {
            id: fiber.id,
            root: fiber,
            context,
            rerender: ()=>rerender(context, fiber),
            // TODO implement and test ref clearing on rerenders.
            ref: (0,helper/* .createRef */._3)(),
            each (callback) {
                context.afterListeners.push(()=>callback.call(fiber.component));
            },
            once (callback) {
                if (isFirstRender) {
                    context.afterListeners.push(()=>callback.call(fiber.component));
                }
            },
            after (callback) {
                (0,helper/* .log */.Rm)('this.after() lifecycle is deprecated, use this.once() or this.each()', 'warning');
                if (isFirstRender) {
                    context.afterListeners.push(()=>callback.call(fiber.component));
                }
            },
            end (callback) {
                fiber.endListener = ()=>callback.call(fiber.component);
            },
            plugin (plugins) {
                for (const plugin of plugins){
                    if (plugin) {
                        data.pluginResult = plugin;
                        throw new Error('plugin') // early-return approach.
                        ;
                    }
                }
            },
            state: undefined,
            print () {
                const type = String(typeof fiber.type === 'function' ? fiber.type.name : fiber.type);
                return `${type} #${fiber.id}`;
            }
        },
        pluginResult: undefined
    };
    return data;
}
function addFiber(current, element, previous) {
    return new types_Fiber({
        props: element.props,
        type: element.type,
        parent: current,
        hooks: typeof element.type === 'function' ? previous ? previous.hooks : [] : undefined,
        svg: current.svg || element.type === 'svg',
        change: (/* inlined export .Change.Add */1)
    });
}
function updateFiber(current, previous, element) {
    return new types_Fiber({
        props: element === null || element === void 0 ? void 0 : element.props,
        type: previous.type,
        native: previous.native,
        parent: current,
        hooks: previous.hooks,
        previous,
        svg: previous.svg || previous.type === 'svg',
        change: (/* inlined export .Change.Update */0)
    });
}
function createRerenderRoot(current) {
    return new Fiber({
        props: current.props,
        type: current.type,
        native: current.native,
        parent: current.parent,
        hooks: [],
        previous: current
    });
}
function createRoot(container, element, unmount) {
    return new types_Fiber({
        props: {
            children: [
                element
            ]
        },
        native: container,
        unmount: ()=>unmount(container),
        print () {
            return `Root <${container.tagName.toLowerCase()}>`;
        }
    });
}


},
336(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Rm: () => (log),
  Sc: () => (sizeStyleProperties),
  VM: () => (convertSvgPropsToDashCase),
  _: () => (schedule),
  _3: () => (createRef),
  d8: () => (possibleStandardNames),
  lC: () => (multipleInstancesWarning)
});
/* import */ var logua__rspack_import_0 = __webpack_require__(477);

const log = (0,logua__rspack_import_0/* .create */.v)('epic-jsx', 'blue');
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
    if (typeof globalThis.__epicJsx !== 'undefined') {
        log('Multiple instances of epic-jsx have been loaded, plugin might not work as expected', 'warning');
    } else {
        globalThis.__epicJsx = true;
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
// MIT License
// Copyright (c) Meta Platforms, Inc. and affiliates.
// From https://github.com/facebook/react/blob/main/packages/react-dom-bindings/src/shared/possibleStandardNames.js
const possibleStandardNames = {
    // HTML
    accept: 'accept',
    acceptcharset: 'acceptCharset',
    'accept-charset': 'acceptCharset',
    accesskey: 'accessKey',
    action: 'action',
    allowfullscreen: 'allowFullScreen',
    alt: 'alt',
    as: 'as',
    async: 'async',
    autocapitalize: 'autoCapitalize',
    autocomplete: 'autoComplete',
    autocorrect: 'autoCorrect',
    autofocus: 'autoFocus',
    autoplay: 'autoPlay',
    autosave: 'autoSave',
    capture: 'capture',
    cellpadding: 'cellPadding',
    cellspacing: 'cellSpacing',
    challenge: 'challenge',
    charset: 'charSet',
    checked: 'checked',
    children: 'children',
    cite: 'cite',
    class: 'className',
    classid: 'classID',
    classname: 'className',
    cols: 'cols',
    colspan: 'colSpan',
    content: 'content',
    contenteditable: 'contentEditable',
    contextmenu: 'contextMenu',
    controls: 'controls',
    controlslist: 'controlsList',
    coords: 'coords',
    crossorigin: 'crossOrigin',
    dangerouslysetinnerhtml: 'dangerouslySetInnerHTML',
    data: 'data',
    datetime: 'dateTime',
    default: 'default',
    defaultchecked: 'defaultChecked',
    defaultvalue: 'defaultValue',
    defer: 'defer',
    dir: 'dir',
    disabled: 'disabled',
    disablepictureinpicture: 'disablePictureInPicture',
    disableremoteplayback: 'disableRemotePlayback',
    download: 'download',
    draggable: 'draggable',
    enctype: 'encType',
    enterkeyhint: 'enterKeyHint',
    fetchpriority: 'fetchPriority',
    for: 'htmlFor',
    form: 'form',
    formmethod: 'formMethod',
    formaction: 'formAction',
    formenctype: 'formEncType',
    formnovalidate: 'formNoValidate',
    formtarget: 'formTarget',
    frameborder: 'frameBorder',
    headers: 'headers',
    height: 'height',
    hidden: 'hidden',
    high: 'high',
    href: 'href',
    hreflang: 'hrefLang',
    htmlfor: 'htmlFor',
    httpequiv: 'httpEquiv',
    'http-equiv': 'httpEquiv',
    icon: 'icon',
    id: 'id',
    imagesizes: 'imageSizes',
    imagesrcset: 'imageSrcSet',
    inert: 'inert',
    innerhtml: 'innerHTML',
    inputmode: 'inputMode',
    integrity: 'integrity',
    is: 'is',
    itemid: 'itemID',
    itemprop: 'itemProp',
    itemref: 'itemRef',
    itemscope: 'itemScope',
    itemtype: 'itemType',
    keyparams: 'keyParams',
    keytype: 'keyType',
    kind: 'kind',
    label: 'label',
    lang: 'lang',
    list: 'list',
    loop: 'loop',
    low: 'low',
    manifest: 'manifest',
    marginwidth: 'marginWidth',
    marginheight: 'marginHeight',
    max: 'max',
    maxlength: 'maxLength',
    media: 'media',
    mediagroup: 'mediaGroup',
    method: 'method',
    min: 'min',
    minlength: 'minLength',
    multiple: 'multiple',
    muted: 'muted',
    name: 'name',
    nomodule: 'noModule',
    nonce: 'nonce',
    novalidate: 'noValidate',
    open: 'open',
    optimum: 'optimum',
    pattern: 'pattern',
    placeholder: 'placeholder',
    playsinline: 'playsInline',
    poster: 'poster',
    preload: 'preload',
    profile: 'profile',
    radiogroup: 'radioGroup',
    readonly: 'readOnly',
    referrerpolicy: 'referrerPolicy',
    rel: 'rel',
    required: 'required',
    reversed: 'reversed',
    role: 'role',
    rows: 'rows',
    rowspan: 'rowSpan',
    sandbox: 'sandbox',
    scope: 'scope',
    scoped: 'scoped',
    scrolling: 'scrolling',
    seamless: 'seamless',
    selected: 'selected',
    shape: 'shape',
    size: 'size',
    sizes: 'sizes',
    span: 'span',
    spellcheck: 'spellCheck',
    src: 'src',
    srcdoc: 'srcDoc',
    srclang: 'srcLang',
    srcset: 'srcSet',
    start: 'start',
    step: 'step',
    style: 'style',
    summary: 'summary',
    tabindex: 'tabIndex',
    target: 'target',
    title: 'title',
    type: 'type',
    usemap: 'useMap',
    value: 'value',
    width: 'width',
    wmode: 'wmode',
    wrap: 'wrap',
    // SVG
    about: 'about',
    accentheight: 'accentHeight',
    'accent-height': 'accentHeight',
    accumulate: 'accumulate',
    additive: 'additive',
    alignmentbaseline: 'alignmentBaseline',
    'alignment-baseline': 'alignmentBaseline',
    allowreorder: 'allowReorder',
    alphabetic: 'alphabetic',
    amplitude: 'amplitude',
    arabicform: 'arabicForm',
    'arabic-form': 'arabicForm',
    ascent: 'ascent',
    attributename: 'attributeName',
    attributetype: 'attributeType',
    autoreverse: 'autoReverse',
    azimuth: 'azimuth',
    basefrequency: 'baseFrequency',
    baselineshift: 'baselineShift',
    'baseline-shift': 'baselineShift',
    baseprofile: 'baseProfile',
    bbox: 'bbox',
    begin: 'begin',
    bias: 'bias',
    by: 'by',
    calcmode: 'calcMode',
    capheight: 'capHeight',
    'cap-height': 'capHeight',
    clip: 'clip',
    clippath: 'clipPath',
    'clip-path': 'clipPath',
    clippathunits: 'clipPathUnits',
    cliprule: 'clipRule',
    'clip-rule': 'clipRule',
    color: 'color',
    colorinterpolation: 'colorInterpolation',
    'color-interpolation': 'colorInterpolation',
    colorinterpolationfilters: 'colorInterpolationFilters',
    'color-interpolation-filters': 'colorInterpolationFilters',
    colorprofile: 'colorProfile',
    'color-profile': 'colorProfile',
    colorrendering: 'colorRendering',
    'color-rendering': 'colorRendering',
    contentscripttype: 'contentScriptType',
    contentstyletype: 'contentStyleType',
    cursor: 'cursor',
    cx: 'cx',
    cy: 'cy',
    d: 'd',
    datatype: 'datatype',
    decelerate: 'decelerate',
    descent: 'descent',
    diffuseconstant: 'diffuseConstant',
    direction: 'direction',
    display: 'display',
    divisor: 'divisor',
    dominantbaseline: 'dominantBaseline',
    'dominant-baseline': 'dominantBaseline',
    dur: 'dur',
    dx: 'dx',
    dy: 'dy',
    edgemode: 'edgeMode',
    elevation: 'elevation',
    enablebackground: 'enableBackground',
    'enable-background': 'enableBackground',
    end: 'end',
    exponent: 'exponent',
    externalresourcesrequired: 'externalResourcesRequired',
    fill: 'fill',
    fillopacity: 'fillOpacity',
    'fill-opacity': 'fillOpacity',
    fillrule: 'fillRule',
    'fill-rule': 'fillRule',
    filter: 'filter',
    filterres: 'filterRes',
    filterunits: 'filterUnits',
    floodopacity: 'floodOpacity',
    'flood-opacity': 'floodOpacity',
    floodcolor: 'floodColor',
    'flood-color': 'floodColor',
    focusable: 'focusable',
    fontfamily: 'fontFamily',
    'font-family': 'fontFamily',
    fontsize: 'fontSize',
    'font-size': 'fontSize',
    fontsizeadjust: 'fontSizeAdjust',
    'font-size-adjust': 'fontSizeAdjust',
    fontstretch: 'fontStretch',
    'font-stretch': 'fontStretch',
    fontstyle: 'fontStyle',
    'font-style': 'fontStyle',
    fontvariant: 'fontVariant',
    'font-variant': 'fontVariant',
    fontweight: 'fontWeight',
    'font-weight': 'fontWeight',
    format: 'format',
    from: 'from',
    fx: 'fx',
    fy: 'fy',
    g1: 'g1',
    g2: 'g2',
    glyphname: 'glyphName',
    'glyph-name': 'glyphName',
    glyphorientationhorizontal: 'glyphOrientationHorizontal',
    'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
    glyphorientationvertical: 'glyphOrientationVertical',
    'glyph-orientation-vertical': 'glyphOrientationVertical',
    glyphref: 'glyphRef',
    gradienttransform: 'gradientTransform',
    gradientunits: 'gradientUnits',
    hanging: 'hanging',
    horizadvx: 'horizAdvX',
    'horiz-adv-x': 'horizAdvX',
    horizoriginx: 'horizOriginX',
    'horiz-origin-x': 'horizOriginX',
    ideographic: 'ideographic',
    imagerendering: 'imageRendering',
    'image-rendering': 'imageRendering',
    in2: 'in2',
    in: 'in',
    inlist: 'inlist',
    intercept: 'intercept',
    k1: 'k1',
    k2: 'k2',
    k3: 'k3',
    k4: 'k4',
    k: 'k',
    kernelmatrix: 'kernelMatrix',
    kernelunitlength: 'kernelUnitLength',
    kerning: 'kerning',
    keypoints: 'keyPoints',
    keysplines: 'keySplines',
    keytimes: 'keyTimes',
    lengthadjust: 'lengthAdjust',
    letterspacing: 'letterSpacing',
    'letter-spacing': 'letterSpacing',
    lightingcolor: 'lightingColor',
    'lighting-color': 'lightingColor',
    limitingconeangle: 'limitingConeAngle',
    local: 'local',
    markerend: 'markerEnd',
    'marker-end': 'markerEnd',
    markerheight: 'markerHeight',
    markermid: 'markerMid',
    'marker-mid': 'markerMid',
    markerstart: 'markerStart',
    'marker-start': 'markerStart',
    markerunits: 'markerUnits',
    markerwidth: 'markerWidth',
    mask: 'mask',
    maskcontentunits: 'maskContentUnits',
    maskunits: 'maskUnits',
    mathematical: 'mathematical',
    mode: 'mode',
    numoctaves: 'numOctaves',
    offset: 'offset',
    opacity: 'opacity',
    operator: 'operator',
    order: 'order',
    orient: 'orient',
    orientation: 'orientation',
    origin: 'origin',
    overflow: 'overflow',
    overlineposition: 'overlinePosition',
    'overline-position': 'overlinePosition',
    overlinethickness: 'overlineThickness',
    'overline-thickness': 'overlineThickness',
    paintorder: 'paintOrder',
    'paint-order': 'paintOrder',
    panose1: 'panose1',
    'panose-1': 'panose1',
    pathlength: 'pathLength',
    patterncontentunits: 'patternContentUnits',
    patterntransform: 'patternTransform',
    patternunits: 'patternUnits',
    pointerevents: 'pointerEvents',
    'pointer-events': 'pointerEvents',
    points: 'points',
    pointsatx: 'pointsAtX',
    pointsaty: 'pointsAtY',
    pointsatz: 'pointsAtZ',
    popover: 'popover',
    popovertarget: 'popoverTarget',
    popovertargetaction: 'popoverTargetAction',
    prefix: 'prefix',
    preservealpha: 'preserveAlpha',
    preserveaspectratio: 'preserveAspectRatio',
    primitiveunits: 'primitiveUnits',
    property: 'property',
    r: 'r',
    radius: 'radius',
    refx: 'refX',
    refy: 'refY',
    renderingintent: 'renderingIntent',
    'rendering-intent': 'renderingIntent',
    repeatcount: 'repeatCount',
    repeatdur: 'repeatDur',
    requiredextensions: 'requiredExtensions',
    requiredfeatures: 'requiredFeatures',
    resource: 'resource',
    restart: 'restart',
    result: 'result',
    results: 'results',
    rotate: 'rotate',
    rx: 'rx',
    ry: 'ry',
    scale: 'scale',
    security: 'security',
    seed: 'seed',
    shaperendering: 'shapeRendering',
    'shape-rendering': 'shapeRendering',
    slope: 'slope',
    spacing: 'spacing',
    specularconstant: 'specularConstant',
    specularexponent: 'specularExponent',
    speed: 'speed',
    spreadmethod: 'spreadMethod',
    startoffset: 'startOffset',
    stddeviation: 'stdDeviation',
    stemh: 'stemh',
    stemv: 'stemv',
    stitchtiles: 'stitchTiles',
    stopcolor: 'stopColor',
    'stop-color': 'stopColor',
    stopopacity: 'stopOpacity',
    'stop-opacity': 'stopOpacity',
    strikethroughposition: 'strikethroughPosition',
    'strikethrough-position': 'strikethroughPosition',
    strikethroughthickness: 'strikethroughThickness',
    'strikethrough-thickness': 'strikethroughThickness',
    string: 'string',
    stroke: 'stroke',
    strokedasharray: 'strokeDasharray',
    'stroke-dasharray': 'strokeDasharray',
    strokedashoffset: 'strokeDashoffset',
    'stroke-dashoffset': 'strokeDashoffset',
    strokelinecap: 'strokeLinecap',
    'stroke-linecap': 'strokeLinecap',
    strokelinejoin: 'strokeLinejoin',
    'stroke-linejoin': 'strokeLinejoin',
    strokemiterlimit: 'strokeMiterlimit',
    'stroke-miterlimit': 'strokeMiterlimit',
    strokewidth: 'strokeWidth',
    'stroke-width': 'strokeWidth',
    strokeopacity: 'strokeOpacity',
    'stroke-opacity': 'strokeOpacity',
    suppresscontenteditablewarning: 'suppressContentEditableWarning',
    suppresshydrationwarning: 'suppressHydrationWarning',
    surfacescale: 'surfaceScale',
    systemlanguage: 'systemLanguage',
    tablevalues: 'tableValues',
    targetx: 'targetX',
    targety: 'targetY',
    textanchor: 'textAnchor',
    'text-anchor': 'textAnchor',
    textdecoration: 'textDecoration',
    'text-decoration': 'textDecoration',
    textlength: 'textLength',
    textrendering: 'textRendering',
    'text-rendering': 'textRendering',
    to: 'to',
    transform: 'transform',
    transformorigin: 'transformOrigin',
    'transform-origin': 'transformOrigin',
    typeof: 'typeof',
    u1: 'u1',
    u2: 'u2',
    underlineposition: 'underlinePosition',
    'underline-position': 'underlinePosition',
    underlinethickness: 'underlineThickness',
    'underline-thickness': 'underlineThickness',
    unicode: 'unicode',
    unicodebidi: 'unicodeBidi',
    'unicode-bidi': 'unicodeBidi',
    unicoderange: 'unicodeRange',
    'unicode-range': 'unicodeRange',
    unitsperem: 'unitsPerEm',
    'units-per-em': 'unitsPerEm',
    unselectable: 'unselectable',
    valphabetic: 'vAlphabetic',
    'v-alphabetic': 'vAlphabetic',
    values: 'values',
    vectoreffect: 'vectorEffect',
    'vector-effect': 'vectorEffect',
    version: 'version',
    vertadvy: 'vertAdvY',
    'vert-adv-y': 'vertAdvY',
    vertoriginx: 'vertOriginX',
    'vert-origin-x': 'vertOriginX',
    vertoriginy: 'vertOriginY',
    'vert-origin-y': 'vertOriginY',
    vhanging: 'vHanging',
    'v-hanging': 'vHanging',
    videographic: 'vIdeographic',
    'v-ideographic': 'vIdeographic',
    viewbox: 'viewBox',
    viewtarget: 'viewTarget',
    visibility: 'visibility',
    vmathematical: 'vMathematical',
    'v-mathematical': 'vMathematical',
    vocab: 'vocab',
    widths: 'widths',
    wordspacing: 'wordSpacing',
    'word-spacing': 'wordSpacing',
    writingmode: 'writingMode',
    'writing-mode': 'writingMode',
    x1: 'x1',
    x2: 'x2',
    x: 'x',
    xchannelselector: 'xChannelSelector',
    xheight: 'xHeight',
    'x-height': 'xHeight',
    xlinkactuate: 'xlinkActuate',
    'xlink:actuate': 'xlinkActuate',
    xlinkarcrole: 'xlinkArcrole',
    'xlink:arcrole': 'xlinkArcrole',
    xlinkhref: 'xlinkHref',
    'xlink:href': 'xlinkHref',
    xlinkrole: 'xlinkRole',
    'xlink:role': 'xlinkRole',
    xlinkshow: 'xlinkShow',
    'xlink:show': 'xlinkShow',
    xlinktitle: 'xlinkTitle',
    'xlink:title': 'xlinkTitle',
    xlinktype: 'xlinkType',
    'xlink:type': 'xlinkType',
    xmlbase: 'xmlBase',
    'xml:base': 'xmlBase',
    xmllang: 'xmlLang',
    'xml:lang': 'xmlLang',
    xmlns: 'xmlns',
    'xml:space': 'xmlSpace',
    xmlnsxlink: 'xmlnsXlink',
    'xmlns:xlink': 'xmlnsXlink',
    xmlspace: 'xmlSpace',
    y1: 'y1',
    y2: 'y2',
    y: 'y',
    ychannelselector: 'yChannelSelector',
    z: 'z',
    zoomandpan: 'zoomAndPan'
};


},
510(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  XX: () => (render),
  ug: () => (getRoots)
});
/* import */ var _component__rspack_import_2 = __webpack_require__(71);
/* import */ var _helper__rspack_import_1 = __webpack_require__(336);
/* import */ var _render__rspack_import_0 = __webpack_require__(637);








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
        (0,_render__rspack_import_0/* .processNow */.M0)(context);
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
            (0,_render__rspack_import_0/* .processNow */.M0)(context);
        }
    }
    return contexts;
};
const unmount = (container)=>{
    if (!container) {
        (0,_helper__rspack_import_1/* .log */.Rm)('Trying to unmount empty container', 'warning');
        return;
    }
    container.innerHTML = '';
    const context = getRoot(container);
    if (!context) {
        return;
    }
    roots.delete(container);
};
const unmountAll = ()=>roots.forEach((_, container)=>{
        unmount(container);
    });
function render(element, container) {
    if (!container) {
        // biome-ignore lint/style/noParameterAssign: Why wouldn't a method default work?
        container = document.body; // Default assignment in args wouldn't override null.
    }
    if (roots.has(container)) {
        unmount(container);
    } else {
        container.innerHTML = ''; // Always clearing the container first.
    }
    const root = (0,_component__rspack_import_2/* .createRoot */.Hr)(container, element, unmount);
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
    (0,_helper__rspack_import_1/* .schedule */._)((deadline)=>(0,_render__rspack_import_0/* .process */.eh)(deadline, context));
    return context;
}
(0,_helper__rspack_import_1/* .multipleInstancesWarning */.lC)();


},
731(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  FD: () => (jsxs),
  Y: () => (jsx)
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


},
637(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A4: () => (/* binding */ Renderer),
  eh: () => (/* binding */ process),
  M0: () => (/* binding */ processNow)
});

// EXTERNAL MODULE: ./node_modules/epic-jsx/helper.ts
var helper = __webpack_require__(336);
;// CONCATENATED MODULE: ./node_modules/epic-jsx/browser.ts


function startsWithSizeProperty(propertyName) {
    return helper/* .sizeStyleProperties.some */.Sc.some((prop)=>propertyName.startsWith(prop));
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
function getPropertyValue(property, value) {
    // Write disabled="disabled", as boolean not supported.
    if ([
        'disabled',
        'checked'
    ].includes(property)) {
        return value ? property : undefined;
    }
    return value;
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
                const value = getPropertyValue(name, nextProps[name]);
                if (value !== undefined && (name.toLowerCase() in helper/* .possibleStandardNames */.d8 || name.startsWith('aria-'))) {
                    ;
                    element.setAttribute(name, value);
                }
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
        (0,helper/* .log */.Rm)('Ran out of tries finding native parent.', 'warning');
    }
    return parent;
}
function createNativeElement(fiber) {
    if (!fiber.type) {
        return; // Ignore fragments.
    }
    mapLegacyProps(fiber);
    let element;
    if (fiber.type === 'TEXT_ELEMENT') {
        element = document.createTextNode('');
    } else if (fiber.svg) {
        (0,helper/* .convertSvgPropsToDashCase */.VM)(fiber.props);
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
                (0,helper/* .log */.Rm)("Trying to remove a node from a parent that's no longer in the DOM", 'warning');
            } else {
                (0,helper/* .log */.Rm)("Trying to remove a node that's no longer in the DOM", 'warning');
            }
        } catch (_error) {
            // NOTE indicates a plugin error, should not happen.
            (0,helper/* .log */.Rm)('Failed to remove node from the DOM', 'warning');
        }
        fiber.change = undefined;
    } else if (fiber.child) {
        // Avoid another delete when visiting though siblings.
        fiber.change = undefined;
        fiber.child.change = (/* inlined export .Change.Delete */2);
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
    if (fiber.change === (/* inlined export .Change.Add */1) && fiber.native) {
        var _parent_native;
        parent === null || parent === void 0 ? void 0 : (_parent_native = parent.native) === null || _parent_native === void 0 ? void 0 : _parent_native.appendChild(fiber.native);
    } else if (fiber.change === (/* inlined export .Change.Update */0) && fiber.native) {
        var _fiber_previous;
        updateNativeElement(fiber.native, (_fiber_previous = fiber.previous) === null || _fiber_previous === void 0 ? void 0 : _fiber_previous.props, fiber.props);
    } else if (fiber.change === (/* inlined export .Change.Delete */2) && parent) {
        if (fiber.native && eventListeners.has(fiber.native)) {
            eventListeners.delete(fiber.native); // Clean up event listener tracking.
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

// EXTERNAL MODULE: ./node_modules/epic-jsx/component.ts + 1 modules
var epic_jsx_component = __webpack_require__(71);
;// CONCATENATED MODULE: ./node_modules/epic-jsx/render.ts




const Renderer = {
    context: undefined,
    effects: [],
    current: undefined
};
function commit(context, fiber) {
    for (const currentFiber of context.deletions){
        commitFiber(currentFiber);
        if (typeof currentFiber.type === 'function' && typeof currentFiber.endListener === 'function') {
            currentFiber.endListener();
        }
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
    node.change = (/* inlined export .Change.Delete */2);
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
            newFiber = (0,epic_jsx_component/* .updateFiber */.Mo)(current, previous, element);
        } else if (element) {
            // Create new fiber for different types or new elements
            newFiber = (0,epic_jsx_component/* .addFiber */.qF)(current, element, previous);
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
        (0,helper/* .log */.Rm)('Ran out of tries at reconcileChildren.', 'warning');
    }
}
function deleteChildren(context, fiber) {
    if (fiber.change === (/* inlined export .Change.Delete */2)) {
        return;
    }
    fiber.change = (/* inlined export .Change.Delete */2);
    context.deletions.push(fiber);
    if (fiber.child) {
        deleteChildren(context, fiber.child);
    }
    if (fiber.sibling) {
        deleteChildren(context, fiber.sibling);
    }
}
function propsChanged(nextProps, previousProps) {
    if (!previousProps) {
        return true;
    }
    const nextKeys = Object.keys(nextProps).filter((key)=>key !== 'children');
    const prevKeys = Object.keys(previousProps).filter((key)=>key !== 'children');
    if (nextKeys.length !== prevKeys.length) {
        return true;
    }
    for (const key of nextKeys){
        const nextVal = nextProps[key];
        const prevVal = previousProps[key];
        // Handle functions - compare by reference
        if (typeof nextVal === 'function') {
            if (nextVal !== prevVal) {
                return true;
            }
            continue;
        }
        // Handle objects and arrays
        if (typeof nextVal === 'object' && nextVal !== null) {
            if (Array.isArray(nextVal)) {
                if (!Array.isArray(prevVal) || nextVal.length !== prevVal.length) {
                    return true;
                }
                for(let i = 0; i < nextVal.length; i++){
                    if (nextVal[i] !== prevVal[i]) {
                        return true;
                    }
                }
            } else if (!propsChanged(nextVal, prevVal)) {
                return true;
            }
            continue;
        }
        // Handle primitives
        if (nextVal !== prevVal) {
            return true;
        }
    }
    // Deep child comparison.
    const nextChildren = nextProps.children;
    const prevChildren = previousProps.children;
    // Handle undefined/null cases
    if (!nextChildren !== !prevChildren) {
        return true;
    }
    // Compare arrays of children
    if (Array.isArray(nextChildren) && Array.isArray(prevChildren)) {
        if (nextChildren.length !== prevChildren.length) {
            return true;
        }
        return nextChildren.some((nextChild, index)=>{
            const prevChild = prevChildren[index];
            // Handle null/undefined cases
            if (!nextChild !== !prevChild) {
                return true;
            }
            // If both are objects (likely Fibers or Elements), compare their properties
            if (typeof nextChild === 'object' && typeof prevChild === 'object' && nextChild && prevChild) {
                if (typeof nextChild.type === 'string' && typeof prevChild.type === 'string') {
                    return true;
                }
                return nextChild.type !== prevChild.type || propsChanged(nextChild.props || {}, prevChild.props || {});
            }
            // Fallback to reference equality for primitives
            return nextChild !== prevChild;
        });
    }
    // Compare single child with deep comparison
    if (typeof nextChildren === 'object' && typeof prevChildren === 'object' && nextChildren && prevChildren) {
        return nextChildren.type !== prevChildren.type || propsChanged(nextChildren.props || {}, prevChildren.props || {});
    }
    return nextChildren !== prevChildren;
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
    const componentData = (0,epic_jsx_component/* .createComponent */.a0)({
        fiber,
        context
    });
    fiber.component = componentData.component;
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
        if (error.message === 'plugin' && componentData.pluginResult) {
            children = [
                componentData.pluginResult
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
    let isFirst = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    const isFunctionComponent = fiber.type instanceof Function;
    if (isFunctionComponent) {
        var _fiber_previous;
        if (isFirst || propsChanged(fiber.props, (_fiber_previous = fiber.previous) === null || _fiber_previous === void 0 ? void 0 : _fiber_previous.props)) {
            updateFunctionComponent(context, fiber);
        }
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
        (0,helper/* .log */.Rm)('Ran out of tries at render.', 'warning');
    }
    return;
}
function process(deadline, context) {
    if (!context.current && context.pending.length === 0) {
        (0,helper/* .log */.Rm)('Trying to process an empty queue');
        return;
    }
    if (!context.current) {
        context.current = context.pending.shift();
        if (context.current) {
            context.rendered.push(context.current); // Rendered state only final when current empty.
        }
    }
    context.afterListeners = [];
    let shouldYield = false;
    let maxTries = 5000 // Prevent infinite loop, long lists can take a lot of tries.
    ;
    while(context.current && !shouldYield && maxTries > 0){
        maxTries -= 1;
        // Render current fiber.
        context.current = render(context, context.current, maxTries === 4999);
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
        (0,helper/* .log */.Rm)('Ran out of tries at process.', 'warning');
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
        (0,helper/* .schedule */._)((nextDeadline)=>process(nextDeadline, context));
    }
}
const processNow = (context)=>process({
        timeRemaining: ()=>99999,
        didTimeout: false
    }, context);


},
340(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Gv: () => (isObject),
  I4: () => (isSetter),
  N1: () => (newProxy),
  Oj: () => (updateProxyValues),
  PS: () => (canProxy),
  Rl: () => (listGetters),
  Rm: () => (log),
  a$: () => (canPolyfill),
  td: () => (createBaseObject),
  xe: () => (isLeaf),
  zi: () => (needsRegister)
});
/* import */ var logua__rspack_import_0 = __webpack_require__(477);

const log = (0,logua__rspack_import_0/* .create */.v)('epic-state', 'red');
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
    if (typeof globalThis.__epicState !== 'undefined') {
        log('Multiple instances of epic-state have been loaded, plugin might not work as expected', 'warning');
    } else {
        globalThis.__epicState = true;
    }
}


},
979(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  wk: () => (/* binding */ epic_state_state)
});

// UNUSED EXPORTS: ref, removeAllPlugins, remove, plugin

// EXTERNAL MODULE: ./node_modules/epic-jsx/render.ts + 1 modules
var render = __webpack_require__(637);
// EXTERNAL MODULE: ./node_modules/epic-state/helper.ts
var helper = __webpack_require__(340);
// EXTERNAL MODULE: ./node_modules/epic-state/plugin.ts
var epic_state_plugin = __webpack_require__(739);
;// CONCATENATED MODULE: ./node_modules/epic-state/batching.ts


const batching = {
    updates: [],
    scheduler: undefined
};
const scheduleUpdate = (update)=>{
    batching.updates.unshift(update); // Most recent update will be processed first, to allow filtering already applied changes.
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
        (0,helper/* .log */.Rm)('Trying to batch empty updates');
        return;
    }
    let shouldYield = false;
    let maxTries = 500;
    while(batching.updates.length > 0 && !shouldYield && maxTries > 0){
        maxTries -= 1;
        const update = batching.updates.shift();
        if (update) {
            (0,epic_state_plugin/* .callPlugins */.n0)(update);
            // Filter out already applied updates.
            batching.updates = batching.updates.filter((potentialUpdate)=>potentialUpdate.property !== update.property || potentialUpdate.parent !== update.parent);
        }
        // Yield current rendering cycle if out of time.
        shouldYield = deadline.timeRemaining() < 1;
    }
    if (maxTries === 0) {
        (0,helper/* .log */.Rm)('Ran out of tries at process.', 'warning');
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
    const getters = (0,helper/* .listGetters */.Rl)(proxy);
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
    if (((_Renderer_current = render/* .Renderer.current */.A4.current) === null || _Renderer_current === void 0 ? void 0 : _Renderer_current.id) && renderStateMap.has(render/* .Renderer.current.id */.A4.current.id)) {
        return renderStateMap.get(render/* .Renderer.current.id */.A4.current.id);
    }
    let initialization = true;
    if (typeof initialObject === 'function') {
        // biome-ignore lint/style/noParameterAssign: Much easier in this case.
        initialObject = initialObject();
    }
    if (!(0,helper/* .isObject */.Gv)(initialObject)) {
        (0,helper/* .log */.Rm)('Only objects can be made observable with state()', 'error');
    }
    if (!parent && Object.hasOwn(initialObject, 'parent')) {
        (0,helper/* .log */.Rm)('"parent" property is reserved on state objects to reference the parent', 'warning');
    }
    if (!root && Object.hasOwn(initialObject, 'root')) {
        (0,helper/* .log */.Rm)('"root" property is reserved on state objects to reference the root', 'warning');
    }
    derive(initialObject);
    let plugins = [];
    const baseObject = (0,helper/* .createBaseObject */.td)(initialObject);
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
                (0,epic_state_plugin/* .callPlugins */.n0)({
                    type: (/* inlined export .PluginAction.Get */"get"),
                    target: receiver,
                    initial: true,
                    property,
                    parent: receiver ?? root,
                    leaf: (0,helper/* .isLeaf */.xe)(value),
                    value
                });
                track(root ?? receiver, property);
            }
            // Register receiver and property on custom data structures.
            // TODO should only be done on first access.
            if ((0,helper/* .needsRegister */.zi)(value)) {
                ;
                value._register(receiver ?? root, property);
            }
            return value;
        },
        // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Difficult to fix, central part of the application.
        set (target, property, value, receiver) {
            if (property === 'parent' || property === 'root' || !initialization && property === 'plugin') {
                (0,helper/* .log */.Rm)(`"${property}" is reserved an cannot be changed`, 'warning');
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
                } else if (!proxyStateMap.has(value) && (0,helper/* .canProxy */.PS)(value, refSet)) {
                    nextValue = epic_state_state(value, receiver, root ?? receiver);
                } else if ((0,helper/* .canPolyfill */.a$)(value)) {
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
                (0,helper/* .updateProxyValues */.Oj)(previousValue, value);
                return true;
            }
            if (previousValue === undefined && !(0,helper/* .isSetter */.I4)(target, property)) {
                Object.defineProperty(target, property, {
                    value: nextValue,
                    writable: true,
                    configurable: true
                });
            } else {
                Reflect.set(target, property, nextValue, receiver);
            }
            if (!initialization) {
                isTracked(root ?? receiver, property); // Mark changed values as "dirty" before plugins (rerenders).
                scheduleUpdate({
                    type: (/* inlined export .PluginAction.Set */"set"),
                    target: receiver,
                    initial: true,
                    property,
                    parent: receiver ?? root,
                    value,
                    previousValue,
                    leaf: (0,helper/* .isLeaf */.xe)(value)
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
                    type: (/* inlined export .PluginAction.Delete */"delete"),
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
    const proxyObject = (0,helper/* .newProxy */.N1)(baseObject, handler);
    const proxyState = [
        baseObject
    ];
    proxyStateMap.set(proxyObject, proxyState);
    if ((_Renderer_current1 = render/* .Renderer.current */.A4.current) === null || _Renderer_current1 === void 0 ? void 0 : _Renderer_current1.id) {
        renderStateMap.set(render/* .Renderer.current.id */.A4.current.id, proxyObject);
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
    plugins = (0,epic_state_plugin/* .initializePlugins */.pI)(proxyObject, initialObject.plugin);
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


},
739(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  IQ: () => (plugin),
  n0: () => (callPlugins),
  pI: () => (initializePlugins)
});

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
            if (plugin && (item.all || options.leaf || type === (/* inlined export .PluginAction.Delete */"delete"))) {
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
        if (plugin && (item.all || options.leaf || type === (/* inlined export .PluginAction.Delete */"delete"))) {
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


},
599(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  N: () => (/* binding */ connect)
});

// UNUSED EXPORTS: debug

// EXTERNAL MODULE: ./node_modules/epic-jsx/index.ts
var epic_jsx = __webpack_require__(510);
// EXTERNAL MODULE: ./node_modules/epic-jsx/render.ts + 1 modules
var render = __webpack_require__(637);
// EXTERNAL MODULE: ./node_modules/epic-state/helper.ts
var helper = __webpack_require__(340);
// EXTERNAL MODULE: ./node_modules/@swc/helpers/esm/_define_property.js
var _define_property = __webpack_require__(467);
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
        (0,_define_property._)(this, "observedProperties", new Map());
    }
}

;// CONCATENATED MODULE: ./node_modules/epic-state/plugin/epic-jsx.ts



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
        (0,helper/* .log */.Rm)('connect plugin cannot be configured', 'warning');
    }
    const observedProperties = new TupleArrayMap();
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
                        renderedComponents.add(component.id); // Mark as rendered
                    }
                }
            }
            // TODO This will trigger a rerender, probably better to add an interface specific to this.
            (0,epic_jsx/* .getRoots */.ug)();
        },
        get: (param)=>{
            let { property, parent: { _id: id } } = param;
            if (!render/* .Renderer.current */.A4.current) {
                return; // Accessed outside a component.
            }
            const { component } = render/* .Renderer.current */.A4.current;
            if (!(component === null || component === void 0 ? void 0 : component.rerender)) {
                (0,helper/* .log */.Rm)('Cannot rerender epic-jsx component', 'warning');
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


},
467(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  _: () => (_define_property)
});
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else obj[key] = value;

    return obj;
}



},
477(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  v: () => (create)
});
/* import */ var debounce__rspack_import_0 = __webpack_require__(334);
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
          handler: debounce__rspack_import_0(groupLog, options.timeout || 50),
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


},

}]);