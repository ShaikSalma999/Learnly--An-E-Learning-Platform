import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import FormField from '../components/FormField.jsx';
import Icon from '../components/Icon.jsx';
import { DEMO_CREDENTIALS, useAuth } from '../context/AuthContext.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

export default function Login() {
  useDocumentTitle('Log in');
  const { currentUser, login } = useAuth();
  const location = useLocation();

  const [values, setValues] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search ?? ''}` : '/my-learning';
  const infoMessage = location.state?.message;

  const errors = useMemo(
    () => ({ email: validateEmail(values.email), password: validatePassword(values.password) }),
    [values],
  );
  const visibleError = (field) => (touched[field] || submitted ? errors[field] : '');

  if (currentUser) return <Navigate to={redirectTo} replace />;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setFormError('');
  };

  const handleBlur = (event) => {
    setTouched((previous) => ({ ...previous, [event.target.name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (errors.email || errors.password) return;
    const result = login(values);
    if (!result.ok) setFormError(result.error);
  };

  const fillDemo = () => {
    setValues(DEMO_CREDENTIALS);
    setFormError('');
    setTouched({});
    setSubmitted(false);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue your learning journey."
      footer={<>New to Learnly? <Link to="/register" state={location.state}>Create an account</Link></>}
    >
      {infoMessage && !formError && (
        <div className="alert alert--info" role="status"><Icon name="infoCircle" size={18} /> {infoMessage}</div>
      )}
      {formError && (
        <div className="alert alert--error" role="alert"><Icon name="alert" size={18} /> {formError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate className="form">
        <FormField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={visibleError('email')}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={visibleError('password')}
        />
        <button type="submit" className="btn btn--primary btn--lg btn--block">Log in</button>
      </form>

      <div className="auth__demo">
        <span>Just exploring?</span>
        <button type="button" className="btn btn--text" onClick={fillDemo}>Use the demo account</button>
      </div>
    </AuthLayout>
  );
}
