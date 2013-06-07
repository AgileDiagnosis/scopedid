# ScopedId
generic identifier class with types and optional versions


## installation

    $ npm install scopedid


## usage

    var ScopedId = require('scopedid')

    var userId = '511083bb08ce6b1b00000003' // ObjectId string

    var id = ScopedId('users', userId)

    var id2 = ScopedId('users', userId)

    ScopedId.equals(id, id2)
    // => true

    ScopedId.isValid(id)
    // => true

    ScopedId.toString()
    // => 'users/511083bb08ce6b1b00000003'

## Interface

    ScopedId : {
      _id: ObjectId,
      scope: String,
      versionId : ObjectId|String (optional)
    }

`versionId` can be an ObjectId or a string representing
a version ref (like a branch).

See [ObjectId](https://npmjs.org/package/objectid)

## String format

`{scope}/{_id}` or `{scope}/{_id}/{versionId}`

## Static Methods

### ScopedId.equals(sidA, sidB) => Boolean
### ScopedId.isValid(sid) => Boolean
### ScopedId.tryParse(sid, out, as) => Boolean

## Instance Methods

### ScopedId#equals(sidB) => Boolean
### ScopedId#toString() => String
### ScopedId#toJSON() => String

## running the tests

From package root,

    $ npm install
    $ npm test


## contributors

jden <jason@denizac.org>


## license

MIT. (c) 2013 Agile Diagnosis <team@agilediagnosis.com>. See LICENSE.md
