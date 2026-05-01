import { Link, useLocation } from "react-router-dom";
import "../styles/componentes/Navbar.css";

export const Navbar = () => {
	const location = useLocation();

	return (
		<nav className="margon-navbar">
			<div className="margon-navbar-container">
				<Link to="/" className="margon-brand">
					<span className="brand-text">Margon</span>
					<span className="brand-dot">.</span>
				</Link>
				
				<div className="margon-nav-links">
					<Link 
						to="/" 
						className={`margon-nav-link ${location.pathname === '/' ? 'active' : ''}`}
					>
						Inicio
					</Link>
					<Link 
						to="/add-product" 
						className={`margon-nav-link btn-premium ${location.pathname === '/add-product' ? 'active' : ''}`}
					>
						Agregar Producto
					</Link>
					<Link 
						to="/add-client" 
						className={`margon-nav-link btn-premium ${location.pathname === '/add-client' ? 'active' : ''}`}
					>
						Agregar Cliente
					</Link>
				</div>
			</div>
		</nav>
	);
};