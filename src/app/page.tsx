'use client'
import styles from "./page.module.css";
import KrutorusMain from "@/app/sections/KrutorusAndCalc/KrutorusMain";
import Services from "@/app/sections/Services/Services";
import TgOrange from "@/app/components/TgOrange";
import Plan from "@/app/sections/Plan/Plan";
import HowWeWork from "@/app/sections/HowWeWork/HowWeWork";
import AboutUs from "@/app/sections/AboutUs/AboutUs";
import Footer from "@/app/sections/Footer/Footer";
import {useEffect, useState} from 'react';
import KrutorusBottom from "@/app/sections/KrutorusAndCalc/Krutorus/KrutorusBottom";
import ScrollProgressBar from "@/app/components/ScrollProgressBar";

export default function Home() {
    const [activeSection, setActiveSection] = useState('krutorus');

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.4 // Секция считается видимой, когда 40% её в области просмотра
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Наблюдаем за всеми секциями
        const sections = [
            document.getElementById('krutorus'),
            document.getElementById('services'),
            document.getElementById('plan'),
            document.getElementById('howwework'),
            document.getElementById('aboutus')
        ];

        sections.forEach(section => {
            if (section) observer.observe(section);
        });

        return () => {
            sections.forEach(section => {
                if (section) observer.unobserve(section);
            });
        };
    }, []);

    return (
        <div className={styles.page}>
            <ScrollProgressBar/>
            <section id='krutorus'><KrutorusMain activeSection={activeSection}/></section>
            <section id='krutorusBottom'><KrutorusBottom/></section>
            <TgOrange/>
            <section id="services"><Services/></section>
            <section id="plan"><Plan/></section>
            <section id="howwework"><HowWeWork/></section>
            <section id="aboutus"><AboutUs/></section>
            <Footer/>
        </div>
    );
}