<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { marked } from 'marked';
	export let message;

	const dispatch = createEventDispatcher();

	let messageElement;
	onMount(() => {
		dispatch('updateLastMessage', messageElement);
	});
	let isOpen = false;
</script>

{#if message.sender === 'reason'}
	<div class="dropdown">
		<button class="dropdown-toggle" on:click={() => (isOpen = !isOpen)}>
			Click to expand/collapse changes <span class="arrow">{isOpen ? '▲' : '▼'}</span>
		</button>

		{#if isOpen}
			<div class="dropdown-content">
				<div class="chat-message {message.sender}" bind:this={messageElement}>
					{@html marked(String(message.text))}
				</div>
			</div>
		{/if}
	</div>

	<!-- <div class="chat-message {message.sender}" bind:this={messageElement}>
		{@html marked(String(message.text))}
	</div> -->
{:else}
	<div class="chat-message {message.sender}" bind:this={messageElement}>
		{@html marked(String(message.text))}
	</div>
{/if}

<style>
	.chat-message {
		padding: 8px 10px;
		margin: 5px 0;
		border-radius: 5px;
		max-width: 80%;
	}

	.chat-message.user {
		background-color: #e6f7ff;
		align-self: flex-end;
	}

	.chat-message.bot {
		background-color: #e6ffe6;
	}

	.chat-message.dice {
		background-color: #fce3ce;
	}

	.chat-message.reason {
		background-color: #e8ee87;
	}

	/* .dropdown-content {
		border: 1px solid #ddd;
		padding: 15px;
		margin-top: 10px;
	} */

	.dropdown-toggle {
		cursor: pointer;
	}

	button {
		background-color: #e8ee87;
		border-radius: 8px;
		border: none;
		padding: 10px;
	}
</style>
