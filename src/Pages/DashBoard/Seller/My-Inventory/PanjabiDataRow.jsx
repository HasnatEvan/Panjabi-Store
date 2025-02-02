import React from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';
import { Link } from 'react-router-dom';

const PanjabiDataRow = ({ panjabis, refetch }) => {
    const axiosSecure = useAxiosSecure();
    const { _id, name, image, price, quantity } = panjabis;

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You won't be able to revert this!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/panjabi/${_id}`);
                refetch();
                Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting item:', error);
                Swal.fire('Error!', 'Something went wrong!', 'error');
            }
        }
    };

    return (
        <tr className="border-b hover:bg-gray-50 text-center">
            <td className="px-6 py-3">
                <img src={image} alt={name} className="w-20 h-20 object-cover rounded-md" />
            </td>
            <td className="px-6 py-3">{name}</td>
            <td className="px-6 py-3">${price}</td>
            <td className="px-6 py-3">{quantity}</td>
            <td className="px-6 py-3">
                <div className="flex justify-center space-x-2">
                    <Link to={`/dashboard/update-panjabi/${_id}`}>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition">
                            Update
                        </button>
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default PanjabiDataRow;
