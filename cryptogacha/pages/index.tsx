// @ts-nocheck
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
 
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
 
import styles from "../styles/Home.module.css";
import Gachacoin from "../contract/cryptogachavrai.json";

import favicon from './assets/favicon.png';
import LoadingPage from "./components/LoadingPage";
 
const Home: NextPage = () => {
    const [provider, setProvider] = useState<any>(null);
    const [signer, setSigner] = useState<any>(null);
    const [balance, setBalance] = useState<string>("0");
    const [account, setAccount] = useState<string | null>(null);
    const [gachacoin, setGachacoin] = useState<any>(null);
    const [balanceHCN, setBalanceHCN] = useState<string>("0");

    const [randomAmountGacha, setRandomAmountGacha] = useState<any>(0);
    const [haveGambled, setHaveGambled] = useState(false);
    const [isTransferLoading, setIsTransferLoading] = useState(false);
    const [finishedLoadingAnim, setFinishedLoadingAnim] = useState(false);
 
    const gachacoinAddress = "0x2a1a77f9Bf3DEc75658aC36e80Ee81B2085DdB6D";

    // = owner
    const deployerAddress = "0x1eb6bb6798C71d293B22b75C3a7391A7d610B7f9";
    
    useEffect(() => {
        if (window.ethereum) {
            console.log("MetaMask is installed!");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);
            const signer = provider.getSigner();
            setSigner(signer);
        } else {
            console.log("Please install MetaMask!");
        }
    }, []);
    
    useEffect(() => {
        if (signer) {
            try {
                signer.getAddress().then((address: string) => setAccount(address));
            } catch (err) {
                console.log("Vous devez connecter votre wallet !");
            }
        }
    }, [signer]);
 
    useEffect(() => {
        if (provider && account) {
            provider.getBalance(account).then((balance: ethers.BigNumber) => {
                setBalance(ethers.utils.formatEther(balance));

            });
        }
    }, [provider, account]);
 
    useEffect(() => {
        if (provider && account) {
            const contract = new ethers.Contract(gachacoinAddress, Gachacoin, provider);
            setGachacoin(contract);
            
            contract.balanceOf(account).then((balance: ethers.BigNumber) => {
                setBalanceHCN(ethers.utils.formatEther(balance));
            });
        }
    }, [provider, account]);

    useEffect(() => {
        if (provider && account) {
            provider.getBalance(account).then((balance: ethers.BigNumber) => {
                setBalance(ethers.utils.formatEther(balance));
            });

            const contract = new ethers.Contract(gachacoinAddress, Gachacoin, provider);
            setGachacoin(contract);
            
            contract.balanceOf(account).then((balance: ethers.BigNumber) => {
                setBalanceHCN(ethers.utils.formatEther(balance));
            });
        }
    }, [finishedLoadingAnim])
    

    const onSubmitBuy = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const form = event.target as HTMLFormElement;
        const amountToSend = form.elements.namedItem("buyAmount") as HTMLInputElement;

        if (amountToSend.value == '') {
            console.log("Il n'y a rien");
            return
        }
        
        if (gachacoin && signer) {
            const gachacoinWithSigner = gachacoin.connect(signer);
            // const amount = ethers.utils.parseEther(amountToSend.value);

            try {
                setIsTransferLoading(true);
                const tx = await gachacoinWithSigner.buyCoin(amountToSend.value);
                await tx.wait();
                alert("Transaction completed successfully");
                if (provider && account) {
                    provider.getBalance(account).then((balance: ethers.BigNumber) => {
                        setBalance(ethers.utils.formatEther(balance));
                    });

                    const contract = new ethers.Contract(gachacoinAddress, Gachacoin, provider);
                    setGachacoin(contract);
                    
                    contract.balanceOf(account).then((balance: ethers.BigNumber) => {
                        setBalanceHCN(ethers.utils.formatEther(balance));
                    });
                }
            } catch (error) {
                console.error(error);
                alert("Transfer failed !");
                setIsTransferLoading(false);
            }
        }
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        // Récupérez les champs de saisie à partir de l'objet form
        const form = event.target as HTMLFormElement;
        const toAddress = form.elements.namedItem("to") as HTMLInputElement;
        const amountToSend = form.elements.namedItem("amount") as HTMLInputElement;

        if (amountToSend.value == '') {
            console.log("Il n'y a rien");
            return
        }
        
        if (gachacoin && signer) {
            const gachacoinWithSigner = gachacoin.connect(signer);
            const amount = ethers.utils.parseEther(amountToSend.value);

            const randomGeneratedAmount = await gachacoinWithSigner.getRandomAmount(BigInt(amountToSend.value)) - 0

            // console.log(Number(ethers.utils.parseEther(String(randomGeneratedAmount))) - 0);
            
            try {
                // const gotRandomAmount = await gachacoinWithSigner.getRandomAmount(amount)
                setRandomAmountGacha(randomGeneratedAmount);
                setIsTransferLoading(true);
                const tx = await gachacoinWithSigner.transfer(deployerAddress, amount)
                await tx.wait();

                const txPayBack = await gachacoinWithSigner.giveGachaerHisMoney(account, ethers.utils.parseEther(String(randomGeneratedAmount)));
                await txPayBack.wait();

                setHaveGambled(true);
                alert("Transfer successful!");
                setIsTransferLoading(false);

                if (provider && account) {
                    provider.getBalance(account).then((balance: ethers.BigNumber) => {
                        setBalance(ethers.utils.formatEther(balance));
                    });

                    const contract = new ethers.Contract(gachacoinAddress, Gachacoin, provider);
                    setGachacoin(contract);
                    
                    contract.balanceOf(account).then((balance: ethers.BigNumber) => {
                        setBalanceHCN(ethers.utils.formatEther(balance));
                    });
                }
            } catch (error) {
                console.error(error);
                alert("Transfer failed!");
                setIsTransferLoading(false);
            }
        }
    };
 
    return (
        <div className={styles.container}>
            {haveGambled ?
                <LoadingPage randomAmountGacha={randomAmountGacha}
                    setFinishedLoadingAnim={setFinishedLoadingAnim}
                    setHaveGambled={setHaveGambled} />
                :
            <>
                <Head>
                    <title>Crypto Gacha</title>
                    <meta
                    content="Gacha Crypto Coin project"
                    name="description"
                    />
                    <link href='/favicon.ico' rel="shortcut icon" />
                </Head>
                
                <div style={{backgroundColor: "red", width: "100%", padding: 0, marginTop: "-21px"}}>
                    <h4 style={{backgroundColor: "blue", width: "max-content", padding: "10px"}}>GachaCryptoCoin</h4>
                </div>
                <main className={styles.main}>
                    
                    <div style={{display: "flex", justifyContent: "center", flexDirection: "column", width: "100%", /* backgroundColor: "red", */ alignItems: "center"}}>
                        <ConnectButton />

                        <div style={{display: "flex", justifyContent: "center", flexDirection: "column", width: "100%", /* backgroundColor: "red", */ alignItems: "center"}}>
                            <h1>Votre wallet</h1>
                            <p style={{fontStyle: "italic"}}>Adresse: <span style={{fontStyle: "normal", color: "blue"}}>{account}</span></p>
                            <p>Balance: <span style={{color: "purple"}}>{balance} ETH</span></p>
                            <p>Balance GachaCryptoCoin: {balanceHCN} GCG</p>
                        </div>
                    </div>


                    <div>
                        <div className={styles.formsContainer}>
                            <form onSubmit={onSubmitBuy} style={{display: "flex", flexDirection: "column", alignItems: "center"/* , margin: "10% 0 10% 0" */}}>
                                {/* <label htmlFor="to">Receveur</label>
                                <input name="to" type="text" placeholder="Adresse" /> */}
                                
                                <label style={{color: "blue", fontFamily: "cursive"}}>Acheter des GachaCoins</label>
                                <input name="buyAmount" type="number" placeholder="Montant à acheter" color="green" className={styles.inputStyle}
                                style={{
                                    backgroundColor: "lightgrey",
                                    color: "black",
                                    borderRadius: "16px",
                                    padding: "10px 20px 10px 20px",
                                    marginBottom: "10px"
                                }} />
                                
                                {/* <button type="submit">Send</button> */}
                                <button type="submit" style={{
                                    backgroundColor: "lightblue",
                                    borderWidth: "2px",
                                    borderColor: "black",
                                    borderRadius: "16px",
                                    padding: "10px 20px 10px 20px",
                                    fontWeight: "bold"
                                }}>Acheter</button>
                            </form>

                            <form onSubmit={onSubmit} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                {/* <label htmlFor="to">Receveur</label>
                                <input name="to" type="text" placeholder="Adresse" /> */}
                                
                                <label style={{fontFamily: "cursive"}}>Montant à gamble</label>
                                <input name="amount" type="number" placeholder="Montant à rouler" /* value={toSend} onChange={(amount) => onChangeAmount(amount)} */ 
                                style={{
                                    backgroundColor: "lightgrey",
                                    color: "black",
                                    borderRadius: "16px",
                                    padding: "10px 20px 10px 20px",
                                    marginBottom: "10px"
                                }}/>
                                
                                {/* <button type="submit">Send</button> */}
                                <button type="submit" className={styles.button} style={{
                                    backgroundColor: "lightblue",
                                    borderWidth: "2px",
                                    borderColor: "black",
                                    borderRadius: "16px",
                                    padding: "10px 20px 10px 20px",
                                    fontWeight: "bold"
                                }}>Valider</button>
                            </form>
                        </div>

                        { isTransferLoading &&
                        <>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <p style={{color: "red", fontSize: "18px"}}>La transaction est en cours... veuillez patienter</p>
                            </div>
                        </>}
                    </div>

                    {haveGambled &&
                        <div>
                            <h4>Vous avez gagné : {randomAmountGacha}</h4>
                        </div>
                    }
                </main>
            </>
            }
        </div>
    );
};
 
export default Home;