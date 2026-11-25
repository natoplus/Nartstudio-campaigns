import Head from 'next/head'
import Link from 'next/link'
import type { ReactNode } from 'react'

export default function SiteLayout({ children, title = 'Campaigns' }: { children: ReactNode; title?: string }) {
  return <>
    <Head><title>{title} — Nartstudio Campaigns</title><meta name="description" content="Discover the Nartstudio campaign playbook and prepare your next launch." /><meta name="theme-color" content="#09090d" /></Head>
    <header className="site-header">
      <Link className="wordmark" href="/">NARTSTUDIO <span>CAMPAIGNS</span></Link>
      <nav aria-label="Main navigation"><Link href="/campaigns">Discover</Link><Link href="/playbook">Playbook</Link><Link href="/planner">Launch planner</Link></nav>
      <Link className="header-cta" href="/planner">Plan a launch <span aria-hidden="true">↗</span></Link>
    </header>
    {children}
    <footer className="site-footer"><Link className="wordmark" href="/">NARTSTUDIO <span>CAMPAIGNS</span></Link><p>Thoughtful launches for worlds worth sharing.</p><div><Link href="/playbook">Playbook</Link><Link href="/planner">Planner</Link><Link href="mailto:hello@nartstudio.com?subject=Campaign%20enquiry">Contact</Link></div><small>© 2026 Nartstudio · Campaign tools are local to this browser.</small></footer>
  </>
}
