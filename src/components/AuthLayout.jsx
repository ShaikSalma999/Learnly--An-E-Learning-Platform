import Logo from './Logo.jsx';
import Icon from './Icon.jsx';

const highlights = [
  'Learn from industry practitioners',
  'Track progress across every course',
  'Pick up exactly where you left off',
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <aside className="auth__aside">
        <Logo light />
        <div className="auth__pitch">
          <h2>Build skills that open doors.</h2>
          <ul>
            {highlights.map((item) => (
              <li key={item}><Icon name="check" size={18} /> {item}</li>
            ))}
          </ul>
        </div>
        <p className="auth__quote">“Learnly made it easy to fit learning around my job.” <span>— Maya, Frontend Developer</span></p>
      </aside>
      <section className="auth__main">
        <div className="auth__card">
          <h1>{title}</h1>
          <p className="auth__subtitle">{subtitle}</p>
          {children}
          <p className="auth__footer">{footer}</p>
        </div>
      </section>
    </div>
  );
}
