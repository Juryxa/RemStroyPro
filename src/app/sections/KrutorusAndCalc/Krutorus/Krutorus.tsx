'use client'
import Calc from "@/app/sections/KrutorusAndCalc/Calc/Calc";
import KrutorusTop from "@/app/sections/KrutorusAndCalc/Krutorus/KrutorusTop";
import KrutorusBottom from "@/app/sections/KrutorusAndCalc/Krutorus/KrutorusBottom";
import styles from './Krutorus.module.css'


function Krutorus() {
    // return (
    //     <section className={styles.krutorus}>
    //         <KrutorusTop/>
    //         <KrutorusBottom/>
    //     </section>
    // );
    return (
    <section className={styles.krutorus}>
      <div className={styles.topAndCalc}>
        <KrutorusTop />
        <section id="calculator">
            <Calc />
        </section>
      </div>
      <KrutorusBottom />
    </section>
  );
}

export default Krutorus;