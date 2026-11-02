import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { ADMIN_CREDENTIALS, useApp } from '../../context/AppContext';
import { IMAGES } from '../../data/mockData';
import { isEmail } from '../../utils/format';
import { Logo } from '../../components/common/Misc';
import SmartImage from '../../components/common/SmartImage';

export default function Login({ role }) {
  const { login, user, clients } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const isAdmin = role === 'admin';

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/client'} replace />;

  const demo = isAdmin
    ? [{ label: 'Admin', email: ADMIN_CREDENTIALS.email, password: ADMIN_CREDENTIALS.password }]
    : clients.filter((c) => c.active).slice(0, 3).map((c) => ({ label: c.name, email: c.email, password: c.password }));

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return setError('Please enter your email and password.');
    if (!isEmail(email.trim())) return setError('Please enter a valid email address.');
    const res = login(role, email, password);
    if (!res.ok) return setError(res.error);
    navigate(isAdmin ? '/admin' : '/client', { replace: true });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy lg:block">
        <SmartImage src={isAdmin ? IMAGES.site2 : IMAGES.villa} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/80 to-royal/60" />
        <div className="blueprint-bg absolute inset-0 opacity-30" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Logo light />
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold">
              {isAdmin ? <ShieldCheck className="h-4 w-4" /> : <User className="h-4 w-4" />} {isAdmin ? 'Admin Console' : 'Client Portal'}
            </span>
            <h2 className="font-display text-4xl font-bold leading-tight !text-white">
              {isAdmin ? 'Manage every site, material and milestone in one place.' : 'Watch your dream project take shape - every single day.'}
            </h2>
            <p className="mt-4 max-w-md text-blue-100">{isAdmin ? 'Update progress, manage materials, answer client corrections and review reports.' : 'Live progress, site photos, daily updates and direct messaging with our team.'}</p>
          </div>
          <p className="text-xs text-blue-200">Frontend demo - mock data and demo credentials only.</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-ice px-5 py-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-royal hover:underline"><ArrowLeft className="h-4 w-4" /> Back to website</Link>
          <div className="rounded-3xl bg-white p-7 shadow-lift sm:p-9">
            <div className="mb-6 lg:hidden"><Logo /></div>
            <h1 className="font-display text-3xl font-bold">{isAdmin ? 'Admin Login' : 'Client Login'}</h1>
            <p className="mt-1 text-sm text-slate-500">{isAdmin ? 'Sign in to the construction management console.' : 'Sign in to view your project progress.'}</p>

            {error && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</motion.div>}

            <form onSubmit={submit} noValidate className="mt-6 space-y-5">
              <div>
                <label className="label" htmlFor="email">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input id="email" type="email" className="input pl-10" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} placeholder="you@example.com" autoComplete="username" />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="password">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input id="password" type={show ? 'text' : 'password'} className="input px-10" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="Your password" autoComplete="current-password" />
                  <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-3">Sign In</button>
            </form>

            <div className="mt-6 rounded-2xl border border-dashed border-gold/60 bg-gold-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gold-600">Demo credentials</p>
              <ul className="mt-2 space-y-2">
                {demo.map((d) => (
                  <li key={d.email} className="flex items-center justify-between gap-2 text-xs">
                    <span className="min-w-0"><span className="block font-semibold text-navy">{d.label}</span><span className="block truncate text-slate-600">{d.email} / {d.password}</span></span>
                    <button type="button" onClick={() => { setEmail(d.email); setPassword(d.password); setError(''); }} className="btn-outline btn-sm shrink-0">Use</button>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              {isAdmin ? 'Are you a client?' : 'Are you an administrator?'}{' '}
              <Link to={isAdmin ? '/client/login' : '/admin/login'} className="font-semibold text-royal hover:underline">{isAdmin ? 'Client login' : 'Admin login'}</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
