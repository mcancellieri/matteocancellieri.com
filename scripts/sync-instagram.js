// scripts/sync-instagram.js
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Instagram Graph API credentials
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

async function downloadImage(url, filepath) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFileSync(filepath, buffer);
}

function extractHashtags(caption) {
    if (!caption) return [];
    const hashtags = caption.match(/#[\w]+/g) || [];
    return hashtags.map(tag => tag.slice(1).toLowerCase());
}

async function getInstagramUserId() {
    // Get the user ID from the access token
    const response = await fetch(
        `https://graph.instagram.com/me?fields=id,username&access_token=${ACCESS_TOKEN}`
    );
    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message);
    }

    return data.id;
}

async function syncInstagram() {
    try {
        console.log('🔄 Getting Instagram user ID...');
        const userId = await getInstagramUserId();

        console.log('🔄 Fetching Instagram posts...');

        // Fetch media using Instagram Graph API
        const response = await fetch(
            `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${ACCESS_TOKEN}`
        );

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        console.log(`📸 Found ${data.data.length} posts`);

        // Create base photos directory
        const photosDir = path.join(__dirname, '../src/photos');
        if (!fs.existsSync(photosDir)) {
            fs.mkdirSync(photosDir, { recursive: true });
        }

        // Process each post
        const metadata = [];

        for (const post of data.data) {
            const hashtags = extractHashtags(post.caption);

            // For videos, use thumbnail; for images/carousels, use media_url
            const imageUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;

            if (!imageUrl) {
                console.log(`⚠️  Skipping post ${post.id} - no image URL`);
                continue;
            }

            // Use first hashtag as category, or 'uncategorized'
            const category = hashtags[0] || 'uncategorized';
            const categoryDir = path.join(photosDir, category);

            if (!fs.existsSync(categoryDir)) {
                fs.mkdirSync(categoryDir, { recursive: true });
            }

            // Create filename from post ID
            const filename = `${post.id}.jpg`;
            const filepath = path.join(categoryDir, filename);

            // Download image if it doesn't exist
            if (!fs.existsSync(filepath)) {
                console.log(`⬇️  Downloading: ${category}/${filename}`);
                await downloadImage(imageUrl, filepath);
            } else {
                console.log(`✓ Already exists: ${category}/${filename}`);
            }

            // Store metadata
            metadata.push({
                id: post.id,
                category,
                hashtags,
                caption: post.caption,
                timestamp: post.timestamp,
                permalink: post.permalink,
                localPath: `photos/${category}/${filename}`,
                mediaType: post.media_type
            });
        }

        // Save metadata JSON
        const metadataPath = path.join(photosDir, 'metadata.json');
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

        console.log('✅ Instagram sync complete!');
        console.log(`📁 Photos organized in: ${photosDir}`);
        console.log(`📊 Metadata saved to: ${metadataPath}`);

    } catch (error) {
        console.error('❌ Error syncing Instagram:', error.message);

        if (error.message.includes('token')) {
            console.error('\n💡 Your access token may have expired or be invalid.');
            console.error('   Get a new token at: https://developers.facebook.com');
        }

        process.exit(1);
    }
}

syncInstagram();