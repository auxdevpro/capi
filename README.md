# CAPI class for CRUD
CRUD API class for JavaScript

CAPI class for API representation with async/await model

Using vanilla javascript ```fetch```

No additional dependencies

## Example
```javascript
import CAPI from './src/capi.js';

// Initialize API client
const api = new CAPI('http://localhost:3000');

// After initialization you can use methods eg.:
const health = await api.get('/health');
```

## Available methods

```.get(<endpoint>, [options])``` - For get request. "Read" operations.

```.post(<endpoint>, [data], [options])``` - "Create" operations.

```.patch(<endpoint>, [data], [options])``` - "Update" partial operations.

```.put(<endpoint>, [data], [options])``` - "Update" complete replacement operations.

```.delete(<endpoint>, [options])``` - "Delete" operations.


## Alias methods mapping (semantic naming)
Read Operations:
- ```read()```  → ```get()```
- ```fetch()``` → ```get()```

Create Operations:
- ```create()``` → ```post()```

Update Operations:
- ```update()``` → ```patch()``` // partial update
- ```replace()``` → ```put()```  // complete replacement

Delete Operations:
- ```remove()``` → ```delete()```

Notice: params in left side methods are the same as on the rigth side.

## Usage for test
Can be user in for backend (NodeJS / Bun) and Frontend in browser.

For a test: ```npm run server``` then ```npm run test```
