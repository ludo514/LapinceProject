import { StatusCodes } from "http-status-codes";
import { Category } from "../models/index.js";
import { ReturnResponseError } from "../utils/ReturnResponseError.js";

//Recupere toutes les categories//

export async function getAll(req, res) {
    const categories = await Category.findAll()
    return res.json(categories);
}

//Recupere une categorie par son id//

export async function getById(req, res) {
    const categorie = await Category.findByPk(req.params.id);
    if (!categorie) {
        throw new ReturnResponseError(StatusCodes.NOT_FOUND, "Category not found");
    }
    return res.json(categorie);
}

//Supprime une categorie par son id//

export async function deleteById(req, res) {
    const deleted = await Category.destroy({ where: { id: req.params.id } });
    if (deleted === 0) {
        throw new ReturnResponseError(StatusCodes.NOT_FOUND, "Category not found");
    }
    res.status(StatusCodes.NO_CONTENT).end();
}

//Post une nouvelle categorie//

export async function create(req, res) {
    const categorie = await Category.create(req.body);

    res.status(201).json(categorie);
}
