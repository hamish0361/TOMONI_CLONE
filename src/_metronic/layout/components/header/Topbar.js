import objectPath from 'object-path';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHtmlClassService } from '../../_core/MetronicLayout';
import { LanguageSelectorDropdown } from '../extras/dropdowns/LanguageSelectorDropdown';
import { QuickUserToggler } from '../extras/QuiclUserToggler';

export function Topbar() {
    const uiService = useHtmlClassService();

    const layoutProps = useMemo(() => {
        return {
            viewSearchDisplay: objectPath.get(
                uiService.config,
                'extras.search.display'
            ),
            viewNotificationsDisplay: objectPath.get(
                uiService.config,
                'extras.notifications.display'
            ),
            viewQuickActionsDisplay: objectPath.get(
                uiService.config,
                'extras.quick-actions.display'
            ),
            viewCartDisplay: objectPath.get(
                uiService.config,
                'extras.cart.display'
            ),
            viewQuickPanelDisplay: objectPath.get(
                uiService.config,
                'extras.quick-panel.display'
            ),
            viewLanguagesDisplay: objectPath.get(
                uiService.config,
                'extras.languages.display'
            ),
            viewUserDisplay: objectPath.get(
                uiService.config,
                'extras.user.display'
            )
        };
    }, [uiService]);

    return (
        <div className="topbar">
            {layoutProps.viewSearchDisplay &&
                process.env.REACT_APP_ENV === 'development' && (
                    <span
                        className={`label font-weight-bold label-lg label-inline ${'label-light-warning'} h4 mt-6 mr-16`}
                    >
                        <FormattedMessage id="GLOBAL.CHECK.ENV.DEVELOPMENT" />
                    </span>
                )}
            {layoutProps.viewLanguagesDisplay && <LanguageSelectorDropdown />}

            {layoutProps.viewUserDisplay && <QuickUserToggler />}
        </div>
    );
}
