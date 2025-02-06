import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import React from "react";

interface ChartThreeProps {
  series: number[];
}

const options: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#3C50E0", "#6577F3", "#8FD0EF", "#FFB020", "#FF4D4F"],
  labels: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
  legend: {
    show: false,
    position: "bottom",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartThree: React.FC<ChartThreeProps> = ({ series }) => {
  const statusLabels = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  const colors = ["#3C50E0", "#6577F3", "#8FD0EF", "#FFB020", "#FF4D4F"];

  return (
    <div className="flex flex-col bg-white p-6 justify-center rounded-[10px] shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Title */}
      <h3 className="text-lg text-center font-semibold mb-4">Order Status Distribution</h3>

      {/* Chart and Details Container */}
      <div className="flex flex-row justify-center gap-8 md:gap-15">
        {/* Donut Chart */}
        <div className="flex items-center justify-center">
          <ReactApexChart options={options} series={series} type="donut" height={350} />
        </div>

        {/* Text Details */}
        <div className="flex flex-col items-center justify-center md:text-lg">
          <h4 className="text-md font-medium mb-4">Status Breakdown</h4>
          <ul className="space-y-2">
            {series.map((value, index) => (
              <li key={index} className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                ></span>
                <span className="font-medium">{statusLabels[index]}:</span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;