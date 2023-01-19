import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";
import { DecentSDK, edition } from "@decent.xyz/sdk";
import { useAccount, useNetwork, useSigner } from "wagmi";

const Home: NextPage = () => {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const onClick = async () => {
    if (!chain || !signer) {
      openConnectModal?.();
      return;
    }
    const sdk = new DecentSDK(chain.id, signer);
    console.log("sdk", sdk);
    const contract = await edition.getContract(
      sdk,
      "0xfadC02970b24C86cC9931989EA0dc01B36e6B0a3"
    );
    const tx = await contract.mintAirdrop([address]);
    console.log("tx", tx);
  };

  return (
    <div className={`${styles.container} background`}>
      <Head>
        <title>Airdrop Starter</title>
        <meta
          name="description"
          content="A template for creating airdrops with the Decent Protocol"
        />
        <link rel="icon" href="/images/favi.png" />
      </Head>

      <main className={styles.main}>
        <div className="flex items-center gap-4">
          <ConnectButton />
          <Link
            href="https://github.com/decentxyz/Start-Decent"
            target="_blank"
          >
            <Image
              src="/images/github-mark-white.svg"
              height={22}
              width={22}
              alt="link to repository"
            />
          </Link>
        </div>

        <h1 className={`${styles.title} font-medium`}>Airdrop Starter Pack</h1>

        <div className={`${styles.grid} cursor-pointer`}>
          <div onClick={onClick} className={styles.card}>
            <h2 className="font-medium">Airdrop &rarr;</h2>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-white text-white">
        <div>
          <p className="flex justify-center pb-4 text-xl">
            For the artists of every industry 🥂
          </p>
          <a
            className="flex justify-center items-center text-xl"
            href="https://decent.xyz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="pr-4">🏗️</span>
            <Image
              src="/images/decent.png"
              height={18}
              width={100}
              alt="Decent 💪"
            />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
