import Image from 'next/image'
import Link from 'next/link'

export function useMDXComponents(components: any): any {
  return {
    ...components,
    h1: (props: any) => (
      <h1 
        className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-6 mt-8" 
        {...props} 
      />
    ),
    h2: (props: any) => (
      <h2 
        className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-4 mt-8" 
        {...props} 
      />
    ),
    h3: (props: any) => (
      <h3 
        className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-3 mt-6" 
        {...props} 
      />
    ),
    p: (props: any) => (
      <p 
        className="text-base text-muted leading-relaxed mb-4" 
        {...props} 
      />
    ),
    ul: (props: any) => (
      <ul 
        className="list-disc list-inside text-muted mb-4 space-y-2" 
        {...props} 
      />
    ),
    ol: (props: any) => (
      <ol 
        className="list-decimal list-inside text-muted mb-4 space-y-2" 
        {...props} 
      />
    ),
    li: (props: any) => (
      <li 
        className="text-base text-muted leading-relaxed" 
        {...props} 
      />
    ),
    blockquote: (props: any) => (
      <blockquote 
        className="border-l-4 border-primary pl-4 py-2 mb-4 italic text-muted" 
        {...props} 
      />
    ),
    code: (props: any) => (
      <code 
        className="bg-card px-2 py-1 rounded text-sm font-mono text-foreground" 
        {...props} 
      />
    ),
    pre: (props: any) => (
      <pre 
        className="bg-card p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm" 
        {...props} 
      />
    ),
    a: ({ href, children, ...props }: any) => {
      const isInternal = href?.startsWith('/') || href?.startsWith('#')
      
      if (isInternal) {
        return (
          <Link 
            href={href || ''} 
            className="text-primary hover:brightness-110 underline underline-offset-4 transition"
            {...props}
          >
            {children}
          </Link>
        )
      }
      
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:brightness-110 underline underline-offset-4 transition"
          {...props}
        >
          {children}
        </a>
      )
    },
    Image: (props: any) => (
      <Image 
        className="rounded-lg my-8" 
        {...props} 
      />
    ),
    hr: (props: any) => (
      <hr 
        className="border-border my-8" 
        {...props} 
      />
    ),
    table: (props: any) => (
      <div className="overflow-x-auto mb-4">
        <table 
          className="min-w-full divide-y divide-border" 
          {...props} 
        />
      </div>
    ),
    th: (props: any) => (
      <th 
        className="px-4 py-2 text-left text-sm font-semibold text-foreground bg-card" 
        {...props} 
      />
    ),
    td: (props: any) => (
      <td 
        className="px-4 py-2 text-sm text-muted border-t border-border" 
        {...props} 
      />
    ),
  }
}
