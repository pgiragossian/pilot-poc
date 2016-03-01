var app = angular.module('prosemirror', []);

import proseMirrorFct from './factory/prosemirror';
app.factory(proseMirrorFct.name, proseMirrorFct);

import proseMirrorDct from './directive/prosemirror/';
app.directive(proseMirrorDct.name, proseMirrorDct);