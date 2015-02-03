export var nitroNavigationSetup = [ '$nitroLocation', '$nitroNavigation', ( $nitroLocation, $nitroNavigation ) => {

    $nitroNavigation.goTo( $nitroLocation.path( ), { replace : true } );

} ];
