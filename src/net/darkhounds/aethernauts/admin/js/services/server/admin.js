aethernauts.service('admin', ['session', function(session)                      {
    var auth        = {};
    
    auth.getWorld    = function (ws, name, callbackID)               {
        ws.send(JSON.stringify({type: 'admin', action:'getWorld', name:name, callbackID:callbackID}));
    };
    
    return auth;
}]);
