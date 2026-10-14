import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import FormField from '../components/FormField.jsx';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { getPasswordStrength, validateEmail, validateName, validatePassword } from '../utils/validators.js';

export default function Register() {
  useDocumentTitle('Create account');
  const { currentUser, register } = useAuth();
  const location = useLocation();

  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '', terms: false });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search ?? ''}` : '/my-learning';

  const errors = useMemo(() => {
    let confirmError = '';
    if (!values.confirm) confirmError = 'Please confirm your password.';
    else if (values.confirm !== values.password) confirmError = 'Passwords do not match.';
    return {
      name: validateName(values.name),
      email: validateEmail(values.email),
      password: validatePassword(values.password, 8),
      confirm: confirmError,
      terms: values.terms ? '' : 'You need to accept the terms to continue.',
    };
  }, [values]);

  const strength = useMemo(() => getPasswordStrength(values.password), [values.password]);
  const visibleError = (field) => (touched[field] || submitted ? errors[field] : '');

  if (currentUser) return <Navigate to={redirectTo} replace />;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
    setFormError('');
  };

  const handleBlur = (event) => {
    setTouched((previous) => ({ ...previous, [event.target.name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    const result = register({ name: values.name, email: values.email, password: values.password });
    if (!result.ok) setFormError(result.error);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start learning in minutes. It's free to sign up."
      footer={<>Already have an account? <Link to="/login" state={location.state}>Log in</Link></>}
    >
      {formError && (
        <div className="alert alert--error" role="alert"><Icon name="alert" size={18} /> {formError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate className="form">
        <FormField
          id="name"
          label="Full name"
          autoComplete="name"
          placeholder="Alex Morgan"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={visibleError('name')}
        />
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
        <div>
          <FormField
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={visibleError('password')}
          />
          {values.password && (
            <div className="strength" aria-live="polite">
              <div className="strength__bars" aria-hidden="true">
                {[1, 2, 3, 4].map((level) => (
                  <span key={level} className={level <= strength.score ? `is-on is-level-${strength.score}` : ''} />
                ))}
              </div>
              <span>{strength.label}</span>
            </div>
          )}
        </div>
        <FormField
          id="confirm"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={values.confirm}
          onChange={handleChange}
          onBlur={handleBlur}
          error={visibleError('confirm')}
        />

        <div className={`checkbox${visibleError('terms') ? ' checkbox--invalid' : ''}`}>
          <label>
            <input type="checkbox" name="terms" checked={values.terms} onChange={handleChange} onBlur={handleBlur} />
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </label>
          {visibleError('terms') && <p className="field__error" role="alert">{errors.terms}</p>}
        </div>

        <button type="submit" className="btn btn--primary btn--lg btn--block">Create account</button>
      </form>
    </AuthLayout>
  );
}
