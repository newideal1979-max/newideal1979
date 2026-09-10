import { Link } from "react-router-dom";

const variants = {
  primary: "bg-thread-gold text-ink-900 shadow-gold hover:scale-[1.02]",
  outline: "border border-white/15 text-fabric-100 hover:border-thread-gold/50 hover:text-thread-gold",
  ghost: "text-fabric-300 hover:text-fabric-100",
};

export default function Button({ to, href, as = "button", variant = "primary", className = "", children, ...rest }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 ${variants[variant]} ${className}`;

  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>;
  return <button className={cls} {...rest}>{children}</button>;
}
