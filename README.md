[![Build Status](https://travis-ci.org/tandrewnichols/extract-json-from-string.png)](https://travis-ci.org/tandrewnichols/extract-json-from-string) [![downloads](http://img.shields.io/npm/dm/extract-json-from-string.svg)](https://npmjs.org/package/extract-json-from-string) [![npm](http://img.shields.io/npm/v/extract-json-from-string.svg)](https://npmjs.org/package/extract-json-from-string) [![Maintainability](https://api.codeclimate.com/v1/badges/b25fdcdef562b02676bc/maintainability)](https://codeclimate.com/github/tandrewnichols/extract-json-from-string/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/b25fdcdef562b02676bc/test_coverage)](https://codeclimate.com/github/tandrewnichols/extract-json-from-string/test_coverage) [![dependencies](https://david-dm.org/tandrewnichols/extract-json-from-string.png)](https://david-dm.org/tandrewnichols/extract-json-from-string) ![Size](https://img.shields.io/badge/size-1097b-brightgreen.svg)

# extract-json-from-string

Extract JSON/javascript objects from strings

## Installation

`npm install --save extract-json-from-string`

## Summary

Extract random JSON and javascript objects from a longer string, e.g. "Expected { foo: 'bar' } to equal { foo: 'baz' }" (I'm looking at you jasmine 1.3). Also works with arrays.

## Usage

Just pass the string into the one exported function and get a list of objects and arrays contained therein returned to you. If the string contains no valid objects or arrays (**_valid_** objects or arrays), you'll get an empty array back.

### Node

```js
const extract = require('extract-json-from-string');

let objects = extract('Expected { foo: "bar" } to equal { foo: "baz" }');
// [
//   { foo: 'bar' },
//   { foo: 'baz' }
// ]
```

### Browser

```js
let objects = window.extractJson('Expected { foo: "bar" } to equal { foo: "baz" }');
// [
//   { foo: 'bar' },
//   { foo: 'baz' }
// ]
```

### With Position Information

To get the position information along with the extracted objects, pass `true` as the second parameter:

```js
const extract = require('extract-json-from-string');

let detailed = extract('Expected { foo: "bar" } to equal { foo: "baz" }', true);
// [
//   {
//     object: { foo: 'bar' },
//     raw: '{ foo: "bar" }',
//     start: 9,
//     end: 23
//   },
//   {
//     object: { foo: 'baz' },
//     raw: '{ foo: "baz" }',
//     start: 33,
//     end: 47
//   }
// ]
```

Each result object contains:
- `object`: The parsed JSON/javascript object
- `raw`: The original string that was extracted  
- `start`: Starting position in the original string
- `end`: Ending position in the original string

## N.B.

For the time being, I've written a very naive implementation. There are lots of ways to break this (like stringified JSON or escaped quotes within the value of a property). Please report any issues, and I'll do my best to fix them and make it _less_ naive.

## Contributing

Please see [the contribution guidelines](CONTRIBUTING.md).
