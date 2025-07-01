# `@tenoxui/browser`

Use TenoxUI directly in the browser, without much configuration.

## Usage Example

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>TenoxUI DOM Test</title>
    <script src="https://cdn.jsdelivr.net/npm/@tenoxui/browser@1.0.0/dist/bundle.iife.js"></script>
  </head>
  <body class="bg-red flex [gap]-10px [&_>_*]:bg-blue">
    <div class="size-100px hover:bg-green"></div>
    <div class="size-200px hover:bg-yellow"></div>

    <script>
      const { TenoxUI } = __tenoxui_browser__

      // create TenoxUI instance
      const ui = new TenoxUI({
        property: {
          bg: 'background',
          size: ['width', 'height'],
          flex: 'display: flex'
        },
        variants: {
          hover: '&:hover'
        }
      })

      // initialize TenoxUI
      ui.init()
    </script>
  </body>
</html>
```

## Documentation

Check out TenoxUI documentation [here](https://tenoxui.web.app)

## License

MIT
