import { Link } from "react-router";

const SideBarButton = ({ to, onClick, text = "home" }) => {
    return (
        <Link to={to} onClick={onClick} className="duration-300 text-primary-content hover:text-primary text-lg font-medium py-2">
            <span>{text}</span>
        </Link>
    );
};

export default SideBarButton;