import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { imageUpload } from "../../../../Api/utils";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const UpdatePanjabi = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [panjabi, setPanjabi] = useState(null);
    const [previewImage, setPreviewImage] = useState(""); // New Image Preview
    const [loading, setLoading] = useState(true);

    // 🔹 আগের তথ্য লোড করা
    useEffect(() => {
        axiosSecure.get(`/panjabi/${id}`)
            .then(res => {
                setPanjabi(res.data);
                setPreviewImage(res.data.image);
                setLoading(false);
            })
            .catch(err => console.error("Error fetching data:", err));
    }, [id, axiosSecure]);

    // 🔹 ইনপুট হ্যান্ডলার
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPanjabi(prev => ({ ...prev, [name]: value }));
    };

    // 🔹 ইমেজ আপলোড হ্যান্ডলার
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file)); // Preview Update
        } else {
            setPreviewImage(panjabi.image); // আগের ইমেজ রেখে দেওয়া
        }
    };

    // 🔹 ফর্ম সাবমিট হ্যান্ডলার
    const handleSubmit = async (e) => {
        e.preventDefault();
        let imageUrl = panjabi.image;

        const form = e.target;
        const imageFile = form.image.files[0];

        if (imageFile) {
            imageUrl = await imageUpload(imageFile);
            if (!imageUrl) {
                Swal.fire("Upload Failed!", "Image upload failed. Try again.", "error");
                return;
            }
        }

        const updatedPanjabi = {
            ...panjabi,
            price: parseFloat(panjabi.price),
            quantity: parseInt(panjabi.quantity) || 0,
            sizeS: parseInt(panjabi.sizeS) || 0,
            sizeM: parseInt(panjabi.sizeM) || 0,
            sizeL: parseInt(panjabi.sizeL) || 0,
            image: imageUrl,
        };

        try {
            const { data } = await axiosSecure.put(`/panjabi/${id}`, updatedPanjabi);
            if (data.modifiedCount > 0) {
                Swal.fire("Updated!", data.message || "Panjabi updated successfully!", "success");
                navigate("/dashboard/panjabi-list");
            } else {
                Swal.fire("No Changes!", data.message || "No updates were made.", "info");
            }
        } catch (error) {
            console.error("Error updating panjabi:", error);
            Swal.fire("Error!", "Something went wrong. Try again.", "error");
        }
    };

    if (loading) {
        return <p className="text-center text-lg font-bold">Loading...</p>;
    }

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold text-center mb-4">Update Panjabi</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="label">Item Name</label>
                    <input
                        type="text"
                        name="name"
                        value={panjabi.name}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={panjabi.price}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={panjabi.quantity}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">Category</label>
                    <input
                        type="text"
                        name="category"
                        value={panjabi.category}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">Image (Upload New if Needed)</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="input input-bordered w-full"
                        onChange={handleImageChange}
                    />
                    {previewImage && (
                        <img src={previewImage} alt="Panjabi" className="mt-2 w-32 h-32 object-cover rounded-md" />
                    )}
                </div>

                <div className="form-control">
                    <label className="label">Description</label>
                    <textarea
                        name="description"
                        value={panjabi.description}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full"
                        required
                    />
                </div>

                {/* Sizes */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="form-control">
                        <label className="label">Small</label>
                        <input
                            type="number"
                            name="sizeS"
                            value={panjabi.sizeS}
                            onChange={handleChange}
                            className="input input-bordered"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">Medium</label>
                        <input
                            type="number"
                            name="sizeM"
                            value={panjabi.sizeM}
                            onChange={handleChange}
                            className="input input-bordered"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">Large</label>
                        <input
                            type="number"
                            name="sizeL"
                            value={panjabi.sizeL}
                            onChange={handleChange}
                            className="input input-bordered"
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-full">
                    Update Panjabi
                </button>
            </form>
        </div>
    );
};

export default UpdatePanjabi;
