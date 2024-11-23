import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link} from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './loginPage.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

export default function LoginPage() {
    const {
        handleSubmit,
        register,
        formState: {errors},
    } = useForm();

    const navigate = useNavigate();
    const {user, login} = useAuth();
    const [params] = useSearchParams();
    const returnUrl = params.get('returnUrl');

    useEffect(() => {
        if (!user) return;

        returnUrl ? navigate(returnUrl) : navigate('/');
    }, [user]);

    const submit = async ({email, password}) => {
        await login(email, password);
    };

  return (
    <div className={styles.container}>
        <div className={styles.details}>
            <Title title={"Login"} />
            <form onSubmit={handleSubmit(submit)} noValidate>
                <Input 
                    type="email" 
                    label="Email" 
                    {...register('email', {
                    required: true,
                    pattern: {
                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,63}$/i,
                        message: 'Email is not Valid',
                        },
                    })}
                    error={errors.email}>
                </Input>

                <Input
                    type="password"
                    label="Password"
                    {...register('password', {
                        required: true,
                    })}
                    error={errors.password}>
                </Input>

                <Button type="submit" text="Login"></Button>

                <div className={styles.register}>
                    New user? &nbsp;
                    <Link to={`/register?${returnUrl ? 'returnUrl=' + returnUrl : ''}`}>
                        Register Here!
                    </Link>
                </div>
            </form>
        </div>
    </div>
  )
}
