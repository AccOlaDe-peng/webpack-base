import axios from "axios";

let timeout = 100000;
let baseURL = "http://10.0.0.24/api";

const server = axios.create({
    // baseURL: process.env.DOMAIN ? 'http://' + process.env.DOMAIN : 'http://' + process.env.IP + ':' + process.env.PORT,
    baseURL,
    // 跨域
    // withCredentials: true,
    // 请求超时时间
    timeout,
    // 设置post请求的请求头
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // headers: { 'Content-Type': 'application/json' }
});

/**
 * http request 拦截器
 */
server.interceptors.request.use(
    (config) => {
        config.data = JSON.stringify(config.data);
        config.headers = {
            "Content-Type": "application/json",
        };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * http response 拦截器
 */

server.interceptors.response.use(
     (response) => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        if (response.status === 0 || response.status === 200) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(response)
        }
    },
    // 服务器状态码不是2开头的的情况
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    (error) => {
        if (error && error.response) {
            switch (err.response.status) {
                case 400:
                    return Promise.reject(err.response.data.error.details);
                case 401:
                    return Promise.reject(new Error('未授权，请登录'));
                case 403:
                    return Promise.reject(new Error('拒绝访问'));
                case 404:
                    return Promise.reject(new Error('请求地址出错'));
                case 408:
                    return Promise.reject(new Error('请求超时'));
                case 500:
                    return Promise.reject(new Error('服务器内部错误'));
                case 501:
                    return Promise.reject(new Error('服务未实现'));
                case 502:
                    return Promise.reject(new Error('网关错误'));
                case 503:
                    return Promise.reject(new Error('服务不可用'));
                case 504:
                    return Promise.reject(new Error('网关超时'));
                case 505:
                    return Promise.reject(new Error('HTTP版本不受支持'));
                default:
                    return Promise.reject(error)
            }
        }
    }
);

export const get = (url, param = {}, page = {}) => {
    const params = Object.assign(param, page)
    return new Promise((resolve, reject) => {
        server({
            method: 'get',
            url,
            params
        })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.data)
            })
    })
}

export const post = (url, data = {}, params = {}) => {
    return new Promise((resolve, reject) => {
        server({
            method: 'post',
            url,
            data,
            params
        })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.data)
            })
    })
}

export const put = (url, data) => {
    return new Promise((resolve, reject) => {
        server({
            method: 'put',
            url,
            data
        })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.data)
            })
    })
}

export const upload = (url, data) => {
    return new Promise((resolve, reject) => {
        server({
            method: 'post',
            url,
            data
        })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.data)
            })
    })
}
export const patch = (url, data) => {
    return new Promise((resolve, reject) => {
        server({
            method: 'patch',
            url,
            data
        })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.data)
            })
    })
}

export const del = (url, data) => {
    return new Promise((resolve, reject) => {
        server({
            method: 'delete',
            url,
            data
        })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.data)
            })
    })
}

export class URL {
    source = ''
    url = ''
    param = {}
    query = {}
    page = {}

    constructor(url) {
        this.source = url.indexOf('http') > -1 ? url : baseURL + url
        this.url = this.source
    }

    setPart(part) {
        let _url = this.source
        Object.keys(part)
            .map((key) => ({ partKey: key, urlKey: `{${key}}` }))
            .map((item) => {
                _url = _url.replace(new RegExp(item.urlKey, 'gm'), part[item.partKey])
            })
        this.url = _url
        return this
    }

    setParameters(param) {
        this.param = param
        return this
    }

    setQuery(query) {
        this.query = query
        return this
    }

    setPage(page) {
        this.page = page
        return this
    }

    post() {
        return post(this.url, this.param, this.query)
    }

    upload() {
        return upload(this.url, this.param)
    }

    delete() {
        return del(this.url, this.param)
    }

    put() {
        return put(this.url, this.param)
    }

    patch() {
        return patch(this.url, this.param)
    }

    get() {
        return get(this.url, this.param, this.page)
    }
}