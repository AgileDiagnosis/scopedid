var chai = require('chai')
chai.should()
chai.use(require('chai-interface'))
var expect = chai.expect
var ObjectId = require('objectid')

var ScopedId = require('../index')
var oid = '511083bb08ce6b1b00000003'
var oid2 = '511083bb08ce6b1b00000006'

describe('ScopedId', function () {
  it('has interface', function () {
    // constructor
    ScopedId.should.be.a('function')

    // static methods
    ScopedId.should.have.interface({
      parse: Function,
      tryParse: Function,
      isValid: Function,
      equals: Function
    })

    // instance
    var scopedId = ScopedId('foos', oid)
    scopedId.should.be.instanceof(ScopedId)
    scopedId.should.have.interface({
      _id: Object,
      scope: String,
      versionId: function (x) { return x === null },
      equals: Function,
      toString: Function
    })

    // versioned instance
    var versionedScopeId = ScopedId('foo', oid, oid)
    versionedScopeId.versionId.should.be.an('object')

    var versionedScopeId = ScopedId('foo', oid, 'ref')
    versionedScopeId.versionId.should.equal('ref')
  })

  it('throws if scope is empty or not a string', function () {
    ScopedId('foo', oid)

    expect(function () {
      var sid = ScopedId('', oid)
    }).to.throw(/scope/i)
    expect(function () {
      var sid = ScopedId()
    }).to.throw(/scope/i)
  })

  it('throws if id is falsy or not an objectId', function () {
    expect(function () {
      var sid = ScopedId('sdf', null)
    }).to.throw(/id/i)

    expect(function () {
      var sid = ScopedId('sdf', '23432')
    }).to.throw()
  })

  describe('#toString', function () {
    it('formats a ScopedId string', function () {
      var scopedId = ScopedId('foo', oid)
      scopedId.toString().should.equal('foo/'+oid)

      var versionedScopeId = ScopedId('foo', oid, oid)
      versionedScopeId.toString().should.equal('foo/'+oid+'/'+oid)
    })
  })

  describe('.equals', function () {
    it('is true if sidA and sidB are the same instance', function () {
      var sidA = ScopedId('foo', oid)
      var sidB = sidA
      ScopedId.equals(sidA, sidB).should.equal(true)
    })
    it('is true if sidA and sidB are both Objects and are member-wise equal', function () {

      ScopedId.equals(
        ScopedId('bar', oid),
        ScopedId('bar', oid)
      ).should.equal(true)

      ScopedId.equals(
        ScopedId('bar', oid, 'ref'),
        ScopedId('bar', oid, 'ref')
      ).should.equal(true)

      ScopedId.equals(
        ScopedId('bar', oid, oid2),
        ScopedId('bar', oid, oid2)
      ).should.equal(true)

      ScopedId.equals(
        ScopedId('bar', oid, oid),
        ScopedId('bar', oid)
      ).should.equal(false)

      ScopedId.equals(
        ScopedId('bar', oid),
        {_id: oid, scope: 'bar'}
      ).should.equal(true)

      ScopedId.equals(
        ScopedId('foo', oid),
        ScopedId('bar', oid)
      ).should.equal(false)

      ScopedId.equals(
        ScopedId('foo', oid),
        ScopedId('foo', oid2)
      ).should.equal(false)

    })
    it('is true if sidA and sidB are toString-wise equal', function () {
      var sid = ScopedId('foo', oid)
      ScopedId.equals(
        sid,
        sid.toString()
      ).should.equal(true)

      var versioned = ScopedId('foo', oid, oid2)
      ScopedId.equals(
        versioned,
        versioned.toString()
      ).should.equal(true)

      ScopedId.equals(
        versioned,
        'sdfsdfsdfsdf'
      ).should.equal(false)
    })
    it('is otherwise false', function () {
      ScopedId.equals('fooo', {}).should.equal(false)
    })
    it('is on ScopeId.prototype', function () {
      var sid = ScopedId('ewr', oid)
      sid.equals(sid).should.equal(true)
    })
  })

  describe('.tryParse', function () {
    it('returns true and assigns the parsed ScopedId to out object if input is valid', function () {
      var out = {}
      var sid = ScopedId('blah', oid)
      ScopedId.tryParse(sid, out, 'sid').should.equal(true)
      out.sid.equals(sid).should.equal(true)
    })
    it('returns false otherwise', function () {
      var out = {}
      var sid = 'sdfsdf'
      ScopedId.tryParse(sid, out, 'sid').should.equal(false)
    })
  })

  describe('.parse', function () {
    it('returns a ScopedId if input string is valid', function () {
      var sid = 'foo/'+oid+'/'+oid2
      var sid2 = ScopedId.parse(sid)
      sid2.should.be.instanceof(ScopedId)
    })
    it('returns the same object if passed a ScopeId', function () {
      var sid = ScopedId('foo', oid)
      var sidB = ScopedId.parse(sid)
      expect(sid === sidB).to.equal(true)
    })
    it('casts an to a ScopedId if passed an object with valid interface', function () {
      var sid = {scope: 'foo', _id: oid, versionId: oid2}
      var sid2 = ScopedId.parse(sid)
      sid2.should.be.instanceof(ScopedId)
    })
    it('throws otherwise', function () {
      expect(function () {
        ScopedId.parse('foo')
      }).to.throw(/invalid/i)
    })
  })

  describe('.isValid', function () {
    it('returns true for an instanceof ScopedId', function () {
      ScopedId.isValid(ScopedId('foo', oid)).should.equal(true)
    })
    it('returns true for a valid ScopedId string', function () {
      ScopedId.isValid('foo/'+oid).should.equal(true)
      ScopedId.isValid('foo/'+oid+'/'+oid2).should.equal(true)
    })
    it('returns true for a valid ScopedId interface object', function () {
      ScopedId.isValid({
        scope: 'foo',
        _id: ObjectId()
      }).should.equal(true)
      ScopedId.isValid({
        scope: 'foo',
        _id: ObjectId(),
        versionId: ObjectId()
      }).should.equal(true)
    })
    it('returns true with string version ref', function () {
      ScopedId.isValid('blah/'+oid+'/ref').should.equal(true)
    })
    it('returns false otherwise', function () {
      ScopedId.isValid('foo').should.equal(false)
      ScopedId.isValid({
        scope: 'foo',
        _id: 234
      }).should.equal(false)
      ScopedId.isValid({
        scope: 'foo',
        _id: ObjectId(),
        versionId: true
      }).should.equal(false)
    })
  })
})