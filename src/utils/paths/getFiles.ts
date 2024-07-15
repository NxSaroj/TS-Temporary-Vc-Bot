import fs from "node:fs";
import path from "node:path";
const getFiles = (dir: string, nested?: Boolean) => {
  let filePaths: string[] = [];

  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);
  
    if (nested && file.isDirectory()) {
      filePaths.push(filePath);
    } else {
      if (file.isFile()) filePaths.push(filePath);
      
    }
  }
  return filePaths;
};

export { getFiles };
