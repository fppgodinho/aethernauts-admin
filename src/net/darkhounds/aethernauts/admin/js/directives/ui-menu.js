aethernauts.directive('uiMenu', [function()                                     {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/ui-menu.html',
        controller:     ['$scope', 'server', 'session', 'world', 'alerts', 'errors',
            function($scope, server, session, world, alerts, errors)            {
                
                $scope.getWorld             = function ()                       {
                    server.getWorld('Nod', function(message)                    {
                        if (message.error) alerts.add('simple', message.error.code, errors.getServerError(message.error.code, message.error.message));
                        else session.data = message.result;
                    });
                };
                
                $scope.$watch(function(){ return world.data; }, function(nv, ov){
                    if (nv === ov) return;
                    console.log('World:', world.data);
                });
                
            }
        ]
    };
}]);
