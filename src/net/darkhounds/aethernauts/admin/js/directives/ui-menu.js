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
