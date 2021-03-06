'use strict';

var aethernauts = angular.module('aethernauts.darkhounds.net', []);

aethernauts.directive('popupAlerts', [function()                                {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/popupAlerts.html',
        controller:     ['$scope', 'alerts', function($scope, alerts)           {
            $scope.visible  = false;
            $scope.type     = '';
            $scope.title    = '';
            $scope.message  = '';
            $scope.count    = 0;
            
            var active      = null;
            $scope.$watch(function(){ return alerts.getNext(); }, function(nv, ov){
                if (nv === ov) return;
                active         = nv;
                $scope.type     = active?active.type:'';
                $scope.title    = active?chooseTitle(active.code):'';
                $scope.message  = active?active.message:'';
            });
            
            $scope.$watch(function(){ return alerts.getCount(); }, function(nv, ov){
                if (nv === ov) return;
                $scope.count    = nv;
                $scope.visible  = nv?true:false;
            });
            
            function chooseTitle(code)                                          {
                switch (code)                                                   {
                    case 'AuthError':   return 'Authentication!';
                    default:            return 'Warning!';
                }
            }
            
            $scope.ok   = function()                                            {
                if (!active) return;
                if (active.callback) active.callback(true);
                alerts.remove(active);
            };
        }]
    };
}]);

aethernauts.directive('uiAuth', [function()                                      {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/ui-auth.html',
        controller:     ['$scope', 'server', 'session', 'alerts', 'errors',
            function($scope, server, session, alerts, errors)                   {
                $scope.profile          = null;
                
                $scope.username         = 'admin';
                $scope.password         = 'test';
                
                $scope.login            = function ()                           {
                    if ($scope.profile) return;
                    server.login($scope.username, $scope.password, function(message){
                        if (!message.error && message.result)                   {
                            var profile             = message.result;
                            // var defaultEmail        = getDefault(profile.identity.emails);
                            $scope.password         = '';
                            $scope.username         = profile.username;
                            $scope.nameFirst        = profile.firstName;
                            $scope.nameLast         = profile.lastName;
                            $scope.email            = profile.email;
                            session.setProfile(profile);
                        } else if (message.error) alerts.add('simple', message.error.code, errors.getServerError(message.error.code, message.error.message), function(choice) {
                            $scope.password         = '';
                        });
                    });
                };

                $scope.logout           = function ()                           {
                    $scope.showRegister     = false;
                    server.logout(function(message)                             {
                        if (message.error) alerts.add('simple', message.error.code, errors.getServerError(message.error.code, message.error.message));
                        else session.setProfile();
                    });
                };

                $scope.$watch(function(){ return session.getProfile(); }, function(nv, ov){
                    if (nv === ov) return;
                    if (!nv) reset();
                    $scope.profile          = nv;
                });

                function getDefault(list)                                       {
                    if (list && list.length) for (var i in list) if (list[i].default) return list[i];
                    return null;
                }
                
                function reset()                                                {
                    $scope.password         = 'test';
                }
            }
        ]
    };
}]);

aethernauts.directive('uiMenu', [function()                                     {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/ui-menu.html',
        controller:     ['$scope', 'server', 'context', 'world', 'alerts', 'errors',
            function($scope, server, context, world, alerts, errors)            {
                
                $scope.getWorld             = function ()                       {
                    context.area    = "world";
                    server.getWorld('Nod', function(message)                    {
                        if (message.error) alerts.add('simple', message.error.code, errors.getServerError(message.error.code, message.error.message));
                        else world.data = message.result;
                    });
                };
            }
        ]
    };
}]);

aethernauts.directive('uiServer', [function()                                    {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/ui-server.html',
        controller:     ['$scope', 'server', function($scope, server)           {
            $scope.address      = '';
            $scope.port         = 42000;
            $scope.connected    = server.isConnected();
            $scope.name         = server.getName();
            
            $scope.connect          = function ()                               {
                server.connect($scope.address, $scope.port,
                function()                                                      {
                    console.log('Server connection opened');
                },
                function()                                                      {
                    console.log('Server connection closed');
                });
            };
            
            $scope.disconnect       = function ()                               {
                server.disconnect();
            };
            
            $scope.$watch(function(){ return server.isConnected(); }, function(nv, ov){
                if (nv === ov) return;
                $scope.connected    = nv;
                console.log('Server connected?', $scope.connected);
            });
            
            $scope.$watch(function(){ return server.getName(); }, function(nv, ov){
                if (nv === ov) return;
                $scope.name         = nv;
                console.log('Server name:', $scope.name);
            });
        }]
    };
}]);

aethernauts.directive('uiWorld', [function()                                    {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/ui-world.html',
        controller:     ['$scope', 'world',
            function($scope, world)                                             {
                $scope.world    = null;
                
                $scope.$watch(function(){ return world.data; }, function(nv, ov){
                    if (nv === ov) return;
                    //
                    $scope.world = world.data;
                });
            }
        ]
    };
}]);

aethernauts.directive('ui', [function()                                          {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/ui.html',
        controller:     ['$scope', 'server', 'session', 'context',
            function($scope, server, session, context)                          {
                $scope.connected        = false;
                $scope.logedin          = false;
                
                $scope.$watch(function(){ return server.isConnected(); }, function(nv, ov) {
                    if (nv === ov) return;
                    $scope.connected    = nv;
                });
                
                $scope.$watch(function(){ return server.isConnected(); }, function(nv, ov) {
                    if (nv === ov) return;
                    $scope.connected    = nv;
                });
                
                $scope.$watch(function(){ return session.getProfile(); }, function(nv, ov) {
                    if (nv === ov) return;
                    $scope.logedin      = nv?true:false;
                });
    
                $scope.$watch(function(){ return context.area; }, function(nv, ov) {
                    if (nv === ov) return;
                    $scope.area         = context.area;
                });
            }
        ]
    };
}]);

aethernauts.directive('viewport', [function()                                    {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/viewport.html',
        controller:     ['$scope', function($scope)                             {
            
        }]
    };
}]);

aethernauts.service('alerts', ['renderer', function(renderer)                   {
    var messages        = [];
    
    var alerts          = {};
    alerts.add          = function(type, code, message, callback)                 {
        messages.push({type: type, code: code, message: message, callback: callback});
        renderer.render();
        //
        console.log(messages.length, messages[messages.length-1]);
    };
    
    alerts.remove       = function(message)                                     {
        var index = messages.indexOf(message); if (index < 0) return;
        messages.splice(index, 1);
        renderer.render();
    };
    
    alerts.getNext      = function()                                            {
        return messages.length?messages[messages.length-1]:null;
    };
    alerts.getCount     = function() { return messages.length;                  };
    
    return alerts;
}]);

aethernauts.service('context', ['renderer', function(renderer)                  {
    var service             = {};
    
    service.area = "";
    
    return service;
}]);

aethernauts.service('errors', [function()                                       {
    var errors              = {};
    errors.getServerError   = function (id, message)                            {
        switch(id)                                                              {
            case 'AuthError':   return 'Login Failed!';
            default:            return message;
        }
    };
    return errors;
}]);

aethernauts.service('renderer', ['$rootScope', function($rootScope)             {
    var update      = false;
    var renderer    = {};
    
    renderer.render = function(now)                                             {
       update = true; if (now) render();
    };
    
    function render()                                                           {
        if (!update) return; update = false;
        $rootScope.$apply();
    };
    
    setInterval(render, 100);
    
    return renderer;
}]);

aethernauts.service('server', ['renderer', 'session', 'auth', 'admin',
    function(renderer, session, auth, admin)                                    {
        var server          = {};
        var ws              = null;
        
        var name            = '';
        var connected       = false;
    
        server.isConnected  = function() { return connected;                    };
        server.getName      = function() { return name;                         };
    
        server.connect      = function (address, port, onConnect, onDisconnect) {
            address         = address || 'localhost';
            port            = port || 80;
            
            if (connected) server.disconnect();
            ws              = new WebSocket("ws://" + address + ':' + port);
            ws.onopen       = function()                                        {
                connected   = true;
                if (onConnect) onConnect();
                renderer.render();
            };
            ws.onclose      = function()                                        {
                connected   = false;
                session.reset();
                if (onDisconnect) onDisconnect();
                renderer.render();
            };
    
            ws.onmessage    = function(message)                                 {
                handleMessage(message.data);
                renderer.render();
            };
        };
        
        server.disconnect   = function ()                                       {
            if (!connected) return;
            ws.close();
        };
        
        server.login        = function (username, password, callback)           {
            if (!connected) return;
            auth.login(ws, username, password, addCallback(callback));
        };
        
        server.logout       = function (callback)                               {
            if (!connected) return;
            auth.logout(ws, addCallback(callback));
        };
        
        server.register     = function (username, password, firstname, lastname, email, callback) {
            if (!connected) return;
            auth.register(ws, username, password, firstname, lastname, email, addCallback(callback));
        };

        server.getWorld     = function (name, callback)                         {
            if (!connected) return;
            admin.getWorld(ws, name, addCallback(callback));
        };
        
        function handleMessage(message)                                         {
            message     = JSON.parse(message);
            switch(message.type)                                                {
                case 'session':
                    if (message.state == 'start')                               {
                        name        = message.name;
                        session.set(message.salt, message.token);
                    }
                    break;
                case 'response':
                    message.callbackID = +message.callbackID;
                    if (message.callbackID < callbacks.length && callbacks[message.callbackID]){
                        var callback    = callbacks[message.callbackID];
                        callbacks[message.callbackID]   = null;
                        callback(message);
                    }
                    break;
                default: break;
            }
        }
        
        var callbacks = [];
        function addCallback(callback)                                          {
            callbacks.push(callback);
            return callbacks.length - 1;
        }
        
        return server;
    }
]);

aethernauts.service('admin', ['session', function(session)                      {
    var auth        = {};
    
    auth.getWorld    = function (ws, name, callbackID)               {
        ws.send(JSON.stringify({type: 'admin', action:'getWorld', name:name, callbackID:callbackID}));
    };
    
    return auth;
}]);

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

aethernauts.service('session', ['renderer', function(renderer)                  {
    var salt        = '';
    var token       = '';
    var profile     = null;
    var character   = null;
    
    var session             = {};
    session.getSalt         = function() { return salt;                         };
    session.getToken        = function() { return token;                        };
    session.getProfile      = function() { return profile;                      };
    session.setProfile      = function(v)                                       {
        if (v == profile) return;
        profile = v;
        renderer.render();
    };
    session.getCharacter    = function() { return character;                    };
    session.setCharacter    = function(v)                                       {
        if (v == character) return;
        character = v;
        renderer.render();
    };
    
    session.reset = function()                                                  {
        salt        = '';
        token       = '';
        profile        = null;
        character   = null;
        renderer.render();
    };
    
    session.set    = function(newSalt, newToken, update)                        {
        salt        = newSalt;
        token       = newToken;
        profile     = update?profile:null;
        character   = update?character:null;
        renderer.render();
    };
    
    return session;
}]);

aethernauts.service('world', ['renderer', function(renderer)                  {
    var service             = {};
    
    service.data = null;
    
    return service;
}]);
