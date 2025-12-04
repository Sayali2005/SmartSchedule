// Reusable Card component
const Card = ({ children, className = '', hover = true, ...props }) => {
    return (
        <div
            className={`card ${hover ? 'hover:shadow-2xl' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
