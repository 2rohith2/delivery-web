import { Button, Input, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { postApi } from '../api';
import './index.scss';

export default function LoginContainer(): React.ReactElement {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  useEffect(() => {
    const userRole = localStorage.getItem('role');

    if (userRole) {
      window.location.href = '/dashboard';
    }
  });

  async function loginUser(): Promise<void> {
    try {
      const result = await postApi('/login', { email: email, password: password });
      localStorage.setItem('access_token', result.body.access_token);
      localStorage.setItem('email', result.body.email);
      localStorage.setItem('name', result.body.name);
      localStorage.setItem('refresh_token', result.body.refresh_token);
      localStorage.setItem('role', result.body.role);
      window.location.href = '/dashboard';
    } catch (error: any) {
      notification['error']({
        message: 'Login failed',
        description: error.response.body.message
      });
    }
   
  }

  return (
    <main>
      <div className="login-container">
        <div className="login">
          <div className="login__header">
          Login
          </div>
          <div className="login__input">
            <Input
              placeholder="Email"
              value={email}
              onChange={event => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div className="login__input">
            <Input.Password
              placeholder="Password"
              value={password}
              onChange={event => {
                setPassword(event.target.value);
              }}
            />
          </div>
          <Button
            type="primary"
            className='login__submit'
            onClick={(): Promise<void> => loginUser()}
          >
          Login
          </Button>
        </div>
      </div>
    </main>
  );
}