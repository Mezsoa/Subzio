import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Tools - KillSub | Subscription Management Calculators & Resources',
  description: 'Free tools and calculators to help you manage subscriptions, calculate savings, and optimize your recurring payments.',
  openGraph: {
    title: 'Free Subscription Management Tools - KillSub',
    description: 'Calculate your subscription costs and potential savings with our free tools',
    type: 'website',
  },
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
