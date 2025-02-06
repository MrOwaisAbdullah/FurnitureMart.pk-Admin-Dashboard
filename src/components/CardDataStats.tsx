import React from "react";

interface CardDataStatsProps {
  title: string;
  total: string | number;
  rate?: string;
  levelUp?: boolean;
  levelDown?: boolean;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
}) => {
  return (
    <div className="bg-white p-6 rounded-[10px] text-center shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">{total}</p>
      {rate && (
        <p className={`text-sm ${levelUp ? "text-green-500" : "text-red-500"}`}>
          {levelUp ? "▲" : "▼"} {rate}
        </p>
      )}
    </div>
  );
};

export default CardDataStats;