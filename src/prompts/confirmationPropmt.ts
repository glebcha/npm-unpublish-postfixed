import { prompt, Separator } from 'inquirer';

export type Versions = Array<typeof Separator | { name: string, value: string }>;

export function confirmationPropmt({ versions }: { versions: Versions }) {
  const confrimation = {
    type: 'confirm',
    message: 'Are you sure to unpublish selected versions?',
    name: 'confirmation',
  };
  return Promise.all([prompt([confrimation]), versions]);
}