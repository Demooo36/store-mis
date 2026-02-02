import { ShoppingBag } from "lucide-react";
import React from "react";

const TestLogo = () => {
  return (
    <div className="flex flex-row items-center gap-2">
      <ShoppingBag />
      <h1 className="text-2xl font-bold">Storify</h1>
    </div>
  );
};

export default TestLogo;
