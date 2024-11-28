import type { APIRoute } from 'astro';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const image = formData.get('image') as File;

        if (!image) {
            return new Response('No image file was uploaded.', { status: 400 });
        }

        const buffer = Buffer.from(await image.arrayBuffer());
        const tempDir = os.tmpdir();
        const inputPath = path.join(tempDir, `${Date.now()}-${image.name}`);
        const outputPath = path.join(tempDir, `${Date.now()}-output.png`);

        // Save input file
        await fs.writeFile(inputPath, buffer);

        // Get the absolute path to the Python script
        const scriptPath = fileURLToPath(new URL('../../python/remove_bg.py', import.meta.url));

        // Run Python script
        const python = spawn('python', [scriptPath, inputPath, outputPath]);

        return new Promise((resolve) => {
            python.stdout.on('data', (data) => {
                console.log(`Python stdout: ${data}`);
            });

            python.stderr.on('data', (data) => {
                console.error(`Python stderr: ${data}`);
            });

            python.on('close', async (code) => {
                try {
                    // Clean up input file
                    await fs.unlink(inputPath);

                    if (code === 0) {
                        const outputBuffer = await fs.readFile(outputPath);
                        // Clean up output file
                        await fs.unlink(outputPath);

                        resolve(new Response(outputBuffer, {
                            status: 200,
                            headers: {
                                'Content-Type': 'image/png'
                            }
                        }));
                    } else {
                        resolve(new Response('Failed to process the image.', { status: 500 }));
                    }
                } catch (error) {
                    console.error('Error:', error);
                    resolve(new Response('Error processing image.', { status: 500 }));
                }
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        return new Response('Server error', { status: 500 });
    }
}

