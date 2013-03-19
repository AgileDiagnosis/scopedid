var ObjectId = require('objectid')

//  ScopedId
//    string format: '{type}/{id}/{versionId}'
//    type is a string, eg 'modules'
//    id is an ObjectId
//    versionId is an ObjectId (optional)
//    Like a mongo dbref

function ScopedId(scope, id, versionId) {
  if (!(this instanceof ScopedId)) {
    return new ScopedId(scope, id, versionId);
  }
  if (!scope || typeof scope !== 'string') {
    throw new Error('scope must be a non-empty string')
  }
  if (!id) {
    throw new Error('id must be an ObjectId')
  }
  this.scope = scope
  this._id = ObjectId(id)
  this.versionId = versionId ? ObjectId(versionId) : null
}
ScopedId.prototype.toString = function () {
  var id = this.scope + '/' + this._id.toString();
  if (this.versionId) {
    id += '/' + this.versionId.toString();
  }
  return id;
}
ScopedId.prototype.equals = function (sidB) {
  return ScopedId.equals(this, sidB);
}

var scopedIdTest = /^[a-zA-Z]+(\/[0-9a-fA-F]{24}){1,2}$/;

ScopedId.parse = function (sid) {
  if (sid instanceof ScopedId) {
    return sid
  }
  if (typeof sid === 'object') {
    return ScopedId(sid.scope, sid._id, sid.versionId)
  }
  if (!ScopedId.isValid(sid)) { throw new Error('Invalid ScopedId string'); }
  var segments = sid.split('/')
  return ScopedId(segments[0], segments[1], segments[2]);
}

ScopedId.tryParse = function (str, out, as) {
  try {
    out[as] = ScopedId.parse(str)
    return true
  } catch (e) {
    return false
  }
}

ScopedId.equals = function (sidA, sidB) {
  if (sidA === sidB) { return true; }
  if (!sidA || !sidB) { return false; }
  if (typeof sidA === 'object' && typeof sidB === 'object') {
    if (sidA._id && !ObjectId.equals(sidA._id, sidB._id)) { return false; }
    if (sidA.scope && (sidA.scope !== sidB.scope)) { return false; }
    if (sidA.versionId) {
      return ObjectId.equals(sidA.versionId, sidB.versionId)
    } else {
      return !sidB.versionId
    }
  }
  return sidA.toString() === sidB.toString();
}

ScopedId.isValid = function (sid) {
  if (sid instanceof ScopedId) { return true }
  if (typeof sid === 'string') {
    return scopedIdTest.test(sid)
  } else if (typeof sid === 'object') {
    if (!sid.scope || typeof sid.scope !== 'string') { return false }
    if (!ObjectId.isValid(sid._id)) { return false; }
    if (sid.versionId && !ObjectId.isValid(sid.versionId)) { return false; }
    return true;
  }
  return false;
}

ScopedId.isScopedIdOf = function (id, scope) {
}

module.exports = ScopedId;