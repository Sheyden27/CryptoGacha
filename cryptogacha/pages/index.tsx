import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
 
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
 
import styles from "../styles/Home.module.css";
import Hexacoin from "../contract/cryptogachavrai.json";
 
const Home: NextPage = () => {
 const [provider, setProvider] = useState<any>(null);
 const [signer, setSigner] = useState<any>(null);
 const [balance, setBalance] = useState<string>("0");
 const [account, setAccount] = useState<string | null>(null);
 const [hexacoin, setHexacoin] = useState<any>(null);
 const [balanceHCN, setBalanceHCN] = useState<string>("0");

 const [toSend, setToSend] = useState<any>(0);
 
 const hexacoinAddress = "0xfFEcc5C8cFE6e794c8c8072cC1CA39166e6e1CDE";
 
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
        });
    }
 }, [provider, account]);
 
    useEffect(() => {
        if (provider && account) {
            const contract = new ethers.Contract(hexacoinAddress, Hexacoin, provider);
            setHexacoin(contract);
            
            contract.balanceOf(account).then((balance: ethers.BigNumber) => {
            setBalanceHCN(ethers.utils.formatEther(balance));
            });
        }
    }, [provider, account]);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        // Récupérez les champs de saisie à partir de l'objet form
        const form = event.target as HTMLFormElement;
        const toAddress = form.elements.namedItem("to") as HTMLInputElement;
        const amountToSend = form.elements.namedItem("amount") as HTMLInputElement;
        
        if (hexacoin && signer) {
            const hexacoinWithSigner = hexacoin.connect(signer);
            const amount = ethers.utils.parseEther(amountToSend.value);
            try {
                const tx = await hexacoinWithSigner.transfer(toAddress.value, amount);
                await tx.wait();
                alert("Transfer successful!");
            } catch (error) {
                console.error(error);
                alert("Transfer failed!");
            }
        }
    };

    const onChangeAmount = (amount: any) => {
        setToSend(amount)
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
                <div>
                    <ConnectButton />
                    <p>Adresse: {account}</p>
                    <p>Portefeuille: {balance} ETH</p>
                    <p>Balance GachaCryptoCoin: {balanceHCN} GCG</p>
                </div>

                <div>
                    <form onSubmit={onSubmit} style={{display: "flex", flexDirection: "column"}}>
                        <label htmlFor="to">Receveur</label>
                        <input name="to" type="text" placeholder="Adresse" />
                        
                        <label>Montant</label>
                        <input name="amount" type="number" placeholder="Montant à envoyer" /* value={toSend} onChange={(amount) => onChangeAmount(amount)} */ />
                        
                        <button type="submit">Send</button>
                    </form>
                </div>
            </main>
        </div>
    );
};
 
export default Home;