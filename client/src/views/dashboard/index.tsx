import React from "react";
import RecentInsightWidget from "@views/dashboard/components/recent-insight-widget";
import TodayWidget from "@views/dashboard/components/today-widget";
import MonthRevenueCompareWidget from "@views/dashboard/components/month-revenue-compare-widget";

const Index = () => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="grid gap-4">
        <TodayWidget />
        <RecentInsightWidget />
      </div>
      <div>
        <MonthRevenueCompareWidget />
      </div>
    </div>
  );
};

export default Index;
