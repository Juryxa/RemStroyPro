// BuildingTypeButton.tsx
'use client';

import {useState} from 'react';
import styles from './BuildingTypeButton.module.css';
import {Roboto_Flex} from 'next/font/google';

const robotoFlex = Roboto_Flex({
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
});

function BuildingTypeButton({ setBuildingType }: { setBuildingType: (type: 'new' | 'secondary') => void }) {
    const [activeTab, setLocalActiveTab] = useState<'new' | 'secondary'>('new');

    const handleTabChange = (tab: 'new' | 'secondary') => {
        setLocalActiveTab(tab);
        setBuildingType(tab);
    };

    return (
        <div className={`${styles.container} ${robotoFlex.className}`}>
            <div className={`${styles.slider} ${activeTab === 'secondary' ? styles.right : ''}`}></div>
            <button className={`${styles.button} ${activeTab === 'new' ? styles.right : ''} ${robotoFlex.className}`} onClick={() => handleTabChange('new')}>
                Новостройка
            </button>
            <button className={`${styles.button} ${activeTab === 'secondary' ? styles.right : ''} ${robotoFlex.className}`} onClick={() => handleTabChange('secondary')}>
                Вторичка
            </button>
        </div>
    );
}

export default BuildingTypeButton;