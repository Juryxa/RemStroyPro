// ServiceButton.tsx
'use client';

import {useState} from 'react';
import styles from './ServiceButton.module.css';
import {Roboto_Flex} from 'next/font/google';

const robotoFlex = Roboto_Flex({
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
});

function ServiceButton({ setActiveTab }: { setActiveTab: (tab: 'repair' | 'construction') => void }) {
    const [activeTab, setLocalActiveTab] = useState<'repair' | 'construction'>('repair');

    const handleTabChange = (tab: 'repair' | 'construction') => {
        setLocalActiveTab(tab);
        setActiveTab(tab);
    };

    return (
        <div className={`${styles.container} ${robotoFlex.className}`}>
            <div className={`${styles.slider} ${activeTab === 'construction' ? styles.right : ''}`}></div>
            <button className={styles.button} onClick={() => handleTabChange('repair')}>
                Ремонт квартир
            </button>
            <button className={styles.button} onClick={() => handleTabChange('construction')}>
                Строительство
            </button>
        </div>
    );
}

export default ServiceButton;