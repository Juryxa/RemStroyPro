'use client'
import { useEffect, useRef, useState } from 'react';
import styles from './KrutorusBottom.module.css'
import Image from "next/image";
import BuilderImage from "public/man.png"
import CloudImage from "public/cloud.png"
import arrowLeft from "public/arrowLeft.png"
import stone1 from "public/stone.png"
import Field from "@/app/components/Field";
import Link from "next/link";
import TelegramBlueButton from "@/app/components/TelegramBlueButton";

function KrutorusBottom() {
    const orangeRef = useRef<HTMLDivElement>(null);
    const grayRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
    const element = orangeRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                observer.disconnect(); // ⛔ Остановим наблюдение после первого входа
            }
        },
        { threshold: 0.3 }
    );

    observer.observe(element);

    return () => {
        observer.disconnect();
    };
}, []);


    return (
        <div className={styles.krutorusBottom}>
            <div className={styles.images}>
                <Image className={styles.man} src={BuilderImage} alt="строитель" height={456} />
                <Image className={styles.cloud} src={CloudImage} alt="Узнайте стоимость любой работы!" height={126} />
            </div>
            <div className={styles.fieldsAndButton}>
                <div className={styles.fields}>
                    <div className={styles.fieldsOpacity}>
                        <div
                            ref={orangeRef}
                            className={inView ? styles.animateLeft : ''}
                        >
                            <Field className={'transparentOrange compact'}>
                                Есть вопросы или нужна помощь с выбором услуги?
                            </Field>
                        </div>
                        <div
                            ref={grayRef}
                            className={inView ? styles.animateRight : ''}
                        >
                            <Field className={'transparentGray compact'}>
                                - Да, хочу уточнить пару моментов.<br />
                                <Link className={styles.link} href="/">
                                    📲 <span className={styles.linkDecoration}>Пишите в Telegram — ответим в течении 15 минут!</span>
                                </Link>
                            </Field>
                        </div>
                    </div>
                    <Image
                        className={`${styles.arrowLeft} ${inView ? styles.animateDrawArrow : ''}`}
                        src={arrowLeft}
                        alt='arrow'
                    />
                    <div className={styles.tgbtn}>
                        <TelegramBlueButton />
                    </div>
                </div>
            </div>
            <div className={styles.imagestone}>
                <Image className={styles.stone1} src={stone1} alt='stone1' />
            </div>
        </div>
    );
}

export default KrutorusBottom;
