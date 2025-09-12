'use client'
import styles from './KrutorusMain.module.css'
import Krutorus from "@/app/sections/KrutorusAndCalc/Krutorus/Krutorus";
import Nav from "@/app/sections/Nav/Nav";

function KrutorusMain({ activeSection }: { activeSection: string }) {
    return (
        <section className={styles.main}>
            <Nav activeSection={activeSection}/>
            <Krutorus/>
        </section>
    );
}

export default KrutorusMain;