var app = angular.module('app', ['account', 'prosemirror', 'monospaced.elastic']);

import editorCtl from './controller/editor';
app.controller(editorCtl.name, editorCtl);






