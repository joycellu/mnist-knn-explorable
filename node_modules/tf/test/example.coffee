T = require('../source')

div = T.div(
  class : 'barf'
  $body : T.h1(
    class : 'wow'
    $body : "BORF"
  )
)

console.log(div)