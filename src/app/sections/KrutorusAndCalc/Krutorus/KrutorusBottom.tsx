'use client'
import styles from './KrutorusBottom.module.css'
import Image from "next/image";
import BuilderImage from "public/man.png"
import CloudGray from "public/cloudGray.png"
import CloudBlue from "public/cloudBlue.png"
import Bottom from "public/bottom.svg"
import tg from "public/tgForOrange.svg"
import tgGray from 'public/tg.svg'
import mail from 'public/mail.svg'
import phoneIcon from 'public/phone-icon.svg'
import Calc from "@/app/sections/KrutorusAndCalc/Calc/Calc";
import Link from "next/link";


function KrutorusBottom() {

    return (
        <div className={styles.krutorusBottom}>
            <div className={styles.calc}><Calc/></div>
            <div className={styles.images}>
                {/* Gray cloud по центру */}
                <Image
                    className={styles.cloudGray}
                    src={CloudGray}
                    alt="Узнайте стоимость любой работы!"
                />

                {/* Blue cloud под Gray cloud с текстом */}
                <div className={styles.cloudBlueWrap}>
                    <Image
                        className={styles.cloudBlue}
                        src={CloudBlue}
                        alt="Есть вопросы или нужна помощь с выбором услуги?"
                    />
                    <div className={styles.cloudInfo}>
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
                </div>

                {/* Строитель справа от серого облака */}
                <Image
                    className={styles.man}
                    src={BuilderImage}
                    alt="строитель"
                />

                {/* Bottom внизу */}
                <Image
                    className={styles.bottom}
                    src={Bottom}
                    alt=""
                />

                {/* Иконки на середине Bottom */}
                <div className={styles.iconsOnBottom}>
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
