import { IconProps } from ".";

function userXIcon({ style, onClick }: IconProps) {
    return (
        <svg style={style} onClick={onClick} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.3333 28V25.3333C21.3333 23.9188 20.7713 22.5623 19.7712 21.5621C18.771 20.5619 17.4144 20 15.9999 20H6.66659C5.2521 20 3.89554 20.5619 2.89535 21.5621C1.89516 22.5623 1.33325 23.9188 1.33325 25.3333V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 10.668L30.6667 17.3346" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30.6667 10.668L24 17.3346" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.3333 14.6667C14.2789 14.6667 16.6667 12.2789 16.6667 9.33333C16.6667 6.38781 14.2789 4 11.3333 4C8.38781 4 6 6.38781 6 9.33333C6 12.2789 8.38781 14.6667 11.3333 14.6667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default userXIcon;