'use client';
import {useLayoutEffect, useState} from 'react';
import styles from './ScrollProgressBar.module.css';

const ScrollProgressBar = () => {
    const [scrollPercent, setScrollPercent] = useState(0);

    useLayoutEffect(() => {
        // ищем контейнер с прокруткой, обычно #__next
        const scrollContainer = document.getElementById('__next');
        if (!scrollContainer) return;

        const updateScroll = () => {
            const scrollTop = scrollContainer.scrollTop;
            const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
            if (scrollHeight > 0) {
                const scrolled = (scrollTop / scrollHeight) * 100;
                setScrollPercent(scrolled);
            }
        };

        scrollContainer.addEventListener('scroll', updateScroll);

        // сразу вызовем, чтобы прогресс был корректен
        updateScroll();

        return () => scrollContainer.removeEventListener('scroll', updateScroll);
    }, []);

    return (
        <div className={styles.progressContainer}>
            <div className={styles.progressBar} style={{ width: `${scrollPercent}%` }} />
        </div>
    );
};

export default ScrollProgressBar;
