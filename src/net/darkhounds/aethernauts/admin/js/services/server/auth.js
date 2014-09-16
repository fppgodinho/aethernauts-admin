aethernauts.service('auth', ['session', function(session)                       {
    var auth        = {};
    
    auth.login    = function (ws, username, password, callbackID)               {
        password    = CryptoJS.MD5(CryptoJS.MD5(password + '_' + session.getSalt()).toString() + session.getToken()).toString();
        ws.send(JSON.stringify({type: 'auth', action:'login', username:username, password:password, callbackID:callbackID}));
    };
    
    auth.logout    = function (ws, callbackID)                                  {
        ws.send(JSON.stringify({type: 'auth', action:'logout', callbackID:callbackID}));
    };
    
    auth.register     = function (ws, username, password, firstname, lastname, email, callbackID) {
        password        = CryptoJS.MD5(password + '_' + session.getSalt()).toString();
        ws.send(JSON.stringify({type: 'auth', action:'register', username:username, password:password, firstname:firstname, lastname: lastname, email: email, callbackID:callbackID}));
    };
    
    return auth;
}]);
