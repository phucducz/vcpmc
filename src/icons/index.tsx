export { default as storeRecordIcon } from './store-record-icon';
export { default as playlistIcon } from './play-list-icon';
export { default as managementIcon } from './management-icon';
export { default as revenueIcon } from './revenue-icon';
export { default as settingIcon } from './setting-icon';
export { default as supportIcon } from './support-icon';
export { default as calendarIcon } from './calendar-icon';
export { default as searchIcon } from './search-icon';
export { default as listTabGridIcon } from './list-tab-grid-icon';
export { default as listTabListIcon } from './list-tab-list-icon';

export type IconProps = {
    icon: any;
    style?: any;
}

export const Icon = ({ icon: Icon, style, ...passProps }: IconProps) => {
    return <Icon style={style} {...passProps} />;
}