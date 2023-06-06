import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
 
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
 
import styles from "../styles/Home.module.css";
import Gachacoin from "../contract/cryptogachavrai.json";
 
const Home: NextPage = () => {
    const [provider, setProvider] = useState<any>(null);
    const [signer, setSigner] = useState<any>(null);
    const [balance, setBalance] = useState<string>("0");
    const [account, setAccount] = useState<string | null>(null);
    const [gachacoin, setGachacoin] = useState<any>(null);
    const [balanceHCN, setBalanceHCN] = useState<string>("0");

    const [toSendAmount, setToSendAmount] = useState<any>(0);
    const [randomAmountGacha, setRandomAmountGacha] = useState<any>(0);
    const [haveGambled, setHaveGambled] = useState(false);
    const [isTransferLoading, setIsTransferLoading] = useState(false);
 
    const gachacoinAddress = "0x2413862110cBC57F668DDA3481e4BFB46276Ea3b";

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
            signer.getAddress().then((address: string) => setAccount(address));
        }
    }, [signer]);
 
    useEffect(() => {
        if (provider && account) {
            provider.getBalance(account).then((balance) => {
                setBalance(ethers.utils.formatEther(balance));

                // Decommenter apres redeploy
                // const contract = new ethers.Contract(gachacoinAddress, Gachacoin, provider);
                // contract.approveContract(deployerAddress, balance);
                // contract.giveGachaerHisMoney(deployerAddress, account, contract.getRandomAmount(toSendAmount));
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

    const onSubmitBuy = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        // Récupérez les champs de saisie à partir de l'objet form
        const form = event.target as HTMLFormElement;
        // const toAddress = form.elements.namedItem("to") as HTMLInputElement;
        const amountToSend = form.elements.namedItem("buyAmount") as HTMLInputElement;

        if (amountToSend.value == '') {
            console.log("Il n'y a rien");
            return
        }
        
        if (gachacoin && signer) {
            const gachacoinWithSigner = gachacoin.connect(signer);
            // const amount = ethers.utils.parseEther(amountToSend.value);

            try {
                const tx = await gachacoinWithSigner.buyCoin(amountToSend.value);
                await tx.wait();
                alert("Transaction completed successfully");
                if (provider && account) {
                    provider.getBalance(account).then((balance) => {
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
            console.log(randomGeneratedAmount)
            setToSendAmount(randomGeneratedAmount)

            // console.log(Number(ethers.utils.parseEther(String(randomGeneratedAmount))) - 0);
            
            try {
                // const gotRandomAmount = await gachacoinWithSigner.getRandomAmount(amount)
                // setRandomAmountGacha(gotRandomAmount);
                setIsTransferLoading(true)
                const tx = await gachacoinWithSigner.transfer(deployerAddress, amount)
                // replace ^ with :
                await tx.wait();

                const txPayBack = await gachacoinWithSigner.giveGachaerHisMoney(account, ethers.utils.parseEther(String(randomGeneratedAmount)));
                await txPayBack.wait();

                // setHaveGambled(true);
                alert("Transfer successful!");
                setIsTransferLoading(false)
            } catch (error) {
                console.error(error);
                alert("Transfer failed!");
            }
        }
    };

    const onChangeAmount = (amount: any) => {
        setToSendAmount(amount)
    };
 
    return (
        <div className={styles.container}>
            <Head>
                <title>Crypto Gacha</title>
                <meta
                content="Generated by @rainbow-me/create-rainbowkit"
                name="description"
                />
                <link href="/favicon.ico" rel="icon" />
            </Head>
            
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

                { isTransferLoading &&
                <div>
                    <p>La transaction est en cours... veuillez patienter</p>
                </div>}

                <div>
                    <form onSubmit={onSubmitBuy} style={{display: "flex", flexDirection: "column"}}>
                        {/* <label htmlFor="to">Receveur</label>
                        <input name="to" type="text" placeholder="Adresse" /> */}
                        
                        <label>Montant à acheter</label>
                        <input name="buyAmount" type="number" placeholder="Montant à acheter" />
                        
                        {/* <button type="submit">Send</button> */}
                        <button type="submit">Acheter</button>
                    </form>

                    <form onSubmit={onSubmit} style={{display: "flex", flexDirection: "column"}}>
                        {/* <label htmlFor="to">Receveur</label>
                        <input name="to" type="text" placeholder="Adresse" /> */}
                        
                        <label>Montant à gamble</label>
                        <input name="amount" type="number" placeholder="Montant à rouler" /* value={toSend} onChange={(amount) => onChangeAmount(amount)} */ />
                        
                        {/* <button type="submit">Send</button> */}
                        <button type="submit">Valider</button>
                    </form>
                </div>

                {haveGambled &&
                    <div>
                        <h4>Vous avez gagné : {randomAmountGacha}</h4>
                    </div>
                }
            </main>
        </div>
    );
};
 
export default Home;