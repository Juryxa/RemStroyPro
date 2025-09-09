'use client'

import styles from './HowWeWork.module.css';
import Field from "@/app/components/Field";
import AccordionUI from "@/app/components/AccordionUI";
import {useInView} from 'react-intersection-observer';

function HowWeWork() {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: false
    });

    const sections = [
        {
            title: 'Реализация',
            content: '– Выполнение работ по согласованному плану, фото- и видеоотчёты.'
        },
        {
            title: 'Завершение и приёмка',
            content: '– Общий осмотр, устранение мелких недочётов, передача объекта.'
        },
        {
            title: 'Условия расчётов',
            content: `– Стоимость от 3 000 ₽/м², без скрытых доплат.\n– Оплата поэтапно: 30 % – предоплата, 50 % – в процессе, 20 % – после сдачи`
        },
        {
            title: 'Сроки',
            content: `– Примерные сроки для каждого этапа:\n– Замер и согласование — 2–3 дня\n– Проектирование — 5–7 дней\n– Работы — в зависимости от объёма (указывается в договоре)`
        },
        {
            title: 'Как мы обеспечиваем качество',
            content: `– Авторский надзор\n– Фото- и видеоотчёты\n– Использование сертифицированных материалов`
        },
        {
            title: 'Прозрачность и коммуникации',
            content: `– Еженедельные отчёты\n– Личный менеджер на связи 24/7\n– Онлайн-доступ к планам и документам`
        }
    ];

    return (
        <section ref={ref} className={styles.howWork}>
            <div className={styles.inner}>
                <h2 className={styles.title}>Как мы работаем?</h2>
                <p className={styles.text}>
                    Мы придерживаемся принципов полной прозрачности во всех процессах и искренне заботимся о комфорте и интересах каждого клиента. Ваше доверие — наш главный приоритет.
                </p>
                <div className={styles.fields}>
                    <Field className={'transparentOrange'}>Выезд на замер в день заявки</Field>
                    <Field className={'transparentOrange'}>Работаем по договору</Field>
                    <Field className={'transparentOrange'}>30 % предоплаты перед работой</Field>
                </div>
                <AccordionUI sections={sections} animate={inView} />
            </div>
        </section>
    );
}

export default HowWeWork;