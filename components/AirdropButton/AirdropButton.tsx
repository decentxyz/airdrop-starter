import { DecentSDK, edition } from "@decent.xyz/sdk";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import styles from "../../styles/Home.module.css";
import { useState } from "react";
import { ethers } from "ethers";

const AirdropButton = (props: any) => {
  const { recipientString } = props;
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [loading, setLoading] = useState(false);

  const getRecipientArray = () => {
    // remove whitespace
    let airdropList = recipientString.replace(/\r?\n|\r/g, "");
    // remove extraneous commas
    airdropList = airdropList.replace(/(^,)|(,$)/g, "");
    // convert to array
    const newAirdropList = airdropList.split(",");

    for (let i = 0; i < newAirdropList.length; i++) {
      if (!ethers.utils.isAddress(newAirdropList[i])) {
        return false;
      }
    }
    return newAirdropList;
  };

  const onClick = async () => {
    if (!chain || !signer) {
      openConnectModal?.();
      return;
    }
    const recipients = getRecipientArray();
    console.log("recipients", recipients);
    setLoading(true);
    try {
      const sdk = new DecentSDK(chain.id, signer);
      const contract = await edition.getContract(
        sdk,
        "0xfadC02970b24C86cC9931989EA0dc01B36e6B0a3"
      );
      const tx = await contract.mintAirdrop(recipients);
      await tx.wait();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={onClick}
      className={`${styles.card} disabled:opacity-75`}
      disabled={loading}
    >
      <h2 className="font-medium">Airdrop &rarr;</h2>
    </button>
  );
};

export default AirdropButton;
