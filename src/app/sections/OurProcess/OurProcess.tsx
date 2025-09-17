'use client'
import {useEffect, useState} from 'react';
import styles from './OurProcess.module.css';
import Completed from "@/app/components/Completed";
import TitleH2 from "@/app/components/TitleH2";

export default function OurProcess() {
    const [activeIndex, setActiveIndex] = useState(0);
    const fields = ['Заявка', 'Замер', 'Эскиз', 'Утверждение', 'Рабочая документация', 'Проектная документация'];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev >= fields.length - 1 ? 0 : prev + 1));
        }, 2500);

        return () => clearInterval(interval);
    }, [fields.length]);

    return (
        <section className={styles.process}>
            <TitleH2>Наш процесс</TitleH2>
            <div className={styles.fields}>
                {fields.map((field, index) => (
                    <span
                        key={index}
                        className={`${styles.field} ${activeIndex === index ? styles.active : ''}`}
                    >
            {field}
          </span>
                ))}
            </div>
            <Completed files={[
                { type: 'image', src: '/works/11.webp' },
                { type: 'image', src: '/works/12.webp' },
                { type: 'image', src: '/works/13.webp' },
                { type: 'image', src: '/works/14.webp' },
                { type: 'image', src: '/works/15.webp' },
            ]}/>
        </section>
    );
}
