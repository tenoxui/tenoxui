# `@tenoxui/plugin-moxie`

This package is the former `@tenoxui/moxie` that used as main TenoxUI (v1) engine. It responsible for class name parsing, data processing (including values, utilities, and variants).

Now, since `@tenoxui/core@3`, we refactor all `core` APIs and separating `moxie` engine code from it, and rebuild `moxie` as one of its plugin you can use.

## Installation

```bash
npm i @tenoxui/core@3 @tenoxui/plugin-moxie
```

## Usage

```javascript
import TenoxUI from '@tenoxui/core'
import Moxie from '@tenoxui/plugin-moxie'

const ui = new TenoxUI({
  plugins: [Moxie()]
})
```

## LICENSE

MIT 2025-present TenoxUI
