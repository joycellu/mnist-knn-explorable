tf
===========

# Description

Simple functions for creating html tags

# Latest Version

1.0.0

# Installation
```
npm install tf --save
```

or in package.json

```json
{
  ...
  "dependencies": {
    "tf": "~1.0.0"
  }
}
```

# Usage

```coffeescript
T = require('tf')

T.div(
  class : 'barf'
  $body : T.h1(
    class : 'wow'
    $body : "BORF"
  )
)
```

results in 

```html
<div class="barf"><h1 class="wow">BORF</h1></div>
```