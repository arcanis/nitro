class HistoryBack {

    constructor( { $nitroLocation, $nitroTools, $rootScope, $window }, { } ) {

        this.$nitroLocation = $nitroLocation;
        this.$nitroTools = $nitroTools;
        this.$rootScope = $rootScope;
        this.$window = $window;

        this._actions = { };

        this.$rootScope.$on( '$nitroLocationChangeSuccess', ( e, { forward, state } ) => {

            if ( ! state.$nitroHistoryBackActionId )
                return null;

            if ( forward )
                return this.$window.history.forward( );

            if ( state.$nitroHistoryBackTriggerActions && this._actions[ state.$nitroHistoryBackActionId ] )
                this._actions[ state.$nitroHistoryBackActionId ]( );

            return this.$window.history.back( );

        } );

    }

    registerBackAction( fn ) {

        var id = this.$nitroTools.uuidv4( );
        this._actions[ id ] = fn;

        this.$nitroLocation.path( null, { state : {
            $nitroHistoryBackTriggerActions : true,
            $nitroHistoryBackActionId : id
        } } );

        this.$nitroLocation.path( null, { state : {
            $nitroHistoryBackTriggerActions : false,
            $nitroHistoryBackActionId : id
        } } );

        return ( ) => { this._actions[ id ] = null; };

    }

}

export class HistoryBackProvider {

    constructor( ) {
        this.$get = [ '$nitroLocation', '$nitroTools', '$rootScope', '$window', ( $nitroLocation, $nitroTools, $rootScope, $window ) => {
            return new HistoryBack( { $nitroLocation, $nitroTools, $rootScope, $window }, {
            } );
        } ];
    }

}
