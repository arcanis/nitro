export var tab = [ ( ) => {

    return {

        transclude : 'element',
        replace : true,

        scope : {
            name : '@',
            title : '@',
            sref : '@'
        },

        require : [ '^^nitroTabs' ],

        link( $scope, $element, $attrs, [ parentNitroTabs ] ) {

            parentNitroTabs.addTab( $scope );

            $scope.$on( '$destroy', ( ) => {
                parentNitroTabs.removeTab( $scope );
            } );

        }

    };

} ];
