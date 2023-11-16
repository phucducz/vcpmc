export type HorizontalPosition = 'left' | 'center' | 'right';
export type VerticalPosition = 'top' | 'center' | 'bottom';

export type Position = Exclude<`${HorizontalPosition}-${VerticalPosition}`, 'center-center'> | 'center';