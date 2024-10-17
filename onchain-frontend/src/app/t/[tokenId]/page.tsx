"use server";

import { NavBar } from "@/app/(Navbar)";
import { getSingleItem } from "@/app/serverSideFunctions";
import { LoanPurpose } from "@/types";
import { Typography } from "@mui/material";
import { Fragment } from "react";
import styles from "./page.module.css";

interface TokenPageParams {
  tokenId: string;
}

export default async function ServerSideTokenPage({
  params: { tokenId },
}: {
  params: TokenPageParams;
}) {
  const item = await getSingleItem(tokenId);
  const totalPaid = item.payments.reduce((prev, value) => {
    return prev + Number(value.paymentAmount);
  }, 0);
  const totalOwed = item.credits.reduce((prev, value) => {
    return prev + Number(value.totalRepaymentAmount);
  }, 0);
  const totalDebt = totalOwed - totalPaid;

  let loanPurpose = "Unknown";
  if (item.credits.length > 0) {
    const purpose = item.credits[0].loanPurpose;
    if (purpose) {
      const value = LoanPurpose[purpose as keyof typeof LoanPurpose];
      if (value) {
        loanPurpose = value;
      }
    }
  }

  return (
    <main>
      <NavBar />

      <header className={styles.header}>
        <Typography variant="h4">Token {tokenId}</Typography>
        <Typography>To: {item.to}</Typography>
        <Typography>Loan Purpose: {loanPurpose}</Typography>
      </header>

      <section className={styles.section}>
        <Typography variant="h5">Credits Granted: </Typography>
        {item.credits.map((credit) => (
          <Fragment key={credit.id}>
            <Typography>
              Credit Repayment Amount: {credit.totalRepaymentAmount}
            </Typography>

            {credit.issuanceDate && (
              <Typography variant="body2">
                Date:{" "}
                {new Date(Number(credit.issuanceDate) * 1000).toISOString()}
              </Typography>
            )}
          </Fragment>
        ))}
      </section>

      <section className={styles.section}>
        <Typography variant="h5">Payments: </Typography>
        {item.payments.map((payment) => (
          <Fragment key={payment.id}>
            <Typography key={payment.id}>
              Payment: {payment.paymentAmount}
            </Typography>

            {payment.paymentDate && (
              <Typography variant="body2">
                Date:{" "}
                {new Date(Number(payment.paymentDate) * 1000).toISOString()}
              </Typography>
            )}
          </Fragment>
        ))}
      </section>

      <section className={styles.section}>
        <Typography variant="h5">Outstanding Debt:</Typography>
        <Typography variant="h3">{totalDebt}</Typography>
      </section>
    </main>
  );
}
