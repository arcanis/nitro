export var transclude = [ ( ) => {

    var scopePolicies = { };

    scopePolicies[ 'parent' ] = $scope => $scope.$parent;
    scopePolicies[ 'preserve' ] = $scope => $scope;
    scopePolicies[ 'child' ] = $scope => $scope.$new( );
    scopePolicies[ 'new' ] = $scope => null;

    return {

        link( $scope, $element, $attrs, controller, $transclude ) {

            var scopePolicy = $attrs.scopePolicy;
            var action = $element.prop( 'tagNme' ) === 'NITRO-TRANSCLUDE' ? 'replaceWith' : 'append';

            if ( ! scopePolicies.hasOwnProperty( scopePolicy ) )
                scopePolicy = 'new';

            var transclusionScope = scopePolicies[ scopePolicy ]( $scope );

            $transclude( transclusionScope, clone => {
                $element[ action ]( clone );
            } );

        }

    };

} ];
