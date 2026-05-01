import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/pages/AddOrder.css"
import { Toaster, toast } from "sonner"

const URL = import.meta.env.VITE_BACKEND_URL;

export const AddOrder = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedClient, setSelectedClient] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [addedProducts, setAddedProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientsRes = await fetch(`${URL}api/serialize-clients`);
                if (clientsRes.ok) {
                    const clientsData = await clientsRes.json();
                    setClients(clientsData);
                }

                const productsRes = await fetch(`${URL}api/serialize-products`);
                if (productsRes.ok) {
                    const productsData = await productsRes.json();
                    setProducts(productsData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleAddToList = () => {
        if (!selectedProduct) {
            toast.error("Selecciona un producto para añadir");
            return;
        }

        const productObj = products.find(p => p.id === parseInt(selectedProduct));
        if (!productObj) return;

        const existingIndex = addedProducts.findIndex(p => p.product_id === productObj.id);

        if (existingIndex >= 0) {
            const newList = [...addedProducts];
            newList[existingIndex].quantity += parseInt(quantity);
            setAddedProducts(newList);
        } else {
            setAddedProducts([
                ...addedProducts,
                {
                    product_id: productObj.id,
                    product_name: productObj.name,
                    quantity: parseInt(quantity),
                    price: productObj.price
                }
            ]);
        }

        setSelectedProduct("");
        setQuantity(1);
    };

    const handleRemoveFromList = (productId) => {
        setAddedProducts(addedProducts.filter(p => p.product_id !== productId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedClient) {
            alert("Por favor, selecciona un cliente");
            return;
        }

        if (addedProducts.length === 0) {
            alert("Por favor, añade al menos un producto a la lista");
            return;
        }

        const payload = {
            client_id: selectedClient,
            products: addedProducts.map(p => ({
                product_id: p.product_id,
                quantity: p.quantity
            }))
        };
        
        const response = await fetch(`${URL}api/add-order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            toast.success("Pedido agregado exitosamente");
            setSelectedClient("");
            setAddedProducts([]);
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } else {
            toast.error("Error al agregar el pedido");
        }
    }

    const calculateTotal = () => {
        return addedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    };

    return (
        <div className="container mt-5 mb-5">
            <Toaster richColors position="top-center" />
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="card shadow-lg border-0 rounded-4 add-order-card">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4 fw-bold add-order-title">Agregar Pedido Múltiple</h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="form-floating mb-4">
                                    <select 
                                        className="form-select rounded-3 border-0 bg-light add-order-input" 
                                        id="clientSelect"
                                        value={selectedClient}
                                        onChange={(e) => setSelectedClient(e.target.value)}
                                        aria-label="Seleccionar Cliente"
                                    >
                                        <option value="" disabled>Selecciona un cliente</option>
                                        {clients.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <label htmlFor="clientSelect" className="text-muted">Cliente Principal</label>
                                </div>

                                <div className="card bg-light border-0 mb-4 p-4 rounded-4 shadow-sm">
                                    <h5 className="mb-3 fw-bold text-muted">Añadir Productos</h5>
                                    <div className="row g-2">
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <select 
                                                    className="form-select rounded-3 border-0 bg-white shadow-sm" 
                                                    id="productSelect"
                                                    value={selectedProduct}
                                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                                >
                                                    <option value="" disabled>Elegir producto...</option>
                                                    {products.map((p) => (
                                                        <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
                                                    ))}
                                                </select>
                                                <label htmlFor="productSelect" className="text-muted">Producto</label>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-floating">
                                                <input 
                                                    type="number" 
                                                    className="form-control rounded-3 border-0 bg-white shadow-sm" 
                                                    id="quantity"
                                                    min="1"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                />
                                                <label htmlFor="quantity" className="text-muted">Cantidad</label>
                                            </div>
                                        </div>
                                        <div className="col-md-3 d-flex align-items-center">
                                            <button 
                                                type="button" 
                                                className="btn btn-primary w-100 h-100 rounded-3 shadow-sm fw-bold"
                                                onClick={handleAddToList}
                                                style={{ background: "#3b82f6", border: "none" }}
                                            >
                                                + Añadir
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {addedProducts.length > 0 && (
                                    <div className="mb-4">
                                        <h5 className="fw-bold mb-3">Productos en el pedido</h5>
                                        <ul className="list-group shadow-sm border-0 rounded-4 mb-3">
                                            {addedProducts.map(p => (
                                                <li key={p.product_id} className="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom bg-white">
                                                    <div>
                                                        <span className="fw-bold me-2">{p.quantity}x</span> 
                                                        {p.product_name}
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <span className="badge bg-light text-dark me-3">${p.price * p.quantity}</span>
                                                        <button 
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger rounded-circle"
                                                            onClick={() => handleRemoveFromList(p.product_id)}
                                                            style={{ width: "30px", height: "30px", padding: 0 }}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                            <li className="list-group-item d-flex justify-content-between align-items-center border-0 bg-light fw-bold text-primary">
                                                <span>Total Estimado:</span>
                                                <span>${calculateTotal()}</span>
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                <button 
                                    type="submit"
                                    className="btn w-100 py-3 rounded-pill fw-bold text-white shadow-sm mt-2 add-order-btn"
                                    disabled={addedProducts.length === 0}
                                >
                                    Guardar Pedido Completo
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>      
        </div>
    )
}