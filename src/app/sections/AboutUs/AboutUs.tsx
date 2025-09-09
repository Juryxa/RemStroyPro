'use client'
import styles from './AboutUs.module.css'
import Field from "@/app/components/Field";
import TitleH2 from "@/app/components/TitleH2";
import {useInView} from 'react-intersection-observer';
import {useEffect, useState} from 'react';

function AboutUs() {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: false
    });

    const [visibleFields, setVisibleFields] = useState<boolean[]>([]);
    const fields: {className: 'orange' | 'gray'; text: string}[] = [
        { className: "orange", text: "Более 200 реализованных проектов" },
        { className: "gray", text: "Знакомимся с любыми нестандартными задачами и доводим каждую идею до идеала" },
        { className: "gray", text: "Мы не гонимся за количеством — работаем на репутацию" },
        { className: "orange", text: "90 % клиентов рекомендуют нас знакомым" },
        { className: "orange", text: "Средний стаж мастера — 10 лет" },
        { className: "gray", text: "В команде только проверенные специалисты, многие из них работали на крупных городских объектах" },
        { className: "gray", text: "Даже без официального договора мы уверены в результате и оперативно устраняем любые недостатки" },
        { className: "gray", text: "Личный менеджер на связи 24/7" },
        { className: "gray", text: "Вы экономите на наценках, а мы берём всю ответственность за сроки и материалы" },
        { className: "gray", text: "Всё под ключ без посредников" },
        { className: "orange", text: "Гарантия качества 2 года" }
    ];

    useEffect(() => {
        if (inView) {
            // Активируем каждое поле с задержкой
            const timeouts = fields.map((_, index) => {
                return setTimeout(() => {
                    setVisibleFields(prev => {
                        const newState = [...prev];
                        newState[index] = true;
                        return newState;
                    });
                }, index * 100); // 100ms задержка между элементами
            });

            return () => timeouts.forEach(timeout => clearTimeout(timeout));
        }
    }, [inView]);

    return (
        <section ref={ref} className={styles.aboutUs}>
            <TitleH2>О нас</TitleH2>
            <div className={styles.fields}>
                {fields.map((field, index) => (
                    <div
                        key={index}
                        className={`${styles.fieldWrapper} ${visibleFields[index] ? styles.visible : ''}`}
                        style={{ transitionDelay: `${index * 0.1}s` }}
                    >
                        <Field className={field.className}>{field.text}</Field>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default AboutUs;