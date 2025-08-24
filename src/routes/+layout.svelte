<script lang="ts">
import favicon from '$lib/assets/favicon.png';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="app">
	<main class="container">
		<slot />
	</main>

	<footer class="site-footer" aria-hidden="false">
		<div class="footer-inner">© Stef™</div>
	</footer>
</div>

<style>
	:global(html, body) {
		height: 100%;
		margin: 0;
		font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background: linear-gradient(135deg, #071028 0%, #09203f 30%, #1648b8 100%);
		color: #e6eef8;
	}

	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem 1rem;
		box-sizing: border-box;
	}

	.container {
		width: 100%;
		max-width: 980px;
		flex: 1 0 auto;
		display: flex;
		align-items: flex-start;
		justify-content: center;
	}

	.site-footer {
		width: 100%;
		padding: 0.75rem 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		color: rgba(230,238,248,0.75);
		font-size: 0.95rem;
		margin-top: 2rem;
	}

	.footer-inner {
		backdrop-filter: blur(6px);
	}

	/* Mobile optimizations */
	@media (max-width: 768px) {
		.app {
			padding: 1rem 0.75rem;
		}
		
		.site-footer {
			font-size: 0.85rem;
			padding: 0.5rem 0.75rem;
		}
	}

	@media (max-width: 480px) {
		.app {
			padding: 0.75rem 0.5rem;
		}
		
		.container {
			align-items: center;
		}
	}
</style>
