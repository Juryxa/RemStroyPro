'use client'
import styles from './KrutorusBottom.module.css'
import Image from "next/image";
import BuilderImage from "public/man.webp"
import CloudGray from "public/cloudGray.webp"
import CloudBlue from "public/cloudBlue.webp"
import Bottom from "public/bottom.svg"
import tg from "public/tgForOrange.svg"
import tgGray from 'public/tg.svg'
import mail from 'public/mail.svg'
import phoneIcon from 'public/phone-icon.svg'
import Calc from "@/app/sections/KrutorusAndCalc/Calc/Calc";
import Link from "next/link";
import {useState} from "react";

function Spinner() {
    return (
        <div className={styles.spinner}></div>
    )
}


function KrutorusBottom() {
    const [loaded, setLoaded] = useState({
        man: false,
        gray: false,
        blue: false,
    });

    const allLoaded = loaded.man && loaded.gray && loaded.blue;

    return (
        <div className={styles.krutorusBottom}>
            <div id='calculator' className={styles.calc}><Calc/></div>
            {!allLoaded && (
                <div className={styles.spinnerWrap}>
                    <Spinner/>
                </div>
            )}
            <div className={styles.images} style={{ opacity: allLoaded ? 1 : 0 }}>
                <Image
                    className={styles.cloudGray}
                    src={CloudGray}
                    alt="Узнайте стоимость любой работы!"
                    onLoad={() => setLoaded(p => ({ ...p, gray: true }))}
                    priority
                />

                <div className={styles.cloudBlueWrap}>
                    <Image
                        className={styles.cloudBlue}
                        src={CloudBlue}
                        alt="Есть вопросы или нужна помощь с выбором услуги?"
                        onLoad={() => setLoaded(p => ({ ...p, blue: true }))}
                        priority
                    />
                    <div className={styles.cloudInfo}>
                        <Image className={styles.tg} src={tg} alt=""/>
                        <p className={styles.cloudText}>
                            Есть вопросы или нужна помощь с выбором услуги?<br/>
                            <Link href='https://t.me/remstroyprobot?start=BlueCloud' className={styles.tgUnderscore}>
                                <u>Пишите в Telegram — ответим быстро!</u>
                            </Link>
                        </p>
                    </div>
                </div>

                <Image
                    className={styles.man}
                    src={BuilderImage}
                    alt="строитель"
                    onLoad={() => setLoaded(p => ({ ...p, man: true }))}
                    priority
                />

                <Image className={styles.bottom} src={Bottom} alt=""/>
                <div className={styles.iconsOnBottom}>
                    <Link href='tel:+79999817129' className={styles.phoneIcon}>
                        <Image src={phoneIcon} alt="phone" width={40} height={40} priority/>
                    </Link>
                    <Link href={'https://t.me/remstroyprobot?start=GrayUnderCalc'} className={styles.iconLink}>
                        <Image src={tgGray} alt="telegram" width={40} height={40} priority/>
                    </Link>
                    <Link href={'mailto:remstroiipro@gmail.com'} className={styles.iconLink}>
                        <Image src={mail} alt="email" width={40} height={40} priority/>
                    </Link>
                </div>
            </div>
            <div className={styles.blueRectMob}>
                <Image
                    className={styles.tg}
                    src={tg}
                    alt=""
                />
                <p className={styles.cloudText}>
                    Есть вопросы или нужна помощь с выбором услуги?<br/>
                    <Link href='https://t.me/remstroyprobot?start=BlueCloud' className={styles.tgUnderscore}><u>Пишите
                        в Telegram — ответим быстро!</u></Link>
                </p>
            </div>
            <div className={styles.iconsOnBottomMob}>
                {/* Телефон */}

                <Link href='tel:+79999817129' className={styles.phoneIcon}>
                    <Image src={phoneIcon} alt="phone" width={40} height={40} priority/>
                </Link>

                <Link href={'https://t.me/remstroyprobot?start=GrayUnderCalc'} className={styles.iconLink}>
                    <Image src={tgGray} alt="telegram" width={40} height={40} priority/>
                </Link>

                <Link href={'mailto:remstroiipro@gmail.com'} className={styles.iconLink}>
                    <Image src={mail} alt="email" width={40} height={40} priority/>
                </Link>
            </div>
        </div>
    );
}

export default KrutorusBottom;
