export interface CommandOutput {
  command: string;
  response: string;
}

interface Command {
  name: string;
  description: string;
  execute: () => CommandOutput | CommandOutput[];
}

export const commands: Command[] = [
  {
    name: 'help',
    description: 'Display available commands',
    execute: () => {
      const commandList = commands
        .map(cmd => `<span class="primary-output">${cmd.name}</span><span class="secondary-output">${cmd.description}</span>`)
        .join('\n');
      return {
        command: 'help',
        response: `<br><span class="main-output">Available commands:</span>\n${commandList}`,
      };
    },
  },
  {
    name: 'clear',
    description: 'Clear the terminal',
    execute: () => {
      return [];
    },
  },
  {
    name: 'whoami',
    description: 'Display user information',
    execute: () => {
      return {
        command: 'whoami',
        response: '<br><span class="main-output">guest</span>',
      };
    },
  },
  {
    name: 'sudo',
    description: `Control the website using this. You'll need a password!`,
    execute: () => {
      return {
        command: 'sudo',
        response: `<span class="main-output">Enter password: </span>`,
      };
    }
  }
];

export const executeCommand = (cmd: string): CommandOutput | CommandOutput[] => {
  const command = cmd.trim();

  const foundCommand = commands.find(c => c.name === command);
  if (foundCommand) {
    return foundCommand.execute();
  }

  return {
    command: cmd,
    response: `Command not found: ${cmd}`,
  };
};
