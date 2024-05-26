Assert  = require('assert')
Asserts = require('asserts')

Tag = require('../source')

Asserts({
  "tag called with no attributes should work ok" : ()->
    actual = Tag.div()
    expect = '<div></div>'
    Assert.equal(actual, expect)

  "tag called with attributes should work ok" : ()->
    actual = Tag.div(class : 'barf')
    expect = '<div class="barf"></div>'
    Assert.equal(actual, expect)

  "tag called with string body should work ok" : ()->
    actual = Tag.div(class : 'derp', $body : 'honk')
    expect = '<div class="derp">honk</div>'
    Assert.equal(actual, expect)
})