import { type HardhatUserConfig, task } from "hardhat/config";
import { createClient } from "@supabase/supabase-js";
import "@nomicfoundation/hardhat-toolbox-viem";
import "dotenv/config";

interface TransferEvent {
  from?: string;
  to?: string;
  tokenId?: string;
  blockNumber?: string;
}

interface CreditIssuedEvent {
  to?: string;
  tokenId?: string;
  principal?: string;
  totalRepaymentAmount?: string;
  issuanceDate?: string;
  creditTerm?: string;
  blockNumber?: string;
}

const CONTRACT_ADDRESS = "0xcF8D5F4a495d94B6A5e2a9E43A909B9631F56247";
const FROM_BLOCK: bigint = 21808180n;
const TO_BLOCK: bigint = 23672246n;

const supabaseClient = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_KEY ?? ""
);

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    celo: {
      url: `https://celo-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
  },
};

task(
  "download-transfers",
  "Downloads existing transfers from the blockchain",
  async (_, hre) => {
    const contract = await hre.viem.getContractAt(
      "RodaCreditCOP",
      CONTRACT_ADDRESS
    );

    // Iterate over the events since the FROM_BLOCK
    let events: TransferEvent[] = [];
    for (let i = FROM_BLOCK; i < TO_BLOCK; i += 1000n) {
      console.log("Downloading events from block", i.toString());
      const newEvents = await contract.getEvents.Transfer(
        {},
        { fromBlock: i, toBlock: i + 1000n }
      );

      const promises = [];
      for (const event of newEvents) {
        const parsedEvent: TransferEvent = {
          from: event.args.from?.toString(),
          to: event.args.to?.toString(),
          tokenId: event.args.tokenId?.toString(),
          blockNumber: event.blockNumber.toString(),
        };
        promises.push(supabaseClient.from("Transfer").insert(parsedEvent));
        events.push(parsedEvent);
      }
      await Promise.all(promises);

      console.log("Downloaded", events.length, "events");
    }

    console.log("Done");
  }
);

task(
  "download-credit-issued",
  "Downloads existing payments from the blockchain",
  async (_, hre) => {
    const contract = await hre.viem.getContractAt(
      "RodaCreditCOP",
      CONTRACT_ADDRESS
    );

    // Iterate over the events since the FROM_BLOCK
    let events: CreditIssuedEvent[] = [];
    for (let i = FROM_BLOCK; i < TO_BLOCK; i += 1000n) {
      console.log("Downloading events from block", i.toString());
      const newEvents = await contract.getEvents.CreditIssued(
        {},
        { fromBlock: i, toBlock: i + 1000n }
      );

      const promises = [];
      for (const event of newEvents) {
        const parsedEvent: CreditIssuedEvent = {
          to: event.args.to?.toString(),
          tokenId: event.args.tokenId?.toString(),
          principal: event.args.principal?.toString(),
          totalRepaymentAmount: event.args.totalRepaymentAmount?.toString(),
          issuanceDate: event.args.issuanceDate?.toString(),
          creditTerm: event.args.creditTerm?.toString(),
          blockNumber: event.blockNumber.toString(),
        };
        promises.push(supabaseClient.from("Credit Issued").insert(parsedEvent));
        events.push(parsedEvent);
      }
      await Promise.all(promises);

      console.log("Downloaded", events.length, "events");
    }

    console.log("Done");
  }
);

export default config;
