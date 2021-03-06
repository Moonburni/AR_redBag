import fetch from 'isomorphic-fetch';
import cookie from 'js-cookie';
import {host} from "../../../config"

const errorMessages = (res) => `${res.status} ${res.statusText}`;

function check401(res) {
    if (res.status === 401) {
        location.href = '/401';
    }
    return res;
}

function check404(res) {
    if (res.status === 404) {
        return Promise.reject(errorMessages(res));
    }
    return res;
}

function jsonParse(res) {
    return res.json().then(jsonResult => ({ ...res, jsonResult }));
}

function errorMessageParse(res) {
    const { success, msg } = res.jsonResult;
    if (!success) {
        return Promise.reject(msg);
    }
    return res;
}

export async function xFetch(url, options) {
    const opts = { ...options };
    opts.headers = {
        ...opts.headers,
        "Content-Type": "application/json",
        "Accept": "application/json",
        token: cookie.get('token') || '',
    };

    return fetch(host+url, opts)
        .then(check401)
        .then(check404)
        .then(jsonParse)
        .then(errorMessageParse);
}

