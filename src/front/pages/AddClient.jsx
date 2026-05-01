import { useState } from "react"
import "../styles/pages/AddClient.css"

const initialClientState = {
    "name": ""
}

const URL = import.meta.env.VITE_BACKEND_URL;

export const AddClient = () => {

    const [client, setClient] = useState(initialClientState);

    const handleOnChange = ({target}) => {
        setClient({
            ...client,
            [target.name]: target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("name", client.name);
        
        const response = await fetch(`${URL}api/add-client`, {
            method: "POST",
            body: formData
        })

        if (response.ok) {
            alert("Cliente agregado exitosamente");
            setClient(initialClientState);
        } else if(response.status == 409){
            alert("Este cliente ya existe")
        } else if(response.status == 400){
            alert("Por favor, ingresa todos los campos")
        } else {
            alert("Error al agregar el cliente")
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0 rounded-4 add-client-card">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4 fw-bold add-client-title">Agregar Cliente</h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="form-floating mb-4">
                                    <input 
                                        type="text" 
                                        className="form-control rounded-3 border-0 bg-light add-client-input" 
                                        id="name"
                                        name="name"
                                        placeholder="Nombre del Cliente"
                                        value={client.name}
                                        onChange={handleOnChange}
                                    />
                                    <label htmlFor="name" className="text-muted">Nombre del Cliente</label>
                                </div>

                                <button 
                                    className="btn w-100 py-3 rounded-pill fw-bold text-white shadow-sm mt-3 add-client-btn"
                                >
                                    Guardar Cliente
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>      
        </div>
    )
}