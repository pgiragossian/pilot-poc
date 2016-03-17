var app = angular.module('app', ['account', 'prosemirror', 'monospaced.elastic', 'angularMoment']);

import editorCtl from './controller/editor';
import momentRun from './run/moment';

app.run(momentRun);
app.controller(editorCtl.name, editorCtl);






