import { useState } from 'react';
import { imageUpload } from '../../../Api/utils';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

const AddItem = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        
        const name = form.name.value;
        const price = parseFloat(form.price.value);
        const quantity = parseInt(form.quantity.value);
        const category = form.category.value;
        const description = form.description.value;
        const sizeS = parseInt(form.sizeS.value) || 0;
        const sizeM = parseInt(form.sizeM.value) || 0;
        const sizeL = parseInt(form.sizeL.value) || 0;
        const imageFile = form.image.files[0];

        if (!imageFile) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Please upload an image!',
            });
            return;
        }

        try {
            const imageUrl = await imageUpload(imageFile);
            
            if (!imageUrl) {
                Swal.fire({
                    icon: 'error',
                    title: 'Upload Failed!',
                    text: 'Image upload failed. Try again.',
                });
                return;
            }

            // Seller Info
            const seller = {
                name: user?.displayName,
                image: user?.photoURL,
                email: user?.email,
            };

            // Create Item Data Object
            const panjabiData = {
                name,
                price,
                quantity,
                category,
                description,
                sizeS,
                sizeM,
                sizeL,
                image: imageUrl,
                seller,
            };

            console.log("Submitting Data:", panjabiData);

            // Save to Database
            const { data } = await axiosSecure.post('/panjabi', panjabiData);
            
            if (data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: '🎉 Item added successfully!',
                });
                form.reset(); // ✅ ফর্ম রিসেট
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed!',
                    text: '⚠️ Failed to add item. Try again.',
                });
            }

        } catch (error) {
            console.error("Error adding item:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Something went wrong. Try again.',
            });
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Add Item</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                    <label htmlFor="name" className="label">Item Name</label>
                    <input type="text" id="name" name="name" className="input input-bordered w-full" required />
                </div>

                <div className="form-control">
                    <label htmlFor="price" className="label">Price</label>
                    <input type="number" id="price" name="price" className="input input-bordered w-full" required />
                </div>

                <div className="form-control">
                    <label htmlFor="quantity" className="label">Quantity</label>
                    <input type="number" id="quantity" name="quantity" className="input input-bordered w-full" required />
                </div>

                <div className="form-control">
                    <label htmlFor="category" className="label">Category</label>
                    <input type="text" id="category" name="category" className="input input-bordered w-full" required />
                </div>

                <div className="form-control">
                    <label htmlFor="image" className="label">Image</label>
                    <input type="file" id="image" name="image" accept="image/*" className="input input-bordered w-full" required />
                </div>

                <div className="form-control">
                    <label htmlFor="description" className="label">Description</label>
                    <textarea id="description" name="description" className="textarea textarea-bordered w-full" required />
                </div>

                {/* Sizes */}
                <div className="form-control">
                    <label htmlFor="sizeS" className="label">Small Size</label>
                    <input type="number" id="sizeS" name="sizeS" className="input input-bordered w-full" placeholder="Enter quantity for Small" />
                </div>

                <div className="form-control">
                    <label htmlFor="sizeM" className="label">Medium Size</label>
                    <input type="number" id="sizeM" name="sizeM" className="input input-bordered w-full" placeholder="Enter quantity for Medium" />
                </div>

                <div className="form-control">
                    <label htmlFor="sizeL" className="label">Large Size</label>
                    <input type="number" id="sizeL" name="sizeL" className="input input-bordered w-full" placeholder="Enter quantity for Large" />
                </div>

                <button type="submit" className="btn btn-primary w-full">Add Item</button>
            </form>
        </div>
    );
};

export default AddItem;
