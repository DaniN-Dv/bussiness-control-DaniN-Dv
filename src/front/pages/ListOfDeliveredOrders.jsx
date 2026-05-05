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
                    method: "DELETE"
                });
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
            <div className="card border rounded-3 shadow-none">
                <div className="card-body p-4 p-md-5">
                    <h2 className="text-center fw-light mb-5" style={{ color: "#111827", letterSpacing: "-0.5px" }}>Lista de Pedidos</h2>
                    
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 border-bottom pb-3 gap-3">
                        <p className="text-muted m-0 small">
                            {todayDate}
                        </p>
                        <Link className="btn btn-dark rounded-pill px-4 text-white w-100 w-md-auto text-center" style={{ fontSize: "0.9rem" }} to="/add-order">
                            <i className="fa-solid fa-plus me-2"></i> Nuevo Pedido
                        </Link>
                    </div>

                    {/* Desktop View (Table) */}
                    <div className="table-responsive d-none d-md-block">
                        <table className="table table-borderless align-middle" style={{ fontSize: "0.95rem" }}>
                            <thead className="border-bottom text-muted">
                                <tr>
                                    <th className="fw-normal pb-3">Cliente</th>
                                    <th className="fw-normal pb-3">Productos</th>
                                    <th className="text-center fw-normal pb-3">Total</th>
                                    <th className="fw-normal pb-3">Entrega</th>
                                    <th className="fw-normal pb-3">Pago</th>
                                    <th className="text-center fw-normal pb-3">Estado</th>
                                    <th className="text-end fw-normal pb-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5 text-muted small">No hay pedidos registrados</td>
                                    </tr>
                                ) : (
                                    orders.map(order => (
                                        <tr key={order.id} className="border-bottom">
                                            <td className="fw-medium text-dark py-4">{order.client_name}</td>
                                            <td className="py-4">
                                                <ul className="list-unstyled m-0 text-muted">
                                                    {order.products?.map((p, idx) => (
                                                        <li key={idx} className="mb-1">
                                                            <span>{p.quantity} × {p.product_name}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="text-center text-dark py-4">
                                                ${order.products?.reduce((sum, p) => sum + (p.price * p.quantity), 0)}
                                            </td>
                                            <td className="text-muted py-4">{formatDate(order.delivered_date)}</td>
                                            <td className="text-muted py-4">
                                                {order.delivered ? formatDate(order.payment_date) : "-"}
                                            </td>
                                            <td className="text-center py-4">
                                                {order.delivered ? (
                                                    <span className="text-success small fw-medium"><i className="fa-solid fa-circle me-1" style={{ fontSize: "6px", verticalAlign: "middle" }}></i> Pagado</span>
                                                ) : (
                                                    <span className="text-warning small fw-medium"><i className="fa-solid fa-circle me-1" style={{ fontSize: "6px", verticalAlign: "middle" }}></i> Pendiente</span>
                                                )}
                                            </td>
                                            <td className="text-end py-4">
                                                <div className="d-flex justify-content-end gap-3">
                                                    {!order.delivered && (
                                                        <button 
                                                            className="btn btn-link text-success p-0 text-decoration-none small" 
                                                            onClick={() => handlePay(order.id)}
                                                            title="Marcar como pagado"
                                                        >
                                                            Pagar
                                                        </button>
                                                    )}
                                                    <button 
                                                        className="btn btn-link text-danger p-0 text-decoration-none small" 
                                                        onClick={() => handleDelete(order.id)}
                                                        title="Eliminar pedido"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View (Cards) */}
                    <div className="d-block d-md-none">
                        {orders.length === 0 ? (
                            <div className="text-center py-5 text-muted small border rounded-3">
                                No hay pedidos registrados
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className="card border mb-4 rounded-3 shadow-none">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-medium m-0 text-dark">{order.client_name}</h6>
                                            {order.delivered ? (
                                                <span className="text-success small fw-medium"><i className="fa-solid fa-circle me-1" style={{ fontSize: "6px", verticalAlign: "middle" }}></i> Pagado</span>
                                            ) : (
                                                <span className="text-warning small fw-medium"><i className="fa-solid fa-circle me-1" style={{ fontSize: "6px", verticalAlign: "middle" }}></i> Pendiente</span>
                                            )}
                                        </div>
                                        <div className="mb-4 text-muted small">
                                            <div className="d-flex justify-content-between mb-1">
                                                <span>Entrega</span>
                                                <span className="text-dark">{formatDate(order.delivered_date)}</span>
                                            </div>
                                            {order.delivered && (
                                                <div className="d-flex justify-content-between">
                                                    <span>Pago</span>
                                                    <span className="text-dark">{formatDate(order.payment_date)}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="border-top border-bottom py-3 mb-4">
                                            <ul className="list-unstyled mb-0 small text-muted">
                                                {order.products?.map((p, idx) => (
                                                    <li key={idx} className="d-flex justify-content-between mb-2 last-child-mb-0">
                                                        <span>{p.quantity} × {p.product_name}</span>
                                                        <span>${p.price * p.quantity}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <span className="text-muted small">Total</span>
                                            <span className="fw-medium text-dark">
                                                ${order.products?.reduce((sum, p) => sum + (p.price * p.quantity), 0)}
                                            </span>
                                        </div>
                                        
                                        <div className="d-flex gap-2 mt-3 w-100">
                                            {!order.delivered && (
                                                <button
                                                    className="btn btn-dark rounded-pill flex-grow-1 py-2"
                                                    onClick={() => handlePay(order.id)}
                                                >
                                                    Pagar
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-outline-danger rounded-pill flex-grow-1 py-2"
                                                onClick={() => handleDelete(order.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}