import { useState } from "react";
import CalculatorComponent from "../components/CalculatorComponent";
import DevicesComponent from "../components/DevicesComponent";
import Navbar from "../components/Navbar";
import SearchComponent from "../components/SearchComponent";

function Calculator() {
  const [usageList, setUsageList] = useState<
    { id: number; name: string; hours: number }[]
  >([]);

  const handleAddDevice = (device: {
    id: number;
    name: string;
    hours: number;
  }) => {
    setUsageList((prev) => {
      const existing = prev.find((d) => d.id === device.id);
      if (existing) {
        return prev.map((d) => (d.id === device.id ? device : d));
      }
      return [...prev, device];
    });
  };
  return (
    <div className="main">
      <Navbar />
      <div className="mx-6 flex flex-wrap">
        <div className="flex flex-wrap w-full md:w-2/3">
          <div className="w-full">
            <SearchComponent />
          </div>
          <div className="w-full">
            <DevicesComponent onAddDevice={handleAddDevice} />
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <CalculatorComponent usageList={usageList} />
        </div>
      </div>
    </div>
  );
}

export default Calculator;
