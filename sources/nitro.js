import { application }         from './directives/application';
import { content }             from './directives/content';
import { header }              from './directives/header';
import { menu }                from './directives/menu';
import { page }                from './directives/page';
import { popover }             from './directives/popover';
import { sref }                from './directives/sref';
import { tabs }                from './directives/tabs';
import { tab }                 from './directives/tab';
import { tools }               from './directives/tools';
import { tool }                from './directives/tool';
import { transclude }          from './directives/transclude';
import { view }                from './directives/view';

import { ApplicationProvider } from './services/Application';
import { HistoryBackProvider } from './services/HistoryBack';
import { LocationProvider }    from './services/Location';
import { MenusProvider }       from './services/Menus';
import { NavigationProvider }  from './services/Navigation';
import { PopoverProvider }     from './services/Popover';
import { ToolsProvider }       from './services/Tools';

window.angular.module( 'nitro', [ ] )

    .directive( 'nitroApplication' , application )
    .directive( 'nitroContent'     , content )
    .directive( 'nitroHeader'      , header )
    .directive( 'nitroMenu'        , menu )
    .directive( 'nitroPage'        , page )
    .directive( 'nitroPopover'     , popover )
    .directive( 'nitroSref'        , sref )
    .directive( 'nitroTabs'        , tabs )
    .directive( 'nitroTab'         , tab )
    .directive( 'nitroTools'       , tools )
    .directive( 'nitroTool'        , tool )
    .directive( 'nitroTransclude'  , transclude )
    .directive( 'nitroView'        , view )

    .provider( '$nitroApplication' , ApplicationProvider )
    .provider( '$nitroHistoryBack' , HistoryBackProvider )
    .provider( '$nitroLocation'    , LocationProvider )
    .provider( '$nitroMenus'       , MenusProvider )
    .provider( '$nitroNavigation'  , NavigationProvider )
    .provider( '$nitroPopover'     , PopoverProvider )
    .provider( '$nitroTools'       , ToolsProvider )

;
