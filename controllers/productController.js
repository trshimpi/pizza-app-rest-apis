import { Product } from "../models";
import multer from "multer";
import path from 'path';
import CustomeErrorHandler from "../services/CustomeErrorHandler";
import Joi from 'joi';
import fs from 'fs';
import productSchema from '../validators/productValidator';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    },
});

const handleMultipartData = multer({
    storage,
    limits: { fileSize: 1000000 * 5 },
}).single('image'); // 5mb

const productController = {
    async store(req,res,next){
        // multipart form data (image is also included and processed with multer)
        handleMultipartData(req,res,async (err)=>{
            if(err){
                return next(CustomeErrorHandler.serverError(err.message));
            }
            console.log(req.file);
            const filepath = req.file.path;
            
            // validation
            const { error } = productSchema.validate(req.body);
            if(error){
                // if there is error in data ,delete the uploaded image
                fs.unlink(`${appRoot}/${filepath}` , (err)=> {
                    if(err){
                        return next(CustomeErrorHandler.serverError(err.message));
                    }
                });
                return next(error)
            }

            const { name , price , size } = req.body;

            let document;

            try{
                document = await Product.create({
                    name,
                    price,
                    size,
                    image : filepath
                })
            }catch(err){
                return next(err);
            }
            res.status(201).json(document);
            
        });

    },

    async update(req,res,next){
        // multipart form data (image is also included and processed with multer)
        handleMultipartData(req,res,async (err)=>{
            if(err){
                return next(CustomeErrorHandler.serverError(err.message));
            }
            let filepath;
            if(req.file){
                filepath = req.file.path;
            }
               
            // validation 
            const { error } = productSchema.validate(req.body);
            
            if(error){
                if(req.file){
                    // if there is error in data ,delete the uploaded image
                    fs.unlink(`${appRoot}/${filepath}` , (err)=> {
                        if(err){
                            return next(CustomeErrorHandler.serverError(err.message));
                        }
                    });
                }

                return next(error)
            }

            const { name , price , size } = req.body;

            let document;

            try{
                // last argument new:true returns the updated document
                document = await Product.findOneAndUpdate({_id:req.params.id},{
                    name,
                    price,
                    size,
                    ...(req.file && {image : filepath} )
                    
                },{ new: true });

            }catch(err){
                return next(err);
            }
            res.status(201).json(document);
            
        });

    },

    async destroy(req,res,next){
        // this will return the deleted document
        const document = await Product.findOneAndRemove({_id:req.params.id});
        if(!document){
            return next(new Error('Nothing to delete'))
        }

        // delete the image after deleting the document
        //_doc will give original doc inside all the docs without any getters 
        // here product model have getter to modify image path hence we used _doc to get the original path before deleting
        
        const imagePath = document._doc.image; 
        fs.unlink(`${appRoot}/${imagePath}` ,(err)=>{
            if(err){
                return next(CustomeErrorHandler.serverError());
            }
            return res.json(document);
        });
        
    },

    async index(req,res,next){
        let documents;
        // pagination mongoose.pagination can be used here
        try{
            documents = await Product.find().select('-updatedAt -__v').sort({ _id : -1});
             
        }catch(err){
            return next(CustomeErrorHandler.serverError());
        }
        return res.json(documents);
    },

    async show(req, res, next){
        let document;
        try{
            document = await Product.findOne({ _id: req.params.id }).select('-updatedAt -__v');
        }catch(err){
            return next(CustomeErrorHandler.serverError())
        }

        return res.json(document);
    }
}

export default productController;