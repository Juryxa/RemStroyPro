'use client'
import styles from './TitleH2.module.css'

interface FieldProps {
    children: React.ReactNode,
}

function TitleH2({children}: FieldProps) {
    return (
        <h2 className={styles.title}>{children}</h2>
    );
}

export default TitleH2;