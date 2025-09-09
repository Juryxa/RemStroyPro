'use client'
import styles from './ModalInput.module.css'

interface InputProps {
    className: string;
}

function ModalInput({className}: InputProps) {
    return (
        <input className={`${styles.container} ${styles[className]}`}/>
    );
}

export default ModalInput;