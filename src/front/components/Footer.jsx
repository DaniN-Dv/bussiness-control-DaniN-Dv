import { Link } from "react-router-dom";
import "../styles/componentes/Footer.css";

export const Footer = () => (
	<footer className="custom-footer text-center text-md-start w-100">
		<div className="container">
			<div className="row mt-3">
				
				<div className="col-12 col-md-4 mb-4 mb-md-0">
					<span className="footer-brand d-block mb-3">Margon</span>
					<p className="text-muted pe-md-4" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
						Plataforma moderna y eficiente para el control de clientes, productos y pedidos de tu negocio.
					</p>
					<div className="mt-3">
						<a href="#" className="social-circle"><i className="fa-brands fa-twitter"></i></a>
						<a href="#" className="social-circle"><i className="fa-brands fa-facebook-f"></i></a>
						<a href="#" className="social-circle"><i className="fa-brands fa-instagram"></i></a>
					</div>
				</div>

				
				<div className="col-6 col-md-4 mb-4 mb-md-0">
					<h5 className="footer-title">Enlaces Rápidos</h5>
					<ul className="list-unstyled">
						<li>
							<Link to="/" className="footer-link">Lista de Pedidos</Link>
						</li>
						<li>
							<Link to="/add-order" className="footer-link">Agregar Pedido</Link>
						</li>
						<li>
							<Link to="/add-client" className="footer-link">Agregar Cliente</Link>
						</li>
						<li>
							<Link to="/add-product" className="footer-link">Agregar Producto</Link>
						</li>
					</ul>
				</div>

				
				<div className="col-6 col-md-4">
					<h5 className="footer-title">Contacto</h5>
					<ul className="list-unstyled text-muted" style={{ fontSize: "0.95rem" }}>
						<li className="mb-2"><i className="fa-solid fa-location-dot me-2"></i> Caracas, Venezuela</li>
						<li className="mb-2"><i className="fa-solid fa-envelope me-2"></i> ventasmargon@gmail.com</li>
						<li className="mb-2"><i className="fa-solid fa-phone me-2"></i> +58 412 757 8506</li>
					</ul>
				</div>
			</div>

			<hr className="footer-divider" />

			<div className="text-center">
				<p className="text-muted mb-2 mb-md-0" style={{ fontSize: "0.9rem" }}>
					&copy; 2026 Margon. Todos los derechos reservados.
				</p>
			</div>
		</div>
	</footer>
);
