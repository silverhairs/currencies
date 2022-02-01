import Head from 'next/head';

export function Layout(props: PageProps): JSX.Element {
  return (
    <div className='layout'>
      <Head>
        <meta content='Exchange Rates calculator' />
        <title>{props.title}</title>
      </Head>
      <header className='container'>
        <h1>Exchange Rates Calculator</h1>
      </header>
      <main>{props.children}</main>
      <footer className='container'>
        <small>
          Crafted with 🔥 by{' '}
          <a
            href='https://silverhairs.dev'
            target='_blank'
            rel='noopener noreferrer'
          >
            Boris Kayi
          </a>{' '}
        </small>
      </footer>
    </div>
  );
}

interface PageProps {
  title: string;
  children: JSX.Element;
}
