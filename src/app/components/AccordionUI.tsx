'use client'
import React, {useEffect, useRef, useState} from 'react';
import styles from './AccordionUI.module.css';

interface AccordionSection {
    title: string;
    content: string;
}

interface AccordionProps {
    sections: AccordionSection[];
    animate: boolean;
}

const AccordionUI: React.FC<AccordionProps> = ({ sections, animate }) => {
    const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
    const contentRefs = useRef<Array<HTMLDivElement | null>>([]);

    const handleToggle = (index: number) => {
        setExpandedIndices((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    // Обновляем высоту контента при изменении состояния или размера экрана
    useEffect(() => {
        const updateHeights = () => {
            contentRefs.current.forEach((ref, i) => {
                if (ref && expandedIndices.includes(i)) {
                    ref.style.maxHeight = `${ref.scrollHeight}px`;
                }
            });
        };

        updateHeights();
        window.addEventListener('resize', updateHeights);

        return () => window.removeEventListener('resize', updateHeights);
    }, [expandedIndices, sections]);

    return (
        <div className={styles.accordion}>
            {sections.map((section, index) => {
                const isExpanded = expandedIndices.includes(index);

                return (
                    <div
                        key={index}
                        className={`${styles.section} ${animate ? styles.animate : ''}`}
                        style={{
                            opacity: animate ? 1 : 0,
                            transform: animate ? 'translateY(0)' : 'translateY(30px)',
                            transition: `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`
                        }}
                    >
                        <div className={styles.block} onClick={() => handleToggle(index)}>
                            <div className={styles.title}>
                                {section.title}
                                <span className={`${styles.arrow} ${isExpanded ? styles.expanded : ''}`}></span>
                            </div>
                            <div
                                ref={el => {
                                    contentRefs.current[index] = el;
                                }}
                                className={`${styles.contentWrapper} ${isExpanded ? styles.expanded : ''}`}
                                style={{
                                    maxHeight: isExpanded
                                        ? `${contentRefs.current[index]?.scrollHeight || 0}px`
                                        : '0'
                                }}
                            >
                                <p className={styles.content}>{section.content}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AccordionUI;