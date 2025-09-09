'use client';

import { useRef, useState, useEffect } from 'react';
import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';
import tg from 'public/tg.svg';
import mail from 'public/mail.svg';
import phoneIcon from 'public/phone-icon.svg';

function Footer() {
    const [showDropdown, setShowDropdown] = useState(false);
    const iconRef = useRef<HTMLDivElement | null>(null);

    const phoneNumbers = [
        { name: 'Сергей', number: '+7 (999) 981-71-29' },
        { name: 'Алексей', number: '+7 (916) 265-50-90' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (iconRef.current && !iconRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    return (
        <footer className={styles.footer}>
            <Link href="/" className={styles.link}>
                РемСтройПро. Строительство и ремонт под ключ
            </Link>
            <Link href="/" className={`${styles.link} ${styles.link2}`}>
                © 2025 РемСтройПро. <br/>Все права защищены
            </Link>
            <div className={styles.images}>
                {/* Телефон с выпадающим списком */}
                <div
                    className={styles.iconWrapper}
                    onClick={() => setShowDropdown(!showDropdown)}
                    ref={iconRef}
                >
                    <Image src={phoneIcon} alt="phone" width={40} height={40} className={styles.phoneIcon} />
                    {showDropdown && (
                        <div className={styles.dropdown}>
                            {phoneNumbers.map((item, i) => (
                                <a
                                    key={i}
                                    href={`tel:${item.number.replace(/[^0-9+]/g, '')}`}
                                    onClick={() => {
                                        if (typeof window !== 'undefined' && typeof window.ym === 'function') {
                                            if (item.name === 'Сергей') {
                                                window.ym(103620695, 'reachGoal', 'phoneSerB');
                                            } else if (item.name === 'Алексей') {
                                                window.ym(103620695, 'reachGoal', 'phoneAlecB');
                                            }
                                        }
                                    }}
                                >
                                    {item.name}: {item.number}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                {/* Telegram */}
                <Link
                    href="https://t.me/remstroyprobot?start=FooterButton"
                    className={styles.iconLink}
                >
                    <Image src={tg} alt="telegram" width={40} height={40} />
                </Link>

                {/* Email */}
                <Link href="mailto:remstroiipro@gmail.com" className={styles.iconLink}>
                    <Image src={mail} alt="email" width={40} height={40} />
                </Link>
            </div>
        </footer>
    );
}

export default Footer;
