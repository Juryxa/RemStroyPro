'use client';

import {useEffect, useRef, useState} from 'react';
import {useInView} from 'react-intersection-observer';
import styles from './Services.module.css';
import ServiceButton from '@/app/components/ServiceButton';
import BuildingTypeButton from '@/app/components/BuildingTypeButton';
import Image from 'next/image';
import Field from '@/app/components/Field';
import Completed from "@/app/components/Completed";
import ServicesModal from "@/app/components/ServicesModal";

export default function Services() {
    const [activeTab, setActiveTab] = useState<'repair' | 'construction'>('repair');
    const [buildingType, setBuildingType] = useState<'new' | 'secondary'>('new');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [bg1Index, setBg1Index] = useState(0);
    const [bg2Index, setBg2Index] = useState(0);
    const [activeBg, setActiveBg] = useState('bg1');
    const {ref, inView} = useInView({triggerOnce: false, threshold: 0.3});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedServiceType, setSelectedServiceType] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    // Refs для отслеживания позиций касания
    const touchStartRef = useRef({x: 0, y: 0});
    const touchEndRef = useRef({x: 0, y: 0});

    // Определение мобильных устройств
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const openModal = (type: string) => {
        setSelectedServiceType(type);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleFormSubmit = (data: { name: string; phone: string }) => {
        closeModal();
    };

    // Данные карточек
    const repairCards = [
        {
            title: 'Ремонт под ключ',
            description: 'Комплексный подход, при котором мы берём на себя всё — от демонтажа до финальной уборки. Вы получаете готовый результат без лишних хлопот, по заранее согласованному проекту и срокам.',
            price: 8990
        },
        {
            title: 'Капитальный ремонт',
            description: 'Включает замену инженерных коммуникаций, выравнивание стен, полов и потолков, перепланировку и другие серьёзные работы. Подходит для старых квартир или под полную переделку.',
            price: 7490
        },
        {
            title: 'Дизайнерский ремонт',
            description: 'Выполняется по индивидуальному проекту с подбором материалов, мебели и декора. Идеальный вариант, если вы хотите создать уникальный, эстетичный и функциональный интерьер',
            price: 10990
        },
        {
            title: 'Евроремонт',
            description: 'Современный и практичный стиль отделки с использованием качественных материалов. Включает выравнивание поверхностей, разводку электрики, монтаж потолков и стильную отделку.',
            price: 9990
        },
        {
            title: 'Косметический ремонт',
            description: 'Это быстрый и доступный способ обновить интерьер без масштабных работ. Включает покраску стен, поклейку обоев, замену напольных покрытий и другие детали для свежего вида.',
            price: 3000
        },
    ];

    const constructionCards = [
        {
            title: 'Строительство домов',
            description: 'Ведётся по современным технологиям с учётом ваших пожеланий и требований. Отличный выбор для тех, кто хочет тёплый, надёжный и долговечный дом под ключ.',
            price: 12990
        },
        {
            title: 'Строительство коттеджей',
            description: 'Проектируем и строим комфортные коттеджи для круглогодичного проживания. Идеально, если вы мечтаете о загородной жизни с городским уровнем удобства.',
            price: 9990
        },
        {
            title: 'Строительство складских помещений',
            description: 'Создаём практичные и прочные склады с учётом специфики хранения. Подходит для бизнеса, где важны надёжность, функциональность и оптимальные сроки.',
            price: 11990
        },
        {
            title: 'Установка заборов',
            description: '—Профнастил от 14990 ₽/п.м\n' +
                '                —Сетка-рабица от 490₽/п.м\n' +
                '                —3D-секции от 1290₽/п.м\n' +
                '                —Деревянный / евроштакетник от 1390₽/п.м\n' + '\n' + 'Монтаж заборов любых типов: от профнастила до кирпича. Подчеркнёт границы участка и обеспечит безопасность — с учётом вашего стиля и бюджета.',
            price: 'Сетка-рабица от 490₽/п.м'

        },
        {
            title: 'Сварочные работы',
            description: '—По шву/стыку (трубы, ограждения) от 150\n' +
                'от 600  ₽/п.м\n' + '\n' + 'Профессиональная сварка конструкций любой сложности. Незаменимо, если нужно прочное и точное решение для дома, дачи или бизнеса.',
            price: 'По шву/стыку (трубы, ограждения) от 150\n' +
                'до 600  ₽/п.м'
        },
        {
            title: 'Строительство ангаров',
            description: 'Возводим ангары для хранения, производства или техники. Рациональное решение, если вам нужны большие площади и быстрая реализация проекта.',
            price: 7990
        },
    ];

    const cards = activeTab === 'repair' ? repairCards : constructionCards;

    // Фоновые изображения
    const repairImages = ['/repair/1.jpg', '/repair/2.jpg', '/repair/3.jpg', '/repair/4.jpg', '/repair/5.jpg'];
    const constructionImages = ['/construction/3.jpg', '/construction/3.jpg', '/construction/1.jpg', '/construction/5.jpg', '/construction/4.jpg', '/construction/2.jpg'];
    const backgroundImages = activeTab === 'repair' ? repairImages : constructionImages;

    const changeBackground = () => {
        const nextIndex = currentSlide % backgroundImages.length;
        if (activeBg === 'bg1') {
            setBg2Index(nextIndex);
            setActiveBg('bg2');
        } else {
            setBg1Index(nextIndex);
            setActiveBg('bg1');
        }
    };

    // Сброс фона при смене вкладки
    useEffect(() => {
        setCurrentSlide(0);
        setBg1Index(0);
        setBg2Index(0);
        setActiveBg('bg1');
    }, [activeTab]);

    const [hasAnimatedOnce, setHasAnimatedOnce] = useState(false);

    useEffect(() => {
        if (!hasAnimatedOnce) {
            triggerAnimation('left');
            setHasAnimatedOnce(true);
        }
    }, [hasAnimatedOnce]);


    const nextSlide = () => {
        triggerAnimation('left', () => {
            setCurrentSlide(prev => (prev + 1) % cards.length);
        });
    };

    const prevSlide = () => {
        triggerAnimation('right', () => {
            setCurrentSlide(prev => (prev - 1 + cards.length) % cards.length);
        });
    };


    const triggerAnimation = (direction: 'left' | 'right', callback?: () => void) => {
        setAnimationClass('');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setAnimationClass(direction === 'left' ? styles.slideLeft : styles.slideRight);

                // Задержка, чтобы дать времени на проигрывание анимации
                setTimeout(() => {
                    callback?.();
                }, 10); // 👈 Этого достаточно (анимация начнёт проигрываться, и потом обновим слайд)
            });
        });
    };


    const handleCardClick = (index: number) => {
        const slideIndex = (index - currentSlide + cards.length) % cards.length;

        if (slideIndex === 1) nextSlide();
        else if (slideIndex === cards.length - 1) prevSlide();
        else setCurrentSlide(index);
    };

    // Изменение фона при смене слайда
    useEffect(() => {
        changeBackground();
    }, [currentSlide]);

    // Обработчики для свайпов
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };

    const [animationClass, setAnimationClass] = useState('');
    const handleTouchEnd = () => {
        // Рассчитываем разницу перемещения
        const diffX = touchEndRef.current.x - touchStartRef.current.x;
        const diffY = touchEndRef.current.y - touchStartRef.current.y;

        // Проверяем, что движение в основном горизонтальное
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                triggerAnimation('right');
                prevSlide();
            } else {
                triggerAnimation('left');
                nextSlide();
            }
        }
    };

    // Округление цены для вторички
    const getPrice = (price: number | string, title: string) => {
        if (typeof price === 'string') {
            // Extract all prices and find the smallest one
            const prices = price.match(/\d+/g) || [];
            const numericPrices = prices.map(p => parseInt(p)).filter(p => !isNaN(p));

            if (numericPrices.length > 0) {
                const minPrice = Math.min(...numericPrices);

                // For specific cards, show only the minimum price
                if (title.includes('заборов') || title.includes('Сварочные')) {
                    return `${minPrice.toLocaleString('ru-RU')} ₽`;
                }
            }
            return price;
        }

        let finalPrice = price;
        if (buildingType === 'secondary' && activeTab === 'repair') {
            finalPrice = Math.round(price * 1.15 / 10) * 10;
        }

        return `${finalPrice.toLocaleString('ru-RU')} ₽/м²`;
    };

    const getImagePath = (path: string) => {
        try {
            return path;
        } catch (e) {
            return '/fallback.jpg';
        }
    };

    return (
        <section className={styles.services}>
            <div
                className={`${styles.background} ${activeBg === 'bg1' ? styles.active : styles.inactive}`}
                style={{backgroundImage: `url(${getImagePath(backgroundImages[bg1Index])})`}}
            />
            <div
                className={`${styles.background} ${activeBg === 'bg2' ? styles.active : styles.inactive}`}
                style={{backgroundImage: `url(${getImagePath(backgroundImages[bg2Index])})`}}
            />

            <div className={styles.options}>
                <h2 className={styles.title}>Услуги</h2>
                <ServiceButton setActiveTab={setActiveTab}/>

                <div style={{minHeight: '60px'}}>
                    {activeTab === 'repair' && (
                        <BuildingTypeButton setBuildingType={setBuildingType}/>
                    )}
                </div>

                <p className={styles.text}>
                    Прозрачная стоимость от 3 000 ₽ за м², все этапы под контролем опытной команды. Всегда на связи,
                    покажем реальные примеры до начала работ.
                </p>
            </div>

            <div className={`${styles.carouselContainer} ${inView ? styles.animate : ''}`} ref={ref}>
                {!isMobile && (
                    <>
                        <Image src={getImagePath(`/stones/stone1.png`)} alt="Stone" width={161} height={129}
                               loading="lazy"
                               className={styles.stone1}/>
                        <Image src={getImagePath(`/stones/stone2.png`)} alt="Stone" width={173} height={152}
                               loading="lazy"
                               className={styles.stone2}/>
                        <Image src={getImagePath(`/stones/stone3.png`)} alt="Stone" width={300} height={450}
                               loading="lazy"
                               className={styles.stone3}/>
                    </>
                )}

                {!isMobile && (
                    <div className={styles.carousel}>
                        {cards.map((card, index) => {
                            const slideIndex = (index - currentSlide + cards.length) % cards.length;
                            const isCenter = slideIndex === 0;
                            const isLeftAdjacent = slideIndex === cards.length - 1;
                            const isRightAdjacent = slideIndex === 1;
                            const isAdjacent = isLeftAdjacent || isRightAdjacent;

                            return (
                                <div
                                    key={index}
                                    className={`${styles.card} ${activeTab === 'construction' ? styles.constructionCard : ''} ${isCenter ? styles.centerCard : isAdjacent ? styles.adjacentCard : styles.hiddenCard} ${isLeftAdjacent ? styles.leftAdjacent : ''} ${isRightAdjacent ? styles.rightAdjacent : ''}`}
                                    onClick={() => handleCardClick(index)}
                                >
                                    <div className={styles.cardContent}
                                         style={typeof card.price === "string" ? {overflowY: 'auto'} : {}}>
                                        <div className={styles.titlePrice}>
                                            <h3>{card.title}</h3>
                                            <Field
                                                className={typeof card.price === "string" ? 'transparentOrangePrice' : 'transparentOrangePrice'}>
                                                {getPrice(card.price, card.title)}
                                            </Field>
                                        </div>
                                        <p className={styles.description}>{card.description}</p>
                                        <button className={styles.orderButton}
                                                onClick={() => openModal(card.title)}>
                                            Заказать
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        <button className={styles.prevButton} onClick={prevSlide}>
                            ←
                        </button>
                        <button className={styles.nextButton} onClick={nextSlide}>
                            →
                        </button>
                    </div>
                )}

                {isMobile && (
                    <div className={styles.mobileCarousel}>
                        <button className={styles.mobileArrow} onClick={prevSlide}>
                            ←
                        </button>

                        <div
                            className={styles.mobileCardWrapper}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div
                                className={`${styles.card} ${styles.mobileActive} ${animationClass}`}
                                onAnimationEnd={() => setAnimationClass('')}
                                style={{width: '85%'}}
                            >
                                <div className={styles.cardContent}
                                     style={typeof cards[currentSlide].price === "string" ? {overflowY: 'auto'} : {}}>
                                    <div className={styles.titlePrice}>
                                        <h3>{cards[currentSlide].title}</h3>
                                        <Field
                                            className={typeof cards[currentSlide].price === "string" ? 'transparentOrangePrice' : 'transparentOrangePrice'}>
                                            {getPrice(cards[currentSlide].price, cards[currentSlide].title)}
                                        </Field>
                                    </div>
                                    <p className={styles.description}>{cards[currentSlide].description}</p>
                                    <button className={styles.orderButton}
                                            onClick={() => openModal(cards[currentSlide].title)}>
                                        Заказать
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button className={styles.mobileArrow} onClick={nextSlide}>
                            →
                        </button>
                    </div>
                )}
            </div>

            <Completed/>
            <ServicesModal
                isOpen={modalIsOpen}
                onClose={closeModal}
                serviceCategory={activeTab}
                serviceType={selectedServiceType}
                onSubmit={handleFormSubmit}
            />
        </section>
    );
}