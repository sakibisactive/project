import React, { useState, useRef, useEffect  } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './PriceAnalysis.css';

// 64 Districts of Bangladesh (alphabetically sorted)
const DISTRICTS = [
  'Barisal', 'Bhola', 'Jhalokati', 'Pirojpur', 'Chittagong', 'Chandpur', 'Cumilla', "Cox's Bazar", 'Feni', 'Khagrachari',
  'Lakshmipur', 'Rangamati', 'Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Jamuna', 'Manikganj', 'Narayanganj', 'Narsingdi',
  'Shariatpur', 'Tangail', 'Khulna', 'Bagerhat', 'Jessore', 'Khulna', 'Satkhira', 'Mymensingh', 'Jamalpur', 'Mymensingh',
  'Netrokona', 'Sherpur', 'Rajshahi', 'Bogra', 'Joypurhat', 'Natore', 'Naogaon', 'Pabna', 'Rajshahi', 'Sirajganj', 'Rangpur',
  'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon', 'Sylhet', 'Habiganj',
  'Moulvibazar', 'Sunamganj', 'Sylhet'
].sort();

const PROPERTY_TYPES = ['Plot', 'Apartment', 'Building'];

const PriceAnalysis = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLocation || !selectedPropertyType) {
      setError('Please select both location and property type');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/price-analysis?location=${selectedLocation}&propertyType=${selectedPropertyType}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch price analysis data');
      }

      const resData = await response.json();
      // Fix: use the backend array only!
      const chartData = (resData.data || []).map(item => ({
        year: item.year,
        price: item.averagePrice
      }));

      setGraphData(chartData.length > 0 ? chartData : null);
      if (chartData.length > 0 && chartRef.current) {
  setTimeout(() => {
    chartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100); // Delay after setGraphData to ensure render
}
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      setGraphData(null);
      console.error('Price Analysis Error:', err);
    } finally {
      setLoading(false);
    }
  };
  const chartRef = useRef(null);
  useEffect(() => {
  if (graphData && chartRef.current) {
    chartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}, [graphData]);
  return (
    <div className="price-analysis-container">
      <div className="price-analysis-header">
        <h1>Price Analysis</h1>
        <p>Analyze property prices in your desired location</p>
      </div>
      {/* Filter Form */}
      <div className="price-analysis-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="location">Select Location</label>
            <select
              id="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="dropdown"
            >
              <option value="">-- Select District --</option>
              {DISTRICTS.map((district, idx) => (
                <option key={idx} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="propertyType">Select Property Type</label>
            <select
              id="propertyType"
              value={selectedPropertyType}
              onChange={(e) => setSelectedPropertyType(e.target.value)}
              className="dropdown"
            >
              <option value="">-- Select Property Type --</option>
              {PROPERTY_TYPES.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Loading...' : 'Submit & Analyze'}
          </button>
        </form>
      </div>
      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      {/* Chart Section */}
      {graphData && (
        <div className="chart-section" ref={chartRef}>
          <div className="chart-header">
            <h2>{selectedLocation} - {selectedPropertyType} Price Analysis</h2>
            <p className="chart-subtitle">Average prices by year</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={420}>
  <LineChart
    data={graphData}
    margin={{ top: 30, right: 50, left: 60, bottom: 30 }}
  >
    <CartesianGrid strokeDasharray="5 5" stroke="#DDD" />
    <XAxis
      dataKey="year"
      tickFormatter={year => year.toString()}
      tick={{ fontSize: 16, fontWeight: 700, fill: '#222' }}
      label={{
        value: 'YEAR',
        position: 'insideBottom',
        offset: -20,
        fontWeight: 800,
        fontSize: 18,
        fill: "#445"
      }}
    />
    <YAxis
      tickFormatter={(value) => value.toLocaleString()}
      tick={{ fontSize: 16, fontWeight: 700, fill: '#222' }}
      label={{
        value: 'Price',
        angle: -90,
        position: 'insideRight',
        offset: 100,
        fontWeight: 800,
        fontSize: 18,
        fill: "#445"
      }}
      domain={[0, 'auto']}
    />
    <Tooltip
      formatter={(value) => `TK ${value.toLocaleString()}`}
      labelFormatter={(label) => `Year: ${label}`}
      cursor={{ stroke: "#aaa", strokeWidth: 2 }}
    />
    
    <Line
      type="monotone"
      dataKey="price"
      stroke="#0080ff"
      fill="#0080ff"
      dot={{ fill: '#ff9933', r: 7, stroke: '#0080ff', strokeWidth: 2 }}
      activeDot={{ r: 10, fill: '#fff', stroke: "#0080ff", strokeWidth: 3 }}
      name="Average Price"
      strokeWidth={4}
    />
  </LineChart>
</ResponsiveContainer>

          </div>
          {/* Price Summary */}
          {graphData.length > 1 &&
          <div className="price-summary" style={{
  margin: "2em 0",
  display: "flex",
  flexWrap: "wrap",
  gap: "3em",
  background: "#f8faff",
  padding: "1.5em",
  borderRadius: "14px",
  fontSize: "1.3em",
  fontWeight: 600
}}>
  <div>
    <h4>Starting Price ({graphData[0].year})</h4>
    <p style={{ color: "#0080ff" }}>TK {graphData[0].price?.toLocaleString()}</p>
  </div>
  <div>
    <h4>Latest Price ({graphData[graphData.length - 1].year})</h4>
    <p style={{ color: "#ff9933" }}>TK {graphData[graphData.length - 1].price?.toLocaleString()}</p>
  </div>
  <div>
    <h4>Price Increase</h4>
    <p style={{ color: "#22bb55" }}>
      TK {(graphData[graphData.length - 1].price - graphData[0].price)?.toLocaleString()}
    </p>
  </div>
  <div>
    <h4>Growth Rate</h4>
    <p style={{ color: "#e43" }}>
      {(((graphData[graphData.length - 1].price - graphData[0].price) / graphData[0].price) * 100).toFixed(2)}%
    </p>
  </div>
</div>

          }
        </div>
      )}
      {/* No Data Message */}
      {!graphData && !loading && (
        <div className="no-data-message">
          <p>Select location and property type, then click "Submit & Analyze" to view price trends</p>
        </div>
      )}
    </div>
  );
};

export default PriceAnalysis;
