import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';

const BarGraph = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && data) {
      const hasDistributionChannel = data[0].hasOwnProperty('distributionChannel');

      const categories = hasDistributionChannel
        ? data.map(entry => entry.distributionChannel)
        : data.map(entry => entry.customerCount);

      Highcharts.chart(chartRef.current, {
        chart: {
          type: 'column',
          backgroundColor: '#666666',
        },
        title: {
          text: 'Total Amount by Distribution Channel',
        },
        xAxis: {
          categories: categories,
          labels: {
            rotation: -45,
          },
        },
        yAxis: {
          title: {
            text: 'Total Amount',
          },
        },
        series: [{
          name: 'Total Amount',
          data: data.map(entry => entry.totalAmount),
        }],
      });
    }

  }, [data]);

  return (
    <div ref={chartRef}></div>
  );
};

export default BarGraph;
