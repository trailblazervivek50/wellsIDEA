import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function startupEvaluationApiPlugin(): Plugin {
  return {
    name: 'startup-evaluation-api-middleware',
    configureServer(server) {
      server.middlewares.use('/api/startup-evaluation', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const input = JSON.parse(body || '{}');
              const { orchestrateStartupEvaluation } = await server.ssrLoadModule(
                './src/agents/evaluationOrchestrator.ts'
              );
              const report = await orchestrateStartupEvaluation(input);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(report));
            } catch (err: any) {
              console.error('Error handling /api/startup-evaluation:', err);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err?.message || 'Evaluation failed' }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), startupEvaluationApiPlugin()],
})
