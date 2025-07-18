import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = 'uploads/';
        if (!fs.existsSync(folder)) fs.mkdirSync(folder)
        cb(null, folder)
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLocaleLowerCase();
        const userId = req.params.id;
        const arquivoVelhos = fs.readdirSync('uploads/');
        arquivoVelhos.forEach((file) => {
            if (file.startsWith(`${userId}`)) {
                fs.unlinkSync(`uploads/${file}`)
            }
        });
        cb(null, `${userId}${ext}`);
    },
})

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const altorizados = [".jpg", ".jpeg", ".png", ".webp"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!altorizados.includes(ext)) {
            return cb(new Error('Formato de imagem inválido.'));
        }
        cb(null, true);
    }
})

export default upload