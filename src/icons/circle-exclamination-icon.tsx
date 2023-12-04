import { IconProps } from ".";

function circleExclaminationIcon({ style, onClick }: IconProps) {
    return (
        <svg style={style} onClick={onClick} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.3333 22C17.8561 22 22.3333 17.5228 22.3333 12C22.3333 6.47715 17.8561 2 12.3333 2C6.8104 2 2.33325 6.47715 2.33325 12C2.33325 17.5228 6.8104 22 12.3333 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.3433 8L12.3333 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.3433 16L12.3433 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default circleExclaminationIcon;