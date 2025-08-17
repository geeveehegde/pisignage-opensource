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

// Routes with optional auth
router.get('/api/user', optionalAuth, (req, res) => {
    res.json(req.user);
});

// Asset routes (all with optional auth)
router.get('/api/assets', optionalAuth, getAssets);
router.get('/api/assets/file/:filename', optionalAuth, getAsset);
router.post('/api/assets', optionalAuth, createAsset);
router.put('/api/assets/:id', optionalAuth, updateAsset);
router.delete('/api/assets/file/:filename', optionalAuth, deleteAsset);
router.post('/api/assets/upload', optionalAuth, uploadAssets, uploadAsset);
router.get('/api/assets/playlist/:playlist', optionalAuth, getAssetsByPlaylist);
router.post('/api/assets/playlist/add', optionalAuth, addAssetToPlaylist);
router.post('/api/assets/playlist/remove', optionalAuth, removeAssetFromPlaylist);

// Playlist routes (all with optional auth)
router.get('/api/playlists', optionalAuth, getPlaylists);
router.post('/api/playlists', optionalAuth, createPlaylist);
router.get('/api/playlists/:file', optionalAuth, getPlaylist);
router.put('/api/playlists/:file', optionalAuth, savePlaylist);

// Group routes (all with optional auth)
router.get('/api/groups', optionalAuth, getGroups);
router.get('/api/groups/:id', optionalAuth, getGroup);
router.post('/api/groups', optionalAuth, createGroup);
router.put('/api/groups/:id', optionalAuth, updateGroup);
router.delete('/api/groups/:id', optionalAuth, deleteGroup);
router.post('/api/groups/:id/deploy', optionalAuth, deployGroup);

// Root route
router.get('/', (req, res) => {
  res.send('PiSignage API Server');
});

export default router;