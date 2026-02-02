"use client";
import { useState } from "react";
import QRCode from "react-qr-code";
import { type CustomerType } from "../../../prisma/db/customer";

type CustomerCardProps = {
  customer: CustomerType;
};

const CustomerCard = ({ customer }: CustomerCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <section className="px-4 py-8">
      <div className="mx-auto w-full max-w-md">
        <button
          type="button"
          onClick={() => setIsFlipped((prev) => !prev)}
          className="relative aspect-[1.586] w-full [perspective:1200px]"
          aria-pressed={isFlipped}
          aria-label="Flip loyalty card"
        >
          <div
            className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            <div className="absolute inset-0 overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-sky-100 p-6 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] [backface-visibility:hidden]">
              <div className="relative flex h-full flex-col gap-6 text-left text-slate-900">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Loyalty Card
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                      {customer.fullName}
                    </h2>
                  </div>
                  <div className="rounded-full border border-cyan-200/70 bg-cyan-50/80 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-cyan-700">
                    Rank: {customer.rank}
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Points</p>
                    <p className="text-3xl font-semibold text-slate-900">
                      {customer.points.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Card Expiration
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      {customer.cardExpiry}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/70 pt-4 text-xs text-slate-500">
                  <span>Storify Loyalty Card</span>
                  <span>Card • {customer.id}</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-100 via-white to-sky-100 p-6 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="flex h-full items-center justify-center">
                <div className="aspect-square w-40 rounded-2xl border border-cyan-200/70 bg-white p-3 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)]">
                  <QRCode
                    value={`customer:${String(customer.id)}`}
                    size={136}
                    bgColor="#FFFFFF"
                    fgColor="#0f172a"
                    style={{ height: "100%", width: "100%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </button>
        <div className="mt-5 rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-700">
                Level Progress
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {customer.rank}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Current Level</p>
              <p className="text-lg font-semibold text-slate-900">07</p>
            </div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
              style={{ width: "70%" }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Level 07</span>
            <span>70% to Level 08</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerCard;
