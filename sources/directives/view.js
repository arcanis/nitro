export var view = [ '$animate', '$compile', '$nitroNavigation', '$rootScope', ( $animate, $compile, $nitroNavigation, $rootScope ) => {

    return {

        replace : true,

        template : `
            <div class="nitro-view">
            </div>
        `,

        require : [ 'nitroView', '?^^nitroView' ],

        controller : class {

            constructor( $scope, $element, $attrs ) {

                this.$element = $element;
                this.$scope = $scope;

                this._parent = null;
                this._children = { };

                this._name = $attrs.name || '$main';
                this._listener = null;

                this._animationQueue = Promise.resolve( );
                this._current = null;

            }

            setParent( parent ) {

                this._parent = parent;
                this._parent._children[ this._name ] = this;

            }

            registerStateListener( ) {

                this._listener = $rootScope.$on( '$nitroStateChangeSuccess', ( e, { type, state } ) => {
                    this.applyViewMapSet( type, this.getViewMapSetFromState( state ) );
                } );

                if ( $nitroNavigation.currentState ) {
                    this.applyViewMapSet( 'direct', this.getViewMapSetFromState( $nitroNavigation.currentState ) );
                } else {
                    this.applyViewMapSet( 'direct', [ ] );
                }

            }

            getViewMapSetFromState( state ) {

                function _pick( source, what ) {

                    var result = { };

                    for ( var key of what )
                        result[ key ] = source[ key ];

                    return result;

                }

                var viewMapSet = [ ];

                for ( var node = state; node; node = node.parent ) {

                    if ( ! node.template && ! node.views )
                        continue ;

                    var viewMap = node.views
                        ? angular.copy( node.views )
                        : { $main : node };

                    for ( var name of Object.keys( viewMap ) ) {
                        var view = viewMap[ name ] = Object.create( viewMap[ name ] );
                        view.parameters = _pick( state.parameters, node.keys );
                    }

                    viewMapSet.unshift( viewMap );

                }

                return viewMapSet;

            }

            applyViewMapSet( type, viewMapSet, index = 0 ) {

                var viewMap = viewMapSet && viewMapSet[ index ];
                var view = viewMap && viewMap[ this._name ];

                if ( ! view ) {

                    if ( this._current ) {
                        this.applyView( type, null );
                        type = 'direct';
                    }

                } else {

                    if ( ! this._current || view.template !== this._current.template || ! angular.equals( view.parameters, this._current.parameters ) ) {
                        this.applyView( type, view );
                        type = 'direct';
                    }

                }

                for ( var name of Object.keys( this._children ) ) {
                    this._children[ name ].applyViewMapSet( type, viewMapSet, index + 1 );
                }

            }

            applyView( direction, view ) {

                var before = this._current;
                var after = this._current = Object.create( view );

                if ( before && before.scope )
                    before.scope.$destroy( );

                after.parameters = angular.copy( view.parameters );
                after.element = angular.element( '<div class="nitro-view-panel"/>' );
                after.scope = this.$scope.$new( );

                after.scope.$on( '$nitroViewChangeTransitionStart', e => {
                    e.stopPropagation( );
                } );

                this.$element.append( after.element );
                after.element.html( after.template || '' );
                $compile( after.element.contents( ) )( after.scope );
                after.element.detach( );
                after.scope.$apply( );

                this.prepareElementSwitch( after, before, {
                    direction, related : before && after.group === before.group
                } );

            }

            prepareElementSwitch( after, before, options ) {

                this._animationQueue = this._animationQueue.then( ( ) => {

                    this.$scope.$emit( '$nitroViewChangeTransitionStart', after, before, options );

                    this.$element.attr( 'nitro-direction', options.direction );
                    this.$element.attr( 'nitro-related', options.related ? 'yes' : 'no' );

                    var leaving = Promise.resolve( before && $animate.leave( before.element ) );
                    var entering = Promise.resolve( $animate.enter( after.element, this.$element ) );

                    $rootScope.$apply( );

                    return Promise.all( [ leaving, entering ] ).then( ( ) => {

                        this.$element.removeAttr( 'nitro-direction' );
                        this.$element.removeAttr( 'nitro-related' );

                        var element = after.element[ 0 ].querySelector( '[autofocus]' );
                        element && element.focus( );

                    } );

                } );

            }

            destroy( ) {

                if ( this._parent ) {
                    this._parent._children[ this._name ] = null;
                    delete this._parent._children[ this._name ];
                }

                if ( this._listener ) {
                    this._listener( );
                    this._listener = null;
                }

            }

        },

        link( $scope, $element, $attrs, [ nitroView, parentNitroView ] ) {

            if ( parentNitroView ) {
                nitroView.setParent( parentNitroView );
            } else {
                nitroView.registerStateListener( );
            }

            $scope.$on( '$destroy', e => {
                nitroView.destroy( );
            } );

        }

    };

} ];
