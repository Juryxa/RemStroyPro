'use client';
import styles from './Nav.module.css';
import { Button } from "@/app/components/Button";
import { useEffect, useState } from 'react';

interface NavProps {
    activeSection: string;
}

function Nav({ activeSection }: NavProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isReady, setIsReady] = useState(false); // 🆕

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 700;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMenuOpen(false);
            }
        };

        handleResize(); // Первичная установка
        setIsReady(true); // ✅ После первого определения — разрешаем рендер

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setIsMenuOpen(false);
        }
    };

    const navItems = [
        { id: 'krutorus', label: 'Главная' },
        { id: 'calculator', label: 'Калькулятор' },
        { id: 'services', label: 'Услуги' },
        { id: 'plan', label: 'Разработка проектов' },
        { id: 'howwework', label: 'Условия работы' },
        { id: 'aboutus', label: 'О нас' }
    ];

    // 🔐 До инициализации — ничего не показываем
    if (!isReady) return null;

    return (
    <nav className={`${styles.nav} ${isMobile ? styles.mobileNav : ''} ${styles.navAnimate}`}>
        <div className={styles.buttons}>
            {isMobile ? (
                <>
                    <div className={styles.hamburgerRow}>
                        <span className={styles.mobileBrand}>РемСтройПро</span>
                        <div className={styles.hamburger} onClick={toggleMenu}>
                            <div className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></div>
                            <div className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></div>
                            <div className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></div>
                        </div>
                    </div>
                    <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
                        {navItems.map(item => (
                            <Button
                                key={item.id}
                                pressed={activeSection === item.id}
                                onClick={() => scrollToSection(item.id)}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </div>
                </>
            ) : (
                navItems.map(item => (
                    <Button
                        key={item.id}
                        pressed={activeSection === item.id}
                        onClick={() => scrollToSection(item.id)}
                    >
                        {item.label}
                    </Button>
                ))
            )}
        </div>
    </nav>
);

}

export default Nav;
