function encodeCharacter(buffer, value, shouldEncode) {
    let charCode;
    if (value > 0) shouldEncode = true;

    if (shouldEncode) {
        if (value < 26) charCode = 65 + value; // Uppercase letters (A-Z)
        else if (value < 52) charCode = 97 + value - 26; // Lowercase letters (a-z)
        else if (value < 62) charCode = 48 + value - 52; // Digits (0-9)
        else charCode = value === 62 ? 36 : 95; // Special characters ($ or _)

        buffer.add(String.fromCharCode(charCode & 65535))
    }
    return shouldEncode;
}

class Buffer {
    constructor() {
        this.buffer = '';
    }

    add(char) {
        this.buffer += char;
    }
}

class Triple {
    constructor(h, l, m) {
        this.h = h;
        this.l = l;
        this.m = m;
    }

    combineParts() {
        return this.l | (this.m << 22);
    }

    bitwiseAnd(b) {
        let a = this
        return new Triple(a.h & b.h, a.l & b.l, a.m & b.m);
    }

    shiftRight(shift) {
        let a = this

        let low, mid, high, isNegative;
        shift &= 63;
        high = a.h;
        isNegative = (high & 524288) !== 0;
        if (isNegative) high |= -1048576;

        if (shift < 22) {
            low = (a.l >> shift) | (a.m << (22 - shift));
            mid = (a.m >> shift) | (high << (22 - shift));
            high = high >> shift;
        } else if (shift < 44) {
            low = (a.m >> (shift - 22)) | (high << (44 - shift));
            mid = high >> (shift - 22);
            high = isNegative ? 1048575 : 0;
        } else {
            low = high >> (shift - 44);
            mid = isNegative ? 4194303 : 0;
            high = isNegative ? 1048575 : 0;
        }

        return new Triple(high & 1048575, low & 4194303, mid & 4194303);
    }
}

const BIT_MASK = new Triple(1048575, 4194303, 4194303);

function encodeValue(a) {
    const combined = a.bitwiseAnd(BIT_MASK).combineParts();
    const shifted = a.shiftRight(32).combineParts();
    const buffer = new Buffer();

    let shouldEncode = false;
    shouldEncode = encodeCharacter(buffer, (shifted >> 4) & 63, shouldEncode);

    const lastValue = ((shifted & 15) << 2) | ((combined >> 30) & 3);
    shouldEncode = encodeCharacter(buffer, lastValue, shouldEncode);

    for (let i = 24; i >= 0; i -= 6) {
        encodeCharacter(buffer, (combined >> i) & 63, shouldEncode);
    }
    return buffer
}

function pRd2(a) {
    return Math.trunc(Math.max(Math.min(a, 2147483647), -2147483648));
}

function Test(a) {
    var b, c, d, e, g;
    
    e = false;

    d = 0;
    if (a >= 17592186044416) {
        d = pRd2(a / 17592186044416);
        a -= d * 17592186044416
    }
    c = 0;
    if (a >= 4194304) {
        c = pRd2(a / 4194304);
        a -= c * 4194304
    }

    return new Triple(d,pRd2(a),c)
}

export function generateToken(){
    return encodeValue(Test((new Date()).getTime())).buffer
}