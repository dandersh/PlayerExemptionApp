angular.module('theShowApp', ['theShowApp.Players', 'theShowApp.EditPlayer'])
    .constant('dataCalls', {
        'key' : '5_sSDb6r7tm1Kw37iUoSJTriVh8rmsTB', // '####'
        'url' : 'https://api.mlab.com/api/1/databases/theshowapp/collections/teams'
    });