import { Router } from 'express'
import FileController from './controllers/file-controller'
import UserController from './controllers/user-controller'
import FolderController from './controllers/folder-controller'
import uploads from './util/upload'

const router = Router()

// FILE CONTROLLER
router.get('/', FileController.index)
router.post('/upload', uploads.single('file'), FileController.upload)
// router.post('/createFolder', FileController.createFolder)

// USER CONTROLLER
router.post('/createUser', UserController.createUser)
router.post('/getUserByEmail', UserController.getUserByEmail)
router.post('/login', UserController.login)
router.post('/loginFacebook', UserController.loginFacebook)

// FOLDER CONTROLLER
router.post('/createFolder', FolderController.createFolder)
router.get('/getFolders', FolderController.getFolders)
router.post('/deleteFolder', FolderController.deleteFolder)

export default router
