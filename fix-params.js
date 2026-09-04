const fs = require('fs');
const path = require('path');

function walk(d) {
  fs.readdirSync(d).forEach(f => {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('route.ts')) {
      let c = fs.readFileSync(p, 'utf8');
      
      let modified = false;
      if (c.includes('params }: { params: { id: string')) {
        c = c.replace(/\{\s*params\s*\}:\s*\{\s*params:\s*\{\s*id:\s*string;?\s*\}\s*;?\s*\}/g, 'context: { params: Promise<{ id: string }> }');
        
        c = c.replace(/export async function (GET|POST|PATCH|DELETE|PUT)\((request|req): Request, context: \{ params: Promise<\{ id: string \}> \}\) \{/g, 
          'export async function $1($2: Request, context: { params: Promise<{ id: string }> }) {\n  const params = await context.params;\n  const { id } = params;');
          
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(p, c);
        console.log(`Updated ${p}`);
      }
    }
  });
}

walk('c:/Users/injma/OneDrive/Desktop/Foods/savor/src/app/api');
