import { useEffect, useState, FC } from "react";
import type { NextPage } from "next";
import Head from "next/head";
 
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import CountUp from 'react-countup';
// import dynamic from 'next/dynamic'; 

// const CountUp = dynamic(() => import('react-countup'), { ssr: false });

// import dynamic from 'next/dynamic';

//  const CountUp = dynamic(() => import('react-countup').then((module) => module.default), { ssr: false });

import styles from "../../styles/loading.module.css";
import { useCountUp } from "use-count-up";

const LoadingPage = (props: {randomAmountGacha: any, setFinishedLoadingAnim: any, setHaveGambled: any}) => {
    const [isTransferLoading, setIsTransferLoading] = useState(false);
    const [endAmount, setEndAmount] = useState(0);
    const [startAmount, setStartAmount] = useState(-875.039);
    const [intermediateAmount, setIntermediateAmount] = useState(0);

    const [animationEnded, setAnimationEnded] = useState(false);
    const [animationStarted, setAnimationStarted] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(false);
    const [blackoutStart, setBlackoutStart] = useState(false);

    const [start, setStart] = useState(1492);
    const [end, setEnd] = useState(7894);
    const [duration, setDuration] = useState(2);
    const [decimalPlaces, setDdecimalPlaces] = useState(0);
    const [easing, setEasing] = useState("easeOutCubic");
    const [thousandsSeparator, setThousandsSeparator] = useState("");
    const [decimalSeparator, setDecimalSeparator] = useState("");
    const [firstAnimFinished, setFirstAnimFinished] = useState(false);

    const { value, reset } = useCountUp({
        isCounting: true,
        start,
        end,
        duration
    });

    useEffect(() => {
      setEndAmount(Math.floor(Math.random() * 1000000 + 1))
      setEnd(Math.floor(Math.random() * 1000000 + 1))
    }, [])

    useEffect(() => {
      if (animationEnded) {
        setStartAmount(endAmount)
        setEndAmount(props.randomAmountGacha)
        // setStartAmount(props.randomAmountGacha - (props.randomAmountGacha * 0.5))
      }
    }, [animationEnded])

    useEffect(() => {
        if (value == end && !firstAnimFinished) {
            setFirstAnimFinished(true)
            // setStartAmount(endAmount)
            setTimeout(() => {
                setStart(end)
                setEnd(props.randomAmountGacha)
                reset()
                setAnimationEnded(true)
            }, 500);
            
            // reset
            // setStartAmount(props.randomAmountGacha - (props.randomAmountGacha * 0.5))
        }
        else if (value == end && animationEnded) setAnimationComplete(true)
        if (!animationStarted) setAnimationStarted(true)
    }, [value])
    
    
    // function waitAndCloseBlackout() {
    //     setBlackoutStart(true)
    //     // setTimeout(() => {
            
    //     // }, 230);
    //     setTimeout(() => {
    //         setBlackoutStart(false)
    //     }, 3000);
    // }

    return (
        <div className={styles.container}>
            <Head>
                <title>Crypto Gacha</title>
                <meta
                content="Generated by @rainbow-me/create-rainbowkit"
                name="description"
                />
                <link href='/favicon.ico' rel="shortcut icon" />
            </Head>
            
            <main className={blackoutStart ? styles.mainBlack : styles.main}>
                <div style={{display: "flex", justifyContent: "center", flexDirection: "column", width: "100%", /* backgroundColor: "red", */ alignItems: "center"}}>
                    <div className={animationEnded ? styles.counter : styles.startAnim} style={{display: "flex", justifyContent: "center", flexDirection: "column", width: "100%", /* backgroundColor: "red", */ alignItems: "center"}}>
                        {/* <CountUp
                            start={startAmount}
                            end={endAmount}
                            duration={2}
                            separator=" "
                            // decimals={4}
                            // decimal=","
                            // prefix="EUR "
                            suffix=" GCG"
                            onEnd={() => { console.log('Ended! 👏'); setAnimationEnded(true); /* waitAndCloseBlackout() } }
                            onStart={() => { console.log('Started! 💨'); setAnimationStarted(true)} }
                            >
                            {({ countUpRef, start }) => (
                                <div>
                                    <p className={animationStarted ? (animationEnded ? styles.textGrowEnd : styles.textGrowStart) : styles.textGrowInitial} style={{fontSize: "12px"}} ref={countUpRef} />
                                    {/* <button onClick={start}>Start</button> }
                                </div>
                            )}
                        </CountUp> */}
                        <p className={animationStarted ? (animationEnded ? styles.textGrowEnd : styles.textGrowStart) : styles.textGrowInitial} style={{fontSize: "12px"}}>
                            {value} GCG
                        </p>
                    </div>
                </div>


                <div>
                    { isTransferLoading &&
                    <div>
                        <p style={{color: "red"}}>La transaction est en cours... veuillez patienter</p>
                    </div>}
                </div>

                {animationEnded && animationComplete &&
                    <div>
                        <h4>Vous avez obtenu : {props.randomAmountGacha}</h4>
                    </div>
                }
                {!blackoutStart && animationEnded &&
                    <button style={{marginTop: "40px"}} onClick={() => props.setHaveGambled(false)}>Retour</button>
                }
            </main>
        </div>
    );
};
 
export default LoadingPage;