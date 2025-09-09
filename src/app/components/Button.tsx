'use client'
import styles from './Button.module.css';
import {Roboto_Flex} from "next/font/google";

interface ButtonProps {
    children: React.ReactNode;
    pressed?: boolean;
    onClick?: () => void;
}

const robotoFlex = Roboto_Flex({
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
})

export const Button = ({ children, pressed = false, onClick }: ButtonProps) => {
    return (
        <button
            tabIndex={0}
            className={`${styles.button} ${pressed ? styles.pressed : ''} ${robotoFlex.className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};