'use client';

import {useEffect, useRef, useState} from 'react';
import styles from './Completed.module.css';
import Image from 'next/image';
import ImageModal from './ImageModal';

type MediaFile = {
    type: 'image' | 'video';
    src: string;
};

interface CompletedProps {
    files: MediaFile[];
}

export default function Completed({ files }: CompletedProps) {
    const [modalImage, setModalImage] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const positionRef = useRef(0);
    const animationRef = useRef<number>(0);
    const contentWidthRef = useRef(0);
    const speed = 1.5;

    // drag refs
    const isDraggingRef = useRef(false);
    const dragStartX = useRef(0);
    const dragStartPos = useRef(0);
    const velocityRef = useRef(0);
    const lastX = useRef(0);
    const lastTime = useRef(0);
    const inertiaRef = useRef(false);
    const movedRef = useRef(false); // <--- новое: следим, двигался ли пользователь

    // === корректировка позиции ===
    const correctPosition = () => {
        const contentWidth = contentWidthRef.current;
        if (!contentWidth) return;
        if (positionRef.current <= -contentWidth) {
            positionRef.current += contentWidth;
        }
        if (positionRef.current >= 0) {
            positionRef.current -= contentWidth;
        }
    };

    // === авто-анимация ===
    const animate = () => {
        if (!innerRef.current || !contentWidthRef.current) {
            animationRef.current = requestAnimationFrame(animate);
            return;
        }

        if (!isDraggingRef.current && !inertiaRef.current) {
            positionRef.current -= speed;
            correctPosition();
            innerRef.current.style.transform = `translateX(${positionRef.current}px)`;
        }

        animationRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (!contentRef.current) return;

        const content = contentRef.current;
        contentWidthRef.current = content.offsetWidth;

        if (innerRef.current && content) {
            const clone = content.cloneNode(true);
            innerRef.current.appendChild(clone);
        }

        animationRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationRef.current);
    }, []);

    // === drag start ===
    const startDrag = (clientX: number) => {
        isDraggingRef.current = true;
        dragStartX.current = clientX;
        dragStartPos.current = positionRef.current;
        lastX.current = clientX;
        lastTime.current = Date.now();
        velocityRef.current = 0;
        inertiaRef.current = false;
        movedRef.current = false; // сброс флага
    };

    // === drag move ===
    const moveDrag = (clientX: number) => {
        if (!isDraggingRef.current || !innerRef.current) return;

        const delta = clientX - dragStartX.current;
        if (Math.abs(delta) > 5) movedRef.current = true; // >5px считаем движением

        positionRef.current = dragStartPos.current + delta;
        correctPosition();
        innerRef.current.style.transform = `translateX(${positionRef.current}px)`;

        const now = Date.now();
        const dt = now - lastTime.current;
        if (dt > 0) {
            velocityRef.current =
                0.8 * velocityRef.current + 0.2 * ((clientX - lastX.current) / dt);
        }
        lastX.current = clientX;
        lastTime.current = now;
    };

    // === drag end (с инерцией) ===
    const endDrag = () => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;

        if (Math.abs(velocityRef.current) > 0.05) {
            inertiaRef.current = true;
            const inertia = () => {
                if (!innerRef.current) return;
                positionRef.current += velocityRef.current * 16;
                correctPosition();
                innerRef.current.style.transform = `translateX(${positionRef.current}px)`;
                velocityRef.current *= 0.95;

                if (Math.abs(velocityRef.current) > 0.01) {
                    requestAnimationFrame(inertia);
                } else {
                    inertiaRef.current = false;
                }
            };
            inertia();
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        startDrag(e.clientX);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => moveDrag(e.clientX);

    const handleMouseUp = () => {
        endDrag();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length !== 1) return;
        startDrag(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length !== 1) return;
        moveDrag(e.touches[0].clientX);
    };

    const handleTouchEnd = () => endDrag();

    // === клик по медиа ===
    const handleClick = (file: MediaFile) => {
        if (movedRef.current) return; // если был drag — игнорим клик
        if (file.type === 'image') {
            setModalImage(file.src);
        } else if (file.type === 'video') {
            window.open(file.src, '_blank');
        }
    };

    return (
        <div
            className={styles.completed}
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className={styles.marqueeContainer} ref={innerRef}>
                <div ref={contentRef} className={styles.marqueeContent}>
                    {files.map((file, index) => (
                        <div
                            key={`${index}-${file.src}`}
                            className={styles.card}
                            onClick={() => handleClick(file)}
                        >
                            {file.type === 'image' ? (
                                <Image
                                    src={file.src}
                                    alt={`Media ${index + 1}`}
                                    width={330}
                                    height={200}
                                    quality={100}
                                    className={styles.image}
                                />
                            ) : (
                                <div className={styles.videoWrapper}>
                                    <video
                                        src={file.src}
                                        width={330}
                                        height={200}
                                        muted
                                        playsInline
                                        preload="metadata"
                                        className={styles.video}
                                    />
                                    <div className={styles.playIcon}>▶</div>
                                </div>
                            )}
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
