/* eslint-disable import/no-extraneous-dependencies */
import glob from "fast-glob";
import { resolve, dirname, basename, join } from "node:path";
import { copyFile, mkdir, writeFile } from "node:fs/promises";

/**
 * Options for copying files or directories.
 */
interface CopyOption {
  /**
   * The current working directory to use for the copy operation.
   * If not specified, the default is the process's current working directory.
   */
  cwd?: string;

  /**
   * A function to rename the copied file or directory.
   * It receives the basename of the file or directory and should return the new name.
   *
   * @param basename - The original basename of the file or directory.
   * @returns The new name for the file or directory.
   */
  rename?: (basename: string) => string;

  /**
   * Whether to preserve the directory structure when copying.
   * If true, the directory structure will be preserved.
   * If false or not specified, the files will be copied without preserving the directory structure.
   */
  parents?: boolean;

  /**
   * A function to filter which files or directories should be copied.
   * It receives the name of the file or directory and should return true to include it in the copy, or false to exclude it.
   *
   * @param name - The name of the file or directory.
   * @returns A boolean indicating whether the file or directory should be copied.
   */
  filter?: (name: string) => boolean;
}

const identity = (x: string) => x;

/**
 * Copies files from the source(s) to the destination directory.
 *
 * @param src - A single source path or an array of source paths to copy.
 * @param dest - The destination directory where the files will be copied.
 * @param options - Options for copying files.
 * @param options.cwd - The current working directory to resolve relative paths.
 * @param options.rename - A function to rename the basename of each file.
 * @param options.parents - Whether to preserve the directory structure of the source files.
 *
 * @throws {TypeError} If `src` or `dest` is not provided.
 *
 * @example
 * ```typescript
 * await copyFiles('src/file.txt', 'dest');
 * await copyFiles(['src/file1.txt', 'src/file2.txt'], 'dest', { cwd: process.cwd(), rename: (name) => `new_${name}` });
 * ```
 */
export const copyFiles = async (
  src: string | string[],
  dest: string,
  { cwd, rename = identity, parents = true, filter }: CopyOption = {}
) => {
  const source = typeof src === "string" ? [src] : src;

  if (source.length === 0 || !dest) {
    throw new TypeError("`src` and `dest` are required");
  }

  const sourceFiles = await glob.glob(source, {
    cwd,
    dot: true,
    absolute: false,
    stats: false,
  });

  const destRelativeToCwd = cwd ? resolve(cwd, dest) : dest;

  return Promise.all(
    sourceFiles.map(async (p) => {
      const dirName = dirname(p);
      const baseName = rename(basename(p));

      const from = cwd ? resolve(cwd, p) : p;
      const to = parents
        ? join(destRelativeToCwd, dirName, baseName)
        : join(destRelativeToCwd, baseName);

      if (filter && !filter(p)) {
        return;
      }

      // Ensure the destination directory exists
      await mkdir(dirname(to), { recursive: true });

      return copyFile(from, to);
    })
  );
};

/**
 * Creates files from templates and writes them to the destination directory.
 *
 * @param templates - An object where the keys are file paths and the values are the file contents.
 * @param dest - The destination directory where the files will be created.
 * @param options - Options for creating files.
 * @param options.cwd - The current working directory to resolve relative paths.
 * @param options.parents - Whether to preserve the directory structure of the template files.
 *
 * @throws {TypeError} If `templates` or `dest` is not provided.
 *
 * @example
 * ```typescript
 * const templates = {
 *   'file1.txt': 'Content for file 1',
 *   'dir/file2.txt': 'Content for file 2'
 * };
 * await createFilesFromTemplates(templates, 'dest');
 * await createFilesFromTemplates(templates, 'dest', { cwd: process.cwd(), parents: false });
 * ```
 */
export const createFilesFromTemplates = async (
  templates: { [filePath: string]: string },
  dest: string,
  { cwd, parents = true }: CopyOption = {}
) => {
  if (!templates || Object.keys(templates).length === 0 || !dest) {
    throw new TypeError("`templates` and `dest` are required");
  }

  const destRelativeToCwd = cwd ? resolve(cwd, dest) : dest;

  return Promise.all(
    Object.entries(templates).map(async ([filePath, content]) => {
      const dirName = dirname(filePath);
      const baseName = basename(filePath);

      const to = parents
        ? join(destRelativeToCwd, dirName, baseName)
        : join(destRelativeToCwd, baseName);

      // Ensure the destination directory exists
      await mkdir(dirname(to), { recursive: true });

      // Write the content to the file
      await writeFile(to, content, "utf8");
    })
  );
};
