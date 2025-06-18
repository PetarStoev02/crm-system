import { redirect } from '@tanstack/react-router'
import { authService } from '@/lib/auth'

export const Route = createFileRoute({
  loader: () => {
    if (authService.isAuthenticated()) {
      throw redirect({ to: '/authed/dashboard' });
    } else {
      throw redirect({ to: '/login' });
    }
  },
  component: () => null,
})
