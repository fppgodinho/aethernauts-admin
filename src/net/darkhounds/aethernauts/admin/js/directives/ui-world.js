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
