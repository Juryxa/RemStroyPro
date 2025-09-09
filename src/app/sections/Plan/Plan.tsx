'use client'
import styles from './Plan.module.css'
import Image from 'next/image'
import trianglePencil from 'public/trianglePencil.png'
import crossedPencil from 'public/crossedPencil.png'
import TitleH2 from "@/app/components/TitleH2";
import OurProcess from "@/app/sections/OurProcess/OurProcess";
import {useEffect, useRef, useState} from 'react';
import PlanModal from "@/app/components/PlanModal";

function Plan() {
    const [animate, setAnimate] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const animationPlayed = useRef(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleFormSubmit = (data: { name: string; phone: string; projectType: string }) => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !animationPlayed.current) {
                    setAnimate(true);
                    animationPlayed.current = true;
                }
            },
            {threshold: 0.1}
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section>
            <div className={styles.plan} ref={sectionRef}>
                <div className={`${styles.h2Wrap} ${styles.titleAnimation} ${animate ? styles.animate : ''}`}>
                    <TitleH2>
                        Проект перепланировки и дизайн под ключ
                    </TitleH2>
                </div>

                <h3 className={`${styles.subtitleAnimation} ${styles.titleH3} ${animate ? styles.animate : ''}`}>
                    польза и выгода.
                </h3>

                <div className={styles.cards}>
                    <span className={`${styles.adjacentCard} ${styles.cardAnimation} ${animate ? styles.animate : ''}`}
                          style={animate ? {animationDelay: '0.2s'} : {}}>
                        <Image className={styles.adjacentImage} src={trianglePencil} alt={'pencil'}/>
                        <p className={styles.adjacentText}>Перепланировка квартир</p>
                    </span>

                    <span className={`${styles.centralCard} ${styles.cardAnimation} ${animate ? styles.animate : ''}`}
                          style={animate ? {animationDelay: '0.3s'} : {}}>
                        <h4 className={styles.titleH4}>Создаём проекты перепланировки и дизайна — под ключ</h4>
                        <p>Разрабатываем проекты перепланировки,<br/>
                            дизайна и инженерных систем — от концепции до<br/>
                            рабочей документации. Всё в одном месте, с<br/>
                            учётом норм и ваших пожеланий.</p>
                        <p>Базовый эскиз – от 1000 ₽/м²<br/>
                            Рабочие чертежи – от 1500 ₽/м²<br/>
                            Полный проект – от 2500 ₽/м²<br/>
                            Авторский / премиум – от 4500 ₽/м²<br/>
                        </p>
                        <button className={styles.orderButton} onClick={() => setModalIsOpen(true)}>
                            Консультация по проекту
                        </button>
                    </span>

                    <span className={`${styles.adjacentCard} ${styles.cardAnimation} ${animate ? styles.animate : ''}`}
                          style={animate ? {animationDelay: '0.4s'} : {}}>
                        <Image className={styles.adjacentImage} src={crossedPencil} alt={'pencil'}/>
                        <p className={styles.adjacentText}>Дизайн-проект квартир и домов</p>
                    </span>
                </div>
            </div>

            <OurProcess/>
            <PlanModal
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </section>
    );
}

export default Plan;