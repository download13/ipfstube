const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

const tsRule = {
  test: /\.(ts|tsx)$/,
  loader: 'ts-loader',
  //include: [path.resolve(__dirname, 'src')],
  exclude: [/node_modules/]
}

const styleRule = {
  test: /.(scss|css)$/,
  use: [
    { loader: "style-loader" },
    { loader: "css-loader",
      options: {
        sourceMap: true
      }
    },
    { loader: "sass-loader",
      options: {
        sourceMap: true
      }
    }
  ]
}

const babelRule = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env']
    }
  }
}

module.exports = {
  mode: 'development',
  target: 'web',
  //devtool: 'eval-cheap-source-map',

  entry: {
    client: './src/client/index.ts'
  },
  output: {
    path: path.resolve('./dist/client')
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process',
    })
  ],

  module: {
    rules: [
      babelRule,
      tsRule,
      styleRule
    ]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      stream: 'stream-browserify'
    }
  },

  optimization: {
    minimizer: [new TerserPlugin()]
  }
}