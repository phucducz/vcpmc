import { IconProps } from ".";

function usersIcon({ style, className, onClick }: IconProps) {
    return (
        <svg style={style} className={className} onClick={onClick} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30.6665 27.9985V25.3319C30.6656 24.1502 30.2723 23.0022 29.5483 22.0683C28.8243 21.1344 27.8107 20.4673 26.6665 20.1719" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22.6668 28V25.3333C22.6668 23.9188 22.1049 22.5623 21.1047 21.5621C20.1045 20.5619 18.748 20 17.3335 20H6.66683C5.25234 20 3.89579 20.5619 2.89559 21.5621C1.8954 22.5623 1.3335 23.9188 1.3335 25.3333V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21.3335 4.17188C22.4807 4.46561 23.4975 5.13281 24.2237 6.06829C24.9498 7.00377 25.344 8.15431 25.344 9.33854C25.344 10.5228 24.9498 11.6733 24.2237 12.6088C23.4975 13.5443 22.4807 14.2115 21.3335 14.5052" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.9998 14.6667C14.9454 14.6667 17.3332 12.2789 17.3332 9.33333C17.3332 6.38781 14.9454 4 11.9998 4C9.05432 4 6.6665 6.38781 6.6665 9.33333C6.6665 12.2789 9.05432 14.6667 11.9998 14.6667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default usersIcon;