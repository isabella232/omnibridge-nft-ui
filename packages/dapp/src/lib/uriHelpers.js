export const uriToHttp = uri => {
  if (!uri) return '';
  const protocol = uri.split(':')[0].toLowerCase();
  const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
  const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
  switch (protocol) {
    case 'https':
      return uri;
    case 'http':
      return uri;
    case 'ipfs':
      if (hash.startsWith('ipfs')) {
        const newHash = hash.split('/')[1];
        return `https://ipfs.io/ipfs/${newHash}/`;
      }
      return `https://ipfs.io/ipfs/${hash}/`;
    case 'ipns':
      return `https://ipfs.io/ipns/${name}/`;
    default:
      return '';
  }
};

export const uriToHttpAsArray = uri => {
  if (!uri) return [];
  const protocol = uri.split(':')[0].toLowerCase();
  const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
  const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
  switch (protocol) {
    case 'https':
      return [uri];
    case 'http':
      return [`https${uri.substr(4)}`, uri];
    case 'ipfs':
      if (hash.startsWith('ipfs')) {
        const newHash = hash.split('/')[1];
        return [
          `https://cloudflare-ipfs.com/ipfs/${newHash}/`,
          `https://ipfs.io/ipfs/${newHash}/`,
          `https://ipfs.infura.io/ipfs/${newHash}/`,
        ];
      }
      return [
        `https://cloudflare-ipfs.com/ipfs/${hash}/`,
        `https://ipfs.io/ipfs/${hash}/`,
        `https://ipfs.infura.io/ipfs/${hash}/`,
      ];
    case 'ipns':
      return [
        `https://cloudflare-ipfs.com/ipns/${name}/`,
        `https://ipfs.io/ipns/${name}/`,
        `https://ipfs.infura.io/ipns/${name}/`,
      ];
    default:
      return [];
  }
};

const timeoutPromise = (ms, promise) =>
  new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('promise timeout'));
    }, ms);
    promise.then(
      res => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      err => {
        clearTimeout(timeoutId);
        reject(err);
      },
    );
  });

export const fetchImageUri = async tokenUri => {
  try {
    const response = await timeoutPromise(5000, fetch(tokenUri)); // Fetch the resource
    const text = await response.text(); // Parse it as text
    // eslint-ignore-next-line camelcase
    const { image, image_url: imageUrl } = JSON.parse(text); // Try to parse it as json
    if (!image && !imageUrl) throw new Error('Image not found in metadata');
    return image || imageUrl;
  } catch (err) {
    return '';
  }
};
