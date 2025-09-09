'use client';
import styles from './TelegramBlueButton.module.css';
import tgBlueSvg from 'public/tgBlue.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';

function TelegramBlueButton() {
    const handleClick = useCallback(() => {
        if (typeof window !== 'undefined' && typeof window.ym === 'function') {
            window.ym(103620695, 'reachGoal', 'TelegramBlueButton');
        }
    }, []);

    return (
        <Link
            href="https://t.me/remstroyprobot?start=BlueMain"
            onClick={handleClick}
        >
            <div className={styles.button}>
                Telegram
                <Image src={tgBlueSvg} alt={'tg'} />
            </div>
        </Link>
    );
}

export default TelegramBlueButton;