"use server";

import {
  CreditIssuedEvent,
  PaymentRecordedEvent,
  TransferEvent,
} from "@/types";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_KEY ?? ""
);

const PAGE_SIZE = 100;

export type PageResult = TransferEvent & {
  payments: PaymentRecordedEvent[];
  credits: CreditIssuedEvent[];
};

export async function getPage(page: number): Promise<PageResult[]> {
  const result = await supabase
    .from("Transfer")
    .select("*")
    .eq("from", "0x0000000000000000000000000000000000000000")
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const transfers: TransferEvent[] = result.data ?? [];
  if (transfers.length < 1) {
    return [];
  }

  const transferIds = transfers.map((t) => t.tokenId);
  const creditsPromise = supabase
    .from("Credit Issued")
    .select("*")
    .in("tokenId", [transferIds]);
  const paymentsPromise = supabase
    .from("Payment Recorded")
    .select("*")
    .in("tokenId", transferIds);

  const [creditsResponse, paymentsResponse] = await Promise.all([
    creditsPromise,
    paymentsPromise,
  ]);

  const credits: CreditIssuedEvent[] = creditsResponse.data ?? [];
  const payments: PaymentRecordedEvent[] = paymentsResponse.data ?? [];

  const join: PageResult[] = [];
  for (const transfer of transfers) {
    join.push({
      ...transfer,
      credits: (credits ?? []).filter((c) => c.tokenId === transfer.tokenId),
      payments: (payments ?? []).filter((p) => p.tokenId === transfer.tokenId),
    });
  }

  return join;
}
