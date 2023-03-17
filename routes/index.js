import express from 'express';
import { registerController  , loginController , userController , refreshController , productController } from '../controllers';
import adminMiddleware from '../middlewares/adminMiddleware';
import authorizationMiddleware from '../middlewares/authorizationMiddleware';


const router = express.Router();

router.post('/register',registerController.register);
router.post('/login',loginController.login);
router.get('/me', authorizationMiddleware , userController.me);
router.post('/refresh', refreshController.refresh );
router.post('/logout', authorizationMiddleware , loginController.logout );

router.post('/products', [authorizationMiddleware , adminMiddleware ], productController.store);
router.put('/products/:id', [authorizationMiddleware , adminMiddleware ], productController.update);
router.delete('/products/:id', [authorizationMiddleware , adminMiddleware ], productController.destroy);
router.get('/products', productController.index);
router.get("/products/:id" , productController.show)


export default router;