import md5 from "md5";
import sha1 from "sha1";




export function addslashes(string) {
    return string.replace(/\\/g, '\\\\').
        replace(/\u0008/g, '\\b').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\f/g, '\\f').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\"');
}

// function for getting current time in seconds
export function time() {
    return Math.round((new Date()).getTime() / 1000);
}

// Password hashing function
export function hash(password) {
    return md5(sha1(password));
}

// password validation 
export function validatePassword(password) {
    return /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(password);
}

export function formatDate  (dateString) {
    if (!dateString) return "N/A";
    return new Date(Number(dateString) * 1000).toLocaleString();
};




export function makeNumber(start, end) {
    const max = 8;
    start = start.toString();
    end = end.toString();
    const zeros = max - (start.length + end.length);
    return Number(start + "0".repeat(zeros) + end);
}