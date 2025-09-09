'use client';

import {useEffect, useRef, useState} from 'react';
import styles from './Completed.module.css';
import Image from 'next/image';
import ImageModal from './ImageModal'; // путь может быть другим, укажи свой


const mediaFiles = [
    '/works/1.webp',
    '/works/2.webp',
    '/works/3.webp',
    '/works/4.webp',
    '/works/5.webp',
    '/works/6.webp',
    '/works/7.webp',
    '/works/8.webp',
    '/works/9.webp',
    '/works/10.webp',
    '/works/11.webp',
    '/works/12.webp',
    '/works/13.webp',
    '/works/14.webp',
    '/works/15.webp',
];

export default function Completed() {
    const [isPlaying, setIsPlaying] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>(0);
    const positionRef = useRef(0);
    const speed = 1.5; // Увеличена скорость
    const contentRef = useRef<HTMLDivElement>(null);
    const isPlayingRef = useRef(isPlaying);

    // Refs для управления перетаскиванием
    const isDraggingRef = useRef(false);
    const dragStartX = useRef(0);
    const dragStartPosition = useRef(0);
    const lastX = useRef(0);
    const lastTime = useRef(0);
    const velocityRef = useRef(0);
    const isDragRef = useRef(false);
    const inertiaRef = useRef(false);
    const clickAllowedRef = useRef(true);
    const lastFrameTimeRef = useRef<number | null>(null);
    const contentWidthRef = useRef(0); // Для хранения ширины контента

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            const shouldPlay = document.visibilityState === 'visible';
            setIsPlaying(shouldPlay);
            isPlayingRef.current = shouldPlay;

            // Сбрасываем время последнего кадра при смене вкладки
            lastFrameTimeRef.current = null;

            // Возобновляем анимацию при возврате
            if (shouldPlay && !isDraggingRef.current && !inertiaRef.current) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    // Корректировка позиции для бесшовной анимации
    const correctPosition = () => {
        const contentWidth = contentWidthRef.current;
        if (contentWidth === 0) return;

        let newPosition = positionRef.current;

        // Плавная коррекция без скачков
        while (newPosition <= -contentWidth) {
            newPosition += contentWidth;
        }
        while (newPosition > 0) {
            newPosition -= contentWidth;
        }

        // Плавное обновление позиции
        if (Math.abs(newPosition - positionRef.current) > contentWidth / 2) {
            positionRef.current = newPosition;
            if (innerRef.current) {
                innerRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
            }
        } else {
            positionRef.current = newPosition;
        }
    };

    // Основная функция анимации с учетом времени
    const animate = (timestamp: number) => {
        if (!lastFrameTimeRef.current) {
            lastFrameTimeRef.current = timestamp;
        }

        const deltaTime = Math.min(timestamp - lastFrameTimeRef.current, 100); // Ограничиваем deltaTime
        lastFrameTimeRef.current = timestamp;

        if (!isPlayingRef.current || isDraggingRef.current || inertiaRef.current) {
            animationRef.current = requestAnimationFrame(animate);
            return;
        }

        // Учитываем время для плавной анимации
        positionRef.current -= speed * (deltaTime / 16);
        correctPosition();

        if (innerRef.current) {
            innerRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
        }
        animationRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (!containerRef.current || !innerRef.current || !contentRef.current) return;

        const inner = innerRef.current;
        const content = contentRef.current;

        const clone = content.cloneNode(true) as HTMLDivElement;
        inner.appendChild(clone);

        // Функция для обновления ширины контента
        const updateContentWidth = () => {
            if (contentRef.current) {
                contentWidthRef.current = contentRef.current.offsetWidth;
            }
        };

        // Инициализация позиции после отрисовки контента
        const initPosition = () => {
            updateContentWidth();
            const contentWidth = contentWidthRef.current;

            if (contentWidth > 0) {
                // Плавная установка начальной позиции
                positionRef.current = -contentWidth / 2;
                correctPosition();

                if (innerRef.current) {
                    innerRef.current.style.transition = 'transform 0.5s ease-out';
                    innerRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;

                    // Убираем переход после завершения
                    setTimeout(() => {
                        if (innerRef.current) {
                            innerRef.current.style.transition = '';
                        }
                    }, 500);
                }
                return true;
            }
            return false;
        };

        // Запуск основной анимации
        const startAnimation = () => {
            if (initPosition()) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                // Повторяем попытку, если контент еще не загружен
                setTimeout(startAnimation, 50);
            }
        };

        startAnimation();

        // Обновляем ширину при изменении размера окна
        const resizeObserver = new ResizeObserver(updateContentWidth);
        resizeObserver.observe(content);

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationRef.current);
            if (clone.parentNode === inner) {
                inner.removeChild(clone);
            }
        };
    }, []);

    // Обработчики событий мыши
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        startDrag(e.clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current) return;
        moveDrag(e.clientX);
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (isDraggingRef.current) {
            endDrag();
        }
    };

    // Обработчики событий касания
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length !== 1) return;
        startDrag(e.touches[0].clientX);
        e.preventDefault();
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDraggingRef.current || e.touches.length !== 1) return;
        moveDrag(e.touches[0].clientX);
        e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
        if (isDraggingRef.current) {
            endDrag();
        }
    };

    // Начало перетаскивания
    const startDrag = (clientX: number) => {
        if (!innerRef.current) return;

        // Сбрасываем время анимации
        lastFrameTimeRef.current = null;

        cancelAnimationFrame(animationRef.current);
        isDraggingRef.current = true;
        isDragRef.current = false;
        clickAllowedRef.current = true;
        dragStartX.current = clientX;
        dragStartPosition.current = positionRef.current;
        lastX.current = clientX;
        lastTime.current = Date.now();
        velocityRef.current = 0;
        inertiaRef.current = false;

        if (innerRef.current) {
            innerRef.current.style.transition = 'none';
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove as any, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
    };

    // Перемещение при перетаскивании
    const moveDrag = (clientX: number) => {
        if (!innerRef.current) return;

        const currentX = clientX;
        const deltaX = currentX - dragStartX.current;

        positionRef.current = dragStartPosition.current + deltaX;
        innerRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;

        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime.current;

        if (deltaTime > 0) {
            velocityRef.current = 0.7 * velocityRef.current + 0.3 * (currentX - lastX.current) / deltaTime;
        }

        lastX.current = currentX;
        lastTime.current = currentTime;

        if (Math.abs(deltaX) > 5) {
            isDragRef.current = true;
            clickAllowedRef.current = false;
        }
    };

    // Завершение перетаскивания с инерцией
    const endDrag = () => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove as any);
        document.removeEventListener('touchend', handleTouchEnd);

        if (Math.abs(velocityRef.current) > 0.05) {
            startInertia();
        } else {
            // Плавное возобновление анимации
            setTimeout(() => {
                isPlayingRef.current = true;
                setIsPlaying(true);
                animationRef.current = requestAnimationFrame(animate);
            }, 50);
        }
    };

    // Анимация инерции
    const startInertia = () => {
        cancelAnimationFrame(animationRef.current);
        inertiaRef.current = true;

        const inertiaAnimate = (timestamp: number) => {
            if (!lastFrameTimeRef.current) {
                lastFrameTimeRef.current = timestamp;
            }

            const deltaTime = Math.min(timestamp - lastFrameTimeRef.current, 100);
            lastFrameTimeRef.current = timestamp;

            if (Math.abs(velocityRef.current) < 0.01) {
                inertiaRef.current = false;
                isPlayingRef.current = true;
                setIsPlaying(true);
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            positionRef.current += velocityRef.current * deltaTime;
            velocityRef.current *= 0.96; // Более плавное замедление

            correctPosition();

            if (innerRef.current) {
                innerRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
            }

            animationRef.current = requestAnimationFrame(inertiaAnimate);
        };

        animationRef.current = requestAnimationFrame(inertiaAnimate);
    };

    const [modalImage, setModalImage] = useState<string | null>(null);
    const openModalImage = (src: string) => {
        if (!clickAllowedRef.current) return;
        setModalImage(src);
    };


    return (
        <div
            className={styles.completed}
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            <div className={styles.marqueeContainer} ref={innerRef}>
                <div ref={contentRef} className={styles.marqueeContent}>
                    {mediaFiles.map((src, index) => (
                        <div
                            key={`${index}-${src}`}
                            className={styles.imageContainer}
                            onClick={() => openModalImage(src)}
                        >
                            <Image
                                src={src}
                                alt={`Work ${index + 1}`}
                                width={330}
                                height={200}
                                quality={100}
                                className={styles.image}
                                loading="eager"
                                onLoad={() => {
                                    if (contentRef.current) {
                                        contentWidthRef.current = contentRef.current.offsetWidth;
                                        correctPosition();
                                    }
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {modalImage && (
                <ImageModal
                    isOpen={true}
                    src={modalImage}
                    onClose={() => setModalImage(null)}
                />
            )}
        </div>
    );
}