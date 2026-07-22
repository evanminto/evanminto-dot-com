import React, { useState, useId, useEffect, useRef } from 'react';
import { StatusMessage } from './StatusMessage.tsx';

export function PasswordProtect({ password, message = 'This content is password-protected', children }: {
  password: string;
  message?: string;
  children: any;
}) {
  const id = useId();
  const successRef = useRef<HTMLOutputElement>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    successRef.current?.focus();
  });

  return (
    <div className="password-protect container">
      {unlocked ? (<>
        {success && (
          <StatusMessage
            type="success"
            innerRef={successRef}
          >{success}</StatusMessage>
        )}
        <div>
          {children}
        </div>
      </>) : <>
        <div className="a-attention-box u-flow-gap-sm">
          {error && <StatusMessage type="error">{error}</StatusMessage>}
          <p>{message}</p>
          <form
            className="single-field-form"
            onSubmit={async (event) => {
              event.preventDefault();
              setError(null);
              setSuccess(null);
              await new Promise(resolve => requestAnimationFrame(resolve));
              const input = event.target.querySelector('input');

              if (!input) {
                return;
              }

              if (input.value === password) {
                setUnlocked(true);
                setSuccess('Unlocked content!');
              } else {
                setError('Wrong password! Please try again.');
              }
            }}
          >
            <div className="single-field-form__field">
              <label htmlFor={id}>Password</label>
              <input id={id} type="password" />
            </div>
            <button className="submit-button">Unlock</button>
          </form>
        </div>
      </>}
    </div>
  );
}