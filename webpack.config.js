const webpack = require('webpack')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')

// process.traceDeprecation = true;

// markdown convert to html
const marked = require('marked')
const renderer = new marked.Renderer()

module.exports = function(env) {
  console.log(env)
  const [mode, platform, benchmark, firefoxBeta] = env.split(':')
  let version = require('./manifest/common.json').version
  if (firefoxBeta) version += 'beta'

  const config = {
    entry: {
      background_page: './src/background_page/index.js',
      //content_script: './src/content_script/index.js',
      //content_script_loader: './src/content_script/loader.js',
      // 'help': './src/help/index.js',
      //extensions: './src/pages/extensions/index.js',
      //info: './src/pages/info/index.js',
      options: './src/pages/options/index.js'
      // 'popup': './src/popup/index.js',
    },
    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name].js',
      sourceMapFilename: '[name].js.map' // always generate source maps
    },
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            // require.resolve needed to work with linked modules
            // (e.g. saka-action in development) or build will fail
            // presets: [require.resolve('babel-preset-stage-3')]
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {}
            }
          ]
        },
        {
          test: /\.md$/,
          use: [
            {
              loader: 'html-loader'
            },
            {
              loader: 'markdown-loader',
              options: {
                renderer
              }
            }
          ]
        }
      ]
    },
    resolve: {
      modules: ['./src', './node_modules']
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new CopyWebpackPlugin([
        {
          from: 'static'
        }
      ]),
      new GenerateJsonPlugin(
        'manifest.json',
        merge(
          require('./manifest/common.json'),
          require(`./manifest/${platform}.json`),
          {
            version
          }
        ),
        null,
        2
      )
    ]
  }

  // extension id must be specified in calls to chrome.runtime.connect
  // otherwise clients won't be able to reconnect to background page
  // and background commands will stop working
  const EXTENSION_ID = JSON.stringify(platform === 'chrome' ? '1' : '1')

  if (mode === 'prod') {
    config.plugins = config.plugins.concat([
      //new MinifyPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        COTS_DEBUG: JSON.stringify(false),
        COTS_VERSION: JSON.stringify(version),
        COTS_BENCHMARK: JSON.stringify(true),
        COTS_PLATFORM: JSON.stringify(platform),
        EXTENSION_ID
      })
    ])
  } else {
    config.plugins = config.plugins.concat([
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
        COTS_DEBUG: JSON.stringify(true),
        COTS_VERSION: JSON.stringify(version + ' dev'),
        COTS_BENCHMARK: JSON.stringify(benchmark === 'benchmark'),
        COTS_PLATFORM: JSON.stringify(platform),
        EXTENSION_ID
      })
    ])
  }
  return config
}
