import { useState } from "react"
import "../styles/pages/AddProduct.css"

const initialProductState = {
    "name": "",
    "price": ""
}

const URL = import.meta.env.VITE_BACKEND_URL;

export const AddProduct = () => {

    const [product, setProduct] = useState(initialProductState);

    const handleOnChange = ({target}) => {
        setProduct({
            ...product,
            [target.name]: target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();

        formData.append("name", product.name);
        formData.append("price", product.price);
        
        const response = await fetch(`${URL}api/add-product`, {
            method: "POST",
            body: formData
        })

        if (response.ok) {
            alert("Producto agregado exitosamente");
            setProduct(initialProductState);
        } else if(response.status == 409){
            alert("El producto ya existe")
        } else if(response.status == 400){
            alert("Por favor, ingresa todos los campos")
        } else {
            alert("Error al agregar el producto")
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0 rounded-4 add-product-card">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4 fw-bold add-product-title">Agregar Producto</h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="form-floating mb-4">
                                    <input 
                                        type="text" 
                                        className="form-control rounded-3 border-0 bg-light add-product-input" 
                                        id="name"
                                        name="name"
                                        placeholder="Nombre del Producto"
                                        value={product.name}
                                        onChange={handleOnChange}
                                    />
                                    <label htmlFor="name" className="text-muted">Nombre del Producto</label>
                                </div>

                                <div className="form-floating mb-4">
                                    <input 
                                        type="number" 
                                        className="form-control rounded-3 border-0 bg-light add-product-input" 
                                        id="price"
                                        name="price"
                                        placeholder="Precio"
                                        value={product.price}
                                        onChange={handleOnChange}
                                    />
                                    <label htmlFor="price" className="text-muted">Precio ($)</label>
                                </div>

                                <button 
                                    className="btn w-100 py-3 rounded-pill fw-bold text-white shadow-sm mt-3 add-product-btn"
                                >
                                    Guardar Producto
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>      
        </div>
    )
}
