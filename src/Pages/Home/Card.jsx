import { Link } from "react-router-dom";

const Card = ({ panjabi }) => {
    // Destructuring the panjabi object to access its properties
    const { name, description, image, price, quantity, sizeS, sizeM, sizeL, seller, _id } = panjabi;

    return (
        <Link to={`/panjabi/${_id}`}>
            <div className="card  rounded-lg shadow-md p-4">
                <img src={image} alt={name} className="card-img w-full h-64 object-cover mb-4 rounded-lg" />

                <h3 className="text-xl font-bold mb-2">{name}</h3>
                <p className="text-lg font-semibold mb-2">Price: ${price}</p>
            </div>
        </Link>
    );
};

export default Card;
