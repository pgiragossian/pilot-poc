var app = angular.module('account', []);

import accountFct from './factory/account';

app.factory(accountFct.name, accountFct);