import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import config from '../shared/config/api';

const { endpoints } = config;

function MultiLineChart({ height = 400 }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({
    nifty: [],
    bankNifty: [],
    reliance: [],
    hdfc: []
  });

  // Fetch real data for each instrument
  const fetchInstrumentData = async (symbol) => {
    try {
      const response = await fetch(`${endpoints.indianMarketData}?symbol=${symbol}&interval=1d`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Transform data to line chart format
      let transformedData = data.map(item => ({
        time: Number(item.time),
        value: Number(item.close) // Use close price for line chart
      }));

      // Sort data by time in ascending order
      transformedData.sort((a, b) => a.time - b.time);

      // Limit to last 300 candles
      if (transformedData.length > 300) {
        transformedData = transformedData.slice(-300);
        console.log(`${symbol}: Limited to last 300 candles`);
      }

      return transformedData;
    } catch (err) {
      console.error(`Error fetching ${symbol} data:`, err);
      // Return empty array if API fails
      return [];
    }
  };

  // Fetch all instrument data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [niftyData, bankNiftyData, relianceData, hdfcData] = await Promise.all([
        fetchInstrumentData('NIFTY'),
        fetchInstrumentData('BANKNIFTY'),
        fetchInstrumentData('RELIANCE'),
        fetchInstrumentData('HDFC')
      ]);

      setChartData({
        nifty: niftyData,
        bankNifty: bankNiftyData,
        reliance: relianceData,
        hdfc: hdfcData
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError('Failed to fetch market data');
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Create chart when data is available
  useEffect(() => {
    if (!chartContainerRef.current || loading) return;

    // Clean up previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    try {
      // Chart options based on your provided code
      const chartOptions = {
        layout: {
          textColor: '#ffffff',
          background: { type: 'solid', color: '#000000' },
        },
        grid: {
          vertLines: { color: '#333333' },
          horzLines: { color: '#333333' },
        },
        width: chartContainerRef.current.clientWidth,
        height: height,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          visible: true,
          borderVisible: false,
        },
      };

      const chart = createChart(chartContainerRef.current, chartOptions);
      chartRef.current = chart;

      // Create four line series with different colors
      const niftySeries = chart.addLineSeries({
        color: '#2962FF',
        lineWidth: 2,
        title: 'NIFTY'
      });

      const bankNiftySeries = chart.addLineSeries({
        color: 'rgb(225, 87, 90)',
        lineWidth: 2,
        title: 'BankNifty'
      });

      const relianceSeries = chart.addLineSeries({
        color: 'rgb(242, 142, 44)',
        lineWidth: 2,
        title: 'Reliance'
      });

      const hdfcSeries = chart.addLineSeries({
        color: '#10b981',
        lineWidth: 2,
        title: 'HDFC'
      });

      // Set real data for each series
      if (chartData.nifty.length > 0) {
        niftySeries.setData(chartData.nifty);
      }
      if (chartData.bankNifty.length > 0) {
        bankNiftySeries.setData(chartData.bankNifty);
      }
      if (chartData.reliance.length > 0) {
        relianceSeries.setData(chartData.reliance);
      }
      if (chartData.hdfc.length > 0) {
        hdfcSeries.setData(chartData.hdfc);
      }

      // Fit content to view
      chart.timeScale().fitContent();

      // Handle resize
      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: height
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
      };

    } catch (err) {
      console.error('Error creating multi-line chart:', err);
      setError('Failed to create chart');
    }
  }, [chartData, loading, height]);

  if (loading) {
    return (
      <div style={{
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div>Loading chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fee2e2',
        borderRadius: '8px',
        color: '#dc2626'
      }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: '100%',
        height: height,
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  );
}

export default MultiLineChart; 