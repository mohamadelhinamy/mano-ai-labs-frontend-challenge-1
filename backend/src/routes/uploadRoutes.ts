import { Hono } from 'hono';
import { generateMRF, getMRFFile, listMRFFiles, uploadFile } from '../controllers/uploadController.js';

const router = new Hono();

router.post('/upload', uploadFile);
router.post('/generate-mrf', generateMRF);
router.get('/mrf-files', listMRFFiles);
router.get('/mrf-files/:file', getMRFFile);

export default router;
