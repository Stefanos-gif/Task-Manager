

<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import favicon from '$lib/assets/favicon.png';

let user: { email: string } | null = null;
let tasks: any[] = [];
let loading = false;
let error = '';

let newTitle = '';
let newNotes = '';

async function fetchUser() {
    const res = await fetch('/api/me');
    if (res.ok) {
        const data = await res.json();
        user = data.user;
        if (user) await fetchTasks();
    } else {
        user = null;
    }
}

async function fetchTasks() {
    loading = true;
    error = '';
    const res = await fetch('/api/tasks');
    if (res.ok) {
        const data = await res.json();
        tasks = data.tasks;
    } else {
        error = 'Failed to load tasks';
    }
    loading = false;
}

async function addTask() {
    error = '';
    if (!newTitle.trim()) {
        error = 'Title required';
        return;
    }
    const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, notes: newNotes })
    });
    if (res.ok) {
        newTitle = '';
        newNotes = '';
        await fetchTasks();
    } else {
        const data = await res.json();
        error = data.error || 'Failed to add task';
    }
}

async function deleteTask(id: number) {
    error = '';
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (res.ok || res.status === 204) {
        await fetchTasks();
    } else {
        error = 'Failed to delete task';
    }
}

async function updateTask(id: number, patch: any) {
    error = '';
    const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
    });
    if (res.ok) {
        await fetchTasks();
    } else {
        error = 'Failed to update task';
    }
}

onMount(() => {
    if (browser) fetchUser();
});

async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    user = null;
    goto('/api/auth/login');
}
</script>


<div class="card">
    <div class="app-header">
        <h1 class="app-title">
            <img src={favicon} alt="Stemfreak" class="app-icon" />
            Stemfreak Task Manager
        </h1>
    </div>
    
    {#if user}
        <div class="card-header">
            <div class="greeting">Welcome, {user.email}</div>
            <button class="linkish" on:click={logout}>Logout</button>
        </div>

        <section class="tasks">
            {#if loading}
                <p class="muted">Loading tasks…</p>
            {:else}
                {#if tasks.length === 0}
                    <p class="muted">No tasks yet.</p>
                {:else}
                    <ul class="task-list">
                        {#each tasks as t}
                            <li class="task-item">
                                <label class="task-left">
                                    <input type="checkbox" checked={t.done} on:change={() => updateTask(t.id, { done: !t.done })} />
                                    <input class="title" type="text" value={t.title} on:change={(e) => updateTask(t.id, { title: (e.target as HTMLInputElement)?.value })} />
                                </label>
                                <div class="task-right">
                                    <textarea rows="2" class="notes" placeholder="Notes..." on:change={(e) => updateTask(t.id, { notes: (e.target as HTMLTextAreaElement)?.value })}>{t.notes}</textarea>
                                    <button class="danger" on:click={() => deleteTask(t.id)}>Delete</button>
                                </div>
                            </li>
                        {/each}
                    </ul>
                {/if}
            {/if}
        </section>

        <section class="add">
            <form on:submit|preventDefault={addTask}>
                <input class="input" type="text" placeholder="Title" bind:value={newTitle} maxlength="80" required />
                <textarea class="input" rows="2" placeholder="Notes (optional)" bind:value={newNotes}></textarea>
                <div class="form-row">
                    <button class="primary" type="submit">Add Task</button>
                </div>
            </form>
            {#if error}
                <p class="error">{error}</p>
            {/if}
        </section>
    {:else}
        <div class="welcome-section">
            <div class="tutorial">
                <h2>How to use Stemfreak Task Manager</h2>
                <div class="steps">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h3>Create an Account</h3>
                            <p>Sign up with your email and a secure password to get started</p>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h3>Add Tasks</h3>
                            <p>Create tasks with titles and optional notes to organize your work</p>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h3>Track Progress</h3>
                            <p>Check off completed tasks and edit them as needed</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="welcome-actions">
                <a class="button primary" href="api/auth/login">Login</a>
                <a class="button ghost" href="api/auth/signup">Sign Up</a>
            </div>
        </div>
    {/if}
</div>

<style>
    .card {
        width: 100%;
        max-width: 820px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.06);
        padding: 1.25rem;
        border-radius: 12px;
        box-shadow: 0 6px 30px rgba(5,8,26,0.6);
        backdrop-filter: blur(8px) saturate(120%);
        box-sizing: border-box;
    }

    .app-header {
        text-align: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    .app-title {
        margin: 0;
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #60a5fa, #34d399, #fbbf24);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 30px rgba(96, 165, 250, 0.3);
        line-height: 1.2;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
    }

    .app-icon {
        width: 4rem;
        height: 2.5rem;
        filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.4));
        color: #60a5fa;
        object-fit: contain;
    }

    .welcome-section {
        text-align: center;
    }

    .tutorial {
        margin-bottom: 2rem;
    }

    .tutorial h2 {
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
        color: #e6eef8;
        line-height: 1.3;
    }

    .steps {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .step {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        text-align: left;
        padding: 1rem;
        background: rgba(255,255,255,0.02);
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.04);
    }

    .step-number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4f46e5, #06b6d4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.2rem;
        flex-shrink: 0;
    }

    .step-content h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.2rem;
        color: #e6eef8;
        line-height: 1.3;
    }

    .step-content p {
        margin: 0;
        color: rgba(230,238,248,0.8);
        line-height: 1.5;
    }

    .card-header { display:flex; justify-content:space-between; align-items:center; gap:1rem; margin-bottom:0.75rem }
    .greeting { font-weight:600 }
    .linkish { background:none; border:0; color:inherit; cursor:pointer; text-decoration:underline; font-size:0.95rem }

    .muted { color: rgba(230,238,248,0.7) }

    .task-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.6rem }
    .task-item { display:flex; gap:0.75rem; align-items:flex-start; padding:0.5rem; background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border-radius:8px; flex-wrap: wrap; }
    .task-left { display:flex; gap:0.5rem; align-items:center; flex:1; min-width: 200px; }
    .task-right { display:flex; flex-direction:column; gap:0.5rem; align-items:flex-end; min-width: 200px; }
    .title { background:transparent; border:0; color:inherit; font-weight:600; width: 100%; }
    .notes { width:320px; max-width:100%; min-width:200px; resize:vertical; background:transparent; border:1px solid rgba(255,255,255,0.04); padding:0.4rem; border-radius:6px; color:inherit }

    .input { width:100%; box-sizing:border-box; padding:0.6rem; border-radius:8px; border:1px solid rgba(255,255,255,0.06); background:rgba(0,0,0,0.18); color:inherit; margin-bottom:0.6rem }
    .form-row { display:flex; justify-content:flex-end }

    .primary { background:linear-gradient(90deg,#4f46e5,#06b6d4); color:white; padding:0.5rem 0.9rem; border-radius:8px; border:0; cursor:pointer; font-weight: 600; }
    .danger { background:transparent; border:0; color:#ff7b7b; cursor:pointer }
    .button { display:inline-block; padding:0.75rem 1.2rem; border-radius:8px; background:rgba(255,255,255,0.06); color:inherit; text-decoration:none; margin:0 0.5rem; font-weight: 600; transition: all 0.2s ease; }
    .button:hover { background:rgba(255,255,255,0.1); transform: translateY(-1px); }
    .button.primary { background:linear-gradient(90deg,#4f46e5,#06b6d4); color:white; }
    .button.ghost { background:transparent; border:1px solid rgba(255,255,255,0.06) }

    .welcome-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
    }

    .error { color:#ffb4b4 }

    @media (max-width:768px) {
        .card { 
            padding:1rem; 
            margin: 0.5rem;
        }
        .app-title { 
            font-size: 2rem; 
        }
        .app-icon {
            width: 2rem;
            height: 2rem;
        }
        .tutorial h2 {
            font-size: 1.5rem;
        }
        .steps { 
            gap: 1rem; 
        }
        .step { 
            padding: 0.8rem;
        }
        .step-content h3 {
            font-size: 1.1rem;
        }
        .welcome-actions { 
            flex-direction: column; 
            align-items: center; 
        }
        .button {
            width: 100%;
            max-width: 280px;
            text-align: center;
            margin: 0.25rem 0;
        }
        .task-item {
            flex-direction: column;
            gap: 0.5rem;
        }
        .task-left, .task-right {
            width: 100%;
            min-width: auto;
        }
        .task-right {
            align-items: flex-start;
        }
        .notes {
            width: 100%;
            min-width: auto;
        }
    }

    @media (max-width:480px) {
        .card { 
            padding: 0.8rem;
            margin: 0.25rem;
        }
        .app-title { 
            font-size: 1.6rem; 
        }
        .app-icon {
            width: 2.8rem;
            height: 1.6rem;
            object-fit: contain;
        }
        .tutorial h2 {
            font-size: 1.3rem;
        }
        .step { 
            flex-direction: column; 
            text-align: center; 
            padding: 0.75rem;
        }
        .step-number {
            width: 35px;
            height: 35px;
            font-size: 1rem;
        }
        .step-content h3 {
            font-size: 1rem;
            margin-top: 0.5rem;
        }
        .card-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: center;
        }
        .greeting {
            font-size: 0.95rem;
        }
        .input {
            font-size: 16px; /* Prevents zoom on iOS */
        }
    }
</style>
