import React from "react";
import RecentInsightWidget from "@views/dashboard/components/recent-insight-widget";
import TodayWidget from "@views/dashboard/components/today-widget";
import MonthRevenueCompareWidget from "@views/dashboard/components/month-revenue-compare-widget";
import MonthRevenue from "@views/dashboard/components/month-revenue";

const Index = () => {
  return (
    <div className="grid gap-4 p-4 sm:p-0">
      <div className="grid md:grid-cols-3 gap-4">
        <TodayWidget />
        <RecentInsightWidget />
        <MonthRevenueCompareWidget />
      </div>
      <MonthRevenue />
    </div>
  );
};

export default Index;
