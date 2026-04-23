import { StatusCodes } from "http-status-codes";
import { Category, Group, Transaction } from "../models/index.js";
import { ReturnResponseError } from "../utils/ReturnResponseError.js";
import { Sequelize } from "sequelize";

//Recupere toutes les transactions//

export async function getAll(req, res) {
    const transactions = await Transaction.findAll({
        where: {
            group_id: req.params.id
        }
    })
    return res.json(transactions);
}

//Supprime une transaction par son id//

export async function deleteById(req, res) {
    const deleted = await Transaction.destroy({ where: { id: req.params.id } });
    if (deleted === 0) {
        throw new ReturnResponseError(StatusCodes.NOT_FOUND, "Transaction not found");
    }
    res.status(StatusCodes.NO_CONTENT).end();
}

//Post une nouvelle transaction//

export async function create(req, res) {
    const amount = Number(req.body.amount);

    if (Number.isNaN(amount) || amount <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Le montant doit être supérieur à 0"
        });
    }

    const transaction = await Transaction.create({
        ...req.body,
        amount
    });

    return res.status(StatusCodes.CREATED).json(transaction);
}

export async function getSumTransac(req, res) {
    const result = await Transaction.findAll({
        attributes: [
            'category_id',
            [ Sequelize.fn('SUM', Sequelize.col('amount')), 'total' ]
        ],
        include: [
            { model: Category, as: 'category', attributes: ['name'] },
            { model: Group, as: 'group', attributes: ['name'] }
        ],
        where : {
            group_id : req.params.groupId
        },
        group: ['category_id', 'group_id', 'category.id', 'group.id']
    });
    return res.json(result)
}