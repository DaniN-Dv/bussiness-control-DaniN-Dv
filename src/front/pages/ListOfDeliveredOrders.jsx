export const ListOfDeliveredOrders = () => {
    return (
        <div className="container">
            <h1 className="text-center">Lista de pedidos entregados</h1>
            <div>
                <ul className="list-group">
                    <p>Hoy es: Fecha actual</p>
                    <li className="list-group-item d-flex justify-content-between">
                        <p>Nombre del Cliente</p>
                        <p>Fecha de entrega</p>
                        <p>productos entregados</p>
                        <p>✅</p>
                        <p>fecha de pago</p>
                        <p>🗑️</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}