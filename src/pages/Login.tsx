import React, { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase from '../supabaseClient'
import { Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // 🔹 Run navigation inside useEffect to avoid errors
    useEffect(() => {
        if (session) {
            navigate('/');
        }
    }, [session, navigate]);

    console.log(session);

    if (!session) {
        return (
            <div className="max-w-6xl mx-auto">
                <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
            </div>
        )
    }

    // 🔹 Prevent returning anything unnecessary when session exists
    return null;
}

export default Login
