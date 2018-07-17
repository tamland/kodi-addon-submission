import base64js from "base64-js"

export async function readFileContent(file: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const arr = new Uint8Array(event.target.result);
        const encoded = base64js.fromByteArray(arr)
        resolve(encoded);
      };
      reader.readAsArrayBuffer(file);
  });
}

export interface AddonInfo {
  id: string;
  version: string;
}

export async function readAddonInfo(file: Blob): Promise<AddonInfo> {
  return new Promise<AddonInfo>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      try {
        const parser = new DOMParser();
        var xmlDoc = parser.parseFromString(event.target.result, "text/xml");
        const addonElem = xmlDoc.getElementsByTagName("addon")[0];
        const id = addonElem.getAttribute("id") || "";
        const version = addonElem.getAttribute("version") || "";
        resolve({id, version});
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
}

export async function pushAddon(
    repo: any,
    headSha: string,
    destDir: string,
    files: {path: string, blob: Blob}[],
    message: string,
    progressCallback: (message: string) => void = () => {},
  ) {

  const baseTree = await repo.git.trees(headSha).fetch()

  // Remove existing files 
  baseTree.tree = baseTree.tree.filter(x => x.path !== destDir)

  // Add new file
  for (const file of files) {
    progressCallback(`Uploading ${file.path} ...`);
    const content = await readFileContent(file.blob)
    const blob = await repo.git.blobs.create({content: content, encoding: "base64"})
    baseTree.tree.push({
        path: `${destDir}/${file.path}`,
        mode: '100644',
        type: 'blob',
        sha: blob.sha
    })
  }

  console.log(baseTree)

  // Create new tree
  const tree = await repo.git.trees.create({ tree: baseTree.tree })
  
  // Commit
  const commit = await repo.git.commits.create({
      message: message,
      tree: tree.sha,
      parents: [
        headSha
      ]
  });

  const targetRef = `refs/heads/${destDir}`;
  
  const newHead = await repo.git.refs.create({ ref: targetRef, sha: commit.sha })
    .catch(err => {
      return repo.git(targetRef).update({
        sha: commit.sha,
        force: true,
      })
    });
  
  console.log(newHead)
  return newHead
}
