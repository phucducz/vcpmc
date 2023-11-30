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
export { default as musicIcon } from './music-icon';
export { default as cameraIcon } from './camera-icon';
export { default as uploadIcon } from './upload-icon';

export type IconProps = {
    icon: any;
    style?: any;
    className?: string;
    onClick?: () => void
}

export const Icon = ({ icon: Icon, style, className, onClick, ...passProps }: IconProps) => {
    return <Icon style={style} {...passProps} className={className} onClick={onClick} />;
}