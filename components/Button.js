import Link from "next/link";

const Button = (props) => {
  const { className, children } = props;
  return (
    <button
      {...props}
      className={`${className} inline-block text-white font-sourceSans shadow-md tracking-wide rounded hover:bg-on bg-gradient-to-r transition-all duration-300 from-lightBlue to-darkBlue`}>
      {children}
    </button>
  );
};

const Outline = (props) => {
  const { children, className } = props;
  return (
    <div className="outline-button">
      <Link
        href={"#"}
        className={`${className} font-bold text-[10px] bg-gradient-to-br from-darkBlue to-lightBlue bg-clip-text text-transparent`}>
        {children}
      </Link>
    </div>
  );
};

Button.outline = Outline;

export default Button;
