'use client'
import styles from './Krutorus.module.css'
import Image from "next/image";
import calendar from 'public/calendar.svg'
import house from 'public/house.svg'
import m2 from 'public/m2.svg'
import tg from 'public/tgBlueMain.svg'
import wa from 'public/whatsapp.svg'
import {useState} from "react";
import Link from "next/link";


function Krutorus() {
    const [activeTab, setActiveTab] = useState<'repair' | 'construction'>('repair');
    const [phone, setPhone] = useState('');
    const handleTabChange = (tab: 'repair' | 'construction') => {
        setActiveTab(tab);
    };

    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const limited = cleaned.slice(0, 11);

        let formatted = '';
        if (limited.length > 0) {
            formatted = `+7 (${limited.slice(1, 4)}`;
        }
        if (limited.length > 4) {
            formatted += `) ${limited.slice(4, 7)}`;
        }
        if (limited.length > 7) {
            formatted += `-${limited.slice(7, 9)}`;
        }
        if (limited.length > 9) {
            formatted += `-${limited.slice(9, 11)}`;
        }

        return formatted;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhone(formatted);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    };
    return (
        <section className={styles.krutorus}>
            <h1>Ремонт и строительство<br/> без переплат и скрытых платежей</h1>
            <p className={styles.description}>Мы создаём интерьеры и дома, в которых хочется жить. От идеи до ключа
                —<br/>всё берём на себя</p>
            <div className={styles.achievments}>
                <div className={styles.achievment}>
                    <Image src={house} alt={''}/>
                    <p>c <strong className={styles.strong}>2010</strong> года</p>
                    <p>Создаём уникальные интерьеры для вас</p>
                </div>
                <div className={styles.achievment}>
                    <Image src={m2} alt={''}/>
                    <p><strong className={styles.strong}>40 000+</strong></p>
                    <p>Преображённых квадратных метров жилого пространства</p>
                </div>
                <div className={styles.achievment}>
                    <Image src={calendar} alt={''}/>
                    <p><strong className={styles.strong}>600+</strong></p>
                    <p>В указанный период реализовали множество проектов</p>
                </div>
            </div>
            <div id="discount" className={styles.discountSection}>
                <p className={styles.calculation}>Скидка 15% на расчёт</p>
                <p className={styles.calculationDesc}>Для клиентов с нашего сайта. Заполните заявку ниже и мы обсудим
                    всё в течение 15мин после отправки</p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/*Слайдер*/}
                    <div className={styles.container}>
                        <div className={`${styles.slider} ${activeTab === 'construction' ? styles.right : ''}`}></div>
                        <button className={styles.button} onClick={() => handleTabChange('repair')}>
                            Ремонт квартир
                        </button>
                        <button className={styles.button} onClick={() => handleTabChange('construction')}>
                            Стройка
                        </button>
                    </div>
                    {/*Телефон*/}
                    <div className={styles.phoneInput}>
                        <div className={`${styles.planGray} ${!phone ? styles.planRequiredField : ''}`}>
                            <input
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="Телефон: +7 (999) 999-99-99"
                                required
                                className={styles.planEditableInput}
                                pattern="\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}"
                                inputMode="numeric"
                                onKeyPress={(e) => {
                                    if (!/[0-9\b]/.test(e.key) && e.key !== 'Backspace') {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.planSubmitButton}
                        disabled={phone.replace(/\D/g, '').length !== 11}
                    >
                        Получить скидку 15%
                    </button>

                </form>
            </div>
            <div className={styles.linkBlock}>
                <p>Или задайте вопросы в месcенджере</p>
                <Link href='https://t.me/remstroyprobot?start=BottomMain' className={styles.tgLink}>
                    <Image src={tg} alt="tg" width={30} height={25} className={styles.tgBlue} />
                </Link>
                <Link href='https://wa.me/+79999817129' className={styles.waLink}>
                    <Image src={wa} alt="whatsapp" width={35} height={39} className={styles.wa} />
                </Link>
            </div>
        </section>
    );
}

export default Krutorus;