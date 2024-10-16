import { HardhatRuntimeEnvironment } from "hardhat/types";

export async function getLastBlockNumber(
  hre: HardhatRuntimeEnvironment
): Promise<bigint> {
  const client = await hre.viem.getPublicClient();
  return client.getBlockNumber();
}
