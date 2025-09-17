'use client';
import styles from './Nav.module.css';
import Image from "next/image";
import logo from 'public/logo.svg';
import geo from 'public/geo.svg';
import phone from 'public/phone.svg';
import tg from 'public/tg.svg';
import tgBlue from 'public/tgBlueMain.svg';
import Link from "next/link";
import PlanModal from "@/app/components/PlanModal";
import {useEffect, useRef, useState} from "react";
import wa from "public/whatsapp.svg";

function Nav({activeSection}: { activeSection: string }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement | null>(null);
    const burgerRef = useRef<HTMLButtonElement | null>(null);

    const handleFormSubmit = (data: { name: string; phone: string; projectType: string }) => {
        setModalIsOpen(false);
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({behavior: 'smooth', block: 'start'});
            setIsMenuOpen(false); // закрываем меню после клика
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                isMenuOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                burgerRef.current &&
                !burgerRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    const navItems = [
        {id: 'krutorus', label: 'Главная'},
        {id: 'calculator', label: 'Калькулятор'},
        {id: 'services', label: 'Услуги'},
        {id: 'plan', label: 'Разработка проектов'},
        {id: 'howwework', label: 'Условия работы'},
        {id: 'aboutus', label: 'О нас'}
    ];

    return (
        <nav className={styles.nav}>
            {/* Десктопная часть */}
            <div className={styles.logoWrapDesc}>
                <Image src={logo} alt={'лого'}/>
                <p className={styles.logoName}>РЕМСТРОЙПРО</p>
            </div>
            <div className={styles.infoWrap}>
                <div className={styles.infoTop}>
                    <div className={styles.withSvg}>
                        <Image src={geo} alt={'гео'} width={17} height={26}/>
                        <p>
                            Работаем по <u>МСК</u> и <u>МО</u>
                        </p>
                    </div>
                    <button className={styles.discount} onClick={() => scrollToSection('discount')}>
                        Получить расчёт со скидкой -15%
                    </button>
                    <div className={styles.withSvg}>
                        <Image src={phone} alt={'телефон'} width={27} height={27}/>
                        <Link className={styles.phone} href="tel:+79999817129">+7 (999) 981-71-29</Link>
                    </div>
                    <button className={styles.recall} onClick={() => setModalIsOpen(true)}>
                        Перезвонить мне
                    </button>
                </div>

                <div className={styles.infoBottom}>
                    {navItems.map((item, index) => (
                        <button
                            key={index}
                            className={`${styles.link} ${activeSection === item.id ? styles.activeLink : ''}`}
                            onClick={() => scrollToSection(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}

                    <div className={styles.withSvg}>
                        <Link href="https://t.me/remstroyprobot?start=HeaderButton">
                            <Image src={tg} alt="telegram" width={32} height={27}/>
                        </Link>
                        <Link className={styles.mail} href="mailto:remstroiipro@gmail.com">remstroiipro@gmail.com</Link>
                    </div>
                </div>
            </div>

            {/* Мобильная часть */}
            <div className={styles.mobileWrap}>
                <div className={styles.logoWrapMob}>
                    <Image src={logo} alt={'лого'}/>
                    <p className={styles.logoName}>РЕМСТРОЙПРО</p>
                </div>
                <div className={styles.centerBlock}>
                    <div className={styles.tgPhone}>
                        <Link href={'https://t.me/remstroyprobot?start=HeaderButton'}>
                            <Image src={tgBlue} alt={'tg'}/>
                        </Link>
                        <Link href='https://wa.me/+79999817129' className={styles.waNav}>
                            <Image src={wa} alt="whatsapp" width={23} height={23}/>
                        </Link>
                        <Link className={styles.phone} href="tel:+79999817129">+7 (999) 981-71-29</Link>
                    </div>
                    <button className={styles.recall} onClick={() => setModalIsOpen(true)}>
                        Перезвонить мне
                    </button>
                </div>

                <div className={styles.circle}>
                    <button
                        ref={burgerRef}
                        className={`${styles.burger} ${isMenuOpen ? styles.open : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className={styles.stick}></span>
                        <span className={styles.stick}></span>
                        <span className={styles.stick}></span>
                    </button>
                </div>
            </div>

            {/* Выпадающее меню для мобилы */}
            <div
                ref={menuRef}
                className={`${styles.mobileMenu} ${isMenuOpen ? styles.show : ''}`}
            >
                {navItems.map((item, index) => (
                    <button
                        key={index}
                        className={styles.mobileLink}
                        onClick={() => scrollToSection(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
                <div className={styles.withSvg}>
                    <Link className={styles.mail} href="mailto:remstroiipro@gmail.com">remstroiipro@gmail.com</Link>
                </div>
            </div>

            <PlanModal
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </nav>
    );
}

export default Nav;
