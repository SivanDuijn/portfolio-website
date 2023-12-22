let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}
/**
* @param {ShapePlane} sp1
* @param {ShapePlane} sp2
* @param {ShapePlane} sp3
* @param {ConnectednessOptions} connectedness
* @returns {Triplet}
*/
export function get_best_triplet(sp1, sp2, sp3, connectedness) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(sp1, ShapePlane);
        _assertClass(sp2, ShapePlane);
        _assertClass(sp3, ShapePlane);
        wasm.get_best_triplet(retptr, sp1.__wbg_ptr, sp2.__wbg_ptr, sp3.__wbg_ptr, connectedness);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return Triplet.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {ShapePlane} sp
*/
export function test(sp) {
    _assertClass(sp, ShapePlane);
    wasm.test(sp.__wbg_ptr);
}

/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
export function add(a, b) {
    const ret = wasm.add(a, b);
    return ret;
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

let WASM_VECTOR_LEN = 0;

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
*/
export const ConnectednessOptions = Object.freeze({ Volume:0,"0":"Volume",Edge:1,"1":"Edge",Vertex:2,"2":"Vertex", });
/**
*/
export class ShapePlane {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_shapeplane_free(ptr);
    }
    /**
    * @returns {number}
    */
    get w() {
        const ret = wasm.__wbg_get_shapeplane_w(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set w(arg0) {
        wasm.__wbg_set_shapeplane_w(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get h() {
        const ret = wasm.__wbg_get_shapeplane_h(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set h(arg0) {
        wasm.__wbg_set_shapeplane_h(this.__wbg_ptr, arg0);
    }
    /**
    * @param {Int32Array} values
    * @param {number} w
    * @param {number} h
    */
    constructor(values, w, h) {
        const ptr0 = passArray32ToWasm0(values, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.shapeplane_new(ptr0, len0, w, h);
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
}
/**
*/
export class Triplet {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Triplet.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_triplet_free(ptr);
    }
    /**
    * @returns {number}
    */
    get w() {
        const ret = wasm.__wbg_get_triplet_w(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set w(arg0) {
        wasm.__wbg_set_triplet_w(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get h() {
        const ret = wasm.__wbg_get_triplet_h(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set h(arg0) {
        wasm.__wbg_set_triplet_h(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get d() {
        const ret = wasm.__wbg_get_triplet_d(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set d(arg0) {
        wasm.__wbg_set_triplet_d(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {TripletErrorScore}
    */
    get error_score() {
        const ret = wasm.__wbg_get_triplet_error_score(this.__wbg_ptr);
        return TripletErrorScore.__wrap(ret);
    }
    /**
    * @param {TripletErrorScore} arg0
    */
    set error_score(arg0) {
        _assertClass(arg0, TripletErrorScore);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_triplet_error_score(this.__wbg_ptr, ptr0);
    }
    /**
    * @returns {Int32Array}
    */
    get_volume() {
        const ret = wasm.triplet_get_volume(this.__wbg_ptr);
        return takeObject(ret);
    }
}
/**
*/
export class TripletErrorScore {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TripletErrorScore.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tripleterrorscore_free(ptr);
    }
    /**
    * @returns {number}
    */
    get sp1() {
        const ret = wasm.__wbg_get_tripleterrorscore_sp1(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set sp1(arg0) {
        wasm.__wbg_set_tripleterrorscore_sp1(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get sp2() {
        const ret = wasm.__wbg_get_tripleterrorscore_sp2(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set sp2(arg0) {
        wasm.__wbg_set_tripleterrorscore_sp2(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get sp3() {
        const ret = wasm.__wbg_get_tripleterrorscore_sp3(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set sp3(arg0) {
        wasm.__wbg_set_tripleterrorscore_sp3(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    sum() {
        const ret = wasm.tripleterrorscore_sum(this.__wbg_ptr);
        return ret;
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_log_35cd794ed37ce702 = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_buffer_a448f833075b71ba = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_be0a0b31d480f4b2 = function(arg0, arg1, arg2) {
        const ret = new Int32Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_df9769bc6a6fa4c1 = function(arg0) {
        const ret = new Int32Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('wasm_test_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
