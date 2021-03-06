'use strict';

var PATH = require('path'),
    INHERIT = require('inherit');

//WARING: very hackish implementation, probably different approach needed here.
module.exports = INHERIT(/** @lends FSMock.prototype */{

    /**
     * Creates new instance of a mock
     *
     * @class FSMock Partial implementation of fs module functionality on top ofqi/fs-mock
     * @constructor
     * @param {module:q-io/fs-mock} qfsMock instance of q-io/fs filesystem mock
     */
    __constructor: function(qfsMock) {
        this._qfsMock = qfsMock;
    },

    readdirSync: function(path) {
        path = this._qfsMock.absolute(path);
        var node = this._qfsMock._root._walk(path)._follow(path);
        if (!node.isDirectory()) {
            throw new Error('Can\'t list non-directory: ' + JSON.stringify(path));
        }
        return Object.keys(node._entries).sort();
    },

    mkdirSync: function(path) {
        //"honest" sync version is impossible to do on top of QFS.
        //using makeTree instead of makeDirectory helps to make
        //mkdirp.snc to work.
        path = PATH.resolve(path);
        this._qfsMock.makeTree(path);
    },

    statSync: function(path) {
        path = this._qfsMock.absolute(path);
        var node = this._qfsMock._root._walk(path)._follow(path);
        node.mtime = node.lastModified();
        return node;
    },

    lstatSync: function(path) {
        path = this._qfsMock.absolute(path);
        var node = this._qfsMock._root._walk(path);
        node.mtime = node.lastModified();
        return node;
    },

    stat: function(path, callback) {
        this._qfsMock.stat(path)
            .then(function(stat) {
                callback(null, stat);
            })
            .fail(function(error) {
                callback(error);
            });
    },

    mkdir: function(path, mode, callback) {
        if (arguments.length === 2) {
            callback = arguments[1];
            mode = null;
        }
        this._qfsMock.makeDirectory(path, mode).then(callback, callback);
    },

    readFileSync: function(path, options) {
        options = options || {};
        path = PATH.resolve(path);
        var directory = PATH.dirname(path),
            name = PATH.basename(path);

        var dirNode = this._qfsMock._root._walk(directory);
        if (!dirNode._entries[name]) {
            var error = new Error('File ' + path + ' does not exists');
            error.code = 'ENOENT';
            throw error;
        }

        var fileNode = dirNode._entries[name]._follow(path);
        if (!fileNode.isFile()) {
            throw new Error(path + ' is not a file');
        }
        var content = fileNode._chunks;//Buffer.concat(fileNode._chunks);
        if ('begin' in options && 'end' in options) {
            content = content.slice(options.begin, options.end);
        }
        return content;
    }
});

