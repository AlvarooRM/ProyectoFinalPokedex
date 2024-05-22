// src/components/RadarChart.jsx
import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = ({ data }) => {
  const chartData = {
    labels: ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'],
    datasets: [
      {
        label: 'Estadísticas de Pokémon',
        data: data,
        backgroundColor: 'rgba(34, 202, 236, .2)',
        borderColor: 'rgba(34, 202, 236, 1)',
        borderWidth: 2,
      },
    ],
  };

  return <Radar data={chartData} />;
};

export default RadarChart;