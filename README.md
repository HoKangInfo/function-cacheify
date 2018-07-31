
memoize function as async cache

## Install

`npm install function-cacheify`

## Usage

```
const proxy = require('function-cacheify')
const slowQuery = (x) => x

const opts = {
  'max': 1000,
  'maxAge': 1000 * 60 * 60 * 4 } // default

const quickQuery = proxy(slowQuery, opts)

quickQuery(1)
```
