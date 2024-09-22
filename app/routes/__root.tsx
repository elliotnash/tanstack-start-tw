import { createRootRoute } from '@tanstack/react-router';
import { Outlet, ScrollRestoration } from '@tanstack/react-router';
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start';
import * as React from 'react';
// @ts-expect-error
import styles from '~/globals.css?url';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '~/components/theme';

export const Route = createRootRoute({
  meta: () => [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { title: 'TrailEyes Auth' },
  ],
  links: () => [{ rel: 'stylesheet', href: styles }],
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

const queryClient = new QueryClient();

function RootDocument({ children }: React.PropsWithChildren) {
  const TanStackRouterDevtools =
    process.env.NODE_ENV === 'production'
      ? () => null // Render nothing in production
      : React.lazy(async () => {
          // Lazy load in development
          const { TanStackRouterDevtools } = await import('@tanstack/router-devtools');
          return { default: TanStackRouterDevtools };
        });
  const ReactQueryDevtools =
    process.env.NODE_ENV === 'production'
      ? () => null // Render nothing in production
      : React.lazy(async () => {
          // Lazy load in development
          const { ReactQueryDevtools } = await import('@tanstack/react-query-devtools');
          return { default: ReactQueryDevtools };
        });

  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <Meta />
      </Head>
      <Body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
          <React.Suspense>
            <ReactQueryDevtools />
            <TanStackRouterDevtools />
          </React.Suspense>
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  );
}
