const fs = require('fs');
const path = require('path');


const logsPath = path.join(__dirname, '../content/logs');

try {
  const logFiles = fs.readdirSync(logsPath);
  const logs = {};

  for (const file of logFiles) {
    if (!file.endsWith('.md')) {
      //enter sub-folder and read all files
      const subFolderDir = path.join(logsPath, file);
      const version = file.replace('.md', '');
      const subFolderFilesArray = [{version: version}];

      const subFolderFiles = fs.readdirSync(subFolderDir);
      subFolderFiles.forEach(subFile => {
        const permalink = `/development-logs/logs/${version}/${subFile.replace(".md", '')}`
        let description = fs.readFileSync(path.join(subFolderDir, subFile), 'utf-8').split('\n')[1];
        let postDate = fs.readFileSync(path.join(subFolderDir, subFile), 'utf-8').split('\n')[2];
        if (description) {
          description = description.replace('description: ', '').replace("\"", "").replace("\"", "").trim();
        }
        if (postDate) {
          postDate = postDate.replace('postDate: ', '').replace("\"", "").replace("\"", "").trim();
        }
        subFolderFilesArray.push({ file: subFile, permalink, description, postDate });
      });

      logs[file] = subFolderFilesArray;
    }

    module.exports = logs;
  }
  console.log(logs)

  console.log('Logs read successfully:', logs);
} catch (error) {
  console.error('Error reading logs:', error);
  module.exports = {};
}