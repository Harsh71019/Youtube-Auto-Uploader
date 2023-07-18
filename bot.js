const fs = require('fs');
const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');

// YouTube API credentials
// const credentials = {
//   client_secret: 'YOUR_CLIENT_SECRET',
//   client_id: 'YOUR_CLIENT_ID',
//   redirect_uris: ['YOUR_REDIRECT_URI'],
//   token: 'YOUR_TOKEN',
// };

// Folder path where the Shorts are located
const folderPath = '../Valoshorts';

// Titles and descriptions array
const videosData = [
  { title: 'Insane Killstreak', description: '#shorts' },
  { title: 'Spectacular Headshots', description: '#shorts' },
  // { title: 'Intense 1v1 Battles', description: '#shorts' },
  // { title: 'Epic Comebacks', description: '#shorts' },
  // { title: 'Impressive Wallbangs', description: '#shorts' },
  // { title: 'Mind-blowing Reflexes', description: '#shorts' },
  // { title: 'Perfectly Timed Ultimates', description: '#shorts' },
  // { title: 'Aerial Acrobatics', description: '#shorts' },
  // { title: 'Strategic Bomb Defuses', description: '#shorts' },
  // { title: 'Clutch Knife Kills', description: '#shorts' },
];

// Upload YouTube Short
async function uploadShort(auth, videoData, filePath) {
  const youtube = google.youtube({ version: 'v3', auth });

  const requestParameters = {
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title: videoData.title,
        description: videoData.description,
      },
      status: {
        privacyStatus: 'public',
      },
    },
    media: {
      body: fs.createReadStream(filePath),
    },
  };

  try {
    const response = await youtube.videos.insert(requestParameters, {
      media: {
        mimeType: 'video/*',
      },
    });

    console.log(`Video uploaded: ${response.data.id}`);
  } catch (error) {
    console.error(`Error uploading video: ${error}`);
  }
}

// Authenticate with YouTube API
async function authenticateAndUpload() {
  try {
    const auth = await authenticate({
      keyfilePath: '', // Path to your credentials JSON file
      scopes: ['https://www.googleapis.com/auth/youtube.upload'],
    });

    for (let i = 0; i < videosData.length; i++) {
      const videoData = videosData[i];
      const filePath = `${folderPath}/video${i + 1}.mp4`;

      console.log(`Uploading video ${i + 1}...`);
      await uploadShort(auth, videoData, filePath);
    }
  } catch (error) {
    console.error(`Error authenticating: ${error}`);
  }
}

// Start the script
console.log('Starting YouTube Shorts upload...');
authenticateAndUpload();
