import * as fs from 'node:fs';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';

const filePath = 'count.txt';

async function readCount() {
  return Number.parseInt(await fs.promises.readFile(filePath, 'utf-8').catch(() => '0'));
}

const getCount = createServerFn('GET', () => {
  return readCount();
});

const updateCount = createServerFn('POST', async (addBy: number) => {
  const count = await readCount();
  await fs.promises.writeFile(filePath, `${count + addBy}`);
});

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount(),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <div className="absolute inset-0 grid place-items-center p-4">
      <button
        type="button"
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/80 active:bg-primary/70 transition-all"
        onClick={() => {
          updateCount(1).then(() => {
            router.invalidate();
          });
        }}
      >
        Add 1 to {state}?
      </button>
    </div>
  );
}
