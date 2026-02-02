"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Activity, Gift, Megaphone } from "lucide-react";

const CustomerTabs = () => {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)]">
      <Tabs defaultValue="campaigns">
        <TabsList variant="line" className="w-full justify-start gap-6">
          <TabsTrigger value="campaigns" className="gap-2">
            <Megaphone className="size-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Activity className="size-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="redeemed" className="gap-2">
            <Gift className="size-4" />
            Redeemed Items
          </TabsTrigger>
        </TabsList>
        <div className="mt-4 rounded-xl border border-slate-200/70 bg-white p-4">
          <TabsContent value="campaigns">
            <div className="text-slate-500">No active campaigns yet.</div>
          </TabsContent>
          <TabsContent value="activity">
            <div className="text-slate-500">No recent activity.</div>
          </TabsContent>
          <TabsContent value="redeemed">
            <div className="text-slate-500">No redeemed items.</div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CustomerTabs;
