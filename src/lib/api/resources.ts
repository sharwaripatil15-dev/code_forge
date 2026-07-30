export interface DeveloperResource {
  title: string;
  category: 'Official Docs' | 'Interactive Tutorial' | 'Video Course' | 'Architecture Guide';
  description: string;
  url: string;
  provider: string;
}

export function fetchLearningResources(techStackNames: string[], domain: string): DeveloperResource[] {
  const resources: DeveloperResource[] = [];
  const joinedTech = techStackNames.join(' ').toLowerCase();

  // Next.js App Router
  if (joinedTech.includes('next') || joinedTech.includes('react')) {
    resources.push({
      title: 'Next.js 14 App Router Documentation',
      category: 'Official Docs',
      description: 'Official guide on Server Components, Server Actions, and Routing in Next.js 14.',
      url: 'https://nextjs.org/docs/app',
      provider: 'Vercel / Next.js',
    });
  }

  // Supabase / Postgres / Vector
  if (joinedTech.includes('supabase') || joinedTech.includes('postgres') || joinedTech.includes('pgvector')) {
    resources.push({
      title: 'Supabase Vector Database & pgvector Guide',
      category: 'Official Docs',
      description: 'Official documentation for managing embeddings and vector indexes with pgvector in Supabase.',
      url: 'https://supabase.com/docs/guides/database/extensions/pgvector',
      provider: 'Supabase',
    });
  }

  // Web-Tree-Sitter / WASM / AST
  if (joinedTech.includes('tree-sitter') || joinedTech.includes('wasm') || joinedTech.includes('ast')) {
    resources.push({
      title: 'Web-Tree-Sitter WebAssembly API Reference',
      category: 'Official Docs',
      description: 'Official Tree-sitter guide for running AST syntax parsers inside browser WASM environments.',
      url: 'https://github.com/tree-sitter/tree-sitter/tree/master/lib/binding_web',
      provider: 'Tree-sitter Team',
    });
  }

  // Tailwind CSS
  if (joinedTech.includes('tailwind') || joinedTech.includes('css')) {
    resources.push({
      title: 'Tailwind CSS Documentation & Utility Reference',
      category: 'Official Docs',
      description: 'Official Tailwind CSS documentation for responsive layouts and custom themes.',
      url: 'https://tailwindcss.com/docs',
      provider: 'Tailwind Labs',
    });
  }

  // Python / FastAPI / PyTorch
  if (joinedTech.includes('fastapi') || joinedTech.includes('python')) {
    resources.push({
      title: 'FastAPI Interactive Tutorial & User Guide',
      category: 'Interactive Tutorial',
      description: 'Official FastAPI tutorial for high-performance Python web APIs with automatic OpenAPI specs.',
      url: 'https://fastapi.tiangolo.com/tutorial/',
      provider: 'FastAPI / Tiangolo',
    });
  }

  // Hugging Face
  if (joinedTech.includes('hugging') || joinedTech.includes('transformers') || joinedTech.includes('model')) {
    resources.push({
      title: 'Hugging Face Datasets & Transformers Documentation',
      category: 'Official Docs',
      description: 'Official Hugging Face documentation for loading datasets and fine-tuning transformers.',
      url: 'https://huggingface.co/docs/datasets',
      provider: 'Hugging Face',
    });
  }

  // Fallback defaults if fewer than 3 matched
  if (resources.length < 3) {
    resources.push({
      title: 'MDN Web Docs: Modern JavaScript & Async Web APIs',
      category: 'Official Docs',
      description: 'Comprehensive documentation for ES6+, Fetch API, Promises, and WebAssembly.',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      provider: 'Mozilla Developer Network',
    });
    resources.push({
      title: 'GitHub Developer REST API & Webhooks Guide',
      category: 'Official Docs',
      description: 'Official REST and GraphQL API reference for building GitHub apps and webhooks.',
      url: 'https://docs.github.com/en/rest',
      provider: 'GitHub',
    });
  }

  return resources.slice(0, 4);
}
