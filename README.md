# @leviy/webpack-config-default

Default [Webpack](https://webpack.js.org) config for Leviy development.

We use the [webpack-config](https://github.com/Fitbit/webpack-config) package to enable the
sharing and extending of our Webpack config. Additional resources on how to use this package
can be found in [their repository](https://github.com/Fitbit/webpack-config).

## Installation

Install the module including it's peer dependencies

```bash
npx install-peerdeps @leviy/webpack-config-default --dev
```

## Usage

#### Via `webpack.config.js`

```js
const { Config } = require('webpack-config');

module.exports = new Config()
    .extend('@leviy/webpack-config-default/webpack.config.js');
```

## Manifest & Symfony

A `manifest.json` file will created by default. To use this manifest together with a Symfony application
just add this to the `config/packages/framework.yaml` configuration:

```yaml
framework:
  ...

  assets:
    json_manifest_path: '%kernel.project_dir%/public/dist/manifest.json'
```

Referencing an asset from templates should be done with the `asset` twig function:

```twig
{{ asset('dist/app.js') }}
```

Symfony is then able to figure out the correct location of the asset based on the configured manifest file.

## Customize

With `.set(path, configuration)` you can replace the given configuration `path` completely.
To merge your custom configuration with the default configuration you can use `.merge(configuration)`.

Whether you should use `.set(path, configuration)` or `.merge(configuration)` to customize your webpack
configuration depends on the value type of the configuration key. Configuration keys with a value type
`Object` are being replaced no matter which method you choose. Configuration keys with a value type `Array`
will be completely replaced when you use `.set(path, configuration)` and actually merged together when you
use `.merge(configuration)`. Also keep in mind that a deep merge will be used when using
`.merge(configuration)`, which makes it more relevant to check the value type of a configuration key.

#### Add a custom `entry` point

```js
module.exports = new Config()
    .extend('@leviy/webpack-config-default/webpack.config.js')
    .merge({
        entry: {
            custom: [
                './another/source/path/custom.js',
            ],
        },
    });
```

#### Replace all `entry` points with your custom `entry` point

_Using the default name `app`_
```js
module.exports = new Config()
    .extend('@leviy/webpack-config-default/webpack.config.js')
    .set('entry.app', [
        './another/source/path/custom.js',
    ]);
```

_Using your own custom name_

```js
module.exports = new Config()
    .extend('@leviy/webpack-config-default/webpack.config.js')
    .set('entry', {
        custom: [
            './another/source/path/custom.js',
        ],
    });
```

#### Use a custom `output` path

```js
module.exports = new Config()
    .extend('@leviy/webpack-config-default/webpack.config.js')
    .merge({
        output: {
            path: path.resolve(__dirname, 'another/output/path'),
        },
    });
```

#### Add additional plugins

```js
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = new Config()
    .extend('@leviy/webpack-config-default/webpack.config.js')
    .merge({
        plugins: [
            new CopyWebpackPlugin([
                { from: './images', to: 'images' },
            ]),
        ],
    });
```
