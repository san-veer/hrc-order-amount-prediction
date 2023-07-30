import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';

const PieChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current && data) {
            const hasDistributionChannel = data[0].hasOwnProperty('distributionChannel');

            const seriesData = hasDistributionChannel
                ? data.map(entry => ({
                    name: entry.distributionChannel,
                    y: entry.totalAmount,
                }))
                : data.map(entry => ({
                    name: entry.customerCount,
                    y: entry.totalAmount,
                }));
            console.log(hasDistributionChannel)

            Highcharts.chart(chartRef.current, {
                chart: {
                    type: 'pie',
                    backgroundColor: '#666666',
                },
                title: {
                    text: 'Total Amount by Distribution Channel',
                },
                series: [{
                    name: hasDistributionChannel ? 'Distribution Channel' : 'Customer Count',
                    data: seriesData,
                }],
            });
        }
    }, [data]);

    return (
        <div ref={chartRef}></div>
    );
};

export default PieChart;
