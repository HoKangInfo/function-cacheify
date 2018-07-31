'use strict'

const promisify = require('util').promisify

const _ = require('lodash')

const hash = require('js-hash-code')

/**
 * Cache
 */
const LRU = require('lru-cache')
const KeyStore = LRU(1000)

const CacheOpts = {
  'max': 1000,
  'maxAge': 1000 * 60 * 60 * 4 // cache 4hr
}

const AsyncCache = require('async-cache')
class AsyncCachePromise extends AsyncCache {
  constructor (_opts) {
    const opts = _.chain(_opts).cloneDeep().tap((o) => {
      let load = o.load
      if (load) o['load'] = (key, cb) => load(key).then(data => cb(null, data), cb)
    }).value()

    super(opts)
  }

  get (key) {
    return promisify(super.get.bind(this))(key)
  }
}

const proxy = (fn, opts) => {
  const StoreCache = new AsyncCachePromise(_.defaults({
    'load': (key) => fn.apply(fn, KeyStore.get(key))
  }, _.defaults(opts || {}, CacheOpts)))

  return (...args) => {
    const key = hash(args)
    if (!KeyStore.has(key)) KeyStore.set(key, args)
    return StoreCache.get(key)
  }
}

module.exports = proxy
