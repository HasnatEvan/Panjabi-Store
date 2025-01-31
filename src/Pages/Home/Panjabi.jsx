import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Card from "./Card";

const Panjabi = () => {
    // Fetching the panjabi data using react-query
    const { data: panjabis, isLoading, isError } = useQuery({
        queryKey: ['panjabi'],
        queryFn: async () => {
            const { data } = await axios.get("http://localhost:5000/panjabi"); // Correct endpoint
            return data;
        },
    });

    // If loading, show loading spinner
    if (isLoading) return <div>Loading...</div>;

    // If there's an error, show an error message
    if (isError) return <div>Error loading data.</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6">
            {/* Loop through panjabis data and render Card components */}
            {panjabis?.map((panjabi) => (
                <Card key={panjabi._id} panjabi={panjabi} /> // Passing data to Card component
            ))}
        </div>
    );
};

export default Panjabi;
