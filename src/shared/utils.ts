import base64js from "base64-js"

export interface LocalFile {
  path: string;
  read: () => Promise<string>
}

export interface AddonInfo {
  id: string;
  version: string;
}

function readFileContent(file: Blob): Promise<string> {
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

function b64DecodeUnicode(str: string): string {
  return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
}

export function loadDirectory(fileList: FileList): LocalFile[] {
  return Array.from(fileList)
      .map((file: File) => ({
        path: file.webkitRelativePath.substring(file.webkitRelativePath.indexOf("/") + 1),
        read: () => readFileContent(file)
      }))
      .filter(x => !x.path.startsWith(".git/"))
}

export async function readAddonInfo(files: LocalFile[]): Promise<AddonInfo> {
  const addonXml = files.find((file: any) => file.path === "addon.xml");
  if (!addonXml) {
    throw new Error("Could not find addon.xml");
  }
  const contentEncoded = await addonXml.read();
  const content = b64DecodeUnicode(contentEncoded);
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(content, "text/xml");
  const addonElem = xmlDoc.getElementsByTagName("addon")[0];
  const id = addonElem.getAttribute("id") || "";
  const version = addonElem.getAttribute("version") || "";
  return {id, version};
};

export async function pushAddon(
    repo: any,
    headSha: string,
    destDir: string,
    files: LocalFile[],
    message: string,
    progressCallback: (message: string) => void = () => {},
  ) {

  const baseTree = await repo.git.trees(headSha).fetch()

  // Remove existing files 
  baseTree.tree = baseTree.tree.filter(x => x.path !== destDir)

  // Add new file
  for (const file of files) {
    progressCallback(`Uploading ${file.path} ...`);
    const content = await file.read();
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
