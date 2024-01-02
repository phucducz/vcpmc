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
export { default as playlistAddIcon } from './play-list-icon';
export { default as circleExclaminationIcon } from './circle-exclamination-icon';
export { default as trashIcon } from './trash-icon';
export { default as editAltIcon } from './edit-alt-icon';
export { default as editCalendarIcon } from './edit-calendar-icon';
export { default as windows10Icon } from './windows-10-icon';
export { default as vector1Icon } from './vector-1-icon';
export { default as vector2Icon } from './vector-2-icon';
export { default as vector3Icon } from './vector-3-icon';
export { default as vector4Icon } from './vector-4-icon';
export { default as ecreiptIcon } from './ecreipt-icon';
export { default as fileCheckAltIcon } from './file-check-alt';
export { default as tooltipIcon } from './tooltip-icon';
export { default as clipboardNoteIcon } from './clipboard-note-icon';
export { default as checkIcon } from './check-icon';

export type IconProps = {
    icon: any;
    style?: any;
    className?: string;
    onClick?: () => void
}

export const Icon = ({ icon: Icon, style, className, onClick, ...passProps }: IconProps) => {
    return <Icon style={style} {...passProps} className={className} onClick={onClick} />;
}