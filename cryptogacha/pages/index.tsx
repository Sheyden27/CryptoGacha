// @ts-nocheck
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
 
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
 
import styles from "../styles/Home.module.css";
import Gachacoin from "../contract/cryptogachavrai.json";

import LoadingPage from "./components/LoadingPage";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faCoins, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
 
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
            alert("Il n'y a rien");
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
        
        // Récupérer les champs de saisie à partir de l'objet form
        const form = event.target as HTMLFormElement;
        const amountToSend = form.elements.namedItem("amount") as HTMLInputElement;

        if (amountToSend.value == '') {
            console.log("Il n'y a rien");
            alert("Il n'y a rien");
            return
        }
        
        if (gachacoin && signer) {
            const gachacoinWithSigner = gachacoin.connect(signer);
            const amount = ethers.utils.parseEther(amountToSend.value);

            const randomGeneratedAmount = await gachacoinWithSigner.getRandomAmount(BigInt(amountToSend.value)) - 0
            
            try {
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
                
                <div style={{display: "flex", backgroundColor: "black", width: "100%", padding: 0, marginTop: "-21px", flexDirection: "row", alignItems: "center", height: "105px"}}>
                    <h4 style={{fontSize: "16px", backgroundColor: "blue", width: "max-content", padding: "20px", borderTopRightRadius: "16px", borderBottomRightRadius: "16px", color: "white"}}>GachaCryptoCoin</h4>
                    <div style={{display: "flex", justifyContent: "space-between", width: "100%", flexDirection: "row"}}>
                        <h5 style={{color: "white", marginLeft: "30px"}}>L'endroit où vous pouvez gagner plus</h5>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <FontAwesomeIcon style={{height: "20px", marginRight: "10px"}} size="sm" color="white" icon={faCartShopping} />
                            <a style={{color: "white", marginRight: "50px", lineHeight:"60px"}} href="#"> Boutique</a>
                        </div>
                    </div>
                </div>
                <main className={styles.main}>
                    <div style={{display: "flex", justifyContent: "center", flexDirection: "column", width: "100%", /* backgroundColor: "red", */ alignItems: "center"}}>
                        <ConnectButton />

                        <div style={{display: "flex", justifyContent: "center", flexDirection: "column", width: "100%", /* backgroundColor: "red", */ alignItems: "center"}}>
                            <h1 className={styles.textWhite}>Votre wallet</h1>
                            <p style={{fontWeight: "bold"}} className={styles.textWhite}>Adresse: <span style={{fontStyle: "italic", color: "#0098db"}}>{account}</span></p>
                            <p className={styles.textWhite} style={{fontWeight: "bold"}}>Balance: <span style={{fontStyle: "italic", color: "#DDA0DD", fontWeight: "normal"}}>{balance} ETH</span></p>
                            <p className={styles.textWhite} style={{fontWeight: "bold"}}>Balance GachaCryptoCoin: <span style={{fontStyle: "italic", color: "#DDA0DD", fontWeight: "normal"}}>{balanceHCN} GCG</span></p>
                        </div>
                    </div>


                    <div>
                        <div className={styles.formsContainer}>
                            <form onSubmit={onSubmitBuy} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                
                                <label style={{color: "#0098db", fontFamily: "cursive"}}>Acheter des GachaCoins</label>
                                <input name="buyAmount" type="number" placeholder="Montant à acheter" color="green" className={styles.inputStyle}
                                style={{
                                    backgroundColor: "#FD7592",
                                    color: "white",
                                    borderRadius: "32px",
                                    padding: "15px 30px 15px 30px",
                                    marginBottom: "30px",
                                    marginTop: "10px",
                                    border: "3px solid black"
                                }} />
                                
                                <div style={{display: "flex", alignItems: "center"}}>
                                    
                                    <button className={styles.button} type="submit" style={{
                                        backgroundColor: "#2CE8B7",
                                        borderWidth: "0px",
                                        borderColor: "black",
                                        borderRadius: "16px",
                                        padding: "10px 20px 10px 20px",
                                        fontWeight: "bold",
                                        display: "flex",
                                        alignItems: "center"
                                    }}><FontAwesomeIcon style={{height: "18px", marginRight: "10px"}} icon={faCoins} />Acheter</button>
                                </div>
                            </form>

                            <form onSubmit={onSubmit} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>

                                <label style={{color: "#0098db", fontFamily: "cursive"}}>Montant à gamble</label>
                                <input className={styles.inputStyle} name="amount" type="number" placeholder="Montant à rouler"
                                style={{
                                    backgroundColor: "#FD7592",
                                    color: "white",
                                    borderRadius: "32px",
                                    padding: "15px 30px 15px 30px",
                                    marginBottom: "30px",
                                    marginTop: "10px",
                                    borderWidth: "0px",
                                    border: "3px solid black"
                                }}/>
                                
                                <button type="submit" className={styles.button} style={{
                                    backgroundColor: "#2CE8B7",
                                    borderWidth: "0px",
                                    borderColor: "black",
                                    borderRadius: "16px",
                                    padding: "10px 20px 10px 20px",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center"
                                }}><FontAwesomeIcon style={{height: "18px", marginRight: "10px"}} icon={faSquareCheck} />Valider</button>
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