'use client'
import {useEffect, useState} from 'react'
import styles from './OurProcess.module.css'
import Field from '@/app/components/Field'
import Completed from "@/app/components/Completed";
import TitleH2 from "@/app/components/TitleH2";

function OurProcess() {
    const [activeIndex, setActiveIndex] = useState(0)
    const fields = ['Заявка', 'Замер', 'Эскиз', 'Утверждение', 'Рабочая документация', 'Проектная документация']

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev >= fields.length - 1 ? -1 : prev + 1))
        }, 2100)

        return () => clearInterval(interval)
    }, [fields.length])

    return (
        <section className={styles.process}>
            <TitleH2>Наш процесс</TitleH2>
            <div className={styles.fields}>
                {fields.map((field, index) => (
                    <Field
                        key={index}
                        className={activeIndex === index ? 'orangeGlow' : 'gray'}
                    >
                        {field}
                    </Field>
                ))}
            </div>
            <Completed/>
        </section>
    )
}

export default OurProcess