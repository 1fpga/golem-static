/// Build the `db.json.zip` file.
import { createWriteStream } from 'node:fs';
import fs from 'node:fs/promises';
import archiver from 'archiver';

/**
 *
 * @param {string} dest The destination folder for these files.
 */
export async function build(dest) {
    const db = JSON.parse(await fs.readFile('db.json', 'utf8'));

    await new Promise((resolve, reject) => {
        const output = createWriteStream(`${dest}/db.json.zip`);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', resolve);
        archive.on('error', reject);

        archive.pipe(output);

        archive.append(JSON.stringify(db), { name: 'db.json' });
        archive.finalize();
    });

    // Copy other files.
    await fs.copyFile('1fpga.sh', `${dest}/1fpga.sh`);
}
