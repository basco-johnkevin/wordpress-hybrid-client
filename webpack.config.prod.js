var path = require('path'),
    fs = require('fs'),
    webpack = require("webpack"),
    libPath = path.join(__dirname, 'lib'),
    distPath = path.join(__dirname, 'dist'),
    pkg = require('./package.json'),
    parserXml = require('xml2js'),
    extend = require('util')._extend,
    projectConfig = require('./config.prod.json'),
    webpackConfig = require('./webpack.config.js'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = extend(webpackConfig, {
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            pkg: pkg,
            appVersion: getAppVersion(),
            template: path.join(libPath, 'index.html')
        }),
        new webpack.ContextReplacementPlugin(/moment\/locale$/, getRegexAutorizedLanguages()),
        new webpack.DefinePlugin({
            IS_PROD: true
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]
});

function getRegexAutorizedLanguages() {
    return new RegExp(Object.keys(projectConfig.translation.available).join('|'));
}

function getAppVersion() {
    var version,
        config = fs.readFileSync(__dirname + '/config.xml');
    parserXml.parseString(config, function(err, result) {
        version = result.widget.$.version;
    });
    return version;
}
