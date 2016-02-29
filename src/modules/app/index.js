var app = angular.module('app', []);

import editorCtl from './controller/editor';
app.controller(editorCtl.name, editorCtl);

import proseMirrorDct from './directive/prosemirror';
app.directive(proseMirrorDct.name, proseMirrorDct);




