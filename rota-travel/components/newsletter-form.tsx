'use client';
import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
export default function NewsletterForm(){const [email,setEmail]=useState('');const [done,setDone]=useState(false);return done?<div className="newsletter-confirmation"><CheckCircle2 size={17}/><span>Teşekkürler! Bülten kaydı altyapısı yapılandırılınca <b>{email}</b> adresi kaydedilecek.</span></div>:<form className="newsletter-form" onSubmit={e=>{e.preventDefault();if(email.trim())setDone(true)}}><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-posta adresin" aria-label="E-posta adresin" required/><button type="submit">Bana ilham ver <ArrowRight size={16}/></button></form>}
