# soundcloud-info
A simple and lightweight SoundCloud scrapper in node.js

## How to use
- First clone the GitHub repository `git clone https://github.com/Ruzie/soundcloud-info.git`
- Move to that cloned folder and execute `yarn && tsc`

### Example
```js
const { Search } = require("./index.js");

(async () => {
  const test = new Search();
  const data = await test.get("nwantiti");
  console.log(data);
})();
```

## Issues & Contribution
If you encounter with any kind of issue, please feel free to create an [issue](https://github.com/Ruzie/soundcloud-info/issues/new). Pull requests are welcome!
