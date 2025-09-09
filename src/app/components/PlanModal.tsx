'use client';
import {useEffect, useState} from 'react';
import styles from './PlanModal.module.css';
import ModalService from "@/app/api/ModalPost";

interface PlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; phone: string; projectType: string }) => void;
}

export default function PlanModal({
                                      isOpen,
                                      onClose,
                                      onSubmit
                                  }: PlanModalProps) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [projectType, setProjectType] = useState('Общая консультация');
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
        if (!phone) return;
        try {
            await ModalService.planPost(
                projectType,
                name,
                phone
            );

            onSubmit({name, phone, projectType});
            setName('');
            setPhone('');
            onClose();
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
        }
    };

    if (!isOpen) return null;

    const projectTypes = [
        'Общая консультация',
        'Базовый эскиз',
        'Рабочие чертежи',
        'Полный проект',
        'Авторский / премиум'
    ];

    return (
        <section className={styles.planModalOverlay} onClick={onClose}>
            <div className={`${styles.planModal} ${isMobile ? styles.mobileModal : ''}`}
                 onClick={(e) => e.stopPropagation()}>
                <button className={styles.planCloseButton} onClick={onClose} aria-label="Закрыть">
                    &times;
                </button>

                <h2 className={styles.planModalTitle}>Заказать консультацию</h2>

                <form onSubmit={handleSubmit} className={styles.planModalForm}>
                    <div className={styles.planModalInputs}>
                        <div className={styles.planFormGroup}>
                            <div className={styles.planGray}>
                                <label className={styles.planFormLabel}>Услуга:</label>
                                <select
                                    value={projectType}
                                    onChange={(e) => setProjectType(e.target.value)}
                                    className={styles.planEditableInput}
                                >
                                    {projectTypes.map((type) => (
                                        <option className={styles.option} key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.planFormGroup}>
                            <div className={styles.planGreen}>
                                <label className={styles.planFormLabel}>Имя:</label>
                                <input
                                    type="text"
                                    value={name}
                                    maxLength={50}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ваше имя"
                                    className={styles.planEditableInput}
                                />
                            </div>
                        </div>

                        <div className={styles.planFormGroup}>
                            <div className={`${styles.planGreen} ${!phone ? styles.planRequiredField : ''}`}>
                                <label className={styles.planFormLabel}>Телефон*:</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="+7 (___) ___-__-__"
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
                    </div>

                    <button
                        type="submit"
                        className={styles.planSubmitButton}
                        disabled={phone.replace(/\D/g, '').length !== 11}
                    >
                        Заказать консультацию
                    </button>
                </form>
            </div>
        </section>
    );
}