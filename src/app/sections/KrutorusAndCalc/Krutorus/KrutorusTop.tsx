'use client';
import Head from 'next/head';
import styles from './KrutorusTop.module.css';
import stylesField from './Field.module.css';
import Field from "@/app/components/Field";
import {useEffect, useRef} from 'react';

function KrutorusTop() {
    const shineRef = useRef<HTMLDivElement>(null);

    const scrollToAnchor = (e: React.MouseEvent, anchor: string) => {
        e.preventDefault();
        const element = document.querySelector(anchor);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <div className={styles.krutorusTop}>
            <Head>
                <link
                    rel="preload"
                    href="/krutorusTopBg.webp"
                    as="image"
                    fetchPriority="high"
                />
            </Head>
            <div className={styles.inner}>
                <h1 className={styles.title}>РемСтройПро</h1>
                <div className={styles.listWrapper}>
                    <ul className={`${styles.list} ${styles.animatedList}`}>
                        <li>🧱 <b>Проекты любой сложности:</b> от косметического до капитального ремонта.</li>
                        <li>📊 <b>Прозрачные условия,</b> соблюдение сроков и бюджета.</li>
                        <li>🎯 <b>Индивидуальный подход</b> — от идеи до воплощения.</li>
                    </ul>
                </div>
                <div className={styles.fields}>
                    {/* Первая строка - ремонт */}
                    <ul className={`${styles.callList} ${styles.noTopMargin}`}>
                        <li>Нужен ремонт? Сделаем! Созвонимся через 15 мин?</li>
                    </ul>
                    <div className={`${styles.row} ${styles.animatedRow}`}>
                        <a
                            href="#services"
                            className={styles.anchorLink}
                            onClick={(e) => scrollToAnchor(e, '#services')}
                        >
                            <Field className={'orangeTop orangeDelay1'}>Ремонт от 3 000 ₽/м²</Field>
                        </a>
                        <div className={styles.marquee}>
                            <div className={styles.marqueeContent}>
                                <Field className={'gray'}>Под ключ</Field>
                                <Field className={'gray'}>Косметический</Field>
                                <Field className={'gray'}>Евро-ремонт</Field>
                                <Field className={'gray'}>Капитальный</Field>
                                <Field className={'gray'}>Дизайнерский</Field>
                                {/* Дубликаты для бесконечности */}
                                <Field className={'gray'}>Под ключ</Field>
                                <Field className={'gray'}>Косметический</Field>
                                <Field className={'gray'}>Евро-ремонт</Field>
                                <Field className={'gray'}>Капитальный</Field>
                                <Field className={'gray'}>Дизайнерский</Field>
                            </div>
                        </div>
                    </div>

                    {/* Вторая строка - стройка */}
                    <ul className={styles.callList}>
                        <li>Подготовили для Вас спектор наших возможностей!</li>
                    </ul>
                    <div className={`${styles.row} ${styles.animatedRow}`}>
                        <a
                            href="#services"
                            className={styles.anchorLink}
                            onClick={(e) => scrollToAnchor(e, '#services')}
                        >
                            <Field className={'orangeTop orangeDelay2'}>Строительство от 7 990 ₽/м²</Field>
                        </a>
                        <div className={styles.marquee}>
                            <div className={styles.marqueeContent}>
                                <Field className={'gray'}>Коттеджи</Field>
                                <Field className={'gray'}>Дома</Field>
                                <Field className={'gray'}>Складские помещения</Field>
                                <Field className={'gray'}>Ангары</Field>
                                <Field className={'gray'}>Сварочные работы</Field>
                                <Field className={'gray'}>Установка заборов</Field>
                                {/* Дубликаты для бесконечности */}
                                <Field className={'gray'}>Коттеджи</Field>
                                <Field className={'gray'}>Дома</Field>
                                <Field className={'gray'}>Складские помещения</Field>
                                <Field className={'gray'}>Ангары</Field>
                                <Field className={'gray'}>Сварочные работы</Field>
                                <Field className={'gray'}>Установка заборов</Field>
                            </div>
                        </div>
                    </div>

                    {/* Третья строка - разработка проектов */}
                    <ul className={styles.callList}>
                        <li>Нужен проект? Закажите его у нас!</li>
                    </ul>
                    <div className={`${styles.row} ${styles.animatedRow}`}>
                        <a
                            href="#plan"
                            className={styles.anchorLink}
                            onClick={(e) => scrollToAnchor(e, '#plan')}
                        >
                            <Field className={'orangeTop orangeDelay1' } >Разработка проектов от 1 000 ₽</Field>
                        </a>
                        <div className={styles.shineContainer}>
                            <div className={styles.staticFields}>
                                <div className={styles.shinyButton}>
                                    <Field className={'gray'}>Перепланировки</Field>
                                </div>
                                <div className={styles.shinyButton}>
                                    <Field className={'gray'}>Дизайны</Field>
                                </div>
                            </div>
                            <div ref={shineRef} className={styles.shine}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KrutorusTop;