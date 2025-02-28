interface PageContainerProps {
  children: React.ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className='space-y-8 p-4 md:p-6 max-w-7xl mx-auto'>{children}</main>
  )
}
