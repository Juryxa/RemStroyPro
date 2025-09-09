'use client'
import styles from './Field.module.css';

interface FieldProps {
    children: React.ReactNode,
    className: string;
}

function Field({ children, className }: FieldProps) {
    const classNames = className
        .split(' ')
        .map(c => styles[c])
        .filter(Boolean) 

    return (
        <span className={`${styles.field} ${classNames.join(' ')}`}>
            {children}
        </span>
    );
}

export default Field;
