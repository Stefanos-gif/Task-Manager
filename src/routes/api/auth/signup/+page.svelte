<script lang="ts">
import { goto } from '$app/navigation';
import favicon from '$lib/assets/favicon.png';
let email = '';
let password = '';
let error = '';

async function signup(e: Event) {
  e.preventDefault();
  error = '';
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (res.ok) {
    goto('/');
  } else {
    const data = await res.json();
    error = data.error || 'Signup failed';
  }
}
</script>

<div class="auth-container">
  <div class="auth-card">
    <div class="auth-header">
      <h1 class="app-title">
        <img src={favicon} alt="Stemfreak" class="app-icon" />
        Stemfreak Task Manager
      </h1>
      <h2 class="auth-title">Create Account</h2>
      <p class="auth-subtitle">Start organizing your tasks today</p>
    </div>

    <form class="auth-form" on:submit|preventDefault={signup}>
      <div class="form-group">
        <label for="email">Email Address</label>
        <input 
          id="email"
          type="email" 
          bind:value={email} 
          placeholder="Enter your email"
          required 
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input 
          id="password"
          type="password" 
          bind:value={password} 
          placeholder="Choose a strong password"
          minlength="8" 
          maxlength="72" 
          required 
        />
        <small class="password-hint">Must be at least 8 characters long</small>
      </div>

      {#if error}
        <div class="error-message">{error}</div>
      {/if}

      <button type="submit" class="auth-button">Create Account</button>
    </form>

    <div class="auth-footer">
      <p>Already have an account? <a href="/api/auth/login">Sign in here</a></p>
      <a href="/" class="back-link">← Back to Home</a>
    </div>
  </div>
</div>

<style>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 2rem 1rem;
  }

  .auth-card {
    width: 100%;
    max-width: 420px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 8px 40px rgba(5,8,26,0.7);
    backdrop-filter: blur(12px) saturate(120%);
  }

  .auth-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .app-title {
    margin: 0 0 1rem 0;
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(135deg, #60a5fa, #34d399, #fbbf24);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .app-icon {
    width: 3rem;
    height: 1.8rem;
    filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.4));
    color: #60a5fa;
    object-fit: contain;
  }

  .auth-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.8rem;
    font-weight: 600;
    color: #e6eef8;
  }

  .auth-subtitle {
    margin: 0;
    color: rgba(230,238,248,0.7);
    font-size: 1rem;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-weight: 500;
    color: #e6eef8;
    font-size: 0.95rem;
  }

  .form-group input {
    padding: 0.8rem 1rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(0,0,0,0.2);
    color: #e6eef8;
    font-size: 1rem;
    transition: all 0.2s ease;
    width: 100%;
    box-sizing: border-box;
  }

  .form-group input:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    background: rgba(0,0,0,0.3);
  }

  .form-group input::placeholder {
    color: rgba(230,238,248,0.5);
  }

  .password-hint {
    color: rgba(230,238,248,0.6);
    font-size: 0.85rem;
    margin-top: -0.25rem;
  }

  .auth-button {
    padding: 0.9rem 1.5rem;
    background: linear-gradient(90deg, #4f46e5, #06b6d4);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .auth-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(79, 70, 229, 0.3);
  }

  .error-message {
    padding: 0.8rem 1rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 8px;
    color: #fca5a5;
    font-size: 0.9rem;
  }

  .auth-footer {
    text-align: center;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .auth-footer p {
    margin: 0 0 1rem 0;
    color: rgba(230,238,248,0.8);
  }

  .auth-footer a {
    color: #60a5fa;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .auth-footer a:hover {
    color: #93c5fd;
    text-decoration: underline;
  }

  .back-link {
    display: inline-block;
    color: rgba(230,238,248,0.6);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s ease;
  }

  .back-link:hover {
    color: rgba(230,238,248,0.8);
  }

  @media (max-width: 480px) {
    .auth-container {
      padding: 1rem 0.5rem;
    }
    
    .auth-card {
      padding: 2rem 1.5rem;
      margin: 0.5rem;
    }
    
    .app-title {
      font-size: 1.5rem;
    }
    
    .app-icon {
      width: 2.4rem;
      height: 1.5rem;
      object-fit: contain;
    }
    
    .auth-title {
      font-size: 1.5rem;
    }
    
    .form-group input {
      font-size: 16px; /* Prevents zoom on iOS */
      padding: 0.9rem 1rem;
    }
    
    .auth-button {
      padding: 1rem 1.5rem;
      font-size: 16px; /* Prevents zoom on iOS */
    }
  }

  @media (max-width: 360px) {
    .auth-card {
      padding: 1.5rem 1rem;
    }
    
    .app-title {
      font-size: 1.3rem;
    }
    
    .app-icon {
      width: 2rem;
      height: 1.3rem;
      object-fit: contain;
    }
    
    .auth-title {
      font-size: 1.3rem;
    }
  }
</style>
