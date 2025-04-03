import { Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { platform } from 'os';

const router = Router();

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Determine the correct Python command based on the OS
    const isWindows = platform() === 'win32';
    const pythonCommand = isWindows ? 'python' : './venv/bin/python';

    // Call the Python script using the provided tools
    const pythonProcess = spawn(
      pythonCommand,
      [
        path.join(__dirname, '../../../tools/llm_api.py'),
        '--prompt', `${context}\n\nUser: ${message}\n\nAssistant:`,
        '--provider', 'local'  // Use local Qwen model
      ],
      {
        env: {
          ...process.env,
          PYTHONPATH: path.join(__dirname, '../../..'),  // Add root directory to Python path
        }
      }
    );

    let responseData = '';
    let errorData = '';
    let hasResponded = false;

    pythonProcess.stdout.on('data', (data) => {
      responseData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      console.error('LLM Error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (hasResponded) return;

      if (code !== 0) {
        console.error('Process exited with code:', code);
        console.error('Error output:', errorData);
        hasResponded = true;
        return res.status(500).json({ 
          error: 'Failed to get response from AI',
          details: errorData
        });
      }

      try {
        // Clean up the response
        const cleanResponse = responseData.trim()
          .replace(/^Assistant:\s*/i, '')  // Remove "Assistant:" prefix if present
          .replace(/^"/, '')  // Remove leading quote if present
          .replace(/"$/, ''); // Remove trailing quote if present

        hasResponded = true;
        res.json({ response: cleanResponse });
      } catch (error) {
        console.error('Response parsing error:', error);
        if (!hasResponded) {
          hasResponded = true;
          res.status(500).json({ 
            error: 'Failed to parse AI response',
            details: error.message
          });
        }
      }
    });

    // Handle process errors
    pythonProcess.on('error', (error) => {
      console.error('Process error:', error);
      if (!hasResponded) {
        hasResponded = true;
        res.status(500).json({ 
          error: 'Failed to start AI process',
          details: error.message
        });
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

export const chatRoutes = router; 