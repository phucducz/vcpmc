import { IconProps } from ".";

function trashIcon({ style, className, onClick }: IconProps) {
    return (
        <svg style={style} className={className} onClick={onClick} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3333 24.0003C13.687 24.0003 14.0261 23.8599 14.2761 23.6098C14.5262 23.3598 14.6667 23.0206 14.6667 22.667V14.667C14.6667 14.3134 14.5262 13.9742 14.2761 13.7242C14.0261 13.4741 13.687 13.3337 13.3333 13.3337C12.9797 13.3337 12.6406 13.4741 12.3905 13.7242C12.1405 13.9742 12 14.3134 12 14.667V22.667C12 23.0206 12.1405 23.3598 12.3905 23.6098C12.6406 23.8599 12.9797 24.0003 13.3333 24.0003ZM26.6667 8.00033H21.3333V6.66699C21.3333 5.60613 20.9119 4.58871 20.1618 3.83857C19.4116 3.08842 18.3942 2.66699 17.3333 2.66699H14.6667C13.6058 2.66699 12.5884 3.08842 11.8382 3.83857C11.0881 4.58871 10.6667 5.60613 10.6667 6.66699V8.00033H5.33333C4.97971 8.00033 4.64057 8.1408 4.39052 8.39085C4.14048 8.6409 4 8.98004 4 9.33366C4 9.68728 4.14048 10.0264 4.39052 10.2765C4.64057 10.5265 4.97971 10.667 5.33333 10.667H6.66667V25.3337C6.66667 26.3945 7.08809 27.4119 7.83824 28.1621C8.58839 28.9122 9.6058 29.3337 10.6667 29.3337H21.3333C22.3942 29.3337 23.4116 28.9122 24.1618 28.1621C24.9119 27.4119 25.3333 26.3945 25.3333 25.3337V10.667H26.6667C27.0203 10.667 27.3594 10.5265 27.6095 10.2765C27.8595 10.0264 28 9.68728 28 9.33366C28 8.98004 27.8595 8.6409 27.6095 8.39085C27.3594 8.1408 27.0203 8.00033 26.6667 8.00033ZM13.3333 6.66699C13.3333 6.31337 13.4738 5.97423 13.7239 5.72418C13.9739 5.47413 14.313 5.33366 14.6667 5.33366H17.3333C17.687 5.33366 18.0261 5.47413 18.2761 5.72418C18.5262 5.97423 18.6667 6.31337 18.6667 6.66699V8.00033H13.3333V6.66699ZM22.6667 25.3337C22.6667 25.6873 22.5262 26.0264 22.2761 26.2765C22.0261 26.5265 21.687 26.667 21.3333 26.667H10.6667C10.313 26.667 9.97391 26.5265 9.72386 26.2765C9.47381 26.0264 9.33333 25.6873 9.33333 25.3337V10.667H22.6667V25.3337ZM18.6667 24.0003C19.0203 24.0003 19.3594 23.8599 19.6095 23.6098C19.8595 23.3598 20 23.0206 20 22.667V14.667C20 14.3134 19.8595 13.9742 19.6095 13.7242C19.3594 13.4741 19.0203 13.3337 18.6667 13.3337C18.313 13.3337 17.9739 13.4741 17.7239 13.7242C17.4738 13.9742 17.3333 14.3134 17.3333 14.667V22.667C17.3333 23.0206 17.4738 23.3598 17.7239 23.6098C17.9739 23.8599 18.313 24.0003 18.6667 24.0003Z" fill="currentColor" />
        </svg>
    );
}

export default trashIcon;