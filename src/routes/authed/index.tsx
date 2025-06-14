import { redirect } from '@tanstack/react-router';

export const Route = createFileRoute({
  loader: () => {
    throw redirect({ to: '/authed/dashboard' });
  },
  component: () => null,
}); 