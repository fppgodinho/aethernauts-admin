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
