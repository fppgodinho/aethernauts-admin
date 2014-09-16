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
