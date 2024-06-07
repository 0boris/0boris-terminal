<script lang="ts">
  import { executeCommand, type CommandOutput } from "$lib/commands";
  import { cascade } from "svelte-typewriter";
  import { linear } from "svelte/easing";

  let command = "";
  let output: CommandOutput[] = [
    {
      command: "",
      response:
        `<span class='secondary-text'>Welcome to my interactive terminal. Enter 'help' to begin.<br><br>`,
    },
  ];
  let history: string[] = [];
  let historyIndex = -1;
  let isSudoMode = false;

  const handleInput = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (isSudoMode) {
        const result = command === 'password123' // Replace with actual password check
          ? { command: 'sudo', response: `<span class="main-output">Password accepted. You now have admin rights.</span>` }
          : { command: 'sudo', response: `<span class="main-output">Incorrect password.</span>` };
        output = [...output, result];
        isSudoMode = false;
        command = "";
      } else {
        const result = executeCommand(command);
        const commandOutput: CommandOutput = { command, response: "" };

        if (Array.isArray(result)) {
          output = result;
        } else {
          output = [...output, result];
          if (command === "sudo") {
            isSudoMode = true;
          }
        }

        history = [...history, command];
        historyIndex = history.length;
        command = "";
      }
    } else if (e.key === "ArrowUp") {
      if (historyIndex > 0) {
        historyIndex -= 1;
        command = history[historyIndex];
      } else {
        command = "";
      }
    }
  };

  const formatResponse = (response: string) => {
    return response.split("\n");
  };
</script>

<div
  class="bg-zinc-900 text-green-500 font-mono text-lg p-4 h-screen overflow-y-auto"
>
  {#each output as line}
    <div>
      {#if line.command}
        {#if line.command === "sudo"}
        <span class="mr-2 main-text">sudo@0boris.tech:~$</span>{line.command}
        {:else}
        <span class="mr-2 main-text">guest@0boris.tech:~$</span>{line.command}
        {/if}
      {/if}
      <div use:cascade={{ interval: 30 }}>
        {#each formatResponse(line.response) as resLine}
          <p>{@html resLine}</p>
        {/each}
      </div>
    </div>
  {/each}
  <div class="flex items-center">
      {#if command === "sudo"}
      <span class="mr-2 mt-[20px] main-text">suuuudo@0boris.tech:~$</span>
      <span class="mt-4 main-input" id="command">{command}</span>
      <b class="cursor mt-[20px]">█</b>
      <input
        class="bg-transparent border-none text-green-500 outline-none w-full mt-[20px] left-[-1000px] absolute"
        type="text"
        bind:value={command}
        on:keydown={handleInput}
      />
      {:else}
      <span class="mr-2 mt-[20px] main-text">guest@0boris.tech:~$</span>
      <span class="mt-4 main-input" id="command">{command}</span>
      <b class="cursor mt-[20px]">█</b>
      <input
        class="bg-transparent border-none text-green-500 outline-none w-full mt-[20px] left-[-1000px] absolute"
        type="text"
        bind:value={command}
        on:keydown={handleInput}
      />
      {/if}
  </div>
</div>

<style>
  .cursor {
    display: inline-block;
    width: 10px;
    animation: blink 1s step-start infinite;
  }

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
</style>
