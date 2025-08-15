import express from 'express';
import { createUser, loginUser, logoutUser } from '../app/session.js';
import {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset,
  uploadAsset,
  getAssetsByPlaylist,
  addAssetToPlaylist,
  removeAssetFromPlaylist
} from '../app/assets.js';
import {
  index as getPlaylists,
  getPlaylist,
  createPlaylist,
  savePlaylist
} from '../app/playlists.js';
import {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  deployGroup
} from '../app/groups.js';
import { uploadAssets } from './multer.js';
import { requireAuth, optionalAuth } from './auth.js';

const router = express.Router();

// Public routes (no auth required)
router.post('/api/signup', createUser);
router.post('/api/register', createUser); // Alias for signup
router.post('/api/login', loginUser);
router.post('/api/logout', logoutUser);

// Health check (public)
router.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Protected routes (auth required)
router.get('/api/user', requireAuth, (req, res) => {
    res.json(req.user);
});

// Asset routes (all protected)
router.get('/api/assets', requireAuth, getAssets);
router.get('/api/assets/file/:filename', requireAuth, getAsset);
router.post('/api/assets', requireAuth, createAsset);
router.put('/api/assets/:id', requireAuth, updateAsset);
router.delete('/api/assets/file/:filename', requireAuth, deleteAsset);
router.post('/api/assets/upload', requireAuth, uploadAssets, uploadAsset);
router.get('/api/assets/playlist/:playlist', requireAuth, getAssetsByPlaylist);
router.post('/api/assets/playlist/add', requireAuth, addAssetToPlaylist);
router.post('/api/assets/playlist/remove', requireAuth, removeAssetFromPlaylist);

// Playlist routes (all protected)
router.get('/api/playlists', requireAuth, getPlaylists);
router.get('/api/playlists/:file', requireAuth, getPlaylist);
router.post('/api/playlists', requireAuth, createPlaylist);
router.put('/api/playlists/:file', requireAuth, savePlaylist);

// Group routes (all protected)
router.get('/api/groups', requireAuth, getGroups);
router.get('/api/groups/:id', requireAuth, getGroup);
router.post('/api/groups', requireAuth, createGroup);
router.put('/api/groups/:id', requireAuth, updateGroup);
router.delete('/api/groups/:id', requireAuth, deleteGroup);
router.post('/api/groups/:id/deploy', requireAuth, deployGroup);

// Root route
router.get('/', (req, res) => {
  res.send('PiSignage API Server');
});

export default router;