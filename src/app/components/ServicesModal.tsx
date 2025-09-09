'use client';
import {useEffect, useState} from 'react';
import styles from './ServicesModal.module.css';
import ModalService from "@/app/api/ModalPost";

interface ServicesModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceCategory: 'repair' | 'construction';
    serviceType: string;
    onSubmit: (data: { name: string; phone: string }) => void;
}

export default function ServicesModal({
                                          isOpen,
                                          onClose,
                                          serviceCategory,
                                          serviceType,
                                          onSubmit
                                      }: ServicesModalProps) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const limited = cleaned.slice(0, 11);

        let formatted = '';
        if (limited.length > 0) formatted = `+7 (${limited.slice(1, 4)}`;
        if (limited.length > 4) formatted += `) ${limited.slice(4, 7)}`;
        if (limited.length > 7) formatted += `-${limited.slice(7, 9)}`;
        if (limited.length > 9) formatted += `-${limited.slice(9, 11)}`;

        return formatted;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhone(formatted);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone) return;

        try {
            // Отправляем данные
            await ModalService.servicePost(
                serviceCategory === 'repair' ? 'Ремонт' : 'Стройка',
                serviceType,
                name,
                phone
            );

            // Вызываем колбэк родителя
            onSubmit({name, phone});
            setName('');
            setPhone('');
            onClose();
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
        }
    };
    if (!isOpen) return null;

    return (
        <section className={styles.customModalOverlay} onClick={onClose}>
            <div className={`${styles.customModal} ${isMobile ? styles.mobileModal : ''}`} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
                    &times;
                </button>

                <h2 className={styles.modalTitle}>Заказать консультацию</h2>

                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    <div className={styles.modalInputs}>
                        <div className={styles.formGroup}>
                            <div className={styles.gray}>
                                <label className={styles.formLabel}>Услуга:</label>
                                <input
                                    type="text"
                                    value={serviceCategory === 'repair' ? 'Ремонт' : 'Стройка'}
                                    readOnly
                                    className={styles.readOnlyInput}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.gray}>
                                <label className={styles.formLabel}>Тип:</label>
                                <input
                                    type="text"
                                    value={serviceType}
                                    readOnly
                                    className={styles.readOnlyInput}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.green}>
                                <label className={styles.formLabel}>Имя:</label>
                                <input
                                    type="text"
                                    value={name}
                                    maxLength={50}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ваше имя"
                                    className={styles.editableInput}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <div className={`${styles.green} ${!phone ? styles.requiredField : ''}`}>
                                <label className={styles.formLabel}>Телефон*:</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="+7 (___) ___-__-__"
                                    required
                                    className={styles.editableInput}
                                    pattern="\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}"
                                    inputMode="numeric"
                                    onKeyPress={(e) => {
                                        if (!/[0-9\b]/.test(e.key)) e.preventDefault();
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={phone.replace(/\D/g, '').length !== 11}
                    >
                        Заказать консультацию
                    </button>
                </form>
            </div>
        </section>
    );
}