import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const URL = import.meta.env.VITE_BACKEND_URL;

export const ListOfDeliveredOrders = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${URL}api/orders`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handlePay = async (id) => {
        try {
            const res = await fetch(`${URL}api/orders/${id}/pay`, { method: "PUT" });
            if (res.ok) {
                fetchOrders(); // Refresh the list to get payment date
            } else {
                alert("Error al actualizar la orden");
            }
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro de eliminar este pedido?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${URL}api/orders/${id}`, { 
                    method: "DELETE" });
                if (res.ok) {
                    setOrders(orders.filter(order => order.id !== id));
                    Swal.fire({
                        title: "Pedido eliminado exitosamente",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        title: "Error al eliminar el pedido",
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Error al eliminar el pedido",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false
                })
            }
        }

    };

    const formatDate = (isoString) => {
        if (!isoString) return "-";
        const date = new Date(isoString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const todayDate = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="container mt-5">
            <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-4">
                    <h2 className="text-center fw-bold mb-4" style={{ color: "#474747ff" }}>Lista de Pedidos</h2>
                    
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <p className="text-muted m-0 fw-medium">
                            <i className="fa-regular fa-calendar me-2"></i>
                            Hoy es: <span className="text-dark text-capitalize">{todayDate}</span>
                        </p>
                        <Link className="btn text-white rounded-pill px-4 shadow-sm" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" }} to="/add-order">
                            <i className="fa-solid fa-plus me-2"></i> Agregar pedido
                        </Link>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Cliente</th>
                                    <th>Productos</th>
                                    <th className="text-center">Total</th>
                                    <th>Fecha de Entrega</th>
                                    <th>Fecha de Pago</th>
                                    <th className="text-center">Estado</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4 text-muted">No hay pedidos registrados</td>
                                    </tr>
                                ) : (
                                    orders.map(order => (
                                        <tr key={order.id}>
                                            <td className="fw-medium">{order.client_name}</td>
                                            <td>
                                                <ul className="list-unstyled m-0 small">
                                                    {order.products?.map((p, idx) => (
                                                        <li key={idx}>
                                                            <span className="fw-bold">{p.quantity}x</span> {p.product_name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="text-center fw-bold text-success">
                                                ${order.products?.reduce((sum, p) => sum + (p.price * p.quantity), 0)}
                                            </td>
                                            <td className="text-muted small">{formatDate(order.delivered_date)}</td>
                                            <td className="text-muted small">
                                                {order.delivered ? <span className="text-success">{formatDate(order.payment_date)}</span> : <span>Pendiente</span>}
                                            </td>
                                            <td className="text-center">
                                                {order.delivered ? (
                                                    <span className="badge bg-success rounded-pill px-3">Pagado</span>
                                                ) : (
                                                    <span className="badge bg-warning text-dark rounded-pill px-3">Pendiente</span>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center gap-2">
                                                    {!order.delivered && (
                                                        <button 
                                                            className="btn btn-sm btn-outline-success rounded-circle" 
                                                            onClick={() => handlePay(order.id)}
                                                            title="Marcar como pagado"
                                                            style={{ width: "32px", height: "32px", padding: 0 }}
                                                        >
                                                            ✓
                                                        </button>
                                                    )}
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger rounded-circle" 
                                                        onClick={() => handleDelete(order.id)}
                                                        title="Eliminar pedido"
                                                        style={{ width: "32px", height: "32px", padding: 0 }}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}