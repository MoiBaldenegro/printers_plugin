import * as path from 'path';
export async function getIMagePath(imageName: string) {
  const imagePath = path.join(
    process.cwd(),
    `resources/app.asar.unpacked/tassets/${imageName}`,
  );
  return imagePath;
}
