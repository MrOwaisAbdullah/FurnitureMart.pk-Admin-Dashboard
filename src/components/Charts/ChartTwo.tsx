import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface ChartTwoProps {
  orders: any[];
}

const ChartTwo: React.FC<ChartTwoProps> = ({ orders }) => {
  // Group orders by day of the week
  const weeklyPerformance = Array(7).fill(0);
  orders.forEach((order) => {
    const date = new Date(order._createdAt);
    const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    weeklyPerformance[dayOfWeek] += order.total;
  });

  const series = [
    {
      name: "Sales",
      data: weeklyPerformance,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    colors: ["#3C50E0"],
  };

  return (
    <div className="bg-white p-6 rounded-[10px] shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-lg font-semibold mb-4">Weekly Performance</h3>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default ChartTwo;