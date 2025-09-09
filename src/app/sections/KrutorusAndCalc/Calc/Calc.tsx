'use client';
import {useCallback, useEffect, useState, useRef} from 'react';
import styles from './Calc.module.css';
import Image from "next/image";
import tg from 'public/tg.svg'
import mail from 'public/mail.svg'
import phoneIcon from 'public/phone-icon.svg'
import Link from "next/link";
import {createPortal} from "react-dom";
import arrowSig from 'public/arrowZig.png'
import Head from "next/head";
import stone from 'public/stones/stone1.png'
import ModalService from "@/app/api/ModalPost";

// Типы и данные для ремонта
interface RepairCard {
    title: string;
    titleFor: string;
    price: number;
}

const repairCards: RepairCard[] = [
    {
        title: 'Косметический',
        titleFor: 'Косметического',
        price: 3000
    },
    {
        title: 'Капитальный',
        titleFor: 'Капитального',
        price: 7490
    },
    {
        title: 'Евро-ремонт',
        titleFor: 'Евро-ремонта',
        price: 9990
    },
    {
        title: 'Под ключ',
        titleFor: 'Под ключ',
        price: 8990
    },
    {
        title: 'Дизайнерский',
        titleFor: 'Дизайнерского',
        price: 10990
    },
];

// Типы и данные для строительства
interface ConstructionCard {
    title: string;
    price: string | number;
}

const constructionCards: ConstructionCard[] = [
    {
        title: 'Строительство домов',
        price: 12990
    },
    {
        title: 'Строительство коттеджей',
        price: 9990
    },
    {
        title: 'Строительство складских помещений',
        price: 11990
    },
    {
        title: 'Установка заборов',
        price: 490
    },
    {
        title: 'Сварочные работы',
        price: 150
    },
    {
        title: 'Строительство ангаров',
        price: 7990
    },
];

export default function Calc() {
    // Состояния для шагов калькулятора
    const [step, setStep] = useState<number>(0);
    const [serviceType, setServiceType] = useState<'repair' | 'building' | null>(null);
    const [propertyType, setPropertyType] = useState<'new' | 'old' | null>(null);
    const [area, setArea] = useState<number | null>(null);
    const [areaCustom, setAreaCustom] = useState<number>(150);
    const [repairType, setRepairType] = useState<string | null>(null);
    const [repairTypeFor, setRepairTypeFor] = useState<string | null>(null);
    const [constructionType, setConstructionType] = useState<string | null>(null);
    const [location, setLocation] = useState<'moscow' | 'moscow_region' | null>(null); // Новое состояние для местоположения

    // Состояния для модалки
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');

    // Извлечение минимальной цены из строки
    const extractMinPrice = (price: string | number): number => {
        if (typeof price === 'number') {
            return price;
        }

        // Ищем все числа в строке
        const numbers = price.match(/\d+/g)?.map(Number) || [];
        if (numbers.length === 0) return 0;

        // Находим минимальное число
        return Math.min(...numbers);
    };

    // Расчет цены для ремонта
    const calculateRepairPrice = useCallback(() => {
        if (!repairType || area === null) return 0;

        const repairCard = repairCards.find(card => card.title === repairType);
        if (!repairCard) return 0;

        let price = repairCard.price * area * 0.85; // -15% для расчета
        if (propertyType === 'old') {
            price *= 1.15; // Увеличение на 15% для вторички
        }

        return Math.round(price);
    }, [repairType, area, propertyType]);

    // Расчет цены для строительства
    const calculateBuildingPrice = useCallback(() => {
        if (!constructionType || area === null) return 0;

        const constructionCard = constructionCards.find(card => card.title === constructionType);
        if (!constructionCard) return 0;

        const minPrice = extractMinPrice(constructionCard.price);
        return Math.round(minPrice * area);
    }, [constructionType, area]);

    // Общая функция расчета цены
    const calculatePrice = useCallback(() => {
        if (serviceType === 'repair') {
            return calculateRepairPrice();
        } else if (serviceType === 'building') {
            return calculateBuildingPrice();
        }
        return 0;
    }, [serviceType, calculateRepairPrice, calculateBuildingPrice]);

    // Форматирование номера телефона
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone) return;

        // Здесь обычно отправка данных на сервер
        console.log({
            name,
            phone,
            serviceType,
            propertyType,
            area,
            repairType,
            constructionType,
            location, // Добавлено местоположение
            price: calculatePrice()
        });

        // Сброс формы
        setName('');
        setPhone('');
    };

    // Обработка клавиши Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (serviceType === 'repair' && step === 4) setStep(3);
                if (serviceType === 'building') {
                    if (step === 4) setStep(3); // Модалка -> выбор вида строительства
                    if (step === 3) setStep(2); // Вид строительства -> площадь
                    if (step === 2) setStep(1); // Площадь -> местоположение
                }
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [step, serviceType]);

    // Форматирование цены
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU').format(price) + ' руб.';
    };

    // Телефон логика
    const [showDropdown, setShowDropdown] = useState(false);
    const iconRef = useRef<HTMLDivElement | null>(null)


    const phoneNumbers = [
        { name: 'Сергей', number: '+7 (999) 981-71-29' },
        { name: 'Алексей', number: '+7 (916) 265-50-90' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (iconRef.current && !iconRef.current.contains(event.target as Node)) {
            setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
        }, []);

    const renderModal = () => {
        const isRepair = serviceType === 'repair';
        const isBuilding = serviceType === 'building';

        return (
            <div className={styles.modalOverlay} onClick={() => {
                if (serviceType === 'repair') setStep(3);
                if (serviceType === 'building') setStep(3);
            }}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <button
                        className={styles.closeButton}
                        onClick={() => {
                            if (serviceType === 'repair') setStep(3);
                            if (serviceType === 'building') setStep(3);
                        }}
                        aria-label="Закрыть"
                    >
                        &times;
                    </button>

                    <h2 className={styles.modalTitle}>Мы уже прикинули итог:</h2>

                    <div className={styles.summary}>
                        {isRepair && (
                            <div className={styles.gray}>
                                <span>Где делаем ремонт?</span>
                                <span
                                    className={styles.textRight}>{propertyType === 'new' ? '– Новостройка' : '– Вторичка'}</span>
                            </div>
                        )}

                        {isBuilding && (
                            <div className={styles.gray}>
                                <span>Место строительства</span>
                                <span className={styles.textRight}>
                                    – {location === 'moscow' ? 'Москва' : 'Московская область'}
                                </span>
                            </div>
                        )}

                        <div className={styles.gray}>
                            <span>Площадь</span>
                            <span className={styles.textRight}>– {area} м²</span>
                        </div>

                        {isRepair && (
                            <div className={styles.gray}>
                                <span>Тип ремонта</span>
                                <span className={styles.textRight}>– {repairType}</span>
                            </div>
                        )}

                        {isBuilding && (
                            <div className={styles.gray}>
                                <span>Вид строительства</span>
                                <span className={styles.textRight}>– {constructionType}</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.priceResult}>
                        {isRepair && `Примерная цена ${repairTypeFor?.toLowerCase()} ремонта для Вас`}
                        {isBuilding && `Примерная цена ${constructionType?.toLowerCase()} для Вас`}
                        <br/>
                        от {formatPrice(calculatePrice())}
                    </div>

                    <h3 className={styles.formTitle}>
                        Мы рассчитаем стоимость точнее! Займёт 15 секунд. Заполните поля ниже
                    </h3>

                    <form onSubmit={handleSubmit} className={styles.modalForm}>
                        <div className={styles.formGroup}>
                            <div className={`${styles.green} ${!phone ? styles.requiredField : ''}`}>
                                <label className={styles.formLabel}>Имя:</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ваше имя"
                                    maxLength={50}
                                    className={styles.editableInput}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <div className={`${styles.green} ${!phone ? styles.requiredField : ''}`}>
                                <label className={styles.formLabel}>Телефон:</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="+7 (___) ___-__-__"
                                    required
                                    className={styles.editableInput}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            onClick={() => {
                                if (serviceType === 'repair') {
                                    // Определяем место для ремонта
                                    const place = propertyType === 'new' ? 'Новостройка' : 'Вторичка';

                                    // Отправляем данные для ремонта
                                    ModalService.caclPost({
                                        place,
                                        square: String(area as number),
                                        type: repairType as string,
                                        name,
                                        phone
                                    });
                                    setStep(5);
                                }
                                if (serviceType === 'building') {
                                    // Отправляем данные для строительства
                                    ModalService.caclPost({
                                            place: location === 'moscow' ? 'Москва' : 'Московская область',
                                            square: String(area as number),
                                            type: constructionType as string,
                                            name,
                                            phone
                                        }
                                    );
                                    setStep(5);
                                }
                            }}
                            disabled={phone.replace(/\D/g, '').length !== 11}
                        >
                            Конкретизировать цену
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    // Функция сброса калькулятора
    const resetCalculator = () => {
        setStep(0);
        setServiceType(null);
        setPropertyType(null);
        setArea(null);
        setRepairType(null);
        setConstructionType(null);
        setLocation(null); // Сброс местоположения
        setName('');
        setPhone('');
    };
    // таймер 2 мин 
    const [timer, setTimer] = useState(120); // 2 минуты
    const [timerExpired, setTimerExpired] = useState(false);


    useEffect(() => {
        if (step === 0 && timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
        if (timer === 0) {
            // Например: скрыть скидку или показать сообщение
            console.log('Время вышло');
        }
    }, [step, timer]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    useEffect(() => {
        if (timer === 0) {
            setTimerExpired(true); // Скрыть таймер и скидку
        }
    }, [timer]);



    return (
        <section className={styles.calcSection}>
            <Head>
                <link
                    rel="preload"
                    href="/krutorusTopBg.webp"
                    as="image"
                    fetchPriority="high"
                />
            </Head>
            <section className={styles.calc}>
                {/* Шаг 0: Выбор типа услуги */}
                {step === 0 && (
                    <div className={styles.stepContent}>
                        <h1 className={styles.title}>Калькулятор</h1>
                        <div className={styles.center}>
                            <p className={styles.description}>Рассчитай стоимость за 3 шага — Выбери тип услуги</p>

                            <div className={styles.buttonGroup}>
                                <button
                                    className={`${styles.propertyButton} ${styles.newBuilding}`}
                                    onClick={() => {
                                        setServiceType('repair');
                                        setStep(1);
                                    }}
                                >
                                    Ремонт
                                </button>
                                <button
                                    className={`${styles.propertyButton} ${styles.secondary}`}
                                    onClick={() => {
                                        setServiceType('building');
                                        setStep(1);
                                    }}
                                >
                                    Стройка
                                </button>
                            </div>

                            {!timerExpired && (
                                <p className={styles.discount}>
                                    <span className={styles.underline}>Скидка</span> <span className={styles.orange}>15%</span> для Вас на первый замер! Получите её <span className={styles.orange}>после</span> расчёта.
                        
                                </p>
                            )}
                            {!timerExpired && (
                                <p className={styles.timer}>
                                    {formatTime(timer)}
                                </p>
                            )}
                        </div>
                        <p className={styles.footer}>Заполните за 30 секунд — без регистрации и звонков</p>
                    </div>
                )}

                {/* Шаг 1: Для ремонта - выбор типа недвижимости */}
                {step === 1 && serviceType === 'repair' && (
                    <div className={styles.stepContent}>
                        <h1 className={styles.title1}>Рассчитай стоимость за 3 шага — Выбери где будем
                            ремонтировать!</h1>
                        <div className={styles.center1}>
                            <div
                                className={styles.backOption}
                                onClick={() => setStep(0)}
                            >
                                <span className={styles.square}></span>
                                <span className={styles.optionText}>Ремонт</span>
                            </div>

                            <div className={styles.buttonGroup}>
                                <button
                                    className={`${styles.propertyButton} ${styles.newBuilding}`}
                                    onClick={() => {
                                        setPropertyType('new');
                                        setStep(2);
                                    }}
                                >
                                    Новостройка
                                </button>
                                <button
                                    className={`${styles.propertyButton} ${styles.secondary}`}
                                    onClick={() => {
                                        setPropertyType('old');
                                        setStep(2);
                                    }}
                                >
                                    Вторичка
                                </button>
                            </div>
                        </div>
                        <p className={styles.footer}>Заполните за 30 секунд — без регистрации и звонков</p>
                    </div>
                )}

                {/* Шаг 1: Для стройки - выбор местоположения */}
                {step === 1 && serviceType === 'building' && (
                    <div className={styles.stepContent}>
                        <h1 className={styles.title1}>Рассчитай стоимость за 3 шага — Выбери место строительства</h1>
                        <div className={styles.center1}>
                            <div
                                className={styles.backOption}
                                onClick={() => setStep(0)}
                            >
                                <span className={styles.square}></span>
                                <span className={styles.optionText}>Стройка</span>
                            </div>

                            <div className={styles.buttonGroup}>
                                <button
                                    className={`${styles.newBuilding} ${location === 'moscow' ? styles.selected : ''}`}
                                    onClick={() => {
                                        setLocation('moscow');
                                        setStep(2);
                                    }}
                                >
                                    Москва
                                </button>
                                <button
                                    className={`${styles.secondary} ${location === 'moscow_region' ? styles.selected : ''}`}
                                    onClick={() => {
                                        setLocation('moscow_region');
                                        setStep(2);
                                    }}
                                >
                                    Московская область
                                </button>
                            </div>
                        </div>
                        <p className={styles.footer}>Заполните за 30 секунд — без регистрации и звонков</p>
                    </div>
                )}

                {/* Шаг 2: Для ремонта - выбор площади */}
                {step === 2 && serviceType === 'repair' && (
                    <div className={styles.stepContent}>
                        <h1 className={styles.title1}>Рассчитай стоимость за 3 шага — Выбери площадь</h1>
                        <div className={styles.center1}>
                            <div className={styles.selectedOptions}>
                                <div
                                    className={styles.backOption}
                                    onClick={() => setStep(0)}
                                >
                                    <span className={styles.square}></span>
                                    <span className={styles.optionText}>Ремонт</span>
                                </div>
                                <div
                                    className={styles.backOption}
                                    onClick={() => setStep(1)}
                                >
                                    <span className={styles.square}></span>
                                    <span className={styles.optionText}>
                                        {propertyType === 'new' ? 'Новостройка' : 'Вторичка'}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.areaSelection}>
                                <h3 className={styles.sectionTitle}>Площадь (м²):</h3>
                                <div className={styles.areaButtons}>
                                    {[30, 50, 70].map((size) => (
                                        <button
                                            key={size}
                                            className={`${styles.areaButton} ${area === size ? styles.selected : ''}`}
                                            onClick={() => {
                                                setArea(size);
                                                setStep(3);
                                            }}
                                        >
                                            от {size}
                                        </button>
                                    ))}
                                    <button
                                        className={`${styles.areaButton} ${area && area >= 100 ? styles.selected : ''}`}
                                        onClick={() => {
                                            setArea(areaCustom);
                                        }}
                                    >
                                        свыше 100
                                    </button>
                                </div>

                                {area && area >= 100 && (
                                    <div className={styles.customArea}>
                                        <input
                                            type="range"
                                            min="100"
                                            max="300"
                                            value={areaCustom}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                setAreaCustom(value);
                                                setArea(value);
                                            }}
                                        />
                                        <div className={styles.areaValue}>
                                            {areaCustom} м²
                                            <button
                                                className={styles.confirmButton}
                                                onClick={() => setStep(3)}
                                            >
                                                Подтвердить
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className={styles.footer}>Заполните за 30 секунд — без регистрации и звонков</p>
                    </div>
                )}

                {/* Шаг 2: Для стройки - выбор площади */}
                {step === 2 && serviceType === 'building' && (
                    <div className={styles.stepContent}>
                        <h1 className={styles.title1}>Рассчитай стоимость за 3 шага — Выбери площадь</h1>
                        <div className={styles.center1}>
                            <div className={styles.selectedOptions}>
                                <div
                                    className={styles.backOption}
                                    onClick={() => setStep(0)}
                                >
                                    <span className={styles.square}></span>
                                    <span className={styles.optionText}>Стройка</span>
                                </div>
                                <div
                                    className={styles.backOption}
                                    onClick={() => setStep(1)}
                                >
                                    <span className={styles.square}></span>
                                    <span className={styles.optionText}>
                                        {location === 'moscow' ? 'Москва' : 'Московская область'}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.areaSelection}>
                                <h3 className={styles.sectionTitle}>Площадь (м²):</h3>
                                <div className={styles.areaButtons}>
                                    {[50, 70].map((size) => (
                                        <button
                                            key={size}
                                            className={`${styles.areaButton} ${area === size ? styles.selected : ''}`}
                                            onClick={() => {
                                                setArea(size);
                                                setStep(3);
                                            }}
                                        >
                                            от {size}
                                        </button>
                                    ))}
                                    <button
                                        className={`${styles.areaButton} ${area && area >= 100 ? styles.selected : ''}`}
                                        onClick={() => {
                                            setArea(areaCustom);
                                        }}
                                    >
                                        свыше 100
                                    </button>
                                </div>

                                {area && area >= 100 && (
                                    <div className={styles.customArea}>
                                        <input
                                            type="range"
                                            min="100"
                                            max="300"
                                            value={areaCustom}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                setAreaCustom(value);
                                                setArea(value);
                                            }}
                                        />
                                        <div className={styles.areaValue}>
                                            {areaCustom} м²
                                            <button
                                                className={styles.confirmButton}
                                                onClick={() => setStep(3)}
                                            >
                                                Подтвердить
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className={styles.footer}>Заполните за 30 секунд — без регистрации и звонков</p>
                    </div>
                )}

                {/* Шаг 3: Для ремонта - выбор типа ремонта */}
                {step === 3 && serviceType === 'repair' && (
                    <div className={styles.stepContent}>
                        <h1 className={styles.title1}>Рассчитай стоимость за 3 шага — Это последний шаг!</h1>
                        <div className={styles.center1}>
                            <div className={styles.selectedOptions}>
                                <div
                                    className={styles.backOption}
                                    onClick={() => setStep(0)}
                                >
                                    <span className={styles.square}></span>
                                    <span className={styles.optionText}>Ремонт</span>
                                </div>
                                <div
                                    className={styles.backOption}
                                    onClick={() => setStep(1)}
                                >
                                    <span className={styles.square}></span>
                                    <span className={styles.optionText}>
                                        {propertyType === 'new' ? 'Новостройка' : 'Вторичка'}
                                    </span>
                                </div>
                                <div
                                    className={styles.backOption}
                                    onClick={() => setStep(2)}
                                >
                                    <span className={styles.square}></span>
                                    <span className={styles.optionText}>{area} м²</span>
                                </div>
                            </div>

                            <div className={styles.repairSelection}>
                                <h3 className={styles.sectionTitle}>Тип ремонта:</h3>
                                <div className={styles.repairOptions}>
                                    {repairCards.map((card) => (
                                        <div
                                            key={card.title}
                                            className={`${styles.repairOption} ${repairType === card.title ? styles.selected : ''}`}
                                            onClick={() => {
                                                setRepairType(card.title);
                                                setRepairTypeFor(card.titleFor);
                                                setStep(4);
                                            }}
                                        >
                                            {card.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className={styles.footer}>Заполните за 30 секунд — без регистрации и звонков</p>
                    </div>
                )}

                {/* Шаг 3: Для стройки - выбор вида строительства */}
                {step === 3 && serviceType === 'building' && (
                    <div className={styles.stepContent}>
                        <h1 className={styles.title1}>Рассчитай стоимость за 3 шага — Это последний шаг!</h1>
                        <div className={styles.center1}>
                            <div className={styles.selectedOptions}>
                                <div
                                    className={styles.backOption}
                                    onClick={() => setStep(0)}
                                >
                                    <span className={styles.square}></span>
                                    <span className={styles.optionText}>Стройка</span>
                                </div>
                                <div
                                    className={styles.backOption}
                                    onClick={() => setStep(1)}
                                >
                                    <span className={styles.square}></span>
                                    <span className={styles.optionText}>
                                        {location === 'moscow' ? 'Москва' : 'Московская область'}
                                    </span>
                                </div>
                                <div
                                    className={styles.backOption}
                                    onClick={() => setStep(2)}
                                >
                                    <span className={styles.square}></span>
                                    <span className={styles.optionText}>{area} м²</span>
                                </div>
                            </div>

                            <div className={styles.repairSelection}>
                                <h3 className={styles.sectionTitle}>Вид строительства:</h3>
                                <div className={styles.repairOptions}>
                                    {constructionCards.map((card) => (
                                        <div
                                            key={card.title}
                                            className={`${styles.repairOption} ${constructionType === card.title ? styles.selected : ''}`}
                                            onClick={() => {
                                                setConstructionType(card.title);
                                                setStep(4);
                                            }}
                                        >
                                            <div className={styles.constructionTitle}>{card.title}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className={styles.footer}>Заполните за 30 секунд — без регистрации и звонков</p>
                    </div>
                )}

                {/* Модалка с результатом */}
                {(step === 4 && serviceType === 'repair') ||
                (step === 4 && serviceType === 'building') ?
                    createPortal(renderModal(), document.body) : null}

                {/* Итоговый шаг */}
                {step === 5 && (
                    <div className={styles.stepContent4}>
                        <h1 className={styles.title1}>Можем сделать это ещё раз!</h1>
                        <div className={styles.center4}>
                            <div className={styles.result}>
                                {serviceType === 'repair'
                                    ? "Готово! Итоговая стоимость вашего ремонта"
                                    : `Готово! Итоговая стоимость вашего строительства в ${location === 'moscow' ? 'Москве' : 'Московской области'}`
                                }
                            </div>
                            <Image
                                src={arrowSig}
                                alt={'arrow'}
                                className={styles.arrow}
                                priority
                            />
                            <div className={`${styles.backOption} ${styles.cursor}`}>
                                Для Вас: ~ {formatPrice(Math.round(calculatePrice() * 0.9))}
                            </div>
                            <button
                                className={styles.submitButton}
                                onClick={resetCalculator}
                                style={{marginTop: '20px'}}
                            >
                                Рассчитать снова
                            </button>
                        </div>
                        <Image
                            width={150}
                            height={100}
                            src={stone}
                            alt="stone"
                            className={`${styles.fallingStone} ${styles.animateStone}`}
                            priority
                        />
                    </div>
                )}
            </section>
            <div className={styles.images}>
                {/* Телефон */}
                <div
                    className={styles.iconWrapper}
                    onClick={() => setShowDropdown(!showDropdown)}
                    ref={iconRef}
                >
                    <Image src={phoneIcon} alt="phone" width={40} height={40} priority/>
                    {showDropdown && (
                        <div className={styles.dropdown}>
                        {phoneNumbers.map((item, i) => (
                            <a
                                key={i}
                                href={`tel:${item.number.replace(/[^0-9+]/g, '')}`}
                                onClick={() => {
                                    if (typeof window !== 'undefined' && typeof window.ym === 'function') {
                                        if (item.name === 'Сергей') {
                                            window.ym(103620695, 'reachGoal', 'phoneS');
                                        } else if (item.name === 'Алексей') {
                                            window.ym(103620695, 'reachGoal', 'phoneAle');
                                        }
                                    }
                                }}
                            >
                                {item.name}: {item.number}
                            </a>
                        ))}
                        </div>
                    )}
                </div>
                <Link href={'https://t.me/remstroyprobot?start=GrayUnderCalc'}
                      className={styles.iconLink}><Image src={tg} alt="telegram" width={40}
                                                         height={40} priority/></Link>
                <Link href={'mailto:remstroiipro@gmail.com'} className={styles.iconLink}><Image src={mail} alt="email" width={40}
                                                                    height={40} priority/></Link>
            </div>
        </section>
    );
}