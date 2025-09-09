'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './ImageModal.module.css';

interface Props {
  isOpen: boolean;
  src: string;
  onClose: () => void;
}

export default function ImageModal({ isOpen, src, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.min(5, Math.max(1, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    imageStart.current = { ...position };
  };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || scale === 1 || !modalRef.current) return;

        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;

        const newX = imageStart.current.x + dx;
        const newY = imageStart.current.y + dy;

        // Границы модалки
        const modalWidth = modalRef.current.offsetWidth;
        const modalHeight = modalRef.current.offsetHeight;

        // Размер изображения
        const img = modalRef.current.querySelector('img');
        if (!img) return;

        const imgWidth = img.naturalWidth * scale;
        const imgHeight = img.naturalHeight * scale;

        // Максимальный отступ (чтобы хотя бы 1px изображения оставался в окне)
        const maxOffsetX = Math.max((imgWidth - modalWidth) / 2, 0);
        const maxOffsetY = Math.max((imgHeight - modalHeight) / 2, 0);

        setPosition({
            x: Math.max(-maxOffsetX, Math.min(maxOffsetX, newX)),
            y: Math.max(-maxOffsetY, Math.min(maxOffsetY, newY)),
        });
    };

    const handleTouchStart = (e: React.TouchEvent) => {
  if (scale === 1 || e.touches.length !== 1) return;
  isDragging.current = true;
  dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  imageStart.current = { ...position };
};

const handleTouchMove = (e: React.TouchEvent) => {
  if (!isDragging.current || e.touches.length !== 1 || !modalRef.current) return;

  e.preventDefault(); // ключевая строка — блокирует прокрутку страницы

  const dx = e.touches[0].clientX - dragStart.current.x;
  const dy = e.touches[0].clientY - dragStart.current.y;

  const newX = imageStart.current.x + dx;
  const newY = imageStart.current.y + dy;

  const modalWidth = modalRef.current.offsetWidth;
  const modalHeight = modalRef.current.offsetHeight;
  const img = modalRef.current.querySelector('img');
  if (!img) return;

  const imgWidth = img.naturalWidth * scale;
  const imgHeight = img.naturalHeight * scale;

  const maxOffsetX = Math.max((imgWidth - modalWidth) / 2, 0);
  const maxOffsetY = Math.max((imgHeight - modalHeight) / 2, 0);

  setPosition({
    x: Math.max(-maxOffsetX, Math.min(maxOffsetX, newX)),
    y: Math.max(-maxOffsetY, Math.min(maxOffsetY, newY)),
  });
};

const handleTouchEnd = () => {
  isDragging.current = false;
};

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2);
    }
  };

  if (!isOpen || typeof window === 'undefined') return null;

  return createPortal(
    <div className={styles.backdrop}>
      <div
        className={styles.modal}
        ref={modalRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button className={styles.close} onClick={onClose}>×</button>
        <div className={styles.imageWrapper}>
          <div
            className={styles.zoomLayer}
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transition: isDragging.current ? 'none' : 'transform 0.2s ease',
            }}
          >
            <img src={src} alt="Просмотр фото" className={styles.image} />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
