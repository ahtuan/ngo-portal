import React from "react";
import Category from "@views/category";
import WeightWidget from "@views/inventory/weight-widget";
import DetectInventory from "@views/product/components/detect-inventory";

const Index = () => {
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <div> Test</div>
        </div>
      </div>
      <div className="grid gap-4">
        <Category />
        <WeightWidget />
        <DetectInventory />
      </div>
    </div>
  );
};

export default Index;
