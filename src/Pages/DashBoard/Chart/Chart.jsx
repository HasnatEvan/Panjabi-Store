import { ComposedChart, Tooltip, XAxis, YAxis, Legend, CartesianGrid, Area, Bar, Line, ResponsiveContainer } from "recharts";

const Chart = ({ chartData }) => {
    return (
        <div className="flex justify-center p-4 bg-white shadow-lg rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="order" fill="#8884d8" stroke="#8884d8" />
                    <Bar dataKey="price" barSize={20} fill="#413ea0" />
                    <Line type="monotone" dataKey="quantity" stroke="#ff7300" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;
