"use client";

import CustomerCard from "./customer-card";
import CustomerTabs from "./customer-tabs";
import { customer } from "../../../prisma/db/customer";

const CustomerHome = () => {
  return (
    <section className="space-y-6">
      <CustomerCard customer={customer} />
      <CustomerTabs />
    </section>
  );
};

export default CustomerHome;
