// IPFS helper functions for uploading files to Pinata
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;
const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

export interface IPFSUploadResult {
  ipfsHash: string;
  ipfsUri: string;
  gatewayUrl: string;
}

export async function uploadImageToIPFS(imageBuffer: Buffer, filename: string): Promise<string> {
  try {
    console.log('📤 Uploading image to Pinata IPFS...');
    
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      throw new Error('Pinata API credentials not provided. Please set VITE_PINATA_API_KEY and VITE_PINATA_SECRET_KEY environment variables.');
    }
    
    // Create FormData for Pinata API
    const formData = new FormData();
    formData.append('file', new Blob([new Uint8Array(imageBuffer)]), filename);
    
    // Pinata metadata
    const pinataMetadata = {
      name: `image-${Date.now()}`,
      keyvalues: {
        type: 'zora-coin-image',
        filename: filename,
        timestamp: new Date().toISOString()
      }
    };
    formData.append('pinataMetadata', JSON.stringify(pinataMetadata));
    
    // Pinata options
    const pinataOptions = {
      cidVersion: 1
    };
    formData.append('pinataOptions', JSON.stringify(pinataOptions));
    
    // Upload to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pinata upload failed: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    const ipfsHash = result.IpfsHash;
    
    console.log('✅ Image uploaded to Pinata IPFS successfully');
    console.log('IPFS Hash:', ipfsHash);
    console.log('IPFS URI:', `ipfs://${ipfsHash}`);
    console.log('Pinata Gateway URL:', `${PINATA_GATEWAY}${ipfsHash}`);
    
    return `ipfs://${ipfsHash}`;
    
  } catch (error) {
    console.error('❌ Error uploading image to Pinata IPFS:', error);
    throw error;
  }
}

export async function uploadFileToIPFS(file: File): Promise<IPFSUploadResult> {
  try {
    console.log('📤 Uploading file to Pinata IPFS...', file.name);
    
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      throw new Error('Pinata API credentials not provided. Please set VITE_PINATA_API_KEY and VITE_PINATA_SECRET_KEY environment variables.');
    }
    
    // Create FormData for Pinata API
    const formData = new FormData();
    formData.append('file', file);
    
    // Pinata metadata
    const pinataMetadata = {
      name: `file-${Date.now()}`,
      keyvalues: {
        type: 'collab-media',
        filename: file.name,
        fileType: file.type,
        timestamp: new Date().toISOString()
      }
    };
    formData.append('pinataMetadata', JSON.stringify(pinataMetadata));
    
    // Pinata options
    const pinataOptions = {
      cidVersion: 1
    };
    formData.append('pinataOptions', JSON.stringify(pinataOptions));
    
    // Upload to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pinata upload failed: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    const ipfsHash = result.IpfsHash;
    const ipfsUri = `ipfs://${ipfsHash}`;
    const gatewayUrl = `${PINATA_GATEWAY}${ipfsHash}`;
    
    console.log('✅ File uploaded to Pinata IPFS successfully');
    console.log('IPFS Hash:', ipfsHash);
    console.log('IPFS URI:', ipfsUri);
    console.log('Gateway URL:', gatewayUrl);
    
    return {
      ipfsHash,
      ipfsUri,
      gatewayUrl
    };
    
  } catch (error) {
    console.error('❌ Error uploading file to Pinata IPFS:', error);
    throw error;
  }
}

export function getIPFSGatewayUrl(ipfsHash: string): string {
  return `${PINATA_GATEWAY}${ipfsHash}`;
}

export function isValidIPFSHash(hash: string): boolean {
  // Basic validation for IPFS hash format
  return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash) || /^bafybei[a-z2-7]{52}$/.test(hash);
}
