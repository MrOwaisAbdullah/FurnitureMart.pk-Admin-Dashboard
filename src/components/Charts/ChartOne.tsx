import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface ChartOneProps {
  orders: any[];
}

const ChartOne: React.FC<ChartOneProps> = ({ orders }) => {
  // Calculate monthly sales trend
  const getMonthlySalesTrend = () => {
    const monthlySales: { [key: string]: number } = {};
    orders.forEach((order) => {
      const date = new Date(order._createdAt);
      const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
      monthlySales[monthYear] = (monthlySales[monthYear] || 0) + order.total;
    });
    return Object.entries(monthlySales).map(([month, sales]) => ({
      month,
      sales,
    }));
  };

  const monthlySalesData = getMonthlySalesTrend();

  const series = [
    {
      name: "Sales",
      data: monthlySalesData.map((item) => item.sales),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
    },
    xaxis: {
      categories: monthlySalesData.map((item) => item.month),
    },
    colors: ["#3C50E0"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-[10px] shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-lg font-semibold mb-4">Monthly Sales Trend</h3>
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </div>
  );
};

export default ChartOne;