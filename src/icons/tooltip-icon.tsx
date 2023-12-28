import { IconProps } from ".";

function tooltipIcon({ style, className, onClick }: IconProps) {
    return (
        <svg style={style} className={className} onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="189" height="112" viewBox="0 0 189 112" fill="none">
            <g filter="url(#filter0_dd_453_14122)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M97.093 86.4891C95.279 88.5036 92.3378 88.5036 90.5238 86.4891L86.5921 82.3365C85.7196 81.415 85.2834 80.9543 84.7673 80.6243C84.3098 80.3318 83.8078 80.1157 83.2808 79.9846C82.6863 79.8367 82.0518 79.8367 80.7828 79.8367H34.2462C27.9016 79.8367 25.6009 79.2684 23.2814 78.2012C20.9619 77.134 19.1416 75.568 17.9011 73.5725C16.6606 71.5771 16 69.5978 16 64.1395V23.6973C16 18.239 16.6606 16.2597 17.9011 14.2642C19.1416 12.2687 20.9619 10.7027 23.2814 9.63551C25.6009 8.56832 27.9016 8 34.2462 8H154.319C160.664 8 162.965 8.56832 165.284 9.63551C167.604 10.7027 169.424 12.2687 170.665 14.2642C171.905 16.2597 172.566 18.239 172.566 23.6973V64.1395C172.566 69.5978 171.905 71.5771 170.665 73.5725C169.424 75.568 167.604 77.134 165.284 78.2012C162.965 79.2684 160.664 79.8367 154.319 79.8367H110.276C107.738 79.8367 106.469 79.8367 105.28 80.1325C104.227 80.3947 103.222 80.8268 102.307 81.4118C101.275 82.0718 100.403 82.9933 98.6579 84.8363L97.093 86.4891Z" fill="#3E3E5B" fill-opacity="0.7" />
            </g>
            <defs>
                <filter id="filter0_dd_453_14122" x="0" y="0" width="188.566" height="112" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="8" />
                    <feGaussianBlur stdDeviation="8" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.196487 0 0 0 0 0.196487 0 0 0 0 0.279476 0 0 0 0.06 0" />
                    <feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_453_14122" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="8" />
                    <feGaussianBlur stdDeviation="4" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.196487 0 0 0 0 0.196487 0 0 0 0 0.279476 0 0 0 0.08 0" />
                    <feBlend mode="multiply" in2="effect1_dropShadow_453_14122" result="effect2_dropShadow_453_14122" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_453_14122" result="shape" />
                </filter>
            </defs>
        </svg>
    );
}

export default tooltipIcon;