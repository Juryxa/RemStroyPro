'use client';
import styles from './Nav.module.css'
import Image from "next/image";
import logo from 'public/logo.svg'
import geo from 'public/geo.svg'
import phone from 'public/phone.svg'
import tg from 'public/tg.svg'
import Link from "next/link";
import PlanModal from "@/app/components/PlanModal";
import {useState} from "react";

function Nav({ activeSection }: { activeSection: string }) {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const handleFormSubmit = (data: { name: string; phone: string; projectType: string }) => {
        setModalIsOpen(false);
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    };

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

            <div className={styles.logoWrap}>
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
                    {navItems.map((item, index) => {
                        return (
                            <button
                                key={index}
                                className={`${styles.link} ${activeSection === item.id ? styles.activeLink : ''}`}
                                onClick={() => scrollToSection(item.id)}
                            >
                                {item.label}
                            </button>
                        )
                    })}

                    <div className={styles.withSvg}>
                        {/* Telegram */}
                        <Link
                            href="https://t.me/remstroyprobot?start=HeaderButton"
                        >
                            <Image src={tg} alt="telegram" width={32} height={27} />
                        </Link>
                        <Link className={styles.mail} href="mailto:remstroiipro@gmail.com">remstroiipro@gmail.com</Link>
                    </div>
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
